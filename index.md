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
- **Local synced development** — pull a realm to a local directory, edit `.gts` files in your IDE, sync changes back. The `boxel-cli` provides bidirectional sync with conflict resolution.

The skill catalog below covers the workflows that produce these deliverables.

## Pre-flight

Match the user's intent to a skill in the catalog below and read it before starting. If several could apply, list the candidates with one-line summaries and ask the user to pick — don't barrel forward on a guess.

**Acting on the app takes one more read.** This index carries no host commands, and neither does any skill page: the commands live in [`skills/boxel-environment/references/host-commands-reference.md`](skills/boxel-environment/references/host-commands-reference.md), and reading that file is what makes `switch-submode`, `show-card`, `search-cards`, and the rest callable. Anything beyond answering in prose — creating a card, editing a file, switching mode, searching a realm — needs it, so read it alongside the skill you picked.

Read it before you plan out loud. Describing a plan you have no tools to carry out, or asking the user to switch modes by hand, means this step was skipped.

**Card work takes one more read too.** Before writing or editing any card definition (`.gts`) or instance JSON, read [`skills/boxel-workspace-cardinal-rules/SKILL.md`](skills/boxel-workspace-cardinal-rules/SKILL.md) — the checklist of silent-failure traps. Every rule on it passes lint and usually passes the correctness check, then breaks later where you cannot see it: corrupting the realm index, dropping data, crashing at render, or freezing the entire application. The inline highlights further down this index and the `boxel` skill's own Cardinal Rules table cover the most common traps, but neither list is complete — the checklist is the full set, and checking your work against it before finishing is what catches the rest.

**Reports go in Rich Markdown, not a new card.** When a task asks for a report, summary, briefing, or dashboard-style document, read [`skills/rich-markdown-reports/SKILL.md`](skills/rich-markdown-reports/SKILL.md) before deciding how to build it — the default is a Rich Markdown `.md` file that embeds existing cards (custom or off-the-shelf), not a bespoke card definition authored just to present the report.

## Skill-tree glossary

[`skills/glossary.md`](skills/glossary.md) is the back-of-the-book reference — every term, concept, library, helper, host command, pattern, convention, and acronym used across the skills, with a one-line definition and a pointer to the deeper file. Scan it when you're not sure what a term means or where it's documented. **Update this file whenever a skill, reference, pattern, extension, or convention is added, renamed, or removed.**

## Skill catalog

Every skill lives in `skills/` and auto-activates on its description triggers — you don't load them all upfront.

### Foundation

- **[`boxel/`](skills/boxel/SKILL.md)** — Cardinal rules + 18 references for CardDef, FieldDef, templates, queries, formats, commands.
- **[`boxel-workspace-cardinal-rules/`](skills/boxel-workspace-cardinal-rules/SKILL.md)** — Silent-failure trap checklist: rules that pass lint (and often indexing), then corrupt the realm index, crash at render, or drop data with no error. Mandatory pre-flight read for any card work (see Pre-flight above); check every card/field against it before finishing.
- **[`bxl-authoring/`](skills/bxl-authoring/SKILL.md)** — Writing BXL in a card's `computeVia`: which of the three call-site forms to reach for, what the `derive` profile refuses, aggregating over linked and query-backed collections, and the traps that produce a plausible wrong value instead of an error.
- **[`query-backed-relationships/`](skills/query-backed-relationships/SKILL.md)** — The `{ query }` form of `linksTo`/`linksToMany`: the bounded page it holds rather than the whole match set, reading `totalMatchCount` instead of counting rows, declaring a larger page, `eager: false`, and when a search component is the right tool instead.
- **[`source-code-editing/`](skills/source-code-editing/SKILL.md)** — SEARCH/REPLACE block format. Required before any `.gts` edit.
- **[`ember-best-practices/`](skills/ember-best-practices/SKILL.md)** — Ember.js performance + accessibility rules (59 rules across 10 categories) for writing, reviewing, or refactoring Ember code.

### UI & content

- **[`boxel-ui-guidelines/`](skills/boxel-ui-guidelines/SKILL.md)** — Template UI rules: theme tokens, `@fields` vs `@model`, container queries, layout safety.
- **[`boxel-ui-component-discovery/`](skills/boxel-ui-component-discovery/SKILL.md)** — Mandatory catalog search for a boxel-ui component Spec before hand-rolling any UI primitive in a `.gts` template.
- **[`catalog-card-field-reuse/`](skills/catalog-card-field-reuse/SKILL.md)** — Mandatory catalog `Spec` search for a reusable card/field before authoring a new CardDef/FieldDef; reference as-is by default, remix only to modify, build new only when nothing matches.
- **[`boxel-design/`](skills/boxel-design/SKILL.md)** — Visual design language, mood, typography, asset direction.
- **[`boxel-file-def/`](skills/boxel-file-def/SKILL.md)** — File-typed fields (FileDef, ImageDef, MarkdownDef, PngDef, CsvFileDef).
- **[`boxel-flavored-markdown/`](skills/boxel-flavored-markdown/SKILL.md)** — Authoring BFM content with `:card`/`::card` directives, mermaid, math, alerts.
- **[`boxel-markdown-format/`](skills/boxel-markdown-format/SKILL.md)** — Static `markdown` template format with `markdownEscape` and helpers.
- **[`rich-markdown-reports/`](skills/rich-markdown-reports/SKILL.md)** — **For a report/summary/dashboard, compose Rich Markdown that embeds existing cards** rather than authoring a bespoke card definition to present it. Read when a document-style deliverable is requested.
- **[`boxel-skill-authoring/`](skills/boxel-skill-authoring/SKILL.md)** — Writing user-authored skills: the SKILL.md format contract (`boxel.kind: skill` frontmatter), tool declarations, placement, and the verify loop.

### Runtime

- **[`boxel-environment/`](skills/boxel-environment/SKILL.md)** — Driving the live Boxel app: switch-submode, host commands, search-cards, indexing.
- **[`catalog-listing/`](skills/catalog-listing/SKILL.md)** — Catalog use / install / remix / update operations, plus submission through `SubmissionWorkflowCard`.
- **[`boxel-create-edit-cards/`](skills/boxel-create-edit-cards/SKILL.md)** — Thin pointer to `boxel-environment/references/card-tool-selection.md` (host-command combos for card create/edit).

### Patterns

- **[`boxel-patterns/`](skills/boxel-patterns/SKILL.md)** — Outcome-indexed catalogue of working examples. Ready patterns and planned backlog are kept separate. Two reference docs at this level:
  - [`references/integration-surfaces.md`](skills/boxel-patterns/references/integration-surfaces.md) — capability cheatsheet (what cards can reach for: base APIs, host commands, AI services, BFM, boxel-cli, etc.).
  - [`references/libraries.md`](skills/boxel-patterns/references/libraries.md) — import-path catalogue (where each symbol comes from).

## Conventions

- **Theme first.** Before writing a new card, decide how it gets a theme: per-instance via `cardInfo.theme`, OR a computed `cardTheme` on the CardDef (inherit from a linked card like `this.project.cardTheme`, query for a "default" Theme in the realm, derive by tag/category, etc.). Templates always reference `var(--*)` tokens. See pattern `theme-first-workflow`.
- **`cardInfo.theme` is the per-instance override.** When set, it wins over whatever the CardDef's computed `cardTheme` would have returned. When the CardDef does NOT override `cardTheme`, `cardInfo.theme` is how a theme installs at all — but a Task that inherits its Project's theme doesn't need it on every Task instance.
- **Override `cardTitle` when there's a primary field.** Respect `cardInfo.name` first, then fall back to the primary field, then to `Untitled <DisplayName>`. See pattern `cardinfo-override-title`.
- **Build a Home app whenever you ship a card family.** When the realm contains 2+ related CardDefs (Project + Task + Person; Meet + Swimmer + Club + Result; Show + Listing + Venue), ship a `Home` CardDef alongside them: `prefersWideFormat = true`, brand masthead, one `@context.searchResultsComponent` section per CardDef in the family. The user lands there and sees the realm at a glance — no manual indexing required. See pattern [`app-card-home-with-search`](skills/boxel-patterns/patterns/app-card-home-with-search/README.md). Skip only for single-card utilities.
- **Lint is mandatory for Boxel code work** (Cardinal Rule 9): `npx boxel file lint <path> --realm <url> --file <local-file>` before push, `npx boxel lint <path> --realm <url>` after. Prefer `npx boxel` over bare `boxel` (stale shims); there is no `npx boxel check`. Commands, clean-output criteria, and the no-shell assistant variant: [`lint-workflow.md`](skills/boxel/references/lint-workflow.md).
- **Public-repo path hygiene.** This workspace is a public repo. Never commit absolute local filesystem paths, local usernames, or machine-specific checkout paths into tracked docs, scripts, generated bundle comments, or learning notes. Use placeholders (`/path/to/boxel`, `/path/to/bxl`, `[local checkout]`) or env vars (`BOXEL_MONOREPO`). Local paths are fine in transient shell commands, not in persisted files.
- **Don't reach for `cancel-indexing`.** Slow indexing is not stuck indexing. Sample the indexed-card count for 5+ minutes; rising = leave it alone. `cancel-indexing --cancel-pending` discards the realm's queued TODO list and makes things worse. Last-resort recovery: `boxel file touch <one card>` → base `cancel-indexing` (never `--cancel-pending`) → `full-reindex-realm`. See [`skills/boxel-environment/references/indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md).
- **Fresh-realm push semantics.** `boxel realm push` of 30+ files via `/_atomic` can silently drop indexing jobs even when the push reports success. For > 50 instances, push kit-by-kit and verify each batch indexes (`npx boxel search` returns the expected count) before pushing the next. See indexing-operations.md "Post-push verification gate" and "The `/_atomic` batch trap".
- **Never inline media/binary in card JSON** (Cardinal Rule 10). No `data:`/`blob:`/base64/media bytes in any string field or JSON attribute. Store media as a realm file via `linksTo(FileDef/ImageDef/PngDef)`; generated bytes go through `WriteBinaryFileCommand` first.
- **🔴 `DateField` value = `YYYY-MM-DD` (no `T`); `DateTimeField` value = ISO datetime with `T`** (Cardinal Rule 11). A mismatch passes lint and indexes, then crashes at render (`RangeError: Invalid time value`). `*At` suffix → DateTimeField; `*Date`/`*On`/`dob` → DateField. Details: [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md).
- **🚨 Never put an external URL in `relationships.<field>.links.self`** (Cardinal Rule 12) — the indexer fetches it expecting a card, the failed parse poisons the JSONB write, and the **whole realm's indexing transaction rolls back**. For external image URLs use the pair pattern `linksTo(ImageDef)` + `contains(UrlField)`; recipe in [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md) "Image fields — the URL/ImageDef pair pattern".
- **🚨 `linksToMany` JSON uses indexed top-level keys** (`"activityFeed.0": { "links": { "self": "../foo" } }`), never an array under `links.self` (Cardinal Rule 13). The array shape is rejected with `"instance ... is not a card resource document"`.
- **🚨 `linksTo` fields never appear in `attributes` — not even as `null`** (Cardinal Rule 14). A link lives under `relationships`, keyed by its field path (nested fields use dotted keys: `"cardInfo.theme"`); an empty link is `{ "links": { "self": null } }` or the key is omitted. A `null` attribute writes successfully — then every read of the instance fails with `linkTo field ... cannot deserialize non-relationship value null` until the raw JSON is repaired.
- **🚨 Any function a template *calls* must be an arrow-function property, never a class method** (Cardinal Rule 15). Glimmer invokes `(this.isActive note)` / `{{fn this.method}}` unbound, so a class method throws during render and **freezes the whole application** until reload; `{{on}}` handlers mask the same mistake by merely breaking one handler. Getters are safe — the template reads them off `this`. Details: [`boxel-workspace-cardinal-rules/SKILL.md`](skills/boxel-workspace-cardinal-rules/SKILL.md) #11.
- **A URL pointing at a realm resource is a link, never a string** (Cardinal Rule 16). If a field's value is the URL of a card instance or a realm file, model it as `linksTo` / `linksToMany` (a `FileDef` subtype for files) — never as `StringField`/`UrlField`. A string-typed realm URL bypasses the index (no invalidation, no broken-link detection, no traversal) and rots silently when the target moves. The complement of Cardinal Rule 12: external URLs never in relationships, realm URLs never in string attributes. Two carve-outs where a string is correct: a `FileDef`'s own `id`/`url`/`sourceUrl` descriptor fields, and a `hostRoutingRules` public nav path. Details: [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md) "Realm-resource URLs — always a relationship, never a string".
- **🚨 Building a kit is a sequential checklist with verification gates — lint is NOT the gate.** The seven gates, in order: (1) Stage-0 planning (thunk-by-default `() => Class` for kit-internal links; per-format content matrices), (2) import audit (base fields are **default** exports; never `ImageDef` from `@cardstack/base/image`), (3) CDN-verify every icon, (4) push per-file — no atomic batches on fresh realms (this is about `boxel realm push` from a shell; it is not a reason to write files one per turn — see below), (5) module-load probe (`get-card-type-schema` must return `status: ready`), (6) typed-search count gate (`boxel search` is the truth source, not lint), (7) render smoke test per CardDef. Exact commands and failure signatures: [`indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md).
- **Query traps that silently return zero rows** (Cardinal Rules 5–7): `filter: { type: ref }` to select all cards of a type — never a bare `{ on: ref }` (`on` only scopes predicates); custom sort fields require `on: ref`; build refs with `codeRef()` and import the `realmURL` Symbol from `@cardstack/runtime-common` (never `Symbol.for('realmURL')`). Details: [`query-systems.md`](skills/boxel/references/query-systems.md).
- **Format choice = who owns the cell size, not what the cell looks like.** `@format='embedded'` lets the child decide its height — use for lists, feeds, roster rows. `@format='fitted'` makes the child fill a parent-controlled box — use for uniform tile grids (portraits, calendar cells). Picking fitted for a list with short content leaves empty boxes below each row. The fix is the format choice, upstream of any CSS. See "Picking the format" in [`delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md).
- **Include `attributes.cardInfo` on instances when practical.** Even with all null values, the `cardInfo` object lets the user edit name/summary/theme later through the UI. It's required when the CardDef uses the default `cardTheme` pass-through AND you want a theme set per-instance.
- **Write all of a build's files in one reply.** Three cards means three SEARCH/REPLACE blocks in the same answer; the grouped apply runs them together, with the correctness check running once over the result. Each block must still match the attached file on its own, because the user can apply any single block alone. Finishing one file and handing back ends your turn, and nothing resumes the rest of your plan for you — a build announced as three files and delivered one per turn routinely stops after the first.
- Read before writing. Fetch a file’s current contents before a SEARCH/REPLACE edit so the SEARCH block matches exactly.
- Write every text file with SEARCH/REPLACE — `.gts`, `.json`, `.md`, `README` alike — adding `(new)` after the URL to create one. There is no file-writing tool; a tool call cannot stream, so the UI freezes through a long generation.
- One CardDef per file. FieldDefs and helpers can co-locate.
- Theme variables only — no hard-coded colors in templates. All colors live in the Theme card's `cssVariables`.
- Three formats minimum: every CardDef needs `isolated`, `embedded`, AND `fitted`.
- **Every user-facing card built from scratch goes through [`design-playbook.md`](skills/boxel/references/design-playbook.md).** Four stages: mockup with no variables → extract theme DNA → tokenize → derive fitted + embedded. Skip only for utility cards.
- **Card families (2+ related CardDefs) require Stage 0 planning artifacts before any real schema** — Goal · Brief · DataModelPlan · Sample Data · ASCII Layout · MicroMockups. Without them, fitted views come out pedestrian. See design-playbook.md "Stage 0" and pattern `build-planning-cards-trio`.
- **When embedding child cards via `<@fields.X @format='...' />`, read [`delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md) first.** The host injects CardContainer chrome the parent must own (via `:deep()`, the theme cascade, or `@displayContainer={{false}}`); the doc covers the four high-frequency traps — plural-field wrapper, atom chrome on dark backgrounds, stagger via CSS variables, and the binary divider strategy.
- **CQ fitted layout is mandatory for every `fitted` template.** Derive the visual layout from [`design-playbook.md`](skills/boxel/references/design-playbook.md) stage 4, then implement it with [`container-query-fitted-layout.md`](skills/boxel/references/container-query-fitted-layout.md). For standard compositions, prefer the `FittedCard` component from `@cardstack/boxel-ui/components` (implements the standard internally; tune via `--fc-*` variables). When hand-rolling: a single root `.fit` grid whose `@container` rules query the host-provided `fitted-card` size container (never create your own container on the root), container-query sub-formats, `pow()` typography variables, `minmax(0, 1fr)` body rows, and `min-height: 0` overflow discipline. Do not hand-roll fitted CSS without CQ.

---

> **Maintainer note (editing this repo, not building cards).** Skill guidance lives in two hand-maintained trees that nothing syncs: `skills/` (Claude Code plugin + boxel-cli) and `Skill/` (the in-app AI assistant's cards). A convention change must be authored into **both**, or the two harnesses drift. Interim until the assistant consumes skill markdown files directly ([CS-11809](https://linear.app/cardstack/issue/CS-11809)); see `README.md`.
