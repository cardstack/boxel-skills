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

## A drag you write yourself

`{{motion drag=…}}` moves an element; it knows nothing about drop targets. When a drop must land in a zone (a kanban column, a funnel stage) and is persisted, a card often handles the pointer itself in a modifier. Three things break that, all silently:

- **The modifier re-runs mid-drag.** A function modifier is torn down and set up again whenever its arguments' tags are dirtied, not only when their values change. A `getCards` or live search answering after an index rebuilds the entries a template iterates, so `{{this.drag item.id}}` re-runs on the same element with the same id. A destructor that removes the listeners strands the gesture: the release is never heard, the item stays offset with `pointer-events: none`, and it can't be grabbed again. Keep a drag in progress alive across a re-run on the same element, and clean up only when the element has left the page:
  ```ts
  return () => {
    el.removeEventListener('pointerdown', down);
    if (el.isConnected) return; // re-run on the same element: the drag carries on
    endDrag();
  };
  ```
- **Pointer capture is not enough.** Follow one gesture on the document: add `pointermove`, `pointerup`, `pointercancel` (and a non-passive `touchmove` for hold-to-drag) in the capture phase on `pointerdown`, and remove them on release. The dragged item carries `pointer-events: none` so the drop target can be hit-tested under it, which means the release lands on the target, not on the item.
- **Drag state in `class` is overwritten.** Glimmer owns a `class` attribute bound in the template and rewrites it on any re-render, so a `classList.add('is-dragging')` vanishes as soon as the drag changes tracked state (clearing a selection, say), and the item drops under the zones it crosses. Mark drag state with `data-` attributes the template doesn't bind, and style those.

To test it, hold a drag while the card's data reindexes (touch the instances it searches), so the search answers mid-gesture; then release, and drag the same item again.

## Touch

- `drag` sets `touch-action` on its own element (`none` for `true`, `pan-y` for `"x"`, `pan-x` for `"y"`, so a one-axis drag leaves the other axis to the page). Any other surface that owns a gesture — a pointer stage, a scrubber, a pan handler — needs `touch-action: none` in its scoped CSS, or the stack's scroller takes the gesture on touch devices.
- Controls get `touch-action: manipulation` to stop double-tap zoom.
- Hover-revealed controls don't exist on touch: give them an `@media (hover: none)` always-visible fallback.
- A released drag that returns home reads best as a spring with some bounce.

## When not

Reordering triggered by _state_ (a sort button, not a pointer) is a layout animation → [layout.md](layout.md). A drop that sets off a sequenced scene (drop → everyone reflows in order) hands the drop to [choreo.md](choreo.md).
