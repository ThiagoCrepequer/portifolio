import { act, render, screen } from "@testing-library/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock devtools so they don't throw "Devtools is not mounted" during cleanup.
// Mock the server-function data layer so tests don't need Cloudflare D1.
// The factories are hoisted by vitest, so they run BEFORE any module imports.
// ---------------------------------------------------------------------------
vi.mock("@tanstack/react-router-devtools", () => ({
  TanStackRouterDevtoolsPanel: () => null,
}));
vi.mock("@tanstack/react-devtools", () => ({
  TanStackDevtools: () => null,
}));

vi.mock("@/data/post-paginated", () => ({
  getPostPaginated: vi.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        title: "Primeiro Post do Blog",
        slug: "primeiro-post",
        content: "Conteúdo do primeiro post para testes.",
        excerpt: "Um resumo interessante sobre o primeiro post.",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        category: "Tecnologia",
        tags: ["react", "typescript"],
      },
      {
        id: 2,
        title: "Segundo Post",
        slug: "segundo-post",
        content: "Mais conteúdo técnico.",
        excerpt: "Um resumo do segundo post.",
        created_at: "2024-02-20T10:00:00Z",
        updated_at: "2024-02-20T10:00:00Z",
        category: "Carreira",
        tags: ["carreira"],
      },
    ],
    pagination: {
      currentPage: 0,
      pageSize: 10,
      totalItems: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }),
}));

describe("blog listing – semantic headings", () => {
  it("renders post titles as <h2> elements", async () => {
    const router = createRouter({ routeTree });
    render(<RouterProvider router={router} />);

    // Navigate to the blog listing and wait for the route to load
    await act(async () => {
      await router.navigate({ to: "/blog" });
    });

    // Assert each known post title is rendered as an <h2>
    const heading1 = await screen.findByRole("heading", {
      level: 2,
      name: /Primeiro Post do Blog/i,
    });
    expect(heading1).toBeInTheDocument();

    const heading2 = screen.getByRole("heading", {
      level: 2,
      name: /Segundo Post/i,
    });
    expect(heading2).toBeInTheDocument();
  });

  it("does NOT render any post title as a <span>", async () => {
    const router = createRouter({ routeTree });
    render(<RouterProvider router={router} />);

    await act(async () => {
      await router.navigate({ to: "/blog" });
    });

    // Wait for at least one post to be rendered
    await screen.findByText(/Primeiro Post do Blog/i);

    // Collect every element whose text matches a known title and filter by tag
    const titleElements = screen.getAllByText(/Primeiro Post do Blog|Segundo Post/i);
    const titleSpans = titleElements.filter((el) => el.tagName === "SPAN");

    expect(titleSpans).toHaveLength(0);
  });
});
