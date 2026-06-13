/**
 * These EditorJS tool packages have valid `.d.ts` files, but their
 * `package.json` `"exports"` map lacks a `"types"` condition, so
 * TypeScript's bundler module resolution cannot find them.
 *
 * The declarations exist at:
 *   node_modules/@editorjs/{embed,link,raw,marker,checklist}/dist/index.d.ts
 *
 * TODO: remove these stubs once the upstream packages add a `"types"` export
 * condition, or when we switch to a moduleResolution that resolves via the
 * top-level `"types"` field (e.g. `Node16` with `module: "Node16"`).
 */
declare module "@editorjs/embed" {
  const Embed: import("@editorjs/editorjs").BlockToolConstructable;
  export default Embed;
}

declare module "@editorjs/link" {
  const LinkTool: import("@editorjs/editorjs").BlockToolConstructable;
  export default LinkTool;
}

declare module "@editorjs/raw" {
  const Raw: import("@editorjs/editorjs").BlockToolConstructable;
  export default Raw;
}

declare module "@editorjs/marker" {
  const Marker: import("@editorjs/editorjs").InlineToolConstructable;
  export default Marker;
}

declare module "@editorjs/checklist" {
  const CheckList: import("@editorjs/editorjs").BlockToolConstructable;
  export default CheckList;
}
