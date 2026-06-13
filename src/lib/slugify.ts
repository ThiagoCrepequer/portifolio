/**
 * Convert an arbitrary string into a URL-safe slug.
 *
 * Rules (in order):
 *  1. Lowercase
 *  2. Normalize to NFD and strip diacritics
 *  3. Remove any character that is not word, whitespace, or hyphen
 *  4. Trim
 *  5. Collapse whitespace into single hyphens
 *  6. Collapse multiple hyphens into one
 *
 * Examples:
 *   "Hello World"          -> "hello-world"
 *   "Olá, Mundo!"          -> "ola-mundo"
 *   "  hello   --  world " -> "hello-world"
 *   "🚀 rocket"            -> "rocket"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
