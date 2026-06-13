import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export interface ImgTagInfo {
  /** Relative path from src/ */
  file: string;
  /** 1-based line number */
  line: number;
  /** The full <img … /> line content */
  content: string;
  /** Which attributes are missing */
  missing: string[];
}

const SRC_DIR = join(process.cwd(), "src");
const VALID_EXTENSIONS = new Set([".ts", ".tsx"]);
const REQUIRED_ATTRS = ["width", "height", "alt"];
const EXCLUDED_FILES = new Set(["imageAttributeAudit.ts"]);

function walkTsFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      files.push(...walkTsFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      if (VALID_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Extract the tag content from a line, handling multi-line <img ... /> tags
 * by reading subsequent lines until `>` is found.
 */
function extractImgTag(lines: string[], startLine: number): string {
  let tag = lines[startLine];
  if (tag.includes(">")) {
    // Single line tag or part of it - grab until >
    const idx = tag.indexOf(">");
    return tag.slice(0, idx + 1);
  }
  // Multi-line tag: keep reading until we find >
  for (let i = startLine + 1; i < lines.length; i++) {
    tag += "\n" + lines[i];
    if (lines[i].includes(">")) {
      break;
    }
  }
  return tag;
}

/**
 * Scan all `src/**\/*.{ts,tsx}` files for `<img` tags and check that each
 * has explicit `width`, `height`, and `alt` attributes.
 */
export function findImgTagsMissingAttributes(): ImgTagInfo[] {
  const results: ImgTagInfo[] = [];
  const tsFiles = walkTsFiles(SRC_DIR);

  for (const filePath of tsFiles) {
    const relPath = relative(SRC_DIR, filePath);
    if (EXCLUDED_FILES.has(relPath)) continue;
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trimStart();
      if (trimmed.startsWith("*") || trimmed.startsWith("/")) continue;
      if (!/<\bimg\b[\s/]/.test(line)) continue;

      const tag = extractImgTag(lines, i);
      const missing = REQUIRED_ATTRS.filter(
        (attr) => !new RegExp(`\\b${attr}\\s*=`).test(tag),
      );

      if (missing.length > 0) {
        results.push({
          file: relPath,
          line: i + 1,
          content: tag.replace(/\n/g, " ").trim(),
          missing,
        });
      }
    }
  }

  return results;
}
