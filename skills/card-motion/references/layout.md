# Layout moved: `layout`, `layoutId`, `<LayoutGroup>`

Three tools on one engine: it measures before the render, measures after, and animates the difference by transform, correcting the scale distortion.

**`layout=true`** — one element, same place in the tree, its box changed (a grid item whose column changed, a panel that grew). `layout='position'` or `'size'` animates only that facet.

**`layoutId`** — two elements, one identity. Give both the same `layoutId` and the engine treats them as one thing that moved; only one is on screen at a time. The tab indicator, a thumbnail opening into a detail view, a row expanding into a panel.

```gts
<button {{motion layoutId=(concat @model.id '-shot-4')}}>…</button>  {{! the thumbnail }}
<figure {{motion layoutId=(concat @model.id '-shot-4')}}>…</figure>  {{! the open one }}
```

**`<LayoutGroup @id>`** — snapshots every layout-animating element before a render inside it changes the DOM, and namespaces the `layoutId`s inside it. `layout=true` needs that snapshot: with no `<LayoutGroup>` or `<Presence>` above it (`<ReorderGroup>` and `<Choreo>` snapshot too), nothing measures the element before it moves, and a list or grid that reorders, filters or sorts lands in a single frame. Put `<LayoutGroup>` around the list and `layout=true` on each item, and the items fly to their new seats while their content keeps running. Giving it `@id={{@model.id}}` keeps two instances of the same card from pairing each other's `layoutId`s.

```gts
<LayoutGroup>
  <ul>
    {{#each this.sortedItems key='id' as |item|}}
      <li {{motion layout=true}}>{{item.name}}</li>
    {{/each}}
  </ul>
</LayoutGroup>
```

```gts
<LayoutGroup @id={{@model.id}}>
  <Presence @items={{this.visible}} @key={{keyOf}} @mode='popLayout' as |item h|>
    <li {{motion presence=h layout=true style=(styles borderRadius='12px')}}>…</li>
  </Presence>
</LayoutGroup>
```

## Rules

- **Key a moving row by a stable id, never by its position.** Use a linked card's `id`, or an id field a row is given when it is added. A key built from an index changes when the rows before it shift (a removal, a sort), and Glimmer replaces a row whose key changed with a new element, which has no earlier box to animate from. `key='@index'` keeps every element where it is and swaps its content, so nothing moves at all.
- **Radius and shadow go through the modifier.** Layout animation scales the element, corners included. The engine corrects `borderRadius` and `boxShadow` per frame, but only values it holds: `{{motion layout=true style=(styles borderRadius='14px')}}`. A stylesheet radius comes out oval mid-flight.
- **Text under a non-uniform scale smears.** Give the child its own `layout=true`; it is measured in its own right and the parent's scale is undone.
- With `<Presence>`, an exiting element hands its `layoutId` over to the entering one.
- Useful extras: `layoutDependency`, `layoutScroll` (on a scrollable ancestor), `layoutRoot`, `instantLayoutTransition()`, `layoutChange()`.

## When not

- The two "elements" aren't the same thing — one is a _place_ (a trash can, a compose button) that must not deform → `{{beacon}}` + `<c.Move @to>` ([choreo.md](choreo.md)).
- The move must be _sequenced_ against other elements' fades, or needs z-index for exactly the span of the move → [choreo.md](choreo.md).
