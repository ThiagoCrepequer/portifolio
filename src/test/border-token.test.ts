import { describe, expect, it } from "vitest";
import { findHardcodedBorders } from "@/lib/borderTokenAudit";

describe("border token audit", () => {
  it("no hardcoded border-rgba values in ts/tsx source files", () => {
    const offenses = findHardcodedBorders();

    const formatMessage = (list: typeof offenses): string => {
      if (list.length === 0) return "";
      const header = `Found ${list.length} hardcoded border-rgba occurrence(s):\n`;
      const preview = list
        .slice(0, 10)
        .map((o) => `  ${o.file}:${o.line}  ${o.content}`)
        .join("\n");
      const tail = list.length > 10 ? `\n  … and ${list.length - 10} more` : "";
      return `\n\n${header}${preview}${tail}\n`;
    };

    expect(offenses, formatMessage(offenses)).toEqual([]);
  });
});
