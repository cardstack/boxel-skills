---
validated: source-proven
---

# library-pretext — Two-phase canvas text measurement for layouts CSS can't do

**What this gives you:** _TODO: one-line outcome._ Multi-column flowing text with obstacle routing (text wraps around arbitrary shapes mid-column), 60fps resize, no per-line DOM reflows.

**When to use:** _TODO: name the situations._ Multi-column magazine layouts; text wrapping around circular images or non-rectangular obstacles; shrink-wrap chat bubbles; balanced columns; anywhere `column-count` and `shape-outside` aren't enough.

**The insight:** _TODO: condense the two-phase trick._ Pretext (Chen Glou / Sebastian Markbage) splits layout into `prepare(text, font)` — runs once, segments via `Intl.Segmenter` + measures via canvas `measureText()`, caches widths — and `layout(prepared, width)` — pure arithmetic on cached widths, no DOM reads, fast enough to call per-frame during resize.

## Where it lives in this workspace

_TODO: name the canonical realm + file paths._

- Canonical reference: `PRETEXT-GUIDE.md` snapshotted at `.claude/extension-libs/pretext/PRETEXT-GUIDE.md` (full 217-line guide).
- Inlined engine + worked card: a `multi-column-article.gts` card in the workspace + sample instance under `MultiColumnArticle/`.
- Modifier: `pretext-modifier.gts` (~349 lines).
- Demo / showcase: `pretext-demo.gts`, `pretext-showcase.gts`.
- **Snapshot for the agent**: [`.claude/extension-libs/pretext/`](../../extension-libs/pretext/) ships the canonical `pretext-modifier.gts`, `pretext-demo.gts`, `pretext-showcase.gts`, and `PRETEXT-GUIDE.md`. Unlike bxl / surfaces / ember-flow, pretext isn't shipped as a separate import URL — copy the engine block from `pretext-modifier.gts` directly into the consuming card's `.gts` (Boxel's GTS compiler requires modules to export a CardDef/FieldDef with a template; a standalone utility `.gts` won't compile).

The engine is **inlined into the `.gts` file** because Boxel's GTS compiler requires modules to export CardDef/FieldDef classes with templates. A standalone utility `.gts` without a `<template>` won't compile. Inlining sidesteps cross-module import friction.

## Recipe shape

_TODO: minimal worked snippet._ Show the modifier wiring, the `prepareText` / `layoutNextLine` pair, and the ResizeObserver + RAF debounce.

```ts
// _TODO: minimal import block_

// _TODO: prepareText(body, font) — segment + cache_

// _TODO: layoutNextLine(prepared, segmentIndex, graphemeIndex, maxWidth) — returns one line + cursor_

// _TODO: modifier — wires canvas, runs preload, drives renderColumns on ResizeObserver_
```

## The API surface

_TODO: name the three functions and what each returns._

| Function | Phase | Returns |
|---|---|---|
| `prepareText(text, font)` | Phase 1 | `Prepared` — segments + cached widths |
| `layoutNextLine(prepared, segIdx, graphemeIdx, maxWidth)` | Phase 2 | `{ text, width, endSegmentIndex, endGraphemeIndex } \| null` |
| `measureSeg(ctx, text)` | Internal | canvas `measureText` wrapper |

## Multi-column flow

_TODO: how the cursor (segmentIndex, graphemeIndex) flows from one column to the next, why it makes columns continuous._

## Obstacle routing

_TODO: per-line `maxWidth` variation. Worked example: circular image obstacle._

```
Line at y=100, no obstacle:     maxWidth = 350px (full column)
Line at y=140, circle center:   maxWidth = 180px (narrowest)
Line at y=180, past obstacle:   maxWidth = 350px (full column again)
```

## Gotchas

_TODO: capture the resize debounce, the image-cache trick, the width-change gate. Pull from PRETEXT-GUIDE.md if you want it verbatim._

- **ResizeObserver, not `window.resize`.** Boxel cards resize via the UI, independently of the browser window.
- **RAF debounce.** One render per animation frame, even if ResizeObserver fires multiple times.
- **Width-change gate.** Skip re-render if the integer width hasn't changed — prevents sub-pixel jitter thrashing.
- **Pre-load images into a module-level cache** so `ctx.drawImage` is synchronous on every resize tick. Otherwise the gray-flash-while-loading shows on each render.

## Canvas vs DOM

_TODO: how the card mixes both — DOM for headline/byline/pull-quote (theming, accessibility, selection), canvas for body text with obstacle routing._

You can also drive **DOM-based layouts** with pretext: use `layoutNextLine` for measurement, render columns as `<div>` lists with `{{#each}}`. Gains theme cascade + text selection; loses the per-line variable-width obstacle routing.

## Extensions worth considering

_TODO: ideas the guide already names._

- Text around card embeds (route around embedded Boxel cards as obstacles).
- Masonry text grid (predict text height, pack cards gap-free).
- Shrink-wrap chat bubbles (tightest container width).
- Balanced columns (binary search the column height that ends all columns evenly).
- Drop caps and pull quotes (variable-width first lines).

## Source

- Pretext by Chen Glou, based on Sebastian Markbage's text-layout research. MIT.
- Adapted into Boxel by inlining the engine into a single `.gts`.

## See also

_TODO: cross-link to portable patterns when relevant._

- `boxel/references/external-libraries.md` — the general "load a library at module scope, drive it from a modifier" pattern.
- `integrate-three-js-via-cdn` — sibling modifier-lifecycle pattern (different surface — WebGL — but same shape).
