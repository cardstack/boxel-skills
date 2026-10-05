---
validated: source-proven
---

# show-scroll-reveal-and-scrub — Scroll reveal and scroll scrub that survive a card runtime

**What this gives you:** the two scroll mechanisms a card actually needs — *reveal* (a block
animates in once as it enters view) and *scrub* (one subject's state follows scroll position
continuously, in both directions) — as `ember-modifier` modifiers that respect the card runtime
instead of the window.

**When to use:** a beat in the unit's `## Motion` section (from `motion-authoring`) names this
pattern as its engine, or the user asked outright for motion that follows scroll ("scroll like
<site>", "pin this", "scrubbed"). A `## Design direction` row asking for **Scroll-linked progress**
or a **Scroll-scrubbed subject** is a trigger too when one exists, but none is required. A vague ask
("make it feel alive") is baseline motion, not this
([`motion-baseline.md`](../../../boxel-design/references/motion-baseline.md) → *Off, on, or more*).
This file decides *how*, never *whether*.

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
scrub only when the unit has one object worth watching move: it is the strongest signature a card
can carry, and the most expensive to get wrong.

## The six things that make it a *card* pattern

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

So **the modifier offsets the element, the CSS does not, and nothing fades.** The base rule reads
`transform: translateY(calc((1 - var(--reveal, 1)) * 20px))`, so the fallback is in place;
`revealOnScroll` sets `--reveal: 0` on install and `1` on intersect. Delete the modifier and every
block renders in full. Leave opacity out even with the modifier: a full-page capture never scrolls,
so a faded block below the fold stays blank in it. A block 20 px low is still readable.

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

### 6. Scroll position 0 is the still frame, and it is complete

A page opens at the top, and a full-page capture never scrolls, so the reader's first view and every
review capture show the scrub at `--progress: 0` (or the `restProgress` you pass). That frame must
already hold every piece of text and data the section has. A beat may move, turn, scale or swap
*decoration*; it never reveals words or numbers, and nothing in the stage starts faded, clipped or
off the stage. A caption that only becomes readable halfway down is content a screenshot and a
quick reader both miss. If a composition only works mid-scrub, it has no composition: rework the
beats, do not tune numbers.

With reduced motion the modifier rests on that still frame and the CSS **collapses the runway**:
the track drops to its stage's height and the stage stops being sticky. Without that, the page
keeps a tall empty track, and a full-page capture shows a blank screenful or two below the subject.

```css
@media (prefers-reduced-motion: reduce) {
  [data-scrub-track] { height: auto; }
  [data-scrub-stage] { position: static; }
}
```

The review's motion-off pass cannot set the media query, so it injects the same two rules
globally, keyed on these `data-scrub-*` attributes
([`capture.md`](../../../design-review/references/capture.md) → *The motion-off pass*). Keep the
attribute names, or that pass stops collapsing the track. Don't reach for `:global(:root[…]) …`
inside `<style scoped>` to do it yourself: the scoping pass replaces the whole selector with what is
inside `:global()`, so the rule lands on the root element and never on the track.

## Smaller rules

- **Coalesce with `rAF`.** A scroll listener that measures and writes synchronously can run several
  times per frame. Guard with a pending-frame flag and cancel it in teardown. Listen `passive: true`
  — the scrub never calls `preventDefault`.
- **Lag is a time constant, not a per-frame factor.** `{{scrollScrub lag=160}}` makes `--progress`
  trail the scroll and keep travelling after the reader stops (the scrub-lagged feel). It uses the
  exported `damp()`, which settles in the same time at 60 Hz and 120 Hz; a per-frame factor like
  `* 0.1` settles twice as fast on a 120 Hz screen. `0.1` per frame at 60 Hz ≈ `lag=160`. The loop
  stops once it lands, and the first step snaps, so a capture never catches it mid-glide.
- **Say when it has landed.** The modifier sets `data-motion-settled` on the track whenever
  `--progress` equals its target, and removes it while a scroll is being followed. A capture that
  scrolls the card to a point waits for that attribute (with a timeout) instead of guessing a delay.
- **This modifier is the default scrub engine.** CSS `animation-timeline: view()` is optional, behind
  `@supports`, and never on an element this modifier also drives.
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

## Beats: slicing one `--progress`

A GSAP timeline places several tweens along one scroll range. Here the whole range is one
`--progress` from 0 to 1, and each beat takes its own slice of it in CSS, with no extra JS:

```css
[data-scrub-track] {
  /* beat local progress: 0 before its start, 1 after its end, linear between */
  --b1: clamp(0, var(--progress, 0) / 0.6, 1);           /* beat 1: 0 → 0.6 */
  --b2: clamp(0, (var(--progress, 0) - 0.5) / 0.5, 1);   /* beat 2: 0.5 → 1 */
}
.subject { transform: rotate(calc(var(--b1) * 180deg)); }
.readout { transform: translateY(calc(var(--b2) * -2rem)); }
```

Overlapping slices (0.5 to 0.6 here) are the timeline's overlap. Each row of the `## Motion`
Effect table names its slice as its trigger (`scroll 0.5 → 1`), so the numbers in the spec and in
the CSS are the same numbers. Easing a beat is one more step: ease the slice in the CSS
(`calc(var(--b2) * var(--b2))` is ease-in) or in JS before writing.

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
// inside the rAF step, with `target` already damped toward the scroll progress
if (!video.seeking && Math.abs(video.currentTime - target) > 0.01) {
  video.currentTime = target;
}
```

**The `!video.seeking` check is the whole technique.** It says: only ask for a new frame once the
decoder has finished delivering the last one. Without it every frame of the loop queues another
seek, the decoder is flooded, and the result is freezing, black frames and stutter — the exact
symptom the effect is supposed to avoid. The `0.01` epsilon stops a seek being issued for a
difference too small to see. Pair it with the same damping the lagged transform uses
(`damp(current, target, lag, dt)`, `lag` ≈ 200 ms); the damping is what gives the scrub weight instead of snap.

**The precondition, and the reason most scrub video stutters anyway.** A normally-encoded MP4 places
keyframes every few seconds, so seeking to an arbitrary time decodes forward from the last one. No
guard fixes that. A video intended for scrubbing has to be **re-encoded keyframe-dense** — often
every frame — which typically multiplies its size several times over. Decide this before choosing
the effect, not after it feels wrong: if the asset cannot be re-encoded, the honest answer is a
frame sequence or a transform on a still, not a smoother loop.

Three more obligations, two of them specific to running inside a card:

- **Weight is a decision, not a detail.** A keyframe-dense scrub asset is commonly 5–20 MB. In a
  realm that is a FileDef with a real cost, or a remote URL with a real dependency — either way it
  belongs in the `## Motion` section's Engine table as a named asset with its size, not slipped in as "the hero video".
- **The poster frame is the resting state.** With the loop never running — reduced motion, a
  capture, an error — the element shows one frame. Choose it deliberately with a `poster`, because
  frame 0 of a scrub asset is usually black. Same rule as every other motion here: the still state
  is the finished state.
- **`muted`, `playsInline`, and check Safari on a device.** Autoplay-adjacent video needs both
  attributes to behave, and frame-accurate seeking has historically been the least reliable part of
  video on iOS until the range is buffered. Verify on the target rather than trusting a desktop
  result.

## Verifying it

**Not yet verified in the live host:** the sticky stage inside a card's own scroller (any ancestor
between the stage and the scroller with `overflow` other than `visible` silently disables sticky),
and the scrub's cost on a low-end device. Headless Chrome against a plain page passes both; check
one real card in the host before relying on a pinned sequence.

The staging capture service captures at scroll 0, so it can never see either effect. To check a
scrub's in-between states, drive `--progress` manually from the console across `0 → 1` and look, or
render the frames into a filmstrip and rasterise with headless Chrome. To check the reveal's failure
mode, delete the modifier from the template and confirm the page still renders complete — if
anything disappears, rule 2 is violated somewhere.

## See also

- [`boxel-design/references/signature-treatments.md`](../../../boxel-design/references/signature-treatments.md):
  the scrubbed subject as a signature decision
- **`motion-authoring`** — the `## Motion` section whose Engine rows name this
  pattern, and the card constraints each option here exists to satisfy
