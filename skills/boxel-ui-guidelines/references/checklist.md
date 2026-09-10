## Checklist

Before finalizing any card template, verify:

- [ ] No raw `<button>` — use `<Button>` component
- [ ] No raw `<input>` — use `<Input>` or `<FieldContainer>` + `<Input>`
- [ ] No raw `<select>` — use `<Select>` or `<MultiSelect>`
- [ ] No hard-coded colors — use CSS custom properties
- [ ] Semantic theme variables (`--background`, `--foreground`, `--primary`, etc.) used where applicable
- [ ] Scoped styles use `<style scoped>` in templates
- [ ] No `@import url(...)` inside `<style scoped>` — font imports belong in the Theme card's `cssImports` field
- [ ] Semi-transparent colors use `color-mix(in oklch, ...)` not `rgba()`
- [ ] No fixed widths that ignore available space — use relative units or `max-width`
- [ ] Responsive layout uses `@container` queries, not `@media` viewport queries or `vw`/`vh` units
- [ ] Icons and SVGs never use hardcoded hex fills — color them with a foreground token (`--muted-foreground`, `--foreground`, or the `--*-foreground` paired with their surface), or leave them uncolored to inherit `currentColor`
- [ ] No action/surface token (`--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`) used as a foreground — checked for text and equally for icon `color`/`stroke`/`fill`, borders, and rules. Each token paints; its `--*-foreground` writes
- [ ] Every text/icon color sits on a surface the theme guarantees it against — the `--*`/`--*-foreground` pairs, `--foreground` on the neutral surfaces, `--muted-foreground` and the `--*-ink` tokens on `--background`/`--card`/`--muted`; anything else is unguaranteed and should be restructured onto a guaranteed pair
- [ ] `font-size` takes `--boxel-font-size-*`; the composite `--boxel-font-*` goes only in the `font:` shorthand, and only for Boxel chrome
- [ ] `background-color` for plain colors; the `background` shorthand only for images, gradients, multi-property sets, or an intended full reset
- [ ] No hardcoded fallbacks on theme/semantic tokens (`var(--primary, #6366f1)` is a violation — the token is always defined). Locally-defined component variables are declared once (with defaults) on the parent container and referenced bare in descendants; conditionally-existing tokens (`--boxel-fs-*`, `--font-serif`) get their one fallback at that parent declaration. Falling back to another CSS variable is fine: `var(--token, var(--other-token))`
- [ ] No deprecated `xx*` token names — use the digit forms (`--boxel-sp-2xl` not `--boxel-sp-xxl`, `--boxel-border-radius-2xs` not `-xxs`, `--boxel-icon-2xs` not `-xxs`); check the `deprecated - Do Not Use` block in boxel-ui `variables.css` for the current list
- [ ] No `font:` shorthand with composite `--boxel-font-*` tokens on themeable content — it pins the fixed Boxel family and stomps the theme's `--font-sans`; use individual `font-size`/`font-weight`/`line-height` (shorthand is fine where Boxel chrome styling is the intent)
- [ ] Hardcoded metrics (raw font-sizes, widths/heights, border-radii) hoisted into component-prefixed custom properties on the component root, not scattered as literals
- [ ] Card titles render `<@fields.cardTitle />` (or `@model.cardTitle`) — no `{{if @model.title @model.title 'Untitled Foo'}}` hand-rolled fallbacks. A domain `title` field (blog-post title, job title) is fine, but don't declare `title` just to name the card — that's `cardInfo.name`/`cardTitle`
- [ ] Semantic HTML: headings for titles, `<p>` for prose, `<header>` for intro blocks, `role='toolbar'` + `aria-label` for control groups, `<output>` for readouts, `aria-label` on icon-only buttons, `aria-hidden` on decoration; divs only for pure layout geometry
- [ ] `data-test-*` attributes are absolutely last on an element, after all other attributes and modifiers
- [ ] DOM queries in interactions/animations are scoped to the component's own subtree (`element.closest('.boxel-card-container')` as query root), never the document — the same card can render in multiple stacks on one page; JS query hooks are dedicated data attributes, not class names and not `data-test-*` (tests only)
- [ ] Prefers `<@fields.field />` for all simple field rendering; `@model.x` for conditionals, HTML attributes, context-specific fallback value, and JS getters
- [ ] Custom HTML/CSS replaced with existing boxel-ui components wherever possible
- [ ] No overrides that cancel a boxel-ui component's own defaults (`padding: 0`, `background: none`, `border: none` on a `Pill`/`Button`) — pick the `@kind`/`@variant`/`@size` that already has no chrome (e.g. `Button @kind='link-muted'`) and keep only genuinely bespoke declarations
- [ ] Chrome on a single linked card is styled through a class on `<@fields.link class='…' />` (forwarded to its `CardContainer` via `...attributes`), not through `:deep(.boxel-card-container)`
- [ ] `:deep()` / `display: contents` used only on host-generated field DOM — a wrapper FieldDef you own (especially a `containsMany` of wrappers each holding one item, or anything needing a cross-scope selector into a child's `<style scoped>`) gets deleted, not flattened
- [ ] Kanban/status boards use `KanbanPlane` and persisted placements; no hand-rolled pointer drag in card templates
- [ ] Any new reusable component has a typed `Signature`, uses design tokens, and is noted with a TODO to contribute to `@cardstack/boxel-ui/components`
