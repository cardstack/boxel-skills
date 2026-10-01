# Card constraints — what a card runtime does to motion written for a document

Every reference prompt library assumes the component owns the document: the window scrolls, `vh`
is the viewport, `document.querySelector` is safe, one copy exists, and a human watches it play. A
Boxel card has none of that. It is `height: 100%; overflow-y: auto` inside a host pane that may be
400 px wide or 1600, it can be open in two stacks at once, and its design review is done from a
capture the indexer takes at one fixed moment.

Each item below was paid for on a real build, and
`show-scroll-reveal-and-scrub` carries the code that already applies §1, §2 and §5. Check every row of the `## Motion` section's Effect table
against this list.

## 1. The card owns one scroller, and it is not the window

- **Scroll-linked motion measures against the card's scrolling element.** `IntersectionObserver`
  with `root: null` observes the viewport, which does not move when the card's content scrolls; it
  fires at the wrong time or never, with no error. Walk up to the nearest ancestor whose computed
  `overflow-y` is `auto`/`scroll`. A library's `scroller:` option gets the same element.
- **Do not intercept the wheel.** From inside the card you lose; the page scrolls vertically and
  nothing moves. Build a runway instead (§2) so wheel, trackpad, keyboard, touch and the scrollbar
  all work untouched.
- **Move a horizontal track with `transform`, never `scrollLeft`.** Writing `scrollLeft` on every
  vertical scroll makes scroll anchoring correct `scrollTop`, which fires another scroll: the page
  visibly bounces. Add `overflow-anchor: none` and `overscroll-behavior-y: contain` on the scroller.
- **Smooth / inertial scroll (Lenis and kin) is not available.** The host owns the pane's scroll
  physics. A reference site's glide is reproduced as **scrub-lagged** on the *subject*, not on the
  scroller.
- **A whole-viewport pin is not available.** `position: sticky` inside the card's runway is the
  hold; it is measured against the card, and the host may resize or stack it.

## 2. The runway shape, and the two calcs that silently break it

```
.shell    height: 100%; overflow-y: auto                       ← the card's scroller
  .runway position: relative;
          height: calc(var(--screens) * 100%);
          min-height: calc(var(--screens) * 560px);            ← two declarations, never one
    .stage position: sticky; top: 0;
           height: calc(100% / var(--screens));                ← divide, or it is n screens tall
      .track display: flex; will-change: transform             ← moved by transform
```

- `height: calc(3 * max(560px, 100%))` is **dropped** — the runway falls to content height, sticky
  has no travel, the card is exactly as tall as its content and the scroll axis never moves.
  Nothing errors. Write the percentage and the px floor as two declarations.
- `height: 100%` on the sticky stage resolves against the **runway**, so a five-screen runway gives
  a five-screen stage and sticky does nothing. Divide by `--screens`.
- `scrollWidth` does not report overflow on an element that is not itself a scroller; compute
  horizontal travel as `(frameCount - 1) * track.clientWidth`.
- **The tell from a still:** a working runway pins the card to `screens × pane` regardless of
  content. A card that gets shorter when you shorten its content has lost its runway.

## 3. Entrance beats are `transform`-only — the capture is at a fixed moment

The `_capture` image is produced by the indexer at one deterministic moment relative to the
render — three fetches return byte-identical PNGs even mid-arc — and that moment **moves when the
page gets slower** (a `StructuredTheme` pulling Google Fonts pushed one build's capture straight
into its animation window). There is no safe set of delays because the safe window is unknown.

- An `opacity` ramp caught mid-flight is indistinguishable from a rendering failure. A
  `translateY(16px)` caught mid-flight is a few pixels off and no reviewer mistakes it for a bug.
- So: `@keyframes rise { from { transform: translateY(8px) } }`, `animation-fill-mode: both`, the
  resting CSS is the **final** state. Never `.block { opacity: 0 }` plus a reveal — that is the
  invisibility trap, and it is permanent for anyone whose animations never play.
- Where a fade is genuinely the design, put it on a state the user triggers — hover, selection, a
  scroll-linked crossfade driven by a custom property with a default of 1:
  `opacity: calc(0.12 + 0.88 * var(--presence, 1))`. No modifier, no JS, a pre-frame capture → 1.
- A library `from()` entrance has the same problem. Keep one constant (`ENTRANCE_WINDOW_MS`) that
  disables it, so the final layout can be verified with a push + touch + capture and restored.

## 4. Size against the container, never the viewport

- **No `vh`, no `vw`.** The dominant object's size is `cqi` with a px cap: `min(44cqi, 360px)`.
- **The isolated root stays `container-type: inline-size`.** `size` renders the card blank — size
  containment resolves the box without its contents, an unresolved `height: 100%` becomes 0, and
  nothing inside can push it open. Every gate stays green.
- Consequence: `cqh` and `cqmin` are unavailable on the root, and `cqi` measures the **wide** axis.
  In an 800×447 pane `min(44cqi, 360px)` is 352 px — 79 % of the height. Drive a full-height
  subject's size down the grid instead (`.body { height: 100% }` → `height: min(86%, 360px)`).
- A percentage `min-height` below the root may not resolve; `min-height: max(620px, 118%)` lets the
  px floor take over when the percentage contributes 0.
- **Host mode is the one exception to "no `vh`".** On a published / routed page the card *is* the
  page: nothing above the root has a definite height, every `100%` resolves to auto, the runway
  falls to its px floor and the sticky stage ends up shorter than the viewport — the page reads as
  cut off. There the viewport genuinely is the container. Detect it at runtime, never by mode flag:
  the scrub modifier already walks up for a scroller; when none exists (`document.scrollingElement`
  is the fallback) **or the root is taller than ~1.5× the window** (it was never constrained), set
  `data-page` on the root and let CSS switch only that case to `100dvh`:

  ```css
  .root[data-page] { height: auto; overflow: visible; }
  .root[data-page] .runway { height: calc(var(--screens) * 100dvh); min-height: calc(var(--screens) * 100dvh); }
  .root[data-page] .stage  { height: 100dvh; }
  ```

  In page mode the scroll listener goes on `window` and the track is measured against the
  viewport (`getBoundingClientRect().top` alone). The operator-mode percentage path is untouched.
  The modifier shape is in
  `show-scroll-reveal-and-scrub`'s `example.gts`.

## 5. The same card can be mounted twice on one page

The host uses no iframes; a card can be open in two stacks. So:

- Never `document.querySelector`, never a `document`/`window` listener for motion. Scope to the
  modifier's element or `element.closest('.boxel-card-container')`.
- `setPointerCapture` on the manipulable element; release on `pointerup`/`pointercancel`.
  `touch-action: none` on that element only, never an ancestor.
- Never inject an unscoped `<style>` at runtime — which also means **`@keyframes` cannot carry
  instance data**. Shapes or values that come from linked cards are interpolated in JS (a
  ~30-line lerp over the number lists of two path `d` strings, exact when every shape shares one
  command sequence) and written to a custom property or attribute.
- A library global (`CustomEase.create('hop')`, `gsap.registerPlugin`) is page-global. Prefix
  names with the unit; register plugins idempotently.
- Per-frame loops (`scrub-lagged`, `pointer-follow`) stop on `willDestroy` and when the card leaves
  view; nothing in a reference component does this because nothing there is ever unmounted.

## 6. Loading a library

- Decided in `## Motion` as a library row naming the host; loaded once theming and wiring begin.
  `boxel/references/external-libraries.md` has the async CDN modifier
  shape; the realm-bundled route is
  `boxel-patterns/references/integration-surfaces.md` §6.
- gsap loads the Leaflet way and works: fetch
  `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`, evaluate with
  `new Function('module','exports', code)`, take `exports.gsap`; plugins the same, then
  `registerPlugin`. Start the fetch at module evaluation so it is ready by first render. Pin the
  version in the URL and record it in the library row.
- Reference components use bare specifiers (`import gsap from "gsap"`) and absolute asset paths
  (`/c/<slug>/img.jpg`); neither resolves in a card. Translate the import; host the assets on the
  realm or an `ImageSourceField`.
- Before pulling a library, check the beat is not already CSS: a single scrubbed subject is
  `animation-timeline: view()` plus the scrub modifier fallback; a text split is pre-split spans;
  a reveal is the reveal modifier. The library row is for **scrub-lagged**, **pointer-follow**,
  Flip-style layout transitions, and a canvas.

## 7. Rendering linked cards inside the scene

- `@fields.x @format='embedded'` in a flex row collapses to zero width and shows the host's
  chrome (a white bar). Give the slot a width; neutralise chrome from the parent with
  `.slot :deep(*) { background-color: transparent; box-shadow: none }` — **not**
  `border-color: transparent`, which reaches every descendant and erased a Pill's outline three
  layers down.
- `@fields.x` also attaches the host's click-to-open overlay, which on a scene-sized surface makes
  the whole artwork one navigation button. Where the scene is to be looked at, render from the
  model (`<Thing @model={{thing}} />`) and point the card's `embedded` format at the same component.

## 8. Verifying what a still cannot show

- The staging service captures **800×600 at scroll 0** and ignores viewport arguments. It can prove
  the still frame and the final-state rule; it cannot prove motion. Say which in the report.
- For a scrub, render the interpolated states into one filmstrip and rasterise it with headless
  Chrome (`--headless --screenshot --window-size=W,H file:///…svg`); it is the only way to see the
  in-between states without a browser MCP.
- With a browser MCP, capture the three **Net journey** points and run `design-review`'s
  motion-off pass.
