import { describe, expect, it } from "vitest";
import {
  PostRowSchema,
  PostSchema,
  PostPaginationParamsSchema,
  PostSlugSchema,
  CreatePostInputSchema,
} from "@/data/posts/schemas";

describe("PostRowSchema", () => {
  it("accepts a minimal valid row", () => {
    const r = PostRowSchema.parse({
      id: 1,
      slug: "hello",
      title: "Hello",
      content: "{}",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    });
    expect(r.status).toBe("draft");
    expect(r.tags).toBeNull();
  });
});

describe("PostSchema", () => {
  it("accepts parsed post with tags as array", () => {
    const p = PostSchema.parse({
      id: 1,
      slug: "x",
      title: "X",
      content: { blocks: [] },
      content_html: "<p>x</p>",
      excerpt: null,
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
      category: "general",
      tags: ["a", "b"],
      status: "published",
      cover_image: null,
      author: null,
    });
    expect(p.tags).toEqual(["a", "b"]);
  });

  it("rejects malformed tags (non-array)", () => {
    expect(() =>
      PostSchema.parse({
        id: 1, slug: "x", title: "X", content: null, content_html: null,
        excerpt: null, created_at: "", updated_at: "",
        category: "", tags: "not-an-array" as unknown as string[],
        status: "draft", cover_image: null, author: null,
      }),
    ).toThrow();
  });
});

describe("PostPaginationParamsSchema", () => {
  it("applies defaults when input is empty", () => {
    const p = PostPaginationParamsSchema.parse({});
    expect(p.page).toBe(0);
    expect(p.pageSize).toBe(10);
    expect(p.sortBy).toBe("created_at");
    expect(p.order).toBe("DESC");
    expect(p.search).toBeUndefined();
  });

  it("rejects pageSize > 100", () => {
    expect(() => PostPaginationParamsSchema.parse({ pageSize: 999 })).toThrow();
  });

  it("rejects pageSize < 1", () => {
    expect(() => PostPaginationParamsSchema.parse({ pageSize: 0 })).toThrow();
  });

  it("rejects unknown sortBy", () => {
    expect(() => PostPaginationParamsSchema.parse({ sortBy: "hacker" as never })).toThrow();
  });
});

describe("PostSlugSchema", () => {
  it("accepts a valid kebab-case slug", () => {
    expect(PostSlugSchema.parse("hello-world-2025")).toBe("hello-world-2025");
  });

  it("rejects empty string", () => {
    expect(() => PostSlugSchema.parse("")).toThrow();
  });

  it("rejects uppercase", () => {
    expect(() => PostSlugSchema.parse("Hello-World")).toThrow();
  });

  it("rejects spaces", () => {
    expect(() => PostSlugSchema.parse("hello world")).toThrow();
  });
});

describe("CreatePostInputSchema", () => {
  it("requires title", () => {
    expect(() => CreatePostInputSchema.parse({ title: "", slug: "x" })).toThrow();
  });

  it("requires slug", () => {
    expect(() => CreatePostInputSchema.parse({ title: "T", slug: "" })).toThrow();
  });

  it("applies default category and tags", () => {
    const r = CreatePostInputSchema.parse({ title: "T", slug: "t" });
    expect(r.category).toBe("general");
    expect(r.tags).toEqual([]);
    expect(r.status).toBe("draft");
  });
});
