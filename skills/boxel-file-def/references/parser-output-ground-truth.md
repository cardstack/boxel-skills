# FileDef parser output — measured ground truth

Measured on realms-staging 2026-07-15 by uploading real files and reading
back their typed search entries. The authorable schema and the indexed
reality differ — trust indexed files, not the schema probe.

- **Index-time attrs are invisible to `get-card-type-schema`.** The
  authorable schema for FileDef subtypes omits `contentSize`, `width`,
  `height` — indexed search entries DO carry them. Never conclude a parser
  field doesn't exist from the schema probe alone.
- **contentType strings:** `.gts` → `text/typescript+glimmer`, `.ts` →
  `text/typescript`, `.md` → `text/markdown`, `.csv` → `text/csv`,
  `.json` → `application/json`, `.txt` → `text/plain`, `.svg` →
  `image/svg+xml`, plus standard `image/jpeg` / `image/gif`.
- **contentHash** = MD5 of the raw file bytes.
- **File-entry timestamps** (`createdAt`/`lastModified`) are **epoch
  seconds (numbers)**, not ISO strings — never copy into `DateTimeField`s
  (Cardinal Rule 12).
- **MarkdownDef extras:** `frontmatter.rawContent` (parsed YAML),
  `excerpt` (first body paragraph), `content` with frontmatter STRIPPED,
  `cardReferenceUrls`, `fileReferenceUrls`; `title` prefers frontmatter.
- **Only parser-backed extensions get typed search entries.**
  `.zip`/`.bin`/`.pdf`/`.wav` upload and serve fine but a `filter.type`
  search for base `FileDef` returns 0 — no adoption-chain expansion for
  the base file type. `.gts` appears under both `TsFileDef` and
  `GtsFileDef`. `linksTo(FileDef)` to non-indexed binaries still resolves.
- **Binary upload safety is extension-dependent.** `file write` /
  `realm push` are byte-perfect for recognized media extensions
  (`.jpg`, `.gif`, `.wav`, `.pdf`, `.mp3`) but **UTF-8-mangle**
  unrecognized ones (`.zip`, `.bin`, `.mp4`) — U+FFFD inflation ~1.4–1.8×.
  Universal safe path: `WriteBinaryFileCommand` (base64 via
  `run-command @cardstack/boxel-host/tools/write-binary-file/default`);
  darwin ARG_MAX caps that at ~600 KB — chunk or shrink bigger files.
  `boxel file read` also mangles non-media binaries on the way OUT — a
  CLI round-trip md5 is NOT a valid storage check; the truth source is
  the indexed FileDef's `contentSize`/`contentHash`.
- After a binary REWRITE, dependents' indexed `contentSize`/`contentHash`
  can lag even through a racing `full-reindex-realm` — `file touch` the
  linked card JSONs to force recompute.
- **A byte-perfect PCM WAV is not a safe browser demo** — the default
  FileDef player errored (`duration: Infinity`) on a valid 44.1 kHz WAV in
  Safari AND Chrome; AAC-LC/M4A loaded fine. Prefer M4A for browser-facing
  audio; keep WAV as source with a preview rendition.
  (Platform bug, reported upstream: valid WAV errors in the default player.)

**Apply when:** building file-metadata cards, mirroring parser fields, or
debugging why a FileDef search returns nothing.
