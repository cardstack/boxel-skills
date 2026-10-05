# Layout vocabulary — eight named moves, and how each is built in a card

Part of [`boxel-design`](../SKILL.md); read by both the quick-mockup path and [`design-direction`](../../design-direction/SKILL.md). Links are relative to this file.

**Sections first, moves second.** Decide the page's sections from what the visitor is there to
decide (the index's "Just build it" step 3, or the brief's content contract). Then use a move only
where a section has the problem that move solves. Zero, one or two moves is normal, and a plain
stacked page is a valid answer. A section order carried over from other sites is not a move; it is
the thing to justify.

**The first screen is not a move.** It shows the answer to the visitor's first question at full
size, with the headline as its caption. A move only shapes that answer once it is chosen; it never
supplies the first screen's composition on its own.

Each move below says what it is **for** and when **not** to use it. A move picked because it is on
this list, or because heroes "have two sides", is the copied look this file exists to prevent.
[`layout-gravity.md`](../../design-direction/references/layout-gravity.md) lists what to resist.
Each entry gives the effect, the card implementation, and the constraint a card adds that a web
page does not have.

**Standing constraint.** An isolated card is `height: 100%; overflow-y: auto` inside a host pane.
"The viewport" means the card's own box. "The page edge" means the card edge. Every width rule
below is a container query against `fitted-card` or the card root, never a viewport media query.

| # | Move | For | Not when |
|---|---|---|---|
| 1 | Layered surface | the one or two items that act or lead need to lift off the ground | every box gets it |
| 2 | Bento | four to seven items of genuinely different weight and kind | the items are parallel (services, steps, tiers): those are a list or a table |
| 3 | Masonry | images of mixed native shapes that should not be cropped alike | uniform product shots, or text |
| 4 | Unequal split | one dominant thing (a photo, a number, one sentence) with a small quiet companion | both halves are text, or the section only has two sides because heroes usually do |
| 5 | Edge overlap | two things the reader must connect, such as the price on the photo of what it buys | the overlapping piece is a badge, a rating or an availability card added for depth |
| 6 | Editorial type | the words themselves are the subject | dense interface, scanning, data |
| 7 | Bleed | an image that should feel bigger than the page | a small or decorative image |
| 8 | Sticky scroll | the reader needs one panel of context while changing chapters pass | short or unrelated chapters |

## 1 · Layered surface

Depth from three cheap cues together: a hairline border, a soft low-opacity shadow, and one
background step between page and card. Any one alone reads as a flat box.

- Border `1px solid` at low contrast (`color-mix(in srgb, var(--foreground) 10%, transparent)`),
  shadow two layers (a tight 1–2px and a wide 16–32px at ≤12% opacity), surface one step off
  `--background` (`--card` or `--muted`). Tokens only; no hex.
- Elevation by role, as in the gravity table: containers sit at rest, the actionable item lifts.
  Shadow is punctuation, not chrome ([`critical-rules.md`](critical-rules.md) *Shadow Everything*):
  apply the two-layer shadow to the one or two items that act or lead, never to every box.
- **Check:** with the shadow removed, the card is still separable from the ground by border and tone.

## 2 · Bento

One dominant tile, supporting tiles at smaller and varied spans. Answers *Equal-card grid* and
*Identical tiles*.

- `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-flow: dense;`
  then `grid-column: span 2; grid-row: span 2` on the lead tile. Span follows the content
  contract's priority order, not the item's data size.
- Collapse by container query: 4 columns → 2 → 1, and the lead tile drops to `span 2` then `span 1`.
- Each tile is its own format (`embedded` or `fitted`); the lead may be a richer one. Name the
  owner of the cell size ([`delegated-render-control.md`](../../boxel-ui-guidelines/references/delegated-render-control.md)).
- **Check:** three distinct tile sizes at most. More than that is noise, not hierarchy.

## 3 · Masonry

Uneven heights at native aspect ratio, in place of a uniform crop. For galleries and portfolios.

- Use CSS columns for a static set: `column-count: 3; column-gap: …;` with
  `break-inside: avoid` on each item. Order runs down each column, so it suits a set with no
  strict sequence.
- Where reading order matters, use a grid with a per-item `aspect-ratio` and `grid-row: span N`
  computed from it, or accept a uniform row-height justified strip instead.
- Never `object-fit: cover` to a fixed box here; that is the uniform crop the move replaces.
- Reserve each item's box before load. Use the `ImageDef` `width` and `height` when they are
  filled; they can be empty, and an `ImageSourceField` in URL mode has none. Then fall back to a
  declared `aspect-ratio` per item (or `naturalWidth` / `naturalHeight` once loaded), so the layout
  does not jump.
- **Check:** no item is cropped to a shape its photographer did not frame.

## 4 · Unequal split

One dominant thing and a quiet companion at unequal weight, so the eye has an anchor.

- `grid-template-columns: minmax(0, 2fr) minmax(0, 3fr)`. The subject takes the 3.
- Below the container breakpoint, stack with the subject first.
- The subject is the dominant object from Phase 2; the text column holds the one action.
- **Check:** at no width does it sit at 50/50 on the way between layouts.

## 5 · Edge overlap

One element laps onto another's edge because the reader must read them together — the price on
the photo of what it buys — so they read as one thing stacked in space.

- A negative margin or `translate` (`margin-block-start: calc(var(--space) * -1)`), `position:
  relative; z-index: 1` on the overlapping element, and a border or surface that separates it
  from the image under it.
- Keep it to one or two overlaps, offset by a fixed small amount. This is the *Layered* spatial
  model; it is the same cue as move 1 applied across elements.
- Never let the overlapped region hide the subject's face or key detail. It laps the edge.
- At `fitted` sizes, drop the overlap: clipped overflow reads as a bug at small boxes.
- **Check:** at the narrowest width, the overlap has not covered text or been clipped.

## 6 · Editorial type

Hierarchy carried by type scale and rhythm instead of boxes.

- One headline at a clearly larger step than anything else (a ratio of 3× or more to body), light
  weight at large size and bold at tiny, per [`design-playbook.md`](../../boxel/references/design-playbook.md)
  weight rhythm. Pair with an eyebrow and one rule.
- Stagger text and image across a 12-column grid: text on columns 1–6, image on 5–12, offset a row.
- Pull-quote, drop cap or oversized numeral as one or two micro-objects, not all of them.
- Matches [`screen-types.md`](../../design-direction/references/screen-types.md) record C (Editorial) and collection B (Magazine).
- **Check:** squint, and you can still read three levels of hierarchy with no boxes.

## 7 · Bleed

The text stays on the measure while the image ignores it.

- The card root has padding; the image wrapper breaks out with negative inline margin equal to
  that padding, or the root has none and the text wrapper carries it. Width of copy stays
  `max-width: 65ch` or the grid's text column.
- "To the edge" is **the card's edge**. A card does not own the browser window, so a bleed to the
  screen edge is not available. Say "to the card edge" in the direction.
- Keep the image's focal point inside the safe region, since the crop changes with pane width.
- **Check:** at the narrowest pane the image still reaches both edges, and no text touches an edge.

## 8 · Sticky scroll

One region holds while a sequence of chapters passes beside it.

- Two columns inside the card's own scroller. The held column is `position: sticky; top: 0;
  align-self: start; height: fit-content`. Sticky resolves against the card's scroll container,
  which is the card root. Make sure no ancestor between them sets `overflow: hidden`, which
  silently disables it.
- The held panel changes with the chapter in view: each chapter sets a CSS variable or class from
  an `IntersectionObserver` whose `root` is the card scroller, never `null`
  ([`interaction-ways.md`](../../design-direction/references/interaction-ways.md) notes this).
- Not a viewport pin: the whole-viewport sequence is not available in a card. At narrow widths the
  panel un-sticks and each chapter carries its own copy of it inline.
- **Check:** one idea per chapter; the held panel makes sense when scrolled back up.

## Using these with the rest of the skill

- Choose sections first; then a move only where a section has the problem it is **for**. Zero to
  two per screen is normal. Several at once is the *Average Quality Trap*, not a design.
- Moves 2, 3, 4 and 6 pick the layout; 1 and 5 set the spatial model; 7 and 8 are about how the
  layout meets the card edge and the scroll, so they belong with the interaction table.
- When you use a move, say which section needed it and why. Naming a move is never a goal.
