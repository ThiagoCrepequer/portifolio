import { describe, expect, it } from "vitest";
import { findImgTagsMissingAttributes } from "@/lib/imageAttributeAudit";

describe("image attributes", () => {
  it("every <img> tag has explicit width, height, and alt", () => {
    const offenses = findImgTagsMissingAttributes();

    const formatMessage = (list: typeof offenses): string => {
      if (list.length === 0) return "";
      const header = `Found ${list.length} <img> tag(s) missing required attributes:\n`;
      const preview = list
        .slice(0, 10)
        .map(
          (o) =>
            `  ${o.file}:${o.line}  missing=[${o.missing.join(", ")}]  ${o.content}`,
        )
        .join("\n");
      const tail = list.length > 10 ? `\n  … and ${list.length - 10} more` : "";
      return `\n\n${header}${preview}${tail}\n`;
    };

    expect(offenses, formatMessage(offenses)).toEqual([]);
  });
});
