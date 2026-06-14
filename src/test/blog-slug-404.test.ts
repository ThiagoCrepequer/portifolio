import { describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/blog/$slug";

// Mock the server function so it returns null (post not found).
vi.mock("@/data/post", () => ({
  getPostFromSlug: vi.fn().mockResolvedValue(null),
}));

describe("Blog slug 404 handling", () => {
  it("loader throws notFound() when post is not found", async () => {
    // Route.options.loader is typed as `RouteLoaderFn | RouteLoaderObject`.
    // When it's a `RouteLoaderObject` (has options + fn), call `.fn`.
    // When it's a plain function, call it directly.
    const loader = Route.options.loader;
    if (!loader) throw new Error("Route has no loader");

    // A `RouteLoaderObject` has `{ options, fn }`; a `RouteLoaderFn` is callable.
    const isLoaderObject = typeof loader !== "function" && "fn" in loader;
    const callLoader = (ctx: unknown) => {
      if (typeof loader === "function") {
        return loader(ctx as never);
      }
      if (isLoaderObject) {
        return (loader as { fn: (c: unknown) => unknown }).fn(ctx);
      }
      throw new Error("Loader is neither function nor RouteLoaderObject");
    };

    await expect(
      callLoader({ params: { slug: "this-slug-does-not-exist" } }),
    ).rejects.toBeDefined();
  });
});
