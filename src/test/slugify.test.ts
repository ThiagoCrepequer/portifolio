import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases input", () => {
    expect(slugify("Hello")).toBe("hello");
  });

  it("strips diacritics", () => {
    expect(slugify("Olá Mundo")).toBe("ola-mundo");
  });

  it("replaces whitespace with single hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello--world")).toBe("hello-world");
  });

  it("trims leading and trailing whitespace/hyphens", () => {
    expect(slugify("  -hello-world-  ")).toBe("hello-world");
  });

  it("removes punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("");
  });

  it("returns empty string for emoji-only input", () => {
    expect(slugify("🚀🎉")).toBe("");
  });

  it("preserves internal digits and underscores", () => {
    expect(slugify("v2 release_notes")).toBe("v2-release_notes");
  });
});
