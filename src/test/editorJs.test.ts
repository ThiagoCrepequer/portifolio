import { describe, expect, it } from "vitest";
import { extractExcerpt } from "@/lib/editorJs";

describe("extractExcerpt", () => {
  it("extracts text from the first paragraph block", () => {
    const blocks = [
      { type: "paragraph", data: { text: "Hello, world!" } },
    ];
    expect(extractExcerpt(blocks)).toBe("Hello, world!");
  });

  it("strips HTML tags from paragraph text", () => {
    const blocks = [
      {
        type: "paragraph",
        data: { text: "<b>Hello</b> <i>world</i>" },
      },
    ];
    expect(extractExcerpt(blocks)).toBe("Hello world");
  });

  it("only uses the first paragraph, ignoring subsequent ones", () => {
    const blocks = [
      { type: "paragraph", data: { text: "First paragraph." } },
      { type: "paragraph", data: { text: "Second paragraph." } },
    ];
    expect(extractExcerpt(blocks)).toBe("First paragraph.");
  });

  it("truncates long text and appends ellipsis", () => {
    const blocks = [
      { type: "paragraph", data: { text: "This is a very long text that should be truncated" } },
    ];
    const result = extractExcerpt(blocks, 10);
    expect(result).toBe("This is a …");
  });

  it("ignores non-paragraph blocks and returns empty string", () => {
    const blocks = [
      { type: "header", data: { text: "Title", level: 1 } },
      { type: "list", data: { items: ["item1"] } },
      { type: "code", data: { code: "console.log('hi')" } },
      { type: "image", data: { file: { url: "img.jpg" } } },
    ];
    expect(extractExcerpt(blocks)).toBe("");
  });

  it("parses a raw JSON string input correctly", () => {
    const jsonString = JSON.stringify({
      blocks: [
        { type: "paragraph", data: { text: "From JSON string" } },
      ],
    });
    expect(extractExcerpt(jsonString)).toBe("From JSON string");
  });

  it("returns empty string for null, undefined, or invalid JSON", () => {
    expect(extractExcerpt(null)).toBe("");
    expect(extractExcerpt(undefined)).toBe("");
    expect(extractExcerpt("not valid json")).toBe("");
  });
});
