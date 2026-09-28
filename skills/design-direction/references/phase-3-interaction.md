# Phase 3 — Interaction (derive; ask at a real fork)

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

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

Ask only where the ways change what the user can do — does the list stay visible, does the item
keep its place, is this moment paid for on every repeat. Motion flavour is not a question.

**Record the hit area and the resting cue with every way, not just the response.** A way that says
only "click → panel" leaves the builder to decide how big the target is and whether anything marks
it, and the default answer is "as big as the text" and "nothing" — which produces a screen whose
controls work and cannot be found. Per control: **hit area** (44×44 CSS px, or 32×32 inside a dense
row with 8px of separation — [`design-review`](../../design-review/SKILL.md) measures against these same numbers), **resting cue** (border, fill, underline, chevron — what says *press
me* before the pointer arrives), **hover state**, and the focus ring. An invisible overlay that
makes a whole row clickable is allowed only with a resting cue on the row and a hover state on it.
`design-review` checks these under Affordance legibility.

Decide three beats per screen: the **moment** (the action that matters most), the **empty state**
(an invitation, not an apology), the **completion**. One orchestrated moment per screen.

For anything the catalogue does not cover, reason from first principles — feedback, affordance,
cognitive load, accessibility — and write the reasoning into `DESIGN-DIRECTION.md` so the reviewer can see
what the pick was for.
