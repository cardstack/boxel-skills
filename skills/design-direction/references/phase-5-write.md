# Phase 5 — Write the direction

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Write it from [`design-direction-template.md`](design-direction-template.md) as a
`## Design direction` section on the unit's brief card, with the template's headings demoted one
level (its `##` sections become `###`). It is never a markdown file: the software factory reads only
the brief card's `content`, and its design-foundation turn builds from it, so a separate file would
never reach it.

**Which card:**

- **From a `domain-interview` brief card:** that card. The section goes after the spec.
- **No brief (a single card, component or field):** create one first, the same way
  `domain-interview` does. One SEARCH/REPLACE block creates `Wiki/<slug>-brief.json` with
  `adoptsFrom` `{ "module": "<realm origin>/software-factory/wiki", "name": "Wiki" }`, `cardInfo.name`
  set to the unit's name and an empty `content`. The section is then its only content, and its
  `### Brief` keeps all its lines, since there is no spec above it.

**Writing the section.** `patch-fields` replaces the whole `content` field, so read the card's
current `content` first and patch the full value: every other section unchanged, then this one. If
the card already has a `## Design direction` section, replace that section rather than adding a
second one; never touch another stage's section, such as the spec or `## Motion`. Read the card
back and check that every section is still there before saying it is saved.

It always carries the style in full — controls, reference, type line, palette, signature treatment,
ornament budget — decided once for the whole unit and never rewritten per screen.

**Screens get full detail once — the first screen — everything else is a stub.** Pick the first
screen using Phase 6's rule (most of the domain's data on one surface, holding the primary action;
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
