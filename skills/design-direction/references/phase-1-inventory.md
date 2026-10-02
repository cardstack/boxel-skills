# Phase 1 — Inventory

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

**First, decide single-surface or multi-object — this is what the schema already told you.**
Read the brief's schema and coverage matrix, not the screen count: if every CardDef but one is
only ever read through the one screen (no other card `linksTo`/`linksToMany` it, nothing routes to
it on its own), the unit is **single-surface** — one screen, switched by tabs or filtered by
controls that are all Interaction-table entries on that one screen, not separate screens. Write one
line saying so and stop this phase there; Phase 2 gets one layout pick, and the nav set acceptance
line below does not apply. If two or more CardDefs are genuinely linked to each other — the schema
already called this out as `linksTo`/`linksToMany` rather than a contained copy — the unit is
**multi-object**: those CardDefs need to work as independently linkable, embeddable cards, which a
tab inside one screen cannot substitute for, so continue the inventory below.

Apps only, and only once the unit is multi-object. One line per screen: **screen type** · **primary user action** · **blocks consumed**.
Cards go straight to their five formats, components to their states, fields to their three
presentations.

Then list **every CardDef the user will see rendered** — one line each: what the card is, which
format it appears in, and — for any def with its own `isolated` view — its `prefersWideFormat`
call (Phase 2 decides it). A family of two or more related CardDefs also gets a **Home** CardDef,
`prefersWideFormat = true`, per upstream's
[`app-card-home-with-search`](../../boxel-patterns/patterns/app-card-home-with-search/README.md);
list it here, or write down why this unit has none. The link graph is how you find most of them, not the definition of the
set. Four sources, and only the first is a `linksTo`:

- everything the screens reach through **`linksTo` / `linksToMany`**
- everything a **live query** returns — `getCards`, `@context.searchResultsComponent` — which
  renders real cards while declaring no link
- everything **nested inside another card's template**, which the user sees without any screen
  naming it
- anything the schema **grows later**: expect new CardDefs during the build
  when the design needs a field the brief does not have, and a def added then has the same five
  formats as one named on day one

**From a brief card, start from its element coverage matrix.** `domain-interview` already filled
it from a real `catalog-reuse` search, marking every card, field, component and command new /
extend / reuse. Do not repeat the search. Anything this inventory adds that the matrix does not list,
such as a Home CardDef, goes on its line marked **not in the matrix**, so the build knows those are
the only rows that still need a reuse search.

A def missing from this list gets no content matrix, no row in the build's format list, and
therefore no built formats and nothing to review — the omission is silent at every stage after it. These are surfaces
the user sees, and an inventory that stops at screens is why they end up designed by nobody. They do not each get a layout pick; their per-format content is decided at planning against the
[design-playbook](../../boxel/references/design-playbook.md)'s Stage 0f content matrix, and
`design-review` `card` scores them.

**Name every image-bearing field as you inventory.** An `ImageSourceField`, a
`MultiImageSourceField`, a `Featured Image Field` — or any field the brief describes as a photo,
cover, hero, headshot, illustration or brand mark — goes on the unit's line. A card that carries
imagery has its dominant object already nominated, and the inventory is where that becomes visible;
discovered later, the layout has usually already been picked around a headline.
