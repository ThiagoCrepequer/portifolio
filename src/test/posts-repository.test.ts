import { describe, expect, it, beforeEach } from "vitest";
import { createPostRepo } from "@/data/posts/repository";
import type { PostRepo } from "@/data/posts/repository";
import type { D1Database } from "@/data/posts/repository";

/**
 * Minimal in-memory D1 fake. Records every prepared-statement chain so
 * tests can assert on the SQL constructed by the repository.
 */
class FakeD1 implements D1Database {
  rows: Array<Record<string, unknown>> = [];
  // The most recent prepared statement and its bound params (per chain)
  lastStmt: { sql: string; params: unknown[] } | null = null;
  // All statements ever prepared (for richer assertions)
  history: Array<{ sql: string; params: unknown[] }> = [];
  // If set, the next .run() will throw this error
  nextRunError: Error | null = null;

  prepare(sql: string) {
    let bound: unknown[] = [];
    // Arrow functions bind `this` to the FakeD1 instance, avoiding `const db = this` aliasing.
    const stmt = {
      bind: (...values: unknown[]) => {
        bound = values;
        return stmt;
      },
      first: async <T = unknown>(): Promise<T | null> => {
        this.lastStmt = { sql, params: bound };
        this.history.push({ sql, params: bound });
        return this.rows[0] as T | null;
      },
      all: async <T = unknown>(): Promise<{ results: T[]; success: boolean }> => {
        this.lastStmt = { sql, params: bound };
        this.history.push({ sql, params: bound });
        return { results: this.rows as T[], success: true };
      },
      run: async (): Promise<{ success: boolean; meta: { last_row_id: number } }> => {
        this.lastStmt = { sql, params: bound };
        this.history.push({ sql, params: bound });
        if (this.nextRunError) {
          const e = this.nextRunError;
          this.nextRunError = null;
          throw e;
        }
        return { success: true, meta: { last_row_id: this.rows.length + 1 } };
      },
    };
    return stmt;
  }
}

function makePostRow(over: Record<string, unknown> = {}) {
  return {
    id: 1,
    slug: "hello",
    title: "Hello",
    content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Body" } }] }),
    content_html: "<p>Body</p>",
    excerpt: "summary",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "tech",
    tags: JSON.stringify(["react", "ts"]),
    status: "published" as const,
    cover_image: null,
    author: "Thiago",
    ...over,
  };
}

let db: FakeD1;
let repo: PostRepo;

beforeEach(() => {
  db = new FakeD1();
  repo = createPostRepo(db);
});

describe("PostRepo.findBySlug", () => {
  it("returns null when no row matches", async () => {
    db.rows = [];
    const post = await repo.findBySlug("missing");
    expect(post).toBeNull();
  });

  it("returns a parsed Post for a well-formed row", async () => {
    db.rows = [makePostRow()];
    const post = await repo.findBySlug("hello");
    expect(post).not.toBeNull();
    expect(post!.slug).toBe("hello");
    expect(post!.tags).toEqual(["react", "ts"]);
    expect(post!.status).toBe("published");
  });

  it("binds the slug to the prepared statement", async () => {
    db.rows = [makePostRow()];
    await repo.findBySlug("hello-world");
    expect(db.lastStmt?.sql).toContain("SELECT * FROM post WHERE slug = ?");
    expect(db.lastStmt?.params).toEqual(["hello-world"]);
  });

  it("parses tags as array when JSON is valid", async () => {
    db.rows = [makePostRow({ tags: JSON.stringify(["a", "b", "c"]) })];
    const p = await repo.findBySlug("hello");
    expect(p!.tags).toEqual(["a", "b", "c"]);
  });

  it("returns tags:[] when tags is null", async () => {
    db.rows = [makePostRow({ tags: null })];
    const p = await repo.findBySlug("hello");
    expect(p!.tags).toEqual([]);
  });
});

describe("PostRepo.findPaginated", () => {
  it("builds the correct SELECT with ORDER BY and LIMIT/OFFSET", async () => {
    db.rows = [makePostRow()];
    await repo.findPaginated({ page: 2, pageSize: 5, sortBy: "title", order: "ASC", search: undefined });
    const select = db.history.find((h) => h.sql.startsWith("SELECT * FROM post"));
    expect(select).toBeDefined();
    expect(select!.sql).toContain("ORDER BY title ASC");
    expect(select!.sql).toContain("LIMIT ? OFFSET ?");
    expect(select!.params).toEqual([5, 10]);
  });

  it("uses FTS5 search query when search is provided", async () => {
    db.rows = [makePostRow()];
    await repo.findPaginated({ page: 0, pageSize: 10, sortBy: "created_at", order: "DESC", search: "react" });
    const ftsStmt = db.history.find((h) => h.sql.includes("posts_fts MATCH ?"));
    expect(ftsStmt).toBeDefined();
    expect(ftsStmt!.params).toContain("react*");
  });

  it("escapes the search term into an FTS5 prefix wildcard", async () => {
    db.rows = [makePostRow()];
    await repo.findPaginated({ page: 0, pageSize: 10, sortBy: "created_at", order: "DESC", search: "  typescript  " });
    const ftsStmt = db.history.find((h) => h.sql.includes("posts_fts MATCH ?"));
    expect(ftsStmt!.params[0]).toBe("typescript*");
  });

  it("ignores empty/whitespace-only search (no FTS5 clause)", async () => {
    db.rows = [makePostRow()];
    await repo.findPaginated({ page: 0, pageSize: 10, sortBy: "created_at", order: "DESC", search: "   " });
    expect(db.history.some((h) => h.sql.includes("posts_fts"))).toBe(false);
  });

  it("returns correct pagination metadata", async () => {
    db.rows = [makePostRow(), makePostRow({ id: 2 })];
    // 25 total items, page 1 of 5, pageSize 5
    const countRow = { count: 25 };
    const origPrepare = db.prepare.bind(db);
    db.prepare = (sql: string) => {
      const stmt = origPrepare(sql);
      // Override .first for the COUNT query
      const origFirst = stmt.first.bind(stmt);
      Object.assign(stmt, {
        first: async () => {
          if (sql.includes("COUNT(*)")) return countRow;
          return origFirst();
        },
      });
      return stmt;
    };
    const result = await repo.findPaginated({ page: 1, pageSize: 5, sortBy: "created_at", order: "DESC", search: undefined });
    expect(result.pagination.totalItems).toBe(25);
    expect(result.pagination.totalPages).toBe(5);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });
});

describe("PostRepo.insert", () => {
  it("stringifies content as JSON and generates content_html", async () => {
    const result = await repo.insert({
      title: "T",
      slug: "t",
      content: { blocks: [{ type: "paragraph", data: { text: "Hello" } }] },
      category: "general",
      tags: ["a"],
      status: "draft",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.id).toBeGreaterThan(0);
    const insertStmt = db.history.find((h) => h.sql.startsWith("INSERT INTO post"));
    expect(insertStmt).toBeDefined();
    const contentParam = insertStmt!.params[2] as string; // content is the 3rd ? (after slug, title)
    expect(() => JSON.parse(contentParam)).not.toThrow();
    const htmlParam = insertStmt!.params[3] as string; // content_html
    expect(htmlParam).toContain("<p>Hello</p>");
  });

  it("stringifies tags as JSON array", async () => {
    await repo.insert({
      title: "T", slug: "t",
      content: { blocks: [{ type: "paragraph", data: { text: "x" } }] },
      category: "x",
      tags: ["react", "typescript"],
      status: "draft",
    });
    const insertStmt = db.history.find((h) => h.sql.startsWith("INSERT INTO post"));
    const tagsParam = insertStmt!.params[6] as string; // tags
    expect(JSON.parse(tagsParam)).toEqual(["react", "typescript"]);
  });

  it("returns VALIDATION_ERROR when content has no blocks", async () => {
    const result = await repo.insert({
      title: "T", slug: "t", content: { blocks: [] }, category: "x", tags: [], status: "draft",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("VALIDATION_ERROR");
  });

  it("returns VALIDATION_ERROR when content is missing", async () => {
    const result = await repo.insert({ title: "T", slug: "t", category: "x", tags: [], status: "draft" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("VALIDATION_ERROR");
  });

  it("returns SLUG_COLLISION when D1 throws a UNIQUE constraint error", async () => {
    db.nextRunError = new Error("D1_ERROR: UNIQUE constraint failed: post.slug");
    const result = await repo.insert({
      title: "T", slug: "dup", content: { blocks: [{ type: "paragraph", data: { text: "x" } }] },
      category: "x", tags: [], status: "draft",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("SLUG_COLLISION");
  });

  it("wraps unexpected D1 errors with Error.cause", async () => {
    db.nextRunError = new Error("Some other D1 failure");
    await expect(repo.insert({
      title: "T", slug: "t", content: { blocks: [{ type: "paragraph", data: { text: "x" } }] },
      category: "x", tags: [], status: "draft",
    })).rejects.toThrow(/Failed to insert post/);
  });
});

describe("PostRepo.findAll", () => {
  it("returns parsed posts in created_at DESC order", async () => {
    db.rows = [makePostRow({ id: 1, created_at: "2025-01-01" }), makePostRow({ id: 2, created_at: "2025-02-01" })];
    const posts = await repo.findAll();
    expect(posts).toHaveLength(2);
    expect(db.lastStmt?.sql).toContain("ORDER BY created_at DESC");
  });

  it("skips malformed rows silently (parsePostRow returns null)", async () => {
    db.rows = [makePostRow(), { id: -1 /* invalid */ }, makePostRow({ id: 3 })];
    const posts = await repo.findAll();
    expect(posts).toHaveLength(2);
  });
});

describe("PostRepo edge cases & security", () => {
  it("uses only the validated sortBy enum (no SQL injection via sortBy)", async () => {
    db.rows = [makePostRow()];
    // Valid enum value is used
    await repo.findPaginated({
      page: 0, pageSize: 10, sortBy: "title", order: "DESC", search: undefined,
    });
    const select = db.history.find((h) => h.sql.startsWith("SELECT * FROM post"));
    expect(select!.sql).toContain("ORDER BY title DESC");

    // Reset history and try a different valid enum
    db.history = [];
    await repo.findPaginated({
      page: 0, pageSize: 10, sortBy: "created_at", order: "ASC", search: undefined,
    });
    const select2 = db.history.find((h) => h.sql.startsWith("SELECT * FROM post"));
    expect(select2!.sql).toContain("ORDER BY created_at ASC");
  });

  it("returns empty pagination when no rows match", async () => {
    db.rows = [];
    const result = await repo.findPaginated({
      page: 0, pageSize: 10, sortBy: "created_at", order: "DESC", search: undefined,
    });
    expect(result.data).toEqual([]);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it("handles multiple rows in findPaginated preserving order from DB", async () => {
    db.rows = [
      makePostRow({ id: 1, slug: "first" }),
      makePostRow({ id: 2, slug: "second" }),
      makePostRow({ id: 3, slug: "third" }),
    ];
    const result = await repo.findPaginated({
      page: 0, pageSize: 10, sortBy: "created_at", order: "DESC", search: undefined,
    });
    expect(result.data).toHaveLength(3);
    expect(result.data.map((p) => p.slug)).toEqual(["first", "second", "third"]);
  });

  it("insert preserves all fields (slug, title, content_html, status)", async () => {
    const result = await repo.insert({
      title: "Full Post",
      slug: "full-post",
      content: { blocks: [{ type: "paragraph", data: { text: "Body" } }] },
      content_html: "<p>Body</p>",
      excerpt: "Summary text",
      category: "engineering",
      tags: ["x", "y", "z"],
      status: "published",
      cover_image: "https://example.com/cover.jpg",
      author: "Jane Doe",
    });
    expect(result.success).toBe(true);
    const insertStmt = db.history.find((h) => h.sql.startsWith("INSERT INTO post"));
    expect(insertStmt).toBeDefined();
    // Verify all 12 bind parameters are in correct order
    const params = insertStmt!.params;
    expect(params[0]).toBe("full-post"); // slug
    expect(params[1]).toBe("Full Post"); // title
    expect(typeof params[2]).toBe("string"); // content (JSON)
    expect(params[3]).toBe("<p>Body</p>"); // content_html
    expect(params[4]).toBe("Summary text"); // excerpt
    expect(params[5]).toBe("engineering"); // category
    expect(JSON.parse(params[6] as string)).toEqual(["x", "y", "z"]); // tags
    expect(params[7]).toBe("published"); // status
    expect(params[8]).toBe("https://example.com/cover.jpg"); // cover_image
    expect(params[9]).toBe("Jane Doe"); // author
    // params[10] and params[11] are timestamps (created_at, updated_at)
  });
});
