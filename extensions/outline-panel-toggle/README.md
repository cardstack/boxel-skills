---
validated: source-proven
---

# outline-panel-toggle — Add an outline-panel axis orthogonal to format

**What this gives you:** A second display axis on any surfacified card: outline ON shows a TOC sidebar mirroring the focus tree; outline OFF gives the canvas full width and fields reflow into multi-column layouts via container queries. The outline state persists across format flips (view ↔ edit).

**When to use:** Long cards, documents-as-cards, or cards with deep field trees where the user benefits from an at-a-glance map of what's there. Pairs especially well with `surface-default-template`.

**The insight:** The two axes (format × outline) are orthogonal. You can flip view→edit and the outline stays open. The field reflow on the right side is **not** template-driven — the form body declares `container-type: inline-size`, so narrowing the canvas (because the sidebar appeared) automatically collapses any 2-col field grid back to 1-col without the template branching on outline state.

**Architecture trick:** Sibling surface folder, not a fork.

```
<realm>/
├── default-card-surface/        ← the baseline surfacified template
│   ├── index.ts
│   └── template.gts
└── outlined-card-surface/       ← extends, doesn't fork
    ├── index.ts                 ← re-exports OutlinedCardTemplate
    ├── template.gts             ← baseline + one wrapper around the body
    ├── outline-panel.gts        ← the sidebar component
    └── outline-reader.ts        ← focus-tree → outline data
```

The canvas portion of `outlined-card-surface/template.gts` is byte-identical to `default-card-surface/template.gts` plus a wrapper div + the OutlinePanel component when outline is ON.

**The 2×2:**

|                     | Outline OFF                          | Outline ON                                  |
|---------------------|--------------------------------------|---------------------------------------------|
| **View** (isolated) | Full-width canvas; fields multi-col  | Sidebar + narrow canvas; fields single-col  |
| **Edit**            | Full-width form; fields multi-col    | Sidebar + narrow form; fields single-col    |

**Gotchas:**
- The outline state needs to persist somewhere — `@tracked` on the template component is the simplest place. Don't store it on `@model` (it's UI state, not card data).
- The TOC reads from the **focus tree**, not the field list — so it reflects actual navigable surfaces, including hierarchies (compound fields, sub-forms, grids).
- Container queries (not media queries) drive the reflow — your form's outer container must declare `container-type: inline-size`.

**Source:** the workspace's surfaces source realm contains the plan `14-outline-toggle.md`, the implementation at `outlined-card-surface/template.gts`, and the sidebar at `outlined-card-surface/outline-panel.gts`.

**See also:** `surface-default-template`, `library-surfaces`.
