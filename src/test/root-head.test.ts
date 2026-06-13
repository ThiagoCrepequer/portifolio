import { describe, expect, it } from "vitest";
import { Route } from "@/routes/__root";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

describe("Root route head()", () => {
  it("includes required meta tags", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const meta = (head?.meta ?? []) as MetaEntry[];

    expect(meta.some((m) => m.charSet === "utf-8")).toBe(true);
    expect(
      meta.some(
        (m) => m.name === "viewport" && m.content === "width=device-width, initial-scale=1",
      ),
    ).toBe(true);
    expect(meta.some((m) => "title" in m)).toBe(true);
    expect(meta.some((m) => m.name === "description")).toBe(true);
    expect(meta.some((m) => m.name === "keywords")).toBe(true);
    expect(meta.some((m) => m.property === "og:site_name")).toBe(true);
    expect(meta.some((m) => m.property === "og:type" && m.content === "website")).toBe(true);
    expect(meta.some((m) => m.property === "og:locale")).toBe(true);
    expect(meta.some((m) => m.property === "og:title")).toBe(true);
    expect(meta.some((m) => m.property === "og:description")).toBe(true);
    expect(meta.some((m) => m.property === "og:image" && m.content === "/og-image.jpg")).toBe(true);
    expect(
      meta.some((m) => m.name === "twitter:card" && m.content === "summary_large_image"),
    ).toBe(true);
    expect(meta.some((m) => m.name === "twitter:title")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:description")).toBe(true);
    expect(meta.some((m) => m.name === "twitter:image")).toBe(true);
    expect(meta.some((m) => m.name === "theme-color" && m.content === "#170d02")).toBe(true);
  });

  it("includes required link tags", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const links = (head?.links ?? []) as LinkEntry[];

    expect(links.some((l) => l.rel === "manifest" && l.href === "/manifest.json")).toBe(true);
    expect(links.some((l) => l.rel === "icon" && l.href === "/favicon.ico")).toBe(true);
  });
});
