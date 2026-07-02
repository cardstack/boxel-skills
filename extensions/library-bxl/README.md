---
validated: source-proven
---

# library-bxl — Use the bxl realm-bundled runtime

**What this gives you:** Access to **bxl** — the workspace's unified computation runtime — inside any Boxel card. bxl is one language with two surfaces: a jq-flavored JSON query layer and a complete Excel-compatible formula engine (Bessel functions, statistical / financial / engineering / validation libraries, full Excel date math).

**When to use:** Spreadsheet-style cards. Insurance pricing / reserving / actuarial work. JSON transformation / data shaping. Anything you'd otherwise write a giant inline calculator for.

**The insight:** Boxel doesn't resolve npm inside realms — each realm is its own filesystem. The team solved this with **realm-bundled libraries** stored in a canonical **`common-libs`** realm. Cards in any other realm import via the absolute URL `https://realms-staging.stack.cards/ctse/common-libs/bxl`, which resolves to a one-line shim that re-exports the bundle index. Bundle once in common-libs, use from everywhere.

**Recipe shape:**

1. Confirm the bxl bundle exists at `https://realms-staging.stack.cards/ctse/common-libs/bxl`. If it doesn't, **either** rebuild from the bxl source repo (`npm run realm` targeting common-libs) **or** upload the snapshot at `.claude/extension-libs/bxl/` into the target realm — see [`.claude/extension-libs/README.md`](../../extension-libs/README.md) for the three upload methods (`boxel realm push` recommended).
2. From a card in **any other realm**, import named symbols from `'https://realms-staging.stack.cards/ctse/common-libs/bxl'`.
3. From a card **inside common-libs itself**, use relative `'./bxl'`.
4. Use bxl for JSON queries (`evaluateBxl(filter, input)` — or `expression(...)` as a `computeVia`) and formula libraries for Excel-style math.

**Gotchas:**
- The shim file (`bxl.ts`) is generated. Never edit by hand — re-run the realm build.
- Always prefer the absolute URL form from other realms — keeps imports stable across realm moves.
- The chunks are lazy. Don't import everything if you only need a slice — tree-shaking happens at the chunk boundary.
- Live reference site: [bxl.boxel.site](https://bxl.boxel.site).

**Source:** the workspace's bxl source realms; the canonical bundle entry is `bxl/index.ts` re-exported from a `common-libs`-style realm. **Snapshot for upload:** `.claude/extension-libs/bxl/` (~1 MB).

**Primer-derived patterns:** `bxl-computevia-fields` for schema-level derived fields, `bxl-rule-preview` for Guide/workflow/Reflex-style predicates as data, `bxl-guide-validation` for Guide-shaped rule metadata plus pass/fail issue lists, and `bxl-stable-target-paths` for annotation-like row/field anchors.

**See also:** `organize-realm-bundle-shim`, `library-surfaces`, `references/libraries.md`, [`.claude/extension-libs/README.md`](../../extension-libs/README.md).
