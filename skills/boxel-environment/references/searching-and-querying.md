---
name: searching-and-querying
description: Query syntax for finding cards with realm.cards.search in a run-realm-code script.
boxel:
  kind: skill
---

## Where a search runs

Search for cards inside a `run-realm-code` script with `await realm.cards.search(query)`; `source-code-editing/SKILL.md` describes what it returns and how to loop over the results. It searches the realm the script runs in. To search several realms, run one script in each. To find what exists across realms and the catalog — Specs, listings, files — use `search-entries`. To show a card you found, pass its `id` to `show-card`.

## Query Structure

**Pass the query object itself:**
```js
await realm.cards.search({
  filter: {
    on: { module: 'https://[boxel-app-domain]/jenna/shop/product', name: 'Product' },
    contains: { name: 'laptop' },
  },
});
```

**Operations:** `eq`, `in`, `contains`, `range`, `not`, `type`, `every` (AND), `any` (OR), and full-text `matches`. A filter holds one operator; combine several under `every`.

**Find instances after schema change:**
```js
await realm.cards.search({
  filter: { type: { module: 'https://[boxel-app-domain]/emma/hr/employee', name: 'Employee' } },
});
```

**Sort and page:**
```js
await realm.cards.search({
  filter: { on: { module: 'https://[boxel-app-domain]/jenna/shop/product', name: 'Product' }, contains: { name: 'laptop' } },
  sort: [{ by: 'price', on: { module: 'https://[boxel-app-domain]/jenna/shop/product', name: 'Product' }, direction: 'asc' }],
  page: { size: 20, number: 0 },
});
```

**Find by title:** `{ filter: { contains: { cardTitle: 'quarterly report' } } }`, combined with a type under `every` when you know it.

**Results depend on who is asking.** A realm the user can read returns every match. A realm they can't read returns only the rows its policy's `query` grants admit them to, often none, and a federated search answers that realm with zero rows rather than an error. So an empty result is not proof that no card exists. A realm whose policy couldn't be judged is left out and `meta.incomplete` is set; `realm.cards.search` fails with an error then, rather than answering with no cards. See `card-operations-authoring` §3, "What a policy does to a search".
