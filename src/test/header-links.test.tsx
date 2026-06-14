import { act, render, screen } from "@testing-library/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock devtools so they don't throw "Devtools is not mounted" during cleanup.
// Mock server functions so tests don't need Cloudflare D1 or React Start.
// ---------------------------------------------------------------------------
vi.mock("@tanstack/react-router-devtools", () => ({
  TanStackRouterDevtoolsPanel: () => null,
}));
vi.mock("@tanstack/react-devtools", () => ({
  TanStackDevtools: () => null,
}));

vi.mock("@/data/post-paginated", () => ({
  getPostPaginated: vi.fn().mockResolvedValue({
    data: [],
    pagination: {
      currentPage: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }),
}));

vi.mock("@/data/tecnologies", () => ({
  getTecnologies: vi.fn().mockResolvedValue({
    main: [],
    secondary: [],
  }),
}));

// ---------------------------------------------------------------------------
// TanStack Router's <Link> component renders a native <a> but adds
// data-status="active" / aria-current="page" when the link matches the
// current route.
// ---------------------------------------------------------------------------
describe("Header navigation links", () => {
  const createAndRender = async () => {
    const router = createRouter({ routeTree });
    render(<RouterProvider router={router} />);
    return router;
  };

  it("renders blog link as a TanStack Router Link (active route)", async () => {
    const router = await createAndRender();
    await act(async () => {
      await router.navigate({ to: "/blog" });
    });

    // Navigate to blog, so the blog link becomes "active"
    const blogLink = await screen.findByRole("link", { name: "Blog" });
    expect(blogLink).toHaveAttribute("data-status", "active");
    expect(blogLink).toHaveAttribute("aria-current", "page");
  });

  it("renders the brand link as a TanStack Router Link (active route)", async () => {
    const router = await createAndRender();
    await act(async () => {
      await router.navigate({ to: "/" });
    });

    // The brand is a <Link to="/">. At "/" it is active so it gets
    // data-status="active". Query by href to avoid angle brackets in name.
    const brandLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/" && l.textContent?.trim());
    expect(brandLink).toBeDefined();
    expect(brandLink).toHaveAttribute("data-status", "active");
  });

  it("renders hash-anchor links as native <a> elements", async () => {
    const router = await createAndRender();
    await act(async () => {
      await router.navigate({ to: "/" });
    });

    // Collect every link whose href starts with "/#" (section anchors)
    const allLinks = screen.getAllByRole("link");
    const hashLinks = allLinks.filter(
      (link) => link.getAttribute("href")?.startsWith("/#"),
    );

    expect(hashLinks.length).toBeGreaterThan(0);
    hashLinks.forEach((link) => {
      expect(link.tagName).toBe("A");
      // Plain <a> elements never get data-status from the router
      expect(link).not.toHaveAttribute("data-status");
    });
  });
});
