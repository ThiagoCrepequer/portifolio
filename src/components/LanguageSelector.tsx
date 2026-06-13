import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const languages = [
    { code: "pt", name: "Português", flagUrl: "/icons/brazil.svg" },
    { code: "en", name: "English", flagUrl: "/icons/usa.svg" },
    { code: "es", name: "Español", flagUrl: "/icons/spain.svg" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 font-mono text-xs tracking-wider uppercase border border-border text-muted-foreground hover:text-foreground hover:border-midground transition-colors"
        aria-label="Select language"
      >
        <img src={currentLanguage.flagUrl} alt={currentLanguage.name} width={16} height={16} loading="lazy" decoding="async" className="h-4 w-4" />
        <span>{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border z-50 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[rgba(255,172,2,0.08)] transition-colors ${
                i18n.language === lang.code
                  ? "bg-[rgba(255,172,2,0.12)] text-midground"
                  : "text-foreground"
              }`}
            >
              <img src={lang.flagUrl} alt={lang.name} width={16} height={16} loading="lazy" decoding="async" className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">{lang.name}</span>
              {i18n.language === lang.code && <span className="ml-auto text-midground">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
