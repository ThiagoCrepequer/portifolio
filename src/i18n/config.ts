import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en as HomeEn } from "./locales/home/en";
import { es as HomeEs } from "./locales/home/es";
import { pt as HomePt } from "./locales/home/pt";

import { en as NotFoundEn } from "./locales/notFound/en";
import { es as NotFoundEs } from "./locales/notFound/es";
import { pt as NotFoundPt } from "./locales/notFound/pt";

import { en as BlogEn } from "./locales/blog/en";
import { es as BlogEs } from "./locales/blog/es";
import { pt as BlogPt } from "./locales/blog/pt";

export const defaultNS = "translation";
export const resources = {
  en: {
    translation: { ...HomeEn, ...NotFoundEn },
    blog: BlogEn,
  },
  es: {
    translation: { ...HomeEs, ...NotFoundEs },
    blog: BlogEs,
  },
  pt: {
    translation: { ...HomePt, ...NotFoundPt },
    blog: BlogPt,
  },
} as const;

/**
 * Maps a detected language (possibly a regional variant like "pt-BR" or "en-US")
 * to one of the supported base locales. Falls back to "pt" to match `fallbackLng`.
 */
export function convertDetectedLanguage(lng: string): string {
  const supported = ["en", "es", "pt"];
  if (supported.includes(lng)) return lng;
  const lower = lng.toLowerCase();
  if (lower.startsWith("pt")) return "pt";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("es")) return "es";
  return "pt";
}

i18next.use(LanguageDetector).init({
  fallbackLng: "pt",
  lng: "pt",
  detection: {
    order: ["querystring", "cookie", "localStorage", "navigator"],
    caches: ["localStorage"],
    convertDetectedLanguage,
  },
  ns: ["translation", "blog"],
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
