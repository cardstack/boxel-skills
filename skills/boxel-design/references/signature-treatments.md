# Signature treatments — the one arresting thing, and how to build it in a card

Every unit needs something that arrests: a dominant object with a treatment nobody would arrive at
by default. The first screen shows the answer to the reader's first question at full size
([`index.md`](../../../index.md) step 3), and an all-equal-weight layout is never the answer;
`design-review` scores it as Composition. This file is the **execution
vocabulary** for that decision — what is achievable in a Boxel card with pure CSS, and what each
technique costs.

## Read this first

**The aurora-gradient / glassmorphism / floating-particles family is the current default look.**
Upstream's [`critical-rules.md`](../../boxel-design/references/critical-rules.md) names *Gradient Overuse* explicitly — "gradients are the 2024
over-used signature; flat color with intentional contrast often wins" — and the same list names
the *Average Quality Trap*. A blurred radial mesh behind a frosted card is what a generation of
tools produces unprompted. Reaching for it is not a signature; it is the absence of one.

So the question this file answers is **not** "which effect do I add." It is: *what does this
particular style already imply, and what is the strongest version of that?* A field-guide style's
signature is a stipple and a hairline rule, not a gradient. A brutalist style's is a hard shadow
and an oversized numeral. Pick the treatment the style earns.

Use the list below as vocabulary, not a menu. If two different units in the same workspace end up
with the same treatment, at least one of them was not designed.

## The techniques, and what each costs in a card

| Treatment | Pure CSS | Cost / constraint |
|---|---|---|
| **Drifting gradient field** — two or three blurred radial gradients, `@keyframes` on `transform`, `filter: blur()` | yes | The default look; needs a reason. `filter: blur()` on a large surface is expensive and composites on every frame |
| **Flowing text** — `background-clip: text` with an animated `background-position` | yes | Needs `color: transparent` — check the contrast fallback when the animation is off, and that selection/high-contrast mode still reads |
| **Staggered reveal** (the baseline version ships automatically: see `boxel-design/references/motion-baseline.md`) — per-child `animation-delay` and `translateY` | yes | The base CSS must be the FINAL state, and the keyframe moves without fading: `from { transform: … }` + `both`, never `opacity`. A fade makes a capture during the stagger read as blank, which breaks screenshot review. See the invisibility trap in upstream's [`template-patterns.md`](../../boxel-ui-guidelines/references/template-patterns.md) |
| **Layered glass** — `backdrop-filter: blur()` over a moving ground, plus an inline SVG `feTurbulence` data URI for grain | yes | `backdrop-filter` is the other half of the default look. The grain data URI inflates the template; keep it small |
| **Hover parallax tilt** — `:hover { transform: perspective() rotateX() }` | yes, no JS | Hover only — gives nothing on touch, and nothing to keyboard users unless paired with `:focus-visible` |
| **Scroll-driven** — `animation-timeline: scroll()` / `view()` | Chromium only | **The card scrolls inside itself**, not the document, so the timeline must resolve to the card's scroll container. Fall back to `IntersectionObserver` with `root` set to that container — never the viewport default |
| **Scroll-scrubbed subject** — one object (a bottle, a device, a chart, a mark) rotates, scales or shifts continuously as the reader scrolls | yes, for a single element | The strongest signature a card can carry, and the most expensive to get wrong. See below |

### The scroll-scrubbed subject

When a unit has one object worth looking at — a product, a device, a specimen, a chart, a brand
mark — tying its `transform` to scroll position is the signature move that reads as *made*, not
assembled. It is what a reader remembers, and it is worth reaching for when the unit's whole job is
to present that object.

It is also the treatment most likely to be asked for and most likely to be built the expensive way,
so decide these in Phase 3 rather than at build time:

- **One element, `transform` and `opacity` only.** `rotate`, `scale`, `translate` and opacity are
  compositor properties — they animate without layout or paint. Scrubbing `width`, `top`, `filter`
  or a box-shadow instead is the same effect at many times the cost, and it is what makes a
  scroll page feel heavy. The scrub modifier writing `--progress` drives the transform in every
  browser (`animation-timeline: view()` only as an `@supports` enhancement); **no library is needed
  for a single subject.**
- **A frame sequence is a different, much larger thing.** The Apple-style effect where the object is
  really a few hundred pre-rendered stills swapped by scroll position is a canvas plus a preload
  budget, not a transform — it becomes a JS way (a canvas drawn in a modifier), and a real weight decision.
  Say which of the two you mean; they are not interchangeable and the cheap one is usually enough.
- **The still frame carries the composition.** The subject must be well placed and well cropped at
  its resting pose, because that is what a reduced-motion reader, a screenshot and every capture in
  review will see. A subject whose composition only works mid-scrub has no composition.
- **It is the unit's one L3.** A scrubbed subject is by definition the arresting thing; nothing else
  in the unit may compete with it, and the same object compresses to a static crop in `embedded`
  and to a single mark in `fitted`. Never scrub in a non-`isolated` format.

## Spatial model — the control that was never defined

`spatial model` is the style control for depth, and until now it had
no vocabulary, so it got filled in as "flat" by default. Four options:

| Spatial model | What it means | Fits |
|---|---|---|
| **Flat** | no depth cues at all; hierarchy is size, weight and rule | editorial, field-guide, brutalist, anything where paper is the metaphor. **A legitimate choice, not a fallback** |
| **Layered** | z-order, offset and shadow as punctuation; still 2D | dashboards, stacked records, anything with overlay state |
| **Perspective** | CSS `perspective` + per-element `translateZ` / `rotateY` | a collection whose items deserve drama — showcases, reels, card sets |
| **Scene** | a camera, a canvas runtime, a model | the content *is* spatial — an assembly, a map, a building |

Upstream ships a proven pattern for the third: **`boxel-patterns/patterns/layout-3d-card-carousel`**
— results from `@context.searchResultsComponent` positioned on a virtual cylinder, auto-rotate,
hover lift, click-to-focus, filter-reactive, **all CSS and tracked state, no library**. Its own
guidance names the use: *"anywhere a flat grid feels too utilitarian"* and *"hero / landing sections
of an app card where the user sees a wow first."*

Two consequences to record with the pick:

- **Perspective and scene need width.** [`prefers-wide-format.md`](../../boxel/references/prefers-wide-format.md) lists spatial layouts as a
  `prefersWideFormat = true` category — a camera in a 720px column reads as a postage stamp. Decide
  it with the CardDef, not after.
- **Spatial and flat are mutually exclusive, and the content decides.** A 3D hero on a field-guide
  style is not a bolder version of that style, it is a different one. *"Depends on the
  requirement"* has to mean the content is spatial — a collection, a showcase, an assembly — not
  that the flat version looked boring. If the honest answer is boring, the fix is in Phase 2's
  dominant object, not in adding an axis.

## Four constraints that apply to all of them

These come from the card runtime, not from taste:

1. **The same card can render more than once on one page.** The host uses no iframes and a card can
   be open in several stacks at once. Never `document.querySelector`, never a document-level
   listener, never an unscoped `<style>` injection. Scope every query to
   `element.closest('.boxel-card-container')`, and use data attributes as JS hooks — classes are for
   styling. ([`boxel-ui-guidelines/references/template-patterns.md`](../../boxel-ui-guidelines/references/template-patterns.md))
2. **Respond to the container, not the viewport.** No `vw` / `vh`. The dominant object's size is a
   `cqi` / `cqmin` value or a container-query breakpoint.
   ([`boxel-ui-guidelines/references/use-container-queries-not-viewport-units.md`](../../boxel-ui-guidelines/references/use-container-queries-not-viewport-units.md))
3. **`prefers-reduced-motion` is not optional.** Every entrance, drift and tilt needs a resting
   state that is the finished state. `design-review` caps the aesthetic score at 8 when motion is
   absent or purely functional — and a motion that cannot be turned off is worse than none.
4. **The outermost element belongs to the host.** No `border-radius`, `border`, `box-shadow` or
   `overflow: hidden` on a format's root; brand-wide corners go on the Theme card. The signature
   goes *inside* the box. ([`boxel-ui-guidelines/references/delegated-render-control.md`](../../boxel-ui-guidelines/references/delegated-render-control.md))

## Per format

The hero is not only an isolated concern:

- **`isolated`** — the dominant object and its treatment. This is where a signature has room.
- **`embedded`** — one compressed carrier of the same idea: the same stipple, the same rule, the
  same weight jump at a smaller size. Not a shrunken copy of the hero.
- **`fitted`** — at the smallest sizes, the signature is usually a single mark: a stamp, a numeral,
  a colour band. Everything else is gone.
- **`atom`** — text. The signature survives as wording, not decoration.

Name the treatment in the build's hand-off line next to the layout, and in the stage-3 content matrix say
**which field is the hero** at each format — the matrix already lists fields in priority order; the
hero is the one the format leads with.
