import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export interface BorderOffense {
  /** Relative path from src/ */
  file: string;
  /** 1-based line number */
  line: number;
  /** Trimmed line content */
  content: string;
}

/**
 * The literal pattern is split into parts so that the source code of this
 * file does not contain the full search string and thus does not self-match.
 */
const HARDCODED_PATTERN = "border-[rgba(255,172" + ",2";
const SRC_DIR = join(process.cwd(), "src");
const VALID_EXTENSIONS = new Set([".ts", ".tsx"]);

/** Files that are allowed to contain the pattern (e.g. this audit tool itself). */
const EXCLUDED_FILES = new Set(["borderTokenAudit.ts", "border-token.test.ts"]);

/**
 * Recursively walk a directory and return all `.ts` / `.tsx` file paths.
 */
function walkTsFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip common non-source directories
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
 * Scan all `src/**\/*.{ts,tsx}` files for hardcoded border-rgba values that should
 * use the `border-border` design token instead.
 *
 * The design token `--border: rgba(255, 172, 2, 0.18)` is defined in `src/styles.css` and
 * should be the single source of truth. Inline arbitrary values in JSX/TSX components
 * bypass the design system and should be replaced with `border-border`.
 *
 * @returns An array of offenses, each describing the file, line, and offending content.
 */
export function findHardcodedBorders(): BorderOffense[] {
  const offenses: BorderOffense[] = [];
  const tsFiles = walkTsFiles(SRC_DIR);

  for (const filePath of tsFiles) {
    const relPath = relative(SRC_DIR, filePath);
    if (EXCLUDED_FILES.has(relPath)) continue;
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(HARDCODED_PATTERN)) {
        offenses.push({
          file: relPath,
          line: i + 1,
          content: lines[i].trim(),
        });
      }
    }
  }

  return offenses;
}
