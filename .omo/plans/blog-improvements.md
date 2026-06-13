# Blog Refactor Work Plan — TDD-Oriented, Multi-Wave Execution

> **Stack:** TanStack Start 1.132 · D1 SQLite · EditorJS 2.31 · Zod 4.1 · react-hook-form 7.66 · Tailwind 4 · Vitest + Playwright · TypeScript strict
> **Date:** 2026-06-13
> **Baseline:** 23 test files · 157 tests · 100% green
> **Source analysis:** [.omo/plans/blog-analysis.md](./blog-analysis.md)

---

## 0. Hard Constraints (every task must respect)

1. **23 test files / 157 tests must remain green** after every wave.
2. **D1 in production** — schema changes must be additive (`ALTER TABLE ADD COLUMN`, no `DROP COLUMN` on existing fields, no `DROP TABLE`).
3. **SSR is a goal** for `/blog/$slug` — content must be in the initial HTML payload.
4. **DB stores `content TEXT` and `tags TEXT` as JSON strings** — centralize parse/stringify in the repository so callers never deal with raw strings.
5. **EditorJS is ~200 KB** and currently client-loaded for every post view — eliminate it from the read path; keep it in the admin only.
6. **Test mocks use `vi.mock("@/data/post-paginated")` and `vi.mock("@/data/post-create")`** — keep those exact module paths via re-export shims.

---

## 1. Architecture Decisions

### Q1. Data layer: single file vs split folder?
**→ Split into `src/data/posts/{schemas,parse,repository,server,index}.ts`**

### Q2. SSR: parse JSON on every read, or store HTML?
**→ (B) store `content_html TEXT` alongside `content TEXT` (JSON), populate on INSERT/UPDATE.** Plus (A) as a *fallback* in `lib/editorJsServer.ts` for legacy rows.

### Q3. Schema migration?
**→** `database/migrations/0001_add_cms_fields.sql` (idempotent ALTER TABLE) + update `database/schema.sql` for fresh installs. Sync check via `scripts/check-schema-sync.sh`.

### Q4. Test refactor strategy?
**→** Keep `vi.mock("@/data/post-paginated", …)` paths via 1-line named re-exports from `src/data/post-paginated.ts` → `@/data/posts/server`.

### Q5. EditorJS types without `@ts-nocheck`?
**→** Use `ToolConstructable` from `@editorjs/editorjs` + `as ToolConstructable` cast per tool.

### Q6. AdminPostForm: use `react-hook-form`?
**→ Yes**, with `register()` (not `<Controller>`). Survives the existing label-name tests.

### Q7. Slug uniqueness?
**→** Catch `UNIQUE constraint failed: post.slug` and return typed `{ success: false, code: "SLUG_COLLISION" }`. No pre-check (race condition).

### Q8. Pagination state?
**→** Keep search-param shape; consolidate handlers in new `src/hooks/usePostSearch.ts`.

---

## 2. Task Dependency Graph

| Task | Title | Depends | Blocks | Category | Skills |
|---|---|---|---|---|---|
| W1.1 | `lib/slugify.ts` + tests | — | W2.4 | quick | — |
| W1.2 | `lib/editorJsServer.ts` + tests | — | W1.5, W3.1 | unspecified-high | — |
| W1.3 | `data/posts/schemas.ts` + tests | — | W2.1 | quick | — |
| W1.4 | `data/posts/parse.ts` + tests | — | W2.1 | quick | — |
| W1.5 | DB migration `0001` + schema sync | W1.2 | W2.1 | unspecified-low | wrangler |
| W1.6 | Lint cruft cleanup | — | W2.2, W2.4 | quick | — |
| W2.1 | `data/posts/repository.ts` + tests | W1.3, W1.4, W1.5 | W2.2 | deep | workers-best-practices |
| W2.2 | `data/posts/server.ts` + shims | W2.1 | W2.4, W3.1, W3.2 | unspecified-low | — |
| W2.3 | `hooks/usePostSearch.ts` + tests | — | W3.2 | quick | — |
| W2.4 | `AdminPostForm` RHF refactor | W1.1, W1.6, W2.2 | W3.4 | unspecified-high | vercel-react-best-practices |
| W3.1 | `/blog/$slug` SSR + `notFound()` | W1.2, W2.2, W3.3 | W3.4, W4.2 | deep | vercel-react-best-practices |
| W3.2 | `/blog` index refactor | W2.2, W2.3, W3.3 | — | quick | — |
| W3.3 | `lib/routes.ts` constants | — | W3.1, W3.2 | quick | — |
| W3.4 | E2E: 404 + admin create | W2.4, W3.1 | — | unspecified-high | playwright |
| W4.1 | D1 mock unit tests for repository | W2.1 | — | unspecified-high | workers-best-practices |
| W4.2 | Server-rendered sitemap | W2.2, W3.1 | — | unspecified-high | tanstack-start |
| W4.3 | i18n `convertDetectedLanguage` fix | — | — | quick | — |
| W4.4 | Dead code removal (I18nHydrationBoundary, EmailContact) | — | — | quick | — |

---

## 3. Parallel Execution Graph

```
Wave 1 (foundation — fire all 6 in parallel):
├── W1.1 lib/slugify.ts
├── W1.2 lib/editorJsServer.ts
├── W1.3 data/posts/schemas.ts
├── W1.4 data/posts/parse.ts
├── W1.5 DB migration 0001 + schema sync
└── W1.6 Lint cruft cleanup

Wave 2 (build new data layer + hook + form):
├── W2.1 data/posts/repository.ts        (needs W1.3, W1.4, W1.5)
├── W2.2 data/posts/server.ts + shims    (needs W2.1)
├── W2.3 hooks/usePostSearch.ts          (independent)
└── W2.4 AdminPostForm RHF refactor      (needs W1.1, W1.6, W2.2)

Wave 3 (route consumers — parallel):
├── W3.1 /blog/$slug SSR + notFound      (needs W1.2, W2.2, W3.3)
├── W3.2 /blog index refactor            (needs W2.2, W2.3, W3.3)
├── W3.3 lib/routes.ts constants         (independent — do first)
└── W3.4 E2E: 404 + admin create         (needs W2.4, W3.1)

Wave 4 (polish + tests):
├── W4.1 D1 mock unit tests
├── W4.2 Server-rendered sitemap
├── W4.3 i18n convertDetectedLanguage fix
└── W4.4 Dead code removal
```

**Critical path:** W1.5 → W2.1 → W2.2 → W3.1 → W3.4 → W4.2 → final QA
**Estimated parallel speedup:** ~45% faster than sequential.

---

## 4. Tasks (Detailed)

See inline sections below.

### Wave 1

#### W1.1: `lib/slugify.ts` + tests
```ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
```
**Tests:** lowercase, diacritics, whitespace, multiple hyphens, trim, punctuation, empty, whitespace-only, emoji.

#### W1.2: `lib/editorJsServer.ts` + tests
`renderBlocksToHtml(blocks: EditorBlock[]): string` — handles paragraph, header 1-6, list (ol/ul/nested), quote, code, image, embed, delimiter, raw (passthrough sanitized), unknown fallback. **Hand-rolled escaper; no DOMPurify.**

**Tests (12+):** per-block happy paths, XSS escape, raw passthrough, unknown type, empty input.

#### W1.3: `data/posts/schemas.ts` + tests
Zod: `PostRowSchema` (raw DB), `PostSchema` (parsed), `PostPaginationSchema`, `CreatePostInputSchema`, `PostSlugSchema`, `PostStatusSchema`.

**Tests (5):** default pagination, max/min pageSize, required fields, malformed tags.

#### W1.4: `data/posts/parse.ts` + tests
`parsePostRow(row): Post | null` — parses `tags` JSON, `content` JSON, defaults for nulls.

**Tests (6):** valid row, null tags, malformed tags, content as object, content fallback, defaults for nulls.

#### W1.5: DB migration 0001 + schema sync
- `database/migrations/0001_add_cms_fields.sql` — `ALTER TABLE post ADD COLUMN status/cover_image/author/content_html`; `CREATE INDEX … (status, created_at DESC)` and `(category)`; `updated_at` trigger.
- Update `database/schema.sql` fresh-install `CREATE TABLE` to include the new columns.
- `scripts/check-schema-sync.sh` — CI check.

#### W1.6: Lint cruft cleanup
- Remove `console.log(search)` in `src/routes/blog/index.tsx:25`.
- Narrow `src/lib/editorTools.ts` to `Record<string, ToolConstructable>` (remove `// @ts-nocheck` and `// eslint-disable`).
- Replace `console.error(…, error)` with `throw new Error(msg, { cause: error })` in `post-paginated.ts:109`, `post-create.ts:62`, `EmailContact.tsx:26,42`.

### Wave 2

#### W2.1: `data/posts/repository.ts` + tests
```ts
export interface PostRepo {
  findBySlug(slug: string): Promise<Post | null>;
  findPaginated(params: PostPaginationParams): Promise<PaginationResponse<Post>>;
  insert(input: CreatePostInput): Promise<InsertResult>;
}
export function getPostRepo(): PostRepo;
```
- Reads go through `parsePostRow`.
- Writes stringify `tags`/`content` and compute `content_html = renderBlocksToHtml(blocks)`.
- `sortBy`/`order` are enum-validated upstream; SQL is built with the validated values (no concat of user input).
- INSERT catches `UNIQUE constraint failed: post.slug` and returns `{ success: false, code: "SLUG_COLLISION" }`.

**Tests (8+):** findBySlug null/parsed; findPaginated FTS5 query shape; insert stringifies; collision handling.

#### W2.2: `data/posts/server.ts` + shims
```ts
// src/data/posts/server.ts
export const getPostFromSlug = createServerFn().inputValidator(PostSlugSchema).handler(…);
export const getAllPosts = createServerFn({ method: "GET" }).handler(…);
export const getPostPaginated = createServerFn().inputValidator(PostPaginationSchema).handler(…);
export const createPost = createServerFn({ method: "POST" }).inputValidator(CreatePostInputSchema).handler(…);
```
- `src/data/post.ts`, `post-all.ts`, `post-paginated.ts`, `post-create.ts` → 1-line named re-exports.

**Tests:** none new. All 157 prior tests keep passing because mock paths are unchanged.

#### W2.3: `hooks/usePostSearch.ts` + tests
```ts
usePostSearch({ data, navigate, currentSearch }) → { goToPage, next, prev, setSearch }
```
- Clamps page to `[0, totalPages - 1]`.
- `setSearch("")` sets `search: undefined`.

**Tests (9):** next/prev clamping, goToPage clamping, setSearch empty/non-empty.

#### W2.4: `AdminPostForm` RHF refactor
- Replace `useState` with `useForm(zodResolver(CreatePostInputSchema))`.
- Use `register("title")` etc. → `name` attribute survives test contract.
- Slug auto-gen: `useEffect` + `watch("title")` + `setValue("slug", slugify(title), { shouldValidate: true })`.
- Tags: comma-separated input → split on submit (`setValueAs`).
- Remove `@ts-expect-error` via `as unknown as EditorBlock[]` cast at boundary.
- Map `{success:false, code:"SLUG_COLLISION"}` → `setError("slug", { message })`.
- New test: `admin-form-collisions.test.tsx`.

**Tests:** existing `admin-form-labels.test.tsx` 4/4 still pass; new collision test passes.

### Wave 3

#### W3.1: `/blog/$slug` SSR + `notFound()`
- Loader: `throw notFound()` when `getPostFromSlug` returns null.
- Component: render `post.content_html` via `dangerouslySetInnerHTML`. Fallback: `renderBlocksToHtml(parse(post.content).blocks)` if `content_html` is null.
- New test: `blog-slug-404.test.tsx` (loader throws on missing slug).

**Acceptance:** `view-source:http://localhost:3000/blog/<slug>` contains post body HTML in initial response.

#### W3.2: `/blog` index refactor
- Remove `console.log(search)`.
- Replace 3 handlers with `usePostSearch`.
- Use `ROUTES.blogPost` for canonical URL.

#### W3.3: `lib/routes.ts`
```ts
export const ROUTES = {
  home: "/", blog: "/blog", admin: "/admin",
  blogPost: (slug: string) => `/blog/${slug}` as const,
} as const;
```

#### W3.4: E2E 404 + admin create
- `e2e/blog-404.spec.ts` — invalid slug renders NotFound.
- `e2e/admin-create.spec.ts` — opt-in via `E2E_ADMIN=1`; create post → appears in `/blog`.

### Wave 4

#### W4.1: D1 mock unit tests
- `src/test/__mocks__/d1.ts` — typed in-memory fake.
- Expand `src/test/posts-repository.test.ts` to 12+ cases.

#### W4.2: Server-rendered sitemap
- `src/routes/sitemap[.]xml.ts` — TanStack Start server route.
- Update `seo-consistency.test.ts` to assert slugs present.

#### W4.3: i18n `convertDetectedLanguage` fix
```ts
convertDetectedLanguage: (lng: string) => {
  const supported = ["en", "es", "pt"];
  if (supported.includes(lng)) return lng;
  const lower = lng.toLowerCase();
  if (lower.startsWith("pt")) return "pt";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("es")) return "es";
  return "pt";
},
```

#### W4.4: Dead code removal
- `I18nHydrationBoundary` — grep first, delete if 0 imports.
- `EmailContact.tsx` — use `@/hooks/useTranslation` (not raw `react-i18next`).

---

## 5. Risk Register (per task)

| Task | Existing tests at risk | Mitigation |
|---|---|---|
| W1.6 | none | `editorTools.ts` change is type-only at compile time; runtime is identical |
| W2.1 | none — new file | SQL injection mitigation: `sortBy`/`order` enum-validated upstream |
| W2.2 | `blog-listing-semantic`, `header-links`, `admin-form-labels` (mock data layer) | Named re-exports preserve module path AND named export shape |
| W2.3 | none — new hook | — |
| W2.4 | `admin-form-labels.test.tsx` | Every `<Input>` must use `{...register("name")}` so `name` survives |
| W3.1 | `blog-slug-head`, `blog-slug-jsonld`, `seo-consistency` | These bypass the loader and call `head()` directly; head shape is preserved for non-null case, and already handles null |
| W3.2 | `blog-listing-semantic` | Pagination's first page behavior unchanged; `data` array shape unchanged |
| W3.3 | none | — |
| W3.4 | none — new e2e specs | — |
| W4.1 | none | — |
| W4.2 | `seo-consistency` | Tighten test to assert slugs from D1; preserve empty-skip path |
| W4.3 | none | — |
| W4.4 | none | Grep before delete |

---

## 6. Commit Strategy (atomic, per-wave-feature)

```
W1:
  chore(lint): remove console.log from blog index route
  chore(lint): narrow editorTools.ts to ToolConstructable
  refactor(lib): extract slugify helper (RED→GREEN)
  refactor(lib): add editorJsServer JSON→HTML renderer (RED→GREEN)
  refactor(data): introduce posts/schemas module (RED→GREEN)
  refactor(data): introduce posts/parse module (RED→GREEN)
  chore(db): add migration 0001 for content_html, status, cover_image, author, updated_at trigger

W2:
  refactor(data): add posts/repository with parsePostRow (RED→GREEN)
  refactor(data): add posts/server and re-export shims for post, post-all, post-paginated, post-create
  refactor(hooks): add usePostSearch (RED→GREEN)
  refactor(admin): migrate AdminPostForm to react-hook-form (preserves label tests, adds collision handling)

W3:
  refactor(routes): add lib/routes constants
  feat(blog): SSR the slug page via content_html + 404 on missing
  refactor(blog): use usePostSearch in index route, drop console.log
  test(e2e): add 404 and admin create specs

W4:
  test(data): D1-mock unit tests for repository
  feat(seo): server-rendered /sitemap.xml from D1
  fix(i18n): convertDetectedLanguage returns pt for pt-BR/pt-PT
  chore(cleanup): remove dead I18nHydrationBoundary; align EmailContact to useTranslation hook
```

Each commit is independently shippable: tests + lint + typecheck must be green after each.

---

## 7. Success Criteria (final verification)

- [ ] `npm test` → 157+ tests pass (existing 157 + ~50 new = ~207)
- [ ] `npm run lint` → 0 warnings
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run build` → success
- [ ] `npm run e2e` (default suite) → all green
- [ ] `curl -s http://localhost:3000/blog/<slug> | grep -c "<p>"` → ≥ 1 (proves SSR contains content)
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog/nonexistent-slug-xyz123` → 404
- [ ] D1 migration applies cleanly to a fresh `wrangler d1 create blog` database
- [ ] D1 migration applies cleanly to a copy of the production schema
- [ ] `wrangler deploy` succeeds (dry-run if no credentials)

---

## 8. Final QA Gate

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e                    # default: smoke + 404
E2E_ADMIN=1 npm run e2e        # includes admin create
wrangler d1 execute blog --local --file=database/migrations/0001_add_cms_fields.sql
```

All must pass. Only then is the work done.
