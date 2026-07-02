---
validated: source-proven
---

# bxl-guide-validation - Run Guide validation rules with bxl

> ⚠️ **Status — fitted block pre-dates the CQ-mandatory rule.** The `static fitted` template in `example.gts` hand-rolls width-based layout instead of the two-element `.cq → .fit` container-query pattern. The pattern's *core mechanics* (Guide rule data model, `prepareBxlSafe(...)` evaluation, fail-closed enforcement, stable target paths) are source-proven; treat the fitted slot as a placeholder and rewrite per [`boxel/references/container-query-fitted-layout.md`](../../skills/boxel/references/container-query-fitted-layout.md) before relying on it. (P2 in the skill-tree review.)

**What this gives you:** A Guide-shaped validation pattern: rules live as card data, each rule has a stable target path, severity, message, and bxl expression, and the target card renders a deterministic pass/fail issue list.

**When to use:** Guide-based validation prototypes, form acceptance rules, policy checks, approval readiness, parent-facing copy constraints, launch gates, and any workflow where validation should be authored as data rather than buried in template conditionals.

**The insight:** Guide validation is narrower than a general rule preview. A Guide rule needs both an expression and an addressable target: "what failed, where should the UI point, and how serious is it?" Use bxl for the pure predicate, then keep the Guide metadata alongside it so the same rule can later migrate into the platform Guide surface.

**Recipe shape:**

```ts
import { prepareBxlSafe } from 'https://realms-staging.stack.cards/ctse/common-libs/bxl';

let prepared = prepareBxlSafe(rule.expression, { schema: targetSchema });
let result = prepared.ok ? prepared.value.evaluate(targetInput) : null;
let passed = result?.value === true;
```

**Gotchas:**
- Fail closed. Compile errors, runtime errors, and non-boolean outputs should be treated as validation failures for enforcement.
- Keep Guide rules pure. Writes, saves, LLM calls, notification sends, and installs belong in Commands after validation passes.
- Store a stable `targetPath` for every rule. Use label paths for scalar fields and predicate paths for rows, e.g. `"Line Item"[SKU = "COPY-04"].Quantity`.
- Do not duplicate BXL expressions in the template. Templates should render `validateGuide(...)` results; the guide rule data is the source of truth.
- Use the absolute `common-libs` import from normal realms. Use `./bxl` only when the card itself lives inside the `common-libs` realm.

**Source:** User direction on 2026-05-22: define guide-based validation as a workspace extension pattern and use the existing bxl library. Builds on `bxl-rule-preview`, `bxl-stable-target-paths`, and the Tessar `SkillCard` guide/playbook prototypes.

**See also:** `library-bxl`, `bxl-rule-preview`, `bxl-stable-target-paths`, `command-typed-with-progress`.
