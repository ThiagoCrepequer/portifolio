import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPostFromSlug } from "@/data/post";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITOR_JS_TOOLS } from "@/lib/editorTools";
import { extractExcerpt } from "@/lib/editorJs";
import { getT } from "@/lib/i18nServer";
import i18n from "@/i18n/config";
import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => await getPostFromSlug({ data: params.slug }),
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
    const canonicalUrl = `https://crepequer.dev/blog/${post?.slug || ""}`;
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
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Evita inicializar múltiplas vezes
    if (editorRef.current) {
      return;
    }

    // Inicializa o EditorJS
    editorRef.current = new EditorJS({
      holder: holderRef.current as HTMLElement,
      readOnly: true,
      tools: EDITOR_JS_TOOLS,
      data: {
        time: Date.now(),
        blocks: JSON.parse(post?.content || "[]"),
        version: "2.26.5",
      },
      minHeight: 0,
    });

    // Cleanup: destroi a instância quando o componente desmontar
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [post?.content]);

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

          <div ref={holderRef} id="editorjs" />
        </div>
      </div>
    </section>
  );
}
