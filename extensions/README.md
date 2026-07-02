# Workspace extensions — tracked, but workspace-specific

This folder holds extensions to the core skill tree that name a **specific** library, realm, or bundle this workspace uses. They're tracked in git so teammates pick them up by cloning, but they live separately from the portable patterns because they assume a particular workspace setup.

The portable skill tree under [`.claude/skills/`](../skills/) describes Boxel patterns architecturally — without referencing specific realm URLs, library import paths, or workspace conventions. Anything that names a particular library, a particular realm, or a particular bundle belongs here instead. That way an agent ported to a different Boxel workspace doesn't drag in URLs that don't exist on the new machine.

## What lives here

Each subdirectory follows the same shape as a `boxel-patterns` pattern: `README.md` + `example.gts`. The agent reads them on demand, just like the core patterns — the difference is they're scoped to *this* workspace's libraries.

Typical inhabitants:

- **Realm-bundled library wrappers** — pattern docs for libraries that the team has bundled into a `common-libs`-style realm. The library's specific URL, import statements, and usage idioms.
- **Surface- or framework-specific patterns** — patterns built on top of those libraries (e.g. a FieldDef that wraps a library's primitives, a layout pattern that assumes a library's runtime).
- **Realm-bundling infrastructure** — the shim/bundle convention itself, when it's specific to how *this* team ships JS inside realms.
- **Non-core or provider-specific patterns** — provider-specific patterns such as Replicate image generation or legacy Cloudflare image-card upload. The portable skill tree should prefer OpenRouter image generation and FileDef persistence; provider-specific recipes live here.
- **BXL / BSL-primer extractions** - small working patterns that turn future-looking BSL concepts into current realm cards, such as BXL computeVia formulas, rule previews, guide validation, and stable target paths.

## Index

| Slug | Trigger keywords | `example.gts` | Readiness |
| --- | --- | --- | --- |
| `library-bxl` | bxl runtime, jq/fx helpers, `prepareBxlSafe`, common-libs | yes | ready |
| `library-ember-flow` | flowchart, node graph, canvas editor | yes | ready |
| `library-pretext` | canvas text measurement, multi-column text | yes | ready |
| `library-surfaces` | surfaces framework, layout-and-cell runtime | yes | ready |
| `organize-realm-bundle-shim` | realm-bundled library, re-export shim | yes | ready |
| `bxl-computevia-fields` | derived/formula fields, `expression(...)`, jq/fx in cards | yes | ready ⚠️ fitted = P2 placeholder |
| `bxl-rule-preview` | rule authoring, validate-this-card preview | yes | ready ⚠️ fitted = P2 placeholder |
| `bxl-guide-validation` | Guide rules, validation as data, fail-closed | yes | ready ⚠️ fitted = P2 placeholder |
| `bxl-stable-target-paths` | annotation anchors, predicate selectors, row addressing | yes | ready ⚠️ fitted = P2 placeholder |
| `surface-default-template` | replace default `isolated`/`edit` with surfacified template | yes | ready |
| `surface-field-kit` | surface-aware FieldDef, Cell + Run | yes | ready |
| `surface-form-card` | surfacified form card, labeled form rows | yes | ready |
| `outline-panel-toggle` | outline panel, panel axis orthogonal to format | yes | ready |
| `theme-css-token-redefinition` | drop-in CSS theme via token redefinition | yes | ready |
| `integrate-replicate-ai-image` | Replicate image generation (provider-specific) | yes | ready — prefer `integrate-openrouter-image-generation` for new work |
| `deprecated-cloudflare-image-upload` | legacy Cloudflare image-card upload | yes | **deprecated** — use FileDef + OpenRouter instead |

The ⚠️ markers in the readiness column indicate patterns whose fitted block pre-dates the CQ-mandatory rule; the README carries a top-of-file banner pointing at the [`container-query-fitted-layout.md`](../skills/boxel/references/container-query-fitted-layout.md) rewrite recipe. The pattern *mechanics* are still source-proven; only the layout block is a placeholder.

## Convention

- Same internal structure as patterns under `.claude/skills/boxel-patterns/patterns/<slug>/` — README + example.
- The agent finds them by reading this folder when a user names a workspace-specific library or asks "how do we usually do X here."
- Tracked skill-tree files can reference extensions by path (e.g. `.claude/extensions/library-pretext/`) since the extension will be present in any clone of this repo. Just remember that *the contents* are workspace-specific — a different workspace's clone would have different extensions.

## Creating a new extension

```bash
mkdir -p .claude/extensions/<slug>
# Author README.md describing what/when/why/how
# Optionally add example.gts with a minimal working snippet
```

Commit alongside the rest of the skill-tree changes. No special workflow.
