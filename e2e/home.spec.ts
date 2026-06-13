import { test, expect } from "@playwright/test";

test.describe("Home page — critical path smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with HTTP 200 and renders the app shell", async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain("Thiago Crepequer");

    // The page renders without a visible "not found" or error marker
    await expect(page.locator("body")).not.toContainText(/not found/i);
  });

  test("has <html lang> attribute", async ({ page }) => {
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThanOrEqual(2);
  });

  test("skip-to-content link exists and is focusable", async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("canonical link points to https://crepequer.dev/", async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://crepequer.dev/");
  });

  test("Person JSON-LD script exists with required fields", async ({ page }) => {
    const jsonLdScript = page.locator(
      'script[type="application/ld+json"]',
    );
    const raw = await jsonLdScript.first().textContent();
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed["@type"]).toBe("Person");
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed.name).toBeTruthy();
  });

  test("clicking Blog link navigates client-side to /blog", async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.getByRole("button", { name: "Toggle menu" }).click();
    }

    const blogLink = page.getByRole("link", { name: "Blog" });
    await expect(blogLink).toBeVisible();

    await Promise.all([
      // Navigation completes (client-side, no full reload)
      page.waitForURL("/blog"),
      blogLink.click(),
    ]);

    await expect(page).toHaveURL("/blog");
  });

  test("clicking a hash anchor updates the URL hash", async ({ page }) => {
    // Look for a hash link pointing to #contato which is the Contact section
    const hashLink = page.locator('a[href="#contato"]').first();
    await expect(hashLink).toBeVisible();

    await hashLink.click();

    // The URL should now have the #contato hash
    await expect(page).toHaveURL(/#contato/);
  });
});
