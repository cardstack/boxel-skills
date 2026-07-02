---
validated: source-proven
---

# surface-form-card — Make a CardDef into a surfacified form

**What this gives you:** A CardDef that hosts a complete typed form (12+ field types) using the surface field kit. The same FieldDef pair (atom + embedded + edit) renders correctly in two surface presentations: as a labeled form (default isolated/edit template) AND as a sheet (a `<Grid @preset="sheet">` in a sibling card).

**When to use:** Your card represents structured input that the user will eventually fill in (employee onboarding, project intake, contact form, custom workflow form). You want to pair the form's field definitions with later sheet-like editing without duplicating field views.

**The insight:** Once you commit to surface fields (via `surface-field-kit`), one set of FieldDefs serves both renderings. The default Boxel template wraps fields in `<FieldContainer>` → form chrome; a `<Grid>` in a sibling sheet card wraps the same fields in row chrome. `<Cell>` adapts. Surfaces collapses a class of fork-the-template work that used to be unavoidable.

**Recipe shape:**

1. Build your surface-aware FieldDefs first (see `surface-field-kit`).
2. Compose them on a CardDef: `@field firstName = contains(SurfaceTextField)`, etc.
3. For the form view: use Boxel's default isolated/edit template (or the surfacified default — see `surface-default-template`).
4. For the sheet view: a sibling card with `<Grid @preset="sheet">` and `<@fields.firstName />` etc.

**Gotchas:**
- The 12 standard demo field types in the workspace's `surface-form-card.gts` demo cover: text, email, salary, bio, active (boolean), pill (single-select enum), chips (multi-select), budget (number with unit), launch (date), asset (image enum), stars (rating), slider, checkbox, actions (command picker).
- Field modules should chunk independently — keep each `surface-*-field.gts` as its own file so the realm prerenderer can chunk them.

**Source:** the workspace's surfaces showcase realm contains the host card (`surface-form-card.gts`), the grid sibling (`surface-grid-card.gts`), and 17 `surface-*-field.gts` field-type examples.

**See also:** `surface-field-kit`, `library-surfaces`, `surface-default-template`, `build-quote-document` (planned).
