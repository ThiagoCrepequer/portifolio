import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import i18n from "@/i18n/config";
import { useDocumentLang } from "@/hooks/useDocumentLang";

describe("useDocumentLang", () => {
  beforeEach(() => {
    document.documentElement.lang = "pt";
  });

  afterEach(() => {
    act(() => {
      i18n.changeLanguage("pt");
    });
  });

  it("sets document.documentElement.lang when language changes to en", () => {
    renderHook(() => useDocumentLang());

    expect(document.documentElement.lang).toBe("pt");

    act(() => {
      i18n.changeLanguage("en");
    });

    expect(document.documentElement.lang).toBe("en");
  });

  it("changes to es when spanish is selected", () => {
    renderHook(() => useDocumentLang());

    act(() => {
      i18n.changeLanguage("es");
    });

    expect(document.documentElement.lang).toBe("es");
  });

  it("sets to pt by default", () => {
    renderHook(() => useDocumentLang());

    expect(document.documentElement.lang).toBe("pt");
  });
});
