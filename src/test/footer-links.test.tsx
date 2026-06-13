import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Footer } from "@/components/Footer";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "personal.name": "Thiago Crepequer",
        "footer.rights": "All rights reserved.",
      };
      return translations[key] ?? key;
    },
  }),
}));

describe("Footer links", () => {
  it("renders copyright text", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain("Thiago Crepequer");
    expect(container.textContent).toContain("All rights reserved.");
  });

  it("contains no anchor elements (no links in footer)", () => {
    const { container } = render(<Footer />);
    const anchors = container.querySelectorAll("a");
    expect(anchors.length).toBe(0);
  });
});
