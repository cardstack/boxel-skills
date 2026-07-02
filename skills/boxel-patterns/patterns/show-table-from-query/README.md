---
validated: source-proven
---

# show-table-from-query — Generic table that takes a Query + realm

**What this gives you:** A reusable Glimmer component that renders any Boxel `Query` result as a sortable table — pass it a `Query`, a realm URL, and the field names to show, and you get a working table. No per-domain table component to write.

**When to use:** Any "list of cards" UI. Reports, directories, admin views, dashboards. Anywhere you'd otherwise hand-write a `<table>` with `{{#each}}` and column logic.

**The insight:** Field rendering can be cached by *instance* in a WeakMap. The catalog-realm version uses `FieldRenderer` with a `WeakMap<Box, BoxComponent>` so re-renders don't re-create the field component. That keeps rerenders cheap and flicker-free — Ember-admin-grid behavior without Ember Data.

**Recipe shape:**

1. Component signature: `{ Args: { Named: { query: Query; realm: string; columns: string[] } } }`.
2. Use `prerenderedCardSearchComponent` (or `getCards`) internally; pass the query + realm through.
3. For each row, render fields by name. Cache `Box.create` per row via a `WeakMap`.
4. Headers can come from `columns`; or read field metadata from the card type via `getFields`.

**Gotchas:**
- For >50 rows, prefer `PrerenderedCardSearch` — pre-rendered cells avoid full re-renders.
- Be defensive about missing fields; show `—` instead of throwing.
- The `on` property on the query is mandatory — see `boxel/references/query-systems.md`.

**Source:** catalog-realm `components/table.gts:33-45` (TableSignature), `components/field-renderer.gts:40-79` (WeakMap cache), `components/grid.gts:16-47` (the grid variant).

**See also:** `automate-linked-to-me-lookup`, `boxel/references/query-systems.md`, `boxel/references/fitted-formats.md`.
