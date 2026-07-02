---
validated: source-proven
---

# bxl-rule-preview - Prototype Guide, workflow, and Reflex predicates as data

> ⚠️ **Status — fitted block pre-dates the CQ-mandatory rule.** The `static fitted` template in `example.gts` hand-rolls width-based layout instead of the two-element `.cq → .fit` container-query pattern. The rule-evaluation mechanics (predicate-as-data, fixture evaluation, jq compilation surface) are source-proven; treat the fitted slot as a placeholder and rewrite per [`boxel/references/container-query-fitted-layout.md`](../../skills/boxel/references/container-query-fitted-layout.md) before relying on it. (P2 in the skill-tree review.)

**What this gives you:** A small card that stores or edits BXL rule text, evaluates it against a fixture, and shows output, compiled jq, warnings, or errors.

**When to use:** You want the BSL primer's Guide constraints, `visibleWhen`, auto-fill, workflow gates, notification predicates, or Reflex predicates before the full platform surface exists. Use it to author and test the expression portion as data.

**The insight:** Several future BSL concepts share the same core: "evaluate this pure expression against this card-shaped input." You can build the authoring/review loop today with `prepareBxlSafe(...)`, then later wire the same expression into a real Guide, Workflow, Notification, or Reflex card.

**Recipe shape:**

```ts
import { prepareBxlSafe } from './bxl';

let prepared = prepareBxlSafe(rule.expression, { schema: invoiceSchema });
let result = prepared.ok ? prepared.value.evaluate(invoiceInput) : null;
```

**Gotchas:**
- This pattern evaluates the expression; it does not make the host enforce it. Treat it as a rule authoring and preview surface.
- Keep rule expressions pure. Writes, API calls, installs, notifications, or LLM calls belong in Commands.
- Pass a readable schema when authors should use labels like `"Line Item"` or `"Credit Limit"`.
- Runtime errors should fail closed when this pattern becomes real policy, validation, or workflow gating.

**Source:** `realms-staging.stack.cards/ctse/surprising-jay/68-bsl-primer-summaries.md` Parts 06-08 and `jolly-mackerel/examples-bxl-contexts.ts`.

**See also:** `library-bxl`, `bxl-computevia-fields`, `command-typed-with-progress`, `command-data-resource`.
