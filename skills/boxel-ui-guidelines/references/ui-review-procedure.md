## UI Review Procedure

The order to work through when reviewing or updating a card template's UI. Run the whole list every time, whatever the request was phrased as: a "theming" request still gets the component and markup steps, and a "make this button a Button" request still gets the token steps. Report every hit; anything deliberately left alone is named in the report, not silently skipped.

### 0. Grep the mechanical tells first

Before reading, list the hits for each of these in the file. They set the size of the job and nothing on the list is a judgment call.

```
margin: 0  (on a p or heading rule)         cursor: pointer  (on a Button-hosted class)
align-items: center / display: inline-flex / font-family: inherit / :focus-visible  (on a Button-hosted class)
a class in <style> that no element in <template> carries
--_[a-z-]+: var(--       (a private variable holding a bare var(): step 4 says whether it is earned; calc() and color-mix() built on a token are fine)
--[a-z][a-z-]+: var(--   (on a component's own root, with no underscore: the alias layer, unless the name is a documented per-instance knob (steps 2 and 7), a Brand Guide custom variable declared once with its fallback, or the opt-out prefix of step 1)
var(--[a-z]+-[a-z-]+, var(--   (a private name read with a theme variable as its fallback)
color: var(--*-ink)  /  color: var(--*-foreground)   (on a descendant, not the surface root)
:deep(.boxel-card-container)   :deep(.field-component-card)   :deep(
font:                          [0-9.]+px (outside borders, outlines, underline offsets and CQ breakpoints; a var() fallback counts)
var(--[a-z-]+, #               #[0-9a-f]{3,8}                 rgba?(
<button                        <input                         <select
style='                        [0-9]v[hw]                     @media (other than prefers-reduced-motion)
<[A-Z][A-Za-z]*Icon (without width= and height=)
overflow-wrap: anywhere         word-break: break-all          word-break: break-word
@variant=                       (and any other argument a component's contract marks deprecated)
@field title = contains(        (fine as domain data, or as the field a cardTitle override reads; not as a copy of cardInfo.name)
{{#if @model.cardInfo.name}}  /  {{#if @model.cardTitle}}   (around cardTitle, which always renders)
```

### 1. Decide the theme posture, then hold it

Either the template follows the realm's theme, or it is pinned to a fixed theme. Pinning is done by rendering under a Theme card that does not change with the realm, and the template still reads the contract; hand-pointing roles at `--boxel-*` primitives under a private prefix is only for a component with no theme card to lean on. A template that pins its neutrals to literals but reads `--background` or `--primary` for one channel is neither: it only renders under one theme. Pick a side before changing a single value (see "Half-themed is neither" in `use-boxel-design-tokens-for-theming.md`). Chrome-like cards in the base realm are themed unless there is a written reason.

### 2. Colors

- Replace every private color name with the contract token for its role, read directly (`var(--foreground)`, `var(--card)`, `var(--hover)`, `var(--border)`), not through an alias layer.
- Remove every `var(--token, fallback)` on a contract token or a `--boxel-*` primitive.
- A private name with a theme variable as its fallback is the same alias layer, inlined at the use site: `color: var(--pretui-destructive-ink, var(--boxel-danger))` is `color: var(--destructive-ink)`. Read the contract token for the role directly, and drop both the private name and the fallback. This holds for every theme variable, not only colors: `var(--x-radius, var(--radius))` is `var(--radius)`, and `var(--x-shadow, var(--shadow-sm))` is `var(--shadow-sm)`. The one exception is a per-instance knob the component documents in its contract (`--pretui-button-radius`, `--pretui-button-h`): callers set those on purpose, so the knob stays, and only a fallback that bypasses the contract is corrected.
- Wherever a rule sets a surface, set its paired ink in the same rule, once, and let descendants inherit it. A `color:` on a child that repeats the surface's ink (`.setup-name { color: var(--attention-ink) }` under a bar already painted with the attention surface) is a miss: delete it, and if the surface root lacks the pairing, add it there. Neutral surfaces (`--canvas`, `--inset`, `--field`, `--hover`, `--stripe`, `--selected`) take `--foreground`.
- A hue used as text, icon, link or hover border is its `--*-ink`; the fill is for backgrounds only. Focus outlines are `--ring`. Selected rows are `--selected`.
- Tints come from `color-mix()` on the token over the surface it sits on, declared once on the root under the private prefix (`--_x-tint`); in a themed component they and motion durations are the only private variables color and motion get, apart from a component's documented per-instance knobs (step 7). Rules that must match a color read the same role token, which already keeps them together. Which metric variables stay is decided in steps 4 and 5.
- Nothing literal remains: not in gradients, masks, shadows or SVG fills. `black` and `white` are allowed only as a scrim or mask base.

### 3. Typography

- Split every `font:` shorthand into `font-size` / `font-weight` (and `line-height` only where it differs from the body role). The composite `--boxel-font-*` tokens are for host chrome only.
- Map sizes onto the ladder or a role: tracked uppercase kickers take the eyebrow role's size, weight, line-height and letter-spacing; small data takes `--boxel-font-size-2xs` / `-xs`; body-adjacent text takes `-sm`; anything larger takes a heading role token.
- `h1`–`h3`, `p` and `small` already carry their roles from `CardContainer`. Delete the type declarations on them unless the element uses a different role than its tag; keep only color or layout.
- A mono register is `font-family: var(--font-mono)`.

### 4. Spacing, radius, shadows

- Padding, gap, margin and offsets take `--boxel-sp-*`; a negative offset and the padding it counters read one private variable when both are the component's own, `calc(-1 * var(--_x-bleed))` against `var(--_x-bleed)` (the alias bullet below says why); against padding the component doesn't declare, such as the `CardContainer`'s, it negates the same `--boxel-sp-*` step.
- Radii take `--boxel-border-radius-*`; the base radius on a child card is already the theme's, so do not restate it.
- Shadows take `--shadow-*`.
- A private variable whose value is just a contract token or a `--boxel-*` primitive (`--wp-radius: var(--boxel-border-radius-lg)`) is an alias layer: it buys nothing and hides which token a rule reads. Delete it and read the token at each use site. A variable the component keeps for itself is private and takes the `--_` prefix under the component's name (`--_x-bleed`): a bare `--x-*` name on a component's root is a knob a caller may set, so it exists only when the component documents it. What earns a private variable is a value the system has no name for — a metric off the ladder, a fluid `clamp()`, a tint, a duration — or a metric several declarations must change together to stay correct: a negative margin and the padding that cancels it both read one `--_x-bleed: var(--boxel-sp-sm)` (`x` stands for the component's name). That name records the coupling, so a later edit to one use can't silently break the other; reading the token at each site loses it. Being read in several places is not enough: keep the alias only when its uses must change together, and delete it when they merely share a value today. This is a metric rule: in a themed component colors never take it, because rules that must match a color read the same role token (step 2). A whole private scale is that case only when its steps do not land on the ladder; check the values before assuming either way.
- Stays in px: borders and rules at any width, outlines and their offsets, text-decoration thickness and underline offsets, sub-pixel transforms. Container-query breakpoints may stay in px.
- Nothing else is in px: no font size, padding, gap, radius, width or height, and no px inside a `var()` fallback. `var(--text-ui-md, 12.5px)`, `var(--space-4, 11px)` and `border-radius: 6px` are all hardcoded px: replace each with the ladder or role token it stands for (`var(--boxel-font-size-sm)`, `var(--boxel-sp-sm)`, `var(--boxel-border-radius-sm)`), the nearest step when none matches exactly. Count every px hit from step 0 that falls outside the exceptions above, including ones the change did not introduce, and report each one.

### 5. Geometry and icons

- Fixed widths and heights the layout is built around (rails, search boxes, column templates, max-widths) are hoisted onto the root as private rem variables (`--_x-rail-w`) when their value is off the ladder; one that lands on a `--boxel-*` step reads the token in place (step 4). Small dots and boxes are rem in place.
- Long words and identifiers wrap with `overflow-wrap: break-word`, paired with `min-width: 0` on the flex or grid item that holds them. `overflow-wrap: anywhere` also counts every character as a break when sizing the box, so in a content-sized track it can collapse to one character wide; use it only when that shrinking is the point. `word-break: break-all` breaks every word, not just the ones that overflow, and `word-break: break-word` is a deprecated, nonstandard value; replace both.
- Icons get `width` and `height` attributes on the component and no size in CSS. CSS on an icon is for color only, and usually inherits.
- No `vh`/`vw`; the isolated root is `height: 100%; overflow-y: auto`.

### 6. Child cards and host DOM

- A child card's chrome is styled through a `class` on its component (`<item.component class='…' />`, `<@fields.x class='…' />`, `<Item class='…' />` in a loop), which lands on its `CardContainer`. Never `:deep(.boxel-card-container)` or `:deep(.field-component-card)`.
- The host's boundary ring already draws a 1px `--border` edge; do not add a border on top. When the parent draws its own edge, shadow or larger radius, pass `@displayContainer={{false}}`.
- The card under review is a child card too: each format's outermost element follows the per-format table in `delegated-render-control.md` ("Per format — what's safe and what isn't on the outermost element"), and the isolated root is the page, not a smaller painted box inside it. A fitted view of standard pieces is a `FittedCard`.
- What `:deep()` is left for: host-generated DOM with no class hook, such as the SVG inside an icon rendered from an HTML string. Reaching into another component's internals (a layout's sidebar or header) is a missing argument on that component, not a `:deep()` rule.

### 7. Components

Controls come from Pret UI, imported by name from `@cardstack/pretui/components/<name>` (`import { Button } from '@cardstack/pretui/components/button';`). Read the component's contract in the `<name>.md` beside its `.gts` before using it.

- Raw `<button>` becomes `Button`; icon-only buttons become `IconButton` with its required `@label` and a `@cardstack/boxel-icons` glyph as the child; raw `<input>` becomes `Input`; raw `<select>` becomes `Select`. Mutually exclusive choices styled as buttons are a `SegmentedControl` with a `@label`, radio buttons a `RadioGroup`, an action menu a `Menu`.
- Each visual state becomes a treatment chosen per instance: `@tone` (`neutral`, `primary`, `info`, `success`, `warning`, `danger`, `attention`) × `@appearance` (`accent`, `filled`, `outlined`, `filled-outlined`, `plain`, `link`), for example `@appearance={{if isActive 'accent' 'plain'}}`. Never pass a deprecated argument: `@variant` is deprecated sugar over the two axes (`primary` is `primary`/`accent`, `secondary` is `neutral`/`outlined`, `ghost` is `neutral`/`plain`, `destructive` is `danger`/`accent`), so replace it with the pair, and treat any other argument a component's contract or usage page marks deprecated the same way. The size is `@size` (`xs`, `s`, `m`, `l`, `xl`), which sets font-size only; height, padding and radius scale from it in `em`. Shape is `@shape` (`rounded`, `pill`, `square`). A button that navigates takes `@href` and renders an `<a>`; a pending action takes `@busy`, with `@busyLabel` when the label doesn't say so. Whatever still differs goes through the component's per-instance custom properties on your class (`--pretui-button-h`, `--pretui-button-min-w`, `--pretui-button-px`, `--pretui-button-radius` on every appearance; the color knobs depend on the appearance, see "Replacing a raw control" in `use-boxel-ui-components.md`). Plain `padding`, `font-*`, `color` or `background-color` on a component's class, a parent-qualified selector written to out-rank the component, or a blanket `inherit` reset over converted controls means the component has not been used.
- Compute a state once with `{{#let}}` and feed it to both the variant and a `cn` modifier class; icons inside a labeled control are `aria-hidden`.
- A look that no variant, tone, appearance, size or knob can reach is a gap in the component. Add the knob or variant to Pret UI rather than overriding.

### 7b. Subtract what is already provided

A template's `<style scoped>` sits on top of three layers that already style it. Every declaration that repeats one of them is dead weight that hides the real rules and rots when the layer changes. Read the three layers first, then walk each rule and delete the repeats:

- **`CardContainer`** (`packages/boxel-ui/src/components/card-container/index.gts`): background and foreground pair, the body typography role on the root; `h1`–`h6` and `p` margins zeroed; `h1`–`h3` heading roles; `small` the caption role. So `margin: 0` on a `<p>` or heading rule and body-size declarations on plain text are repeats. Leave `font-family: var(--font-sans)` alone: whether it repeats depends on the theme (see **Font stacks** in `theme-token-contract.md`). The one exception is a scheme island inside the card (an element stamped with `data-theme`; see "Scheme islands" in `boxel/references/theme-design-system.md` §3.3): its tokens flip below CardContainer, so the island's root sets `background-color: var(--background); color: var(--foreground)` (or the `--card` pair) itself, or the card's own surface shows through unchanged. A `.dark` class used for this is converted to `data-theme`.
- **`global.css`** (`packages/boxel-ui/src/styles/global.css`): `cursor: pointer` on `button:hover:not(:disabled)` and `[role='button']`, focus outlines on `button:focus` and `a:focus`, link colors. So `cursor: pointer` on a raw button or `[role='button']` rule is a repeat.
- **The component the class lands on** (`Button`, `IconButton`, `Input`, `Select`, `SegmentedControl`, …): read its `<style scoped>` in `packages/pretui/components/<name>.gts`. `Button` already sets `display: inline-flex`, `align-items: center`, `justify-content: center`, `font-family: inherit`, `cursor: pointer`, its `:focus-visible` ring (`2px solid var(--ring)`, 2px offset), and `opacity` with `cursor: default` when disabled. So on a Button-hosted class, `align-items: center`, `display: inline-flex`, `font-family: inherit`, `cursor: pointer`, and a plain `:focus-visible { outline … }` are repeats; only a ring that must differ (an inset `outline-offset: -2px` inside a clipped box) earns its rule.

Without a monorepo checkout (an in-app assistant working through `realm.fs`), these paths are not readable; work from the component's `<name>.md` contract and the list above instead.

Two mechanical checks close the step:

- **Dead selectors**: every class in the stylesheet must appear in the template. Diff the two sets; a selector with no element (a renamed class, a removed state) is deleted, not kept "in case".
- **Repeated declarations**: count identical `property: value` lines across rules. A declaration that appears a dozen times is either a provider repeat (delete it) or a candidate for one shared rule or a root variable.

### 8. Markup and accessibility

Headings for titles, `<p>` for prose, `<header>` for intro blocks, `role='toolbar'` with `aria-label` for control groups, `<output>` for readouts, `aria-label` on icon-only controls, `aria-hidden` on decoration. `data-test-*` last on every element. DOM queries scoped to the card's own container.

A card that handles Escape itself (dismissing a dropdown, clearing a search) must call `stopPropagation()` on the keydown, and the handler must sit on every element that can hold focus in that widget, not only the text input. The operator mode listens for Escape at the document and closes the card when the target is anything other than an input, textarea or select, so an unstopped Escape from a focused result button closes the whole workspace.

### 9. Verify and report

- Re-run the step 0 greps; every count should be zero or named.
- Re-run the dead-selector and repeated-declaration checks from step 7b.
- Lint: `npx boxel file lint` for a realm card (see `skills/boxel/references/lint-workflow.md`), `pnpm lint` in the package for host or base-realm code, then Prettier. None of them parses the CSS inside `<style scoped>`, so after any scripted deletion of a rule or `@keyframes` block, check that every style block's braces balance; a stray `}` surfaces only at runtime as `<css input>:N: Unexpected }` when the card loads.
- View the card under the default theme and under a dark or branded theme. If you cannot, say the change is unverified.
- The report lists what changed per step, the visible differences to expect, and every remaining item by name with the reason it was left.
