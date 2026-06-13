import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminPostForm } from "@/components/AdminPostForm";

vi.mock("react-editor-js", () => ({
  createReactEditorJS: () => () => null,
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/data/post-create", () => ({
  createPost: vi.fn(),
}));

describe("AdminPostForm labels", () => {
  beforeEach(() => {
    render(<AdminPostForm />);
  });

  it("associates label 'Título' with input name='title'", () => {
    expect(screen.getByLabelText("Título")).toHaveAttribute("name", "title");
  });

  it("associates label 'Slug' with input name='slug'", () => {
    expect(screen.getByLabelText("Slug")).toHaveAttribute("name", "slug");
  });

  it("associates label 'Categoria' with input name='category'", () => {
    expect(screen.getByLabelText("Categoria")).toHaveAttribute("name", "category");
  });

  it("associates label 'Tags (separadas por vírgula)' with input name='tags'", () => {
    expect(screen.getByLabelText("Tags (separadas por vírgula)")).toHaveAttribute(
      "name",
      "tags",
    );
  });
});
