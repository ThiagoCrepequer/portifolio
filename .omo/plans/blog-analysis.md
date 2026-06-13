# Análise Técnica: Blog / Portfólio

**Data:** 2026-06-13
**Escopo:** Implementação atual do blog, organização, qualidade

---

## 1. Stack & Bibliotecas

| Camada | Tecnologia | Versão | Uso |
|---|---|---|---|
| Framework full-stack | TanStack Start | 1.132 | SSR + server functions + roteamento file-based |
| Router | TanStack Router | 1.132 | Rotas tipadas, code-splitting, search params |
| Database | Cloudflare D1 (SQLite) | — | Posts + FTS5 para busca |
| Editor | EditorJS | 2.31 | Conteúdo rico (paragraph, header, image, table, etc.) |
| Editor binding | react-editor-js | 2.1 | Bridge React ↔ EditorJS |
| Validação | Zod | 4.1 | Schemas de input |
| Forms | react-hook-form | 7.66 | (declarado mas não usado) |
| I18n | i18next + react-i18next | 25 / 16 | pt-BR, en, es |
| Styling | Tailwind CSS 4 | 4.0.6 | Utility-first |
| UI kit | shadcn/ui (new-york) | — | Button, Input, Card, Pagination, Breadcrumb, Badge, input-group |
| Icons | lucide-react + react-icons | 0.544 / 5.5 | |
| Testes | Vitest + Testing Library + Playwright | 3.0 / 16.2 / 1.60 | Unit + e2e + a11y |
| Deploy | Cloudflare Workers (wrangler) | 4.46 | Edge SSR |
| Lint/format | ESLint 9 + Prettier 3.5 | — | TS strict, react-hooks |
| Util | date-fns, clsx, tailwind-merge, class-variance-authority | — | Datas, classes condicionais |

**Avaliação:** Stack moderna, coerente, alinhada com TanStack ecosystem. **Não há dependência obsoleta.** EditorJS é a única dependência pesada do bundle (justificada pelo caso de uso).

---

## 2. Estrutura Atual

```
src/
├── @types/             # Post.ts (não importado!), i18next.d.ts
├── components/
│   ├── hermes/         # 5 componentes de UI (Glow, Section, Grid, Status, Terminal)
│   ├── ui/             # 8 shadcn primitives
│   ├── AdminPostForm.tsx
│   ├── EmailContact.tsx
│   ├── Footer.tsx, Header.tsx
│   ├── LanguageSelector.tsx
│   ├── NotFound.tsx, RouteError.tsx
│   ├── SearchInput.tsx
│   ├── SkipLink.tsx
│   └── I18nHydrationBoundary.tsx
├── data/               # ⚠️ Camada de dados fragmentada
│   ├── post.ts
│   ├── post-all.ts
│   ├── post-paginated.ts
│   ├── post-create.ts
│   └── tecnologies.ts
├── hooks/              # 4 hooks
├── i18n/               # 3 namespaces × 3 locales = 9 arquivos
├── lib/                # 8 helpers (borderTokenAudit, editorJs, etc.)
├── routes/             # File-based router (root, index, blog, admin)
├── test/               # 23 arquivos de teste, 157 specs
├── styles.css
├── router.tsx
└── routeTree.gen.ts    # gerado, não editar
```

---

## 3. Schema do Banco (`database/schema.sql`)

```sql
post (
  id INTEGER PK,
  slug TEXT UNIQUE,
  title TEXT,
  content TEXT (JSON do EditorJS),
  excerpt TEXT,
  created_at, updated_at DATETIME,
  category TEXT,
  tags TEXT (JSON array)
)

posts_fts (FTS5 virtual) + 3 triggers (insert/update/delete)
```

**Pontos fortes:**
- FTS5 com `porter unicode61 remove_diacritics` → busca tolerante a acentos e radicais
- Triggers automáticos mantêm FTS sincronizado
- `slug UNIQUE` garante URL única

**Pontos fracos:**
- `tags` é `TEXT` no DB mas tipado como `string[]` → risco de inconsistência na leitura
- Sem campo `status` (draft/published) → posts criados aparecem imediatamente
- Sem `cover_image` → posts sem preview visual
- Sem `author` → JSON-LD usa valor fixo do i18n
- `updated_at` não atualiza em UPDATE (sem trigger) → valor fica obsoleto
- Sem índice em `created_at`/`category` → queries paginadas podem ser lentas em escala

---

## 4. Camada de Dados (Ponto Crítico)

Hoje há **4 arquivos separados** para posts:

| Arquivo | Função | Problema |
|---|---|---|
| `post.ts` | Busca por slug | Não tipa retorno, usa `Post` global |
| `post-all.ts` | Lista tudo | Sem paginação, sem filtro, não usado em rotas |
| `post-paginated.ts` | Lista com FTS5 | Schema Zod inline, lógica de query inline |
| `post-create.ts` | Cria post | Schema Zod inline, parsing manual de erros |

**Problemas concretos:**

1. **Tipo `Post` definido em `@types/Post.ts` mas nunca importado** → eslint reclama (`warning: 'Post' is defined but never used`). O tipo é global via ambient declaration.

2. **`tags: string[]` no tipo, mas `tags TEXT` no DB** → nenhum dos arquivos faz `JSON.parse(tags)`. Quando o front renderiza `post.tags`, recebe string crua. **Bug latente.**

3. **Validação Zod duplicada** em 3 dos 4 arquivos (padrão try/catch idêntico para ZodError).

4. **Sem Repository pattern** → cada arquivo é uma função isolada. Impossível mockar unitariamente sem reescrever.

5. **Erros silenciosos**: `post-create.ts` faz `console.error` e relança `Error("Failed to fetch posts")` genérico → perde contexto do erro original.

---

## 5. Renderização de Conteúdo (Maior Oportunidade)

A rota `/blog/$slug.tsx`:

```ts
useEffect(() => {
  editorRef.current = new EditorJS({
    holder: holderRef.current,
    readOnly: true,
    tools: EDITOR_JS_TOOLS,        // bundle gigante no client
    data: { blocks: JSON.parse(post?.content || "[]") },
  });
  return () => editorRef.current?.destroy();
}, [post?.content]);
```

**Problemas:**

1. **EditorJS é client-only por design** → o conteúdo do post é **invisível no SSR** (SEO, first paint, leitores de tela).
2. **Bundle do EditorJS (~200KB) carrega em todo blog post** → mesmo em modo read-only.
3. **EditorJS faz `JSON.parse(post?.content)` no useEffect** → se content é inválido, quebra silenciosamente.
4. **Falta 404**: se `getPostFromSlug` retorna `null`, a rota renderiza `<h1>{post?.title}</h1>` com `undefined` → tela em branco.

**Solução proposta:** Salvar o `content` como **JSON do EditorJS**, mas renderizar server-side convertendo para HTML na rota. O EditorJS continua sendo usado no admin. Existem dois caminhos:

- **(A) Render server-side a partir do JSON** — usar um parser headless que produz HTML; ou
- **(B) Salvar HTML gerado junto do JSON** — `content_html TEXT` no DB, populado na criação.

**(A) é mais limpo** mas requer manter um renderer de EditorJS server-safe. **(B) é pragmático** — HTML pronto, fácil de renderizar com `dangerouslySetInnerHTML`, e mantém o JSON para edição.

---

## 6. Outras Dores Identificadas

| # | Local | Issue | Severidade |
|---|---|---|---|
| 1 | `src/data/post.ts`, `post-all.ts` | `Post` tipo não importado, vive no global | 🔴 |
| 2 | `src/lib/editorTools.ts` | `// @ts-nocheck` + `// eslint-disable` no topo | 🔴 |
| 3 | `src/components/AdminPostForm.tsx:109` | `@ts-expect-error EditorJS block type mismatch` | 🔴 |
| 4 | `src/components/AdminPostForm.tsx:39-52` | `extractFirstParagraph` duplica `extractExcerpt` de `lib/editorJs.ts` | 🟡 |
| 5 | `src/components/AdminPostForm.tsx:27-36` | `generateSlug` inline; sem validação de colisão | 🟡 |
| 6 | `src/components/AdminPostForm.tsx` | Não usa `react-hook-form` (declarado no package.json!) | 🟡 |
| 7 | `src/routes/blog/$slug.tsx` | Sem `notFound()` para slug inválido | 🟡 |
| 8 | `src/routes/blog/index.tsx:25` | `console.log(search)` esquecido | 🔴 |
| 9 | `src/routes/blog/index.tsx:71-99` | 3 handlers de paginação quase idênticos | 🟡 |
| 10 | `src/data/post-paginated.ts:9` | `pageSize: z.number().int().min(1).max(100).default(10)` mas o server function aceita `unknown` | 🟡 |
| 11 | `src/data/post-create.ts:42` | `if (!isDev) throw` mas o `isDev` é `import.meta.env.DEV` no server fn — pode não funcionar como esperado no D1 remoto | 🟡 |
| 12 | `src/i18n/config.ts:38-44` | `convertDetectedLanguage` retorna `"en"` por padrão, mas `fallbackLng: "pt"` — inconsistência | 🟡 |
| 13 | `database/schema.sql` | Sem `updated_at` trigger → fica obsoleto | 🟡 |
| 14 | `src/i18n/locales/*` | Locale `pt` é fallback mas **nunca** indexado em `convertDetectedLanguage` se for detectado | 🟢 |
| 15 | `src/components/EmailContact.tsx:17` | Usa `react-i18next` direto, ignorando o wrapper `@/hooks/useTranslation` | 🟢 |
| 16 | `src/components/I18nHydrationBoundary.tsx` | Componente existe mas **nunca é usado** em `__root.tsx` | 🟢 |

---

## 7. Cobertura de Testes (Estado Atual)

**23 arquivos · 157 testes · 100% passando** (validado).

**Pontos fortes:**
- SEO metadata (root, home, blog index, blog slug)
- JSON-LD Article + Person
- Sitemap + robots.txt
- i18n keys (todos os locales)
- Pagination utility
- EditorJS excerpt extraction
- Debounce + document lang
- a11y (axe-core no Playwright)
- Semantic headings em blog listing
- Border token + image attribute audits (genial — previne regressão de design system)

**Lacunas:**
- ❌ **Zero testes da data layer** (queries, FTS5, paginação no DB) — totalmente coberto por mocks
- ❌ Zero testes de integração AdminPostForm
- ❌ Zero testes de slug → 404
- ❌ E2E só tem smoke tests — sem fluxo admin → criar post → ver na listagem

---

## 8. Recomendações (Plano de Melhoria)

### Prioridade ALTA (corretivo + fundação)

1. **Consolidar `src/data/`** num único módulo `src/data/posts.ts`:
   - Tipos: `Post`, `PostRow` (DB), `PostInsert`, `PostUpdate`
   - Schemas Zod: `PostSlugSchema`, `PostPaginationSchema`, `PostInsertSchema`
   - Repository: `findBySlug`, `findAll`, `findPaginated`, `insert`
   - Parseamento centralizado: `parsePostRow` (lida com `tags` JSON, `content` JSON)
   - Server functions re-exportadas

2. **Server-side render do post**:
   - Adicionar `content_html TEXT` no schema
   - Na inserção, gerar HTML a partir do JSON do EditorJS
   - Renderizar via `dangerouslySetInnerHTML` (com sanitização) no SSR
   - Manter EditorJS no admin (escrita)

3. **Resolver tipos de EditorJS**:
   - Remover `@ts-nocheck` de `editorTools.ts` via tipagem correta de `ToolConfig`
   - Substituir `@ts-expect-error` por `unknown` + narrowing em AdminPostForm

4. **Adicionar `notFound()` no `$slug.tsx`** quando post é null.

5. **Remover `console.log(search)`** e outros lints existentes.

### Prioridade MÉDIA (qualidade)

6. **Refatorar AdminPostForm** com `react-hook-form` + `zodResolver`:
   - Schemas compartilhados
   - Slug gerado automaticamente com feedback visual
   - Reading time + word count em tempo real
   - Select para category (não input livre)
   - Tags como chips em vez de CSV

7. **Schema migration** com novos campos CMS:
   - `status TEXT DEFAULT 'draft'` (draft | published)
   - `cover_image TEXT`
   - `author TEXT`
   - `updated_at` trigger

8. **Consolidar handlers de paginação** num único `goToPage(page: number)`.

### Prioridade MÉDIA (DX/testes)

9. **Adicionar testes de unidade para `data/posts.ts`** com mock de D1:
   - Query construction (FTS5, COUNT, ORDER BY, LIMIT/OFFSET)
   - Parsing de tags/content
   - Validação de inputs

10. **Criar utilitários** testados:
    - `src/lib/slugify.ts` (com testes)
    - `src/lib/editorJsServer.ts` (render JSON → HTML)
    - `src/lib/formatDate.ts` (i18n-aware)

### Prioridade BAIXA (polish)

11. **Criar constantes de rota** (`src/lib/routes.ts`) para evitar magic strings.
12. **Documentar** no README as decisões arquiteturais.

---

## 9. Critérios de Sucesso

- ✅ Todos os 157 testes existentes continuam passando
- ✅ Lint limpo (0 warnings)
- ✅ Typecheck sem erros
- ✅ Build de produção passa
- ✅ E2E smoke + admin flow funcionando
- ✅ Post detail renderiza **server-side** (verificável via `view-source:`)
- ✅ `notFound()` para slug inválido renderiza página 404 real
- ✅ AdminPostForm usa `react-hook-form`
- ✅ Schema do DB com `status`, `cover_image`, `author` + trigger de `updated_at`
