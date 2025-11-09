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
import { getPostPaginated, PostPaginationParams } from "@/data/post-paginated";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  loader: async ({ location }) => {
    const search = location.search as PostPaginationParams;
    console.log(search);
    return await getPostPaginated({ data: search });
  },
});

function RouteComponent() {
  const posts = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const handleSearchChange = (input: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: input || undefined,
      }),
    });
  };

  const nextPage = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page:
          posts.pagination.currentPage + 1 < posts.pagination.totalPages
            ? posts.pagination.currentPage + 1
            : posts.pagination.currentPage,
      }),
    });
  };

  const previousPage = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page:
          posts.pagination.currentPage - 1 >= 0
            ? posts.pagination.currentPage - 1
            : 0,
      }),
    });
  };

  const toPage = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    });
  };

  return (
    <section className="py-20">
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SearchInput
            onSearchChange={handleSearchChange}
            rightAddon={`${posts.pagination.totalItems} posts`}
          />
        </div>
        <ul className="flex flex-col gap-6">
          {posts.data.map((post) => (
            <li key={post.id}>
              <a href={`/blog/${post.slug}`} className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{post.title}</span>
                <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                <p>
                  {format(new Date(post.created_at), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </a>
            </li>
          ))}
        </ul>
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious onClick={previousPage} />
            </PaginationItem>
            {Array.from({
              length:
                posts.pagination.totalPages > 5
                  ? 5
                  : posts.pagination.totalPages,
            }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => toPage(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem className="cursor-pointer">
              <PaginationNext onClick={nextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
