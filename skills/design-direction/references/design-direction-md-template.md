# DESIGN-DIRECTION.md — {unit name}

Written by `design-direction` on {date}. Builder: follow this before styling — and hardcode
everything; the theme is extracted later. Reviewer: tick the acceptance lines first.

## Brief
- **Unit**: app | card | component | field
- **Who uses it**: {one line}
- **First action**: {one line}
- **Feeling it should leave**: "{quote}"
- **Inherits from**: {parent DESIGN-DIRECTION.md, or none}

## Style: {name}
- **Inspirations**: {composed for this unit in Phase 4, or researched from the style the user named}
- **Visual DNA**: {the cues that make it recognisable}
- **Style controls**: motion character {…} · type system {…} · colour strategy {…} · spatial model {flat | layered | perspective | scene} · visual density {…}
- **Reference**: {one real site, poster or screenshot — URL or file}
- **Type**: display {font} · body {font} · weight contrast {e.g. 700 vs 400} · hero size jump {e.g. 56px vs 16px}
- **Palette**: {colours by role, as hex — these are written into the templates directly}
- **Style source**: boxel brand guide | derived from the domain | BrandGuide card {which}
- **Signature material**: {the one thing worth screenshotting} — L3, and the only L3
- **Ornament baseline**: {restrained | balanced | rich} — read off the visual DNA line: "{which line}"
  - *If rich*: troughs {which surfaces sit one rung below, and why} · how the signature still wins {…} · animated grounds allowed per screen {n}
- **Not**: {what this style refuses}

**Narrative arc** (optional — one per unit, `isolated` of a routed or `prefersWideFormat` page only)
- **Still frame**: {what the page is with no motion at all — this must stand alone}
- **Beats, in order**: {1. what arrives / moves first} → {2.} → {3.}
- **Total budget**: {time until the fold has settled} · {scroll consumed by the arc}
- **Ways and achievability**: {way — CSS | library → capability {name}, sourced by the build | not available}
- **Serves**: {the signature treatment it reveals — it is never a second one}
- **Reference for the motion**: {URL, or none — kept so "moves like it" can be checked}
- **Numbers**: `MOTION.md`, written by [`motion-authoring`](../../motion-authoring/SKILL.md) — this block never carries eases, offsets or per-beat durations

**Ornament budget** — the rung every surface is built at, decided here, not after a complaint

| Surface | Rung | Moves | Contrast / motion answer |
|---|---|---|---|
| {screen region, or card format} | {L0 – L3} | {—, or: icon, eyebrow, ground …} | {scrim / clear zone / reduced-motion resting state} |
| {… one row per surface in the inventory} | | | |

**Anti-patterns** — the defaults a model slides into; the reviewer fails any of these on sight
- [ ] no Inter, Roboto or system-ui as the display font
- [ ] no purple-on-white, no blue-to-purple gradient
- [ ] no card inside a card, no bordered box inside a bordered box
- [ ] no row of equal-width boxes
- [ ] no emoji as icons — icons come from `@cardstack/boxel-icons`
- [ ] no centred hero with one generic CTA beneath it, unless the layout chose exactly that
- [ ] {any this style specifically refuses}

## Screens

### {Screen name} — {screen type}
**Primary action**: {what the user does here first}
**Blocks consumed**: {cards, fields, components and their formats}

**Layout: {direction} — {name}**
- **Why**: {one line — which must-contain block leads, and why this direction serves it}
```
{ASCII with ratios}
```
- Dominant object: {what} · {share of viewport}
- Reading order: {single column | F | Z | spotlight}
- Primary action: {where}
- Above the fold at 1200×700: {list}
- At 400 wide: {how it stacks}
- Gravity wells kept on purpose: {none | which, and why}
- Layout controls: stage type {…} · information architecture {…} · content priority {…} · responsive {…}
- Width: `prefersWideFormat` {true | false} — {one line: would `isolated` look broken or cramped at ~720px, and why}

**Interaction**

| Action | Way | Trigger → response | Budget | Reduced motion | Ready component |
|---|---|---|---|---|---|
| {action} | {name} | {trigger → response} | {ms, easing} | {fallback} | {name or —} |

**Enrichment** (corrections — filled in when a built surface is called too plain, or too busy)
| Surface | Rung | Moves | From which line of the visual DNA | Contrast / motion answer |
|---|---|---|---|---|
| {block or format} | {L0 → L1, or L2 → L1} | {icon, eyebrow, ground … — or what was removed} | {…} | {scrim / clear zone / reduced-motion resting state} |

**Beats**
- Moment: {the action that matters most, and its staged way}
- Empty state: {the invitation, and the action beside it}
- Completion: {what is seen when the job here is done}

**Acceptance lines** — tickable without taste
- [ ] {e.g. members grouped by tier; the top tier's tile is double width}
- [ ] {e.g. opening a member keeps the grid visible}
- [ ] {e.g. no region row has three or more equal-width boxes}
- [ ] {e.g. the metrics strip is grounded (L2) and still quieter than the hero}

{repeat per screen}

## Set acceptance lines (apps)
Checked across every screen at once by `design-review set`. These are what catch five screens that
are each fine alone.
- [ ] {e.g. one display face throughout; the body face never sets a headline}
- [ ] {e.g. the accent appears only in the primary-action role, on every screen}
- [ ] {e.g. every eyebrow is uppercase at the same tracking}
- [ ] {e.g. opening an item is the same way on every screen}
- [ ] {e.g. every empty state names its first action}
- [ ] {e.g. exactly one surface in the whole unit is L3; no other surface out-shouts it}
- [ ] {e.g. rich baseline: every panel is grounded, and the two text-heavy surfaces named as troughs are not}

## Views (cards)
**Width**: `prefersWideFormat` {true | false} — {one line of reason}. Upstream's
[`prefers-wide-format.md`](../../boxel/references/prefers-wide-format.md) owns the rule.

| View | Carries | Dominant | Media | Drops |
|---|---|---|---|---|
| isolated | the full narrative | | {at scale — or *none, and why*} | |
| fitted | the headline of the story | | {focused crop, or the mark fallback — never a shrunken hero} | |
| embedded | identity | | {square or fixed-ratio crop, or none} | |
| atom | presence | | {none — the style survives as wording} | |
| edit | the same language in form terms | | {the field's own edit control} | |

**Media is a required answer, not an optional one**, for any unit with an image-bearing field.
Upstream's rule for the smallest formats: *"Hide the hero media in fitted"* is an anti-pattern, and
a stock photo at fitted size reads as lorem ipsum — use a focused crop of the hero or a brand-mark
fallback. A row left blank on a unit that has imagery is a decision nobody made.

`fitted` enrichment happens **inside** upstream's ladder: which field leads at each size, which field
sits in which region, the single mark where the head is all there is, whether there is a hero, and
ornament within a region — tuned via `--fc-*` / `@container fitted-card`. The breakpoints, the regions
each size shows and `FittedCard` itself are upstream's
([`container-query-fitted-layout.md`](../../boxel/references/container-query-fitted-layout.md), read live at
build time); never restate its numbers here and never ask for a region a size does not have.

## States (components)
| State | Presents | Way |
|---|---|---|
| rest / hover / active / loading / empty / error | | |

## Presentations (fields)
| Presentation | In a form | In a card |
|---|---|---|
| edit / embedded / atom | | |

## Build order
Read at every step below. Everything before theming is **hardcoded** — real hex, named fonts, real
sizes, real sample content, no `var(--*)`, no queries, no commands — on **real CardDefs with real
links** from the first screen. Defer style and data volume, never structure.

> **Diverges from the design-playbook.** The playbook's Stage 4 derives `fitted` and `embedded`
> from the tokenized `isolated`. Here every linked CardDef's five formats are built in the batch,
> before theming, because a format derived after the user locked the language is a format the user
> never judged. Utility cards with no design unit follow the playbook's order instead.

- **Plan**: the [`catalog-reuse`](../../catalog-reuse/SKILL.md) search, then playbook Stage 0 —
  including the Stage 0f content matrix for every CardDef the screens link to.
- **First screen**: {which — the screen with the most of the domain's data on one surface, holding
  the primary action; tie-break to the one rendering the most linked CardDefs. Usually Home / desk
  for an app, the richest record when Home is a thin list} — {one line of reason}. Playbook Stage 1
  as a real `.gts`, every primary action a real control. Push, stop. *Gate:* the user has looked and
  the language is locked. Layout may be overruled here; rebuild this screen only. Then
  `design-review` on this screen.
- **The batch**: {remaining screens, in order} **and all five formats of every linked CardDef —
  `isolated`, `embedded`, `fitted`, `atom`, `edit`** — built against the content matrix, static,
  same language, one CardDef at a time, reported as counts (CardDefs × formats built of planned).
  Push. Then `design-review set`, then `design-review card` per linked CardDef. *Gate:* the set
  lines and each screen's and card's own.
- **Theming and wiring**: playbook Stages 2–3 — extract the theme from the hardcoded values →
  tokenize pixel-identical → live queries → the full sample-data set → every action wired to the
  mechanism its content contract declared. *Gate:* clean against upstream's
  [`theme-token-contract.md`](../../boxel-ui-guidelines/references/theme-token-contract.md) —
  checked here, never earlier.
- **Finish**: lint and push, per upstream [`boxel`](../../boxel/SKILL.md)'s lint workflow.
