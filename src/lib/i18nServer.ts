import { resources } from "@/i18n/config";
import i18next, { type TFunction } from "i18next";

const instances = new Map<string, TFunction>();

/**
 * Server-safe synchronous translate function.
 * Creates a minimal i18next instance per locale (cached) for use in head() etc.
 */
export function getT(locale: string): TFunction {
  const supported = Object.hasOwn(resources, locale) ? locale : "pt";

  const cached = instances.get(supported);
  if (cached) return cached;

  const instance = i18next.createInstance();
  instance.init({
    lng: supported,
    fallbackLng: false,
    resources: resources as unknown as Record<string, Record<string, object>>,
    ns: ["translation", "blog"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    returnObjects: true,
  });

  const t = instance.t.bind(instance);
  instances.set(supported, t);
  return t;
}
