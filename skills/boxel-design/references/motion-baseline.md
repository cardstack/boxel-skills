# Motion baseline — motion every build has, without asking

Part of [`boxel-design`](../SKILL.md). Links are relative to this file.

Every user-facing build ships a small amount of CSS motion. The user does not have to ask for it,
it is never handed to `motion-authoring`, and a mockup is not finished without it.
Unless the user asked for a still page, a page with no motion at all reads as unfinished. What it
ships is small, cheap and safe.

**What is baseline and what is not.**

| Layer | What | Owner |
|---|---|---|
| **Baseline** (this file) | CSS only: staggered arrival, scroll reveal, hover and press feedback, at most one ambient loop | `boxel-design`, applied automatically |
| **Heavy** | a scroll-scrubbed subject, a pinned sequence, a per-frame JS loop, pointer-follow, a spatial scene | [`motion-authoring`](../../motion-authoring/SKILL.md), only when the user asks for it |

If a unit has a `## Motion` section, its motion system governs: baseline rows that disagree with it
yield, and no baseline row may use a second ease or duration set. Baseline never adds a `<script>`
or a per-frame loop, and no layer adds an animation library.

## Off, on, or more: read it from the user's words

Motion is never a question. Read the request:

- **Off.** "No animation", "no motion", "static", "keep it still", or the same in the user's
  language: ship no arrival, no scroll reveal and no ambient loop. Keep recipe 3: hover, press and
  focus still show what happened, because that is feedback, not decoration. Say `Motion: off (you
  asked)` in the hand-off line, and write it into the brief card when there is one, so later builds
  keep it off.
- **More.** An explicit ask for motion that follows scroll or the pointer ("scroll like
  <site>", "pin this", "scrubbed", "parallax", a reference site to move like) is **Heavy** in the
  table above.
- **Anything else gets the baseline**, with its character from the style family. "Make it feel
  alive", "add some animation", "dynamic" or "dramatic" are baseline asks, never heavy ones.

## Pick the character from the family

The character sets ease, duration and stagger for the whole unit. It comes from the style family in
[`style-families.md`](style-families.md) and is recorded as the **motion character** style control.
Do not ask the user which; it is not a question.

| Character | Ease | Arrival duration | Stagger | Feel |
|---|---|---|---|---|
| **calm** | `cubic-bezier(0.22, 1, 0.36, 1)` | 480 ms | 90 ms | settles; nothing bounces |
| **springy** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 400 ms | 60 ms | small overshoot, playful |
| **snappy** | `cubic-bezier(0.2, 0, 0, 1)` | 240 ms | 40 ms | quick, precise |
| **slow** | `cubic-bezier(0.33, 1, 0.68, 1)` | 700 ms | 120 ms | unhurried, tactile |
| **gentle** | `cubic-bezier(0.25, 0.8, 0.25, 1)` | 560 ms | 100 ms | soft, no overshoot |

*The calm row reuses the staged-arrival numbers in `motion-authoring/references/motion-systems.md`
(480 ms, 90 ms stagger, the same ease). The other four are starting values, not measured against
real cards; adjust them after a build, and record the change.*

Write the numbers into CSS custom properties on the root once: `--mb-ease`, `--mb-dur`,
`--mb-stagger`. Every recipe reads them, so one unit never carries two feels.

## The four recipes

### 1 · Staggered arrival — `isolated` only

The screen assembles in reading order on load.

```css
.arrive {
  animation: mb-arrive var(--mb-dur) var(--mb-ease) both;
  animation-delay: calc(min(var(--i, 0), 7) * var(--mb-stagger));
}
@keyframes mb-arrive { from { transform: translateY(12px); } }
@media (prefers-reduced-motion: reduce) { .arrive { animation: none; } }
```

- Set `--i` per child with the `cssVar` helper, `style={{cssVar i=2}}` (or `i=index` inside an
  `#each`), imported from `@cardstack/boxel-ui/helpers`. A literal `style='--i: 2'` fails lint
  (`no-inline-styles`). The `min(…, 7)` caps the delay so a long list does not take seconds.
- **Move, never fade.** The keyframe has no opacity, so every element is visible from the first
  frame. A capture taken mid-arrival shows the whole page with some blocks a few pixels low, never
  an empty section, and `design-review` scores from those captures.
- **The base rule is the final state.** `from` lives only inside the keyframe and the animation uses
  `both`. Never put `opacity: 0` in the base rule: a reduced-motion reader or a failed animation
  then sees an empty page.
- Total arrival, including the last stagger, stays under 1 s for repeated screens and under 1.5 s
  for a landing moment.
- Animate the hero, the headline block and the first row of content. Not the whole page.

### 2 · Scroll reveal — `isolated` only

Blocks below the fold arrive as the reader reaches them.

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: mb-rise linear both;
    animation-timeline: view();          /* after the shorthand, which resets it */
    animation-range: entry 0% entry 40%;
  }
}
@keyframes mb-rise { from { transform: translateY(24px); } }
```

- **Transform only, never opacity.** A screenshot of the whole page never scrolls, so every block
  below the fold is captured before its entry range: with an opacity keyframe those blocks come
  out blank, and `design-review` scores from those captures. A block 24 px low is still readable.
- **Put `.reveal` on a block's content, not on a panel with its own background or border.** Before
  entry the block sits 24 px low, so on a filled panel the offset shows as a gap above it in the
  same full-page capture.
- **Where unsupported, the block is simply there**, which is the right fallback. Nothing needs a
  polyfill.
- The timeline resolves to the nearest scrolling ancestor, which in an isolated card is the card's
  own root (`height: 100%; overflow-y: auto`). Never design it against the window.
- Content already in view at load is already past its entry range, so it shows in its final state.
- If you need a replay-once trigger instead of a scrubbed one, use an `IntersectionObserver` in a
  Modifier with `root` set to the card's scroller, never `null`; [`show-scroll-reveal-and-scrub`](../../boxel-patterns/patterns/show-scroll-reveal-and-scrub/README.md)
  has the modifier.
- Do not put `.arrive` and `.reveal` on the same element.

### 3 · Hover, press and focus feedback — every format

```css
.control {
  transition: transform var(--mb-fast, 150ms) var(--mb-ease),
              box-shadow var(--mb-fast, 150ms) var(--mb-ease);
}
@media (hover: hover) {
  .control:hover { transform: translateY(-2px); }
}
.control:active { transform: translateY(0) scale(0.98); }
.control:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

- Repeated actions stay under 200 ms with no attention-grabbing motion.
- This is the only recipe that applies to `embedded`, `fitted` and `atom`. Those render in lists and
  grids, many at a time.
- Every control keeps a visible resting cue and a focus ring; hover is never the only signal.

### 4 · One ambient loop, at most

A marquee strip, a slow float on one object or a gentle background drift. **One per unit.**

```css
.marquee__track { animation: mb-marquee 30s linear infinite; }
@keyframes mb-marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
.marquee:hover .marquee__track { animation-play-state: paused; }
```

- The track holds its content twice so the loop is seamless; 20–40 s per lap, linear.
- It pauses on hover and stops under reduced motion. It never carries information.
- If the unit already has a signature treatment that moves, skip this recipe. Two moving things
  compete.

## Rules that hold for every recipe

- **`transform` and `opacity` only.** Never animate `width`, `height`, `top`, `filter` or a
  shadow's blur on a loop or on scroll.
- **Entrances and reveals move; they never fade.** Recipes 1 and 2 animate `transform` alone, so no
  capture, at any moment, shows content missing. `opacity` stays available for hover, a loop or a
  scrubbed subject, where the resting state is already visible.
- **Final state in the base CSS**, always. The resting page is the page.
- **`prefers-reduced-motion`** turns every animation off; the page must still make sense and still
  expose everything.
- **Which formats:** `isolated` gets recipes 1–4; `embedded`, `fitted` and `atom` get recipe 3
  only. Entrance and scroll motion in a list multiplies by the number of rows.
- **Not on prices, legal text or confirmations.**
- **One scroll owner.** Never create a second scroller to animate against.
- **The motion supports the signature; it is not a second one.** If the motion would be the most
  memorable thing on the unit, it belongs in `motion-authoring`, with a spec.

## What review checks

[`design-review`](../../design-review/SKILL.md) looks for the baseline in captures and in the
motion-off pass:

1. Recipe 1 or 2 is present on the `isolated` view, and recipe 3 on the controls. With motion off at
   the user's request, only recipe 3, and its absence elsewhere is not a finding.
2. The timing matches the declared motion character; there is one ease and one duration set.
3. With motion off, nothing is missing or blank.
4. No blank region in a capture. Baseline motion cannot cause one, so a blank region is a fade
   someone added or a real bug; re-capture once to rule out a card still loading, then report it.
