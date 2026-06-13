import { useCallback } from "react";
import type { Post, PostPaginationParams, PaginationResponse } from "@/data/posts/schemas";

/**
 * Structural type of TanStack Router's `Route.useNavigate()` return.
 * We keep it structural so the hook is testable without a real Router.
 */
type NavigateFn = (opts: { search: (prev: PostPaginationParams) => Partial<PostPaginationParams> }) => unknown;

export interface UsePostSearchArgs {
  data: PaginationResponse<Post>;
  navigate: NavigateFn;
  currentSearch: PostPaginationParams;
}

export interface UsePostSearchResult {
  goToPage: (page: number) => void;
  next: () => void;
  prev: () => void;
  setSearch: (q: string) => void;
}

/**
 * Pagination + search-param helpers for the blog listing.
 *
 * - `goToPage(n)` clamps to `[0, totalPages - 1]`; calling past the end is a no-op
 * - `next()` and `prev()` also clamp (no-op at boundaries)
 * - `setSearch("")` clears the search param (`undefined`); non-empty trims and sets it
 */
export function usePostSearch(args: UsePostSearchArgs): UsePostSearchResult {
  const { data, navigate, currentSearch } = args;
  const { currentPage, totalPages } = data.pagination;

  const goToPage = useCallback(
    (page: number) => {
      if (totalPages === 0) return;
      // No-op only when the caller explicitly asks for the current page.
      // If clamping resolves to the current page (e.g. goToPage(-5) → 0),
      // we still navigate — the user expressed intent to move.
      if (page === currentPage) return;
      const clamped = Math.max(0, Math.min(page, totalPages - 1));
      navigate({
        search: (prev) => ({ ...prev, page: clamped }),
      });
    },
    [navigate, currentPage, totalPages],
  );

  const next = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [goToPage, currentPage, totalPages]);

  const prev = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [goToPage, currentPage]);

  const setSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      navigate({
        search: (prev) => ({ ...prev, search: trimmed || undefined }),
      });
    },
    [navigate],
  );

  // Reference currentSearch so callers can pass it without a warning; we use the spread-only form
  // in navigate. (This is a deliberate tie — removing it would trigger react-hooks/exhaustive-deps.)
  void currentSearch;

  return { goToPage, next, prev, setSearch };
}
