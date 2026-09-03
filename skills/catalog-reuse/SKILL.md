---
name: catalog-reuse
description: MANDATORY before building a card, field, command, app, or asset (image, font, icon, theme) — search the catalog and reuse what's there: reference as-is by default, remix only to modify, build new only when nothing matches. For UI primitives in a `.gts` template, use boxel-ui-component-discovery instead.
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

2. **Query per enumerated need.** Use the catalog realm for the
   environment you are working against — take it from your context if
   one is provided, otherwise list the realms available to your session
   (`boxel realm ls` from a CLI session) or ask; do not invent a host.

   For each enumerated item, run one narrowed query: anchor on `Spec`,
   constrain to the matching `specType` — `card`, `field`, `component`,
   or `command`, the specTypes the catalog actually publishes (whole
   apps are not `Spec`s; reuse them as Listings, see below) — and add a
   text key built from the need's plain-language name:

   ```json
   {
     "filter": {
       "on": { "module": "@cardstack/base/spec", "name": "Spec" },
       "every": [
         { "eq": { "specType": "field" } },
         { "matches": "address" }
       ]
     }
   }
   ```

   Prefer `matches` (full-text over the readMe) — it survives the
   vocabulary gap between your phrasing and the catalog's ("send-email
   command" still finds a Spec titled "Email Dispatch"). Switch to
   `contains` on the title when `matches` is too noisy. If a need
   returns nothing, broaden once before concluding a gap: drop the
   text key and sweep that one `specType`'s full inventory. "Build
   new" is only legitimate after that sweep — a single `matches` miss
   is not evidence of a gap.

   Run the filter through whatever search transport your session has —
   the card-search tool in an assistant room, or
   `boxel search --realm <catalog-realm-url> --query '<filter-json>' --json`
   from a CLI session; the filter is identical either way. Write it
   card-rooted (`on` anchor, bare field names) like every other card
   query — the transport translates it to the search endpoint's wire
   form itself; never hand-write `item.`-prefixed paths. See
   `boxel/references/query-systems.md` for full query syntax and
   `boxel/references/spec-usage.md` for the `Spec` model.

3. **Read each hit's `attributes.specType`, `attributes.cardTitle`,
   `attributes.cardDescription`, and `attributes.readMe`.** Confirm
   each hit answers the need that prompted its query — a text match is
   a candidate, not a decision. The readMe is the source of
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
   | `command` | import and invoke it in code, or invoke it through your session's command mechanism (`run-command` from a CLI session) |

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
