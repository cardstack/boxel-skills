# Drag and reorder

## Drag (`{{motion drag=…}}`)

```gts
<div
  class='puck'
  {{motion
    drag=true
    dragConstraints=(hash top=-40 left=-80 right=80 bottom=40)
    dragElastic=0.2
    whileDrag=(to scale=1.08)
  }}
></div>
```

- `drag`: `true`, `"x"` or `"y"`; `dragDirectionLock`, `dragPropagation`, `dragListener`.
- `dragConstraints`: an object (`{ top, left, right, bottom }`), an element, or a `{ current }` ref. `dragElastic`, `dragMomentum`, `dragTransition`, `dragSnapToOrigin`.
- `createDragControls()` + `dragControls=` starts a drag from another element (a handle); `whileDrag` is the pressed style; `onDragStart` / `onDrag` / `onDragEnd` / `onDirectionLock`.
- Pan without moving the element: `onPanStart` / `onPan` / `onPanEnd`.
- Inside a rotated or scaled parent, pass `transformPagePoint` with `correctParentTransform()`; in an SVG viewBox, `transformViewBoxPoint()`.
- Inputs, selects and contenteditable children don't start a drag. Drag composes with `layout` / `layoutId`.

## Reorder

```gts
import { ReorderGroup, ReorderItem } from 'glimmer-motion';

<template>
  <ReorderGroup @values={{this.items}} @onReorder={{this.setItems}} @axis='y' as |group|>
    {{#each this.items as |item|}}
      <ReorderItem @group={{group}} @value={{item}}>{{item.label}}</ReorderItem>
    {{/each}}
  </ReorderGroup>
</template>
```

`@group` is required: it is the context `<ReorderGroup>` yields. They render `ul` / `li` and pass `...attributes`. The axis is `"x"`, `"y"` or `"xy"` (wrapped grids), detected from the layout when omitted. A group auto-scrolls its scrollable ancestor near the edges and works inside `<Presence>`. `@onReorder` hands you the new order: write it back to the card's field so it persists.

## Touch

- `drag` sets `touch-action` on its own element (`none` for `true`, `pan-y` for `"x"`, `pan-x` for `"y"`, so a one-axis drag leaves the other axis to the page). Any other surface that owns a gesture — a pointer stage, a scrubber, a pan handler — needs `touch-action: none` in its scoped CSS, or the stack's scroller takes the gesture on touch devices.
- Controls get `touch-action: manipulation` to stop double-tap zoom.
- Hover-revealed controls don't exist on touch: give them an `@media (hover: none)` always-visible fallback.
- A released drag that returns home reads best as a spring with some bounce.

## When not

Reordering triggered by _state_ (a sort button, not a pointer) is a layout animation → [layout.md](layout.md). A drop that sets off a sequenced scene (drop → everyone reflows in order) hands the drop to [choreo.md](choreo.md).
