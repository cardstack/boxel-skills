## Type Hierarchy

```
FileDef                          → any file
  ├── ImageDef                   → any image (adds width, height)
  │     ├── PngDef               → .png files
  │     ├── JpgDef               → .jpg / .jpeg files
  │     ├── SvgDef               → .svg files
  │     ├── GifDef               → .gif files
  │     ├── WebpDef              → .webp files
  │     └── AvifDef              → .avif files
  ├── MarkdownDef                → .md / .markdown (adds title, excerpt, content)
  ├── TextFileDef                → .txt (adds title, excerpt, content)
  ├── TsFileDef                  → .ts (adds title, excerpt, content)
  ├── GtsFileDef                 → .gts (extends TsFileDef)
  ├── JsonFileDef                → .json (adds title, excerpt, content)
  └── CsvFileDef                 → .csv (adds title, excerpt, content, columns, columnCount, rowCount)
```

**Use the most specific type that fits.** Prefer `PngDef` over `ImageDef` when you specifically need PNG; prefer `ImageDef` over `FileDef` when any image format is acceptable.
**This set is not extensible by Boxel users (currently).** The Boxel project provides these types and only new releases of boxel can add new ones. This may change in the future.

---

## The linksTo trap — file links need FileDef-typed fields

FileDef is a **separate hierarchy from CardDef**. A generic
`@field x = linksTo(() => CardDef)` pointed at a file's card presence
**passes lint, `get-card-type-schema`, and indexing** — then fails at
render/instantiate with
`field validation error: tried set PngDef as field 'x' but it is not an instance of CardDef`.
Type the field `linksTo(() => FileDef)` (import default from
`https://cardstack.com/base/file-api`) or a specific subtype. A render
smoke test is the ONLY gate that catches this class of error.
