---
name: catalog-card-field-reuse
description: MANDATORY before authoring a new CardDef or FieldDef. Search the catalog for an existing card/field Spec and reuse it — reference it as-is (default), remix only when you must modify it, build new only when nothing matches (and record the gap). One level up from boxel-ui-component-discovery: whole cards/fields, not UI primitives.
boxel:
  kind: skill
---

# Catalog Card/Field Reuse

## Mandatory rule

Before you author a new **CardDef** or **FieldDef**, you must first
search the catalog for an existing card/field `Spec` and reuse it.
Decide per match, in this priority order:

1. **Reference it as-is (default, preferred).** Point at the catalog
   module across realms and keep the live dependency — updates flow
   through, nothing is duplicated. The target realm does **not** need
   to be self-contained; a runtime dependency on the catalog is
   desirable, not a smell.
   - **Card Spec** → `adoptsFrom` the catalog card to reuse its schema,
     or `linksTo` / `linksToMany` an existing catalog instance to point
     at it.
   - **Field Spec** → import the FieldDef from the catalog module and
     use `contains` / `containsMany` (fields are never `linksTo` —
     Cardinal Rule 1).
2. **Remix it** — only when the card/field must be **modified** for this
   use case. Copy it in (with its dependencies) via the catalog remix
   flow so your copy can diverge; you trade the live dependency for the
   ability to change it. See `catalog-listing`.
3. **Build new** — only when nothing in the catalog adequately matches.
   Record the gap where your workflow keeps notes (tell the user, or
   note it on the Issue you are working on), so the missing card/field
   is visible.

Reaching for "build new" without having searched is a defect. Visual or
naming differences are not a reason to skip reuse — reference and adjust
presentation, or remix if the schema itself must change.

## Procedure

1. **Enumerate first.** Before any search, read the brief and list every
   card and field it implies, in plain language ("a Person card", "an
   Address field", "a Money/currency field"). The partial-compliance
   failure mode is "agent reuses one card, hand-writes the rest" —
   enumerating up front prevents it.

2. **Query the catalog once, broadly.** Use the catalog realm for the
   environment you are working against — take it from your context if
   one is provided, otherwise check `boxel realm ls` or ask; do not
   invent a host.

   ```sh
   boxel search --realm <catalog-realm-url> --query '{
     "filter": {
       "on": { "module": "@cardstack/base/spec", "name": "Spec" },
       "any": [
         { "eq": { "specType": "card" } },
         { "eq": { "specType": "field" } }
       ]
     }
   }' --json
   ```

   Write the filter card-rooted (`on` anchor, bare field names) like
   every other card query — the CLI translates it to the search
   endpoint's wire form itself; never hand-write `item.`-prefixed paths
   in `--query`, they make the CLI throw. Narrow a noisy inventory with
   `contains` on the title or `matches` (full-text over the readMe).
   See `boxel/references/query-systems.md` for full query syntax and
   `boxel/references/spec-usage.md` for the `Spec` model.

3. **Read each hit's `attributes.cardTitle`, `attributes.cardDescription`,
   and `attributes.readMe`.** Match each item in your enumeration to a
   result. The readMe is the source of truth for what the card/field is,
   which fields it carries, and how to use it; it rides on the search
   response, so no follow-up fetch is needed.

4. **Decide per hit with the rubric above** — reference, remix, or build
   new. Prefer reference; only step down when the decision test below
   fails.

5. **Act on the decision.**
   - *Reference a card* → import from the module in the Spec's
     `attributes.ref` and `adoptsFrom` it, or `linksTo` an instance.
   - *Reference a field* → import the FieldDef from that module and
     `contains` / `containsMany` it.
   - *Remix* → drive the catalog remix flow from the chosen Spec
     (`catalog-listing`), then modify the copy in your realm.
   - *Build new* → author it, and record the gap.

## Reference vs remix — the boundary

Ask one question: **does this card/field need to change for my use case?**

- **No** — even if you only use a subset of its fields → **reference**.
  Referencing a card you use partially is correct; unused fields cost
  nothing.
- **Yes** — the schema, behavior, or template must differ → **remix**,
  then edit the copy. Reference keeps you in lockstep with the catalog;
  remix forks you off it. Pick forking only when you actually intend to
  diverge.

## Self-audit before finishing

Re-read your finished card family. For every CardDef and FieldDef you
authored from scratch, ask: would I have searched the catalog for this
if I were starting over? If yes, did I — and if a matching Spec existed,
did I reference or remix it instead of rebuilding it? Replace any
hand-built card/field that has a catalog equivalent, and for anything
you genuinely had to build new, confirm the gap is recorded. Only then
call it done.

## Related

- `boxel-ui-component-discovery` — the same discipline one level down:
  boxel-ui component Specs before hand-rolling UI primitives in a
  `.gts` template.
- `catalog-listing` — install / remix / update mechanics.
- `boxel` — CardDef / FieldDef authoring, `adoptsFrom` vs `contains`
  vs `linksTo`, query syntax.
