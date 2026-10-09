# Layout moved: `layout`, `layoutId`, `<LayoutGroup>`

Three tools on one engine: it measures before the render, measures after, and animates the difference by transform, correcting the scale distortion.

**`layout=true`** — one element, same place in the tree, its box changed (a grid item whose column changed, a panel that grew). `layout='position'` or `'size'` animates only that facet.

**`layoutId`** — two elements, one identity. Give both the same `layoutId` and the engine treats them as one thing that moved; only one is on screen at a time. The tab indicator, a thumbnail opening into a detail view, a row expanding into a panel.

```gts
<button {{motion layoutId=(concat @model.id '-shot-4')}}>…</button>  {{! the thumbnail }}
<figure {{motion layoutId=(concat @model.id '-shot-4')}}>…</figure>  {{! the open one }}
```

**`<LayoutGroup @id>`** — namespaces the `layoutId`s inside it and snapshots every layout-animating element before a render inside it changes the DOM. A filtered or reordered grid wants `<LayoutGroup>` around it and `layout=true` on each item; the items fly to their new seats while their content keeps running. Giving it `@id={{@model.id}}` keeps two instances of the same card from pairing each other's `layoutId`s.

```gts
<LayoutGroup @id={{@model.id}}>
  <Presence @items={{this.visible}} @key={{keyOf}} @mode='popLayout' as |item h|>
    <li {{motion presence=h layout=true style=(styles borderRadius='12px')}}>…</li>
  </Presence>
</LayoutGroup>
```

## Rules

- **Radius and shadow go through the modifier.** Layout animation scales the element, corners included. The engine corrects `borderRadius` and `boxShadow` per frame, but only values it holds: `{{motion layout=true style=(styles borderRadius='14px')}}`. A stylesheet radius comes out oval mid-flight.
- **Text under a non-uniform scale smears.** Give the child its own `layout=true`; it is measured in its own right and the parent's scale is undone.
- With `<Presence>`, an exiting element hands its `layoutId` over to the entering one.
- Useful extras: `layoutDependency`, `layoutScroll` (on a scrollable ancestor), `layoutRoot`, `instantLayoutTransition()`, `layoutChange()`.

## When not

- The two "elements" aren't the same thing — one is a _place_ (a trash can, a compose button) that must not deform → `{{beacon}}` + `<c.Move @to>` ([choreo.md](choreo.md)).
- The move must be _sequenced_ against other elements' fades, or needs z-index for exactly the span of the move → [choreo.md](choreo.md).
