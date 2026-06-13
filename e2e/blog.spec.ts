import { test, expect } from "@playwright/test";

test.describe("Blog — smoke tests", () => {
  test("/blog loads and page title contains Blog", async ({ page }) => {
    await page.goto("/blog");
    const title = await page.title();
    expect(title).toContain("Blog");
  });

  test("canonical link on /blog", async ({ page }) => {
    await page.goto("/blog");
    const canonical = page.locator('link[rel="canonical"]');
    // canonicalUrl trims trailing slash, so we accept both forms
    const href = await canonical.getAttribute("href");
    expect(href).toMatch(/^https:\/\/crepequer\.dev\/blog\/?$/);
  });

  test("clicking first blog post navigates and Article JSON-LD exists", async ({ page }) => {
    await page.goto("/blog");

    // If there are no blog posts, skip the post-specific assertions
    const postLinks = page.locator('a[href^="/blog/"]:not([href="/blog/"])');
    const count = await postLinks.count();

    test.skip(count === 0, "No blog posts to test");

    // Click the first post link
    const firstPost = postLinks.first();
    const href = await firstPost.getAttribute("href");
    expect(href).toBeTruthy();

    await Promise.all([
      page.waitForURL(`**${href}`),
      firstPost.click(),
    ]);

    // Assert Article JSON-LD exists
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    let foundArticle = false;
    for (let i = 0; i < (await jsonLdScripts.count()); i++) {
      const raw = await jsonLdScripts.nth(i).textContent();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed["@type"] === "Article") {
            foundArticle = true;
            expect(parsed.headline).toBeTruthy();
            expect(parsed.author).toBeDefined();
            expect(parsed.author["@type"]).toBe("Person");
            break;
          }
        } catch {
          // not valid JSON, skip
        }
      }
    }
    expect(foundArticle).toBe(true);
  });
});
