# Capture — tools, budgets and flakiness

_Read before scoring, every time. Nothing in the review is valid without captures._

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot.

| View | Tool | Notes |
|---|---|---|
| isolated, embedded, fitted, **from a terminal** (Claude Code or any session without the host tools) | boxel CLI: `npx boxel screenshot <card-url> --format isolated --full-page --out <scratch>`; `--format embedded`; `--format fitted --envelope 400x300` (fitted needs an envelope) | one card and format per call, or a `--spec` batch file; it retries while the server is busy. Use the card instance URL, never the `.json` file. `--full-page` grows the frame only when the page scrolls; an isolated card that scrolls inside its own root stays at the viewport height, so give it a taller `--viewport` (`800x2000`) to see all of it |
| isolated, embedded, fitted | capture service (`POST /_capture-card`, host `CaptureCardTool`) | one batch per module — `captures: [{name}]`, ≤ 12 entries, inside the 25 s budget. Capture-only: bytes return as base64, nothing persists server-side |
| app isolated with tabs, atom, edit | MCP browser (chrome-devtools) | the service cannot click a tab, or capture atom and edit on demand. One shot each; click tabs in turn |

**Missing host tools is never a reason to skip the review.** From a terminal, the boxel CLI is the
capture tool: run it for every view the review needs, then read the image files it writes. In the
Boxel app, use the capture service first for everything it supports, and the browser only for the rest. If the browser is unavailable
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

## Scroll motion: three captures on the card's own scroller

A unit whose `## Motion` section has a scrubbed or pinned beat cannot be judged from one still,
and the capture service only captures at scroll 0. Take its three **Net journey** points (start,
mid, end, each a `--progress` value) in the MCP browser, at viewport size, not full page:

```js
// run in the MCP browser with the card open; p is the Net journey point's progress (0, 0.5, 1)
async (p) => {
  const track = document.querySelector('[data-scrub-track]');
  const stage = track.querySelector('[data-scrub-stage]');
  let scroller = track.parentElement;            // the card's own scroller, never the window
  while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
  const target = scroller ?? document.scrollingElement;
  const top = scroller                           // the track's position inside the scroller's content
    ? track.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
    : track.getBoundingClientRect().top + window.scrollY;
  target.scrollTop = top + p * (track.offsetHeight - stage.offsetHeight);
  await new Promise((done) => {                  // wait for the scrub to land, at most 1.5 s
    const stop = setTimeout(done, 1500);
    const check = () => track.hasAttribute('data-motion-settled') ? (clearTimeout(stop), done()) : requestAnimationFrame(check);
    requestAnimationFrame(check);
  });
}
```

Capture after the promise resolves. If it resolved on the timeout, the scrub never settled; say so beside the capture.

Read the three captures for:

- **The still frame holds everything.** The start capture shows every word and number the section
  has. Copy that only appears mid-scroll is a finding.
- **The arc moved.** A mid or end capture identical to start is a finding: "arc never moved".
- **No blank region** in any of the three, as everywhere else.

With motion on, a full-page capture of such a unit shows the pinned stage once and then the rest
of its runway as empty space. That space is expected, not a finding. The full-page check for blanks
on these units is the motion-off pass below, which collapses the runway.

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
  '<style>*,*::before,*::after{animation:none !important;transition:none !important}' +
  '[data-scrub-track]{height:auto !important}[data-scrub-stage]{position:static !important}</style>');
```

then reload-free re-capture. The last two rules collapse a scroll scrub's runway, as reduced motion
does ([`show-scroll-reveal-and-scrub`](../../boxel-patterns/patterns/show-scroll-reveal-and-scrub/README.md)
§6), so the full-page capture shows the still frame and no empty track. Anything that disappears has its resting state wrong. This tests the
condition that matters — animations never play — which is what a reduced-motion user experiences
whether or not the card implements the media query.

Run it once per unit, on any screen that animates. If the MCP browser is unavailable, say the pass
did not run rather than passing the check silently.
