# Capture — tools, budgets and flakiness

_Read before scoring, every time. Nothing in the review is valid without captures._

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot.

| View | Tool | Notes |
|---|---|---|
| isolated, embedded, fitted | capture service (`POST /_capture-card`, host `CaptureCardTool`) | one batch per module — `captures: [{name}]`, ≤ 12 entries, inside the 25 s budget. Capture-only: bytes return as base64, nothing persists server-side |
| app isolated with tabs, atom, edit | MCP browser (chrome-devtools) | the service cannot click a tab, or capture atom and edit on demand. One shot each; click tabs in turn |

Service first for everything it supports, browser only for the rest. If the browser is unavailable
— profile locked, or two navigation timeouts — do not block: review the service captures and list
the uncaptured views by name. Write captures to the session scratch folder and delete them after
scoring; none belong in the realm, the repo or the media cache.

If capture fails entirely, say so and stop. A code-only review reads as a real review and is not one.

**A blank region in a capture is a finding.** Entrances and reveals move content and never fade it
([`motion-baseline.md`](../../boxel-design/references/motion-baseline.md)), so no baseline animation
paints a section empty at any moment. A capture that fires before the card finishes loading still
can, so re-capture a blank region **once**; if it is blank again, report it. When the cause is an
entrance that fades from `opacity: 0`, the fix is to make it move instead, not to capture later.

The same flakiness applies to targeted captures: the same selector can match on one run and miss on
the next. Treat a single failed capture as noise, not evidence.

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

Run it once per unit, on any screen that animates. If the MCP browser is unavailable, say the pass
did not run rather than passing the check silently.
