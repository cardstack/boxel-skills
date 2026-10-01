---
validated: source-proven
---

# show-scroll-reveal-and-scrub — Scroll reveal and scroll scrub that survive a card runtime

**What this gives you:** the two scroll mechanisms a card actually needs — *reveal* (a block
animates in once as it enters view) and *scrub* (one subject's state follows scroll position
continuously, in both directions) — as `ember-modifier` modifiers that respect the card runtime
instead of the window.

**When to use:** `design-direction` recorded **Scroll-triggered reveal** or **Scroll-linked
progress** / **Scroll-scrubbed subject** in the unit's `## Design direction` section. Read
`design-direction/references/interaction-ways.md` for *whether* to
do it at all; this file is only *how*.

**When not to use:** any format that is not `isolated`. `fitted` and `embedded` render inside
someone else's composition and usually have no meaningful scroll — a reveal there is just content
that is not there.

## The decision in one table

| | Reveal | Scrub |
|---|---|---|
| Trigger | crosses a threshold, once | every scroll position |
| Animation runs on | the compositor (CSS `transition`) | the compositor, driven by a custom property |
| Reversible | no, by design | yes, for free |
| JS per scroll | none after the hit | one `rAF`-coalesced measure |
| Reduced motion | render final state, never observe | render one chosen still, never listen |

**Prefer reveal.** It is the way that always works and costs nothing after it fires. Reach for
scrub only when the unit has one object worth watching move — `signature-treatments.md` calls this
"the strongest signature a card can carry, and the most expensive to get wrong."

## The five things that make it a *card* pattern

These are not style preferences. Each one is a real failure observed in a real card.

### 1. `root` is the card's scroller, never `null`

An `IntersectionObserver` with no `root` observes the browser viewport. A card is
`height: 100%; overflow-y: auto` inside a host stack pane, so **its content scrolls without the
viewport moving at all**. The observer then fires at the wrong time, or — when the pane is offscreen
or short — never fires, and nothing errors.

`example.gts` walks up from the element to the nearest ancestor whose computed `overflow-y` is
`auto` or `scroll`. That beats hardcoding a class name: the card's own root works, and so does a
scrolling wrapper someone adds later.

Same rule for scrub: measure the track against the **scroller's** box, not the viewport's.
`-track.getBoundingClientRect().top` is only correct when the scroller happens to start at the top
of the viewport. Subtract the scroller's own `top` and it is correct everywhere.

### 1b. Host mode: when there is no scroller, the viewport is the container

On a published or routed page the card *is* the page. `findScroller` returns `null`, every
percentage height on the root resolves to auto, and a runway sized with `calc(n * 100%)` collapses
to its px floor — the sticky stage is shorter than the window and the page looks cut off. This is
the one case where `vh` is right, because the viewport really is the container. `example.gts`
detects it by geometry (no scroller, or a root taller than 1.5× the window), sets `data-page` on
the root, listens on `window`, and measures the track against the viewport; the CSS switches only
`[data-page]` to `100dvh`. Never switch on a mode flag — the same card renders both ways.

### 2. The resting state must be the finished state

The classic form — `.block { opacity: 0 }` in the base rule, the observer adding the visible class —
is the most common silent failure in a card build. No observer, no JS, a screenshot taken too early,
a card rendered where it never scrolls: the block is invisible forever, and a design review working
from stills cannot tell it from a bug.

So **the modifier hides the element, the CSS does not.** The base rule reads
`opacity: var(--reveal, 1)`, so the fallback is visible; `revealOnScroll` sets `--reveal: 0` on
install and `1` on intersect. Delete the modifier and every block renders in full.

### 3. Once means `unobserve`, not just `disconnect`

`disconnect()` in the teardown stops the observer when the element dies. It does nothing about the
callback still firing every time the element re-crosses the threshold for the rest of the session.
Call `observer.unobserve(entry.target)` at the moment of the hit. Repeat-on-re-entry is a written
decision, not a default — repeated unpredictable movement is the motion most likely to affect
someone with a vestibular condition.

### 4. No `vw` / `vh` — the card is not the window

A scrub needs a track taller than the stage, and `height: 240vh` is the obvious way to get it and
the wrong one: the card occupies a pane, not the screen, so a viewport-derived track length has no
relationship to what the reader sees. `cqh` would be correct but needs an ancestor with
`container-type: size`, which fights the card's own `height: 100%`.

The modifier measures `scroller.clientHeight` into `--scroller-h` and keeps it fresh with a
`ResizeObserver`. The CSS then reads:

```css
[data-scrub-track] { height: calc(var(--scroller-h, 600px) * var(--scrub-length, 2.4)); }
[data-scrub-stage] { height: var(--scroller-h, 600px); position: sticky; top: 0; }
```

`--scrub-length` is the one knob: how many screenfuls of scroll the subject's arc is worth.

### 5. `data-*` for JS, classes for styling

The same card can be open in two stacks at once, with no iframe between them. Never
`document.querySelector`, never a document-level listener, never an unscoped `<style>`. Every lookup
in `example.gts` is `element.querySelector('[data-scrub-stage]')` — scoped to the modifier's own
element, and on an attribute that a later restyle will not rename out from under it.

## Two more, smaller

- **Coalesce with `rAF`.** A scroll listener that measures and writes synchronously can run several
  times per frame. Guard with a pending-frame flag and cancel it in teardown. Listen `passive: true`
  — the scrub never calls `preventDefault`.
- **Scrub `transform` and `opacity` only.** They composite without layout or paint. Scrubbing
  `width`, `top`, `filter` or a box-shadow is the same effect at many times the cost, and it is what
  makes a scroll page feel heavy.

## What the modifier is, and when it re-runs

`modifier()` from `ember-modifier` is a thin lifecycle wrapper, not framework magic. It gives you
the real DOM element after insertion, and calls your returned function on teardown. Everything
inside is plain DOM JavaScript.

It also auto-tracks: **if the body reads a `@tracked` value or a named argument that changes, the
whole modifier tears down and re-runs.** Neither modifier here reads card state, deliberately — a
re-run would rebuild the observer and re-measure the track, and for a canvas variant it would throw
away the drawing context. If you need one to react to model data, read the value in the template and
pass it as a named argument you consciously want to re-key on.

## The canvas variant

`scrollScrub` writes `--progress` and lets CSS do the transform. That is right for a subject that
moves, turns or scales. If the subject is genuinely a drawing — particles, a fluid, a procedural
scene — swap the custom-property write for a `draw(progress)` call against a `2d` context, keeping
everything else. Three extra obligations:

- `canvas.width = rect.width * devicePixelRatio` plus `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`, or
  it is blurry on every retina display.
- `draw` must be a **pure function of progress** — same input, same frame. That is what makes
  scrolling back up reverse correctly with no reverse code.
- A pre-rendered frame sequence (the Apple-style effect, a few hundred stills swapped by scroll
  position) is a different and much larger thing: a preload budget and a real weight decision, not a
  transform. Say which of the two you mean.

## The video variant

If the subject is a video and scroll is meant to drive playback, the target of the loop is
`video.currentTime` rather than a custom property. Same `scrollScrub` shape, one extra guard, and
one precondition that decides whether any of it works.

```js
// inside the rAF loop, with `target` already lerped toward the scroll progress
if (!video.seeking && Math.abs(video.currentTime - target) > 0.01) {
  video.currentTime = target;
}
```

**The `!video.seeking` check is the whole technique.** It says: only ask for a new frame once the
decoder has finished delivering the last one. Without it every frame of the loop queues another
seek, the decoder is flooded, and the result is freezing, black frames and stutter — the exact
symptom the effect is supposed to avoid. The `0.01` epsilon stops a seek being issued for a
difference too small to see. Pair it with the same lerp the transform variant uses
(`current += (target - current) * 0.08`); the easing is what gives the scrub weight instead of snap.

**The precondition, and the reason most scrub video stutters anyway.** A normally-encoded MP4 places
keyframes every few seconds, so seeking to an arbitrary time decodes forward from the last one. No
guard fixes that. A video intended for scrubbing has to be **re-encoded keyframe-dense** — often
every frame — which typically multiplies its size several times over. Decide this before choosing
the effect, not after it feels wrong: if the asset cannot be re-encoded, the honest answer is a
frame sequence or a transform on a still, not a smoother loop.

Three more obligations, two of them specific to running inside a card:

- **Weight is a decision, not a detail.** A keyframe-dense scrub asset is commonly 5–20 MB. In a
  realm that is a FileDef with a real cost, or a remote URL with a real dependency — either way it
  belongs in the `## Motion` section's library rows beside any other external asset, not slipped in as "the hero video".
- **The poster frame is the resting state.** With the loop never running — reduced motion, a
  capture, an error — the element shows one frame. Choose it deliberately with a `poster`, because
  frame 0 of a scrub asset is usually black. Same rule as every other motion here: the still state
  is the finished state.
- **`muted`, `playsInline`, and check Safari on a device.** Autoplay-adjacent video needs both
  attributes to behave, and frame-accurate seeking has historically been the least reliable part of
  video on iOS until the range is buffered. Verify on the target rather than trusting a desktop
  result.

## Verifying it

The staging capture service captures at scroll 0, so it can never see either effect. To check a
scrub's in-between states, drive `--progress` manually from the console across `0 → 1` and look, or
render the frames into a filmstrip and rasterise with headless Chrome. To check the reveal's failure
mode, delete the modifier from the template and confirm the page still renders complete — if
anything disappears, rule 2 is violated somewhere.

## See also

- `design-direction/references/interaction-ways.md` — whether to
  use a scroll way at all, and the `## Design direction` row it becomes
- `design-direction/references/signature-treatments.md` — the
  scroll-scrubbed subject as a signature decision, and the four runtime constraints
- **`motion-authoring`** — the the `## Motion` section whose Engine rows name this
  pattern, and the card constraints each option here exists to satisfy
