## Use Pret UI and Boxel-UI Components

**Pret UI first.** Controls and display primitives come from Pret UI, one import per component from `@cardstack/pretui/components/<name>`:

```gts
import { Button } from '@cardstack/pretui/components/button';
import { Input } from '@cardstack/pretui/components/input';
import { Select } from '@cardstack/pretui/components/select';
```

**Important**: ALWAYS READ THE API before using a component. For Pret UI that is the `<name>.md` contract beside its `.gts`, with worked examples in `<name>.usage.gts`. For boxel-ui, read the component's signature in `@cardstack/boxel-ui/components`.

Use a boxel-ui component only where Pret UI has no equivalent yet; those are listed under "boxel-ui components with no Pret UI equivalent" below. Pret UI is growing, so check its component list before reaching for boxel-ui. Never hand-roll a raw HTML control when either library has a component for it.

### Pret UI replacements for boxel-ui components

Use the Pret UI component in the right column, not the boxel-ui one on the left. Their args differ (`@kind` becomes `@variant`, `@size='extra-small'` becomes `@size='xs'`, and so on), so read the Pret UI contract instead of carrying the boxel-ui args over.

| boxel-ui | Pret UI |
| --- | --- |
| `Button` | `Button` |
| `IconButton` | `IconButton` (required `@label`) |
| `CopyButton` | `CopyButton` |
| `BoxelInput` | `Input` |
| `EmailInput` / `PhoneInput` | `EmailInput` / `PhoneInput` |
| `BoxelSelect` / `BoxelMultiSelect` | `Select` / `MultiSelect` |
| `RadioInput` | `RadioGroup` |
| `Switch` | `Switch` |
| `FieldContainer` | `Field` |
| `Label` | `Label` |
| `DateRangePicker` | `DateRangePicker` |
| `Alert` | `Alert` |
| `LoadingIndicator` / `CircleSpinner` | `Spinner` |
| `ProgressBar` / `ProgressRadial` | `ProgressBar` / `ProgressRadial` |
| `SkeletonPlaceholder` | `Skeleton` |
| `Tooltip` | `Tooltip` |
| `Accordion` | `Accordion` |
| `Pill` (a status or tag value) | `Chip` |
| `Swatch` | `Swatch` |
| `Avatar` | `Avatar` |
| `EntityDisplayWithIcon` / `EntityDisplayWithThumbnail` | `EntityDisplay` |
| `Menu` | `Menu` |
| `Modal` | `Dialog` (`AlertDialog` for a destructive confirmation) |
| `ColorPalette` / `ColorPicker` | `ColorPalette` / `ColorPicker` |

### boxel-ui components with no Pret UI equivalent

Import these from `@cardstack/boxel-ui/components`.

**Layout & Containers:**
- `CardContainer` — wraps card content with correct border/shadow/padding. all cards are already wrapped in this.
- `FittedCard` — **the preferred starting point for `fitted` templates.** Slot-fill layout (`:placeholder`, `:badgeLeft`/`:badgeRight`, `:badgeRow`, `:eyebrow`, `:title`, `:subtitle`, `:meta`, `:footer`, `:image`, `:background`) that queries the host's `fitted-card` container internally and adapts across all 16 fitted sizes; tune via `--fc-*` custom properties. Hand-roll per `boxel/references/container-query-fitted-layout.md` only when the slot model can't express the design. Named blocks must be direct children of `<FittedCard>` — Glimmer rejects a `<:eyebrow>` wrapped in `{{#if}}`, so put the conditional inside the block (`<:eyebrow>{{#if @model.level}}<@fields.level />{{/if}}</:eyebrow>`) (an empty section collapses via the component's `:empty` rule). Leave a section out by not writing its block; `--fc-<section>-display: none` (image, subtitle, meta, footer, badge slots) hides one you do provide, typically per breakpoint.
- `GridContainer` — responsive grid layout
- `BoxelContainer` — generic container
- `ResizablePanelGroup` — resizable panel layouts
- `KanbanPlane` — lane-based drag/drop board with pointer + keyboard reordering, insertion gaps, ghost rendering, collapsed/hidden columns, and WIP limit display. Use pattern `layout-kanban-drag-drop`.

**Headers & Navigation:**
- `Header` — page/section headers
- `TabbedHeader` — headers with tabs
- `CardHeader` — card-specific header with icon, title, actions

**Buttons & Actions:**
- `ContextButton` — contextual action button (`@icon` for add, edit, close, delete, context-menu, context-menu-vertical; `@variant` for highlight, highlight-icon, ghost, destructive, destructive-icon)

**Display & Data:**
- `Pill` — only as a clickable pill (`@kind='button'`); a status or tag value is Pret UI `Chip`
- `RealmIcon` — realm icon display
- `FilterList` — flat or nested filter rows. Each `Filter` may carry a `count` (rendered at the row's end) and an `id` (the row's stable key; required when two filters can share a display name, and what keeps focus across a rebuild of the array). The `<:action as |filter|>` block renders a per-row control after the button, such as an `IconButton` with a `Tooltip`. Restyle through `--boxel-filter-*` knobs (`selected-background`, `hover-background`, `count-foreground`, …), never through its classes
- `SortDropdown` — sort controls
- `ViewSelector` — view mode toggle
- `BoxelDropdown` — dropdown container
- `Message` — chat/message bubbles
- `KanbanPlane` — preferred drag-and-drop interface for boards. Do not hand-roll pointer drag in card templates unless no boxel-ui component exists for the interaction.

### Don't neutralize a component — pick the variant

If styling a component requires cancelling its own defaults (`padding: 0`, `background: none`, `border: none` on its class), you picked the wrong component or the wrong variant. Each cancelling declaration is invisible coupling to the component's current internals: it rots silently when the component changes, and it hides the fact that a purpose-built variant exists. Read the component's contract first and look through `@variant`, `@tone` × `@appearance` and `@size` before writing a single override.

### Replacing a raw control: state picks the variant, size picks the size, knobs do the rest

When a raw `<button>` (or `<input>`, `<select>`) becomes a Pret UI component, the old hand-written CSS does not move onto the component's class. It gets re-expressed through the component's API, in this order:

1. **Each visual state is a treatment.** A selected tab, a filled call to action, a quiet row: those are `@variant` values (`primary`, `secondary`, `ghost`, `destructive`, `link`, …), or `@tone` × `@appearance` when no variant names the look, chosen per instance. A state that changes the look changes the variant: `@variant={{if isActive 'primary' 'ghost'}}`. Never keep an `.active` class that repaints background and text by hand; the component already owns those pairings and their hover states.
2. **The size is an `@size`.** `xs`, `s`, `m`, `l` and `xl` set the host font-size only; height, padding, gap and radius scale from it in `em`. `@shape` (`rounded`, `pill`, `square`) sets the corner shape.
3. **Whatever still differs goes through the component's per-instance custom properties, on your class.** `Button` reads `--pretui-button-h`, `--pretui-button-min-w`, `--pretui-button-px` and `--pretui-button-radius` on every appearance; `--pretui-button-bg` and `--pretui-button-fg` only on `accent` (`primary`, `destructive`) and `link`; `--pretui-button-secondary-bg` on `outlined` (`secondary`). A knob the chosen appearance does not read does nothing. Read the component source for the current list; the knobs are the API.
4. **Layout that belongs to the parent stays on your class as plain properties**: `position`, `margin`, `flex` sizing, a `transition: none`. Nothing that the component paints.

A rewrite that keeps `padding`, `font-size`, `font-weight`, `color` or `background-color` as plain declarations on the component's class, qualifies its selectors with a parent to out-rank the component's own rules, or adds a shared `font-family: inherit; line-height: inherit` reset over every converted control has not used the component. It has re-implemented the old button on top of it, and the two stylesheets now fight at every change to the component. Pret UI component styles sit in `@layer PretComponent`, so unlayered caller CSS always wins: an override never fails loudly, it just quietly replaces the component.

Compute a state once with `{{#let}}` and feed it to the variant, a `cn` modifier class and any `aria-current` or `aria-pressed`; an icon inside a labeled control is `aria-hidden`. Buttons that switch which panel shows inside one card are `Tabs` unless the tabs need icons or badges, which `Tabs` cannot carry (its options are `{ value, label }` only); a set of mutually exclusive values (a view mode, a unit) is a `SegmentedControl` with a `@label`. For worked examples, read the component's `<name>.usage.gts` beside its `.md`, and `<name>.examples.gts` where there is one. When a look cannot be reached through variants, tones, appearances, sizes and knobs, that is a gap in the component, not a license to override it: add the knob or variant to Pret UI.

**Component args are not portable between components.** Pret UI's `Button` takes `@href` to render an `<a>` and has no `@as`; boxel-ui's `@kind`, `@as` and `@rectangular` mean nothing to it. Never carry one component's arg names to another; check the signature.

### Drag/drop quality bar

For kanban/status/deal/task boards:

- Use `KanbanPlane` from `@cardstack/boxel-ui/components`.
- Persist placements by stable card id + column key + sort order, not by array index.
- Render child cards via `@fields` at fitted format so navigation, permissions, and field chrome remain intact.
- Include empty states, column counts, hidden/collapsed-column behavior, and WIP limits when the domain has limits.
- If changing the reusable component, require pure engine tests and live component tests.

### When a component is missing from both libraries

If no existing component satisfies your need, write a self-contained Glimmer component in the same file (or a co-located file) that is structured so it could be contributed to Pret UI later:

- Give it a clear, generic name (e.g. `SectionHeader`, `MetricTile`)
- Declare a typed `interface Signature` block
- Use only design tokens — no hardcoded colors
- Use `<style scoped>` so styles do not leak
- Keep component arguments minimal and semantic

Add a TODO comment noting it should be moved to `@cardstack/pretui/components` when it matures.
