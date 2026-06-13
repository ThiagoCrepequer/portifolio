import { describe, expect, it } from "vitest";
import { resources, convertDetectedLanguage } from "@/i18n/config";

type NestedObject = Record<string, unknown>;

function hasKey(obj: NestedObject, keyPath: string): boolean {
  const keys = keyPath.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return false;
    if (!(key in current)) return false;
    current = current[key];
  }
  return current !== undefined;
}

describe("i18n SEO keys", () => {
  const locales = ["pt", "en", "es"] as const;

  describe("home namespace (translation)", () => {
    const homeKeys = [
      "seo.title",
      "seo.description",
      "seo.keywords",
      "seo.ogTitle",
      "seo.ogDescription",
      "person.name",
      "person.jobTitle",
      "person.url",
      "person.sameAs",
      "person.knowsAbout",
    ];

    for (const locale of locales) {
      describe(`locale: ${locale}`, () => {
        const ns = resources[locale].translation as NestedObject;

        for (const key of homeKeys) {
          it(`has ${key}`, () => {
            expect(hasKey(ns, key)).toBe(true);
          });
        }

        it("person.sameAs is an array with URLs", () => {
          const sameAs = (ns as NestedObject).person as NestedObject;
          expect(Array.isArray(sameAs.sameAs)).toBe(true);
          expect((sameAs.sameAs as string[]).length).toBeGreaterThan(0);
        });

        it("person.knowsAbout is an array of skills", () => {
          const person = (ns as NestedObject).person as NestedObject;
          expect(Array.isArray(person.knowsAbout)).toBe(true);
          expect((person.knowsAbout as string[]).length).toBeGreaterThan(0);
        });
      });
    }
  });

  describe("notFound namespace (translation)", () => {
    const notFoundKeys = ["notFound.seo.title", "notFound.seo.description"];

    for (const locale of locales) {
      describe(`locale: ${locale}`, () => {
        const ns = resources[locale].translation as NestedObject;

        for (const key of notFoundKeys) {
          it(`has ${key}`, () => {
            expect(hasKey(ns, key)).toBe(true);
          });
        }
      });
    }
  });

  describe("blog namespace", () => {
    const blogKeys = [
      "blog.seo.title",
      "blog.seo.description",
      "blog.seo.ogTitle",
      "blog.seo.ogDescription",
      "blog.article.author",
      "blog.article.section",
    ];

    for (const locale of locales) {
      describe(`locale: ${locale}`, () => {
        const ns = resources[locale].blog as NestedObject;

        for (const key of blogKeys) {
          it(`has ${key}`, () => {
            expect(hasKey(ns, key)).toBe(true);
          });
        }
      });
    }
  });
});

describe("convertDetectedLanguage", () => {
  it("returns the input when it is a supported base locale", () => {
    expect(convertDetectedLanguage("pt")).toBe("pt");
    expect(convertDetectedLanguage("en")).toBe("en");
    expect(convertDetectedLanguage("es")).toBe("es");
  });

  it("resolves regional variants to their base locale (pt-BR -> pt)", () => {
    expect(convertDetectedLanguage("pt-BR")).toBe("pt");
    expect(convertDetectedLanguage("pt-PT")).toBe("pt");
    expect(convertDetectedLanguage("en-US")).toBe("en");
    expect(convertDetectedLanguage("en-GB")).toBe("en");
    expect(convertDetectedLanguage("es-MX")).toBe("es");
    expect(convertDetectedLanguage("es-AR")).toBe("es");
  });

  it("is case-insensitive", () => {
    expect(convertDetectedLanguage("PT-br")).toBe("pt");
    expect(convertDetectedLanguage("EN-us")).toBe("en");
  });

  it("falls back to 'pt' for unknown language codes", () => {
    expect(convertDetectedLanguage("ja")).toBe("pt");
    expect(convertDetectedLanguage("xx")).toBe("pt");
    expect(convertDetectedLanguage("")).toBe("pt");
  });
});
