import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "@/components/EmailContact";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "contact.label": "Get in Touch",
        "contact.title": "Let's Talk",
        "contact.subtitle": "Have an idea?",
        "contact.info.email": "Email",
        "contact.info.location": "Location",
        "contact.form.send": "Send Message",
        "contact.form.name": "Name",
        "contact.form.email": "Email",
        "contact.form.message": "Message",
        "contact.form.description": "Fill out the form",
        "contact.form.sending": "Sending...",
        "contact.form.success": "Sent!",
        "contact.form.error": "Error!",
        "personal.name": "Thiago Crepequer",
        "personal.contact.email": "thiago@crepequer.dev",
        "personal.contact.github": "https://github.com/thiagocrepequer",
        "personal.contact.linkedin": "https://linkedin.com/in/thiagocrepequer",
        "personal.contact.location": "Brasília, DF - Brazil",
      };
      return translations[key] ?? key;
    },
  }),
}));

vi.mock("@emailjs/browser", () => ({
  default: { sendForm: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("EmailContact external links", () => {
  it("renders GitHub link with target and rel attributes", () => {
    const { container } = render(<Contact />);
    const githubLink = container.querySelector('a[href*="github"]');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/thiagocrepequer");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders LinkedIn link with target and rel attributes", () => {
    const { container } = render(<Contact />);
    const linkedinLink = container.querySelector('a[href*="linkedin"]');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/thiagocrepequer");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders email link as native anchor (mailto:)", () => {
    render(<Contact />);
    const emailLink = screen.getByRole("link", { name: "thiago@crepequer.dev" });
    expect(emailLink).toHaveAttribute("href", "mailto:thiago@crepequer.dev");
    expect(emailLink.tagName).toBe("A");
  });

  it("does NOT use TanStack Router Link for external links", () => {
    render(<Contact />);
    const allLinks = screen.getAllByRole("link");
    for (const link of allLinks) {
      expect(link.tagName).toBe("A");
    }
  });
});
