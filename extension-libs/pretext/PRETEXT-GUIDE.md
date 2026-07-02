# Pretext Layout Engine in Boxel

A guide for Boxel developers on how the multi-column article card uses canvas-based text measurement to achieve layouts that CSS alone cannot do.

---

## The Problem

CSS `column-count` gives you newspaper columns, but text flows uniformly — every line is the same width. You can't make text wrap around a circular image mid-column, or vary line widths based on arbitrary geometry. That requires knowing the exact pixel width of each word *before* deciding where lines break.

The browser can tell you word widths via `getBoundingClientRect()`, but every call forces a synchronous layout reflow. Measure 500 words and the browser re-layouts the entire page 500 times. At 30ms+ per batch, this kills interactivity.

## The Solution: Two-Phase Text Measurement

Pretext (by Chen Glou / Sebastian Markbage) solves this with a two-phase architecture:

```
Phase 1: prepare(text, font)     — ~19ms for 500 texts
  Segments text via Intl.Segmenter (handles CJK, Thai, Arabic, emoji)
  Measures each segment via canvas measureText()
  Caches widths in a Map — no DOM reads

Phase 2: layout(prepared, width)  — ~0.09ms for 500 texts
  Pure arithmetic on cached widths
  No canvas calls, no DOM reads, no string operations
  Can run on every frame during resize animation
```

Phase 1 runs once when text appears. Phase 2 runs on every resize — and it's fast enough to run at 60fps because it's just addition and comparison on cached numbers.

## How It Works in Boxel

### File Structure

```
electoral-rooster/
  multi-column-article.gts    — Card definition + inlined pretext engine
  MultiColumnArticle/
    sample-article.json        — Card instance with article content
```

The pretext engine is inlined directly in the `.gts` file because Boxel's GTS compiler requires modules to export CardDef/FieldDef classes with templates. A standalone utility `.gts` without a `<template>` won't compile. Inlining avoids cross-module import issues.

### Architecture

```
┌─────────────────────────────────────────────┐
│  Boxel Card (Glimmer Component)             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  <template>                         │    │
│  │    <article>                        │    │
│  │      <h1>  ← DOM (headline)         │    │
│  │      <blockquote> ← DOM (pull quote)│    │
│  │      <canvas {{canvasColumns}}>     │    │
│  │        ↑ Ember Modifier drives this │    │
│  │    </article>                       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  CanvasColumns Modifier             │    │
│  │    1. Pre-load images (cached)      │    │
│  │    2. prepareText(body, font)       │    │
│  │    3. For each column:              │    │
│  │       For each line:                │    │
│  │         Compute available width     │    │
│  │         (subtract obstacle area)    │    │
│  │         layoutNextLine(prep, w)     │    │
│  │         ctx.fillText(line, x, y)    │    │
│  │    4. ResizeObserver + RAF debounce │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Pretext Engine (inlined)           │    │
│  │    prepareText()  → segment + cache │    │
│  │    layoutNextLine() → cursor-based  │    │
│  │    measureSeg()   → canvas.measure  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### The Key API: layoutNextLine()

This is the function that makes multi-column and obstacle routing possible:

```typescript
layoutNextLine(prepared, segmentIndex, graphemeIndex, maxWidth)
  → { text, width, endSegmentIndex, endGraphemeIndex } | null
```

It returns one line of text that fits within `maxWidth`, plus a cursor (`endSegmentIndex`, `endGraphemeIndex`) pointing to where the next line should start. Pass that cursor to the next call, and text flows continuously.

**Multi-column flow** works by passing the cursor from one column to the next:

```
Column 1: cursor starts at (0, 0)
  line 1 → cursor moves to (5, 0)
  line 2 → cursor moves to (9, 0)
  ...column full...

Column 2: cursor continues from (9, 0)
  line 1 → cursor moves to (14, 0)
  ...
```

**Obstacle routing** works by varying `maxWidth` per line:

```
Line at y=100, no obstacle:     maxWidth = 350px (full column)
Line at y=120, circle overlaps: maxWidth = 210px (column minus chord)
Line at y=140, circle center:   maxWidth = 180px (narrowest)
Line at y=160, circle overlaps: maxWidth = 210px (widening)
Line at y=180, past obstacle:   maxWidth = 350px (full column again)
```

CSS cannot do this — `shape-outside` only works with floated elements, not arbitrary geometry mid-column.

### Obstacle Geometry

For circular obstacles, we compute how much of each line band is blocked:

```
Given: circle center (cx, cy), radius r
For line band [lineTop, lineBottom]:
  1. Find the vertical midpoint of the band
  2. Compute horizontal chord width at that y:
     halfChord = sqrt(r² - (yMid - cy)²)
  3. Subtract chord + padding from column width
  4. Return available width for this line
```

This runs per-line but it's just two multiplies, a sqrt, and a subtract — negligible cost.

### Resize Handling

Boxel cards resize independently of the browser window (the Boxel UI has its own container resize). The pattern follows pretext's original demos:

```
ResizeObserver fires (container changed)
  → scheduleRender()
    → if RAF already pending, skip (debounce)
    → requestAnimationFrame(() => {
        if width unchanged, skip (jitter filter)
        renderColumns(canvas, text, cols, font, lineHeight)
      })
```

Key decisions:
- **ResizeObserver** (not `window.resize`) because Boxel cards resize via the UI
- **RAF debounce** — only one render per animation frame, even if ResizeObserver fires multiple times
- **Width-change gate** — skip re-render if the integer width hasn't changed (prevents sub-pixel jitter thrashing)

### Image Handling

Images in obstacles are pre-loaded once into a module-level `Map<string, HTMLImageElement>` cache. The render function reads from this cache synchronously — it never creates `new Image()` during render. This prevents the gray-flash-while-loading problem that happens when images are re-created on every resize tick.

```
Module load:
  _imageCache = new Map()

First render:
  preloadImages(callback)
    → new Image() for each URL (once only)
    → img.onload → cache.set(url, img)
    → all loaded → callback() → first render

Subsequent renders (resize):
  _imageCache.get(url) → already loaded → ctx.drawImage() → instant
```

## Canvas vs DOM: When to Use Each

The card uses **both**:
- **DOM** for the headline, byline, section label, pull quote — these benefit from CSS styling, theme variables, accessibility, and text selection
- **Canvas** for the multi-column body text with obstacle routing — this requires per-line variable width that CSS cannot express

You could also use pretext to drive DOM-based layouts:

```typescript
// Use pretext for measurement, render with DOM
const prepared = prepareText(text, font);
const columns: string[][] = [[], [], []];
let si = 0, gi = 0;

for (let col = 0; col < 3; col++) {
  for (let row = 0; row < linesPerCol; row++) {
    const line = layoutNextLine(prepared, si, gi, colWidth);
    if (!line) break;
    columns[col].push(line.text);
    si = line.endSegmentIndex;
    gi = line.endGraphemeIndex;
  }
}

// Then render columns[0], columns[1], columns[2] as <div> elements
// with {{#each}} in the Glimmer template
```

This gives you CSS styling and text selection but loses the obstacle-routing capability (since DOM elements can't have per-line variable widths without one `<div>` per line).

## Extending This

Ideas for what you could build with this engine:

- **Text around card embeds** — Route article text around embedded Boxel cards positioned as obstacles
- **Masonry text grid** — Use `layout()` to predict text height, pack cards into a gap-free grid
- **Shrink-wrap bubbles** — Use `walkLineRanges()` to find the tightest container width for chat messages
- **Balanced columns** — Binary search the column height that makes all columns end at the same point
- **Drop caps and pull quotes** — Variable-width first lines around decorative elements (already implemented)
- **Canvas + DOM hybrid** — Use canvas for complex routing, DOM for interactive/selectable text regions

## Credits

- **Pretext** by Chen Glou, based on Sebastian Markbage's text-layout research
- **Boxel adaptation** inlines the core engine (prepare, measure, line-break) into a single `.gts` card definition
- Licensed MIT
