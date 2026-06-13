import { test, expect } from "@playwright/test";

test.describe("Accessibility invariants", () => {
  test("exactly one <h1> on homepage", async ({ page }) => {
    await page.goto("/");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("all <img> elements have alt text on homepage", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `Image at index ${i} is missing alt text`).not.toBeNull();
    }
  });

  test("exactly one <h1> on /blog", async ({ page }) => {
    await page.goto("/blog");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("all <img> elements have alt text on /blog", async ({ page }) => {
    await page.goto("/blog");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `Image at index ${i} is missing alt text`).not.toBeNull();
    }
  });

  test.describe("axe-core scan", () => {
    test("no axe critical or serious violations on /", async ({ page }) => {
      const { AxeBuilder } = await import("@axe-core/playwright");
      await page.goto("/");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      )).toEqual([]);
    });

    test("no axe critical or serious violations on /blog", async ({ page }) => {
      const { AxeBuilder } = await import("@axe-core/playwright");
      await page.goto("/blog");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      )).toEqual([]);
    });
  });
});
