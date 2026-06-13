import { describe, expect, it } from "vitest";
import { ROUTES } from "@/lib/routes";

describe("ROUTES", () => {
  it("exposes the expected static paths", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.blog).toBe("/blog");
    expect(ROUTES.admin).toBe("/admin");
  });

  it("builds a blogPost path from a slug", () => {
    expect(ROUTES.blogPost("hello-world")).toBe("/blog/hello-world");
  });

  it("builds a canonical URL with the production domain", () => {
    expect(ROUTES.canonical("/")).toBe("https://crepequer.dev/");
    expect(ROUTES.canonical("/blog")).toBe("https://crepequer.dev/blog");
    expect(ROUTES.canonical("/blog/")).toBe("https://crepequer.dev/blog");
    expect(ROUTES.canonical("/blog/my-post")).toBe("https://crepequer.dev/blog/my-post");
  });

  it("preserves the literal type of blogPost result", () => {
    // This test verifies the `as const` annotation works as intended.
    const path: `/blog/${string}` = ROUTES.blogPost("x");
    expect(path).toBe("/blog/x");
  });
});
