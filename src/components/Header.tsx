import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/#sobre", label: t("header.nav.about") },
    { href: "/#tecnologias", label: t("header.nav.technologies") },
    { href: "/#experiencias", label: t("header.nav.experience") },
    { href: "/#projetos", label: t("header.nav.projects") },
    { href: "/#contato", label: t("header.nav.contact") },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="font-mono text-sm tracking-[0.15em] text-foreground hover:text-midground transition-colors"
          >
            {t("header.brand")}
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) =>
              item.href === "/blog" ? (
                <Link
                  key={item.href}
                  to="/blog"
                  className="relative px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-midground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-midground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ),
            )}
            <div className="ml-4 pl-4 border-l border-border">
              <LanguageSelector />
            </div>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <button
              className="p-2 text-foreground hover:text-midground transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) =>
                item.href === "/blog" ? (
                  <Link
                    key={item.href}
                    to="/blog"
                    className="font-mono text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="font-mono text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ),
              )}
              <div className="pt-2 border-t border-border">
                <LanguageSelector />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
