import { PostRowSchema, type Post, type PostRow } from "./schemas";

/**
 * Parse a `tags` field from its DB representation (JSON string or null) into a `string[]`.
 *
 * Tolerates:
 *  - `null` / `undefined` → `[]`
 *  - Invalid JSON → `[]`
 *  - Non-array JSON (e.g. an object) → `[]`
 *  - Array of non-strings → filtered to strings only
 */
export function parseTagsField(raw: string | null | undefined): string[] {
  if (raw == null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

/**
 * Parse a `content` field (EditorJS JSON string) into either the parsed object or
 * the raw string if the JSON is invalid.
 *
 * EditorJS stores content as `{ time, blocks, version }` but we tolerate any object
 * with a `blocks` array.
 */
export function parseContentField(raw: string): unknown {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed;
  } catch {
    return raw;
  }
}

/**
 * Convert a raw DB row into a typed `Post`.
 *
 * Returns `null` if the row fails `PostRowSchema` validation — callers should treat
 * `null` as "row is corrupt / not a post" and surface a 404 or skip.
 */
export function parsePostRow(row: unknown): Post | null {
  const result = PostRowSchema.safeParse(row);
  if (!result.success) return null;
  const r: PostRow = result.data;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    content: parseContentField(r.content),
    content_html: r.content_html ?? null,
    excerpt: r.excerpt ?? null,
    created_at: r.created_at,
    updated_at: r.updated_at,
    category: r.category ?? "general",
    tags: parseTagsField(r.tags),
    status: r.status,
    cover_image: r.cover_image ?? null,
    author: r.author ?? null,
  };
}
