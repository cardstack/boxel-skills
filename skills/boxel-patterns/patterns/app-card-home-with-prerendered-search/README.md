---
validated: source-proven
---

# app-card-home-with-prerendered-search — Every card family needs a home

**What this gives you:** A `Home` CardDef (typically named after the brand — `Surge`, `RowAndRail`, `BoxelHome`) that sits at the top of a card family and uses `PrerenderedCardSearch` to dynamically list every Meet / Listing / Project / etc. in the realm. `prefersWideFormat = true` so it opens edge-to-edge. The user lands on it, sees the realm at a glance, drills in from there.

**When to use:** Whenever you build a card *family* — 2+ related CardDefs (Meet + Swimmer + Club, Project + Task + Person, Show + Listing + Venue, etc.). Building a single utility card? Skip this pattern. Building anything where the user will accumulate instances over time? Build the home.

**Why it matters:**
- **Discoverability.** A realm with 5 CardDefs and no home shows users an `index.json` `CardsGrid` of mixed cards in adoption order. A home puts the brand voice up front and arranges the suite the way the designer intended.
- **Editorial framing.** The home is where you set the typography pairing, the eyebrow voice, the color story. Children inherit through the theme cascade.
- **Live by construction.** `PrerenderedCardSearch` re-runs as the realm changes — new instances appear automatically, no manual relationship-wiring on the home.

**Recipe shape:**

```ts
// surge.gts (or row-and-rail.gts, or whatever the brand demands)
import { CardDef, Component, field, contains, linksTo } from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import TextAreaField from 'https://cardstack.com/base/text-area';
import { codeRef, realmURL, type Query } from '@cardstack/runtime-common';
import BoltIcon from '@cardstack/boxel-icons/bolt';
import { Meet } from './meet';

// @ts-expect-error import.meta is supported by the Boxel host
const here: string = import.meta.url;

export class Surge extends CardDef {
  static displayName = 'Surge';
  static icon = BoltIcon;
  static prefersWideFormat = true;             // ← edge-to-edge home

  @field welcome = contains(StringField);
  @field tagline = contains(TextAreaField);
  @field headlineMeet = linksTo(() => Meet);   // optional spotlight pin

  @field cardTitle = contains(StringField, {
    computeVia: function (this: Surge) {
      return this.cardInfo?.name?.trim()?.length
        ? this.cardInfo.name
        : (this.welcome ?? 'SURGE');
    },
  });

  static isolated = class Isolated extends Component<typeof Surge> {
    // codeRef(here, relPath, ExportName) returns { module, name } — the canonical CodeRef
    get meetRef() { return codeRef(here, './meet', 'Meet'); }
    get swimmerRef() { return codeRef(here, './swimmer', 'Swimmer'); }
    get realms(): string[] {
      const url = this.args.model?.[realmURL];
      return url ? [url.href] : [];
    }
    // filter: { type: ref } — match ALL cards of a type.
    //   `on` would be wrong: `on` is a SCOPE inside a predicate, not a filter.
    // Custom-field sorts require `on: ref` — only lastModified, createdAt, cardURL work without it.
    get meetsQuery(): Query {
      const ref = this.meetRef;
      return {
        filter: { type: ref },
        sort: [{ by: 'dates.start', on: ref, direction: 'desc' }],
      };
    }
    get swimmersQuery(): Query {
      const ref = this.swimmerRef;
      return {
        filter: { type: ref },
        sort: [{ by: 'lastName', on: ref, direction: 'asc' }],
      };
    }

    <template>
      <article class='sg'>
        <header class='sg-mast'>
          <h1 class='sg-wordmark'>{{if @model.welcome @model.welcome 'SURGE'}}</h1>
          {{#if @model.tagline}}<p class='sg-tagline'>{{@model.tagline}}</p>{{/if}}
        </header>

        {{!-- Singular spotlight — no plural-field wrapper, simple :deep override --}}
        {{#if @model.headlineMeet}}
          <section class='sg-featured'>
            <@fields.headlineMeet @format='embedded' />
          </section>
        {{/if}}

        {{!-- Dynamic section: every Meet in the realm, fitted, live --}}
        <section class='sg-section'>
          <h2 class='sg-section-title'>The calendar</h2>
          {{#let
            (component @context.prerenderedCardSearchComponent)
            as |PrerenderedCardSearch|
          }}
            <ul class='sg-meets'>
              <PrerenderedCardSearch
                @query={{this.meetsQuery}}
                @format='fitted'
                @realms={{this.realms}}
                @isLive={{true}}
              >
                <:loading>
                  <li class='sg-loading'>Loading…</li>
                </:loading>
                <:response as |cards|>
                  {{#each cards key='url' as |c|}}
                    <li class='sg-meets-cell'>
                      <c.component class='sg-card' />
                    </li>
                  {{else}}
                    <li class='sg-empty'>No meets yet.</li>
                  {{/each}}
                </:response>
              </PrerenderedCardSearch>
            </ul>
          {{/let}}
        </section>

        {{!-- Add one section per CardDef in the family --}}
      </article>

      <style scoped>
        /* Outer chrome — leave radius / border / shadow / opaque bg to the host */
        .sg {
          background: var(--paper, #F5F8FA);
          color: var(--ink, #0B1320);
          font-family: var(--font-body, system-ui, sans-serif);
          min-height: 100%;
        }
        .sg-meets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .sg-meets-cell { min-height: 200px; }
        /* Chrome override on the prerendered cards */
        .sg-section :deep(.boxel-card-container) {
          border-radius: 0;
          background: var(--card, #FFFFFF);
        }
        .sg-section :deep(.boxel-card-container--boundaries) {
          box-shadow: 0 0 0 1px var(--ink, #0B1320);
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof Surge> { /* brand card */ };
  static fitted   = class Fitted   extends Component<typeof Surge> { /* mini wordmark */ };
}
```

```json
// Surge/home.json — the canonical home instance
{
  "data": {
    "type": "card",
    "attributes": {
      "welcome": "SURGE",
      "tagline": "The youth swim meet platform.",
      "cardInfo": { "name": "SURGE — Home", "summary": "Realm home." }
    },
    "relationships": {
      "headlineMeet": { "links": { "self": "../Meet/mid-atlantic-senior-sectionals-2026" } },
      "cardInfo.theme": { "links": { "self": "../Theme/surge" } }
    },
    "meta": { "adoptsFrom": { "module": "../surge", "name": "Surge" } }
  }
}
```

**`@isLive={{true}}` is expensive — opt in deliberately, don't default to it.**

`@isLive={{true}}` subscribes the query to realm change events. Every time ANY card in the realm is created, edited, or deleted, the live query re-fetches and re-renders. For a Home with 4 prerendered sections all set to `@isLive={{true}}`, editing a single Swimmer somewhere else in the realm fires **4 re-fetches per save** — even though only one section's data actually changed. With the host's autosave on each keystroke, this can make unrelated edit forms feel sluggish because the Home tab is consuming CPU on every reindex.

```ts
{{!-- ❌ Default-on @isLive is a perf trap on multi-section homes --}}
<PrerenderedCardSearch @query={{this.q}} @realms={{this.realms}} @isLive={{true}} />

{{!-- ✅ Default to snapshot semantics. The query refetches on mount and when
       @query / @realms change. That's enough for ~all dashboards. --}}
<PrerenderedCardSearch @query={{this.q}} @realms={{this.realms}} />

{{!-- ✅ Only opt into live when the section genuinely needs to reflect
       changes the user makes in another tab without a manual refresh
       (e.g. a "live results" ticker during an active meet). --}}
<PrerenderedCardSearch @query={{this.q}} @realms={{this.realms}} @isLive={{true}} />
```

If you find yourself adding `@isLive={{true}}` to every section "just because," that's the signal to drop it from all of them and add it back to the one or two sections that genuinely benefit.

**Why `PrerenderedCardSearch` (display) instead of `getCards` (instances):**

| Use case | Pick |
|---|---|
| Showing the cards as themselves (fitted/embedded HTML) | `PrerenderedCardSearch` |
| Reading model values to compute aggregates (counts, sums, charts) | `getCards` |
| Both — list and aggregate | `getCards`, then render with `<@fields ...>` |

The home almost always wants the first. The host pre-renders each result on the realm side, so the home doesn't pay the cost of loading every model into memory. For a realm with hundreds of swimmers, this is the difference between snappy and unusable.

**Critical — apply the chrome contract:**

The home's outermost element (`.sg` in the example) MUST leave decoration to the host's CardContainer. No `border-radius`, no `border`, no `box-shadow`, no opaque `background` (`var(--paper)` is fine — the paper is the brand surface, not chrome), no `overflow`. Brand-specific outer treatment goes on the Theme card as `--radius`, `--background`, `--border`. See `boxel-ui-guidelines/references/delegated-render-control.md`.

**Critical — no plural-field wrapper for prerendered output:**

`PrerenderedCardSearch` does NOT wrap its `:response` in `.plural-field / .containsMany-field / .linksToMany-field` — that wrapper only appears for `<@fields.plural @format='...' />` direct rendering. With prerendered, you own the `<ul>` / `<li>` shell yourself, so `display: grid` on the `<ul>` works without any `display: contents` tricks. The chrome `:deep()` overrides still apply because each result renders inside its own `.boxel-card-container`.

**The three query traps:**

1. **`filter: { type: ref }` to select all cards of a type.** Never `filter: { on: ref }` — `on` is a scope for predicates, not a filter on its own. Writing `{ on: ref }` with no predicate returns zero rows.
2. **Custom-field sorts require `on: ref`.** Only `lastModified`, `createdAt`, and `cardURL` are valid sort keys without `on` (the `generalSortFields` list). Sorting on `lastName`, `dates.start`, anything custom — the sort expression MUST include `on: ref`.
3. **Use `codeRef(here, path, name)`, not raw URL construction.** And import `realmURL` as a Symbol from `runtime-common` — don't write `Symbol.for('realmURL')` (it produces a different Symbol that doesn't match what the host injected).

See `boxel/references/query-systems.md` for the canonical reference and `~/Projects/boxel/packages/runtime-common/query.ts` for the type definitions.

**Other gotchas:**
- `import.meta.url` works in `.gts` at runtime but TS complains — declare `const here: string = import.meta.url;` once at top with `@ts-expect-error` on the line above.
- Compound sort paths like `dates.start` work for fields-of-fields (`DateRangeField.start`).
- The home loads when `model.id` is undefined briefly — the realmURL getter handles this by returning `[]` instead of throwing, and `PrerenderedCardSearch` just shows `<:loading>` until realms is non-empty.
- If you want to open this card by default when someone visits the realm root, rely on `index.json`'s `CardsGrid` showing this as the first card (with a thumbnail + clear title).

## Host-mode click-through — MANDATORY for any app card that publishes

In the published Host mode, cards rendered inside `<:response as |cards|>` blocks do NOT click through to their isolated view by default. The host's in-app click-to-open machinery (`@context.cardComponentModifier`) doesn't run on the published static site. Visitors see beautifully rendered fitted tiles that do nothing on click.

**Fix: wrap each rendered card in an `<a href={{c.url}}>` overlay.** The overlay pattern keeps the underlying card render natural (no height-100% chain through component chrome) and just adds a transparent click target on top:

```hbs
<:response as |cards|>
  {{#each cards key='url' as |c|}}
    <li class='project-cell'>
      <c.component class='project-card-inner' />
      <a class='card-link' href={{c.url}} aria-label='Open card'></a>
    </li>
  {{/each}}
</:response>
```

CSS:

```css
.project-cell {
  position: relative;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.project-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10);
}
.card-link {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: block;
  text-decoration: none;
  color: transparent;
  cursor: pointer;
  border-radius: 2px;
}
.card-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
```

### Why overlay, not wrap

The first instinct is to wrap the card: `<a><c.component /></a>`. That breaks fitted cards because the anchor needs `display: block; height: 100%; width: 100%;` and the height-100% chain has to propagate through the component's outer chrome (`boxel-card-container`). The chain breaks silently and the rendered card collapses to zero height. Use the overlay pattern.

### The mode matrix

| Mode | What enables click | Mechanism |
|---|---|---|
| **Interact / Code** (in-app) | `{{@context.cardComponentModifier ...}}` on a `CardContainer` | Pushes the card onto the Boxel app's card stack |
| **Host** (published site) | `<a href={{c.url}}>` overlay | Plain browser navigation to the card's URL |

Complementary, not redundant. An app card that publishes AND is browsable in-app can stack both: the overlay anchor for Host clicks, the modifier on the inner CardContainer for in-app push. The anchor is inert in Interact mode (no navigation pane); the modifier is inert in Host (no Boxel app running).

### Verification

In Host mode, open dev tools, inspect a rendered tile. Look for an `<a href="https://.../<Type>/<slug>">` ancestor of the card's root element. If the only ancestors are `<li>` / `<div>`, the tile won't navigate. The `cards-grid` example in `boxel-catalog` (`components/grid.gts`) does NOT include this wrap — it's designed for Interact mode only. Don't copy from there directly for published-site app cards.

**Source / verified against:**
- `boxel-catalog/components/grid.gts` (the `CardsGrid` pattern this descends from).
- A swim-meet `Surge` home card (4 prerendered sections — Meets / Swimmers / Clubs / Results) is one worked example; ask the user for the current URL if you want to read it.
- `SearchResource` type — see `runtime-common/index.ts` in the boxel monorepo.

**See also:** [`show-card-list-with-views`](../show-card-list-with-views/) (the lower-level CardsGrid component), [`automate-linked-to-me-lookup`](../automate-linked-to-me-lookup/) (when you need models not just rendered HTML), [`boxel-ui-guidelines/references/delegated-render-control.md`](../../../boxel-ui-guidelines/references/delegated-render-control.md), [`boxel/references/query-systems.md`](../../../boxel/references/query-systems.md).
