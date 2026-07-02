# Extension libs — pre-built bundles the agent can upload to a user's realm

This folder ships the **actual dist files** for the workspace's realm-bundled libraries. When a user is building a card that imports `bxl`, `surfaces`, `ember-flow`, or `pretext` and the target realm doesn't have that library yet (or has an outdated copy), the agent can upload the appropriate subtree here into the realm so the imports resolve.

The portable skill tree under `.claude/skills/` describes patterns. The `.claude/extensions/` folder documents the import conventions per library (`library-bxl`, `library-surfaces`, etc.). This folder (`.claude/extension-libs/`) is the **content** — the bytes the agent puts into a realm to make those imports work.

## What's here

| Library | Subdir | Size | Source snapshot |
|---|---|---|---|
| **bxl** — JQXL + Excel formulas | `bxl/` | ~1 MB | `realms-staging.stack.cards/ctse/glorious-earwig/bxl/` |
| **surfaces** — UI framework (Layout / Pane / Form / Grid / Cell / Run / Lift) + **table support** (TanStack table-core inlined into `grid/`) + **scene support** (ember-lume POC primitives inlined into `scene/`) | `surfaces/` | ~7.9 MB | `dist-realm/surfaces/` build output of the surfaces source repo (local checkout). Manifest reports the version + `builtAt` timestamp. |
| **ember-flow** — XYFlow-style node-graph editor | `ember-flow/` | ~700 KB | `realms-staging.stack.cards/ctse/persistent-possum/ember-flow-dependencies.js` + `ember-flow-markdown-dependencies.js` |
| **pretext** — Two-phase canvas text-measurement engine | `pretext/` | ~76 KB | `realms-staging.stack.cards/ctse/electoral-rooster/pretext-*.gts` + `PRETEXT-GUIDE.md` |

Each subtree mirrors what the realm serves. Filenames inside (`index.ts`, `chunks/`, `bxl-chunks/`, manifest, etc.) are part of the bundle — preserve them exactly when copying to a realm.

**Surfaces sub-bundles to know:**

- `surfaces/grid/index.js` re-exports `@tanstack/table-core` (filter, sort, group, paginate, column visibility, column pinning, expansion). When a user wants a **table**, this is what they reach for. Import `Row`, `RowData`, `Table`, `TableFeatures`, `createTable`, `getCoreRowModel`, `getSortedRowModel`, etc. from `<realm>/surfaces/grid/index.js` (or via the top-level `<realm>/surfaces/index.js` re-export).
- `surfaces/scene/index.js` carries the **scene runtime** (camera-drag, wheel-momentum, scene-fx, halo modifier, scene-node-frame). Adapted from the ember-lume Spatial Lounge POC, ported verbatim where the API was clean. Use for spatial/canvas surfaces that need depth and gestural pan/zoom.
- `surfaces/canvas/index.js` is the canvas surface (XYFlow-flavored alternative to ember-flow that's native to surfaces — these may converge over time).
- `surfaces/layout/index.js` is the Layout/Pane/Form/Grid/Cell/Run/Lift primitives most cards reach for first.

## When to upload

The agent should upload from this folder when **all three** are true:

1. The user is building a card whose imports reference a library URL (e.g. `https://<realm-url>/bxl`, `/surfaces/index.js`, `/ember-flow-dependencies.js`).
2. The target realm does not have the library at that URL — confirmed by `boxel file list <realm>/<subdir>` returning empty, or the import resolving to a 404 in the live app.
3. The user is okay with the agent installing the library (ask if non-obvious).

The agent may also upload when the library exists in the realm but is suspected stale — a card fails to compile with errors that look like missing exports the snapshot here provides. In that case the agent should:

- Diff the realm's current version against the snapshot here (`boxel file read <realm>/<lib>/index.ts` vs `cat .claude/extension-libs/<lib>/index.ts`).
- If the snapshot is newer or more complete, upload over the realm's copy.
- If the realm's copy is newer than the snapshot, leave it alone — the user has a fresher build than what's in the skill tree. (The skill tree is a baseline, not the source of truth.)

## How to upload

Three options, in order of preference for size:

### 1. `boxel realm push` (single batch, recommended for surfaces / bxl)

Mount the extension-libs subtree at the right place inside the target realm's local working copy, then push:

```bash
# Pull the target realm if you don't already have it locally
boxel realm pull <realm-url> /tmp/<realm-slug>

# Copy the library subtree into the realm's directory tree
cp -R .claude/extension-libs/<lib>/ /tmp/<realm-slug>/<lib>/

# Push back to the realm
boxel realm push /tmp/<realm-slug> <realm-url>
```

After the push, the library is available at `<realm-url>/<lib>/index.<ts|js>`. Cards in any realm can now import from that URL.

### 2. `boxel file write` per-file (for small libraries / single files like ember-flow)

```bash
boxel file write <realm-url>/ember-flow-dependencies.js \
  < .claude/extension-libs/ember-flow/ember-flow-dependencies.js
```

This is the right call for the **two single-file ember-flow bundles** — push them straight into the realm root rather than wrap them in a directory.

### 3. Programmatic via `WriteBinaryFileCommand` (when authoring an install Command)

When the upload is part of a Command (e.g. a "Set up this realm for bxl" install workflow), use `WriteBinaryFileCommand` inside the Command's `run()` body. Read the snapshot files at module scope, write them to the target realm path-by-path. Pattern: `boxel-patterns/patterns/command-atomic-install` shows the transactional shape; use it when uploading many files at once so they land all-or-nothing.

## After upload — verify it works

Don't declare the upload done until imports actually resolve:

1. Read back one file: `boxel file read <realm-url>/<lib>/index.ts` (or `.js`) — confirm the bytes match.
2. Try the canonical import from a test card: write a tiny `.gts` that imports one named symbol from the new URL and renders it. The realm's lint should pass.
3. If the user's realm is `common-libs`-style (a dedicated library realm consumed by other realms), confirm at least one downstream card actually imports from the new URL successfully. Run `boxel file lint` on a card that uses the library.

## Freshness

These bundles are point-in-time snapshots. The canonical sources (listed in the table above) may evolve. When the agent encounters either of these:

- A user reports the library is missing exports that the agent expected.
- A user mentions their team rebuilt one of the libraries recently.

The agent should re-snapshot from the canonical source realm (or whatever the user names as the current authoritative location) into this folder. Commit the refresh — keep the skill tree's baseline current.

## Per-library import URLs (after upload)

| Library | URL after upload to `<realm>` |
|---|---|
| bxl | `<realm>/bxl` (resolves to `<realm>/bxl/index.ts` via the realm's resolver, or via a `bxl.ts` shim — see `organize-realm-bundle-shim`) |
| surfaces | `<realm>/surfaces/index.js` |
| ember-flow | `<realm>/ember-flow-dependencies.js` (and `<realm>/ember-flow-markdown-dependencies.js` for the markdown variant) |
| pretext | Inlined into each card's `.gts` — copy the engine block from `pretext/pretext-modifier.gts` directly into the card. Pretext doesn't ship as a separate import URL because Boxel's GTS compiler requires modules to export a CardDef/FieldDef class with a template; a standalone utility `.gts` without `<template>` won't compile. |

For the **import statement** for each library, see the matching extension pattern under `.claude/extensions/library-<lib>/README.md`. The IMPORTS.md file at `realms-staging.stack.cards/ctse/common-libs/IMPORTS.md` has the full copy-paste import block for bxl + surfaces + ember-flow.

## What's NOT here as a separate bundle

- **ember-lume** — the relevant POC primitives are **already inlined into `surfaces/scene/`** (wheel-momentum, halo-modifier, scene-fx, scene-node-state, scene-runtime). The original POC under the surfaces source repo's `test-app/lib/ember-lume/` is reference-only source. Use surfaces' scene exports rather than reaching for ember-lume directly.
- **TanStack table-core / store** — already **re-exported through `surfaces/grid/index.js`**. Don't `import` from `@tanstack/table-core` URLs in card code — go through surfaces' grid module. That way the version is pinned to whatever the surfaces build was tested against.
- **CDN-loaded libraries** (Three.js, Tone.js, Leaflet, chess.js) — these come over HTTP from `esm.run` / `esm.sh` per-card, not from realm bundles. Their integration patterns live under `.claude/skills/boxel-patterns/patterns/integrate-*-via-cdn/`.

## See also

- `.claude/extensions/library-bxl/README.md` — bxl import statements + usage.
- `.claude/extensions/library-surfaces/README.md` — surfaces import statements + usage.
- `.claude/extensions/library-ember-flow/README.md` — ember-flow import + node/edge model.
- `.claude/extensions/library-pretext/README.md` — pretext engine inlining + recipe.
- `.claude/extensions/organize-realm-bundle-shim/README.md` — the shim convention for re-exporting a bundle from a different URL.
- `boxel-patterns/references/libraries.md` Tier 3 — realm-bundled library import shape.
- `boxel-patterns/references/integration-surfaces.md` §6 — capability-level catalogue of realm-bundled library kinds.
