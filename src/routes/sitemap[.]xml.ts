/**
 * Server-rendered `/sitemap.xml`.
 *
 * File name `sitemap[.]xml.ts` is the TanStack Start convention for a route
 * whose URL path contains a literal dot (escaped as `[.]` in the filename).
 *
 * Lists all published post slugs queried from D1 at request time, plus the
 * static pages (home, language alternates, blog listing).
 *
 * @returns Response with `Content-Type: application/xml; charset=utf-8`.
 */
import { createFileRoute } from "@tanstack/react-router";
import { getAllPosts } from "@/data/post-all";
import { SITE_URL } from "@/lib/seo";
import type { SitemapEntry } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getAllPosts();
        const slugs = posts.filter((p) => p.status === "published").map((p) => p.slug);
        const lastmod = new Date().toISOString();

        const staticEntries: SitemapEntry[] = [
          { loc: `${SITE_URL}/`, lastmod, changefreq: "weekly", priority: 1.0 },
          { loc: `${SITE_URL}/en`, lastmod, changefreq: "monthly", priority: 0.8 },
          { loc: `${SITE_URL}/es`, lastmod, changefreq: "monthly", priority: 0.8 },
          { loc: `${SITE_URL}/blog`, lastmod, changefreq: "daily", priority: 0.9 },
        ];

        const postEntries: SitemapEntry[] = slugs.map((slug) => ({
          loc: `${SITE_URL}/blog/${slug}`,
          lastmod,
          changefreq: "weekly",
          priority: 0.7,
        }));

        const xml = renderSitemapXml([...staticEntries, ...postEntries]);
        return new Response(xml, {
          status: 200,
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (ch) => {
    switch (ch) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return ch;
    }
  });
}

function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
