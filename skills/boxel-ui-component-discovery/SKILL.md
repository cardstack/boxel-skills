---
name: boxel-ui-component-discovery
description: MANDATORY before writing any UI in a `.gts` template. Search the catalog for a component Spec and reuse it — Pret UI first, boxel-ui only where Pret UI has no equivalent yet. Fall back to raw HTML only when no matching spec exists, and surface the gap when you do.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-entries'
        name: default
      requiresApproval: false
---

# Boxel UI Component Discovery

## Mandatory rule

Before you write any UI in a `.gts` template — anything you'd describe
as a UI primitive (button, input, dropdown, modal, tooltip, pill, menu,
accordion, …) — **you must first search the catalog for an existing
component Spec and reuse it.** The catalog holds two component
libraries:

- **Pret UI** — `attributes.ref.module` under
  `@cardstack/pretui/components/` (`attributes.ownership` is
  `'pretui'`). This is the default for every control and display
  primitive.
- **boxel-ui** — `attributes.ref.module` is
  `@cardstack/boxel-ui/components`. Use one only when no Pret UI spec
  covers the primitive (layout shells such as `CardContainer` and
  `FittedCard`, `KanbanPlane`, `FilterList`, …).

When both libraries match, use the Pret UI one. A Pret UI spec's
`attributes.refs` names the components it supersedes (`boxel-ui Menu`),
and `skills/boxel-ui-guidelines/references/use-boxel-ui-components.md`
has the full replacement table.

- A matching spec exists → import it via `attributes.ref` and follow
  its documented API (step 3 says where that lives for each library). No raw `<button>`, `<input>`,
  `<textarea>`, `<select>`, `<details>`, etc. Visual styling — even
  unconventional aesthetics — is never a reason to drop down to raw
  HTML. Restyle via the component's documented CSS-variable surface.
- No spec matches → write minimal idiomatic HTML and record the gap
  where your workflow keeps notes (tell the user, or note it on the
  task you are working), so the gap is visible. Don't invent a
  `@cardstack/pretui/components/…` or `@cardstack/boxel-ui/components`
  import that wasn't in the search results — names not present in the catalog don't exist for your
  purposes.

This rule is intentionally not a fixed HTML→component mapping. The
catalog's inventory changes over time and the spec readMe is the source
of truth for what's available and what each component is called.

## Procedure

1. **Enumerate first.** Before any search, read the brief and your
   planned template and list every UI primitive it implies — in plain
   language ("button", "dropdown", "tag-style indicator", "expandable
   section"). The partial-compliance failure mode is "agent finds one
   match, uses it, hand-rolls everything else" — enumerating up front
   prevents it.

2. **Query the catalog once, broadly.** Use the catalog realm for the
   environment you are working against — take it from your context if
   one is provided, otherwise list the realms available to your session
   (`npx boxel realm ls` from a CLI session) or ask; do not invent a host.

   ```json
   {
     "filter": {
       "on": { "module": "@cardstack/base/spec", "name": "Spec" },
       "eq": { "specType": "component" }
     }
   }
   ```

   Run the filter through your session's search transport. Write it
   card-rooted (`on`/`type` anchors, bare field names) like every other
   card query — the transport translates it to the search endpoint's
   wire form itself; never hand-write `item.`-prefixed paths.

   - **From a CLI session**, `npx boxel search --realm <catalog-realm-url>
     --query '<filter-json>' --json` returns the full inventory (well
     over 100 specs across both libraries) in one call. Match each item in your enumeration to a result
     by reading `attributes.cardTitle` and `attributes.cardDescription`.
   - **In an assistant room, use `search-entries`** with `scope: 'cards'`.
     It pages (`limit` default 5, max 10), so one broad query will not
     hand you the whole inventory — run one query per enumerated item
     instead, adding `{ "matches": "<the item's plain-language name>" }`
     alongside the `specType` constraint, and read the `total` each
     result carries to see how much you have not seen. `search-entries`
     becomes callable once you have read this skill file.

   Narrow with `contains` on the title or `matches` (full-text over the
   readMe) if a query is noisy. See `boxel/references/query-systems.md`
   for full query syntax.

3. **Read each chosen spec's API.**
   - **Pret UI:** `attributes.readMe` holds only the import line. The
     contract (args, accessibility, theming knobs) is the component's
     write-up, linked from the spec as `writeup` (the `<name>.md` beside
     the module); read it before using the component. Worked examples
     are in `<name>.usage.gts`.
   - **boxel-ui:** `attributes.readMe` has the Import line, the API
     table (arg / type / required / default / options / description),
     an example snippet, and CSS variables. It rides on the search
     response; no follow-up fetch needed.

4. **Use the components.** Translate each `attributes.ref` to an
   import line directly (the readMe gives you the exact statement).
   Copy an example as a template and substitute your own args following
   the contract or API table. Never carry boxel-ui arg names (`@kind`,
   `@as`, `@size='extra-small'`) onto a Pret UI component. Required args must be
   present; defaults are listed for every optional arg.

## Self-audit before finishing

Re-read your finished template. For each interactive or form-shaped
HTML element it contains, ask: would I have searched the catalog for
this if I were writing it from scratch? If yes, did I? Replace any raw
HTML primitive that has a spec'd equivalent, and any boxel-ui component
that has a Pret UI replacement, re-run lint/parse, and
only then call it done. Raw `<input>` / `<select>` / `<details>` lint
and parse clean — only this audit catches them.

## Related

- `catalog-reuse` — the general form of this discipline: search the
  catalog for an existing card, field, command, app, or asset before
  building one. This skill is the specialized front-end for UI
  primitives in a `.gts` template; reach for it whenever the task is
  writing template UI.
