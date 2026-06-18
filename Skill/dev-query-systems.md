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

**When to use what to query cards:**
- Display a list of results (cards or files) → render with `@context.searchResultsComponent` (the `<SearchResults>` component). It prefers fast prerendered HTML and falls back to a live card per result — you never branch on which.
- Need the instances in JS (read / manipulate) → `getCards` (reactive) or `@context.store.search` (imperative, returns instances)
- Treat a query result as a field → query-backed fields (`linksTo` / `linksToMany` with a `query`)

> ⚠️ Deprecated: `@context.prerenderedCardSearchComponent` / `<PrerenderedCardSearch>` is the old display surface. Use `@context.searchResultsComponent` instead.

**Rendering a result list via `@context.searchResultsComponent`:**

Declare a `search-entry`-rooted query and render the yielded entries. Each `entry.component` renders itself — prerendered HTML inert (hydrated lazily on interaction) or a live card — so the card never decides which:

```gts
import {
  searchEntryWireQueryFromQuery,
  type SearchEntryWireQuery,
} from '@cardstack/runtime-common';

class Isolated extends Component<typeof BlogPost> {
  get query(): SearchEntryWireQuery {
    // Build the search-entry query from an ordinary query, then add realms.
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
}
```

- `@query` — a `search-entry`-rooted query (`SearchEntryWireQuery`). Build it from a normal query with `searchEntryWireQueryFromQuery`, then set `realms` (and optionally `page`). Changing it re-runs the search.
- `@mode` — hydration of prerendered rows on interaction: `'none'` (stay inert), `'hover'` (default), `'click'`, `'touch'`.
- Yields `results`: `results.entries` (each `entry` exposes `.component`, `.id`, `.isError`, plus `.displayName` / `.iconHtml` for a row with no HTML yet), `results.isLoading`, `results.meta` (`{ page: { total } }`), and `results.errors`.