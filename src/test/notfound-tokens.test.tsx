import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFound } from "@/components/NotFound";

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
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

describe("NotFound theme tokens", () => {
  it("renders without hardcoded text-gray classes", () => {
    const { container } = render(<NotFound />);

    const html = container.innerHTML;

    expect(html).not.toMatch(/text-gray-\d+/);
  });

  it("renders the translated content", () => {
    render(<NotFound />);

    expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
    expect(screen.getByText("A página que você procura não existe.")).toBeInTheDocument();
    expect(screen.getByText("Voltar para o início")).toBeInTheDocument();
  });

  it("renders theme token classes", () => {
    const { container } = render(<NotFound />);

    const h1 = container.querySelector("h1");
    expect(h1).toBeTruthy();
    expect(h1!.className).toContain("text-foreground");

    const p = container.querySelector("p");
    expect(p).toBeTruthy();
    expect(p!.className).toContain("text-muted-foreground");

    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link!.className).toContain("text-midground");
    expect(link!.className).toContain("hover:text-accent");
  });
});
