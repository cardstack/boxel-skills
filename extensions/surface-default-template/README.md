---
validated: source-proven
---

# surface-default-template — Replace Boxel's default isolated/edit template with a surfacified one

**What this gives you:** A drop-in replacement for Boxel's single shared `isolated` + `edit` template that wraps each generic zone (header / body / footer) in surface foundation blocks. Cards opt in per-CardDef without changing the base realm — `static isolated = SurfacifiedTemplate; static edit = SurfacifiedTemplate`.

**When to use:** You want focus-tree keyboard nav, lift-based inline editing, and surface theming on a card without writing a bespoke `isolated` component. The surfacified template still iterates fields generically — same way the original does — so any CardDef schema works.

**The insight:** Boxel's `DefaultCardDefTemplate` is one file (`packages/base/default-templates/isolated-and-edit.gts`) used by every CardDef. Forking it once + surfacifying yields a reusable replacement that gives every card surface affordances. The fork pulls in `Header` + `FieldContainer` from `@cardstack/boxel-ui/components`, iterates `@fields` minus a small exclude list (`id`, `cardInfo`, computed, `theme`), and wraps the result in `<Layout>` / `<Pane>` / `<Form>` / `<Cell>` / `<Run>`.

**Recipe shape:**

```
<realm>/default-card-surface/
├── index.ts          # re-exports SurfacifiedTemplate
├── template.gts      # the forked + surfacified component
└── card-info.gts     # forked CardInfo view+edit (header thumbnail/title/desc)
```

**Surface mapping in the fork:**

| Original element | Surface kind | Identity |
|---|---|---|
| Outer `<div>` | `layout:card` | The root layout |
| `<Header>` | `pane:header` | One navigable block (Tab unit) |
| `<section class='own-display-fields'>` | `form:fields` | Heterogeneous labeled slots |
| Each `<FieldContainer>` | `cell:fields/<key>` | Focusable editor wrapper |
| Inner `<@fields.foo />` | `unit:fields/<key>/value` | Atomic interactive element |
| `<footer class='notes-footer'>` | `pane:footer` | Footer block |
| Notes `<FieldContainer>` | `cell:footer/notes` | Trailing cell |

**Gotchas:**
- The original uses `<style scoped>`. Boxel's `glimmer-scoped-css` doesn't propagate the scope hash into inner GlimmerComponent classes — the fork drops `scoped` (or moves to themed CSS variables).
- For `form:fields`, *not* `outline:default` or `grid:fields` — the body is heterogeneous (named slots), so it's a form. The plan doc `13-form-surface-type.md` in the workspace's surfaces source realm covers the taxonomy.
- Theming flows through Boxel's existing chain (`--background`, `--muted`, `--border`, `--radius`) — don't invent a parallel `--surface-*` namespace.

**Source:** the workspace's surfaces source realm contains the plan `12-surfacify-default-card-template.md` and the implementation at `default-card-surface/template.gts`.

**See also:** `library-surfaces`, `outline-panel-toggle`, `theme-css-token-redefinition`.
