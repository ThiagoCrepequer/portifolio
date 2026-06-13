# Ultrawork Notepad — Blog Refactor

Started: 2026-06-13T16:20:00-03:00
Goal: Refactor blog implementation for better quality, organization, and SSR (TDD, multi-wave).

## Plan (exhaustive, atomic)

See `.omo/plans/blog-improvements.md` for the full 4-wave plan with 16 tasks.

## Scenarios (the contract)

S1. **All 157 existing tests remain green** through every wave.
S2. **SSR for `/blog/$slug`** — content HTML in initial response (not empty `<div id="editorjs"/>`).
S3. **404 for invalid slug** — `notFound()` from TanStack Router renders NotFound.
S4. **Admin form** uses `react-hook-form` + Zod, preserves label/name attributes.
S5. **Data layer** — split into `src/data/posts/{schemas,parse,repository,server}.ts`.
S6. **DB schema** — additive migration `0001` with `status`, `cover_image`, `author`, `content_html`, `updated_at` trigger.
S7. **EditorJS bundle** — only loaded in `/admin` (write), not in blog post read.
S8. **Lint clean** — 0 warnings (`@ts-nocheck`, `@ts-expect-error`, `console.log` removed).
S9. **Slug uniqueness** — collision returns `{ success: false, code: "SLUG_COLLISION" }` and form surfaces error.
S10. **i18n converter** — `pt-BR`/`pt-PT` → `pt` (not "en").

## Now (single step in progress)

Wave 1, all 6 tasks fired in parallel.

## Todo (remaining, ordered)

W1.1 lib/slugify.ts + tests
W1.2 lib/editorJsServer.ts + tests
W1.3 data/posts/schemas.ts + tests
W1.4 data/posts/parse.ts + tests
W1.5 DB migration 0001 + schema sync
W1.6 Lint cruft cleanup
[then Wave 2, 3, 4]

## Findings (non-obvious facts with file:line refs)

- `src/@types/Post.ts` defines `Post` but is never imported (eslint warning) — global ambient type
- `src/data/post-paginated.ts:9` `pageSize.max(100)` and `.min(1)` — but `pageSize` is `z.number()` not coerced
- `src/components/AdminPostForm.tsx:109` `@ts-expect-error` for EditorJS block type mismatch
- `src/lib/editorTools.ts:1-3` `// eslint-disable` + `// @ts-nocheck`
- `src/routes/blog/index.tsx:25` `console.log(search)` — leftover
- `src/i18n/config.ts:38-44` `convertDetectedLanguage` returns `"en"` as fallback (mismatch with `fallbackLng: "pt"`)
- `src/components/I18nHydrationBoundary.tsx` exists but is never imported anywhere
- `src/components/EmailContact.tsx:17` uses `useTranslation` from `react-i18next` directly (not the shared hook)

## Learnings (patterns / pitfalls for next turn)

- Test mocks `vi.mock("@/data/post-paginated")` resolve by module path — preserve paths via named re-exports
- `extractExcerpt` already accepts string|array in `lib/editorJs.ts` — keep that contract; new renderer is a separate file
- `vi.mock` factories are hoisted by Vitest — they run BEFORE imports; safe to use top-level
- TanStack Start server functions can be wrapped with `createServerFn().inputValidator().handler()` for type-safe server RPC
- `dangerouslySetInnerHTML` is the canonical SSR escape hatch for pre-rendered HTML
