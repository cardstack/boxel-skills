---
name: design-review
description: Score a built Boxel screen, card or whole app against its brief and an aesthetic bar, from captures. Runs automatically after every build of an app, card family or user-facing card (one review and one fix round, then a choice). Also use it when someone points at a card or app they already have and wants it reviewed or scored; it reports first and edits nothing until they choose a fix. And use it whenever someone asks for a design review or critique ("how does this look", "is this good enough", "why does this feel off"), when all screens exist and need checking as a set, and for the linked CardDefs whose embedded, fitted and atom views were written in passing. Use it even when the work looks fine. It reviews what exists.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/run-realm-code'
        name: default
---

# Design Review

_Score what was built, from what it looks like._

| Contract | |
|---|---|
| **Reads** | Captures of the built thing, and the unit's brief card when it has one: its `spec`, the acceptance lines and anti-patterns in a `designDirection` field when an earlier brief carries them, and what its `motion` field asks for, where that is filled |
| **Writes** | Never the brief card: it records decisions, not scores. The build itself only during a fix round: automatically for one round after a build, and for existing work only after the user picks a fix |
| **Stops when** | The verdict is reported and the next step (another round, review another surface, revisit a decision, or stop) is offered in the choice UI |

Everywhere below, `## Design direction` means the brief card's `designDirection` field and
`## Motion` its `motion` field. `boxel-design`'s Look check writes only a `Look:` and a `Real details:` line into
`designDirection`: score the colour against the first and check that no proof was invented beyond the
second. A brief from earlier work, or one written by hand, may carry a full direction. Every rule below
that reads `## Design direction` acceptance lines, its Views table or its Width line applies only when that
field holds them. Without them, score each format against the design-playbook's Stage 0f content matrix where one
was written (otherwise against what the isolated view shows), and `prefersWideFormat` against what
the isolated capture needs. With no brief at all, what was decided is
the build's own hand-off line, or, for existing work, what the screens show.

You review a built thing against two standards: what was decided for it, and an
aesthetic bar that a competent-but-generic result does not clear. Where they conflict, `## Design direction`
wins on *what was decided* and you judge only *how well it was executed*.

**Visual scores come only from captures.** The rendered DOM and running the controls may confirm
controls, focus, hover and behaviour. Source code is never evidence that something looks right.

**Modes.** `set` reviews every screen of an app together; reach for it whenever more than one screen
exists, because coherence across screens is the thing no single-screen review can see.
`card <CardDef>` reviews one card's formats as a family, and is the mode nobody remembers to run: in an
app, the cards behind the links are the surfaces that get built in passing and scored by nothing.
Asked for by hand on one screen, it reviews that screen. `refine` is the same loop asked for by name,
to bring a unit to the bar: one fix round, then the user decides (see
[`references/benchmark-and-refine.md`](references/benchmark-and-refine.md)).

## Automatic review after every build

`boxel-design` and the design-playbook decide and build; this is the last design step, and it is
not optional or offered. When a build of an app, a card family or a single user-facing card
finishes, run this loop without being asked, over **everything the build produced**:

1. **The builder's check finishes the build** ([`references/build-check.md`](references/build-check.md)).
   The builder captures its own work, records how many lines pass as the round's *Build output*,
   then fixes every failing line. This is part of finishing the build, not a review round, and it
   gives no score.
2. **Capture the whole unit** (`realm.capture` in a `run-realm-code` script in the app, from `source-code-editing` → `realm.capture`;
   `npx boxel screenshot` from a terminal; see [`references/capture.md`](references/capture.md)):
   `set` mode across every screen, and each CardDef the build produced or the screens link to, in
   the formats the screens show it in. The full five-format family is `card` mode, on request. A
   single card is reviewed in `card` mode.
3. **Score** against the brief's acceptance lines and the aesthetic bar. Reuse a benchmark if one
   exists for this unit; the automatic round never fetches a new one, and without one it says the
   scores are unanchored.
4. **Fix the top gaps only**, at most three per round, on the failing screens or cards alone. A gap
   is a cause, not an instance: names cut off in six fitted tiles by one template is one gap.
   Scoring is read-only; **a fix is a build.** Before the first write, take the `index.md` pre-flight
   reads, and load [`boxel-ui-component-discovery`](../boxel-ui-component-discovery/SKILL.md) for a
   `component` gap and [`catalog-reuse`](../catalog-reuse/SKILL.md) for a `catalog` gap, however small
   the fix looks. Fix each gap by its route (*Gap routes*, below). A gap fixed by hand-rolling what
   the catalog or a component covers is not fixed. A `component` route is in scope: swap in the
   named component, adapting the value in the template and keeping the card's field types. "It is a
   component change" is never a reason to skip a gap; only a named blocker is (a read-only realm, a
   Spec that does not load, a component that cannot carry the card's data), and a skipped gap stays
   open in the re-score. Then run the build check again on every view the fix touched, at desktop and phone width: a fix that
   widens a grid or adds a field often breaks the phone view. Report what changed and what was
   left alone.
5. **Re-capture and re-score, once.** The automatic loop runs **one fix round**. Skip it only when
   no build-check line fails, no acceptance line fails (where the brief has them), no Phase 3 blocker
   or major remains, and an independent reviewer scored the unit 9 or more. A provisional score (no
   independent reviewer) never skips the round: a builder scoring its own work scores it high. When
   a failure traces to the direction itself, offer "Revisit a decision in the brief" instead of
   fixing it, and do not loop on it. If the gap list is empty, there is no fix round: say so, say whether the
   unit cleared the 8.5 gate, say when the scores are provisional, and go to the choice.
   The re-score's reviewer gets the gap list with one line per gap on
   what changed, so it can say whether each fix landed; it reverses an earlier gap's advice only when
   the fix made things worse, and says so.
6. **One report at the end**, in the *Output* shape: the scorecard and changelog per round, what is
   still short of the bar and why, and the next step in the choice UI, with **"Keep improving: one
   more round"** first when it did not clear the gate. Say plainly if it did not clear it. Each further
   round runs only when the user picks it, the same way, with the same gap list.

A rebuild made by this loop's own fix round does not start a new automatic review.

When an independent reviewer is available (a subagent with a fresh context), it scores the captures
each round and names the gaps from them; the main agent runs the build check's source lines, routes
each gap (*Gap routes*) and applies the fixes. The reviewer also gets the names of the gaps the build
left open (the *Build output* line), without the builder's reasoning, and does not score a listed
gap down again. Otherwise mark the round's
scores provisional. Skip the loop only for a utility card with no user-facing surface, and say so in
one line.

## Scoring existing work

When the user points at a card or app that already exists, nothing was just built and nothing is
fixed yet.

1. **Pick the unit.** One card: `card` mode. An app or several screens: `set` mode, plus each CardDef
   the screens link to. If it is unclear which they mean, ask in the choice UI.
2. **Find the brief.** If the unit has a brief card, score against it as usual. If not, skip Phase 1
   and open the report with one line: "Reviewed without a brief: judged against what the screens
   show, <primary user> doing <main action>." Read both from the UI; if you cannot name them, that is
   a finding. Do not create a brief.
3. **Capture** (`realm.capture` in a `run-realm-code` script in the app, `npx boxel screenshot` from a terminal;
   [`references/capture.md`](references/capture.md)).
4. **Score.** Run Phases 2 and 3, and the lines of [`references/build-check.md`](references/build-check.md)
   as a pass/fail *Basics* block, since no builder ran them. *Reviewing work in progress* does not
   apply: this is finished work.
5. **Report** the round 0 scorecard (*Output*). Edit nothing.
6. **Ask whether to fix**, in the choice UI:
   - "Fix the top gaps: <G1> → <its reuse>, <G2> → <its reuse>, <G3> → <its reuse>" (recommended when
     it does not clear the gate), for example "G1 → Pret UI MoneyInput, G2 → Pret UI Button, G3 → theme
     chart tokens"
   - "Fix only <G1> → <its reuse>"
   - "Also review the linked cards" (when only one surface was reviewed)
   - "Stop here, change nothing" (recommended when it clears the gate)
   - and room for the user to name something else.

   Each fix option names what it swaps in, so the user sees which components or tokens change
   before choosing.

   When the user cannot write to the realm the unit lives in (a catalog card, someone else's
   workspace), offer only "Also review the linked cards" and "Stop here, change nothing", and say why.

A fix runs one round exactly as the automatic loop's steps 4 to 6 do, each gap by its route. It never
chains into a second round on its own.

## Gap routes

**Search before you route.** For each gap, run one quick Spec search for what the gap needs ("money
input", "formatted number", "chart", "legend"): Pret UI first, then the catalog, as
[`boxel-ui-component-discovery`](../boxel-ui-component-discovery/SKILL.md) → *Procedure* searches,
with `realm.entries.search` in a `run-realm-code` run (this skill declares the tool). One or two terms per gap is enough. If the search
cannot run, write `reuse: not searched: <reason>`; never fill `reuse:` from memory. Then route by what
it found:

- **`component`**: a component does the job, even when adopting it means replacing an input, a chart
  or a display the card renders now. Fix it with that component, restyled through
  [`restyle-component.md`](../boxel-ui-component-discovery/references/restyle-component.md).
- **`catalog`**: a catalog card or Spec does it, or a reused catalog card looks like another app.
  Restyle an adopted card through
  [`restyle-reused-card.md`](../catalog-reuse/references/restyle-reused-card.md), never by editing or
  rewriting it, and record `adopted, route: …`; with no match, record the refusal before building.
- **`local`**: only when the search found nothing that fits: spacing, copy, layout or a plain bug in
  markup the card already owns. A local fix takes its values from the theme's tokens, never
  hand-picked colours or sizes.

Route and reuse are separate. Every gap carries a `reuse:` field naming what the fix reuses: **one**
component with its Spec (an alternative may follow as a footnote), token names, the restyle-component
step, or `searched "<terms>": none fits`. If the search found something that fits, the route is not
`local`. A candidate whose fit is unknown is written `candidate: <name>, fit unchecked: <reason>`, and
does not change the route. Replacing a hand-built part with a catalog card is a proposal to the user,
not something a fix round does inside its three gaps.

```
G1 · Home price shows 1104000 unformatted · route: component · reuse: Pret UI MoneyInput (pretui-money-input)
G2 · Chart series are two similar greens · route: local · reuse: --chart-1, --chart-2, --chart-3
     candidate: Pret UI Chart, fit unchecked: this card draws a custom cumulative line chart
```

## Capture first: there is no review without it

You cannot judge a design from CSS. Capture before scoring, and stop if you cannot: a code-only
review reads as a real review and is not one. If some views cannot be captured, review the ones that
were and list the rest by name rather than blocking.

**Re-capture before reporting a fault that loading could cause**: a blank or stale image, an old
version of a screen, a control that looks disabled, a missing font. Report it only if the second
capture shows it too; one that does not is a capture fault, not the design's.

**A blank region in a capture is a finding.** A build's entrances never start from `opacity: 0` in
base CSS ([`template-patterns.md`](../boxel-ui-guidelines/references/template-patterns.md) →
*Entrance animations — never put `opacity: 0` in base CSS*), so a section left empty after loading is
a fault. A card still loading can paint one, so re-capture a blank region once, then report it.

Read `references/capture.md` for which tool captures which view, the capture budget, where
captures go, and the flakiness rules.

## Phase 1 — The direction gate (only when the brief has one)

When the brief card's `designDirection` field holds acceptance lines, it is the primary rubric.

1. Read its acceptance lines, its set acceptance lines, and its anti-patterns block. Each
   anti-pattern counts as an acceptance line.
2. Check each against the captures and the DOM. Tick or fail, with no partial credit and no commentary.
3. Report first, in this shape:

```
Design direction: <passed>/<total> acceptance lines
FAILED
- <screen> · <line verbatim> · <one-line evidence> · <capture file>
```

Every failed line carries the screenshot it failed on, not just words. **Any failure is an
ITERATE** regardless of the score below, and in set mode it iterates that screen alone, not the set.

**Do not re-judge what `## Design direction` already decided.** The layout direction, the interaction way and
the named style were chosen deliberately, with reasons recorded. Score how well they were executed.
If you think a decision itself was wrong, say so once, separately, as a note to the user, not as a
score.

With no acceptance lines, skip this phase and say the review ran without them.

## Phase 2 — The aesthetic gate

The bar is work that would be singled out, not work that is inoffensive. A result that is
professional, polished and forgettable sits around 6–7; the gate is **8.5**.

**Anchor the number to the field.** For a unit with an award-style category (portfolio, landing page,
product page, editorial), the benchmark in
[`references/benchmark-and-refine.md`](references/benchmark-and-refine.md) compares it with three recent
award winners, dimension by dimension. Compare composition and type, not WebGL or page-wide motion a
card cannot do. Without a benchmark, say the scores are unanchored.

Score and name the specific thing behind each number:

- **Typography** — does the pairing look chosen? When the build names a look from [`boxel-design/references/style-families.md`](../boxel-design/references/style-families.md), score against *its* check: editorial wants large-light against small-bold, playful and vibrant want a heavy display against a plain body, brutalist wants hard and heavy. Each look's row says which weights it wants; a Restrained editorial build set entirely between 500 and 600 with a small step fails. Is there tracking on uppercase micro-labels where the look uses them? With no named look, judge on role clarity.
- **Honest gaps are not unfinished.** A section left out, a role in place of a name, or a marked slot where the business's real review, price or rating will go is correct ([`boxel-design/references/critical-rules.md`](../boxel-design/references/critical-rules.md) → *Never invent proof*). Never score it down as incomplete. An invented rating, name, year or testimonial is a finding, unless the brief's `Real details:` line is `concept (demo mode)` and each one carries a visible "Sample" label.
  A **labelled placeholder image** is the same kind of gap: the build puts one where no photo may be
  used (a real person, the user's own product, a real film poster) or none could be found
  ([`sample-images.md`](../boxel-file-def/references/sample-images.md) → *Pick the source* and
  *Labelled placeholders*). Score that slot as if a fitting photo stood in it: its space, crop, shape
  and place in the composition. Never score the placeholder itself: not its colours, not its label,
  not that it is a box instead of a photo, and not how many of them there are.
- **Colour** — against the colour strategy the look uses. Restrained looks: one accent in at most two places. Playful, vibrant, vintage: several colours are right when each has a named role and none competes for the same job. Colours with no assigned role fail in any look.
- **Composition** — does something dominate, or is it a row of equals? Is the reading order legible
  in the screenshot alone? Can the main action be found without hunting for it? Name the signature
  treatment on the dominant object and say whether it belongs to this style;
  [`boxel-design/references/signature-treatments.md`](../boxel-design/references/signature-treatments.md)
  is the authority on which treatments a style earns and why the default gradient-and-glass look
  scores *lower* than a plain surface. Judge against it rather than restating it. Check the treatment
  survives into `embedded` and `fitted` as a compressed idea rather than a shrunken copy.
- **Media** — if the card has imagery, does it get real space, or hide under metadata? Check it
  **across formats, not just this screen**: `embedded` and `fitted` show a focused crop rather than a
  shrunken copy of the hero, and a card with an image never renders a text-only tile. A media slot (a
  poster, a listing photo, a dish, a profile photo) that ships as a gradient, a lone glyph or initials
  is a finding: the first build fills it, at least with a labelled placeholder, which passes this row
  (*Honest gaps*, above).
- **Detail** — the small touches that signal care, judged against the build's own look and brief:
  does each one read as chosen for this unit, and do two or three carry the whole page rather than
  every element being decorated? Name no treatment to add; a look that is plain by intent is not
  short of detail, and a treatment borrowed from another look is a finding, not a gap to fill.
- **Motion** — score it only when the build animates; a still page is not marked down for being
  still. Motion follows [`card-motion`](../card-motion/SKILL.md): the smallest pattern for the job,
  names scoped by card id, nothing missing with motion off. Spatial motion with character reads as
  designed; a fade on everything reads as unfinished. When the brief's `## Motion` records what the
  user asked for, check the build does it. When it moves with scroll, capture the start, middle and
  end as [`references/capture.md`](references/capture.md) → *Scroll motion* says: a single screenshot
  cannot show a sequence.
- **Emptiness and error** — do they invite and instruct, or apologise?

Below 8.5, name the two or three things standing between here and the bar. Those are the round's
gaps. Do not soften the number to be encouraging; the number is the useful part.

## Phase 3 — Constraints

After the aesthetic gate, check what would make the design wrong rather than plain:

- **Main action and controls** ([`critical-rules.md`](../boxel-design/references/critical-rules.md)
  → *First-shot designs are clickable*). Name the primary user and their main action from the UI;
  if the UI does not let you name it, that is a finding. The main action is an `@operation` reached
  through `operations()` (hidden only when `canInvoke` answers `false`), or a link, or a disabled
  control with a marked slot naming what is needed. Every other drawn control is wired the cheapest
  way: a linked card, a link the user gave, `viewCard` into the right-hand stack or the edit view, or
  a `@tracked` filter. Exercise the main action and one control of each kind; check the rest from the
  DOM. Severity: **blocker** when no main action can be named or reached; **major** when a drawn
  control does nothing, or the main action is a stub. Where the action sits on the screen is
  composition (Phase 2), not a constraint. When you cannot run the action from the session, say it
  was not exercised rather than passing it.
- **Components take the app's look.** A Pret UI or boxel-ui component left at its library default
  (colour, radius, type) beside controls that carry the app's theme is a finding
  ([`restyle-component.md`](../boxel-ui-component-discovery/references/restyle-component.md)). So is a
  reused catalog card whose stock look still reads as another app; a stock layout kept under the
  theme because it fits is correct ([`restyle-reused-card.md`](../catalog-reuse/references/restyle-reused-card.md)).
  A component the build named as a gap no restyle step reaches is reported as that gap, not scored
  down again.
- **Accessibility** — contrast on every text-bearing surface, focus states, hit targets, and the
  motion-off pass for anything animated. The reduced-motion check is not "is there a fallback" but
  two questions the pass answers: does every element survive with animations off (the resting CSS
  state is the final state, per the template-patterns rule above and `card-motion`), and is every
  state the motion conveys reachable without it. Motion that carries information, such as a selection
  that only reads as selected while it animates, fails the second even when it passes the first. See
  `references/capture.md` → *The motion-off pass*.
- **Clarity** — can a first-time user tell what this is and what to do, from the screenshot?
- **Affordance honesty** — does everything that looks pressable have a focus state and a real
  control under it? A thing that reads as interactive and is not is a clarity failure before it is
  an implementation one. Check the screen's **primary action** by name against the content
  contract: if the contract says "start choosing a date" and the screen renders that phrase as a
  styled `<span>`, the screen has not delivered its primary action, however good it looks.
- **Affordance legibility.** A control can be a real button, keyboard-reachable and correctly wired,
  and still fail: nothing about it says *press me*, or the thing you must hit is too small. Three
  things to verify, from the captures plus a hover pass:
  - **Hit area.** Measure the *hit area*, not the ink. Under 24×24 CSS px fails (WCAG 2.2 SC 2.5.8,
    with its spacing exception); a default Pret UI `Button` at about 28px passes. A main action or a
    control used on a phone under 44×44 is a minor finding, not a failure.
  - **Hover and cursor.** Every control has a visible hover state (a fill, a border, a shift) and
    `cursor: pointer`. A row-sized invisible overlay button with no hover is the worst case: the
    whole row is clickable and nothing says so. Capture one hover state per control kind and check
    it differs from rest.
  - **A resting cue.** A control is legible as one *before* the pointer arrives: a border, a fill, an
    underline, a chevron. Bare text that only reveals itself on hover is unreachable on touch and
    invisible to anyone scanning.
- **Domain fit** — does it use the domain's own conventions, or generic app furniture?
- **Robustness** — long strings, missing media, zero rows, one row, very many rows.

Do not resolve these by making the design plainer. A contrast failure is solved by finding a
colour that reads *and* belongs, not by reverting to grey.

## Set mode

`design-review set <unit>` reviews the whole app.

1. Capture every screen in one pass, **plus every CardDef the screens link to, in each format the
   screens show it in** (`embedded` in lists, `fitted` in Home tiles): those render inside the
   screens, so they are set surfaces. This is the formats shown, not the full family (*Card mode*).
2. Tick the **set acceptance lines** from `## Design direction` across all captures, where it has
   them, then each screen's own.
3. Score coherence as its own dimension, looking across screens **and the linked cards' embedded
   and fitted views, which are part of the set**: one display face; the accent in the same role and nowhere
   else; one treatment for section labels, whatever it is; the same way for the same kind of action; one empty-state voice;
   consistent spacing rhythm between groups. A linked card that does not look like it belongs to
   the app it appears in is a set failure, not a card failure.
4. Report one table for the set, then per-screen failures. Iterate the failing screens only.

Run it on the first build: once more screens stand on these, coherence problems get lived with
instead of fixed.

## Card mode

`design-review card <CardDef>` scores one CardDef's `isolated`, `embedded` and `fitted` (every size
that will actually be used) as one family, plus `atom` and `edit` where the build wrote them. Atom is
optional and `edit` usually stays the host's default (design-playbook, Stage 4); a missing custom
one is not a gap. Run it for **every CardDef the app links to**, not only the ones that have
their own screen: a card reached through `linksToMany` is a surface the user sees, and it is the
surface that gets written in passing.

1. **Capture each format**, per `references/capture.md`: fitted inside the parent that renders it,
   at the sizes the app actually renders, not all sixteen. `atom` and `edit` need a browser from a
   terminal; in the app, list them as uncaptured.
2. **Tick the content matrix**, the design-playbook's Stage 0f block written at planning. It says
   which fields appear at each format, in what wording register, and what is omitted. Check the
   capture against it field by field. A format carrying fields the matrix omits is as much a failure
   as one missing them.
3. **Score the family, not each format.** The question is whether the formats read as the same card
   at different fidelities: same signature gesture, same accent role, same type family, wording compressing
   rather than truncating.
   - **Check the breakpoints fire.** Capture each format at a narrow width as well as a wide one.
     A `@container` rule that targets the element carrying `container-type` is dead and silent: the
     layout simply never changes. Two tells without reading CSS: the narrow capture is identical to
     the wide one, or a two-column layout overflows instead of stacking.
   - **Check `isolated` hardest.** It is often the one format that appears in no screen, so nothing
     in the build teaches it and nothing else reviews it. Two tells: `isolated` should be the
     *largest* of the formats (a full page thinner than its own thumbnail is nobody's decision), and no
     field should appear in `fitted` or `embedded` but be missing from `isolated`.
4. **Check the two failures this mode exists to catch:**
   - **The pedestrian fitted**: title in big type, description truncated, date in muted small
     text. It means the format is showing whatever fields existed rather than the ones that
     identify the card. Name the signature field it should be leading with.
   - **The data-empty embedded**: styled, bounded, and telling the reader nothing they could act
     on. An embedded card that omits the thing the user came for (the price, the name, the status)
     fails even if it looks composed.
5. **Check `prefersWideFormat` against what you captured**, and against the Width line in
   `## Design direction` when it has one. An isolated view that crops, collapses a grid to one
   column, or renders a wide layout in a narrow column is missing the static property. Report it as
   a finding with the capture.

Report as one block per card, then iterate the failing formats alone.

## Reviewing work in progress

A review run on a Stage 1 or 2 mockup, before the build is themed, sees deliberately hardcoded work:
real hex, named fonts, no `var(--*)`, one or two instances per CardDef. **Both are the correct state
at that point and neither is a finding.** Judge the layout on the content that is there; "needs more
rows to evaluate" is not a review. Do not report literal colours, a missing theme link or
untokenized values: tokenizing early pushes the build to fix values before the design is settled.
This applies only before theming. The automatic review runs after Stage 4, and *Scoring existing
work* reviews finished work, so neither uses it.

What *is* fair game at every stage: everything visual, plus `border-radius`, `border`, `box-shadow`
or `overflow: hidden` on a format's outermost element, which the host owns
([`delegated-render-control.md`](../boxel-ui-guidelines/references/delegated-render-control.md)
→ *Per format — what's safe and what isn't on the outermost element*).

Structure is also fair game: the screens should already stand on real CardDefs with the domain's
real `linksTo`/`linksToMany`. A screen rendering from `containsMany` stand-ins will be rewritten
later, taking the layout with it; report that as a note, separately from the score.

**Pseudo-controls.** Anything the capture reads as a control (a button, a stepper, a picker, a
selectable cell, a tab) that is a `<div>` or an `<li>` with nothing wired under it. These pass every
reuse rule by accident: a build with no raw `<button>` and no component trips nothing. In a mockup,
name each one as a note. In a finished build they fail build-check line 8 and are a Phase 3 major.

## Fix loop

A further round runs only when the user picks it in the choice UI. Each round reports what it changed
and what it left alone: a round that silently rewrites things nobody objected to makes the next review
meaningless.

**After reporting a verdict, ask what happens next in the choice UI**; do not just leave the report
and wait. Options: "Keep improving: one more round" (recommended when it did not clear the gate),
"Review the next screen / run `set` or `card` mode" (recommended once this unit passes and others
remain), "Revisit a decision in the brief" (when a failure traces to the decision itself, not its
execution; see Phase 1), and "Stop here" (recommended once everything in scope has passed), plus room
for the user to name something else. Stopping is always one of the options, never a line asking the
user to type "skip". The automatic fix round in step 5 is skipped only by its stated gate, without
asking.

## Output

Every report opens with the scorecard and the changelog, one row and one line per round. Round 0 is
the first review; for an automatic review, *Build output* above it is the build check's tally before
the builder fixed it, so the first build's own state is on record.

```
Build output: 11/14 build-check lines passed (builder fixed: names, phone overflow, dead filter)

Scorecard
| Round | Basics | Direction | Aesthetic | Constraints | Reviewer |
|---|---|---|---|---|---|
| 0 | 14/14 | 9/11 | 7.5 | 1 major | independent |
| 1 | 14/14 | 11/11 | 8.0 | 0 | independent |

Changelog
- R1 · G1 Names cut off in fitted tiles (one template) · route: local · reuse: searched "tile title": none fits · title wraps to two lines · landed
- R1 · G2 Accent on prices · route: local · reuse: --foreground · prices in ink colour · landed
- R1 · G3 Hero and grid at equal weight · route: local · reuse: searched "bento grid": none fits · ambassador tile double width · partial: the phone view stacks it back
Left alone: everything else.

Design direction: 11/11 acceptance lines

Aesthetic: 8.0/10 — gate is 8.5
- Composition: the double-width tile leads at desktop only

Verdict: ITERATE
The one thing between here and the bar: one tile that dominates at phone width too.
```

*Basics* is the build check's tally at the time of the review (after the builder's check, what it
could not fix; for existing work, the first look). *Reviewer* says `independent` or `provisional`. Gap ids (G1, G2,
…) stay the same across rounds, so a gap that comes back is visible, and each names its route (*Gap
routes*). A changelog line is round · gap · what changed · landed, partial or made worse.

## Pair with

Read these live on each run. Links are relative to this skill's folder.

| What | Where |
|---|---|
| The decision being scored | the brief card's `spec`, and its `## Design direction` when it carries acceptance lines |
| Which treatments a style earns | `boxel-design/references/signature-treatments.md` |
| Anti-cliché checklist, proof and clickable controls | `boxel-design/references/critical-rules.md` |
| What each format's root may and may not style | `boxel-ui-guidelines/references/delegated-render-control.md` → *Per format — what's safe and what isn't on the outermost element* |
| Fitted sizes and the verification checklist | `boxel/references/fitted-formats.md` |
| The per-format content matrix a card is scored against | `boxel/references/design-playbook.md`, the Stage 0f `## <CardName> · content matrix` block |
| How a build animates, when it does | `card-motion` |
| Whether an isolated view needed the full viewport | `boxel/references/prefers-wide-format.md` |
| Restyling a reused card or a component | `catalog-reuse/references/restyle-reused-card.md`, `boxel-ui-component-discovery/references/restyle-component.md` |
| Required before fixing a `catalog` gap | `catalog-reuse` |
| Required before fixing a `component` gap | `boxel-ui-component-discovery` |

## Don't use for

- Deciding the look before anything is built: that is `boxel-design` (the index's "Just build it" path).
- Checking code on its own: lint and the correctness check are `boxel` (`boxel/references/lint-workflow.md`); this skill scores captures.
- Auditing or patching a Theme card: that is `boxel-theme-development`.

## Sections (load on demand)

- `references/build-check.md` — the builder's pass/fail screenshot check that finishes every build, and the *Basics* block for existing work
- `references/capture.md` — which tool captures which view, budgets, where captures go, and the blank-region, scroll-motion and motion-off rules
- `references/benchmark-and-refine.md` — the award-site benchmark, `refine` mode and the roles in the loop (the gate stays 8.5)
