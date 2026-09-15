---
validated: source-proven
---

# integrate-screenshot-card-format — Capture a settled PNG of any card at `isolated` or `embedded` format

**What this gives you:** A reliable way for one card to take a *picture* of another card — at the format you choose — and store it as a real PNG file linked through `ImageDef`. The realm-server drives Puppeteer through the prerender pool to capture a fully-settled render (after data loads, animations resolve, layout completes), so the snapshot reflects what a user would see, not a half-loaded skeleton.

**Sibling patterns:** [`automate-declared-screenshots`](../automate-declared-screenshots/README.md) — declarative, **self-refreshing** capture slots on the card class itself (thumbnails, og images, poster frames that re-capture on every edit). Prefer that whenever the card should *always* carry a current picture of itself; use **this** pattern for a *point-in-time* capture kept as a separate file (documentation, audit/before-after trails). [`integrate-thumbnail-card-ai`](../integrate-thumbnail-card-ai/README.md) — for **AI-generated** stylised thumbnails (designed icons, brand-mark tiles, catalog hero images) when the user wants a *designed representation* rather than any actual rendering; the catalog's `listing-create.autoGenerateThumbnail` uses it.

**When to use:**
- **Documentation cards / changelogs / before-after diffs** — snapshot a card at a point in time, store the PNG alongside the doc.
- **Social-share cards / Open Graph images** — render a designed `embedded` format, screenshot it, serve as `og:image`.
- **Marketing pages, design-system snapshots, portfolio captures** — programmatically render card galleries.
- **Audit / approval trails** — capture the visible state when a workflow card transitions.
- **Test fixtures** — anywhere a `.png` of a real render beats a hand-curated mock.

**The insight:** `ScreenshotCardTool` (from `@cardstack/boxel-host/tools/screenshot-card`) is a Boxel host tool that orchestrates the realm-server screenshot job end-to-end. You pass two inputs — the target card (as a `linksTo` reference) and a format string — and you get back a `captures` list whose first entry's `url` you can render straight into an `<img>` or link from another card via `ImageDef` / `PngDef`. The realm-server enqueues the job, the worker drives a Puppeteer browser through the prerender pool, the PNG comes back as base64, and `WriteBinaryFileCommand` writes it to `Screenshots/<slug>-<uuid>.png` in the **target card's own realm**. Cards never see the bytes; you get a clean URL.

## Recipe shape

```ts
import ScreenshotCardTool from '@cardstack/boxel-host/tools/screenshot-card';

// Inside an @action method:
let result = await new ScreenshotCardTool(toolContext).execute({
  card,                  // the linked CardDef instance to screenshot
  format: 'isolated',    // 'isolated' or 'embedded' — nothing else
});

this.imageDefUrl = result.captures?.[0]?.url ?? null;
// Now render directly:
//   <img src={{this.imageDefUrl}} />
// Or assign to a linksTo(ImageDef) field on another card:
//   anotherCard.thumbnail = new ImageDef({ id, url, sourceUrl: this.imageDefUrl });
```

The full demo card (`example.gts`) wraps this in a CardDef that:
- Holds the target via `@field card = linksTo(CardDef)`.
- Holds the format via `@field format = contains(enumField(StringField, { options: ['isolated', 'embedded'] }))`.
- Owns `@tracked isRunning`, `@tracked errorMessage`, `@tracked imageDefUrl` for UI state.
- Disables the action button until `toolContext` is available and a card is linked.

## API surface

| Input field | Type | Required | Notes |
|---|---|---|---|
| `card` | `linksTo(CardDef)` | yes | Must already be saved — the command needs a card id. |
| `format` | `'isolated' \| 'embedded'` | yes | **No other values accepted.** Fitted / atom / edit / markdown will throw. |

| Output field | Type | Notes |
|---|---|---|
| `captures` | `{ url, … }[]` | One entry per capture; `captures[0].url` is the durable served URL of the PNG. Render with `<img src={{...}} />`, or use as the `sourceUrl` on a fresh `ImageDef` / `PngDef`. |

## How the realm-server does the work

1. `ScreenshotCardTool.run()` POSTs `{ realmURL, cardId, format }` to `/_screenshot-card` on the realm-server.
2. The handler (`packages/realm-server/handlers/handle-screenshot-card.ts`) enqueues a `screenshot-card` job via the queue system.
3. The worker task (`runtime-common/tasks/screenshot-card.ts`) drives Puppeteer through the prerender pool to render the card at the requested format.
4. Puppeteer waits for the page to settle (data loads, animations, font swap, prerender hooks) before capturing.
5. The PNG comes back as base64, and the command writes it via `WriteBinaryFileCommand` to `Screenshots/<slug>-<uuid>.png` in the **target card's own realm**.
6. The realm indexer promotes the PNG into a `PngDef` / `ImageDef` card automatically.

You don't see any of this from the consumer side — `await new ScreenshotCardTool(ctx).execute({ card, format })` returns when the file is on disk.

## Wire as a card menu item

To make "Screenshot this card" a right-click affordance on every CardDef, compose with the [`link-command-menu-item`](../link-command-menu-item/README.md) pattern. The action body calls `ScreenshotCardTool` with `this` as the card and a fixed format (or branches on a sub-menu):

```ts
import { getMenuItems } from '@cardstack/runtime-common';
import { type GetMenuItemParams } from '@cardstack/base/card-api';
import { type MenuItemOptions } from '@cardstack/boxel-ui/helpers';
import ScreenshotCardTool from '@cardstack/boxel-host/tools/screenshot-card';
import CameraIcon from '@cardstack/boxel-icons/camera';

class MyCard extends CardDef {
  [getMenuItems](params: GetMenuItemParams): MenuItemOptions[] {
    return [
      {
        label: 'Screenshot isolated',
        icon: CameraIcon,
        action: async () => {
          let result = await new ScreenshotCardTool(params.toolContext)
            .execute({ card: this as any, format: 'isolated' });
          // Optionally show toast with result.captures[0].url
        },
      },
      {
        label: 'Screenshot embedded',
        icon: CameraIcon,
        action: async () => {
          await new ScreenshotCardTool(params.toolContext)
            .execute({ card: this as any, format: 'embedded' });
        },
      },
      ...super[getMenuItems](params),
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
- **Long renders block the request.** The realm-server polls the job until completion (Puppeteer needs to settle the page). On a slow card or under load, expect a few seconds. Wrap in `@tracked isRunning` / show a spinner; don't `await` inside `getMenuItems` without surfacing progress.
- **toolContext must exist.** Only available in host interact mode — the prerenderer / SSR context doesn't have a live host. Feature-detect with `this.args.context?.toolContext` before calling.
- **`listing-create` does not use this command.** The catalog's listing-creation flow uses `GenerateThumbnailCommand` (AI-generated stylized icon, not a real screenshot). Use `ScreenshotCardTool` when you want the actual rendered card, not an interpretation.

## Source

- Host command: `@cardstack/boxel-host/tools/screenshot-card` — `packages/host/app/tools/screenshot-card.ts` in the boxel monorepo.
- Realm-server endpoint: `POST /_screenshot-card` → `packages/realm-server/handlers/handle-screenshot-card.ts`.
- Worker task: `packages/runtime-common/tasks/screenshot-card.ts`.
- Input/output types: `ScreenshotCardInput` / `ScreenshotCardOutput` in `packages/base/command.gts`.
- Proven example: `packages/experiments-realm/screenshot-card-demo.gts` — copied verbatim into this pattern's `example.gts`.

## See also

- [`integrate-thumbnail-card-ai`](../integrate-thumbnail-card-ai/README.md) — **paired sibling**: AI-generated thumbnails (`GenerateThumbnailCommand`) instead of real rendered captures. Same composition surface (file in realm + optional `cardInfo.cardThumbnail` patch).
- [`link-command-menu-item`](../link-command-menu-item/README.md) — wire screenshot capture as a card menu action.
- [`integrate-filedef-generated-image`](../integrate-filedef-generated-image/README.md) — the storage half of any generated-media workflow; explains how `WriteBinaryFileCommand` + `ImageDef` / `PngDef` compose with binary outputs.
- [`integrate-openrouter-image-generation`](../integrate-openrouter-image-generation/README.md) — lower-level OpenRouter image primitive that `GenerateThumbnailCommand` is built on top of.
- [`boxel/references/command-invocation-modes.md`](../../../boxel/references/command-invocation-modes.md) — the wider taxonomy of how to expose a Command.
