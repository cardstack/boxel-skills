---
boxel:
  kind: skill
---

# Boxel Skills Index

Boxel is one cohesive framework — schema, behavior, and rendering live together on each card. Each realm contains Boxel **card definitions** (`.gts` files — Glimmer TypeScript) and **card instances** (`.json` files — JSON:API).

## What you can build with Boxel

Boxel is a card-based development platform. The unit of construction is the **card** — a typed schema + reactive component + JSON instance, all colocated. From this single primitive, common deliverables include:

- **Apps** — multi-card families with linked-to relationships (catalog apps, blog apps, CRMs, dashboards, planners). Cards link to other cards; templates compose; one "app card" can act as a portal/router for the rest.
- **Documents** — long-form cards with rich BFM content, computed TOCs, backlinks, footnotes, mermaid diagrams, math, and inline embedded cards. Cards-as-documents work for reports, proposals, contracts, briefs, recipes, articles.
- **Dashboards & multi-card surfaces** — layout shells (`layout-design-board`, custom layout cards) composing many cards at different formats. Useful for design boards, KPI dashboards, moodboards, comparison views.
- **Forms** — labeled-form CardDefs where the schema drives a stack of editor rows, with computed and validated fields.
- **AI-powered cards** — cards that kick off AI assistant conversations (`command-with-skill-card-ref`), perform one-shot LLM requests (`integrate-one-shot-llm`), generate images through OpenRouter (`integrate-openrouter-image-generation`, with Gemini image as the default and ChatGPT/OpenAI image models when requested), or batch-process via on-the-fly commands.
- **Catalog assets** — installable listings (apps, cards, fields, skills, themes) shipped through the catalog with atomic install/remix flows.
- **Rich markdown content** — BFM-authored content with card-embed directives, fenced renderers (mermaid, math, csv, kanban, excalidraw), and `static markdown` template output.
- **Local synced development** — pull a realm to a local directory, edit `.gts` files in your IDE, sync changes back. The `boxel-cli` provides bidirectional sync with conflict resolution. See `/boxel-sync-workspace`.

The slash commands below map user intents to the workflows that produce these deliverables.

## Pre-flight

If the user's intent is clear, route to the matching command below. If unsure which command applies, list the candidates with one-line summaries and ask the user to pick — don't barrel forward on a guess.

## Common Actions (slash commands)

The action layer lives in `commands/`. Pick the one that matches the user's outcome:

### Schema & code

- **[`/boxel-create-card`](commands/boxel-create-card.md)** — Create a new CardDef, FieldDef, or small card family with all required formats.
- **[`/boxel-add-field`](commands/boxel-add-field.md)** — Add, rename, retype, or remove fields on an existing CardDef/FieldDef.
- **[`/boxel-add-file-field`](commands/boxel-add-file-field.md)** — Add a file-backed field (FileDef / ImageDef / MarkdownDef / CsvFileDef).
- **[`/boxel-edit-template`](commands/boxel-edit-template.md)** — Change `isolated` / `embedded` / `fitted` / `edit` / `atom` / `markdown` templates.

### Data & instances

- **[`/boxel-create-instance`](commands/boxel-create-instance.md)** — Create new JSON card instances or update existing ones.
- **[`/boxel-migrate-schema`](commands/boxel-migrate-schema.md)** — Find and update instances after a schema change (batched, with confirmation).

### Discovery & design

- **[`/boxel-build-from-pattern`](commands/boxel-build-from-pattern.md)** — Start from a working pattern matching the user's outcome (Show / Pick / Build / Automate / Lay out / Link / Use a library / Make a Command / Theme).
- **[`/boxel-design-card`](commands/boxel-design-card.md)** — Improve visual design — colors, typography, theme tokens, asset direction.
- **[`/boxel-develop-theme`](commands/boxel-develop-theme.md)** — Create, convert, audit, or patch a Theme, Style Reference, Detailed Style Reference, or Brand Guide.
- **[`/boxel-search-cards`](commands/boxel-search-cards.md)** — Find cards in a realm by type, title, or query filter.
- **[`/boxel-preview-card`](commands/boxel-preview-card.md)** — Preview a card / module / format in the live Boxel app.

### Catalog & runtime

- **[`/boxel-install-listing`](commands/boxel-install-listing.md)** — Use, install, remix, or update a catalog listing.
- **[`/boxel-submit-listing`](commands/boxel-submit-listing.md)** — Submit a catalog listing through the workflow-card PR flow.
- **[`/boxel-debug-runtime`](commands/boxel-debug-runtime.md)** — Diagnose runtime, indexing, command, or mode issues.
- **[`/boxel-sync-workspace`](commands/boxel-sync-workspace.md)** — Pull / push / sync a realm to a local directory via `boxel-cli`; manage `.boxel-sync.json` + `.boxel-history`.

## Skill-tree glossary

[`skills/glossary.md`](skills/glossary.md) is the back-of-the-book reference — every term, concept, library, helper, host command, pattern, slash command, convention, and acronym used across the skills, with a one-line definition and a pointer to the deeper file. Scan it when you're not sure what a term means or where it's documented. **Update this file whenever a skill, reference, pattern, extension, or convention is added, renamed, or removed.**

## Skill catalog

Commands route to these supporting skills. They're documented in `skills/` and auto-activate on description triggers — you don't load them all upfront.

### Foundation

- **`boxel/`** — Cardinal rules + 18 references for CardDef, FieldDef, templates, queries, formats, commands.
- **`source-code-editing/`** — SEARCH/REPLACE block format. Required before any `.gts` edit.

### UI & content

- **`boxel-ui-guidelines/`** — Template UI rules: theme tokens, `@fields` vs `@model`, container queries, layout safety.
- **`boxel-design/`** — Visual design language, mood, typography, asset direction.
- **`boxel-file-def/`** — File-typed fields (FileDef, ImageDef, MarkdownDef, PngDef, CsvFileDef).
- **`boxel-flavored-markdown/`** — Authoring BFM content with `:card`/`::card` directives, mermaid, math, alerts.
- **`boxel-markdown-format/`** — Static `markdown` template format with `markdownEscape` and helpers.
- **`boxel-skill-authoring/`** — Writing user-authored skills: the SKILL.md format contract (`boxel.kind: skill` frontmatter), tool declarations, placement, and the verify loop.

### Runtime

- **`boxel-environment/`** — Driving the live Boxel app: switch-submode, host commands, search-cards, indexing.
- **`catalog-listing/`** — Catalog use / install / remix / update operations, plus submission through `SubmissionWorkflowCard`.
- **`boxel-create-edit-cards/`** — Thin pointer to `boxel-environment/references/card-tool-selection.md` (host-command combos for card create/edit).

### Patterns

- **`boxel-patterns/`** — Outcome-indexed catalogue of working examples. Ready patterns and planned backlog are kept separate. Two reference docs at this level:
  - `references/integration-surfaces.md` — capability cheatsheet (what cards can reach for: base APIs, host commands, AI services, BFM, boxel-cli, etc.).
  - `references/libraries.md` — import-path catalogue (where each symbol comes from).

## Conventions

- **Theme first.** Before writing a new card, decide how it gets a theme: per-instance via `cardInfo.theme`, OR a computed `cardTheme` on the CardDef (inherit from a linked card like `this.project.cardTheme`, query for a "default" Theme in the realm, derive by tag/category, etc.). Templates always reference `var(--*)` tokens. See pattern `theme-first-workflow`.
- **`cardInfo.theme` is the per-instance override.** When set, it wins over whatever the CardDef's computed `cardTheme` would have returned. When the CardDef does NOT override `cardTheme`, `cardInfo.theme` is how a theme installs at all — but a Task that inherits its Project's theme doesn't need it on every Task instance.
- **Override `cardTitle` when there's a primary field.** Respect `cardInfo.name` first, then fall back to the primary field, then to `Untitled <DisplayName>`. See pattern `cardinfo-override-title`.
- **Build a Home app whenever you ship a card family.** When the realm contains 2+ related CardDefs (Project + Task + Person; Meet + Swimmer + Club + Result; Show + Listing + Venue), ship a `Home` CardDef alongside them: `prefersWideFormat = true`, brand masthead, one `@context.searchResultsComponent` section per CardDef in the family. The user lands there and sees the realm at a glance — no manual indexing required. See pattern [`app-card-home-with-search`](skills/boxel-patterns/patterns/app-card-home-with-search/README.md). Skip only for single-card utilities.
- **Lint is mandatory for Boxel code work** (Cardinal Rule 10): `npx boxel file lint <path> --realm <url> --file <local-file>` before push, `npx boxel lint <path> --realm <url>` after. Prefer `npx boxel` over bare `boxel` (stale shims); there is no `npx boxel check`. Commands, clean-output criteria, and the no-shell assistant variant: [`lint-workflow.md`](skills/boxel/references/lint-workflow.md).
- **Public-repo path hygiene.** This workspace is a public repo. Never commit absolute local filesystem paths, local usernames, or machine-specific checkout paths into tracked docs, scripts, generated bundle comments, or learning notes. Use placeholders (`/path/to/boxel`, `/path/to/bxl`, `[local checkout]`) or env vars (`BOXEL_MONOREPO`). Local paths are fine in transient shell commands, not in persisted files.
- **Don't reach for `cancel-indexing`.** Slow indexing is not stuck indexing. Sample the indexed-card count for 5+ minutes; rising = leave it alone. `cancel-indexing --cancel-pending` discards the realm's queued TODO list and makes things worse. Last-resort recovery: `boxel file touch <one card>` → base `cancel-indexing` (never `--cancel-pending`) → `full-reindex-realm`. See [`skills/boxel-environment/references/indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md).
- **Fresh-realm push semantics.** `boxel realm push` of 30+ files via `/_atomic` can silently drop indexing jobs even when the push reports success. For > 50 instances, push kit-by-kit and verify each batch indexes (`npx boxel search` returns the expected count) before pushing the next. See indexing-operations.md "Post-push verification gate" and "The `/_atomic` batch trap".
- **Never inline media/binary in card JSON** (Cardinal Rule 11). No `data:`/`blob:`/base64/media bytes in any string field or JSON attribute. Store media as a realm file via `linksTo(FileDef/ImageDef/PngDef)`; generated bytes go through `WriteBinaryFileCommand` first.
- **🔴 `DateField` value = `YYYY-MM-DD` (no `T`); `DateTimeField` value = ISO datetime with `T`** (Cardinal Rule 12). A mismatch passes lint and indexes, then crashes at render (`RangeError: Invalid time value`). `*At` suffix → DateTimeField; `*Date`/`*On`/`dob` → DateField. Details: [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md).
- **🚨 Never put an external URL in `relationships.<field>.links.self`** (Cardinal Rule 13) — the indexer fetches it expecting a card, the failed parse poisons the JSONB write, and the **whole realm's indexing transaction rolls back**. For external image URLs use the pair pattern `linksTo(ImageDef)` + `contains(UrlField)`; recipe in [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md) "Image fields — the URL/ImageDef pair pattern".
- **🚨 `linksToMany` JSON uses indexed top-level keys** (`"activityFeed.0": { "links": { "self": "../foo" } }`), never an array under `links.self` (Cardinal Rule 14). The array shape is rejected with `"instance ... is not a card resource document"`.
- **🚨 Building a kit is a sequential checklist with verification gates — lint is NOT the gate.** The seven gates, in order: (1) Stage-0 planning (thunk-by-default `() => Class` for kit-internal links; per-format content matrices), (2) import audit (base fields are **default** exports; never `ImageDef` from `/base/image`), (3) CDN-verify every icon, (4) push per-file — no atomic batches on fresh realms, (5) module-load probe (`get-card-type-schema` must return `status: ready`), (6) typed-search count gate (`boxel search` is the truth source, not lint), (7) render smoke test per CardDef. Exact commands and failure signatures: [`indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md).
- **Query traps that silently return zero rows** (Cardinal Rules 6–8): `filter: { type: ref }` to select all cards of a type — never a bare `{ on: ref }` (`on` only scopes predicates); custom sort fields require `on: ref`; build refs with `codeRef()` and import the `realmURL` Symbol from `@cardstack/runtime-common` (never `Symbol.for('realmURL')`). Details: [`query-systems.md`](skills/boxel/references/query-systems.md).
- **Format choice = who owns the cell size, not what the cell looks like.** `@format='embedded'` lets the child decide its height — use for lists, feeds, roster rows. `@format='fitted'` makes the child fill a parent-controlled box — use for uniform tile grids (portraits, calendar cells). Picking fitted for a list with short content leaves empty boxes below each row. The fix is the format choice, upstream of any CSS. See "Picking the format" in [`delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md).
- **Include `attributes.cardInfo` on instances when practical.** Even with all null values, the `cardInfo` object lets the user edit name/summary/theme later through the UI. It's required when the CardDef uses the default `cardTheme` pass-through AND you want a theme set per-instance.
- Read before writing. Many `.gts` files have edit-tracking markers; reading first preserves them.
- Use SEARCH/REPLACE for `.gts` edits. `write-text-file` is forbidden for `.gts` (UI freezes; tool calls don't stream).
- One CardDef per file. FieldDefs and helpers can co-locate.
- Theme variables only — no hard-coded colors in templates. All colors live in the Theme card's `cssVariables`.
- Three formats minimum: every CardDef needs `isolated`, `embedded`, AND `fitted`.
- **Every user-facing card built from scratch goes through [`design-playbook.md`](skills/boxel/references/design-playbook.md).** Four stages: mockup with no variables → extract theme DNA → tokenize → derive fitted + embedded. Skip only for utility cards.
- **Card families (2+ related CardDefs) require Stage 0 planning artifacts before any real schema** — Goal · Brief · DataModelPlan · Sample Data · ASCII Layout · MicroMockups. Without them, fitted views come out pedestrian. See design-playbook.md "Stage 0" and pattern `build-planning-cards-trio`.
- **When embedding child cards via `<@fields.X @format='...' />`, read [`delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md) first.** The host injects CardContainer chrome the parent must own (via `:deep()`, the theme cascade, or `@displayContainer={{false}}`); the doc covers the four high-frequency traps — plural-field wrapper, atom chrome on dark backgrounds, stagger via CSS variables, and the binary divider strategy.
- **CQ fitted layout is mandatory for every `fitted` template.** Derive the visual layout from [`design-playbook.md`](skills/boxel/references/design-playbook.md) stage 4, then implement it with [`container-query-fitted-layout.md`](skills/boxel/references/container-query-fitted-layout.md). For standard compositions, prefer the `FittedCard` component from `@cardstack/boxel-ui/components` (implements the standard internally; tune via `--fc-*` variables). When hand-rolling: a single root `.fit` grid whose `@container` rules query the host-provided `fitted-card` size container (never create your own container on the root), container-query sub-formats, `pow()` typography variables, `minmax(0, 1fr)` body rows, and `min-height: 0` overflow discipline. Do not hand-roll fitted CSS without CQ.
