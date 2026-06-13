import { useEffect } from "react";
import i18n from "@/i18n/config";

/**
 * Keeps <html lang> in sync with the active i18n language.
 * The SSR initial value is set in __root.tsx from the i18n fallback.
 */
export function useDocumentLang(): void {
  useEffect(() => {
    const handler = (lng: string) => {
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handler);

    // Sync on mount in case language was changed before mount
    document.documentElement.lang = i18n.language;

    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);
}
