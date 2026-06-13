import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPostFromSlug } from "@/data/post";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { extractExcerpt } from "@/lib/editorJs";
import { renderBlocksToHtml } from "@/lib/editorJsServer";
import { getT } from "@/lib/i18nServer";
import { ROUTES } from "@/lib/routes";
import i18n from "@/i18n/config";

/** Render the post body. Use `content_html` when present (new rows), else
 *  fall back to rendering the parsed EditorJS JSON via `renderBlocksToHtml`. */
function renderPostBody(contentHtml: string | null, contentJson: unknown): string {
  if (contentHtml && contentHtml.length > 0) return contentHtml;
  // Legacy fallback: parse content and re-render
  try {
    const parsed = typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson;
    const blocks =
      parsed && typeof parsed === "object" && Array.isArray((parsed as { blocks?: unknown }).blocks)
        ? (parsed as { blocks: Parameters<typeof renderBlocksToHtml>[0] }).blocks
        : [];
    return renderBlocksToHtml(blocks);
  } catch {
    return "";
  }
}

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const post = await getPostFromSlug({ data: params.slug });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const post = loaderData;
    const locale = i18n.language || "pt";
    const t = getT(locale);

    // Blog namespace keys are not in the default NS key union, so we use a
    // wrapper that preserves the runtime behaviour while keeping TS happy.
    const tBlog = (key: string): string =>
      (t as (k: string, opts?: Record<string, unknown>) => string)(key, { ns: "blog" });

    const title = `${post?.title || "Blog"} - Thiago Crepquer`;
    const excerpt = extractExcerpt(post?.content, 160);
    const canonicalUrl = post
      ? ROUTES.canonical(ROUTES.blogPost(post.slug))
      : ROUTES.canonical("/blog");
    const image = "/og-image.jpg";
    const authorName = tBlog("article.author");
    const section = post?.category || tBlog("article.section");

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post?.title || "",
      description: excerpt,
      author: {
        "@type": "Person",
        name: authorName,
      },
      datePublished: post?.created_at || "",
      dateModified: post?.updated_at || post?.created_at || "",
      articleSection: section,
      url: canonicalUrl,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      image,
    };

    return {
      meta: [
        { title },
        { name: "description", content: excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: excerpt },
        { property: "og:image", content: image },
        { property: "og:url", content: canonicalUrl },
        { property: "article:published_time", content: post?.created_at || "" },
        { property: "article:author", content: authorName },
        { property: "article:section", content: section },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: excerpt },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
          key: "article-jsonld",
        },
      ],
    };
  },
});

function RouteComponent() {
  const post = Route.useLoaderData();
  const bodyHtml = renderPostBody(post.content_html, post.content);

  return (
    <section className="py-20">
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-6">
          <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
          <article
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </div>
    </section>
  );
}
