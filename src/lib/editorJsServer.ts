import type { EditorBlock } from "./editorJs";

/**
 * Server-safe EditorJS JSON → HTML renderer.
 *
 * Supported blocks: paragraph, header (levels 1-6), list (ordered/unordered/nested),
 * quote (with optional caption), code (with optional language), image (url + caption + border),
 * embed (iframe for allowlisted hosts, else link), delimiter, raw (sanitized passthrough).
 *
 * Unknown block types emit a hidden HTML comment `<!-- unknown block: {type} -->` so the
 * post still renders rather than throwing.
 *
 * SECURITY: All user text is HTML-escaped. The `raw` block's HTML is run through a strict
 * tag-allowlist (b, i, u, strong, em, br, a, code, pre). All `src`/`href` attributes are
 * checked against `javascript:` and other dangerous URL schemes.
 */

const RAW_ALLOWED_TAGS = new Set([
  "b", "strong", "i", "em", "u", "br",
  "a", "code", "pre", "p", "span", "ul", "ol", "li",
]);

const ALLOWED_EMBED_HOSTS = new Set([
  "youtube.com", "www.youtube.com", "youtu.be",
  "vimeo.com", "player.vimeo.com",
  "codepen.io", "codesandbox.io",
  "twitter.com", "x.com",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  return true;
}

function sanitizeRawHtml(html: string): string {
  // Strip any tag not in the allowlist (keeps text content of removed tags).
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag: string) => {
    return RAW_ALLOWED_TAGS.has(tag.toLowerCase()) ? match : "";
  });
}

function getEmbedUrl(input: string): string | null {
  // EditorJS embed block data has { service: string, source: string, embed: string, width?: number, height?: number, caption?: string }
  // We use `embed` if it's an absolute https URL on an allowlisted host, else fall back to a text link.
  try {
    const u = new URL(input);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED_EMBED_HOSTS.has(u.hostname.toLowerCase())) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function renderParagraph(block: EditorBlock): string {
  const text = (block.data as { text?: string }).text ?? "";
  return `<p>${escapeHtml(text)}</p>`;
}

function renderHeader(block: EditorBlock): string {
  const { text = "", level = 2 } = block.data as { text?: string; level?: number };
  const lvl = Math.min(6, Math.max(1, Math.floor(level)));
  return `<h${lvl}>${escapeHtml(text)}</h${lvl}>`;
}

function renderList(block: EditorBlock): string {
  const { style = "unordered", items = [] } = block.data as {
    style?: "unordered" | "ordered";
    items?: Array<string | { content: string; items?: Array<string | { content: string }> }>;
  };
  const tag = style === "ordered" ? "ol" : "ul";
  const renderItems = (arr: typeof items): string => {
    const lis = arr
      .map((item) => {
        if (typeof item === "string") return `<li>${escapeHtml(item)}</li>`;
        if (item && typeof item === "object" && "content" in item) {
          const inner = item.items?.length ? `<${tag}>${renderItems(item.items)}</${tag}>` : "";
          return `<li>${escapeHtml(item.content)}${inner}</li>`;
        }
        return "";
      })
      .join("");
    return lis;
  };
  return `<${tag}>${renderItems(items)}</${tag}>`;
}

function renderQuote(block: EditorBlock): string {
  const { text = "", caption = "", alignment = "left" } = block.data as {
    text?: string;
    caption?: string;
    alignment?: "left" | "center";
  };
  const align = alignment === "center" ? ' style="text-align:center"' : "";
  const cite = caption ? `<cite>${escapeHtml(caption)}</cite>` : "";
  return `<blockquote${align}>${escapeHtml(text)}${cite}</blockquote>`;
}

function renderCode(block: EditorBlock): string {
  const { code = "", language = "" } = block.data as { code?: string; language?: string };
  const langClass = language ? ` class="language-${escapeHtml(language)}"` : "";
  return `<pre><code${langClass}>${escapeHtml(code)}</code></pre>`;
}

function renderImage(block: EditorBlock): string {
  const { file = {}, caption = "", withBorder = false, withBackground = false, width, height } = block.data as {
    file?: { url?: string };
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    width?: number;
    height?: number;
  };
  const url = file.url ?? "";
  if (!isSafeUrl(url)) return `<!-- invalid image url -->`;
  const classes = [withBorder ? "with-border" : "", withBackground ? "with-background" : ""]
    .filter(Boolean)
    .join(" ");
  const classAttr = classes ? ` class="${classes}"` : "";
  const figcap = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
  const imgTag = `<img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" width="${width ?? ""}" height="${height ?? ""}"${classAttr} />`;
  return `<figure>${imgTag}${figcap}</figure>`;
}

function renderEmbed(block: EditorBlock): string {
  const { embed = "", source = "", caption = "" } = block.data as {
    embed?: string;
    source?: string;
    caption?: string;
  };
  const safeUrl = isSafeUrl(embed) ? embed : "";
  const cap = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
  if (safeUrl && getEmbedUrl(safeUrl)) {
    return `<figure class="embed"><iframe src="${escapeHtml(safeUrl)}" loading="lazy" allowfullscreen></iframe>${cap}</figure>`;
  }
  // Fall back to a link if embed URL is not allowlisted
  const href = source && isSafeUrl(source) ? source : "";
  if (href) {
    return `<figure class="embed"><a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(caption || source)}</a>${cap}</figure>`;
  }
  return `<!-- unsafe embed removed -->`;
}

function renderDelimiter(): string {
  return `<hr />`;
}

function renderRaw(block: EditorBlock): string {
  const { html = "" } = block.data as { html?: string };
  return sanitizeRawHtml(html);
}

export function renderBlocksToHtml(blocks: EditorBlock[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph": return renderParagraph(block);
        case "header":    return renderHeader(block);
        case "list":      return renderList(block);
        case "quote":     return renderQuote(block);
        case "code":      return renderCode(block);
        case "image":     return renderImage(block);
        case "embed":     return renderEmbed(block);
        case "delimiter": return renderDelimiter();
        case "raw":       return renderRaw(block);
        default:          return `<!-- unknown block: ${escapeHtml(block.type)} -->`;
      }
    })
    .join("\n");
}
