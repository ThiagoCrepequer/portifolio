import { describe, expect, it } from "vitest";
import { Route } from "@/routes/index";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

describe("Home route head()", () => {
  it("includes required meta tags", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    expect(meta.some((m) => "title" in m)).toBe(true);
    expect(meta.some((m) => m.name === "description")).toBe(true);
    expect(meta.some((m) => m.name === "keywords")).toBe(true);
    expect(meta.some((m) => m.property === "og:type" && m.content === "website")).toBe(true);
    expect(meta.some((m) => m.property === "og:title")).toBe(true);
    expect(meta.some((m) => m.property === "og:description")).toBe(true);
    expect(meta.some((m) => m.property === "og:locale")).toBe(true);
    expect(meta.some((m) => m.property === "og:site_name")).toBe(true);
    expect(meta.some((m) => m.property === "og:image" && m.content === "/og-image.jpg")).toBe(true);
    expect(
      meta.some((m) => m.name === "twitter:card" && m.content === "summary_large_image"),
    ).toBe(true);
    expect(meta.some((m) => m.name === "twitter:title")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:description")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:image")).toBe(true);
  });

  it("includes canonical link", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const links = (head?.links ?? []) as LinkEntry[];

    expect(
      links.some((l) => l.rel === "canonical" && l.href === "https://crepequer.dev/"),
    ).toBe(true);
  });

  it("includes valid JSON-LD Person schema", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const scripts = head?.scripts ?? [];

    const ldScript = scripts.find(
      (s) => typeof s === "object" && "type" in s && s.type === "application/ld+json",
    ) as { type: string; children: string } | undefined;

    expect(ldScript).toBeDefined();
    expect(ldScript!.children).toBeTruthy();

    const parsed = JSON.parse(ldScript!.children);

    expect(parsed).toHaveProperty("@context", "https://schema.org");
    expect(parsed).toHaveProperty("@type", "Person");
    expect(parsed).toHaveProperty("name");
    expect(parsed).toHaveProperty("jobTitle");
    expect(parsed).toHaveProperty("url");
    expect(parsed).toHaveProperty("sameAs");
    expect(Array.isArray(parsed.sameAs)).toBe(true);
    expect(parsed.sameAs.length).toBeGreaterThan(0);
    expect(parsed).toHaveProperty("knowsAbout");
    expect(Array.isArray(parsed.knowsAbout)).toBe(true);
    expect(parsed.knowsAbout.length).toBeGreaterThan(0);
  });
});
