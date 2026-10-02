# Motion — {unit name}

> **Written into the brief card's `motion` field.** This `#` heading is not part of the field;
> sections start at `##`. It carries the numbers for the Narrative arc in `designDirection`, and
> touches no other field.

Written by `motion-authoring` on {date} from `designDirection` → Narrative arc / signature. Builder: every
number here is the number; a beat with no row does not exist. Reviewer: capture the three points
under **Net journey**, then run the motion-off pass.

**Motion system**: {staged-arrival | scrub-welded | scrub-lagged | pointer-follow} — one per unit
(`motion-authoring/references/motion-systems.md`). Every row below inherits its `base` duration and
`primary` ease unless the row says otherwise and says why.

## Goal

{One paragraph. What the reader sees at rest (the still frame — this stands alone). What moves
when they scroll, wait or point, in order. Where it ends. **Bold the signature move.** Name the
format: `isolated` of {card}, `prefersWideFormat` {true | false}.}

## Engine

| Beat | Engine | Detail |
|---|---|---|
| {1. name} | CSS | `{property}` on `{timeline: load @keyframes | animation-timeline: view() | transition}` |
| {2. name} | library → capability **{name}** | {import shape, e.g. `gsap` + `ScrollTrigger` only — no SplitText, no smooth-scroll}; host: {CDN URL pinned | realm bundle} |
| {3. name} | ready: `show-scroll-reveal-and-scrub` `{reveal | scrub}` | {which options} |

Not used, and why: {e.g. Lenis — the host owns scroll physics; a frame sequence — the transform is enough}.

## Load-bearing structure

```
{root}                         data-motion-root · height:100%; overflow-y:auto   ← the card's scroller
  {runway}                     data-runway · height: calc(var(--screens) * 100%); min-height: calc(var(--screens) * 560px)
    {viewport}                 data-stage · position: sticky; top: 0; height: calc(100% / var(--screens))
      {track}                  data-track · display:flex; will-change: transform
        {subject}              data-subject · the dominant object, sized in cqi with a px cap
  {outro}
```

**May not change** (the effect's geometry depends on these exactly):
- {`.runway` height and min-height as two declarations — folding `max()` into the calc drops it}
- {`.stage` height divides by `--screens` — `100%` alone resolves against the runway}
- {`isolation: isolate` + a painted background on `.hero`, or `mix-blend-mode: difference` text renders white on white}
- {…}

**Hooks the code binds to**: `data-motion-root`, `data-runway`, `data-stage`, `data-track`,
`data-subject`, {…}. Classes are for styling only.

**Custom properties written by the modifier**: `--progress` (0–1), `--presence` (0–1, default 1), {…}.
Every consumer has a default that renders the final state: `opacity: calc(0.12 + 0.88 * var(--presence, 1))`.

## Effect — exhaustive

| # | Beat | Target | Property | From → to | Trigger | Duration | Ease | Stagger | Once / replay | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | {headline arrives} | `[data-hero] h1` | `transform` | `translateY(16px)` → `0` | load | 480ms | `cubic-bezier(.22,1,.36,1)` | 60ms per word | once | transform-only: capture-safe |
| 2 | {subject scrubs} | `[data-subject]` | `transform` | `rotate(0) scale(.92)` → `rotate(18deg) scale(1)` | scroll: `start` top of runway → `end` runway − 1 stage | — | none (welded) | — | reversible | `--progress` via scrub modifier, rAF-coalesced |
| 3 | {chapter presence} | `[data-chapter]` | `opacity` via `--presence` | 0.12 → 1 | scroll: chapter centre within ±40% of stage | — | none | — | reversible | default 1, so no-JS renders full |
| 4 | {…} | | | | | | | | | `assumed` — {why this number} |

For a library beat, the call itself:

```js
// beat 2 — pinned horizontal pan (only if `## Design direction` asked for a pinned sequence)
ScrollTrigger.create({
  scroller: root,                 // the card's scroller, never window
  trigger: stage, start: 'top top', end: `+=${(frames - 1) * 100}%`,
  scrub: 1, pin: true,
  onUpdate: (self) => gsap.to(track, { x: -(frames - 1) * self.progress * track.clientWidth, duration: 0.5, ease: 'power3.out' }),
});
```

For a direct-manipulation beat, the mapping:

- **input → value**: {pointer x across `[data-subject]` → rotation −30° … +30°, clamps}
- **release**: {settles where released | snaps to nearest step | springs back over 320ms}
- **keyboard**: {← → on the focused subject, 5° per press | a real `<input type="range">`}
- **touch**: `touch-action: none` on `[data-subject]` only; `setPointerCapture` on `pointerdown`, released on `pointerup`/`pointercancel`

## Net journey — the three capture points

- **Start** (scroll 0, t ≥ settle): {what is on screen — this is the still frame}
- **Mid** (scroll 50% of the runway): {what has moved, where the subject is}
- **End** (scroll 100%): {the resting end state — what a reader who scrolled to the bottom keeps looking at}

## Behaviour notes

- **Trigger class**: {scroll-only | autoplay one-shot ≈ {n}s | pointer}. Nothing moves before the user does, except {…}.
- **Reversible**: {yes — scrub rewinds | no — entrance plays once}
- **Once vs replay**: {reveal once — repeat cost, vestibular} · {scrub replays — it is a mapping, not an event}
- **Reduced motion**: the still frame **is** the design. Scrub → render `--progress` at {0.6}; entrance → final state; every state a gesture reaches stays reachable via {keyboard/range}.
- **Keyboard**: the shell is an ordinary vertical scroller — arrows, space, PageUp/Down, Home/End already work. {plus …}
- **Touch**: {the runway scrolls natively; pinch/swipe equivalents for …}
- **Width**: designed for `prefersWideFormat = {true}`; at 400 wide {the track stacks vertically and the scrub still drives `--progress`}.

## Composition contract

What this unit claims at card level. A second unit on the same surface must not claim the same:

- **Scroller**: the card root. One runway, one sticky stage. No wheel interception, no smooth-scroll library.
- **Fixed overlay**: {none | one preloader, removes itself at t = {n}s}
- **Custom properties on the root**: `--screens`, `--progress`, `--presence` — namespaced `--{unit}-*` if the card renders inside another.
- **Full-card canvas**: {none | one, sized to the card, disposed on `willDestroy`}
- **L3**: {the subject}. The arc reveals it and competes with nothing.

## Assumed

Numbers chosen here because `## Design direction` did not give them — review reads this list first:
- {row 4 duration 900ms — the moment's upper budget; the beat is the one completion per screen}
- {…}
