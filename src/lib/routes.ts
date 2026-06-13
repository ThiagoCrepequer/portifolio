/**
 * Centralized route constants. Use these instead of magic strings so
 * refactors and search-replace are safe.
 *
 * `as const` keeps the literal types narrow so callers get autocomplete and
 * type safety on `to=…` props in TanStack Router's `<Link>`.
 */
export const ROUTES = {
  home: "/",
  blog: "/blog",
  admin: "/admin",
  /** Build the path to a single blog post. */
  blogPost: (slug: string) => `/blog/${slug}` as const,
  /** Build the absolute canonical URL for a given path. */
  canonical: (path: string) => {
    const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
    return `https://crepequer.dev${normalized}`;
  },
} as const;
