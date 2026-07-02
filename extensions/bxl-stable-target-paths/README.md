---
validated: source-proven
---

# bxl-stable-target-paths - Address rows and fields with BXL selectors

> ⚠️ **Status — fitted block pre-dates the CQ-mandatory rule.** The `static fitted` template in `example.gts` hand-rolls width-based layout instead of the two-element `.cq → .fit` container-query pattern. The pattern's *core mechanics* (predicate vs positional selectors, composite anchors, business-key preference) are source-proven; treat the fitted slot as a placeholder and rewrite per [`boxel/references/container-query-fitted-layout.md`](../../skills/boxel/references/container-query-fitted-layout.md) before relying on it. (P2 in the skill-tree review.)

**What this gives you:** A small working pattern for annotation-like anchors that target data by predicate, not by fragile row position.

**When to use:** Review comments, generated findings, validation messages, import diagnostics, spreadsheet-like row notes, or any UI that needs to point at a nested row/field and survive reorder or insertion.

**The insight:** The BSL primer's annotation model needs durable anchors. A positional path such as `"Line Item"[#4].Quantity` is useful but can drift when rows move. A predicate target such as `"Line Item"[SKU = "COPY-04"].Quantity` follows the data. A composite form can keep the fast position and verify the predicate.

**Recipe shape:**

```bxl
"Line Item"[SKU = "COPY-04"].Quantity
```

```bxl
"Line Item"[row 4, SKU = "COPY-04"].Quantity
```

**Gotchas:**
- Use predicate selectors for persisted anchors. Use positional selectors for current UI focus only.
- Prefer stable business keys (`sku`, `id`, `claimId`) over display labels that users may edit.
- First-match predicates are convenient but can hide duplicate keys. Add validation when the anchor key should be unique.
- This pattern evaluates the target path today; a full Annotation CardDef still needs target card URL, anchor kind, body card, author, and lifecycle state.

**Source:** `realms-staging.stack.cards/ctse/surprising-jay/mockups/bsl-primer-mockup.gts` Part 14; `jolly-mackerel/examples-bxl-contexts.ts` annotation examples.

**See also:** `library-bxl`, `bxl-rule-preview`, `collab-threaded-comments` planned pattern.
