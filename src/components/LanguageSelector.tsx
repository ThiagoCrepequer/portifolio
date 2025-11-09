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

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label="Select language"
      >
        <img
          src={currentLanguage.flagUrl}
          alt={currentLanguage.name}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                i18n.language === lang.code
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <img src={lang.flagUrl} alt={lang.name} className="h-4 w-4" />
              <span className="font-medium">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
