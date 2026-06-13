import { describe, expect, it } from "vitest";
import { Route } from "@/routes/blog/$slug";

interface JsonLdArticle {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  author: { "@type": string; name: string };
  datePublished: string;
  dateModified: string;
  articleSection: string;
  url: string;
  mainEntityOfPage: { "@type": string; "@id": string };
  image?: string;
}

function createMockPost() {
  return {
    id: 42,
    slug: "understanding-typescript",
    title: "Understanding TypeScript",
    content: JSON.stringify({
      blocks: [
        {
          type: "paragraph",
          data: { text: "A deep dive into TypeScript's type system." },
        },
      ],
    }),
    created_at: "2025-03-10T08:00:00.000Z",
    updated_at: "2025-04-05T12:00:00.000Z",
    category: "Programming",
    tags: ["typescript", "javascript"],
  };
}

describe("Blog slug JSON-LD", () => {
  async function getJsonLdAsync(): Promise<JsonLdArticle> {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: createMockPost() } as never);
    const scripts = (head?.scripts ?? []) as Record<string, string>[];
    const jsonld = scripts.find((s) => s.type === "application/ld+json");
    if (!jsonld || !jsonld.children) {
      throw new Error("JSON-LD script not found");
    }
    return JSON.parse(jsonld.children) as JsonLdArticle;
  }

  it("has @context set to https://schema.org", async () => {
    const data = await getJsonLdAsync();
    expect(data["@context"]).toBe("https://schema.org");
  });

  it("has @type set to Article", async () => {
    const data = await getJsonLdAsync();
    expect(data["@type"]).toBe("Article");
  });

  it("contains the post headline", async () => {
    const data = await getJsonLdAsync();
    expect(data.headline).toBe("Understanding TypeScript");
  });

  it("contains a text description (not EditorJS JSON)", async () => {
    const data = await getJsonLdAsync();
    expect(data.description).toBe("A deep dive into TypeScript's type system.");
    expect(data.description).not.toContain("blocks");
    expect(data.description).not.toContain('"data":');
  });

  it("has author as Person with a name", async () => {
    const data = await getJsonLdAsync();
    expect(data.author).toBeDefined();
    expect(data.author["@type"]).toBe("Person");
    expect(typeof data.author.name).toBe("string");
    expect(data.author.name.length).toBeGreaterThan(0);
  });

  it("has datePublished in ISO format", async () => {
    const data = await getJsonLdAsync();
    expect(data.datePublished).toBe("2025-03-10T08:00:00.000Z");
    expect(() => new Date(data.datePublished)).not.toThrow();
  });

  it("has dateModified (falls back to datePublished if absent)", async () => {
    const data = await getJsonLdAsync();
    expect(data.dateModified).toBe("2025-04-05T12:00:00.000Z");
    expect(() => new Date(data.dateModified)).not.toThrow();
  });

  it("has articleSection matching the post category", async () => {
    const data = await getJsonLdAsync();
    expect(data.articleSection).toBe("Programming");
  });

  it("has url set to the canonical URL", async () => {
    const data = await getJsonLdAsync();
    expect(data.url).toBe("https://crepequer.dev/blog/understanding-typescript");
  });

  it("has mainEntityOfPage pointing to the same URL", async () => {
    const data = await getJsonLdAsync();
    expect(data.mainEntityOfPage).toBeDefined();
    expect(data.mainEntityOfPage["@type"]).toBe("WebPage");
    expect(data.mainEntityOfPage["@id"]).toBe(data.url);
  });

  it("uses updated_at when available for dateModified", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const post = createMockPost();
    post.updated_at = "2025-06-01T00:00:00.000Z";
    const head = await headFn({ loaderData: post } as never);
    const scripts = (head?.scripts ?? []) as Record<string, string>[];
    const jsonld = scripts.find((s) => s.type === "application/ld+json");
    expect(jsonld).toBeDefined();
    const data = JSON.parse(jsonld!.children) as JsonLdArticle;
    expect(data.dateModified).toBe("2025-06-01T00:00:00.000Z");
  });

  it("handles null loaderData gracefully", async () => {
    const headFn = Route.options.head;
    if (!headFn) throw new Error("Route has no head function");
    const head = await headFn({ loaderData: null } as never);
    const scripts = (head?.scripts ?? []) as Record<string, string>[];
    const jsonld = scripts.find((s) => s.type === "application/ld+json");
    expect(jsonld).toBeDefined();
    const data = JSON.parse(jsonld!.children) as JsonLdArticle;
    expect(data.headline).toBe("");
    expect(data.description).toBe("");
  });
});
