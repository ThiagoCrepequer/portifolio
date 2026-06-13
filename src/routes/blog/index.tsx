import { SearchInput } from "@/components/SearchInput";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPostPaginated } from "@/data/post-paginated";
import type { PostPaginationParams } from "@/data/post-paginated";
import { PostPaginationParamsSchema } from "@/data/posts/schemas";
import { usePostSearch } from "@/hooks/usePostSearch";
import { paginate } from "@/lib/pagination";
import { getT } from "@/lib/i18nServer";
import { ROUTES } from "@/lib/routes";
import { RouteError } from "@/components/RouteError";
import { Link, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import i18n from "@/i18n/config";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  validateSearch: PostPaginationParamsSchema,
  loader: async ({ location }) => {
    const search = location.search as PostPaginationParams;
    return getPostPaginated({ data: search });
  },
  head: () => {
    const locale = i18n.language || "pt";
    const t = getT(locale);
    const title = `Blog - Thiago Crepequer`;
    const description = t("seo.description");
    const ogTitle = t("seo.ogTitle");
    const ogDescription = t("seo.ogDescription");
    const canonical = ROUTES.canonical(ROUTES.blog);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: `${title} - ${ogTitle}` },
        { property: "og:description", content: ogDescription },
        { property: "og:image", content: "/og-image.jpg" },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} - ${ogTitle}` },
        { name: "twitter:description", content: ogDescription },
        { name: "twitter:image", content: "/og-image.jpg" },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  errorComponent: RouteError,
});

function RouteComponent() {
  const posts = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { goToPage, next, prev, setSearch } = usePostSearch({
    data: posts,
    navigate,
    currentSearch: search,
  });

  return (
    <section className="py-20">
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Blog</h1>
        <div className="mb-6">
          <SearchInput
            onSearchChange={setSearch}
            rightAddon={`${posts.pagination.totalItems} posts`}
          />
        </div>
        <ul className="flex flex-col gap-6">
          {posts.data.map((post) => (
            <li key={post.id}>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <p>
                  {format(new Date(post.created_at), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious onClick={prev} />
            </PaginationItem>
            {paginate(
              posts.pagination.currentPage + 1,
              posts.pagination.totalPages,
            ).map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={page === posts.pagination.currentPage + 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem className="cursor-pointer">
              <PaginationNext onClick={next} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
