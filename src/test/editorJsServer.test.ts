import { describe, expect, it } from "vitest";
import { renderBlocksToHtml } from "@/lib/editorJsServer";
import type { EditorBlock } from "@/lib/editorJs";

describe("renderBlocksToHtml", () => {
  it("renders a paragraph with escaped text", () => {
    const out = renderBlocksToHtml([{ type: "paragraph", data: { text: "Hello" } }]);
    expect(out).toBe("<p>Hello</p>");
  });

  it("escapes HTML in paragraph text (XSS)", () => {
    const out = renderBlocksToHtml([{ type: "paragraph", data: { text: "<script>alert(1)</script>" } }]);
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("renders header with default level 2 and respects level 1-6", () => {
    expect(renderBlocksToHtml([{ type: "header", data: { text: "T", level: 1 } }])).toBe("<h1>T</h1>");
    expect(renderBlocksToHtml([{ type: "header", data: { text: "T", level: 3 } }])).toBe("<h3>T</h3>");
    expect(renderBlocksToHtml([{ type: "header", data: { text: "T", level: 99 } }])).toBe("<h6>T</h6>");
    expect(renderBlocksToHtml([{ type: "header", data: { text: "T" } }])).toBe("<h2>T</h2>");
  });

  it("renders unordered list of string items", () => {
    const out = renderBlocksToHtml([{ type: "list", data: { style: "unordered", items: ["a", "b"] } }]);
    expect(out).toBe("<ul><li>a</li><li>b</li></ul>");
  });

  it("renders ordered list", () => {
    const out = renderBlocksToHtml([{ type: "list", data: { style: "ordered", items: ["x", "y"] } }]);
    expect(out).toBe("<ol><li>x</li><li>y</li></ol>");
  });

  it("renders nested list", () => {
    const out = renderBlocksToHtml([
      { type: "list", data: { style: "unordered", items: [{ content: "outer", items: [{ content: "inner" }] }] } },
    ]);
    expect(out).toBe("<ul><li>outer<ul><li>inner</li></ul></li></ul>");
  });

  it("renders quote with optional caption", () => {
    const noCaption = renderBlocksToHtml([{ type: "quote", data: { text: "Said." } }]);
    expect(noCaption).toBe("<blockquote>Said.</blockquote>");
    const withCaption = renderBlocksToHtml([{ type: "quote", data: { text: "Said.", caption: "Author" } }]);
    expect(withCaption).toBe("<blockquote>Said.<cite>Author</cite></blockquote>");
  });

  it("renders code block with language class", () => {
    const out = renderBlocksToHtml([{ type: "code", data: { code: "const x = 1;", language: "ts" } }]);
    expect(out).toBe('<pre><code class="language-ts">const x = 1;</code></pre>');
  });

  it("renders image figure with caption and alt", () => {
    const out = renderBlocksToHtml([
      { type: "image", data: { file: { url: "https://example.com/x.png" }, caption: "Cap" } },
    ]);
    expect(out).toContain('<img src="https://example.com/x.png" alt="Cap" width="" height=""');
    expect(out).toContain("<figcaption>Cap</figcaption>");
  });

  it("rejects image with javascript: URL", () => {
    const out = renderBlocksToHtml([
      { type: "image", data: { file: { url: "javascript:alert(1)" } } },
    ]);
    expect(out).not.toContain("javascript:");
    expect(out).toContain("<!-- invalid image url -->");
  });

  it("renders embed as iframe for allowlisted host", () => {
    const out = renderBlocksToHtml([
      { type: "embed", data: { embed: "https://www.youtube.com/watch?v=abc", source: "https://www.youtube.com/watch?v=abc", caption: "Vid" } },
    ]);
    expect(out).toContain("<iframe");
    expect(out).toContain("youtube.com");
  });

  it("renders embed as link for non-allowlisted host", () => {
    const out = renderBlocksToHtml([
      { type: "embed", data: { embed: "https://evil.example.com/x", source: "https://evil.example.com/x" } },
    ]);
    expect(out).not.toContain("<iframe");
    expect(out).toContain("<a");
  });

  it("renders delimiter as <hr />", () => {
    expect(renderBlocksToHtml([{ type: "delimiter", data: {} }])).toBe("<hr />");
  });

  it("renders raw block with allowlisted tags only", () => {
    const out = renderBlocksToHtml([{ type: "raw", data: { html: "<b>ok</b><script>x</script><i>fine</i>" } }]);
    expect(out).toContain("<b>ok</b>");
    expect(out).toContain("<i>fine</i>");
    expect(out).not.toContain("<script>");
  });

  it("renders unknown block type as an HTML comment", () => {
    const out = renderBlocksToHtml([{ type: "carousel", data: {} } as unknown as EditorBlock]);
    expect(out).toBe("<!-- unknown block: carousel -->");
  });

  it("returns empty string for null/undefined/empty input", () => {
    expect(renderBlocksToHtml(null)).toBe("");
    expect(renderBlocksToHtml(undefined)).toBe("");
    expect(renderBlocksToHtml([])).toBe("");
  });

  it("concatenates multiple blocks with newlines", () => {
    const out = renderBlocksToHtml([
      { type: "paragraph", data: { text: "A" } },
      { type: "paragraph", data: { text: "B" } },
    ]);
    expect(out).toBe("<p>A</p>\n<p>B</p>");
  });
});
