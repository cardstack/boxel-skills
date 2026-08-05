## Use Container Queries, Not Viewport Units

Cards are placed inside containers that may be much smaller than the viewport. Always use CSS container queries for responsive layout instead of viewport-based media queries or `vw`/`vh` units. Use container query units instead of `vw` inside `clamp()`:
- **Fitted** (`container-type: size`): prefer `cqmin` — scales to the smaller of width or height, preventing overflow in the constrained dimension
- **Embedded / Isolated** (`container-type: inline-size`): use `cqi` — only the inline axis is available

The host `field-component` provides named containers automatically. **For fitted templates, follow the Boxel fitted implementation standard in `boxel/references/container-query-fitted-layout.md`**: the host establishes a `size` container named `fitted-card` around every fitted template — query it (`@container fitted-card (...)`); never create your own container on the root (the child contract in `delegated-render-control.md` forbids `container-type`/`container-name` there). For standard compositions, prefer the `FittedCard` component from `@cardstack/boxel-ui/components`, which implements those queries internally.

The host-provided named containers:

| Format | Named container | Container type |
|---|---|---|
| Fitted | `fitted-card` | `size` (both axes — width and height breakpoints both matter) |
| Embedded | `embedded-card` | `inline-size` (width only) |

```css
/* Fitted — query the host-provided container */
@container fitted-card (max-width: 150px) and (max-height: 169px) { ... }

/* Embedded — named or anonymous both work */
@container embedded-card (max-width: 400px) { ... }
```

For isolated templates, the parent does not provide a named container — declare `container-type: inline-size` with a name on your own root element and use that name in `@container` rules.

### Override tokens in the query, not the rules

When a value changes at a breakpoint, declare it once as a custom property on the composition root and have the `@container` block reassign only the property. Do not re-declare the rule that consumes it.

**Wrong** — the same value lives in two rule blocks per breakpoint, and every consuming rule has to be repeated:
```css
.meta-strip { gap: 1.25rem 2.5rem; }
@container hero (inline-size <= 500px) {
  .meta-strip { gap: 1.125rem 1.5rem; }   /* duplicated selector + property */
}
```

**Right** — the breakpoint block is a short list of value changes:
```css
.hero-inner {
  --meta-strip-gap: 1.25rem 2.5rem;
  --meta-strip-margin-top: 4.5rem;
}
.meta-strip {
  gap: var(--meta-strip-gap);
  margin-top: var(--meta-strip-margin-top);
}
@container hero (inline-size <= 500px) {
  .hero-inner {
    --meta-strip-gap: 1.125rem 1.5rem;
    --meta-strip-margin-top: 3.5rem;
  }
}
```

This keeps each responsive value in one place, makes the breakpoint block readable as "what changes at this size," and scales without duplicating selectors as breakpoints accumulate. Declare the defaults on the root per the fallback rule in `use-boxel-design-tokens-for-theming.md` — bare `var()` reads below, no inline fallbacks.

**Named containers are safer in nested situations.** An anonymous `@container` matches the nearest ancestor with any `container-type`, which could be an unintended intermediate container. `@container fitted-card (...)` skips anonymous containers and always resolves to the nearest ancestor with that specific name — so nested fitted cards each correctly target their own wrapper.
