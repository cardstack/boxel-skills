# Capture — tools, budgets and flakiness

Part of [`design-review`](../SKILL.md). Links are relative to this file.

_Read before scoring, every time. Nothing in the review is valid without captures._

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot.

| View | Tool | Notes |
|---|---|---|
| isolated, embedded, **in the Boxel app** | `realm.capture(target)` inside a `run-realm-code` script ([`source-code-editing`](../../source-code-editing/SKILL.md) → `realm.capture`) | the default in the app; capture as often as you need. It cannot capture `fitted`: capture the parent that renders the fitted cards (Home, an isolated or embedded view). `atom` and `edit` cannot be captured in the app; list them as uncaptured |
| isolated, embedded, fitted, **from a terminal** (Claude Code or any session without the host tools) | boxel CLI: `npx boxel screenshot <card-url> --format isolated --full-page --out <scratch>`; `--format embedded`; `--format fitted --envelope 400x300` (fitted needs an envelope) | one card and format per call, or a `--spec` batch file; it retries while the server is busy. Use the card instance URL, never the `.json` file. `--full-page` grows the frame only when the page scrolls; an isolated card that scrolls inside its own root stays at the viewport height, so give it a taller `--viewport` (`800x2000`) to see all of it. A `fitted` capture on its own can come back without the card's theme (light ground, default fonts) even when the card links one; capture it inside its parent (the Home) before reporting it as unthemed |
| isolated with tabs, atom, edit, **from a terminal** | a browser driven by the session (chrome-devtools), where one is available | the CLI cannot click a tab or capture atom and edit. One shot each; click tabs in turn |

**Missing host tools is never a reason to skip the review.** From a terminal, the boxel CLI is the
capture tool: run it for every view the review needs, then read the image files it writes. In the
Boxel app, `realm.capture` in a `run-realm-code` script is the capture tool. Where a view cannot be captured (fitted on its own,
atom and edit in the app; a browser that is unavailable from a terminal), do not block: review what
was captured and list the uncaptured views by name. From a terminal, write captures to the session
scratch folder and delete them after scoring; none belong in the realm or the repo.

If capture fails entirely, say so and stop. A code-only review reads as a real review and is not one.

**A blank region in a capture is a finding.** An animation's resting state is its final state
([`template-patterns.md`](../../boxel-ui-guidelines/references/template-patterns.md) → *Entrance animations — never put `opacity: 0` in base CSS*),
so a finished animation never leaves a section empty. A capture that fires before the card finishes
loading still can, so re-capture a blank region **once**; if it is blank again, report it. When the
cause is an entrance whose resting state is hidden, the fix is the resting state, not capturing later.

The same flakiness applies to targeted captures: the same selector can match on one run and miss on
the next. Treat a single failed capture as noise, not evidence.

## Budget

In the app, `realm.capture` in a `run-realm-code` script allows at most three captures per run, within the run's 55 seconds
([`source-code-editing`](../../source-code-editing/SKILL.md)); spread the rest over further calls or
runs rather than dropping any. Capture in this order: Home at desktop and phone, each card's
isolated view, then the embedded and fitted views. Any view not captured is listed under
`uncaptured:` in the report with the reason, and every check that depends on it stays open, never
passed.

## Scroll motion: three captures on the card's own scroller

A unit that moves with scroll ([`card-motion`](../../card-motion/SKILL.md)'s `scrollProgress`) cannot
be judged from one still: a capture shows one scroll position. In a browser,
scroll the card's own scroller (never the window) to the start, middle and end of the effect, wait
for the motion to settle, and capture each at viewport size, not full page. Read the three for:

- **The still frame holds everything.** The start capture shows every word and number the section
  has. Copy that only appears mid-scroll is a finding.
- **It moved.** A mid or end capture identical to start is a finding: "scroll effect never moved".
- **No blank region** in any of the three, as everywhere else.

## The motion-off pass

The rules for motion live where it is written: CSS entrances keep their resting state visible
([`template-patterns.md`](../../boxel-ui-guidelines/references/template-patterns.md) → *Entrance
animations — never put `opacity: 0` in base CSS*), and motion built with
[`card-motion`](../../card-motion/SKILL.md) (glimmer-motion, Choreo) honours reduced motion by
default through `<MotionConfig @reducedMotion>`. This pass only checks that the build kept them, from
what renders, because a normal capture is taken after the animations ran and cannot show what a user
whose animations never play sees: an element whose resting state is hidden stays invisible for them,
while every ordinary capture, lint pass and the markup look correct.

- **CSS animations**, from a terminal with a browser: open the card, inject
  `<style>*,*::before,*::after{animation:none !important;transition:none !important}</style>` into
  the document head, and re-capture without reloading. Anything that disappears has its resting
  state wrong. (Browser emulation cannot set `prefers-reduced-motion`, so this reproduces the
  condition instead.)
- **`card-motion` and Choreo motion** runs in JS, which the injected rule does not stop: check that
  the capture taken after the motion settles shows every element, and that the card does not set
  `@reducedMotion` to something other than the default.

Run it once per unit, on any screen that animates. Where no browser is available (the Boxel app, or
a terminal without one), say the pass did not run rather than passing the check silently.
