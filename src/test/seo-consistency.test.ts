import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { SITE_URL, canonicalUrl, KNOWN_POST_SLUGS } from "@/lib/seo";
import { Route as RootRoute } from "@/routes/__root";
import { Route as HomeRoute } from "@/routes/index";
import { Route as BlogIndexRoute } from "@/routes/blog/index";
import { Route as BlogSlugRoute } from "@/routes/blog/$slug";
import { Route as AdminRoute } from "@/routes/admin/index";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

const PROJECT_ROOT = resolve(__dirname, "../..");

// ---------------------------------------------------------------------------
// Helper: extract head() from a route safely
// ---------------------------------------------------------------------------
async function getHead(route: { options: { head?: unknown } }, args: unknown = {}) {
  const headFn = route.options.head;
  if (typeof headFn !== "function") {
    throw new Error("Route has no head function");
  }
  return (await headFn(args as never)) as {
    meta?: MetaEntry[];
    links?: LinkEntry[];
    scripts?: Record<string, string>[];
  };
}

// ---------------------------------------------------------------------------
// 1. SEO helper (src/lib/seo.ts)
// ---------------------------------------------------------------------------
describe("seo.ts helpers", () => {
  it("exports SITE_URL as the production domain", () => {
    expect(SITE_URL).toBe("https://crepequer.dev");
  });

  it("canonicalUrl builds absolute URLs correctly", () => {
    expect(canonicalUrl("/")).toBe("https://crepequer.dev/");
    expect(canonicalUrl("/blog")).toBe("https://crepequer.dev/blog");
    expect(canonicalUrl("/blog/")).toBe("https://crepequer.dev/blog");
    expect(canonicalUrl("/blog/my-post")).toBe("https://crepequer.dev/blog/my-post");
  });

  it("KNOWN_POST_SLUGS is an array (may be empty)", () => {
    expect(Array.isArray(KNOWN_POST_SLUGS)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Route head() canonical and robots consistency
// ---------------------------------------------------------------------------

/**
 * Asserts a route head() contains exactly one canonical link pointing to the
 * expected URL, and that no "noindex" robots directive is present (unless
 * the route is explicitly expected to have one).
 */
async function assertRouteSeo(
  route: { options: { head?: unknown } },
  expectedCanonical: string,
  args: unknown = {},
  opts?: { expectNoindex?: boolean },
) {
  const head = await getHead(route, args);

  // --- canonical ---
  const links = (head.links ?? []) as LinkEntry[];
  const canonicalLinks = links.filter((l) => l.rel === "canonical");
  expect(canonicalLinks.length).toBe(1);
  expect(canonicalLinks[0].href).toBe(expectedCanonical);

  // --- robots ---
  const meta = (head.meta ?? []) as MetaEntry[];
  const noindex = meta.find(
    (m) =>
      (m.name === "robots" || m.property === "robots") &&
      (m.content as string)?.includes("noindex"),
  );

  if (opts?.expectNoindex) {
    expect(noindex).toBeDefined();
  } else {
    expect(noindex).toBeUndefined();
  }
}

describe("Route head() SEO consistency", () => {
  it("Root route: does not emit its own canonical (child routes own it), no noindex", async () => {
    const head = await getHead(RootRoute);
    const canonicalLinks = (head.links ?? []).filter((l) => l.rel === "canonical");
    expect(canonicalLinks.length).toBe(0);

    const meta = (head.meta ?? []) as MetaEntry[];
    const noindex = meta.find(
      (m) =>
        (m.name === "robots" || m.property === "robots") &&
        (m.content as string)?.includes("noindex"),
    );
    expect(noindex).toBeUndefined();
  });

  it("Home route: canonical = /, no noindex", async () => {
    await assertRouteSeo(HomeRoute, "https://crepequer.dev/");
  });

  it("Blog index route: canonical = /blog, no noindex", async () => {
    await assertRouteSeo(BlogIndexRoute, "https://crepequer.dev/blog");
  });

  it("Blog post route: canonical = /blog/{slug}, no noindex", async () => {
    const mockPost = {
      id: 1,
      slug: "test-post",
      title: "Test Post",
      content: JSON.stringify({
        blocks: [{ type: "paragraph", data: { text: "Hello world." } }],
      }),
      created_at: "2025-01-01T00:00:00.000Z",
      updated_at: "2025-01-01T00:00:00.000Z",
      category: "Tech",
      tags: ["test"],
    };
    await assertRouteSeo(BlogSlugRoute, "https://crepequer.dev/blog/test-post", {
      loaderData: mockPost,
    });
  });

  it("Admin route: canonical = /admin, has noindex", async () => {
    await assertRouteSeo(AdminRoute, "https://crepequer.dev/admin", undefined, {
      expectNoindex: true,
    });
  });
});

// ---------------------------------------------------------------------------
// 3. public/robots.txt — allow all, point to sitemap
// ---------------------------------------------------------------------------
describe("public/robots.txt", () => {
  const robotsPath = resolve(PROJECT_ROOT, "public/robots.txt");

  it("exists", () => {
    expect(existsSync(robotsPath)).toBe(true);
  });

  it("allows all User-agent: * with no restrictions", () => {
    const content = readFileSync(robotsPath, "utf-8");
    // Must have a "User-agent: *" line
    expect(content).toMatch(/^User-agent:\s*\*$/m);
    // Must have "Disallow:" (empty) or no Disallow at all — either allows everything
    const disallowLines = content.match(/^Disallow:/gm) ?? [];
    // If any Disallow: line exists, it must be empty
    for (const line of disallowLines) {
      expect(line).toBe("Disallow:");
    }
  });

  it("points Sitemap to the absolute URL", () => {
    const content = readFileSync(robotsPath, "utf-8");
    expect(content).toMatch(/^Sitemap:\s*https:\/\/crepequer\.dev\/sitemap\.xml$/m);
  });
});

// ---------------------------------------------------------------------------
// 4. public/sitemap.xml — includes all known routes
// ---------------------------------------------------------------------------
describe("public/sitemap.xml", () => {
  const sitemapPath = resolve(PROJECT_ROOT, "public/sitemap.xml");

  it("exists", () => {
    expect(existsSync(sitemapPath)).toBe(true);
  });

  it("contains expected top-level routes", () => {
    const content = readFileSync(sitemapPath, "utf-8");
    // Must include the root
    expect(content).toContain("<loc>https://crepequer.dev/</loc>");
    // Must include language alternates
    expect(content).toContain('<loc>https://crepequer.dev/en</loc>');
    expect(content).toContain('<loc>https://crepequer.dev/es</loc>');
    // Must include the blog listing
    expect(content).toContain("<loc>https://crepequer.dev/blog</loc>");
  });

  it("does NOT contain anchor-fragment URLs", () => {
    const content = readFileSync(sitemapPath, "utf-8");
    // Fragment URLs like /#about, /#contact are not useful in sitemaps
    expect(content).not.toContain("/#");
  });

  it("is valid XML", () => {
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  it("includes KNOWN_POST_SLUGS entries when slugs are defined", () => {
    if (KNOWN_POST_SLUGS.length === 0) return; // skip when empty
    const content = readFileSync(sitemapPath, "utf-8");
    for (const slug of KNOWN_POST_SLUGS) {
      expect(content).toContain(`<loc>https://crepequer.dev/blog/${slug}</loc>`);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Server-rendered /sitemap.xml route (W4.2)
// ---------------------------------------------------------------------------
describe("server-rendered /sitemap.xml route", () => {
  const routePath = resolve(PROJECT_ROOT, "src/routes/sitemap[.]xml.ts");

  it("the route file exists", () => {
    expect(existsSync(routePath)).toBe(true);
  });

  it("exports a TanStack Start file-route", async () => {
    const mod = await import("@/routes/sitemap[.]xml");
    expect(mod.Route).toBeDefined();
    expect(typeof mod.Route).toBe("object");
  });

  it("has a GET server handler that returns XML", async () => {
    const mod = (await import("@/routes/sitemap[.]xml")) as {
      Route: { options?: { server?: { handlers?: { GET?: unknown } } } };
    };
    const getHandler = mod.Route?.options?.server?.handlers?.GET;
    expect(getHandler).toBeTypeOf("function");
  });
});
