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

For a **declared** link, `isLoaded` means nothing is being fetched right now: every slot has reached a terminal state — `present`, but also `error`, `not-found` and `not-set`. It is `false` while any target load is in flight. Which slots hold a card is `membership[i].kind`.

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

## Observe-only — always render the field alongside its status

`getRelationshipMembershipState` **only monitors**; it never starts a load. **The thing that starts one is reading the field itself.** So a template that shows a spinner must also render the field, and **must never gate the read on the status**:

```hbs
{{!-- ❌ BROKEN — nothing reads `items`, so nothing resolves it, so isLoaded
      never becomes true and the count is never shown --}}
{{#if @model.itemsLoaded}}{{@model.itemCount}}{{/if}}
```

Read the field unconditionally and let the status choose how to *present* it, not whether to touch it.

A query-backed field usually resolves with its owner card, which is why its status is normally meaningful before anything renders the field. But that resolution is skipped in several ordinary situations — during indexing and prerender, on a query field declared on a contained `FieldDef`, on a card created before it has an id, and on any field marked `eager: false`. In each of those the field sits unresolved until something reads it, so the rule above is the one to follow everywhere.

A **declared** `linksTo` / `linksToMany` always loads its targets lazily: bind `isLoading` but never touch the field and the load never starts, so `isLoading` stays `false` and the spinner never appears.

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
- `eager: false` defers an expensive query-backed field to first access; the rule above then applies to it too.
- The flagship use case is a **query-backed `linksToMany`** (a search-driven list): show a spinner while the search runs.
- A declared `linksToMany` reports `isLoading: true` until **every** element settles.
- A live query **re-enters** loading on each re-run; the spinner reappears for free.
- To read per-element state (present / loading / broken), see [`defensive-link-traversal.md`](defensive-link-traversal.md) — `membership` and `RelationshipState` are covered there.
