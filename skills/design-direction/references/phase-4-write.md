# Phase 4 — Write it down and hand off

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

## Write the direction

Write it from [`design-direction-template.md`](design-direction-template.md) into the brief card's
`designDirection` field. It is never a markdown file: a builder reads only the brief card, so a
separate file would never reach it.

**Which card:**

- **From a `domain-interview` brief card:** that card.
- **No brief (a single card, component or field):** create one first, the same way
  `domain-interview` does: one SEARCH/REPLACE block creates `Brief/<slug>.json` with
  `adoptsFrom` `{ "module": "@cardstack/catalog/cards/projects/brief", "name": "Brief" }`,
  `cardInfo.name` set to the unit's name, `cardInfo.summary` to one line naming the unit, its
  feeling and its style, and every stage field `null`. `## Brief` then keeps all its lines, since
  there is no spec beside it.

**Writing the field.** Read the card back first so it has resolved, then `patch-fields` the
`designDirection` field with the whole direction as the value. It is this skill's own field —
replacing it whole touches no other stage's text, and there is nothing to read back and re-send. A
later change to one block — a screen stub written out in full, a style line — is an
`apply-markdown-edit` on `designDirection` with that block as `currentContent`, not a second full
patch. Read the card back and check the field holds it before saying it is saved.

It always carries the style in full — controls, reference, type line, palette, signature treatment,
ornament budget — decided once for the whole unit and never rewritten per screen.

**Screens get full detail once — the first screen — everything else is a stub.** Pick the first
screen using the Hand off section's rule below (most of the domain's data on one surface, holding the primary action;
tie-break to the most linked CardDefs) and write it in full: the layout pick with its reason, the
interaction way per action with budgets and fallbacks, the three beats, the gravity wells kept on
purpose, and **acceptance lines** a reviewer can tick without taste. Every other screen in the
inventory gets one line only — its name, screen type, and purpose from the content contract — and
is written in full the same way, just before it is actually built, not now. A brief with ten
screens and one fully designed is doing its job; ten fully designed screens before anything is
built is answering questions nobody has asked yet.

**Single-surface units skip this section's screen machinery entirely** — write the one screen's
layout and interaction (its tabs and filters are Interaction-table rows, not separate screens) and
stop; there is no "first screen" to pick and no set acceptance lines to write, because there is
only one surface for them to hold across.

For multi-object apps, also write **set acceptance lines** — what must hold across every screen
*and every linked card's embedded view*: one display face, the accent in the same role and nowhere
else, one eyebrow treatment, the same way for the same kind of action, one empty-state voice.
Always include the navigation line: every screen in the inventory is in the nav, every nav control
navigates, and a screen not built yet opens a placeholder in the same shell (its name, its purpose
line from the content contract, and "designed in the next pass"), never a dead button. A first
build whose nav does nothing reads as broken, not unfinished. Include at least one line that only a
card can fail, such as: every linked card's embedded view leads with the field that identifies it,
not with its title and a truncated description. `design-review set` ticks these across all screens
at once, and they are the only thing that catches five screens that are each fine alone.

## Hand off

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

**Then hand off — offer the next stage, don't decide it.** Ask as one single-select question in
the choice UI (rules in `SKILL.md`, under the interaction paragraph). The options depend on the motion line you just wrote:

- **Build the first screen** — the one named above. Recommend this when motion is not needed.
- **Run `motion-authoring` first** — offer this only when the motion line says motion is needed,
  and recommend it over building: it fills the `motion` field of this same brief card, and
  beats built before their numbers exist get rebuilt once the numbers arrive.
- **Adjust the direction** — the style, or the first screen's layout, while nothing is built and
  changing it is still cheap.

Do not start any of them yourself. You do not build and you do not review; naming the next stage is
as far as this skill goes.
