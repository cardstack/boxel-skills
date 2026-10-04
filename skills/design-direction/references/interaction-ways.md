# Interaction ways

**Motion lives in three places; this file is the first.** Read the row you are in before the rest.

| Layer | Question | Written in | Applies to |
|---|---|---|---|
| [`boxel-design/references/motion-baseline.md`](../../boxel-design/references/motion-baseline.md) | the CSS motion every build ships: arrival, scroll reveal, hover feedback, one ambient loop | automatic, in the style family's motion character | every user-facing unit |
| **This file** → `## Design direction` Interaction table and Narrative arc | *which* way, its budget, its fallback, whether it is CSS or JS | one line per action, three beats per arc | every unit |
| `motion-authoring` → `## Motion` | *exactly how* — offsets, eases, the geometry the effect depends on, the JS loop | one row per beat | only units with an arc, a scrubbed subject, a direct-manipulation way or a JS way |
| `design-review` | *did it land* — captures at the arc's three points, motion-off pass | a score | after the build |

So "scroll parallax" is **named** here (with its cap), **specified** in `## Motion` (which layers,
what rate, over which scroll range) and **checked** by review. If you are writing a `cubic-bezier`
or a scroll offset in this file or in `## Design direction`, you are one layer too deep.

How an action can present. Pick by budget, not by flavour. This is the Boxel-specific catalogue;
for anything it does not cover, reason from the principles behind it — feedback, affordance,
cognitive load, accessibility — and record why the pick suits the action.

**Budgets.** Repeated actions (done many times a day) stay under 200 ms with no attention-grabbing
motion — the cost is paid on every repeat, and what delights once irritates the hundredth time.
Moments (rare, and mattering) may take 400–900 ms and one orchestrated sequence. One moment per screen.

Each pick records: trigger · response · duration and easing · reduced-motion fallback · repeat cost.

**Triggers**: click · double-click · hover · long-press · drag · drop · keyboard · type/paste ·
scroll into view · focus · submit · **pointer move · continuous scroll · pinch · swipe · range
input** — the last five drive the direct-manipulation ways below, which the discrete table cannot
describe.

**Responses**
- **navigate** — replaces the screen. Cheapest, loses context.
- **side panel** — slides from the edge, the list stays. Good for compare.
- **inline expand** — the item grows in place, siblings reflow.
- **popover** — small, anchored, dismisses outside. For peeks and quick edits.
- **sheet** — the narrow-screen form of a panel.
- **in-place transform** — the element becomes the result.
- **staged moment** — leave, arrive, settle.
- **ambient change** — tint, ring or background shifts, no modal.

## By action kind

**Open an item from a collection**

| Way | Trigger → response | Budget | Reduced motion | Repeat cost |
|---|---|---|---|---|
| Navigate | click → isolated view | instant | same | low |
| Side panel | click → panel in 280 ms, list stays, dims 10% | 280 ms ease-out | appears, no slide | low |
| Expand in place | click → tile grows to 2×, siblings reflow | 240 ms spring | swaps to detail | medium |

**Commit a transaction**

| Way | Trigger → response | Budget | Reduced motion | Repeat cost |
|---|---|---|---|---|
| Row appears | submit → new row rises into the list | 300 ms | appears | low |
| Print | submit → receipt slides from the tile edge | 600 ms ease-out | appears | medium |
| Exchange | submit → figure counts down, item lands, balance settles | 900 ms staged | updates in place | high — moments only |

**Validate or check**

| Way | Trigger → response | Budget | Repeat cost |
|---|---|---|---|
| Verdict line | submit → text under the field | instant | low |
| Flip | submit → card flips to its result face | 400 ms | low |
| Stamp | submit → stamp lands with one frame of overshoot | 350 ms | low |

**Cross a threshold** (promote, complete, level up)

| Way | Response | Budget |
|---|---|---|
| Swap | the badge text changes | instant |
| Ring completes | ring fills, badge takes the new colour | 800 ms |
| Moment | screen tints, badge grows then settles, a row appears | 1200 ms staged |

**Filter or switch view**

| Way | Response | Budget |
|---|---|---|
| Instant | list re-renders | instant |
| Reflow | items slide to new positions | 200 ms |
| Crossfade | old pane out 120 ms, new in 200 ms | 320 ms |

**Peek without leaving** — tooltip (one line, instant) · popover card (embedded view, anchored,
160 ms) · preview rail (right rail shows the embedded view, 160 ms).

**Empty state** — invitation (one sentence naming the first action, the action beside it) · ghost
(a faint outline of what will appear, action inside it) · style piece (a motif in the chosen style,
action below).

**Error and recovery** — inline (message beside the field, focus kept) · shake (2× in 240 ms,
message appears; reduced: message only) · dignified (the block tints, the message says what to do
next, nothing red until the second failure).

## Direct manipulation — continuous input, continuous state

Everything above is **discrete**: an event fires, a response plays for a fixed duration, it ends.
Some interactions are not that shape. The user moves something and the thing moves with them; there
is no duration to budget because the user owns the timing.

| Way | Input → state | Where it earns its place |
|---|---|---|
| **Orbit** | drag → rotation angle | an object whose back matters as much as its front |
| **Sequence scrub** | continuous scroll, or a range input → step in an ordered series | assembly order, a timeline, before/after |
| **Explode** | range input → separation distance | showing how parts relate without losing the whole |
| **Camera parallax** | pointer move → small camera or layer offset | depth as ambience, never as the only cue |
| **Zoom to part** | double-click → focus a selected element | after selection, not instead of it |
| **Pinch / swipe** | the touch forms of zoom and scrub | required if any of the above ship on a phone |

**Record a different set of facts.** Duration and easing do not apply. Record instead:

- **input → mapped value**, with its **bounds** and whether it clamps or wraps
- **release behaviour** — settles where released, snaps to the nearest step, or springs back
- **the keyboard equivalent** — arrow keys on a focused element, or a real `<input type="range">`.
  A rotation only a mouse can reach is not an interaction, it is a demo
- **the reduced-motion answer**, which is not "turn it off": every state the gesture can reach must
  stay reachable without it. Usually that means the range input is the control and the gesture is
  the shortcut

**Four constraints from the card runtime:**

1. **Pointer capture stays inside the card.** Use `setPointerCapture` on the element, and release
   it on `pointerup` / `pointercancel`. The same card can be open in two stacks — a `document`-level
   `pointermove` listener will drive both.
2. **`touch-action` is mandatory.** Without it the browser's own scroll or pinch wins, and on a card
   that is *itself* inside a scroll container the result is that neither works. Set
   `touch-action: none` on the manipulable element only, never on an ancestor.
3. **Continuous scroll competes with the card's own scroller.** An isolated card is
   `height: 100%; overflow-y: auto` — scroll-as-input and scroll-to-read are the same gesture.
   Either the manipulable region is `overscroll-behavior: contain` and shorter than the viewport,
   or use a range input instead and leave scrolling alone.
4. **State goes on a field, not a component property**, when it is part of the record. A rotation
   that is just viewing is component state; an exploded-view step the user is meant to share is a
   field, and the build wires it as one.

One direct-manipulation way per screen, at most. It is the most expensive kind of interaction to
build, to make accessible, and to test.

## Narrative ways — motion that unfolds the composition, not motion that answers an action

Everything above is **interaction motion**: the interface responding to something the user did.
A second class exists, and a landing page or a public page is usually asking for it: **narrative
motion**, where the composition itself unfolds over time or scroll. It answers no action, so none
of the budgets above apply to it. Its own rules:

- **Two or three places per page, not one per element.** Motion is rhythm: it marks where the
  reader is and what matters, and it stops doing that the moment everything performs. Count the
  ways this table contributes to a screen; at four, remove one. A whole page animating on load
  is the failure this rule exists for.

- **One arc per unit, and only on `isolated`** of a routed or `prefersWideFormat` page. `fitted`,
  `embedded` and `atom` never carry it — they are rendered inside someone else's composition.
- **It serves the signature treatment.** The arc reveals the one arresting thing; it does not
  become a second one. If the motion would be the most memorable element, the signature is wrong.
- **The static composition stands alone.** Reduced-motion is not a fallback here; it is the
  baseline the arc layers onto. Design the still frame first, then decide what moves.
- **Budget is total length**, not per-response: how long until the fold has finished arriving, and
  how much scroll the arc consumes. Anything the user has to wait through twice is too long.
- **The card owns only its own scroll box.** An isolated card is `height: 100%; overflow-y: auto`
  inside a host pane, so scroll-linked motion is measured against the card's scroller, never the
  window — and the host may resize or stack it. A whole-viewport pinned sequence is not available.

| Way | Reads as | Achievable with |
|---|---|---|
| **Staggered arrival** — regions enter in reading order on load | the page assembling itself | CSS: `@keyframes` + `animation-delay`, `animation-fill-mode: both` |
| **Scroll-triggered reveal** — each block animates in as it enters view | the page arriving as you read it | **no library needed** — either CSS `animation-timeline: view()`, or an `IntersectionObserver` in a Modifier. See the note below |
| **Scroll-linked progress** — an element's state follows scroll position | the reader drives the story | **JS**: the scrub modifier in `show-scroll-reveal-and-scrub`, which works in every browser. CSS `animation-timeline: scroll()` / `view()` only as an `@supports` enhancement, never on an element the modifier also drives. When what follows the scroll is the unit's one subject — a bottle turning, a device scaling — that is a signature decision: see *The scroll-scrubbed subject* in [`signature-treatments.md`](signature-treatments.md) |
| **Pinned sequence** — a region holds while content passes | a chapter | CSS `position: sticky` for the hold; the passing content is scroll-linked as above |
| **Text split reveal** — a headline arrives by word or character | emphasis | CSS on spans split in the template, or by a few lines of **JS** in a Modifier |
| **Ambient canvas** — particles, grain | atmosphere | **JS**: a `<canvas>` drawn in a Modifier, plain 2D drawing |
| **Smooth / inertial scroll** — the scroller itself eased | polish | **not available** in a card — the host owns the pane's scroll physics |
| **Shape morph** — one SVG shape becoming a different one | transformation | **not available** in a card, unless both paths share one command sequence (then **JS** interpolation). Otherwise a crossfade or a mask reveal |
| **Scroll parallax** — fore, mid and back layers travel at different rates | depth while reading | scroll-linked progress on two or three layers, `transform` only. **Amplitude is capped**: the fastest layer moves at most 1.25× the slowest, and the background never more than 8% of the stage height over the whole runway — past that it reads as the page sliding apart, and it is the commonest way a scroll page makes people ill |
| **Reading progress** — a thin line or figure that fills as the page is read | orientation on a long page | **CSS only**: `transform: scaleX(var(--progress))` on a 2px line, fed by the same `--progress` the scrub modifier already writes. Belongs on a long `isolated` read; never on a screen shorter than two stages |
| **Scroll snap** — the scroller aligns to a chapter or card after each scroll | chapters, a horizontal set | **CSS only**: `scroll-snap-type` on the card's own scroller, `scroll-snap-align` on each chapter. **Mutually exclusive with a runway / pinned sequence** — snap points and a sticky stage fight over the same scroll position. `proximity`, never `mandatory`, on any pane that also holds text taller than one stage |
| **Marquee** — a strip of logos, terms or a slogan scrolls continuously | ambience; a set too long to lay out | **CSS only**: the content duplicated once for a seamless loop, `@keyframes` on `translateX(-50%)`, linear, 20–40 s per lap. **Pauses under `prefers-reduced-motion`** (`animation-play-state: paused` with the first copy fully visible) and on hover; an unpausable loop is the one motion that fails the reduced-motion check outright. One per unit |

**Not a narrative way: infinite scroll.** Loading more items when the reader reaches the bottom is
a data mechanism, not motion — it is a live query with a page size, owned by the build's wiring
step. Design its *arrival* here (the new rows use the same reveal way as the rest) and nothing
else.

**Scroll-triggered reveal is the one that always works, and the one that fails silently.** It needs
only *a* scroller, and an isolated card has one — its root is `height: 100%; overflow-y: auto`, so
the blocks scroll inside the card and the card's own scroller is the timeline. Nothing here needs
the window, which is why this is achievable when the pinned and smooth-scroll ways are not.

Two routes, and the choice is the builder's unless `## Design direction` says otherwise:

| Route | Cost | Watch |
|---|---|---|
| CSS `animation-timeline: view()` | zero JS | check support first — `CSS.supports('animation-timeline: view()')` — and note it is inherently scrubbed, so it reverses on scroll-back by design |
| `IntersectionObserver` in a Modifier | a few lines | **`root` must be the card's scrolling element, never `null`.** `null` means the viewport, and in a host stack pane that fires at the wrong time or never |

**ready: a workspace pattern implements both this and scroll-linked progress with the `root`,
`unobserve`, reduced-motion and no-`vh` rules already applied** — the builder should start from it
rather than rewrite the observer, which is how the `root: null` bug keeps reappearing. Direction
still decides *whether* and *what*; the pattern only supplies the how.

Four rules:

- **Once, not on every pass.** Derived, not asked: `repeat cost` above says what delights once
  irritates the hundredth time, and repeated unpredictable movement is the motion most likely to
  affect someone with a vestibular condition. Blocks do not re-hide on scroll-back. State it in the
  `## Design direction` Interaction row in one line — *"reveal on enter, once only (repeat cost)"* — so the
  decision is visible without being a question.
- **Overriding it is a written decision**, not a build-time improvisation, because it selects the
  route: replay-on-re-entry means keeping the observer (or `view()`, which reverses anyway), while
  once-only means `unobserve()` after the first hit. A chart that redraws its data is the
  legitimate case; "it looked nice" is not.
- **The resting state is the final state.** `.block { opacity: 0 }` with the reveal adding the
  visible state is the classic form of this way and the most common silent failure in a build:
  if the observer never fires — reduced motion, a capture, an error, a card rendered where it never
  scrolls — those blocks are invisible forever and nothing errors. Put the `from` in the keyframe
  with `animation-fill-mode: both`. `design-review`'s motion-off pass exists to catch exactly this.
- **`isolated` only.** `fitted` and `embedded` render inside someone else's composition and are
  usually too small to have a meaningful scroll; a reveal there just means content that is not there.

Record each narrative way in `## Design direction` under **Narrative arc** with its achievability column. A
way marked **JS** is named here as a *capability* — "scroll-linked progress", "pointer-follow" —
and `motion-authoring` writes how it runs. No way needs an animation library: a card's motion is
CSS, or plain JS in a Modifier.

**The arc is a brief, not a build.** Three beats and a budget tell a builder *what* unfolds; the
start and end offsets, the easing, whether the subject lags the scroll, and the CSS geometry the
effect depends on are not decided here and must not be improvised while the first screen is being built. When a unit records a
Narrative arc, a scroll-scrubbed subject, a direct-manipulation way or any way marked *JS*,
`motion-authoring` writes those numbers into a `## Motion` section on the same brief card, after `## Design direction`, before those beats are built.
Units whose motion is all discrete feedback never get one — the Interaction table is their whole
motion spec.

## Ready components

When a catalog or realm component already implements a way, note it as "ready: <component>" beside
that way so the builder knows. Never pick a way because a component exists — a ready component must
not force a dull direction.
