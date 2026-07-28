---
name: searching-and-querying
description: Finding cards with the search-cards host commands and query syntax.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByTypeAndTitleCommand
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByQueryCommand
      requiresApproval: false
---

## Query Structure

**Always wrap filter in query object:**
```json
{
  "query": {
    "filter": {
      "on": { "module": "...", "name": "Product" },
      "contains": { "name": "laptop" }
    }
  }
}
```

**Operations:** `eq`, `in`, `contains`, `range`, `not`, `type`, `every` (AND), `any` (OR)

**Find instances after schema change:**
```json
{
  "query": {
    "filter": {
      "type": { "module": "...", "name": "Employee" }
    }
  }
}
```


### SearchCardsByQueryCommand

**Full tool call syntax:**
```json
{
  "name": "SearchCardsByQueryCommand_847d",
  "payload": {
    "description": "Search for products with 'laptop' in the name",
    "attributes": {
      "query": {
        "filter": {
          "on": { "module": "https://[boxel-app-domain]/jenna/shop/product", "name": "Product" },
          "contains": { "name": "laptop" }
        },
        "sort": [{
          "by": "price",
          "on": { "module": "https://[boxel-app-domain]/jenna/shop/product", "name": "Product" },
          "direction": "asc"
        }]
      }
    }
  }
}
```


### SearchCardsByTypeAndTitleCommand

**Full tool call syntax:**
```json
{
  "name": "SearchCardsByTypeAndTitleCommand_a959",
  "payload": {
    "description": "Search for reports with the title 'quarterly report'",
    "attributes": {
      "title": "quarterly report",
      "cardType": "https://[boxel-app-domain]/emma/finance/report#Report"
    }
  }
}
```

## CLI search gotchas (distilled 2026-07-17)

Three traps when scripting `npx boxel search`:

1. **`--json` output is a wrapper object, not a bare array.** The shape is
   `{ "ok": ..., "status": ..., "data": [...] }` — the result count is
   `len(data)` (`jq '.data | length'`). A bare `len(json.load(...))` returns
   the wrapper's key count (3) for ANY result set, which reads as a
   catastrophic index regression and has triggered unnecessary
   `full-reindex-realm` calls.
2. **Run from the workspace root.** With cwd outside the workspace tree
   (e.g. a scratchpad dir), the CLI silently returns `0 total` for queries
   that return real results from the root — same query, same realm, no
   error. Check cwd before debugging the query; write output files to
   absolute paths instead of `cd`-ing.
3. **The raw wire grammar is deployment-dependent.** Some deployments accept
   `filter: { type: ref }`, others demand the SearchEntry grammar
   (`filter: { "item.on": ref }` + `item.`-prefixed field paths) — and it
   has flipped within a day. Try `filter.type` first and READ the 400 error:
   it names the accepted anchor. This applies only to raw CLI/endpoint
   queries — never rewrite CardDef/GTS query code from a CLI 400.
