/**
 * Shared SEO constants and helpers for consistent metadata across routes.
 *
 * All canonical URLs must be absolute and use the production domain.
 */

export const SITE_URL = "https://crepequer.dev";

/**
 * Build an absolute canonical URL for a given path.
 * The path should start with "/" (e.g. "/blog", "/blog/my-post").
 * For the root path, use "/".
 */
export function canonicalUrl(path: string): string {
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${SITE_URL}${normalized}`;
}

/**
 * Sitemap entry type for the static sitemap builder helper.
 */
export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  alternates?: { hreflang: string; href: string }[];
}

/**
 * Known blog post slugs.
 * Update this list when adding/removing posts so the sitemap stays accurate.
 * TODO: Replace with a dynamic query when a server-side sitemap route is added.
 */
export const KNOWN_POST_SLUGS: string[] = [
  // Add slugs here as posts are published, e.g.:
  // "first-post",
  // "understanding-cloudflare-durable-objects",
];
