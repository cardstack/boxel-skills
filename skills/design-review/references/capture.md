# Capture — tools, budgets and flakiness

Part of [`design-review`](../SKILL.md). Links are relative to this file.

_Read before scoring, every time. Nothing in the review is valid without captures._

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot.

| View | Tool | Notes |
|---|---|---|
| any card or file, **in the Boxel app** | `view-visually` ([`host-commands-reference.md`](../../boxel-environment/references/host-commands-reference.md) → *Seeing*) | the default in the app; capture as often as you need, one card or format per call |
| isolated, embedded, fitted, **from a terminal** (Claude Code or any session without the host tools) | boxel CLI: `npx boxel screenshot <card-url> --format isolated --full-page --out <scratch>`; `--format embedded`; `--format fitted --envelope 400x300` (fitted needs an envelope) | one card and format per call, or a `--spec` batch file; it retries while the server is busy. Use the card instance URL, never the `.json` file. `--full-page` grows the frame only when the page scrolls; an isolated card that scrolls inside its own root stays at the viewport height, so give it a taller `--viewport` (`800x2000`) to see all of it. A `fitted` capture on its own can come back without the card's theme (light ground, default fonts) even when the card links one; capture it inside its parent (the Home) before reporting it as unthemed |
| isolated, embedded, fitted | capture service (`POST /_capture`, host `CaptureTool`) | one batch per module — `captures: [{name}]`, ≤ 12 entries, inside the 25 s budget. Capture-only: bytes return as base64, nothing persists server-side |
| app isolated with tabs, atom, edit | MCP browser (chrome-devtools) | the service cannot click a tab, or capture atom and edit on demand. One shot each; click tabs in turn |

**Missing host tools is never a reason to skip the review.** From a terminal, the boxel CLI is the
capture tool: run it for every view the review needs, then read the image files it writes. In the
Boxel app, use `view-visually` (or the capture service for a batch) first, and the browser only for the rest. If the browser is unavailable
— profile locked, or two navigation timeouts — do not block: review the service captures and list
the uncaptured views by name. Write captures to the session scratch folder and delete them after
scoring; none belong in the realm, the repo or the media cache.

If capture fails entirely, say so and stop. A code-only review reads as a real review and is not one.

**A blank region in a capture is a finding.** An animation's resting state is its final state
([`template-patterns.md`](../../boxel-ui-guidelines/references/template-patterns.md) → *Entrance animations — never put `opacity: 0` in base CSS*),
so a finished animation never leaves a section empty. A capture that fires before the card finishes
loading still can, so re-capture a blank region **once**; if it is blank again, report it. When the
cause is an entrance whose resting state is hidden, the fix is the resting state, not capturing later.

The same flakiness applies to targeted captures: the same selector can match on one run and miss on
the next. Treat a single failed capture as noise, not evidence.

## Scroll motion: three captures on the card's own scroller

A unit that moves with scroll ([`card-motion`](../../card-motion/SKILL.md)'s `scrollProgress`) cannot
be judged from one still, and the capture service only captures at scroll 0. In the MCP browser,
scroll the card's own scroller (never the window) to the start, middle and end of the effect, wait
for the motion to settle, and capture each at viewport size, not full page. Read the three for:

- **The still frame holds everything.** The start capture shows every word and number the section
  has. Copy that only appears mid-scroll is a finding.
- **It moved.** A mid or end capture identical to start is a finding: "scroll effect never moved".
- **No blank region** in any of the three, as everywhere else.

## The motion-off pass

A normal capture is taken after the animations have run, so it cannot show what a reduced-motion
user sees. That matters because the failure is total rather than cosmetic: an element whose
**resting** CSS is `opacity: 0` or `transform: scaleX(0)`, animated into view, is invisible forever
for anyone whose animations never play — and every ordinary capture, every lint pass and the card's
own markup all look correct.

`chrome-devtools`'s `emulate` tool cannot set `prefers-reduced-motion` — it covers colour scheme,
viewport, network, CPU, geolocation and headers only. So reproduce the condition instead of the
media query: with the card open in the MCP browser, inject

```js
document.head.insertAdjacentHTML('beforeend',
  '<style>*,*::before,*::after{animation:none !important;transition:none !important}</style>');
```

then reload-free re-capture. Anything that disappears has its resting state wrong. This tests the
condition that matters — animations never play — which is what a reduced-motion user experiences
whether or not the card implements the media query.

The injected rule stops CSS animations only. Motion built with `card-motion` runs in JS and respects
reduced motion by default; for it, check that the capture taken after the motion settles shows every
element, and that the card does not override `<MotionConfig @reducedMotion>`.

Run it once per unit, on any screen that animates. If the MCP browser is unavailable, say the pass
did not run rather than passing the check silently.
