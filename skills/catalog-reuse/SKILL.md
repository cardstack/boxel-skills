---
name: catalog-reuse
description: MANDATORY before building a new card, field, component, command, or app, or adding an asset (image, font, icon, theme) — search the catalog and reuse what's there: reference an existing definition as-is by default, remix only to modify, build new only when nothing matches. For UI primitives inside a `.gts` template, use boxel-ui-component-discovery instead.
boxel:
  kind: skill
---

# Catalog Reuse

## A Spec is a pointer, not the thing

**A `Spec` is not the card, field, or component — it is the catalog's
searchable *index entry* that points at one.** Each Spec carries:

- `attributes.ref` = `{ module, name }`, naming the **real definition**
  (the CardDef / FieldDef / component / command).
- `attributes.linkedExamples` = example **instances** of it.
- `attributes.readMe` / `cardTitle` / `cardDescription` = what it is and
  how to use it.

You **search** Specs. You **reference the definition a Spec names** — via
its `ref`, or an instance from `linkedExamples`. You never `adoptsFrom`,
`linksTo`, `contains`, or import a Spec itself; the Spec is only how you
found the thing.

## Two ways to reuse — reference a Spec's target, or remix a Listing

A match can be reused two ways, and they map onto the two things the
catalog exposes:

- **Reference (default)** — driven from a **`Spec`**: take its `ref` and
  `adoptsFrom` / import / `linksTo` the definition it names, keeping a
  live dependency on the catalog. This is what a search finds and what
  you reach for first.
- **Install / remix** — driven from a **`Listing`**, the catalog's
  *installable bundle* (specs + examples + skills — `CardListing`,
  `FieldListing`, `AppListing`, …). The catalog `listing-install` /
  `listing-remix` commands copy it (with dependencies) into your realm
  so it can diverge. Reach for it only when referencing won't do.

Referencing keeps you in lockstep with the catalog; remixing forks you
off it. A Listing *contains* Specs — they aren't rivals at the same
level: a Spec is what you find, a Listing is a package you copy in.

## Mandatory rule

Before you build a **card**, **field**, **component**, **command**,
**app**, or **asset** (image, font, icon, theme), search the catalog
first. Decide per match, in priority order:

1. **Reference the definition as-is (default, preferred).** Using the
   Spec's `ref`, `adoptsFrom` / import the catalog *module*, or `linksTo`
   an existing *instance* (from `linkedExamples`) — never the Spec, which
   is only the entry you found it through. Keep the live dependency:
   updates flow through, nothing is duplicated. The target realm does
   **not** need to be self-contained.
2. **Remix the Listing** — only when the definition must be **modified**.
   This copies it in (with dependencies) via the catalog remix command,
   so your copy can diverge; it needs the definition's **Listing**, not
   just its Spec (see below).
3. **Build new** — only when nothing in the catalog adequately matches.
   Record the gap where your workflow keeps notes (tell the user, or
   note it on the Issue you are working on).

Reaching for "build new" without having searched is a defect. Visual or
naming differences are not a reason to skip reuse — reference and
restyle, or remix if the schema itself must change.

## Procedure

1. **Enumerate first.** Read the brief and list every card, field,
   component, command, app, and asset it implies, in plain language
   ("a Person card", "an Address field", "a send-email command", "a hero
   image"). The partial-compliance failure mode is "agent reuses one
   thing, hand-builds the rest" — enumerating up front prevents it.

2. **Query per enumerated need.** Use the catalog realm for your
   environment — take it from your context, otherwise list the realms
   available to your session (`npx boxel realm ls` from a CLI session)
   or ask; do not invent a host.

   For each need, run one narrowed query: anchor on `Spec`, constrain to
   the matching `specType`, and add a full-text key from the need's
   plain-language name:

   ```json
   {
     "filter": {
       "on": { "module": "@cardstack/base/spec", "name": "Spec" },
       "every": [
         { "eq": { "specType": "field" } },
         { "matches": "address" }
       ]
     },
     "sort": [{ "by": "_matchRelevance", "direction": "desc" }]
   }
   ```

   The searchable specTypes are `card`, `field`, `component`, `command`,
   and `app` (an app is a CardDef that extends `AppCard` — its Spec is
   referenced like a card's). Prefer `matches` (bare-string full-text
   over the Spec's rendered content) — it survives the vocabulary gap
   between your phrasing and the catalog's ("send-email command" still
   finds a Spec titled "Email Dispatch"). **Sort by `_matchRelevance`**
   (as in the query above) and read `entry.meta._matchRelevance` — a 0–1
   relevance score, best first — to rank and threshold the hits. Fall
   back to `contains` on the title only if a query is still too noisy. If
   a need returns nothing, broaden once — drop the text key and sweep
   that `specType`'s full inventory — before concluding a gap. "Build
   new" is only legitimate after that sweep; a single `matches` miss is
   not a gap.

   > **Note:** `_matchRelevance` is provided by a separate, in-flight
   > engine change to the full-text `matches` path (a `ts_rank_cd` score
   > surfaced as `entry.meta._matchRelevance`). It is an opt-in sort, so
   > the filter must carry at least one positive `matches` term for it to
   > apply.

   Run the filter through whatever search transport your session has —
   the card-search tool in an assistant room, or
   `npx boxel search --realm <catalog-realm-url> --query '<filter-json>' --json`
   from a CLI session; the filter is identical either way. Write it
   card-rooted (`on` anchor, bare field names); never hand-write
   `item.`-prefixed paths. See `boxel/references/query-systems.md` and
   `boxel/references/spec-usage.md`.

3. **Read each hit's `attributes.specType`, `attributes.cardTitle`,
   `attributes.cardDescription`, and `attributes.readMe`.** Confirm each
   hit actually answers the need — a text match is a candidate, not a
   decision. The readMe is the source of truth and rides on the search
   response.

4. **Decide per hit with the rubric above** — reference, remix, or build.

5. **Reference is per-type.** Take the target from the hit's
   `attributes.ref` (module + name), or an instance from
   `attributes.linkedExamples`, and wire **that** — never the Spec:

   | `specType` | Reference the definition it names by |
   |---|---|
   | `card` / `app` | `adoptsFrom` the card (an app is a CardDef extending `AppCard`) to reuse its schema, or `linksTo` / `linksToMany` an instance |
   | `field` | importing the FieldDef and using `contains` / `containsMany` (a FieldDef is contained, never linked) |
   | `component` | importing it into the template's markup — see `boxel-ui-component-discovery` for the enumerate/self-audit discipline |
   | `command` | importing and invoking it in code, or invoking it through your session's command mechanism (`run-command` from a CLI session) |

## Remixing — via the Listing

Remix is the copy-in path, and it runs on a **Listing**, not a Spec: the
catalog `listing-remix` command takes a Listing card (see
`catalog-listing`). So to remix a definition you found as a Spec, you
need the **Listing that bundles it** — a Listing carries its `specs`, so
find the Listing packaging that Spec (or, for a whole app, its
`AppListing`) and remix that. If your surface can't bridge Spec → Listing
yet, reference the Spec's target instead, or record the gap. Reserve
remix for cases where you will actually modify the copy.

## Whole apps and assets

- **Whole apps** → an app is usually consumed as a *family* (the
  `AppCard` shell plus its member cards), which the catalog ships as an
  **`AppListing`**. Install or remix that (see `catalog-listing`) rather
  than referencing a lone app Spec. (`app` is a valid `specType` and you
  reference an app Spec exactly like a card Spec; the catalog currently
  publishes apps as Listings, so a Spec sweep for `app` may return empty
  — an inventory fact, not a reason to skip the sweep.)
- **Files and themes** (image, font, icon, theme) → an *instance*
  search, not a Spec search. Query the catalog for the `FileDef` /
  `ImageDef` / `Theme` card and `linksTo` it (or set `cardInfo.theme`).
  Don't re-upload or re-author what the catalog already hosts.

## Self-audit before finishing

Re-read what you built. For every card, field, component, command, app,
or asset you authored from scratch, ask: would I have searched the
catalog for this if I were starting over? If yes, did I — and if a
matching Spec, Listing, or asset existed, did I reference the definition
it names (or remix it) instead of rebuilding it? Replace any hand-built
thing that has a catalog equivalent, confirm any real gap is recorded,
and only then call it done.

## Related

- `boxel-ui-component-discovery` — the specialized front-end for UI
  primitives; use it whenever the task is writing template UI. This skill
  is the general form.
- `catalog-listing` — install / remix / update mechanics for Listings.
- `boxel` — CardDef / FieldDef authoring, `adoptsFrom` vs `contains` vs
  `linksTo`, query syntax.
