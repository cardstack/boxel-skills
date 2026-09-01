## Query Essentials

**The 'on' Rule (MEMORIZE THIS!):**
```ts
// ❌ WRONG - Missing 'on'
{ range: { price: { lte: 100 } } }

// ✅ CORRECT - Include 'on' for filters
{
  on: { module: new URL('./product', import.meta.url).href, name: 'Product' },
  range: { price: { lte: 100 } }
}
```

**⚠️ CRITICAL Path Rule:**
- **In .gts files (queries):** Use `./` - you're in the same directory as the module
- **In JSON files (`adoptsFrom`):** Use `../` - instances live in folders, need to navigate up
- `./` means "same directory" when used with `import.meta.url`

**Filter types needing 'on':**
- `eq`, `in`, `contains`, `range` (except after type filter)
- Sort on type-specific fields

**Filter composition types:**
- `any`: allows an "OR" union of other filters
- `every`: allows an "AND" union of other filters
- `not`: allow negating another filter

**Basic query pattern:**
```ts
const query = {
  filter: {
    every: [
      { type: { module: new URL('./product', import.meta.url).href, name: 'Product' } },
      { on: { module: new URL('./product', import.meta.url).href, name: 'Product' }, eq: { status: 'active' } }
    ]
  }
};
```

**Defining query-backed fields:**
```ts
@field shirts = linksToMany(Shirt, {
  query: {
    filter: {
      // implicit clause merged during execution: on: { module: Shirt.module, name: 'Shirt' }
      eq: { size: '$this.profile.shirtSize' },
    },
    realm: '$REALM',
    sort: [
      {
        by: 'updatedAt',
        direction: 'desc',
      },
    ],
    page: { size: 12 },
  },
});

@field profile = linksTo(Profile, {
  query: {
    filter: {
      eq: { primary: true },
    },
    // `linksTo` takes the first matching card (post-sort) or null when no results.
  },
});
```

**Where a query-backed field is current, and where it is not:**

A query-backed relationship resolves when its owner card is loaded and re-resolves when a realm event reports a matching card changed, so it is correct on every surface that loads the card — a live card, a hydrated search row, anything reading the field in JS.

Anything produced at **index time** is the exception — the indexed document, and the prerendered HTML built from it. (A search row is prerendered HTML until it hydrates, so it shows the index-time value until then.) A card is reindexed when something it depends on changes, and a card the query merely *matched* is deliberately not a dependency of the card holding the query — making it one would turn every write in a realm into an invalidation of every card whose query might match it. So a query-backed relationship, and anything computed from one, is not refreshed in the index when matching cards change.

That lands on the single most natural thing to write with this feature:

```ts
@field itemCount = contains(NumberField, {
  computeVia: function (this: Board) {
    return this.items?.length ?? 0;
  },
});
```

On a loaded card `itemCount` counts what the field holds. In the indexed document it holds the value as of the last time the card was indexed — adding or removing a matching card does not move it. A count indexed as `0` before any match existed is the worst version of this, since `0` is also a real answer.

**A query-backed field holds one page of results, not the whole match set.** On a loaded card `length` counts that page: a query with no `page` is clamped to the server ceiling, and a query declaring a `page.size` above that ceiling is rejected outright rather than trimmed — the search fails with a 400. So a live count is bounded by the page, and an over-large declared page is a bug rather than a slow path. (The bound applies to live reads; it is not applied during indexing.) For a true total, run the query with `getCards` in a component and read `meta.page.total`, which is not page-bounded.

So:

- **Read the number from a loaded card**, and gate on `getRelationshipMembershipState(this, 'items').isLoaded` before trusting it — see the **Relationship Loading State** skill. Read the field unconditionally and let the status decide how to present the number; making the read itself conditional means it never resolves during indexing.
- **When a number must be correct in the index** — because another card reduces over it, or an assistant reads it out of the search doc without loading the card — hold the links explicitly: `linksToMany(Item)`, with the `computeVia` over that. Membership then lives in the card's own document, so adding or removing an item rewrites that card and reindexes it.
- **Add `searchable: true` to that declared link only when the rollup reads fields *of* the targets** (summing `item.price` rather than counting items). That is what puts target data in the search doc, and it is also what makes each target a dependency — which is the fan-out described above, now paid deliberately for one field.

**When to use what to query cards:**
- Display a list of results (cards or files) → render with `@context.searchResultsComponent` (the `<SearchResults>` component). It prefers fast prerendered HTML and falls back to a live card per result — you never branch on which.
- Need the instances in JS (read / manipulate) → `getCards` (reactive) or `@context.store.search` (imperative, returns instances)
- Treat a query result as a field → query-backed fields (`linksTo` / `linksToMany` with a `query`)

> ⚠️ Deprecated: `@context.prerenderedCardSearchComponent` / `<PrerenderedCardSearch>` is the old display surface. Use `@context.searchResultsComponent` instead.

**Rendering a result list via `@context.searchResultsComponent`:**

Declare an `entry`-rooted query and render the yielded entries. Each `entry.component` renders itself — prerendered HTML inert (hydrated lazily on interaction) or a live card — so the card never decides which:

```gts
import { CardDef, Component } from '@cardstack/base/card-api';
import {
  searchEntryWireQueryFromQuery,
  type SearchEntryWireQuery,
} from '@cardstack/runtime-common';

class BlogPost extends CardDef {
  static isolated = class Isolated extends Component<typeof BlogPost> {
    get query(): SearchEntryWireQuery {
      // Build the entry query from an ordinary query, then add realms.
      return {
        ...searchEntryWireQueryFromQuery({
          filter: {
            on: { module: new URL('./author', import.meta.url).href, name: 'Author' },
            eq: { status: 'active' },
          },
          sort: [{ by: 'title', direction: 'asc' }],
        }),
        realms: ['https://my-realm.example/'], // realm URLs to search
      };
    }

    <template>
      <@context.searchResultsComponent @query={{this.query}} @mode='hover' as |results|>
        {{#each results.entries key='id' as |entry|}}
          <entry.component />
        {{else}}
          {{if results.isLoading 'Loading…' 'No results'}}
        {{/each}}
      </@context.searchResultsComponent>
    </template>
  };
}
```

- `@query` — an `entry`-rooted query (`SearchEntryWireQuery`). Build it from a normal query with `searchEntryWireQueryFromQuery`, then set `realms` (and optionally `page`). Changing it re-runs the search.
- `@mode` — hydration of prerendered rows on interaction: `'none'` (stay inert), `'hover'` (default), `'click'`, `'touch'`.
- Yields `results`: `results.entries` (each `entry` exposes `.component`, `.id`, `.isError`, plus `.displayName` / `.iconHtml` for a row with no HTML yet), `results.isLoading`, `results.meta` (`{ page: { total } }`), and `results.errors`.