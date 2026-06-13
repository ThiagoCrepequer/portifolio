import { describe, expect, it } from "vitest";
import { Route } from "@/routes/blog/$slug";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

function createMockPost() {
  return {
    id: 1,
    slug: "test-post",
    title: "Test Post Title",
    content: JSON.stringify({
      blocks: [
        {
          type: "paragraph",
          data: { text: "This is a test paragraph for SEO metadata." },
        },
      ],
    }),
    created_at: "2025-01-15T10:00:00.000Z",
    updated_at: "2025-01-20T14:30:00.000Z",
    category: "Technology",
    tags: ["test", "seo"],
  };
}

describe("Blog slug route head()", () => {
  it("meta description contains plain text, not raw EditorJS JSON", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({ loaderData: createMockPost() } as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    const desc = meta.find((m) => m.name === "description");
    expect(desc).toBeDefined();
    expect(desc!.content).not.toContain("blocks");
    expect(desc!.content).not.toContain('"data":');
    expect(desc!.content).toBe("This is a test paragraph for SEO metadata.");
  });

  it("sets og:type to article", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    expect(meta.some((m) => m.property === "og:type" && m.content === "article")).toBe(true);
  });

  it("includes Open Graph meta tags", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    expect(meta.some((m) => m.property === "og:title")).toBe(true);
    expect(meta.some((m) => m.property === "og:description")).toBe(true);
    expect(meta.some((m) => m.property === "og:image")).toBe(true);
    expect(meta.some((m) => m.property === "og:url")).toBe(true);
    expect(meta.some((m) => m.property === "article:published_time")).toBe(true);
    expect(meta.some((m) => m.property === "article:author")).toBe(true);
    expect(meta.some((m) => m.property === "article:section")).toBe(true);
  });

  it("includes Twitter Card meta tags", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    expect(
      meta.some((m) => m.name === "twitter:card" && m.content === "summary_large_image"),
    ).toBe(true);
    expect(meta.some((m) => m.name === "twitter:title")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:description")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:image")).toBe(true);
  });

  it("canonical link ends with /blog/{slug}", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const links = (head?.links ?? []) as LinkEntry[];

    const canonical = links.find((l) => l.rel === "canonical");
    expect(canonical).toBeDefined();
    expect(canonical!.href).toMatch(/\/blog\/test-post$/);
  });

  it("includes a JSON-LD script that parses as valid JSON", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const scripts = (head?.scripts ?? []) as Record<string, string>[];

    const jsonld = scripts.find((s) => s.type === "application/ld+json");
    expect(jsonld).toBeDefined();
    expect(jsonld!.children).toBeDefined();

    let parsed: unknown;
    expect(() => {
      parsed = JSON.parse(jsonld!.children);
    }).not.toThrow();
    expect(parsed).toBeDefined();
  });

  it("handles null loaderData gracefully", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: null } as never);

    const meta = (head?.meta ?? []) as MetaEntry[];
    const desc = meta.find((m) => m.name === "description");
    expect(desc).toBeDefined();
    expect(desc!.content).toBe("");
  });
});
