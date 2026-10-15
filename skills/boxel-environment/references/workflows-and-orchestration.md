## Orchestration Patterns

### 1. Smart Code Refactoring
```json
`run-realm-code` that returns `await realm.fs.readText('card.gts')`
→ Prompt "improve code structure"
→ Emit a code patch `run-realm-code` tool call
```

### 2. Data-Driven Schema Generation
```json
`run-realm-code` that returns `await realm.fs.readText('data.csv')`
→ Prompt "generate CardDef from CSV"
→ Emit a code patch `run-realm-code` tool call
```

### 3. Live Preview Development
```json
`run-realm-code` that returns `{ show: 'Card/instance' }`
→ Prompt "enhance UX for this card"
→ Emit a code patch `run-realm-code` tool call whose script ends with `return { show: 'Card/instance' };`
```

### 4. Bulk Relationship Mapping
```json
`run-realm-code` that returns `(await realm.cards.search(query)).cards`, with a query that includes a filter
→ Prompt "detect relationship patterns"
→ One `run-realm-code` script that searches again and edits each card's `.json` links with `realm.fs.replace` (at most 20 files per run; split above that)
```

### 5. Context-Aware Migration
```json
`run-realm-code` that returns `await realm.fs.readText('schema.gts')`
→ `run-realm-code` that returns `(await realm.cards.search(query)).cards.map((card) => card.path)`, with a query that has a filter
→ One `run-realm-code` script that writes the schema change and loops over the search results with `realm.cards.update` (see Schema Migration below)
```

### 6. Dependency Surfing
```json
`run-realm-code` that returns `{ definition: await realm.fs.readText('card.gts'), instance: await realm.fs.readText('Card/instance.json') }`
→ `run-realm-code` that returns `(await realm.cards.search({ filter: { contains: { imports: 'card' } } })).cards.map((card) => card.path)`
→ Emit a code patch `run-realm-code` tool call
```

### Code Generation
Two replies at most. First reply: a `run-realm-code` call that returns `await realm.fs.readText(path)` for the file, so the `realm.fs.replace` search text matches its current content (skip this when you already have the content). Second reply, right after the result: one line of prose, then the `run-realm-code` call; if the user should see the result, the script ends with `return { show: path }` for the instance.

Opening the file in code mode is optional navigation for the user's benefit — at most once per task, with `realm.ui.openFile(path)` in the same `run-realm-code` script, and only when the tab is not already in code mode on that file. It is never a step of writing, and it never needs a call of its own.

### Card Creation
One `run-realm-code` call that writes every file with `realm.fs.writeText` — the definition and every instance together — and, if the user should see a card, ends with `return { show: path }` for one instance, such as `return { show: 'Pet/mango' };`. That call creates the files and opens the card; no mode switch and no placeholder call comes first. If the user should see a file in code mode instead, the same script calls `realm.ui.openFile(path)`.

### Search & Modify
One `run-realm-code` script that finds the cards with `realm.cards.search(query)` and changes each one with `realm.cards.update(card.path, attributes)`, returning the paths it changed. A run updates at most 200 cards; for more, split the work across calls by `page.number`. For a change to links or to the shape of the JSON, edit each file with `realm.fs.replace(card.path, …)` instead; a run edits at most 20 files.

### Schema Migration
1. Change the schema with `realm.fs.replace` on the `.gts` in a `run-realm-code` script.
2. In the same script or the next one, find the affected instances with `realm.cards.search` and fix each one:
   - New values for fields that stay (a default, a value derived from other fields): `realm.cards.update(card.path, attributes)` in a loop. The script computes each value with plain JavaScript; no migration command is needed.
   - A renamed or removed field: `realm.cards.update` merges and cannot remove a key, so edit each `.json` with `realm.fs.readText` and `realm.fs.replace`.
3. Return the paths the script changed, and say how many are left when the work was split.

### Multi-Realm Operations
A `run-realm-code` script reads and writes only the realm it runs in. To move a definition or a card to another realm:
```json
`run-realm-code` in the source realm that returns `await realm.fs.readText(path)` for each file
→ `run-realm-code` in the target realm that writes each file with `realm.fs.writeText`, with relative imports and `adoptsFrom` changed to absolute URLs where they point back to the source realm, and with any changed field values already in the JSON it writes
```

### Optimistic Command Pipeline
Use for LLM, image generation, imports, diagnostics, or any workflow where user-visible progress should not wait for every realm save/index cycle.

```json
Card component action
→ resolve `toolContext` and current `realmURL`
→ create one typed Run/Job card with steps, logs, status, prompt/model/input snapshot
→ queue `SaveCardCommand` through an OptimisticSave helper
→ mutate the same run card for each stage and queue progress saves
→ await only external calls or file/binary persistence
→ save terminal completed/failed state
→ `settle()` queued saves and surface late failures in the UI log
```

Rules:
- Keep the run card compact and queryable. Prefer one run card with `containsMany` steps/logs over many transient cards.
- Do not hide side effects in bxl, Guides, or computed fields. Commands and command-backed component actions own writes, external calls, and user asks.
- For AI/image work, store the model id, prompt snapshot, source card URL, finish reason, latency, output URL, and error state on the run card.
- In card code, prefer host commands for IO. Direct `fetch` needs a documented runtime gap and a source comment.
- Source pattern: see ready pattern `command-optimistic-pipeline` (`optimistic-save.gts`, `demo-pipeline.gts`, `image-gen.gts`, `bench.gts` are the historical inspiration; ask the user for current realm URLs if you need to read them).

### Parallel agents in one realm — tracking convention

When more than one agent is building inside the same realm, **keep a small markdown tracking doc inside the realm itself** and sync it periodically with finished work. List what changed, what's been verified in browser QA, what still needs testing, and any notable skill/API learnings discovered during the session.

Why it matters:

- The user can inspect progress through `boxel-cli` (or in the live host) during a long build instead of waiting for a final summary.
- It reduces coordination drift between parallel agents by making the current source of truth visible in the same place as the cards, commands, files, and instances being built.
- It survives session boundaries. If a parallel agent reads the tracking doc on session start, they see what's already done.

Format suggestion: a single `TRACKING.md` at the realm root with sections for *Cards landed*, *Cards in progress*, *Verified*, *Pending QA*, *Learnings*. Sync after every significant landing.

### Transient `npx boxel search` failures during indexing

`npx boxel search --realm <url>` can briefly return `Realms not found` even when the realm is healthy — typically right after a new card/instance landing, while the realm-server's federated-search registration / index settles. `npx boxel file read` and `npx boxel realm wait-for-ready` may both report healthy while `npx boxel search` still 4xxs.

Don't treat the transient as proof your query syntax is wrong. Recovery sequence:

1. Read the relevant files back with `npx boxel file read` to confirm they're really in the realm.
2. `npx boxel realm wait-for-ready --realm <url>` until the realm reports ready.
3. Validate through a host-rendered result-list card when possible (`@context.searchResultsComponent`) — that path exercises the indexer differently than the federated-search CLI route.
4. Retry `npx boxel search` after the realm has indexed.

If the transient recurs while parallel agents are landing into the same realm, record it in the tracking doc (above) so other agents don't rewrite valid query syntax chasing a state issue.
