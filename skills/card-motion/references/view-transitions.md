# View transitions in a card

`viewTransition(update, root)` from `glimmer-motion` runs `update` inside a View Transition: the browser snapshots the old DOM, applies the update, snapshots the new DOM, and crossfades or morphs between them.

```ts
import { viewTransition } from 'glimmer-motion';

toggle = () => viewTransition(() => { this.expanded = !this.expanded; }, this.stage);
```

- Pass the card's own element as `root`. Where the browser supports element-scoped view transitions, only that box is snapshotted. Where it doesn't, the call falls back to a document-wide transition, which snapshots the host's whole page — so keep the morph small and quick.
- Under `prefers-reduced-motion`, `viewTransition` applies the update with no transition. Where View Transitions are unsupported, it just applies the update.
- Tag the elements that should morph with `view-transition-name` in scoped CSS. Names must be unique on the page, so build them from the card's id; a duplicated name falls back to a crossfade.
- `animateView` is Motion's document-level builder. It always snapshots the whole document and does not skip under reduced motion; it is not a card tool.

## When it's the wrong tool

View transitions animate **bitmaps**. Anything alive inside the snapshotted area — a running animation, a video, a canvas, another card's live content — freezes for the length of the transition. Choose by what the content needs:

- Same view, things moved (filter, reorder, expand) → `layout=true` / `layoutId` moves the real elements ([layout.md](layout.md)).
- Two views of the card, live content on both → `<Choreo @route>` crossing ([choreo.md](choreo.md)).
- A deliberate still morph of a small, static part of the card → `viewTransition(update, element)`.
