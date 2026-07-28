---
name: boxel-card-interaction
description: Use when a card renders OTHER cards and a user will click them — tile grids, search-result lists, dashboards, feeds, embedded media, app-card homes. Decides the click mechanism (viewCard vs cardComponentModifier vs anchor), whether the child owns its own pointer events (audio/video/3D/forms), and the @mode hydration setting. Load before writing any template containing `entry.component`, `c.component`, or a stretched click overlay.
---

# Card Interaction Contract

_One decision tree for "what happens when a user clicks a rendered card."_

This skill supersedes the scattered click-through advice in
`boxel/references/delegated-rendering.md`,
`boxel-ui-guidelines/references/delegated-render-control.md`, and
`boxel-patterns/patterns/app-card-home-with-search/README.md`. Those files
now point here. If you find click guidance elsewhere that disagrees with this
file, this file wins. The behavior below was measured empirically in a live
app (the interaction-lab harness — see Verification), not just read from
source.

---

## The organizing idea: click behavior INVERTS between Interact and Host

In **Interact**, the host tracks rendered card elements and binds a bubbling
`click` (plus `cursor: pointer` and the hover "adorn" chrome) directly onto
them — so search-result entries AND `<@fields.X />` children are clickable
**with no wiring at all**, whether you asked or not. In **Host** (published),
nothing is tracked: zero adorn elements, every cursor `auto`, nothing
clickable unless you wired it.

Consequences, one per mode:

- Diagnosing **"the tile doesn't open"** → almost always Host (you never
  wired a click).
- Diagnosing **"it opens when it shouldn't"** (audio plays → card opens
  instead) → almost always Interact (the host's own listener fired).

### What the host tracks

| Field type | Tracked (auto-clickable in Interact)? |
|---|---|
| `linksTo` / `linksToMany`, any format | **Yes** — except the exact pair `linksTo` + `isolated` |
| `linksToMany` + `isolated` | **Yes** (the carve-out is `linksTo`-only) |
| `contains` / `containsMany` (FieldDef children) | Never |

The `linksTo`+`isolated` carve-out exists in the source for index-card
reasons, is undocumented, and does NOT extend to `linksToMany` — don't build
on it. The inconsistency is filed as CS-12268.

### Default child formats (when you don't pass `@format`)

`defaultFieldFormats(containingFormat)` decides what a bare `<@fields.x />`
renders as — and the defaults are asymmetric:

| containing format | FieldDef child | CardDef child |
|---|---|---|
| `isolated` / `embedded` / `fitted` | `embedded` | **`fitted`** |
| `edit` | `edit` | `edit` → rewritten to `fitted` |
| `atom` | `atom` | `atom` |
| `markdown` | `markdown` | `markdown` (recurses in-format on purpose) |

Two consequences: a bare `<@fields.linkedCard />` in an isolated template
gives **fitted, not embedded** — if the child should own its own height
(list/feed rows), say `@format='embedded'` explicitly. And `getChildFormat`
rewrites `edit` → `fitted` for CardDef/FileDef children, which is why a
linked card in an edit form renders as a pill. Because `fitted` is a
*tracked* format, the default wiring for a linked child is also the
click-stealing one.

---

## 🚨 Rule 0 — `<a href>` to a card URL is almost always wrong

An anchor whose `href` is a card URL triggers a **full document navigation**
— verified in *both* modes (`navType: navigate`). The Boxel app — in
Interact mode *and* on a published Host site — is a live Ember SPA. A
document navigation tears it down and reboots it: the card stack is lost,
in-flight edits are lost, and the user watches the whole app reload.

This is the single most common defect in card grids, and it comes from a
retired claim that "Host mode is a plain HTML/CSS render." **It is not.** The
published site is the same SPA (`templates/index.gts`), with
`hostModeService.isActive === true`. It hydrates, it runs JS, and it has a
working card stack (`addToHostModeStack`).

Use `<a href>` for a card only when leaving the app is the actual intent
(cross-realm link, external site, "open in new tab" affordance with
`target="_blank"`).

---

## The one primitive you need: `viewCard`

`this.args.viewCard(cardOrURL, format, opts?)` is the only mechanism that
works in **both** Interact and Host submodes and never reloads the app:

| Submode | What `viewCard` does |
|---|---|
| `interact` | `operatorModeStateService.viewCardOnStack` — pushes a new pane |
| `host` (published) | `operatorModeStateService.addToHostModeStack` — SPA push, `?hostModeStack=` URL update |
| `code` | pushes into the preview/playground surface |

It is the mechanism the base library itself uses — see `skill-reference.gts`,
`skill-set.gts`, and `system-card.gts` in `packages/base`, which all guard on
existence and call it:

```gts
private openCard = () => {
  this.args.viewCard?.(new URL(this.entryId), 'isolated');
};
```

Always guard with `?.` — `viewCard` is absent in the static prerender pass and
in freestyle/test contexts.

---

## Decision tree

Answer in order. Stop at the first match.

```
Is the child a LIVE surface — audio, video, 3D/model viewer, canvas,
form, wizard, map, code editor, anything with its own controls?
│
├─ YES → The child must defend its own pointer events (see below).
│        NO overlay, NO whole-card click target in the parent.
│        Give the parent an explicit `Open ↗` button in parent-owned
│        chrome (corner, header, or caption) wired to `viewCard`.
│        Set @mode='none' so the tile is never swapped mid-interaction.
│
└─ NO → It is a read-only preview. Continue.
   │
   In Interact it is ALREADY clickable (tracked). The wiring below is
   what makes it work in Host — and what makes the affordance explicit,
   accessible, and consistent across modes.
   │
   Does the whole tile need to be the click target?
   │
   ├─ YES → Stretched transparent <button> overlay (inset: 0) on a
   │        position: relative wrapper, calling `viewCard`.
   │        NOT an <a href>. NOT a click handler on the <li>.
   │        sr-only label inside; :focus-visible outline.
   │
   └─ NO → A real <button> or the card's own title link, calling `viewCard`.

Then, independently: pick @mode (see hydration table below).
```

### Live children must stop propagation INSIDE themselves

In Interact the host's click-to-open listener sits on the tracked
`.field-component-card` element. A click on the child's own Play button,
slider, or canvas **bubbles up to it** and opens the card. Three measured
facts:

1. Removing your own stretched overlay is **necessary but not sufficient** —
   with no overlay at all, clicking Play still opened the card.
2. The guard must live **inside the child card's template**. A wrapper in the
   parent is an *ancestor* of the tracked element, so the host's listener has
   already fired by the time the wrapper sees the event.
3. `ember-template-lint`'s `no-invalid-interactive` rejects `{{on 'click'}}`
   on a `<div>`, so route it through a modifier:

```ts
private containClicks = modifier((element: HTMLElement) => {
  let swallow = (event: Event) => event.stopPropagation();
  element.addEventListener('click', swallow);
  return () => element.removeEventListener('click', swallow);
});
```

(`packages/base/skill-set.gts` uses the same defense.) Consequence: a parent
embedding a live card it does not own has **no remedy** — the fix belongs in
the child CardDef. Any CardDef whose embedded/fitted template has real
controls should ship this guard.

### Why a `<button>` overlay, not an `<a>`, and not `<li {{on 'click'}}>`

- `<a href>` → full app reload (Rule 0).
- `{{on 'click'}}` on `<li>`/`<div>` → `ember-template-lint`
  `no-invalid-interactive` rejects it.
- `role="button"` on a wrapper containing `<entry.component />` →
  `require-presentational-children` rejects it.
- A transparent `<button>` is keyboard-reachable, screen-reader labelable,
  and lint-clean.

### Why overlay, not wrap

Wrapping (`<button><entry.component /></button>`) breaks fitted cards: the
`height: 100%` chain has to propagate through the host's
`boxel-card-container` chrome, and it breaks silently — the tile collapses to
zero height. Overlay leaves the card's own layout untouched.

```hbs
<li class='cell'>
  <entry.component />
  <button type='button' class='cell-open' {{on 'click' (fn this.open entry.id)}}>
    <span class='sr-only'>Open {{entry.displayName}}</span>
  </button>
</li>
```

```css
.cell { position: relative; }
.cell-open {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.cell-open:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

---

## Detecting mode — `@context.submode`

`CardContext` carries the runtime mode. This is the supported way to branch:

```gts
get isPublished() {
  return this.args.context?.submode === 'host';
}
```

| Provider | `mode` | `submode` |
|---|---|---|
| Operator container (in-app) | `'operator'` | `'interact'` \| `'code'` |
| Published site (`templates/index.gts`, host active) | `'host'` | `'host'` |
| Static prerender (`templates/render/html.gts`) | `'host'` | `'host'` |

**🚨 Do NOT branch on `@context.cardComponentModifier` existence.** It is
always truthy — `field-component.gts` supplies a `NoOpModifier` default when
the real one isn't provided. `{{#if @context.cardComponentModifier}}` is
always true and tells you nothing about the mode.

In practice you rarely need to branch at all: `viewCard` covers every submode.
Reach for `submode` only for genuinely mode-specific chrome (e.g. hiding an
in-app-only edit affordance on the published site).

---

## `cardComponentModifier` — narrow purpose

```hbs
<CardContainer {{@context.cardComponentModifier
  cardId=entry.id format='data' fieldType=undefined fieldName=undefined}}>
```

This registers the rendered element with the host's card tracker, which powers
the **native overlay chrome** (hover outline, card menu, drag). Use it when you
want the host's stock behavior instead of your own affordance. It is a no-op
outside operator mode.

Do not stack it with an overlay button on the same tile — you get two
competing click targets and the hover chrome flickers against your own
hover styles.

---

## Hydration — `@mode` on `searchResultsComponent`

Each result renders as inert prerendered HTML and swaps to a live card
component on the trigger you choose. **That swap is visible**: chrome and
adornment fade in as the live component mounts, and out again if the entry
re-renders. Symptoms of the wrong setting are cosmetic-looking but are
hydration, not CSS.

| `@mode` | Swaps on | Use for |
|---|---|---|
| `'none'` | never | Dense read-only sections; **any section containing live media**; anything where flicker is unacceptable |
| `'hover'` (default) | mouseenter | Small in-app grids where hover chrome is wanted |
| `'click'` | click | Rarely — delays the first interaction |
| `'touch'` | touch | Touch-primary surfaces |

**Two failure modes, opposite directions:**

1. **Flicker** — `'hover'` on a dense grid means every mouse sweep hydrates a
   row of tiles, each visibly acquiring chrome. Fix: `@mode='none'`.
2. **Permanently blank tiles** — `'hover'` is the *only* hydration path, so a
   result whose prerendered fitted HTML is missing or broken stays a white box
   until someone happens to hover it. Fix: hydrate near-viewport with an
   `IntersectionObserver` modifier (disconnect after first intersection), keep
   mouseenter as a fast fallback. Verified in the catalog storefront: nine
   near-viewport cards per tab hydrated without hover, and grid-cell/title
   counts matched for the first time.

If a section shows blank tiles, that's #2 — do not "fix" it with CSS.

---

## Cost note

`searchResultsComponent` is live by construction: each section subscribes to
realm change events, so any create/edit/delete in the realm re-fetches every
section whose query might match. With autosave-per-keystroke, a Home with four
live sections can make unrelated edit forms feel sluggish. Keep live sections
modest; `@mode='none'` reduces per-result cost but not the subscription.

---

## Verification

- **Click a tile in Interact mode.** The stack should gain a pane. If the
  whole app white-flashes and reboots, you have an `<a href>`.
- **Click a tile on the published site.** URL should update and a pane push;
  same reload test applies.
- **Inspect a media tile.** No absolutely-positioned element should sit above
  the player. Play/scrub/orbit must work without navigating — in Interact,
  which is where the host's own listener steals the click.
- **Sweep the mouse across a grid.** Tiles should not visibly acquire chrome.
  If they do, set `@mode='none'`.
- **Load a long grid without touching the mouse.** No permanently blank tiles.

### The live harness

`https://realms-staging.stack.cards/ctse/interaction-lab/` (card
`InteractionLab/lab`), published for Host-mode testing at
`https://ctse.staging.boxel.dev/interaction-lab/`. Benches cover every
mechanism above plus a per-cell format×fieldType tracking matrix, and the
card prints a live readout of `context.mode` / `submode` / `viewCard`
presence plus a **boot stamp** that only changes on a full app reload — the
tell for distinguishing an SPA push from a document navigation. Re-run it
after platform upgrades (CS-12268).

**Browser-automation gotcha:** the Claude-in-Chrome `computer` tool's
screenshot space can be **1.2× the page viewport** (e.g. 1301×924 vs
1084×770). Coordinates from `getBoundingClientRect()` passed straight to
`left_click` land ~20% off and silently hit nothing — which reads as "the
bench is inert." Derive coordinates from a screenshot, or multiply page
coords by `screenshotWidth / window.innerWidth`, and confirm any null result
a second way (stack length, `elementFromPoint`, a DOM state change) before
believing it.

---

## Related

- `boxel-ui-guidelines/references/delegated-render-control.md` — how to style
  the host's injected chrome around a child card (the CSS side).
- `boxel-patterns/patterns/app-card-home-with-search/README.md` — the query
  and layout side of result-list sections.
- `boxel/references/query-systems.md` — building the `SearchEntryWireQuery`.
