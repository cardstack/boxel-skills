# Motion — {unit name}

> **Written into the brief card's `motion` field.** This `#` heading is not part of the field;
> sections start at `##`. It carries the numbers for the motion the user asked for (or for a
> Narrative arc in `designDirection`, when the brief has one), and touches no other field.

Written by `motion-authoring` on {date} from {the user's ask | `designDirection` → Narrative arc}. Builder: every
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
| {2. name} | JS → modifier **{name}** | {what it runs — `scrollScrub lag={ms}` / a `damp()` loop / an `IntersectionObserver` / `element.animate()`}; writes {a custom property}; stops on {landing, `willDestroy`, leaving view}; reduced motion: {snap to rest value / static final frame / off} |
| {3. name} | ready: `show-scroll-reveal-and-scrub` `{reveal | scrub}` | {which options} |

Not used, and why: {e.g. smooth scroll — the host owns scroll physics; a frame sequence — the transform is enough}. No animation library, ever (`card-constraints.md` §6).

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
Every consumer has a default that renders the final state, and none of them hides words or numbers:
`transform: scale(calc(0.6 + 0.4 * var(--presence, 1)))` on a chapter's marker, never `opacity` on
its text. Scroll position 0 is what the first view and every full-page capture show, so it holds
all the copy.

## Effect — exhaustive

| # | Beat | Target | Property | From → to | Trigger | Duration | Ease | Stagger | Once / replay | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | {headline arrives} | `[data-hero] h1` | `transform` | `translateY(16px)` → `0` | load | 480ms | `cubic-bezier(.22,1,.36,1)` | 60ms per word | once | transform-only: capture-safe |
| 2 | {subject scrubs} | `[data-subject]` | `transform` | `rotate(0) scale(.92)` → `rotate(18deg) scale(1)` | scroll `0 → 0.6` (`--b1`) | — | none (welded) | — | reversible | `--progress` via scrub modifier, rAF-coalesced; the slice is the pattern's *Beats* |
| 3 | {chapter marker} | `[data-chapter-mark]` | `transform` via `--presence` | `scale(.6)` → `scale(1)` | scroll: chapter centre within ±40% of stage | — | none | — | reversible | decoration only; the chapter's text never fades. Default 1, so no-JS renders full |
| 4 | {…} | | | | | | | | | `assumed` — {why this number} |

For a JS beat, the binding and the CSS it feeds. JS writes only `--progress`; the geometry stays in
CSS, where **Load-bearing structure** already marks it:

```hbs
{{! beat 2 — pinned horizontal pan, lagged (only if `## Design direction` asked for a pinned sequence) }}
<div data-runway data-scrub-track {{scrollScrub lag=160}}>  {{! writes --progress 0–1, damped; restProgress under reduced motion }}
  <div data-stage data-scrub-stage>                         {{! position: sticky; top: 0 — the pin }}
    <div data-track>…</div>
  </div>
</div>
```

```css
[data-track] {
  width: calc(100% * var(--screens));
  /* the default renders the final state, per the resting-state rule */
  transform: translateX(calc(var(--progress, 1) * -100% * (var(--screens) - 1) / var(--screens)));
}
```

For a direct-manipulation beat, the mapping:

- **input → value**: {pointer x across `[data-subject]` → rotation −30° … +30°, clamps}
- **release**: {settles where released | snaps to nearest step | springs back over 320ms}
- **keyboard**: {← → on the focused subject, 5° per press | a real `<input type="range">`}
- **touch**: `touch-action: none` on `[data-subject]` only; `setPointerCapture` on `pointerdown`, released on `pointerup`/`pointercancel`

## Net journey — the three capture points

Each point is a `--progress` value, so a capture can reproduce it: the card's scroller is set to
`track's top inside the scroller + progress × (track height − stage height)`, then waits for `data-motion-settled`
(`design-review/references/capture.md` → *Scroll motion*).

- **Start** (progress 0): {what is on screen — this is the still frame, and it holds every word and number}
- **Mid** (progress {0.5, or where the middle beat peaks}): {what has moved, where the subject is}
- **End** (progress 1): {the resting end state — what a reader who scrolled to the bottom keeps looking at}

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
