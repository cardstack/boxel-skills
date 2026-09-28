# Phase 6 — Hand off

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

The direction is written; this phase reports it and stops. **How the unit gets built is not this
skill's job**: the build order, the reuse search, theming and wiring belong to whatever builds from
the direction, whether that is the software factory reading the brief card or the
[`boxel`](../../boxel/SKILL.md) build path with the
[design-playbook](../../boxel/references/design-playbook.md). The direction constrains the build
through its acceptance lines, not through build steps.

Show:

1. **A two-line summary per screen**: layout pick and reason · style · the moment.
2. **One line for motion**: `Motion: needed — <which trigger: arc / scrubbed subject / direct
   manipulation / library way / reference site>` or `Motion: not needed — all ways discrete`.
   This is the only place the user sees whether `motion-authoring`
   will run before those beats are built; a hand-off that skips the line skips the decision. You
   never write the `## Motion` section yourself.
3. **The first screen**: which one, and why. This is a design call, because the first screen the
   user sees built is where the language gets locked. The rule: **the screen that puts the most of
   the domain's data on a single surface and holds the primary action.** Tie-break to the screen
   that renders the most linked CardDefs. For an app that is usually the Home / desk screen, because
   it exercises many cards' `embedded` and `fitted` at once; when Home is only a list of thin tiles,
   the richest record screen goes first. Record the pick and its reason in `## Design direction` →
   First screen.
4. **Where the direction lives**: the brief card URL.

Then stop. Do not offer to build, and do not ask what happens next. You do not build and you do
not review.
