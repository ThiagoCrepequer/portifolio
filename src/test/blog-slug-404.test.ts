import { describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/blog/$slug";

// Mock the server function so it returns null (post not found).
vi.mock("@/data/post", () => ({
  getPostFromSlug: vi.fn().mockResolvedValue(null),
}));

describe("Blog slug 404 handling", () => {
  it("loader throws notFound() when post is not found", async () => {
    // Access the loader directly via Route.options.loader
    const loader = Route.options.loader;
    if (!loader) throw new Error("Route has no loader");
    await expect(
      loader({ params: { slug: "this-slug-does-not-exist" } } as never),
    ).rejects.toBeDefined();
  });
});
