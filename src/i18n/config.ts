import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en as HomeEn } from "./locales/home/en";
import { es as HomeEs } from "./locales/home/es";
import { pt as HomePt } from "./locales/home/pt";

import { en as NotFoundEn } from "./locales/notFound/en";
import { es as NotFoundEs } from "./locales/notFound/es";
import { pt as NotFoundPt } from "./locales/notFound/pt";

export const defaultNS = "translation";
export const resources = {
  en: {
    translation: { ...HomeEn, ...NotFoundEn },
  },
  es: {
    translation: { ...HomeEs, ...NotFoundEs },
  },
  pt: {
    translation: { ...HomePt, ...NotFoundPt },
  },
} as const;

i18next.use(LanguageDetector).init({
  fallbackLng: "pt",
  lng: "pt",
  detection: {
    order: ["querystring", "cookie", "localStorage", "navigator"],
    caches: ["localStorage"],
    convertDetectedLanguage: (lng: string) => {
      const supportedLanguages = ["en", "es", "pt"];
      if (supportedLanguages.includes(lng)) {
        return lng;
      }
      return "en";
    },
  },
  ns: ["translation"],
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
  cache: {
    enabled: true,
    lifetime: 7 * 24 * 60 * 60, // 7 days
  },
});

export default i18next;
