import { describe, expect, it } from "vitest";
import { Route } from "@/routes/__root";

type LinkEntry = Record<string, string>;

describe("Root route font links", () => {
  it("includes preconnect to fonts.googleapis.com", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const links = (head?.links ?? []) as LinkEntry[];

    expect(
      links.some(
        (l) => l.rel === "preconnect" && l.href === "https://fonts.googleapis.com",
      ),
    ).toBe(true);
  });

  it("includes preconnect to fonts.gstatic.com with crossorigin", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const links = (head?.links ?? []) as LinkEntry[];

    expect(
      links.some(
        (l) =>
          l.rel === "preconnect" &&
          l.href === "https://fonts.gstatic.com" &&
          l.crossOrigin === "anonymous",
      ),
    ).toBe(true);
  });

  it("includes stylesheet for Google Fonts", async () => {
    const headFn = Route.options.head;
    if (!headFn) {
      throw new Error("Route has no head function");
    }
    const head = await headFn({} as never);
    const links = (head?.links ?? []) as LinkEntry[];

    expect(
      links.some(
        (l) =>
          l.rel === "stylesheet" &&
          l.href?.includes("fonts.googleapis.com") &&
          l.href?.includes("Space+Grotesk") &&
          l.href?.includes("Courier+Prime"),
      ),
    ).toBe(true);
  });
});
