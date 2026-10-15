# Card Tool Selection — Create, Edit, Update

Which `realm.*` call creates a card or edits an existing instance. Every call here runs inside a `run-realm-code` script; `source-code-editing` has the full API and its limits. This expands Step 4 (Data task) of the master decision tree in `../SKILL.md`.

| Call | Use when | Don't use when |
|------|----------|----------------|
| `realm.fs.writeText(path, content)` | Any new file: a `.gts` definition or a `.json` instance | The file exists (it refuses) |
| `realm.cards.update(path, attributes)` | Change field values of an existing instance, short or long (a markdown field of any length) | Links, or a card that does not exist yet |
| `realm.cards.search(query)` + `realm.cards.update` | The same change on many instances, in a loop in one script | — |
| `realm.fs.replace(path, exactCurrentText, replacement)` | Source (`.gts`), links (`relationships`), or JSON that is malformed or must change shape | Field values that `realm.cards.update` can set |
| `realm.fs.readText` + `realm.fs.writeText` | Clone a card: read its `.json`, change it, write it at a new path | — |
| `realm.cards.get(path)` | Read an instance's indexed data, computed fields included | Before `realm.fs.replace` (read the file with `realm.fs.readText`) |

`realm.cards.update` merges `attributes` into the card's current values: a nested object merges, an array or any other value replaces the old one. Its saves wait until the script finishes and then go in one request, all or none, so a script that throws saves no update. It refuses a `realm.fs` call on a card that has a pending update in the same run.

## Quick Decision

```
Card doesn't exist yet?
├─ New .gts file → `realm.fs.writeText`
├─ New .json instance → `realm.fs.writeText`
└─ Clone + modify → `realm.fs.readText` the source, then `realm.fs.writeText` the copy

Card already exists?
├─ Update field values → `realm.cards.update`
├─ Same update on many cards → `realm.cards.search`, then `realm.cards.update` in a loop
├─ Change links → `realm.fs.replace` on the `.json`
└─ Edit .gts or JSON structure → `realm.fs.replace`
```

## Conventions

- **File naming:** Definitions: `kebab-case.gts` | Instances: `PascalCase/slug.json` | Links: `BlogPost/my-post` (no `.json`)
- **Path rules:** Use `./`, `../` relative paths for same-realm `adoptsFrom`. Use absolute URLs for cross-realm. After copy/move, verify linkage!

## Pair with

- `source-code-editing` — the `run-realm-code` sandbox API and its limits.
- `boxel` — when the schema or relationship is non-trivial.
