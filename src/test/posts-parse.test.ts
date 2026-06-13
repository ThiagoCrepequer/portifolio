import { describe, expect, it } from "vitest";
import { parsePostRow, parseTagsField, parseContentField } from "@/data/posts/parse";

const baseRow = {
  id: 1,
  slug: "hello",
  title: "Hello",
  content: '{"blocks":[]}',
  created_at: "2025-01-01",
  updated_at: "2025-01-01",
};

describe("parseTagsField", () => {
  it("parses a JSON string array", () => {
    expect(parseTagsField('["react","typescript"]')).toEqual(["react", "typescript"]);
  });

  it("returns [] for null", () => {
    expect(parseTagsField(null)).toEqual([]);
  });

  it("returns [] for undefined", () => {
    expect(parseTagsField(undefined)).toEqual([]);
  });

  it("returns [] for invalid JSON", () => {
    expect(parseTagsField("{not json")).toEqual([]);
  });

  it("returns [] for a non-array JSON value", () => {
    expect(parseTagsField('{"a":1}')).toEqual([]);
  });

  it("filters out non-string entries", () => {
    expect(parseTagsField('["ok", 1, null, "fine"]')).toEqual(["ok", "fine"]);
  });
});

describe("parseContentField", () => {
  it("parses valid EditorJS JSON to an object", () => {
    const out = parseContentField('{"blocks":[{"type":"paragraph","data":{"text":"hi"}}]}');
    expect(typeof out).toBe("object");
    expect(Array.isArray((out as { blocks: unknown[] }).blocks)).toBe(true);
  });

  it("returns the raw string when JSON is invalid", () => {
    expect(parseContentField("not json")).toBe("not json");
  });

  it("returns the parsed value for any valid JSON (even primitives)", () => {
    expect(parseContentField("42")).toBe(42);
    expect(parseContentField('"hello"')).toBe("hello");
  });
});

describe("parsePostRow", () => {
  it("parses a well-formed row into a Post", () => {
    const p = parsePostRow({ ...baseRow, tags: '["a","b"]', category: "tech" });
    expect(p).not.toBeNull();
    expect(p!.tags).toEqual(["a", "b"]);
    expect(p!.category).toBe("tech");
    expect(p!.status).toBe("draft");
    expect(p!.cover_image).toBeNull();
    expect(p!.author).toBeNull();
    expect(p!.content_html).toBeNull();
  });

  it("returns tags:[] when tags field is null", () => {
    const p = parsePostRow({ ...baseRow, tags: null });
    expect(p!.tags).toEqual([]);
  });

  it("returns tags:[] when tags field is malformed JSON", () => {
    const p = parsePostRow({ ...baseRow, tags: "not json" });
    expect(p!.tags).toEqual([]);
  });

  it("parses content as object when valid", () => {
    const p = parsePostRow({ ...baseRow, content: '{"blocks":[]}' });
    expect(typeof p!.content).toBe("object");
  });

  it("keeps content as string when JSON is invalid", () => {
    const p = parsePostRow({ ...baseRow, content: "raw text" });
    expect(p!.content).toBe("raw text");
  });

  it("defaults category to 'general' when null", () => {
    const p = parsePostRow({ ...baseRow, category: null });
    expect(p!.category).toBe("general");
  });

  it("returns null for a row missing required fields", () => {
    const p = parsePostRow({ id: 1 });
    expect(p).toBeNull();
  });

  it("returns null for a row with non-positive id", () => {
    const p = parsePostRow({ ...baseRow, id: 0 });
    expect(p).toBeNull();
  });
});
