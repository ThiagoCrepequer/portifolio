import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFound } from "@/components/NotFound";
import { Link } from "@tanstack/react-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "notFound.title": "Página não encontrada",
        "notFound.description": "A página que você procura não existe.",
        "notFound.backHome": "Voltar para o início",
      };
      return translations[key] ?? key;
    },
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: vi.fn(({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={to} {...props}>{children}</a>
  )),
}));

describe("NotFound back-home link", () => {
  it("renders the back-home link as an anchor pointing to /", () => {
    render(<NotFound />);
    const link = screen.getByText("Voltar para o início");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses TanStack Router Link component", () => {
    render(<NotFound />);
    expect(Link).toHaveBeenCalled();
  });
});
