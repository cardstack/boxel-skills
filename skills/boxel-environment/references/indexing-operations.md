---
name: indexing-operations
description: Realm reindexing and indexing-job control commands.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/run-realm-code'
        name: default
---

# Indexing Operations

Indexing reads realm content and updates the search/query index used by Boxel.

In the app, each operation below is a `realm.index` call in a `run-realm-code` script that runs in the target realm ([`source-code-editing`](../../source-code-editing/SKILL.md)). Each call starts the work on the realm server and returns at once; it does not wait for indexing to finish. A full reindex and a cancel run only after the user clicks to approve the run. This skill declares the `run-realm-code` tool; the sandbox rules for the script are in `source-code-editing`. Each call returns a small object when the realm server accepted the request, and throws with the server's error when it did not. Return that object from the script to see it.

## Invalidate Specific Resource Identifiers

Use this when a user wants specific files re-indexed for a realm. The user may ask that the card be refreshed or reloaded when they want a card to be re-indexed.

### Preconditions
- User has `write` access to the target realm.
- The script runs in the target realm.
- The paths name the specific files to index again: a path or an array of 1 to 100 paths, relative to the realm root.

### Behavior
- Queues incremental indexing for the given files.
- Returns `{ invalidated: [paths] }`, the paths relative to the realm root.
- Use this to target specific files instead of canceling or starting broader indexing work.
- One call accepts up to 100 paths.

### Call

```js
return await realm.index.invalidate(['Pet/mango.json', 'pet.gts']);
```

## Reindex Realm

Use this when a user wants to reindex a realm using the normal, lighter/default mode.

### Preconditions
- User has `write` access to the target realm.
- The script runs in the target realm.

### Behavior
- Republishes a from-scratch indexing job in the lighter/default mode.
- Use this when the user wants to pick up normal recent changes or refresh a realm.
- This is broader than `realm.index.invalidate` and lighter than a full reindex.
- Returns `{ reindex: 'started' }`.

### Call

```js
return await realm.index.reindex();
```

## Full Reindex Realm

Use this when a user wants a full rebuild of a realm index.

### Preconditions
- User has `write` access to the target realm.
- The script runs in the target realm.

### Behavior
- Forces a full realm reindex so every file is revisited.
- Use this when the user suspects indexing drift, stale results, or wants a deep/full refresh.
- This is heavier than `realm.index.reindex()`.
- Returns `{ fullReindex: 'started' }`.

### Call

```js
return await realm.index.fullReindex();
```

## Cancel Running Indexing Job

Use this when a user asks to stop indexing for a specific realm.

### Preconditions
- User has `write` access to the target realm.
- The script runs in the target realm.

### Behavior
- Cancels currently running jobs in concurrency group `indexing:<realmUrl>`.
- Includes both from-scratch and incremental indexing jobs.
- Does not cancel pending indexing jobs: they stay queued and run after it.
- Returns `{ cancelled: true }`, also when no job was running.

### Call

```js
return await realm.index.cancelJob();
```

## Post-push verification gate

After any multi-file push, climb the ladder in "Verifying a change landed" below — **push success does not mean index success.** The count probe for its rung 5:

```sh
# Expected card instances under a kit (skip .gts modules, _learnings, Theme JSON)
expected=$(find <kit-dir> -name "*.json" -not -path "*/Theme/*" -not -name "_*" | wc -l)
# Currently indexed CardDef instances
indexed=$(npx boxel search --realm <url> --query \
  '{"filter":{"type":{"module":"@cardstack/base/card-api","name":"CardDef"}}}' --json \
  | jq '.data | length')
echo "$indexed / $expected indexed"
```

Sample at 30-second intervals for 5 minutes. Rising count = just slow, leave it alone. Flat count = stuck. Far below expected once the queue has drained = files that never indexed; `indexing-errors` lists failed attempts only, so find them by diffing `npx boxel file ls` against the typed search.

## The `/_atomic` batch trap

Pushing 30+ files via `npx boxel realm push <dir>` uses the `/_atomic` HTTP endpoint. Failure modes observed on an earlier server build (re-measure before relying on the figures):

- **351 files at once** → 500 Internal Server Error; push reports failure.
- **30-44 files per atomic batch** → push reports success, but a fraction of indexing jobs are silently dropped. Cards land on disk but never index.
- **Per-file `npx boxel file write`** → reliably enqueues an index job per file.

**Recommended push cadence for a fresh realm with > 50 instances:**

1. Push one CardDef family at a time (its `.gts` modules + Theme + a small batch of instances).
2. Verify with the post-push gate above before pushing the next.
3. If you split a push, push the modules' chunk first. Within one `realm push` (or `realm sync`, which uses the same single `/_atomic` call) the realm already orders modules ahead of instances.
4. Fall back to `npx boxel file write <path>` for the last few stragglers a batch may have dropped.

## Don't reach for `cancel-indexing`

`npx boxel realm cancel-indexing` (from a terminal) and `realm.index.cancelJob()` (in the app) interrupt work the realm is actively doing. `--cancel-pending`, which only the CLI has, is sharper — it discards the realm's queued TODO list. Both leave the index in a worse state when used to "recover from slow."

**Default behavior:** don't cancel (with or without flags). Slow is not stuck. Sample the indexed count for 5+ minutes; rising = leave it alone.

If the count is genuinely flat for 10+ minutes with no progress at all:

1. First nudge a single card through: `npx boxel file touch <one card>` from a terminal, or `realm.index.invalidate('<one card>.json')` in the app. If that one indexes, the queue is alive.
2. Only after that fails should you consider a cancel — `cancel-indexing` in its base form only, never `--cancel-pending`, or `realm.index.cancelJob()` in the app.
3. A full reindex is the right way to rebuild from scratch — it doesn't need a cancel first. In the app, that is `realm.index.fullReindex()`; from a terminal, the `full-reindex-realm` row below.

## Inspecting indexer errors

The realm stores each file's latest indexing attempt, including its error. Endpoints + tools:

| Need | How |
|---|---|
| Compile errors per .gts | `npx boxel file lint <path> --realm <url> --file <local-path>` |
| Try to load a card TYPE | `npx boxel run-command @cardstack/boxel-host/tools/instantiate-card/default --realm <url> --input '{"moduleIdentifier":"<module-url>","cardName":"<ClassName>","realmIdentifier":"<url>"}'` |
| Force reindex of one card | `npx boxel file touch <path> --realm <url>` |
| Force reindex of whole realm | In the app: `realm.index.fullReindex()` in a `run-realm-code` script. From a terminal only: `npx boxel run-command @cardstack/boxel-host/tools/full-reindex-realm/default --realm <url> --input '{"realmIdentifier":"<url>"}'` |
| List every file whose latest attempt failed | `npx boxel realm indexing-errors --realm <url> [--json]` (see rung 4 below) |

### Postgres `\u0000` symptom

If a card URL returns 500 with `code: "22P05"` and `detail: "\u0000 cannot be converted to text"`, the indexer crashed mid-process and cached an error message containing invalid UTF-8 bytes into the postgres JSON column. The card's JSON file is usually clean — the bad bytes came from a downstream resolver (FileDef fetch, compiled-module cache, error-message serialization). Recovery escalation:

1. `npx boxel file touch <the-card-path>` — forces a fresh reindex of that card.
2. `npx boxel file write <the-card-path> --realm <url> --file <local>` — re-pushes the local file.
3. `npx boxel file touch <the-card's-.gts-module>` — forces recompile of the type.
4. Full realm reindex.

## Verifying a change landed

Push success is not index success, and lint is advisory. Climb in order; no rung vouches for the ones above it.

1. **Bytes landed** — `npx boxel file read <path>` matches the local file.
2. **Compiles** — `npx boxel lint <path> --realm <url>`; the `get-card-type-schema` probe below proves the module evaluates.
3. **Queue drained** — `npx boxel realm wait-for-ready --realm <url> --timeout 180000`: no queued or running index-writing job from anyone, not a health check. Batch writes, wait once, never loop.
4. **Indexing errors** — `timeout 120 npx boxel realm indexing-errors --realm <url>`: waits unbounded for a running pass but not for queued work, so run it after rung 3; a timeout is no answer (`timeout` is GNU coreutils: on macOS use `gtimeout` from Homebrew `coreutils`, or stop it by hand after 2 minutes); findings are each file's latest attempt.
5. **Indexed content** — typed `npx boxel search --json` (count, `attributes`, `included`). Search never waits for your write; identical bytes queue nothing, so force a re-index with `npx boxel file touch <path>`.
6. **Renders** — open the card (`show-card`, `instantiate-card`, `boxel test`). The indexer renders each format once, headless, without interaction; only this proves a card. Still erroring after a module fix: touch the instance, reopen.

Required gate (rungs 2 and 5) before declaring "kit shipped":

```sh
REALM="<realm-url>"

# 1. Module load probe — exercise every CardDef
for mod in style material designer client project quote; do
  npx boxel run-command @cardstack/boxel-host/tools/get-card-type-schema/default \
    --realm "$REALM" \
    --input "{\"codeRef\":{\"module\":\"${REALM}${mod}\",\"name\":\"<ClassName>\"}}" \
    --json | grep -E "status|error"
done

# 2. Index population — count actual indexed cards per type. ABSOLUTE URLs only.
for type_pair in "style:Style" "material:Material" "project:Project"; do
  mod="${type_pair%:*}"
  name="${type_pair#*:}"
  count=$(npx boxel search --realm "$REALM" \
    --query "{\"filter\":{\"type\":{\"module\":\"${REALM}${mod}\",\"name\":\"${name}\"}}}" \
    --json | python3 -c "import json,sys;raw=sys.stdin.read();s=raw.find('[');e=raw.rfind(']')+1;print(len(json.loads(raw[s:e])))")
  echo "$name: $count"
done

# 3. fs vs index parity — every file on disk should be indexed
diff <(ls Project/*.json | wc -l) <(... search count ...)
```

If any module returns error from step 1 OR if step 2 returns 0 anywhere there should be instances, **the kit is NOT shipped** regardless of what lint says.

### Why lint can pass while indexing fails

Module load failures happen at JavaScript module evaluation time inside the realm-server. Lint runs static checks on local files OR boxel-specific checks against realm config. Neither runs the module's `<static_initializer>` blocks (which decorate fields, declare types, and execute thunks). Common failures that lint misses:

- Named import where the module exports only a default (`import { DateField } from '.../date'` → DateField is undefined → cardOrThunk error)
- Default-import from a module whose default is a DIFFERENT class (`import ImageDef from '.../base/image'` → actually gets `ImageCard`)
- Thunk references a class that itself fails to load (cycle, wrong import, missing dependency)
- `computeVia` or `get`-method that throws at module-evaluation time
- A bare `linksTo(X)` without thunk in a kit with back-edges — X is not yet evaluated when the field decorator runs

Each passes `npx boxel file lint` clean. Each makes `npx boxel search` return empty for that type.

### Error-decoder — common runtime errors and their upstream cause

| Symptom | Where | Cause |
|---|---|---|
| `cardOrThunk was undefined. There might be a cyclic dependency...` | `get-card-type-schema` output, or an `indexing-errors` finding | A thunk dereferenced undefined. Either a named import doesn't exist on the source module, OR a cycle prevented the target class from being defined in time. |
| `Unexpected token (1:0)` from acorn's `parseExprAtomDefault` | Host (browser) loading a transpiled module | The realm couldn't compile the `.gts`; it returned HTML 500; the host's JS parser hit `<` at byte 0. Same upstream cause as cardOrThunk. Use `get-card-type-schema` to find which module. |
| `Export "X" not found in module "Y"` | `get-card-type-schema` probing a named export | The module doesn't export X (named). Probably a default-only export — switch to `import X from 'Y'`. |
| `Cannot resolve bare package specifier "X/Y"` | `LinksTo.deserialize` in card-api | An instance's `links.self` is a bare path. Must start with `./`, `../`, or be a full URL. |
| `Instance ... is not a card resource document` | `indexing-errors` finding | Almost certainly: `linksToMany` written as an array under `links.self` instead of indexed-key shape. |
| 403 Access Denied (XML body) from `boxel-icons.boxel.ai` | Host load | A phantom icon — present in workspace source files but never deployed. CDN-verify with curl before assigning. |

## Changing a schema while instances are live

- **Narrowing a `linksTo`/`linksToMany` type strands instances that already link the old type.** Opening one fails with `field validation error: tried set <Old> as field '<f>' but it is not an instance of <New>`; lint is silent and the index records no instance error (at most a `broken-link` on that field). Before retyping, find instances with that relationship set and, in the same change, relink each to the new type or clear it (`{ "links": { "self": null } }`).
- **A rename is add before remove.** Write the new module and the instances adopting it (a new folder is a new URL), update every referrer (`linksTo` targets miss as `broken-link` findings; `index.json` entries and string paths in modules miss silently), then delete the old. Grep for the old names and expect zero hits.

## Moving `.gts` files strands existing instances

When you rename or move a `.gts` file mid-session (e.g. `architecture-plan.gts` → `plan/architecture-plan.gts`), every existing instance that adopts from it still points at the OLD location via `meta.adoptsFrom.module`. The instances are stranded:

- Lint passes (the local JSON is structurally fine).
- Indexer fails silently — module resolves to a 404, instance never indexes as the expected type.
- `npx boxel search --query '{}'` shows the instance URL but with `adoptsFrom` pointing nowhere useful.
- A type-filtered search returns 0 even though instances appear to exist on disk.

The discipline: **before any `.gts` move or rename, grep `adoptsFrom.module` across instance JSONs in the realm and rewrite them atomically as part of the same change.**

```sh
# Find every instance referencing the about-to-be-moved module
grep -rl "\"module\":\s*\"\.\./architecture-plan\"" --include='*.json' .

# Rewrite atomically (example: move from root to plan/)
find . -name '*.json' -exec sed -i.bak \
  -e 's|"module": "../architecture-plan"|"module": "../plan/architecture-plan"|g' {} \;
```

Auto-generated stub instances (created by host "+ New" clicks, named with UUID) are common collateral here — they're in `<ClassName>/<uuid>.json` folders and easy to miss. Delete or rewrite them along with the move.

## Realm creation — local folder is NOT a realm

Creating a directory at `<realm-server>/<owner>/<slug>/` does NOT create a realm on the server. The server has no idea that path exists. Pushing files into it via `npx boxel file write` may appear to succeed (write to local mirror) but the realm doesn't index anything because there's no realm registered for that path.

**To create a realm:**

```sh
npx boxel realm create <slug> "<Display Name>"
```

This registers the realm with the user's Matrix account, creates the server-side database entry, and bootstraps the realm config. THEN local folders + file pushes make sense.

A clue that a realm doesn't exist: `npx boxel search --realm <url> --query '{}'` returns auth errors or empty results consistently. A clue that it DOES exist but is empty: the search returns just the `realm` config card.

## Host-only commands that can't run from the CLI

Some host commands require a browser context with a Matrix client to persist their results. Notable examples:

- **Image generation** — the AI assistant makes an image with `realm.images.generate` in a `run-realm-code` script (see `source-code-editing`). It runs only in the Boxel app, not from `npx boxel run-command`.
- Any command whose docstring mentions "saves the card" or "uploads to realm" with a browser-only auth dependency.

CLI-friendly commands (no browser dependency): `get-card-type-schema`, `full-reindex-realm`, `invalidate-realm-identifiers`, `search-cards`, `instantiate-card` for read-only schema introspection. `full-reindex-realm` and `invalidate-realm-identifiers` are for `npx boxel run-command` only; in the app they are not tools, and the same work is `realm.index.fullReindex()` and `realm.index.invalidate(paths)` in a `run-realm-code` script.
