import type {
  CreatePostInput,
  InsertResult,
  PaginationResponse,
  Post,
  PostPaginationParams,
} from "./schemas";
import { parsePostRow } from "./parse";
import { renderBlocksToHtml } from "@/lib/editorJsServer";
import type { EditorBlock } from "@/lib/editorJs";

/**
 * The shape of the D1 prepared-statement result we use.
 * Kept structural (not exported as a class) so tests can fake it.
 */
interface D1Result<T> {
  results?: T[];
  success?: boolean;
  meta?: { last_row_id?: number; changes?: number };
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export type { D1Database };

const SLUG_COLLISION_FRAGMENT = "UNIQUE constraint failed: post.slug";

/**
 * Extract EditorJS blocks from a CreatePostInput's `content` field.
 *
 * `CreatePostInput.content` is typed as `unknown` because it can be either:
 *  - the raw EditorJS object `{ time, blocks, version }` (the admin form sends this)
 *  - a JSON string
 *  - `undefined`
 *
 * Returns `null` when no usable blocks are found.
 */
function extractEditorBlocks(content: unknown): EditorBlock[] | null {
  if (content == null) return null;
  if (typeof content === "string") {
    try {
      const parsed: unknown = JSON.parse(content);
      if (parsed && typeof parsed === "object" && Array.isArray((parsed as { blocks?: unknown }).blocks)) {
        return (parsed as { blocks: EditorBlock[] }).blocks;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (typeof content === "object" && Array.isArray((content as { blocks?: unknown }).blocks)) {
    return (content as { blocks: EditorBlock[] }).blocks;
  }
  return null;
}

export interface PostRepo {
  findBySlug(slug: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  findPaginated(params: PostPaginationParams): Promise<PaginationResponse<Post>>;
  insert(input: CreatePostInput): Promise<InsertResult>;
}

/**
 * Create a `PostRepo` bound to a D1 database handle.
 *
 * @param db the D1 binding (e.g. `env.posts_database` from a server function)
 */
export function createPostRepo(db: D1Database): PostRepo {
  async function findBySlug(slug: string): Promise<Post | null> {
    const result = await db
      .prepare("SELECT * FROM post WHERE slug = ?")
      .bind(slug)
      .first();
    return parsePostRow(result);
  }

  async function findAll(): Promise<Post[]> {
    const result = await db.prepare("SELECT * FROM post ORDER BY created_at DESC").all();
    const rows = result.results ?? [];
    const out: Post[] = [];
    for (const r of rows) {
      const p = parsePostRow(r);
      if (p) out.push(p);
    }
    return out;
  }

  async function findPaginated(
    params: PostPaginationParams
  ): Promise<PaginationResponse<Post>> {
    const { page, pageSize, sortBy, order, search } = params;
    const offset = page * pageSize;
    // `sortBy` and `order` are enum-validated upstream by `PostPaginationParamsSchema`,
    // so direct interpolation here is safe (no user-controlled SQL).
    const orderByClause = `ORDER BY ${sortBy} ${order}`;

    let countQuery: string;
    let selectQuery: string;
    const ftsParam: string | null = search && search.trim() ? `${search.trim()}*` : null;

    if (ftsParam) {
      countQuery = `SELECT COUNT(*) as count FROM post
        WHERE id IN (SELECT rowid FROM posts_fts WHERE posts_fts MATCH ?)`;
      selectQuery = `SELECT post.* FROM post
        WHERE post.id IN (SELECT rowid FROM posts_fts WHERE posts_fts MATCH ?)`;
    } else {
      countQuery = "SELECT COUNT(*) as count FROM post";
      selectQuery = "SELECT * FROM post";
    }

    const countRow = ftsParam
      ? await db.prepare(countQuery).bind(ftsParam).first<{ count: number }>()
      : await db.prepare(countQuery).first<{ count: number }>();
    const totalItems = countRow?.count ?? 0;

    const finalSelect = `${selectQuery} ${orderByClause} LIMIT ? OFFSET ?`;
    const stmt = ftsParam
      ? db.prepare(finalSelect).bind(ftsParam, pageSize, offset)
      : db.prepare(finalSelect).bind(pageSize, offset);
    const { results = [] } = await stmt.all();
    const data: Post[] = [];
    for (const r of results) {
      const p = parsePostRow(r);
      if (p) data.push(p);
    }
    const totalPages = Math.max(0, Math.ceil(totalItems / pageSize));

    return {
      data,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages - 1,
        hasPreviousPage: page > 0,
      },
    };
  }

  async function insert(input: CreatePostInput): Promise<InsertResult> {
    const blocks = extractEditorBlocks(input.content);
    if (!blocks || blocks.length === 0) {
      return { success: false, code: "VALIDATION_ERROR", message: "Post content is required" };
    }
    const contentJson = JSON.stringify(blocks);
    const contentHtml = renderBlocksToHtml(blocks);
    const tagsJson = JSON.stringify(input.tags ?? []);
    const now = new Date().toISOString();
    const status = input.status ?? "draft";

    try {
      const result = await db
        .prepare(
          `INSERT INTO post
            (slug, title, content, content_html, excerpt, category, tags, status, cover_image, author, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          input.slug,
          input.title,
          contentJson,
          contentHtml,
          input.excerpt ?? null,
          input.category ?? "general",
          tagsJson,
          status,
          input.cover_image ?? null,
          input.author ?? null,
          now,
          now,
        )
        .run();
      const id = typeof result?.meta?.last_row_id === "number" ? result.meta.last_row_id : 0;
      return { success: true, id, message: "Post created successfully" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes(SLUG_COLLISION_FRAGMENT)) {
        return {
          success: false,
          code: "SLUG_COLLISION",
          message: "A post with this slug already exists",
        };
      }
      throw new Error("Failed to insert post", { cause: err });
    }
  }

  return { findBySlug, findAll, findPaginated, insert };
}
