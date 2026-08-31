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
- **`membership`** — the per-element resolution(s). For the loading-indicator use case you read `isLoading`; the per-slot states in `membership` are covered in [`defensive-link-traversal.md`](defensive-link-traversal.md).

### Why there are two booleans

A query-backed field that nothing has resolved reports `isLoading: false` and no membership, which reads exactly like a settled empty result. `isLoaded` separates them. For a **query-backed** field:

| | `isLoading` | `isLoaded` |
| -- | -- | -- |
| a search is running | `true` | `false` |
| nothing has resolved this field | `false` | `false` |
| membership is final (possibly empty) | `false` | `true` |

Bind `isLoading` to a spinner; branch on `isLoaded` before treating `field.length` or a `computeVia` reduction over the field as an answer.

A **declared** link has no middle state: its membership is the reference list in the card's own document, known as soon as the owner deserializes, so `isLoaded` is true from then on. It says the reference list is final — not that the targets are loaded; per-slot residency is `membership[i].kind`.

## Deferring an expensive query with `eager: false`

A query-backed field resolves with its owner by default. Pass `eager: false` when a field's query is expensive or rarely read, and its search runs on first access instead.

```ts
@field everyActivity = linksToMany(() => Activity, {
  query: { filter: { eq: { 'classroom.id': '$this.id' } } },
  eager: false,
});
```

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

## Observe-only — always read the field, never behind its own status

This is the one rule that trips people up. `getRelationshipMembershipState` **only monitors**; it never starts the load. **The thing that kicks off the lazy load / search is reading the field itself** (`@model.matches` in the `{{#each}}` above).

So a template that shows a spinner **must also render the field**. If you bind `isLoading` but never touch the field, the load never starts and **`isLoading` stays `false` forever** — the spinner never appears.

```hbs
{{!-- ❌ BROKEN — nothing reads `matches`, so the search never runs
      and `matchesLoading` is always false --}}
{{#if @model.matchesLoading}}<Spinner />{{/if}}

{{!-- ✅ the {{#each}} reads the field, which triggers the search;
      isLoading then reports that search's progress --}}
{{#if @model.matchesLoading}}<Spinner />{{/if}}
{{#each @model.matches as |match|}}<PersonPill @person={{match}} />{{/each}}
```

In practice you always render the field next to its spinner, so this falls out naturally — but if you ever see a spinner that never appears, this is why.

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

- `getRelationshipMembershipState(this, 'field').isLoading` is a **live, tracked boolean** — bind it in a template to show a progress indicator that updates on its own.
- It is **observe-only**: reading the status never starts a load. Always read the field itself (`{{#each @model.field}}` / `{{@model.field}}`) alongside the spinner, or the load never begins and `isLoading` stays `false`.
- **Never gate the read on the status.** A query-backed field resolves with its owner in the interactive app but lazily during indexing, so `{{#if @model.itemsLoaded}}{{@model.itemCount}}{{/if}}` renders nothing in prerendered HTML — the field is never read, so its search never starts.
- `isLoaded` says membership is final; for a declared link that means the reference list, not the targets.
- `eager: false` defers an expensive query-backed field to first access.
- The flagship use case is a **query-backed `linksToMany`** (a search-driven list): show a spinner while the search runs.
- A declared `linksToMany` reports `isLoading: true` until **every** element settles.
- A live query **re-enters** loading on each re-run; the spinner reappears for free.
- To read per-element state (present / loading / broken), see [`defensive-link-traversal.md`](defensive-link-traversal.md) — `membership` and `RelationshipState` are covered there.
