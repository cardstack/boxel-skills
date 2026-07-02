---
validated: source-proven
---

# show-card-list-with-views — Generic CardsGrid with view selector

**What this gives you:** A reusable list/grid component that takes a `Query` + realms + a view name (`'card' | 'strip' | 'grid'`) and renders results via `@context.prerenderedCardSearchComponent`. Live-updating, fitted-format rendering, view-toggleable.

**When to use:** Browse views of any kind — catalog listings, search results, "all my projects", filter results. Anywhere you'd otherwise hand-roll `getCards` + `{{#each}}` + manual loading states.

**The insight:** The host injects `prerenderedCardSearchComponent` into the card context. Use `(component @context.prerenderedCardSearchComponent)` to bind it to a local name, then drive it with `@query` + `@realms` + `@isLive={{true}}`. Wrap in your own `<ul class='{{view}}-view'>` so CSS handles the layout per view.

**Recipe shape:**

```ts
interface CardsGridSignature {
  Args: {
    query: Query;
    realms: string[];
    selectedView: 'card' | 'strip' | 'grid';
    context?: CardContext;
  };
}

export class CardsGrid extends GlimmerComponent<CardsGridSignature> {
  <template>
    <ul class='cards {{@selectedView}}-view'>
      {{#let (component @context.prerenderedCardSearchComponent) as |PrerenderedCardSearch|}}
        <PrerenderedCardSearch @query={{@query}} @format='fitted' @realms={{@realms}} @isLive={{true}}>
          <:loading>Loading...</:loading>
          <:response as |cards|>
            {{#each cards key='url' as |card|}}
              <li class='{{@selectedView}}-view-container'>
                <card.component class='card' />
              </li>
            {{/each}}
          </:response>
        </PrerenderedCardSearch>
      {{/let}}
    </ul>
  </template>
}
```

**Gotchas:**
- `@isLive={{true}}` keeps the grid up to date as cards in the realm change. Drop it for snapshot semantics.
- `@format='fitted'` works for ~all card types if they implement the fitted format (they should — see `boxel/references/fitted-formats.md`).
- The view name is just a CSS class — your stylesheet decides what `.card-view`, `.strip-view`, `.grid-view` look like.
- Pair with `<ViewSelector>` from `@cardstack/boxel-ui/components` for the user-facing view toggle.

**Source:** `boxel-catalog/components/grid.gts`, `boxel-catalog/components/card-list.gts`.

**See also:** `pick-typed-sort`, `show-table-from-query`, `boxel/references/query-systems.md`, `boxel/references/fitted-formats.md`.
