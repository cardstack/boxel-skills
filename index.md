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

### Runtime

- **`boxel-environment/`** — Driving the live Boxel app: switch-submode, host commands, search-cards, indexing.
- **`catalog-listing/`** — Catalog use / install / remix / update operations, plus submission through `SubmissionWorkflowCard`.
- **`boxel-create-edit-cards/`** — Choosing the right host-command combination for card creation/editing.

### Patterns

- **`boxel-patterns/`** — Outcome-indexed catalogue of working examples. Ready patterns and planned backlog are kept separate. Two reference docs at this level:
  - `references/integration-surfaces.md` — capability cheatsheet (what cards can reach for: base APIs, host commands, AI services, BFM, boxel-cli, etc.).
  - `references/libraries.md` — import-path catalogue (where each symbol comes from).

## Conventions

- **Theme first.** Before writing a new card, decide how it gets a theme: per-instance via `cardInfo.theme`, OR a computed `cardTheme` on the CardDef (inherit from a linked card like `this.project.cardTheme`, query for a "default" Theme in the realm, derive by tag/category, etc.). Templates always reference `var(--*)` tokens. See pattern `theme-first-workflow`.
- **`cardInfo.theme` is the per-instance override.** When set, it wins over whatever the CardDef's computed `cardTheme` would have returned. When the CardDef does NOT override `cardTheme`, `cardInfo.theme` is how a theme installs at all — but a Task that inherits its Project's theme doesn't need it on every Task instance.
- **Override `cardTitle` when there's a primary field.** Respect `cardInfo.name` first, then fall back to the primary field, then to `Untitled <DisplayName>`. See pattern `cardinfo-override-title`.
- **Build a Home app whenever you ship a card family.** When the realm contains 2+ related CardDefs (Project + Task + Person; Meet + Swimmer + Club + Result; Show + Listing + Venue), ship a `Home` CardDef alongside them: `prefersWideFormat = true`, brand masthead, one `@context.searchResultsComponent` section per CardDef in the family. The user lands there and sees the realm at a glance — no manual indexing required. See pattern [`app-card-home-with-search`](skills/boxel-patterns/patterns/app-card-home-with-search/README.md). Skip only for single-card utilities.
- **Lint is mandatory for Boxel code work.** Before reporting `.gts` work done, run the installed npm `@cardstack/boxel-cli` lint gate: `npx boxel file lint <path> --realm <url> --file <local-file>` before push and `npx boxel lint <path> --realm <url>` after push. **Prefer `npx boxel`** over a bare `boxel` — a stale global v0.0.1 shim at `/usr/local/bin/boxel` often shadows the working 0.2.0+ install. `boxel check` is sync-state only, not lint. Clean means `No lint issues found` or JSON `messages: []`. See [`skills/boxel/references/lint-workflow.md`](skills/boxel/references/lint-workflow.md).
- **Public-repo path hygiene.** This workspace is a public repo. Never commit absolute local filesystem paths, local usernames, or machine-specific checkout paths into tracked docs, scripts, generated bundle comments, or learning notes. Use placeholders (`/path/to/boxel`, `/path/to/bxl`, `[local checkout]`) or env vars (`BOXEL_MONOREPO`). Local paths are fine in transient shell commands, not in persisted files.
- **Don't reach for `cancel-indexing`.** Slow indexing is not stuck indexing. Sample the indexed-card count for 5+ minutes; rising = leave it alone. `cancel-indexing --cancel-pending` discards the realm's queued TODO list and makes things worse. Last-resort recovery: `boxel file touch <one card>` → base `cancel-indexing` (never `--cancel-pending`) → `full-reindex-realm`. See [`skills/boxel-environment/references/indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md).
- **Fresh-realm push semantics.** `boxel realm push` of 30+ files via `/_atomic` can silently drop indexing jobs even when the push reports success. For > 50 instances, push kit-by-kit and verify each batch indexes (`npx boxel search` returns the expected count) before pushing the next. See indexing-operations.md "Post-push verification gate" and "The `/_atomic` batch trap".
- **Never inline media/binary in card JSON.** No `data:`, `blob:`, base64, image bytes, MP3 bytes, or generated media payloads in `StringField`, `outputText`, notes, or JSON attributes. Store media as a realm file (`linksTo(FileDef/ImageDef/PngDef/etc.)`); for generated bytes, use `WriteBinaryFileCommand` first and render from the linked file URL.
- **🔴 `DateField` vs `DateTimeField` — schema MUST match value shape.** `contains(DateField)` requires JSON value `YYYY-MM-DD` (no `T`). `contains(DateTimeField)` requires `YYYY-MM-DDTHH:MM:SS[.sss]Z` (must contain `T`). A mismatch passes lint, writes successfully, and indexes — then crashes at render time as `RangeError: Invalid time value` from date-fns `Contains.serialize`. The mismatch is invisible to every static check; only the host runtime catches it. Pick the type by whether time-of-day is meaningful (`*At` suffix → DateTimeField; `*Date`/`*On`/`hireDate`/`dob` → DateField), then keep instance values in lockstep. See [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md) "DateField vs DateTimeField — the schema-vs-value contract".
- **🚨 External URLs in JSON:API `relationships.<field>.links.self` BRICK the entire realm.** A relationship's `links.self` is for card identifiers (relative paths like `"../Theme/foo"` or realm URLs). **Never put an external image/asset URL there.** The indexer fetches the URL expecting a card, gets binary bytes, `JSON.parse` fails, the error message contains the binary's NULL byte, postgres rejects the JSONB write (`22P05`), and the **entire indexing transaction rolls back** — every other card in the batch is lost. One bad instance brings down the whole realm until manually fixed. For image URLs, use the `cardInfo` pair pattern from `base/card-api.gts`: `@field heroImage = linksTo(ImageDef)` AND `@field heroImageURL = contains(UrlField)` (UrlField from `https://cardstack.com/base/url`, NOT `MaybeBase64Field` and NOT `StringField`); put external URLs in `attributes.heroImageURL`, never in the relationship. Template resolves: URL first, linked ImageDef as fallback. See [`base-field-catalog.md`](skills/boxel/references/base-field-catalog.md) "Image fields — the URL/ImageDef pair pattern".
- **🚨 `linksToMany` JSON shape uses INDEXED KEYS, not an array.** Each linked item in a `linksToMany` field is its own top-level relationship key: `"activityFeed.0": { "links": { "self": "../foo" } }`, `"activityFeed.1": { "links": { "self": "../bar" } }`. The intuitive-but-wrong array shape — `"activityFeed": { "links": { "self": ["...", "..."] } }` — causes the host to reject the instance with `"instance ... is not a card resource document"` and the card never loads. JSON:API spec says `links.self` is a single string; Boxel encodes "many" as indexed top-level keys.
- **🚨 Building a kit is a sequential checklist with verification gates. Lint is NOT the gate.** Following the checklist costs ~3 min per CardDef; skipping any step costs 20-40 min of reactive debug each.
  1. **Stage 0 planning** (Goal · Brief · DataModel · Sample · ASCII · MicroMockups) — mandatory for 2+ CardDef families. **DataModelPlan marks every kit-internal `linksTo`/`linksToMany` for `() => Class` thunk-by-default** (bare form fails at runtime with `cardOrThunk was undefined`, invisible to lint and TS). **MicroMockups specs a content matrix per CardDef per format** (isolated / embedded / fitted-at-each-CQ-size / atom / edit) — what fields appear, what wording register, what's hidden. Without content matrices, fitted/embedded/atom render as data-empty.
  2. **Per-CardDef imports** — match each named import to what the source module actually exports. Base fields (`StringField`, `NumberField`, `DateField`, `MarkdownField`, `UrlField`, etc.) are **DEFAULT** exports from their own modules; named-importing them resolves to `undefined`. `ImageDef` has both forms — named from `/base/card-api` or default from `/base/image-file-def`. **NEVER** `import ImageDef from 'https://cardstack.com/base/image'` — that module's default is `ImageCard` (deprecated, wrong class), aliased locally.
  3. **Per-CardDef icon — CDN-verify before assigning.** `curl -s -o /dev/null -w "%{http_code}" https://boxel-icons.boxel.ai/@cardstack/boxel-icons/v1/icons/<name>.js` must return 200. Source-file grep is NOT proof. Phantom icons compile clean and 403 at render.
  4. **Push per-file** (`npx boxel file write`), no atomic batches on fresh realms (drops indexing jobs silently).
  5. **Module-load probe** AFTER push, not lint: `npx boxel run-command @cardstack/boxel-host/commands/get-card-type-schema/default --realm <url> --input '{"codeRef":{"module":"<absolute-url>","name":"<Class>"}}' --json` must return `status: ready`. `cardOrThunk was undefined` → bad import or unresolved cycle.
  6. **Typed-search gate**: `npx boxel search --realm <url> --query '{"filter":{"type":{"module":"<absolute-url>","name":"<Class>"}}}' --json` count must match fs file count. `boxel search` is the truth source; `boxel file lint` returning clean while the index is empty has happened repeatedly. Use absolute module URLs in queries — relative paths don't resolve from CLI.
  7. **Render smoke test** in the host UI per CardDef before claiming done. The earlier gates don't catch template-render failures (missing fields, broken CQ layout, empty content).

  See [`skills/boxel-environment/references/indexing-operations.md`](skills/boxel-environment/references/indexing-operations.md) for the verification hierarchy.
- **Query traps that silently return zero rows.** Three rules you must hold simultaneously or your queries fail invisibly (see [`query-systems.md`](skills/boxel/references/query-systems.md)):
  1. **`filter: { type: ref }` to select all cards of a type — NEVER `filter: { on: ref }`.** `on` is a *scope* for predicates (`eq`/`contains`/`range`), not a filter by itself. A bare `{ on: ref }` returns zero rows.
  2. **Custom sort fields require `on: ref`.** Only `lastModified`, `createdAt`, `cardURL` work without it. Sorting by `lastName`, `dates.start`, etc. without `on` is rejected.
  3. **Build refs with `codeRef(here, path, name)` from `@cardstack/runtime-common`.** Import `realmURL` as a Symbol from the same module — don't use `Symbol.for('realmURL')` (different Symbol, doesn't match what the host injects).
- **Format choice = who owns the cell size, not what the cell looks like.** `@format='embedded'` lets the child decide its height — use for lists, feeds, roster rows. `@format='fitted'` makes the child fill a parent-controlled box — use for uniform tile grids (portraits, calendar cells). Picking fitted for a list with short content leaves empty boxes below each row. The fix is the format choice, upstream of any CSS. See "Picking the format" in [`delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md).
- **Include `attributes.cardInfo` on instances when practical.** Even with all null values, the `cardInfo` object lets the user edit name/summary/theme later through the UI. It's required when the CardDef uses the default `cardTheme` pass-through AND you want a theme set per-instance.
- Read before writing. Many `.gts` files have edit-tracking markers; reading first preserves them.
- Use SEARCH/REPLACE for `.gts` edits. `write-text-file` is forbidden for `.gts` (UI freezes; tool calls don't stream).
- One CardDef per file. FieldDefs and helpers can co-locate.
- Theme variables only — no hard-coded colors in templates. All colors live in the Theme card's `cssVariables`.
- Three formats minimum: every CardDef needs `isolated`, `embedded`, AND `fitted`.
- **Every user-facing card built from scratch goes through `design-playbook.md`.** Four required stages: (1) mockup with no variables, (2) extract theme DNA, (3) tokenize, (4) derive fitted + embedded. The verbatim Pentagram-art-director / internal-taste-maker framing is the stage-1 brief. See [`skills/boxel/references/design-playbook.md`](skills/boxel/references/design-playbook.md). Skip only for utility cards (lookup tables, internal config); apply to anything a user will see.
- **For card families (2+ related CardDefs), Stage 0 planning artifacts are MANDATORY before any real schema is written.** Produce: Goal · Brief (what makes it unique for users) · DataModelPlan (ASCII data-flow + schema sketch) · Sample Data (3-5 real dossiers per CardDef) · ASCII Layout (box layout per format) · MicroMockups (desktop + mobile, all responsive in `isolated` AND `edit`). Without stage 0, fitted views come out pedestrian because the data model isn't rich enough to compose with. Each artifact can ship as a CardDef whose `static isolated` IS the plan document — see `app.boxel.ai/.../actual-duck-82` for the source pattern (architecture-plan.gts, data-model-plan.gts, micro-mockups.gts).
- **When embedding child cards via `<@fields.X @format='...' />`, read `delegated-render-control.md`.** The host injects a CardContainer wrapper with chrome (rounded corners, background, padding, halo). The parent overrides via `:deep()` from scoped CSS, the theme cascade, or `@displayContainer={{false}}`. Skipping this is why embedded children look "pasted on" instead of native to the parent. See [`skills/boxel-ui-guidelines/references/delegated-render-control.md`](skills/boxel-ui-guidelines/references/delegated-render-control.md). High-frequency traps the doc covers:
  1. **Plural-field wrapper.** `<@fields.plural @format='...' />` inserts `.plural-field` + per-item wrappers between your grid and the cards. Target `:deep(> .plural-field)` AND `:deep(.linksToMany-itemContainer), :deep(.containsMany-item)` with `display: contents`. Using only `:deep(> .containsMany-field)` silently misses `linksToMany`.
  2. **Atoms on dark backgrounds.** Default atom chrome has a near-white background. `color: inherit` doesn't override the chrome's own surface. Use `@displayContainer={{false}}` to strip the chip, or recolor the chrome explicitly.
  3. **Stagger via CSS variables.** `:nth-child` on `.field-component-card` doesn't work — it's wrapped in a per-item container, always `:nth-child(1)`. Set `--stagger-d` on the wrapper's `:nth-child(N)`; the inner card reads it via `animation-delay`.
  4. **Divider strategy is binary.** Pick parent-draws-lines (and kill `:deep(.boxel-card-container--boundaries) { box-shadow: none; }`) OR child-halo-as-boundary (no parent borders). Doing both produces the "drop shadow fighting a thin border" double rule.
- **CQ fitted layout is mandatory for every `fitted` template.** Derive the visual layout from `design-playbook.md` stage 4, then implement it with `skills/boxel/references/container-query-fitted-layout.md`: the two-element `.cq` → `.fit` structure, container-query sub-formats, `pow()` typography variables, `minmax(0, 1fr)` body rows, and `min-height: 0` overflow discipline. Do not hand-roll fitted CSS without CQ.
