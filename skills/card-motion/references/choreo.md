# A whole scene: `<Choreo>`

`{{motion}}` animates elements one at a time; what the screen does is emergent. `<Choreo>` makes statements about a **render pass**: it watches its region, computes the changeset — inserted, removed and kept participants, with their bounds before and after — and plays the timeline declared inside it over that changeset.

```gts
import { concat } from '@ember/helper';
import { beacon, Choreo } from '@cardstack/choreo';
import { motion, spring } from 'glimmer-motion';

const toss = spring({ visualDuration: 0.5, bounce: 0.2 });
const settle = spring({ stiffness: 300, damping: 24 });

// in the card's isolated template; `this.rows` is the card's list, each row with a stable id
<template>
  <Choreo as |c|>
    {{#each this.rows key='id' as |row|}}
      <article {{motion id=(concat @model.id '-' row.id) role='row'}}>{{row.subject}}</article>
    {{/each}}
    <span class='bin' {{beacon (concat @model.id '-bin')}}>🗑</span>

    <c.Sequence>
      <c.Move @of={{c.removed 'row'}} @to={{c.beacon (concat @model.id '-bin')}} @spring={{toss}} />
      <c.Move @of={{c.moved 'row'}} @spring={{settle}} />
    </c.Sequence>
  </Choreo>
</template>
```

## Participants and leavers

- Participants are ordinary motion elements with two extra args: `id` (identity) and `role` (the group a step selects). Everything else about them — `animate`, `drag`, `layout` — still works.
- **Leavers are handled for you.** A removed participant stays on screen, locked where it stood, for exactly as long as the timeline names it. No `<Presence>` inside a Choreo scene.
- Put `id` / `role` only on the elements this scene should see.

## The timeline

- Blocks: `c.Sequence` (one after another — after a spring too, whose length is computed from the spring) and `c.Parallel`; nest freely.
- Steps: `c.Tween` (keyframes or targets over a duration), `c.Spring`, `c.Move` (FLIP for kept sprites; by default it animates size too — `@size={{false}}` to move only, `'crop'` or `'scale'` to resize by transform), `c.Hold` (set properties for a window — **the whole z-index story**; `@fill={{true}}` keeps them after), `c.Wait`.
- **Every time arg is in seconds:** `@duration`, `@delay`, `@stagger`. (`@ms` and `@overlap` are the old spellings and throw.) Name a step with `@name` and place another against it with `@at={{at 'name' 0.4}}` or `@at={{after 'name'}}` (`at` and `after` come from `@cardstack/choreo`).
- Selectors: `c.all`, `c.kept`, `c.inserted`, `c.removed` (each takes an optional role), `c.role 'card'`, `c.id 'card-1'`, `c.still` / `c.moved` (kept sprites whose bounds did not / did change), `c.received` / `c.counterpart` (the two halves of a match — a flight step fires only on flight passes, never on a plain resize), `c.onstage (query)` (only what the viewport can see).
- Fades take keyframes: `<c.Tween @of={{c.inserted 'row'}} @opacity={{array 0 1}} @duration={{0.26}} />`. `@from` is a `c.Move` arg (a beacon to fly in from); a Tween ignores it.

## Values computed from other elements

Any property may be a function `(sprite, changeset) => value`, resolved at run time. A keyframe pair states both ends:

```ts
import type { Changeset, Sprite } from '@cardstack/choreo';

leftRange = (_s: Sprite, cs: Changeset) => {
  const bar = cs.sprite({ id: 'split-bar' });
  return [bar?.initial?.parent.width ?? 0, bar?.final?.parent.width ?? 0];
};
// <c.Spring @of={{c.id 'split-content'}} @left={{this.leftRange}} />
```

`cs.sprite()` returns null when the element isn't in this changeset — the card unmounted mid-run, say. Never assert it away with `!`: a throw inside the measure pass takes every region on the page down with it.

Discriminate with a property function too: `const layer = (s: Sprite) => (s.counterpart ? 6 : 1);` with `<c.Hold @of={{c.moved 'piece'}} @zIndex={{layer}} />` lifts only the element that is flying.

## Beacons — a place, not an identity

When the destination is a place that must not move or stretch (a bin, a compose button), mark it `{{beacon name}}` and fly to `@to={{c.beacon name}}` (or in from `@from={{c.beacon name}}`). A beacon never joins a changeset; it only says where it is. `layoutId` is the wrong tool here — it would morph the bin into the row.

**Beacon names are document-wide and the first registration wins**, so a card that can render twice must put its id in the name, as above.

## Regions

`<Choreo>` belongs around the machine it choreographs — the list, the panel, the card's main view. A participant registers with its nearest `<Choreo>` ancestor, and each region is its own scene: its own changeset, its own leavers, its own run. Queries don't leak between regions and there is no shared clock.

| Situation | Regions |
| --- | --- |
| Sidebar, main and drawer in one sequence | one `<Choreo>` |
| A list with its own enter/leave inside a moving panel | panel outer, list inner |
| A dialog with its own leavers over a view that also moves | view outer, dialog inner |
| "I need the bin's box from inside the list" | not a region question — a `{{beacon}}` |

## Far matching — one identity, two regions

An element that leaves one region and appears in another in the same render pass is paired with itself and flies across as one continuous move, rather than dying in one region and being born in the other. **The id is the API**: the same id in both regions turns it on, different ids turn it off. The receiver lands in its region's changeset as a `kept` sprite carrying the sender as its `counterpart`, so a `c.Move @of={{c.moved 'piece'}}` covers both a neighbour closing a gap and the cross-region arrival. Ordinary `c.removed` / `c.inserted` steps fire only when there was no match.

Matching is page-wide: two instances of a card (or two cards) using the same participant ids can pair with each other when one removes an id in the same pass the other inserts it. Scope ids by the card's id unless flying between them is the point.

## A Magic Move between two views of a card

To swap a card between two views (a grid and a detail page, say) as one Magic Move, keep the swap as tracked state inside the card and wrap the swapping area in `<Choreo @route={{true}}>`. Elements with the same id on both views pair and fly; the rest leave and arrive. `<c.Crossing @duration @ease @leave @arrive @overlap>` is the canned crossing (`@overlap` is a fraction of the flight, not seconds); add your own steps beside it for elements that should do something different. `@quiet={{true}}` pauses animations running when the crossing lifts off and resumes them when it lands. To know a crossing is in flight — to hold back expensive mounts until it lands — use `createArming()` from `@cardstack/choreo` rather than watching runs by hand.

Do not change the host's URL or title to drive it: the swap lives inside the card.

## When not

One element, no ordering, no cross-element measurement → [element.md](element.md) / [presence.md](presence.md). A pure layout move → [layout.md](layout.md).
