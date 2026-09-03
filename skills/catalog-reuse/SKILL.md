---
name: catalog-reuse
description: MANDATORY before authoring a new card, field, or command, before building an app, or before adding an image/font/icon/theme — search the catalog for an existing definition or asset and reuse it. Reference it as-is (default), remix only when you must modify it, build new only when nothing matches (and record the gap). For UI primitives inside a `.gts` template, boxel-ui-component-discovery has the sharper procedure.
boxel:
  kind: skill
---

# Catalog Reuse

## Mandatory rule

Before you build anything the catalog might already have — a **card**, a
**field**, a **command**, a whole **app**, or an **asset** (image, font,
icon, theme) — you must first search the catalog and reuse what's there.
Decide per match, in this priority order:

1. **Reference it as-is (default, preferred).** Point at the catalog
   module/instance across realms and keep the live dependency — updates
   flow through, nothing is duplicated. The target realm does **not**
   need to be self-contained; a runtime dependency on the catalog is
   desirable, not a smell.
2. **Remix it** — only when it must be **modified** for this use case.
   Copy it in (with its dependencies) so your copy can diverge; you
   trade the live dependency for the ability to change it.
3. **Build new** — only when nothing in the catalog adequately matches.
   Record the gap where your workflow keeps notes (tell the user, or
   note it on the Issue you are working on), so what's missing is
   visible.

Reaching for "build new" without having searched is a defect. Visual or
naming differences are not a reason to skip reuse — reference and adjust
presentation, or remix if the schema itself must change.

## Procedure

1. **Enumerate first.** Before any search, read the brief and list every
   card, field, command, app, and asset it implies, in plain language
   ("a Person card", "an Address field", "a send-email command", "a
   hero image"). The partial-compliance failure mode is "agent reuses
   one thing, hand-builds the rest" — enumerating up front prevents it.

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
         { "eq": { "specType": "field" } },
         { "eq": { "specType": "component" } },
         { "eq": { "specType": "command" } }
       ]
     }
   }' --json
   ```

   The `any` list is deliberate: those are the `specType`s the catalog
   actually publishes as searchable `Spec`s. Whole apps are not `Spec`s
   — reuse them as Listings (see below). Write the filter card-rooted
   (`on` anchor, bare field names) like every other card query — the
   CLI translates it to the search endpoint's wire form itself; never
   hand-write `item.`-prefixed paths in `--query`, they make the CLI
   throw. Narrow a large inventory with `contains` on the title or
   `matches` (full-text over the readMe) per enumerated need. See
   `boxel/references/query-systems.md` for full query syntax and
   `boxel/references/spec-usage.md` for the `Spec` model.

3. **Read each hit's `attributes.specType`, `attributes.cardTitle`,
   `attributes.cardDescription`, and `attributes.readMe`.** Match each
   item in your enumeration to a result. The readMe is the source of
   truth for what it is, what it carries, and how to use it; it rides on
   the search response, so no follow-up fetch is needed.

4. **Decide per hit with the rubric above** — reference, remix, or build
   new. Prefer reference; only step down when the decision test below
   fails.

5. **Act on the decision**, using the per-type mechanic:

   | `specType` | How you reuse it |
   |---|---|
   | `card` | `adoptsFrom` the catalog card to reuse its schema, or `linksTo` / `linksToMany` an existing catalog instance |
   | `field` | import the FieldDef from the catalog module and use `contains` / `containsMany` (fields are never `linksTo` — Cardinal Rule 1) |
   | `component` | import it into the template's markup — see `boxel-ui-component-discovery` for the enumerate/self-audit discipline |
   | `command` | import and invoke it, or drive it through `run-command` |

## Beyond Specs — Listings and assets

Not everything reusable is a `Spec`:

- **Whole apps** → install or remix a catalog **Listing** (see
  `catalog-listing`), not a `Spec` search. Apps are distributed as
  Listings; a Spec query for `specType: app` finds nothing.
- **Files and themes** (image, font, icon, theme) → this is an
  *instance* search, not a `Spec` search. Query the catalog for the
  `FileDef` / `ImageDef` / `Theme` card and `linksTo` it (or set
  `cardInfo.theme`). Don't re-upload or re-author what the catalog
  already hosts.

## Reference vs remix — the boundary

Ask one question: **does this need to change for my use case?**

- **No** — even if you only use a subset of its fields → **reference**.
  Referencing something you use partially is correct; unused fields
  cost nothing.
- **Yes** — the schema, behavior, or template must differ → **remix**,
  then edit the copy. Reference keeps you in lockstep with the catalog;
  remix forks you off it. Pick forking only when you actually intend to
  diverge.

## Self-audit before finishing

Re-read what you built. For every card, field, command, app, or asset
you authored from scratch, ask: would I have searched the catalog for
this if I were starting over? If yes, did I — and if a matching Spec,
Listing, or asset existed, did I reference or remix it instead of
rebuilding it? Replace any hand-built thing that has a catalog
equivalent, and for anything you genuinely had to build new, confirm the
gap is recorded. Only then call it done.

## Related

- `boxel-ui-component-discovery` — the specialized front-end for UI
  primitives: enumerate every primitive a `.gts` template implies,
  reuse a component Spec, self-audit for raw HTML. Use it whenever the
  task is writing UI in a template; this skill is the general form.
- `catalog-listing` — install / remix / update mechanics for Listings.
- `boxel` — CardDef / FieldDef authoring, `adoptsFrom` vs `contains`
  vs `linksTo`, query syntax.
