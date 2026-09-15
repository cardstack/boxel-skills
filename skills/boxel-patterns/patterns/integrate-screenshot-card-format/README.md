---
validated: source-proven
---

# integrate-screenshot-card-format — Capture a settled PNG **or PDF** of any card at `isolated` or `embedded` format

**What this gives you:** A reliable way for one card to take a *picture* of another card — at the format you choose — and store it as a real PNG file linked through `ImageDef`, **or export it as a paged PDF** (a print-ready document of the same settled render). The realm-server drives Puppeteer through the prerender pool to capture a fully-settled render (after data loads, animations resolve, layout completes), so the snapshot reflects what a user would see, not a half-loaded skeleton.

**PNG vs PDF — pick by what you're producing:** a **PNG** (the default) is a single raster of one viewport — the right output for thumbnails, og:images, tiles, and inline previews. A **PDF** (`type: 'pdf'`) paginates the same settled render onto paper — the right output when the deliverable is a *document*: a multi-page report, an invoice, anything the user will print, download, or archive. The PDF path also unlocks **print media** (`media: 'print'`) so the card's `@page` size and `@media print` CSS decide the paper and pagination. Both are covered below; jump to [Export as PDF](#export-as-pdf-type-pdf) for the PDF specifics.

**Sibling patterns:** [`automate-declared-screenshots`](../automate-declared-screenshots/README.md) — declarative, **self-refreshing** capture slots on the card class itself (thumbnails, og images, poster frames that re-capture on every edit). Prefer that whenever the card should *always* carry a current picture of itself; use **this** pattern for a *point-in-time* capture kept as a separate file (documentation, audit/before-after trails). [`integrate-thumbnail-card-ai`](../integrate-thumbnail-card-ai/README.md) — for **AI-generated** stylised thumbnails (designed icons, brand-mark tiles, catalog hero images) when the user wants a *designed representation* rather than any actual rendering; the catalog's `listing-create.autoGenerateThumbnail` uses it.

**When to use:**
- **Documentation cards / changelogs / before-after diffs** — snapshot a card at a point in time, store the PNG alongside the doc.
- **Social-share cards / Open Graph images** — render a designed `embedded` format, screenshot it, serve as `og:image`.
- **Marketing pages, design-system snapshots, portfolio captures** — programmatically render card galleries.
- **Audit / approval trails** — capture the visible state when a workflow card transitions.
- **Test fixtures** — anywhere a `.png` of a real render beats a hand-curated mock.
- **Printable documents (PDF)** — invoices, reports, statements, contracts, certificates: anything the user prints, downloads, or archives as a paged file. Use `type: 'pdf'` (see [Export as PDF](#export-as-pdf-type-pdf)), with `media: 'print'` when the card carries `@page`/`@media print` CSS.
- **Always-current embedded documents (durable PDF URL)** — a `_screenshot/…?type=pdf` URL rendered into a card re-captures itself whenever the source card is edited, so an embedded "download PDF" link never goes stale. See [Durable PDF URLs](#durable-pdf-urls-embed-instead-of-base64).

**The insight:** `ScreenshotCardCommand` (from `@cardstack/boxel-host/tools/screenshot-card`) is a Boxel host command that orchestrates the realm-server screenshot job end-to-end. You pass two inputs — the target card (as a `linksTo` reference) and a format string — and you get back an `imageDefUrl` you can render straight into an `<img>` or link from another card via `ImageDef` / `PngDef`. The realm-server enqueues the job, the worker drives a Puppeteer browser through the prerender pool, the PNG comes back as base64, and `WriteBinaryFileCommand` writes it to `Screenshots/<slug>-<uuid>.png` in the **target card's own realm**. Cards never see the bytes; you get a clean URL.

## Recipe shape

```ts
import ScreenshotCardCommand from '@cardstack/boxel-host/tools/screenshot-card';

// Inside an @action method:
let result = await new ScreenshotCardCommand(commandContext).execute({
  card,                  // the linked CardDef instance to screenshot
  format: 'isolated',    // 'isolated' or 'embedded' — nothing else
});

this.imageDefUrl = result.imageDefUrl;
// Now render directly:
//   <img src={{this.imageDefUrl}} />
// Or assign to a linksTo(ImageDef) field on another card:
//   anotherCard.thumbnail = new ImageDef({ id, url, sourceUrl: result.imageDefUrl });
```

The full demo card (`example.gts`) wraps this in a CardDef that:
- Holds the target via `@field card = linksTo(CardDef)`.
- Holds the format via `@field format = contains(enumField(StringField, { options: ['isolated', 'embedded'] }))`.
- Owns `@tracked isRunning`, `@tracked errorMessage`, `@tracked imageDefUrl` for UI state.
- Disables the action button until `commandContext` is available and a card is linked.

## API surface

| Input field | Type | Required | Notes |
|---|---|---|---|
| `card` | `linksTo(CardDef)` | yes | Must already be saved — the command needs a card id. |
| `format` | `'isolated' \| 'embedded'` | yes | **No other values accepted.** Fitted / atom / edit / markdown will throw. |
| `type` | `'png' \| 'pdf'` | no | Output encoding; default `png`. `pdf` paginates the settled render (see [Export as PDF](#export-as-pdf-type-pdf)). Incompatible with `fullPage`/`clip`/`target`. |
| `media` | `'screen' \| 'print'` | no | CSS media the render settles under; default `screen`. `print` engages the card's `@page`/`@media print` CSS — the paper-layout choice, matters most for `type: 'pdf'`. |

| Output field | Type | Notes |
|---|---|---|
| `imageDefUrl` | `string` | The file identifier returned by `WriteBinaryFileCommand`. Render with `<img src={{...}} />`, or use as the `sourceUrl` on a fresh `ImageDef` / `PngDef`. For a `type: 'pdf'` capture this is the paged document; link it rather than rendering it into an `<img>`. |

## How the realm-server does the work

1. `ScreenshotCardCommand.run()` POSTs `{ realmURL, cardId, format }` to `/_screenshot-card` on the realm-server.
2. The handler (`packages/realm-server/handlers/handle-screenshot-card.ts`) enqueues a `screenshot-card` job via the queue system.
3. The worker task (`runtime-common/tasks/screenshot-card.ts`) drives Puppeteer through the prerender pool to render the card at the requested format.
4. Puppeteer waits for the page to settle (data loads, animations, font swap, prerender hooks) before capturing.
5. The PNG comes back as base64, and the command writes it via `WriteBinaryFileCommand` to `Screenshots/<slug>-<uuid>.png` in the **target card's own realm**.
6. The realm indexer promotes the PNG into a `PngDef` / `ImageDef` card automatically.

You don't see any of this from the consumer side — `await new ScreenshotCardCommand(ctx).execute({ card, format })` returns when the file is on disk.

## Export as PDF (`type: 'pdf'`)

The same capture pipeline can emit a **paged PDF** instead of a raster. Add `type: 'pdf'` to the capture spec (the default is `type: 'png'`). Everything about settling the render is identical — nav, data loads, animations, font swap, image paint — but instead of one viewport screenshot you get a multi-page document of the whole settled card.

```ts
// One-off PDF capture — returns the paged document.
let result = await new ScreenshotCardCommand(commandContext).execute({
  card,
  format: 'isolated',
  type: 'pdf',          // 'png' (default) | 'pdf'
  media: 'print',       // 'screen' (default) | 'print' — see below
});
```

**When to reach for it:** the deliverable is a *document*, not a picture — an invoice, statement, report, contract, or certificate the user prints, downloads, or archives. If you only need a single-viewport image (thumbnail, og:image, tile), stay on the default PNG; a PDF of a one-screen card is just a one-page PDF with extra overhead.

### `media: 'screen'` vs `media: 'print'`

`media` chooses the CSS media the render settles under — it is independent of `type`, though it matters most for PDF:

- **`screen`** (default) — the render every screenshot has always captured: what the card looks like on screen. A `screen` PDF paginates that on-screen layout onto default paper.
- **`print`** — settles the render under **print media**, so the card's own print CSS decides the document: `@page { size: … }` sets the paper (A4, Letter, landscape), `@media print { … }` swaps in print-only styling, and `break-before`/`break-after`/`break-inside` control where pages split. Reach for this whenever the card author wrote print CSS — it's the difference between a PDF that *looks like the screen* and one that *is laid out for paper*.

A card controls its own pagination with standard print CSS in its template, e.g.:

```css
@page { size: A4; margin: 18mm; }
.invoice-section { break-inside: avoid; }
.page-break { break-after: page; }
```

With no `@page { size }` rule, the PDF falls back to Chrome's default paper (US **Letter**). Author an explicit `@page { size: A4 }` (or `Letter`, `Legal`, `… landscape`) when the paper matters.

### Bounds and over-bounds errors

A PDF capture is bounded **post-render** (the page count and byte size only exist once Chrome has paginated):

- **20 pages** maximum.
- **10 MB** maximum output.

Over either bound is a **capture error that names the cap** — never a silent truncation to 20 pages or a clipped file. If you hit it, the fix is upstream in the card's content or print CSS (fewer pages, lighter embedded images, tighter `@page` margins), not a retry. Treat an over-bounds error as "this card is too big to be one PDF," and surface it to the user rather than swallowing it.

`type: 'pdf'` is **singular-only** and refuses the raster crop modes — `fullPage`, `clip`, and `target` are contradictions for a paged document and are rejected at the spec parse. A PDF is always the whole settled render.

## Durable PDF URLs (embed instead of base64)

For the common case — a card that should carry an **always-current** "download / view PDF" link — don't capture base64 and store bytes. Compose a **durable serving URL** against the source card and embed *that*:

```
{realmURL}_screenshot/{card-path}?type=pdf
{realmURL}_screenshot/{card-path}?type=pdf&media=print          // print-CSS paper
```

For example, a PDF of the card `https://my.realm/Invoice/2026-0042` is:

```
https://my.realm/_screenshot/Invoice/2026-0042?type=pdf&media=print
```

This URL is served straight from the realm's MediaCache: a **ledger hit** on repeat requests (no re-render), a fresh capture on the first miss. Because the cache identity pins the source card's *generation*, **editing the card re-captures the PDF on the next fetch** — the embedded link is never stale. The response carries `Content-Disposition: inline` with a filename derived from the source card, so the browser's PDF viewer shows a sensible name.

Render it like any URL — an anchor, an `<iframe>`, or a `linksTo(FileDef)`-free plain link:

```gts
<a href={{this.pdfUrl}} target="_blank" rel="noopener">Download PDF</a>
```

```ts
import { realmURL } from '@cardstack/runtime-common';

get pdfUrl() {
  let card = (this.args.model as any)?.card;   // the linked CardDef instance
  let id: string | undefined = card?.id;        // its durable card URL
  let realm: string | undefined = card?.[realmURL]?.href; // its realm root
  if (!id || !realm) return undefined;
  let path = id.slice(realm.length);            // instance path within the realm
  return `${realm}_screenshot/${path}?type=pdf&media=print`;
}
```

(`realmURL` is the symbol re-exported from `@cardstack/runtime-common`; reading it off the linked card gives that card's own realm root, which is where the capture persists and serves from.)

Prefer this durable-URL form over a one-off base64 capture whenever the PDF is *of the card itself* and should track the card's content. Reach for the imperative `ScreenshotCardCommand` (`type: 'pdf'`) only when you need the bytes in hand at a point in time — a PDF snapshot archived as a separate file, detached from future edits.

## Wire as a card menu item

To make "Screenshot this card" a right-click affordance on every CardDef, compose with the [`link-command-menu-item`](../link-command-menu-item/README.md) pattern. The action body calls `ScreenshotCardCommand` with `this` as the card and a fixed format (or branches on a sub-menu):

```ts
import { getCardMenuItems, type GetCardMenuItemParams, type MenuItemOptions } from '@cardstack/runtime-common';
import ScreenshotCardCommand from '@cardstack/boxel-host/tools/screenshot-card';
import CameraIcon from '@cardstack/boxel-icons/camera';

class MyCard extends CardDef {
  [getCardMenuItems](params: GetCardMenuItemParams): MenuItemOptions[] {
    return [
      {
        label: 'Screenshot isolated',
        icon: CameraIcon,
        action: async () => {
          let result = await new ScreenshotCardCommand(params.commandContext)
            .execute({ card: this as any, format: 'isolated' });
          // Optionally show toast with result.imageDefUrl
        },
      },
      {
        label: 'Screenshot embedded',
        icon: CameraIcon,
        action: async () => {
          await new ScreenshotCardCommand(params.commandContext)
            .execute({ card: this as any, format: 'embedded' });
        },
      },
      ...super[getCardMenuItems](params),
    ];
  }
}
```

This gives every instance of `MyCard` two menu items that capture a settled PNG of itself into its own realm's `Screenshots/` directory — without needing a dedicated demo card.

## Gotchas

- **Format is restricted to `isolated` or `embedded`.** `fitted`, `atom`, `edit`, `markdown` will throw. The reason: only those two formats have stable browser-viewport semantics; fitted is container-driven and needs an explicit size envelope that the command doesn't expose.
- **Target card must be saved.** The command needs a card id. If you're in a draft / pre-save flow, save first.
- **Permission check is strict.** The command saves to the target card's realm. If the current user can't write there, it fails fast — no silent fallback to the user's home realm.
- **Output lands in `Screenshots/` of the target's realm, not the caller's.** If you screenshot a third-party realm's card and you have write access, the PNG lives over there.
- **Filenames are slug + uuid.** `<lowercased-last-url-segment>-<8-char-uuid>.png`. Stable for known cards, unique on collisions.
- **Long renders block the request.** The realm-server polls the job until completion (Puppeteer needs to settle the page). On a slow card or under load, expect a few seconds. Wrap in `@tracked isRunning` / show a spinner; don't `await` inside `getCardMenuItems` without surfacing progress.
- **commandContext must exist.** Only available in host interact mode — the prerenderer / SSR context doesn't have a live host. Feature-detect with `this.args.context?.commandContext` before calling.
- **`listing-create` does not use this command.** The catalog's listing-creation flow uses `GenerateThumbnailCommand` (AI-generated stylized icon, not a real screenshot). Use `ScreenshotCardCommand` when you want the actual rendered card, not an interpretation.
- **PDF is bounded, and over-bounds is an error, not a truncation.** 20 pages / 10 MB. A card that paginates past either cap fails the capture with a message naming the cap — fix the card (fewer pages, lighter images, tighter `@page` margins), don't retry. See [Export as PDF](#export-as-pdf-type-pdf).
- **PDF ignores the crop modes.** `type: 'pdf'` with `fullPage`, `clip`, or `target` is rejected at the spec parse — a paged document is always the whole settled render, so a crop is a contradiction.
- **`media: 'print'` only changes anything if the card has print CSS.** Under `print`, `@page`/`@media print`/`break-*` rules take effect; a card with none renders the same as `screen`, just on Chrome's default paper. Author `@page { size: … }` when the paper size matters, or the PDF is Letter.
- **Prefer a durable `?type=pdf` URL over stored bytes for an *of-the-card* PDF.** A one-off `type: 'pdf'` capture is a point-in-time file that won't track later edits. For an embedded "always current" PDF link, compose the [durable URL](#durable-pdf-urls-embed-instead-of-base64) instead — it re-captures when the card changes.

## Source

- Host command: `@cardstack/boxel-host/tools/screenshot-card` — `packages/host/app/tools/screenshot-card.ts` in the boxel monorepo.
- Realm-server endpoint: `POST /_screenshot-card` → `packages/realm-server/handlers/handle-screenshot-card.ts`.
- Durable serving URL: `GET {realm}_screenshot/{path}?type=pdf` → the MediaCache serving path (`packages/runtime-common/media-cache-serving.ts`); persisted by the worker task's PDF leg.
- Capture-spec axes (`type`, `media`) and the PDF bounds (`SCREENSHOT_PDF_MAX_PAGES`, `SCREENSHOT_PDF_MAX_BYTES`): `packages/runtime-common/capture-spec.ts`.
- Worker task: `packages/runtime-common/tasks/screenshot-card.ts`.
- Input/output types: `ScreenshotCardInput` / `ScreenshotCardOutput` in `packages/base/command.gts`.
- Proven example: `packages/experiments-realm/screenshot-card-demo.gts` — copied verbatim into this pattern's `example.gts`.

## See also

- [`integrate-thumbnail-card-ai`](../integrate-thumbnail-card-ai/README.md) — **paired sibling**: AI-generated thumbnails (`GenerateThumbnailCommand`) instead of real rendered captures. Same composition surface (file in realm + optional `cardInfo.cardThumbnail` patch).
- [`link-command-menu-item`](../link-command-menu-item/README.md) — wire screenshot capture as a card menu action.
- [`integrate-filedef-generated-image`](../integrate-filedef-generated-image/README.md) — the storage half of any generated-media workflow; explains how `WriteBinaryFileCommand` + `ImageDef` / `PngDef` compose with binary outputs.
- [`integrate-openrouter-image-generation`](../integrate-openrouter-image-generation/README.md) — lower-level OpenRouter image primitive that `GenerateThumbnailCommand` is built on top of.
- [`boxel/references/command-invocation-modes.md`](../../../boxel/references/command-invocation-modes.md) — the wider taxonomy of how to expose a Command.
