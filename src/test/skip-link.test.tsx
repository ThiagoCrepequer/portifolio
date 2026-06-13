import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkipLink } from "@/components/SkipLink";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "a11y.skipToContent": "Skip to content",
      };
      return translations[key] ?? key;
    },
  }),
}));

describe("SkipLink", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderWithMain() {
    return render(
      <>
        <SkipLink />
        <main id="main-content">Main content</main>
      </>,
    );
  }

  it("renders the link with translated text", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to content");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });

  it("has href pointing to main-content", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to content");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("is visually hidden by default (sr-only class)", () => {
    renderWithMain();
    const link = screen.getByText("Skip to content");
    expect(link.className).toContain("sr-only");
  });

  it("shows focus-visible classes for keyboard accessibility", () => {
    renderWithMain();
    const link = screen.getByText("Skip to content");
    expect(link.className).toContain("focus-visible:not-sr-only");
    expect(link.className).toContain("focus-visible:ring-midground");
  });

  it("moves focus to main-content on click", () => {
    renderWithMain();
    const link = screen.getByText("Skip to content");
    const main = document.getElementById("main-content")!;

    fireEvent.click(link);

    expect(document.activeElement).toBe(main);
    expect(main.getAttribute("tabindex")).toBe("-1");
  });

  it("prevents default navigation on click", () => {
    renderWithMain();
    const link = screen.getByText("Skip to content");

    const clickEvent = fireEvent.click(link);

    expect(clickEvent).toBe(false);
  });
});
