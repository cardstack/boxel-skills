# Phase 2 — First screen: layout and interaction

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Both halves below are decided for the **first screen** — the one Phase 4 writes out in full. Every
other screen in the inventory is a stub until it is about to be built, and then this phase runs
again for that one screen. A single-surface unit has only ever had one screen, and its tabs and
filters are rows in the Interaction table here, never screens of their own.

## Layout (you decide)

For the screen in hand, pick one direction from [`references/screen-types.md`](screen-types.md), adapted to the real blocks.
**Do not offer them.** That file is the brief you write from, not a menu.

Pick by the content contract: whichever block the must-contain list puts first is the dominant
object, and the primary action goes where the reading order reaches it first.

**An image field nominates the dominant object.** Where the unit carries imagery, the image is the
dominant object unless the content contract's priority order puts something above it — and
overriding it is a decision you write down, like any gravity well kept on purpose. Upstream is
blunt about the consequence: *"Media is featured. If the card has imagery (hero, cover, headshot),
it appears at scale. Don't hide it in a corner."* The failure is not ugly, which is why it survives
review: a card with one good photo gets a headline-led layout and a thumbnail, and nothing about it
looks wrong. Incidental imagery is the real exception — an avatar on an invoice row, a vendor mark
on a purchase order — and naming it as incidental is the write-down.

Name the layout in the words of [`boxel-design/references/layout-vocabulary.md`](../../boxel-design/references/layout-vocabulary.md) where one fits. Check the pick against [`references/layout-gravity.md`](../../boxel-design/references/layout-gravity.md) and name any well it still contains — a direction may keep
one deliberately if you say why. Never pick one whose regions are all equal weight; equal weight
tells the reader nothing matters more than anything else, which is never true.

Record for this screen, in `## Design direction`:

- the direction and **one line of reason** — naming the `## Story` scene it serves and that
  scene's *what they feel* line
- the dominant object and its share of the viewport
- reading order (single column, F, Z, spotlight)
- where the primary action sits
- what is above the fold at 1200×700, and how it stacks at 400 wide
- the four layout controls: stage type, information architecture, content priority, responsive
- **`prefersWideFormat`, true or false, with one line of reason** — decided here because it is a
  layout decision: whether the `isolated` view would look broken or cramped at ~720px. The rule,
  the true/false tables and the symptoms are upstream's [`prefers-wide-format.md`](../../boxel/references/prefers-wide-format.md); apply it, never restate it. Decide it
  for every CardDef in the Phase 1 list that has its own `isolated` view, not only the screens —
  found late, it costs a layout rewrite that a one-line static property would have prevented

When the user overrules this on the built screen, rewrite that screen's layout block and rebuild
that one screen. The other picks stand.

## Interaction (derive; ask at a real fork)

**This phase decides how an action *presents*, never whether it *exists*.** Whether a screen has a
"choose your day" action is the content contract's call, made in the brief; how that action looks,
moves and feels is this phase's. Keeping the two apart matters because a screen can pass everything
below — a named moment, an inviting empty state, a completion beat — while its primary action is a
`<span>` that cannot be clicked. Nothing in this phase would catch that, and nothing here should
try: making every primary action a real control, and wiring it to the brief's declared mechanism,
is the build's job. Design the feedback; the affordance is the build's gate.

Choose a way per primary action from [`references/interaction-ways.md`](interaction-ways.md). The budgets decide most of
it: a repeated action gets the cheap way, under 200 ms and without attention-grabbing motion; the
screen's one moment gets the staged way. Record trigger, response, duration budget, easing
character, reduced-motion fallback, and repeat cost.

**Baseline motion is not decided here and is not a hand-off.** Staggered arrival, scroll reveal and hover feedback come with every build from [`boxel-design/references/motion-baseline.md`](../../boxel-design/references/motion-baseline.md), in the motion character Phase 3 records. This table records only the *actions*; do not write a `cubic-bezier` for the baseline.

Ask only where the ways change what the user can do — does the list stay visible, does the item
keep its place, is this moment paid for on every repeat. Motion flavour is not a question.

**Record the hit area and the resting cue with every way, not just the response.** A way that says
only "click → panel" leaves the builder to decide how big the target is and whether anything marks
it, and the default answer is "as big as the text" and "nothing" — which produces a screen whose
controls work and cannot be found. Per control: **hit area** (44×44 CSS px, or 32×32 inside a dense
row with 8px of separation — `design-review` measures against these same numbers), **resting cue** (border, fill, underline, chevron — what says *press
me* before the pointer arrives), **hover state**, and the focus ring. An invisible overlay that
makes a whole row clickable is allowed only with a resting cue on the row and a hover state on it.
`design-review` checks these under Affordance legibility.

Decide three beats for this screen: the **moment** (the action that matters most), the **empty
state** (an invitation, not an apology), the **completion**. One orchestrated moment per screen.

For anything the catalogue does not cover, reason from first principles — feedback, affordance,
cognitive load, accessibility — and write the reasoning into `## Design direction` so the reviewer can see
what the pick was for.
