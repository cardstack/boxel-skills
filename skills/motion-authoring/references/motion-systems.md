# Motion systems — one token set per unit

A motion system is the ease, duration and stagger vocabulary every beat in a unit draws from, plus
the scroll philosophy that decides its engine. One per unit, named at the top of `## Motion`.

**Why one.** motionprompts.dev measured its own 248-component inventory and found 22 components
registering a custom ease named `hop` with 13 different curves — the last one evaluated silently
wins, and the page inherits whichever component was pasted last. The same drift happens inside a
single unit when each beat picks its own numbers: a 240 ms spring on the panel and a 900 ms
power3 on the hero read as two products. Its `motion-systems.json` groups the inventory into eight
systems whose tokens are *real values present in the members*, never averages. The five below are
the subset a card can use, with tokens drawn from what real cards have shipped.

Read `https://motionprompts.dev/api/v1/motion-systems.json` for the source; do not copy its
values in here — this file is the card-side vocabulary, not a mirror.

## The five

| System | Time authority | Engine in a card | Ease · primary / secondary / exit | Duration · fast / base / slow | Stagger · tight / base / loose |
|---|---|---|---|---|---|
| **discrete-feedback** | an event; fixed duration | CSS `transition` | `ease-out` (`cubic-bezier(0,0,.2,1)`) / `ease-in-out` / `ease-in` | 120 / 200 / 280 ms | 0 / 40 / 60 ms |
| **staged-arrival** | load, or the screen's one moment | CSS `@keyframes` + `animation-delay`, `both` | `cubic-bezier(.22,1,.36,1)` / `cubic-bezier(.65,0,.35,1)` / `cubic-bezier(.4,0,1,1)` | 240 / 480 / 900 ms | 60 / 90 / 140 ms |
| **scrub-welded** | scroll position, 1:1 | the scrub modifier from `show-scroll-reveal-and-scrub` writing `--progress`; `animation-timeline: view()` only as an `@supports` enhancement on an element the modifier does not drive | `none` — the scrollbar is the ease | — (the runway length is the duration) | per-element offset in scroll %, not ms |
| **scrub-lagged** | scroll position through a filter | the scrub modifier with `lag` (a damping time constant): `{{scrollScrub lag=160}}`. Always JS — CSS scroll timelines cannot lag | `cubic-bezier(.215,.61,.355,1)` / `none` / `cubic-bezier(.55,.055,.675,.19)` | `lag` 100 / 200 / 450 ms | 75 / 100 / 250 ms |
| **pointer-follow** | a live input through a filter | a per-frame loop in a modifier stepping with the pattern's `damp()`, τ 85–130 ms | `cubic-bezier(.215,.61,.355,1)` / `cubic-bezier(.645,.045,.355,1)` / `cubic-bezier(.645,.045,.355,1)` | 250 / 300 / 2000 ms | 75 / 100 / 100 ms |

**discrete-feedback is what the Interaction table already specifies.** A unit whose motion is all
discrete has this system implicitly and never needs a `## Motion` section. It is listed so the other four
can be defined against it and so a unit that *does* get a spec keeps its panels and stamps in the
same vocabulary as its arc.

## Choosing

- The **Narrative arc** is load-time beats only (regions arrive, headline settles) → **staged-arrival**.
- A **scroll-scrubbed subject**, a **pinned sequence**, a **sequence scrub** direct-manipulation
  way → **scrub-welded** by default. It is the cheap one: no per-frame JS after the measure, CSS
  where supported, reversible for free, and it reads as *precise*.
- The reference site has the trailing, momentum-like glide (you stop scrolling and the subject
  keeps travelling ~1 s) → **scrub-lagged**, the scrub modifier with `lag`. Say so in the Engine table; it is
  the single most common difference between "moves" and "moves like the reference".
- **Orbit**, **camera parallax**, a cursor-following element → **pointer-follow**. It never ends
  by itself; the modifier must stop the loop on `willDestroy` and when the card leaves view.
- **Scroll parallax**, a **reading-progress line**, **scroll snap** → they ride on whichever scrub
  system the unit already has (parallax and progress are `--progress` consumers; snap is a CSS
  property on the scroller). They never justify a system or a loop of their own.
- **Marquee** is the one continuous loop with no input — it belongs to no system. Linear, one lap
  20–40 s, paused under reduced motion and on hover; write it as its own Effect row with
  `trigger: none (loop)` so the reviewer's motion-off pass knows to expect it stopped.

Two systems in one unit is a finding. If a unit genuinely needs load-time beats *and* a scrub, the
scrub is the system and the arrival beats use its `fast`/`base` and `primary` — the arrival is
short enough that the difference does not read.

## Custom eases

Name one per unit at most, define it once on the root (`--ease-hop: cubic-bezier(.8,0,.1,1)`),
and reference it by that property everywhere. Prefix the name with the unit (`--{unit}-ease-hop`)
when the card can render inside another that defines its own. `element.animate()` does not accept
`var()` as `easing`; a JS beat reads the value first:
`getComputedStyle(root).getPropertyValue('--ease-hop').trim()`.

**Lag and duration columns.** For scrub-lagged and pointer-follow, the ease and duration columns
govern their discrete state changes (a panel opening inside the scene); the follow itself has no
ease or duration, only its time constant: `lag` for the scrub, τ for pointer-follow.

## Writing the numbers into rows

Copy the value, not the token name. `480ms` in the row, not `base`. The table above is where the
builder learns why every arrival in the unit is 480 ms; the row is where they read what to type.
