# Arriving and leaving: `<Presence>`

An element Glimmer has removed is gone — there is no frame left to animate. `<Presence>` keeps a removed item rendered until its `exit` finishes.

```gts
import { motion, Presence, to } from 'glimmer-motion';

const keyOf = (todo: Todo) => todo.id;

<template>
  <ul>
    <Presence @items={{this.todos}} @key={{keyOf}} as |todo h|>
      <li
        {{motion
          presence=h
          initial=(to opacity=0 x=-20)
          animate=(to opacity=1 x=0)
          exit=(to opacity=0 x=20)
        }}
      >{{todo.title}}</li>
    </Presence>
  </ul>
</template>
```

- `@key` decides identity, the same job as `key` on `{{#each}}`. The block yields the item and a **handle**; the handle goes into `presence=` on the element that owns the exit. `h.isPresent` is tracked.
- **A single conditional element** is a 0-or-1-item array:
  ```ts
  const NO_PANEL: { id: string }[] = [];
  get panel() { return this.open ? [{ id: 'panel' }] : NO_PANEL; }
  ```
- `@mode`: `"sync"` (the default — leavers and newcomers together), `"wait"` (the newcomer holds until the leaver finishes), `"popLayout"` (the leaver leaves the flow at once so siblings close up; `@anchorX` / `@anchorY` place it).
- `@initial={{false}}` skips the first-render entrance — **but the presence context is inherited**, so it blocks the first entrance of every motion element inside the block too. If children animate on mount, compute `initial` per item instead.
- `@onExitComplete`, `@custom` (for an exit direction), and a nested presence under a leaving parent: `@propagate={{true}} @parent={{outerHandle}}`.

## The rule that bites

**A leaving child stays live.** Glimmer re-runs a leaver's block from current tracked state while its exit plays. Anything the exit shows — the label the panel had, the row the dialog opened from — must ride on the item `<Presence>` yields, not be read back out of state that has already moved on.

## When not

- Many elements whose exits, moves and entrances must be **ordered** relative to each other: `<Choreo>` handles leavers itself, with no `<Presence>` inside its scene ([choreo.md](choreo.md)).
- The element isn't leaving, just moving: [layout.md](layout.md).
