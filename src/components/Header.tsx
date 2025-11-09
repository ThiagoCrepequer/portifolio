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
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-bold text-xl text-gray-900">
            {t("header.brand")}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <LanguageSelector />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <LanguageSelector />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
