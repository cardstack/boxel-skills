---
name: design-review
description: Score a built Boxel screen, card or whole app against its brief and an aesthetic bar, from screenshots — never from code. Runs automatically after every build of an app, card family or user-facing card (set and card modes, one fix round, then more on request). Also use it whenever someone asks for a design review or critique ("how does this look", "is this good enough", "why does this feel off"), right after a screen is built and before more are, when all screens exist and need checking as a set, and for the linked CardDefs whose embedded, fitted and atom views were written in passing. Use it even when the work looks fine. It reviews what exists.
boxel:
  kind: skill
---

# Design Review

_Score what was built, from what it looks like._

| Contract | |
|---|---|
| **Reads** | Captures of the built thing, and the unit's brief card — its `spec`, the acceptance lines and anti-patterns in a `designDirection` field when an earlier brief carries one, the numbers in its `motion` field where that is filled |
| **Writes** | Nothing. The report is the deliverable: the brief card records decisions, not scores, so a review never edits it |
| **Stops when** | The verdict is reported and the next step — fix, review another surface, revisit a decision, or stop — is offered as a choice |

Everywhere below, `## Design direction` means the brief card's `designDirection` field and
`## Motion` its `motion` field. `boxel-design`'s Look check writes only a `Look:` and a `Real details:` line into
`designDirection`: score the colour against the first and check that no proof was invented beyond the
second. A brief from earlier work, or one written by hand, may carry a full direction. Every rule below
that reads `## Design direction` acceptance lines applies only when that field holds them. With it empty, what was decided is the brief's `spec` (or, with no
brief, the build's own hand-off line).

You review a built thing against two standards: what was decided for it, and an
aesthetic bar that a competent-but-generic result does not clear. Where they conflict, `## Design direction`
wins on *what was decided* and you judge only *how well it was executed*.

**Runs after every build, automatically** — see *Automatic review after every build* below. **Four modes.** `design-review refine` builds, scores and fixes in a loop until the unit clears the gate — see [`references/benchmark-and-refine.md`](references/benchmark-and-refine.md). Default reviews one screen. `design-review set` reviews every screen of an app
together — reach for that whenever more than one screen exists, because coherence across screens is
the thing no single-screen review can see. `design-review card <CardDef>` reviews one card's
formats as a family, and is the mode nobody remembers to run: in an app, the cards behind the links
are the surfaces that get built in passing and scored by nothing.

## Automatic review after every build

`boxel-design` and the design-playbook decide and build; this is the last design step, and it is
not optional or offered. When a build of an app, a card family or a single user-facing card
finishes, run this loop without being asked, over **everything the build produced**:

1. **The builder's check comes first** ([`references/build-check.md`](references/build-check.md)):
   the builder captures its own work and fixes every pass/fail line (names, fill, media, phone,
   colour roles, type, controls, main action, one signature, job first, same facts) before any review round. It gives no score.
2. **Capture and review the whole unit** (from a terminal with `npx boxel screenshot`, see
   [`references/capture.md`](references/capture.md)): `set` mode across every screen, and `card` mode on every
   CardDef the build produced or the screens link to — the cards behind the links are the surfaces
   that get written in passing and scored by nothing. A single card is reviewed in `card` mode.
3. **Score** with the benchmark (reuse it across rounds) and the brief's acceptance lines.
4. **Fix the top gaps only**, at most three per round, on the failing screens or cards alone. A gap
   is a cause, not an instance: names cut off in six fitted tiles by one template is one gap. Then
   run the build check again on every view the fix touched, at desktop and phone width: a fix that
   widens a grid or adds a field often breaks the phone view. Report what changed and what was
   left alone.
5. **Re-capture and re-score, once.** The automatic loop runs **one fix round**: in test builds the
   first fix round raised the score by about 0.5 and later rounds changed it by no more than
   reviewer noise (three fresh reviews of the same captures scored 7.4 to 7.6), while each round
   cost 10 to 15 minutes. Skip the fix round when the first review already scores 9 or more with
   every acceptance line ticked, or when a failure traces to the direction itself (surface that as
   a choice; do not loop on it). The re-score's reviewer also gets the gap list with one line per
   gap on what changed, so it can say whether each fix landed; it reverses an earlier gap's advice
   only when the fix made things worse, and says so.
6. **One report at the end**: the tally and score per round, what is still short of the bar and why,
   and the next step as a structured choice, with **"Keep improving: one more round"** first when
   it did not clear the gate. Say plainly if it did not clear it. Each further round the user picks
   runs the same way, with the same gap list.

Where the harness can spawn a subagent, an independent reviewer does steps 1–2 each round (see
`references/benchmark-and-refine.md`); otherwise say the scores are provisional. Skip the loop only
for a utility card with no user-facing surface, and say so in one line.

## Capture first — there is no review without it

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot: a code-only
review reads as a real review and is not one. Service first for everything it supports, browser
only for the rest; if the browser is unavailable, review the service captures and list the
uncaptured views by name rather than blocking.

**Re-capture before reporting a fault that loading could cause**: a blank or stale image, an old
version of a screen, a control that looks disabled, a missing font. Report it only if the second
capture shows it too; one that does not is a capture fault, not the design's.

**A blank region in a capture is a finding.** Entrances move and never fade, so no baseline
animation paints a section empty; a card still loading can, so re-capture a blank region once,
then report it (`references/capture.md`).

Read `references/capture.md` for which tool captures which view, the
service's batch and time budgets, where captures go, and the flakiness rules.

## Phase 1 — The direction gate (only when the brief has one)

When the brief card's `designDirection` field is filled, it is the primary rubric.

1. Read its acceptance lines, its set acceptance lines, and its anti-patterns block. Each
   anti-pattern counts as an acceptance line.
2. Check each against the captures and the DOM. Tick or fail — no partial credit, no commentary.
3. Report first, in this shape:

```
Design direction: <passed>/<total> acceptance lines
FAILED
- <screen> · <line verbatim> · <one-line evidence> · <capture file>
```

Every failed line carries the screenshot it failed on, not just words. **Any failure is an
ITERATE** regardless of the score below — and in set mode it iterates that screen alone, not the set.

**Do not re-judge what `## Design direction` already decided.** The layout direction, the interaction way and
the named style were chosen deliberately, with reasons recorded. Score how well they were executed.
If you think a decision itself was wrong, say so once, separately, as a note to the user — not as a
score.

With `designDirection` empty, skip this phase and say the review ran without one.

## Phase 2 — The aesthetic gate

The bar is work that would be singled out, not work that is inoffensive. A result that is
professional, polished and forgettable sits around 6–7; the gate is **8.5**.

**Anchor the number to the field.** For a unit with an award-style category (portfolio, landing page,
product page, editorial), first run the benchmark in
[`references/benchmark-and-refine.md`](references/benchmark-and-refine.md): three recent winners from
Awwwards, the Webby Awards or FWA, captured at the unit's width, compared dimension by dimension.
Compare composition and type, not WebGL or page-wide motion a card cannot do. Without a benchmark,
say the scores are unanchored.

Score and name the specific thing behind each number:

- **Typography** — does the pairing look chosen? Read the declared **style family** first and score against *its* check in [`boxel-design/references/style-families.md`](../boxel-design/references/style-families.md): editorial wants large-light against small-bold, playful and vibrant want a heavy display against a plain body, brutalist wants hard and heavy. In every family, everything between 500 and 600 with a small step is a fail. Is there tracking on uppercase micro-labels where the family uses them? With no family declared, say so and judge on role clarity.
- **Honest gaps are not unfinished.** A section left out, a role in place of a name, or a marked slot where the business's real review, price or rating will go is correct ([`boxel-design/references/critical-rules.md`](../boxel-design/references/critical-rules.md) → *Never invent proof*). Never score it down as incomplete. An invented rating, name, year or testimonial is a finding.
- **Colour** — against the declared colour strategy. Restrained families: one accent in at most two places. Playful, vibrant, vintage: several colours are right when each has a named role and none competes for the same job. Colours with no assigned role fail in any family.
- **Composition** — does something dominate, or is it a row of equals? Is the reading order legible
  in the screenshot alone? Name the signature treatment on the dominant object and say whether it
  belongs to this style — [`boxel-design/references/signature-treatments.md`](../boxel-design/references/signature-treatments.md) is the authority on
  which treatments a style earns and why the default gradient-and-glass look scores *lower* than a
  plain surface; judge against it rather than restating it. Check the treatment survives into
  `embedded` and `fitted` as a compressed idea rather than a shrunken copy.
- **Media** — if the card has imagery, does it get real space, or hide under metadata? Check it
  **across formats, not just this screen**: the `## Design direction` section's Views table says what each one carries, so
  verify `embedded` and `fitted` show a focused crop rather than a shrunken copy of the hero, and
  that a card with an image never renders a text-only tile. A blank Media row on a unit that has an
  image field is itself a finding — the decision was never made. So is a media slot (a poster, a
  listing photo, a dish, a profile photo) that ships as a gradient, a lone glyph or initials: the
  first build fills it, at least with a labelled placeholder.
- **Detail** — the editorial micro-objects that signal care: an eyebrow with a rule, a stat slab
  bounded by lines rather than boxed, a fold cue. Two or three, not all of them.
- **Motion** — first check the **baseline** from [`boxel-design/references/motion-baseline.md`](../boxel-design/references/motion-baseline.md): arrival or scroll reveal on the `isolated` view, hover and focus feedback on controls, timing matching the declared motion character with one ease and one duration set, nothing missing with motion off. A unit missing the baseline caps at 8, unless the user asked for
  no animation (motion-baseline → *Off, on, or more*): then score only the hover, press and focus
  feedback, and apply neither cap. Then entrance, feedback, state change. Fade-only or instant swaps read as unfinished;
  spatial motion with character reads as designed. If motion is absent or purely functional, cap
  the score at 8 however good the static work is, except on a still page the user asked for. When `## Design direction` records a **Narrative arc**,
  score against it: do the beats arrive in the recorded order, does the still frame stand alone
  with motion off, does the arc reveal the signature rather than compete with it, and is any way
  marked *JS* actually running rather than approximated. Capture at least three points along
  the arc — a single screenshot cannot show a sequence. When a `## Motion` section from `motion-authoring` sits
  beside it, the three points are its **Net journey** lines (start / mid / end), captured as
  [`references/capture.md`](references/capture.md) → *Scroll motion* says, the numbers to
  check are its Effect rows, and the `## Assumed` list names the numbers nobody chose — read those
  first. A unit with no `## Motion` section and no arc is scored on its Interaction rows alone; do not ask
  for one.
- **Emptiness and error** — do they invite and instruct, or apologise?

Below 8.5, name the two or three things standing between here and the bar, then stop and let the
user decide whether to iterate. Do not soften the number to be encouraging; the number is the
useful part.

## Phase 3 — Constraints

After the aesthetic gate, check what would make the design wrong rather than plain:

- **Main action** ([`critical-rules.md`](../boxel-design/references/critical-rules.md) → *Main
  action always on screen*). Name the primary user and their main action from the UI; if the UI
  does not let you name it, that is a finding. Then check it is a button on Home without scrolling,
  at desktop and phone widths, and what it does: an external target links out or opens a marked
  slot naming what is needed; an internal target creates or changes a card that then shows where
  the operator would look. Severity: **blocker** when no main action is visible; **major** when an
  internal main action is a stub or fails, or a secondary action is a dead button that looks live;
  **minor** when it sits below the fold, is missing at phone width, or is not repeated on the card
  where it applies. When you cannot run the action from the session, say it was not exercised
  rather than passing it.

- **Accessibility** — contrast on every text-bearing surface, focus states, hit targets, and the
  motion-off pass for anything animated. The reduced-motion check is not "is there a fallback" but
  two questions the pass answers: does every element survive with animations off — upstream's rule
  is that *the resting CSS state must be the final state*, so a `from` belongs in the keyframe with
  `animation-fill-mode: both`, never in the base rule — and is every state the motion conveys
  reachable without it. Motion that carries information, such as a selection that only reads as
  selected while it animates, fails the second even when it passes the first. See
  `references/capture.md` → *The motion-off pass*.
- **Clarity** — can a first-time user tell what this is and what to do, from the screenshot?
- **Affordance honesty** — does everything that looks pressable have a focus state and a real
  control under it? A thing that reads as interactive and is not is a clarity failure before it is
  an implementation one. Check the screen's **primary action** by name against the content
  contract: if the contract says "start choosing a date" and the screen renders that phrase as a
  styled `<span>`, the screen has not delivered its primary action, however good it looks.
- **Affordance legibility — the inverse, and the one this list used to miss.** A control can be a
  real `<button>`, keyboard-reachable and correctly wired, and still fail: nothing about it says
  *press me*, or the thing you must hit is smaller than a fingertip. Both pass every other check on
  this page, and the report from the person using it is "I could not tell where to click".
  Three things to verify, from the captures plus a hover pass:
  - **Hit area.** Every control clears **44×44 CSS px**, or 32×32 for a control inside a dense
    data row with at least 8px between it and its neighbours. Measure the *hit area*, not the ink:
    a 16px icon in a 44px button passes, a 28px stepper does not.
  - **Hover and cursor.** Every control has a visible hover state — a fill, a border, a shift — and
    `cursor: pointer`. A row-sized invisible overlay button with no hover is the worst case: the
    whole row is clickable and nothing says so. Capture one hover state per control kind and check
    it differs from rest.
  - **A resting cue.** A control must be legible as one *before* the pointer arrives: a border, a
    fill, an underline, a chevron. Bare text that only reveals itself on hover is unreachable on
    touch and invisible to anyone scanning.
- **Domain fit** — does it use the domain's own conventions, or generic app furniture?
- **Robustness** — long strings, missing media, zero rows, one row, very many rows.

Do not resolve these by making the design plainer. A contrast failure is solved by finding a
colour that reads *and* belongs, not by reverting to grey.

## Set mode

`design-review set <unit>` reviews the whole app.

1. Capture every screen in one pass, batching per module, **plus the `embedded` view of every
   CardDef the screens link to** — those render inside the screens, so they are set surfaces.
2. Tick the **set acceptance lines** from `## Design direction` across all captures, then each screen's own.
3. Score coherence as its own dimension, looking across screens **and the linked cards' embedded
   views, which are part of the set**: one display face; the accent in the same role and nowhere
   else; one eyebrow treatment; the same way for the same kind of action; one empty-state voice;
   consistent spacing rhythm between groups. An embedded card that does not look like it belongs to
   the app it appears in is a set failure, not a card failure.
4. Report one table for the set, then per-screen failures. Iterate the failing screens only.

Run this before wiring starts. Once data flows, layout stops moving, and coherence problems get
lived with instead of fixed.

## Card mode

`design-review card <CardDef>` scores one CardDef's `isolated`, `embedded`, `fitted` (every size
that will actually be used), `atom` and `edit` as one family. `edit` is the one that goes missing:
the `## Design direction` section's Views table asks what it carries, and it used to appear in neither the build gate nor
this list, so it was specified and then never built or scored. Run it for **every CardDef the app links
to**, not only the ones that have their own screen — a card reached through `linksToMany` is a
surface the user sees, and it is the surface that gets written in passing.

1. **Capture all five** in one batch per module through the capture service where it can —
   `atom` and `edit` need the MCP browser, per `references/capture.md`. Fitted needs the sizes the
   app actually renders, not all sixteen.
2. **Tick the content matrix** — the
   design-playbook's Stage 0f block, written at planning.
   The plan said which fields appear at each format, in what
   wording register, and what is omitted. That is the rubric — check the capture against it field
   by field. A format carrying fields the matrix omits is as much a failure as one missing them.
3. **Score the family, not each format.** The question is whether the four read as the same card at
   four fidelities. Same signature gesture, same accent role, same type family, wording compressing
   rather than truncating.
   - **Check the breakpoints fire.** Capture each format at a narrow width as well as a wide one.
     A `@container` rule that targets the element carrying `container-type` is dead and silent — the
     layout simply never changes. Two tells without reading CSS: the narrow capture is identical to
     the wide one, or a two-column layout overflows instead of stacking.
   - **Check `isolated` hardest.** It is the one format that appears in no screen, so nothing in
     the build teaches it and nothing else reviews it. Two mechanical tells before you even judge
     it: `isolated` should be the *largest* of the four (a full page thinner than its own thumbnail
     is nobody's decision), and no field should appear in `fitted` or `embedded` but be missing
     from `isolated` — the full page is where everything is allowed.
4. **Check the two failures this mode exists to catch:**
   - **The pedestrian fitted** — title in big type, description truncated, date in muted small
     text. It means the format is showing whatever fields existed rather than the ones that
     identify the card. Name the signature field it should be leading with.
   - **The data-empty embedded** — styled, bounded, and telling the reader nothing they could act
     on. An embedded card that omits the thing the user came for (the price, the name, the status)
     fails even if it looks composed.
5. **Check `prefersWideFormat` against what you captured**, and against the value the
   `## Design direction` Width line recorded — a card whose code disagrees with its recorded call is a
   finding even when the capture looks fine. An isolated view that crops, collapses
   a grid to one column, or renders a wide layout in a narrow column is missing the static
   property. Report it as a finding with the capture.

Report as one block per card, then iterate the failing formats alone.

## Reviewing hardcoded work

Everything before theming is deliberately hardcoded — real hex, named fonts, no
`var(--*)` — and standing on one or two instances per CardDef rather than a full data set.
**Both are the correct state and neither is ever a finding.** Judge the layout on the content
that is there; "needs more rows to evaluate" is not a review. Do not report literal colours,
a missing theme link, or untokenized values as problems; those are the theming step's business and
flagging them early pushes the build to tokenize before the design is settled, which is the one
thing the build order in `## Design direction` is arranged to prevent.

What *is* fair game at this stage: everything visual, plus `border-radius`, `border`, `box-shadow`
or `overflow: hidden` on a format's outermost element, which the host owns in every stage — per
upstream's `boxel-ui-guidelines/references/delegated-render-control.md`
→ *Per format — what's safe and what isn't on the outermost element*.

Structure is also fair game, and is the one non-visual thing to check: the screens should already
be standing on real CardDefs with the domain's real `linksTo`/`linksToMany`. A screen rendering
from `containsMany` stand-ins will be rewritten at wiring, taking the layout with it — report that
as a note to the user, separately from the score.

**Pseudo-controls.** Anything the capture reads as a control — a button, a stepper, a picker, a
selectable cell, a tab — that is a `<div>` or an `<li>` in the DOM. These pass every reuse rule by
accident: `boxel-ui-component-discovery` forbids hand-rolling a `<button>` where a Spec exists, so
a build with *no* raw `<button>` and *no* component trips nothing at all. Report each one by name
as a note, not as a score item. It is the earliest visible sign that the screen is a picture of an
app rather than an app, and it predicts exactly what wiring will find.

## Fix loop

If the user wants more, run one round per request. (The automatic loop above runs the first one by default, with an independent reviewer each round; see `references/benchmark-and-refine.md`.) Each round reports what it changed and what it left
alone — a round that silently rewrites things nobody objected to makes the next review meaningless.

**After reporting a verdict, ask what happens next as a structured choice**, in the choice UI
— do not just leave the report and wait. Options: "Start
fixing" or "Keep improving: one more round" (recommended on ITERATE), "Review the next screen / run `set` or
`card` mode" (recommended once this unit passes and others remain), "Revisit a decision in the brief"
(when a failure traces to the decision itself, not its execution — see Phase 1), or "Stop here"
(recommended once everything in scope has passed) — plus room for the user to name something else.

## Output

```
Design direction: 9/11 acceptance lines
FAILED
- Members · "Ambassador tile double width" · all tiles equal width · <capture>

Aesthetic: 7.5/10 — gate is 8.5
- Typography: one sans at 500–600 throughout; no weight rhythm
- Motion: instant swaps only — capped at 8 for this alone

Constraints: contrast 3.1:1 on the muted meta line (needs 4.5:1)

Verdict: ITERATE
The two things between here and the bar: a display face with real weight contrast,
and one entrance treatment for the tile grid.
```

## Pair with

Read these live on each run. Links are relative to this skill's folder.

| What | Where |
|---|---|
| The decision being scored | the brief card's `spec`, and its `## Design direction` when an earlier brief carries one |
| Which treatments a style earns | `boxel-design/references/signature-treatments.md` |
| Anti-cliché checklist | `boxel-design/references/critical-rules.md` |
| What each format's root may and may not style | `boxel-ui-guidelines/references/delegated-render-control.md` → *Per format — what's safe and what isn't on the outermost element* |
| Fitted sizes and the verification checklist | `boxel/references/fitted-formats.md` |
| The per-format content matrix a card is scored against | `boxel/references/design-playbook.md` — the Stage 0f `## <CardName> · content matrix` block |
| The motion numbers an arc is captured against | the brief card's `## Motion` section, written by `motion-authoring` |
| Whether an isolated view needed the full viewport | `boxel/references/prefers-wide-format.md` |
| The capture service behind the captures | `integrate-capture-card-format` |

## Don't use for

- Deciding the look before anything is built — that is `boxel-design` (the index's "Just build it" path).
- Checking code on its own — lint and the correctness check are `boxel` (`boxel/references/lint-workflow.md`); this skill reviews captures, never source.
- Auditing or patching a Theme card — that is `boxel-theme-development`.

## Sections (load on demand)

- `references/benchmark-and-refine.md` — the award-site benchmark, and `refine` mode and the automatic loop: independent review, fix, one automatic fix round, more on request (the gate stays 8.5)
- `references/build-check.md` — the builder's pass/fail screenshot check that runs before the first review round
- `references/capture.md` — which tool captures which view, the capture service's batch and time budgets, where captures go, and the blank-region and selector flakiness rules
