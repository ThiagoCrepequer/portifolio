export interface EditorBlock {
  type: string;
  data: Record<string, unknown>;
}

const ELLIPSIS = "\u2026";

const DEFAULT_MAX_LENGTH = 160;

/**
 * Extracts a plain-text excerpt from EditorJS content.
 *
 * Accepts an EditorJS blocks array, a raw JSON string, `null`, or `undefined`.
 * Returns the text content of the first paragraph block with HTML tags stripped,
 * truncated to `maxLen` with an ellipsis appended if necessary.
 *
 * Pure utility — no React, no side effects.
 */
export function extractExcerpt(
  input: EditorBlock[] | string | null | undefined,
  maxLen: number = DEFAULT_MAX_LENGTH,
): string {
  const blocks = parseInput(input);
  if (!blocks) {
    return "";
  }

  const text = extractFirstParagraphText(blocks);
  if (!text) {
    return "";
  }

  const stripped = stripHtml(text).trim();

  if (stripped.length > maxLen) {
    return stripped.slice(0, maxLen) + ELLIPSIS;
  }

  return stripped;
}

function parseInput(
  input: EditorBlock[] | string | null | undefined,
): EditorBlock[] | null {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) {
        return parsed.blocks as EditorBlock[];
      }
      // Allow a bare JSON array string too
      if (Array.isArray(parsed)) {
        return parsed as EditorBlock[];
      }
    } catch {
      // Invalid JSON — return null
    }
  }

  return null;
}

function extractFirstParagraphText(blocks: EditorBlock[]): string | null {
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = block.data.text as string | undefined;
      if (typeof text === "string") {
        return text;
      }
    }
  }
  return null;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
