# Relationship Loading State

A `linksTo` / `linksToMany` field loads its linked card(s) lazily, and a **query-backed** `linksToMany` resolves by running a search. Until that load or search finishes, the field has no data to show. `getRelationshipMembershipState` lets a card author render a live progress indicator for that window — a spinner that appears while the field is in flight and clears the moment it resolves.

```ts
import { getRelationshipMembershipState } from '@cardstack/base/card-api';
```

## The shape

`getRelationshipMembershipState(instance, fieldName)` returns one object for **every** `linksTo` / `linksToMany` field — query-backed or not:

```ts
{ isLoading: boolean; isLoaded: boolean; membership: RelationshipState[] | undefined }
```

- **`isLoading`** — a whole-field boolean, `true` while the field's data is actually being fetched (a declared link still loading, or a query field's search running). It is **live**: backed by tracked state, so a template bound to it re-renders the instant the load settles.
- **`isLoaded`** — a whole-field boolean, `true` once membership is known and nothing is in flight. This is the one to gate on before reading a rollup over the field and trusting the number.
- **`membership`** — the per-element resolution(s). For the loading-indicator use case you read `isLoading`; the per-slot states in `membership` are covered in the **Defensive Link Traversal** skill.

### Why there are two booleans

A query-backed field that nothing has resolved reports `isLoading: false` and no membership, which reads exactly like a settled empty result. `isLoaded` separates them, so the three states are:

| | `isLoading` | `isLoaded` |
| -- | -- | -- |
| a fetch or search is running | `true` | `false` |
| nothing has resolved this field | `false` | `false` |
| membership is final (possibly empty) | `false` | `true` |

Bind `isLoading` to a spinner; branch on `isLoaded` before treating `field.length` or a `computeVia` reduction over the field as an answer.

## Driving a spinner from a template

Expose `isLoading` through a getter and bind it. The flagship case is a **query-backed `linksToMany`**, which runs a search to resolve:

```gts
class Matchmaker extends CardDef {
  @field cardTitle = contains(StringField);
  @field matches = linksToMany(() => Person, {
    query: {
      filter: { eq: { name: '$this.cardTitle' } },
      page: { size: 10 },
    },
  });

  get matchesLoading() {
    return getRelationshipMembershipState(this, 'matches').isLoading;
  }

  static isolated = class extends Component<typeof Matchmaker> {
    <template>
      {{#if @model.matchesLoading}}
        <LoadingIndicator data-test-loading />
      {{/if}}
      {{#each @model.matches as |match|}}
        <PersonPill @person={{match}} />
      {{/each}}
    </template>
  };
}
```

While the search runs, `matchesLoading` is `true` and the spinner shows; when results arrive it flips to `false` and the spinner clears — automatically, because the field is tracked.

## `isLoading` is observe-only — for a declared link, the template must read the field

`getRelationshipMembershipState` **only monitors**; it never starts a load. What that means depends on the kind of field.

A **query-backed** field resolves as soon as its owner card is loaded, so its status is meaningful whether or not anything renders the field.

A **declared** `linksTo` / `linksToMany` loads its targets lazily, and **the thing that kicks off that load is reading the field itself**. A template that shows a spinner for a declared link must also render the link. Bind `isLoading` but never touch the field and the load never starts, so `isLoading` stays `false` and the spinner never appears.

```hbs
{{!-- ❌ BROKEN for a declared link — nothing reads `pet`, so its lazy load
      never starts and `petLoading` is always false --}}
{{#if @model.petLoading}}<Spinner />{{/if}}

{{!-- ✅ reading the field triggers the load; isLoading reports its progress --}}
{{#if @model.petLoading}}<Spinner />{{/if}}
<span>{{@model.pet.firstName}}</span>
```

In practice you always render the field next to its spinner, so this falls out naturally — but if you ever see a spinner that never appears on a declared link, this is why.

## Deferring an expensive query with `eager: false`

A query-backed field resolves with its owner by default. Pass `eager: false` when a field's query is expensive or rarely read, and its search runs on first access instead — the declared-link rule above then applies to it too.

```ts
@field everyActivity = linksToMany(() => Activity, {
  query: { filter: { eq: { classroom.id: '$this.id' } } },
  eager: false,
});
```

## Works the same for declared `linksTo` / `linksToMany`

The same getter + `{{#if}}` pattern drives a spinner for an ordinary declared link while its lazy load is in flight:

```ts
get petLoading() {
  return getRelationshipMembershipState(this, 'pet').isLoading;
}
```

```hbs
{{#if @model.petLoading}}<Spinner />{{/if}}
<span>{{@model.pet.firstName}}</span>
```

For a declared `linksToMany`, **`isLoading` stays `true` until *every* element has settled** — a half-loaded list still reports loading.

## Live queries re-enter the loading state

A query-backed field is **live**: when its inputs change (here, `cardTitle`) the search re-runs. On each re-run `isLoading` goes back to `true` (and `membership` back to `undefined`) while the new search is in flight, then back to `false` with the fresh results — the same transition as the initial load. A bound spinner reappears on its own for each re-query.

## Key principles

- `getRelationshipMembershipState(this, 'field')` returns **live, tracked booleans** — bind them in a template and the UI updates on its own.
- `isLoading` drives a spinner; `isLoaded` says membership is final, which is what to gate on before trusting a count or a reduction over the field.
- It is **observe-only**: reading the status never starts a load. A query-backed field resolves with its owner, so its status stands alone; a declared link needs the template to render the field (`{{#each @model.field}}` / `{{@model.field}}`) or its lazy load never begins.
- The flagship use case is a **query-backed `linksToMany`** (a search-driven list): show a spinner while the search runs.
- A declared `linksToMany` reports `isLoading: true` until **every** element settles.
- A live query **re-enters** loading on each re-run; the spinner reappears for free.
- `eager: false` defers an expensive query-backed field to first access.
- To read per-element state (present / loading / broken), see the **Defensive Link Traversal** skill — `membership` and `RelationshipState` are covered there.
