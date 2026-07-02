---
validated: source-proven
---

# bxl-computevia-fields - Use BXL expressions for derived card fields

> ⚠️ **Status — fitted block pre-dates the CQ-mandatory rule.** The `static fitted` template in `example.gts` hand-rolls width-based layout instead of the two-element `.cq → .fit` container-query pattern. The pattern's *core mechanics* (bxl `expression(...)` wired into `computeVia`, isolated + embedded formats) are source-proven; treat the fitted slot as a placeholder and rewrite per [`boxel/references/container-query-fitted-layout.md`](../../skills/boxel/references/container-query-fitted-layout.md) before relying on it. (P2 in the skill-tree review.)

**What this gives you:** Spreadsheet-like derived fields on ordinary Boxel cards, without hand-written TypeScript getters.

**When to use:** Invoices, pricing cards, risk scores, summaries, status bands, date math, rollups over `containsMany` / `linksToMany`, or any CardDef where the logic is pure data transformation.

**The insight:** The BSL primer's `FormulaField` / `Expression` idea is already practical today through bxl's `expression(...)` helper. A computed field can read the card snapshot, use jq-style paths for JSON shape, and use Excel-style helpers for business formulas. Keep side effects out of BXL; this pattern is for read-only derived values.

**Recipe shape:**

```ts
import { expression, jq, fx } from './bxl';

@field subtotal = contains(NumberField, {
  computeVia: expression(jq`[.lineItems[].lineTotal] | add // 0`),
});

@field runBand = contains(StringField, {
  computeVia: expression(fx`IFS(GrandTotal < 100, "small", TRUE, "review")`),
});
```

**Gotchas:**
- The example assumes the target realm has a top-level `bxl.ts` shim plus `bxl/` bundle, so it imports from `./bxl`. From a subfolder use `../bxl`; from another realm use a verified common-libs URL.
- Prefer `jq\`...\`` for structural JSON paths and rollups. Prefer `fx\`...\`` when the expression reads like an Excel formula.
- BXL-derived fields are read-only. If a user should be able to override the value, store the field normally and use a Guide/autofill-style pattern instead.
- If a computed output is an object or array of FieldDef-shaped data, pass `{ as: SomeField }` to `expression(...)`; scalar fields do not need it.

**Source:** `realms-staging.stack.cards/ctse/surprising-jay/mockups/bsl-primer-mockup.gts` Part 07; live examples in `powerful-goat/perf-run.gts`, `powerful-goat/perf-owner.gts`, and `working-loon/Hospital/hospital-fields.gts`.

**See also:** `library-bxl`, `bxl-rule-preview`, `bxl-stable-target-paths`.
