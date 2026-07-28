## Using FileDef in Cards

```gts
import { CardDef, field, linksTo } from 'https://cardstack.com/base/card-api';
import ImageDef from 'https://cardstack.com/base/image-file-def';
import PngDef from 'https://cardstack.com/base/png-image-def';
import FileDef from 'https://cardstack.com/base/file-api';
import MarkdownDef from 'https://cardstack.com/base/markdown-file-def';

export class ProductListing extends CardDef {
  @field photo = linksTo(PngDef); // Specifically PNG
  @field banner = linksTo(ImageDef); // Any image format
  @field attachment = linksTo(FileDef); // Any file type
  @field readme = linksTo(MarkdownDef); // Markdown document
}
```

## Binary File Example

The A Million Dreams karaoke card keeps a multi-megabyte MP3 out of card JSON by linking to the realm file:

```gts
import { FileDef, ImageDef, linksTo } from 'https://cardstack.com/base/card-api';

@field mp3FileDef = linksTo(FileDef);
@field coverArt = linksTo(ImageDef);
```

```json
"relationships": {
  "mp3FileDef": {
    "links": {
      "self": "./a-million-dreams-karaoke-assets/amd-192.mp3"
    }
  },
  "coverArt": {
    "links": {
      "self": "./a-million-dreams-karaoke-assets/a-million-dreams-cover.jpeg"
    }
  }
}
```

The card stores links only. The MP3/JPEG bytes live as separate realm files.

## Generated File From A Command

When generated media arrives as a `data:image/...;base64,...`, write it to the realm before saving the card:

```gts
import WriteBinaryFileCommand from '@cardstack/boxel-host/tools/write-binary-file';
import { ImageDef, linksTo } from 'https://cardstack.com/base/card-api';

@field outputImage = linksTo(ImageDef);

let writeResult = await new WriteBinaryFileCommand(commandContext).execute({
  path: 'GeneratedImages/result.png',
  realm: realmUrl,
  base64Content,
  contentType: 'image/png',
  useNonConflictingFilename: true,
});

card.outputImage = new ImageDef({
  id: writeResult.fileIdentifier,
  sourceUrl: writeResult.fileIdentifier,
  url: writeResult.fileIdentifier,
  name: 'result.png',
  contentType: 'image/png',
});
```

Reference implementation: `packages/host/app/tools/screenshot-card.ts` writes screenshot PNG bytes with `WriteBinaryFileCommand`, and `packages/host/tests/integration/commands/write-binary-file-test.gts` verifies the file is accessible and byte-identical afterward.

---

## File-typed relationships need the file extension

When a card relationship links to a FileDef subclass (`MarkdownDef`, `PngDef`, `CsvFileDef`, etc.), the relationship path is the **actual filename, including extension**:

```json
"sourceBrief": {
  "links": { "self": "../launch-evidence-brief.md" }
}
```

Card-instance links can omit `.json` because card IDs are extensionless. **File links cannot** — the realm indexes files by extension-backed filename, so `MarkdownDef` files are indexed as `guide.md`, `sample.md`, etc., not the bare slug.

Symptom of dropping the extension: the file exists in the realm and indexes correctly as `MarkdownDef`, but the **parent card** doesn't appear in type-filtered search because the FileDef relationship fails to resolve. The card itself looks fine on disk; the problem is invisible from the UI.

Platform evidence: `packages/realm-server/tests/card-endpoints-test.ts` includes a `linksTo(MarkdownDef)` fixture using `self: '../instructions.md'`. File-meta tests confirm markdown files are indexed by their extension-backed filename.

For the wider story on `links.self` shapes (`./Foo/bar` vs `../Foo/bar` vs bare-specifier traps), see `boxel/references/card-references.md`.

---

## Raw images in published host mode

Keep the `linksTo(ImageDef)` relationship so publishing carries the file, but do not assume `image.url` is safe in a raw `<img>` tag on an anonymous published page. Prerendered data can retain an authenticated source-realm URL, which returns 401 to public visitors even though the asset exists in the published realm.

For raw tags, use a verified public URL or a root-relative path under the published realm's mount point. Prefer `/published-mount/assets/image.svg` over `./assets/image.svg`: the relative form changes meaning when the page is served both with and without a trailing slash. The built-in FileDef field renderer remains preferable when it owns fetching and rendering.

If card JSON and realm files are current but published HTML still contains an old asset URL, force a full source-realm reindex before publishing again.

The publication-side rules (the `containsMany` hoist, ImageDef's
background-image intrinsic-size gotcha, publish/republish mechanics) live in
`boxel-environment/references/publishing-host-mode.md`.

---

## Extensions without a dedicated subtype use generic FileDef

An `.html` realm resource is not indexed as `TextFileDef`. A card that owns
an HTML source must declare `@field file = linksTo(FileDef)` using the
default export from `https://cardstack.com/base/file-api`, keeping the
relationship target as the real extension-backed filename
(`./example.html`). The renderer can then fetch that FileDef URL as
authenticated bytes (e.g. into a sandboxed iframe). Do not duplicate the
markup into a string field or card JSON. Same recipe for any file format
without a dedicated base FileDef subtype.

---

## Thumbnails: capture chromeless domain surfaces, not card templates

FileDef thumbnail extraction must rasterize a purpose-built, chromeless
domain surface at its natural aspect ratio — never screenshot an `embedded`
or `isolated` card template. A card-template screenshot captures headers,
player controls, inspector rows, and CardContainer chrome that become
illegible when the image is reused inside fitted tiles. Prefer direct
canvas/SVG/WebGL capture from source-derived data, normalize to the
1280×800 thumbnail contract, and center the subject for safe cropping.
Applies to audio, video, fonts, PDF, MIDI, 3D, large images — any renderer
whose full template contains UI chrome unrelated to the preview subject.

---

## Sending private realm images to external AI providers

Private realm `ImageDef` URLs require Boxel authentication, so external AI
providers (OpenRouter/Gemini/etc.) get 401 fetching them. When the user has
explicitly approved sending the image to a named external provider: read it
inside Boxel with `ReadBinaryFileCommand`, construct a **transient**
`data:<mime>;base64,...` request part, and send that — never persist the
data URL or base64 bytes in card JSON. Treat it as a data-transmission
boundary: disclose the provider and get explicit approval before enabling
it. Validate `image/*`, omit SVG and oversized inputs, and isolate
per-image failures so one bad image doesn't fail the whole request.
