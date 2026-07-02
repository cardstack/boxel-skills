---
validated: source-proven
---

# surface-field-kit — Build a surface-aware FieldDef with Cell + Run

**What this gives you:** A FieldDef whose `atom`, `edit`, and `embedded` views all live inside `<Cell>` / `<Run>` wrappers from the surfaces library — so the same field renders correctly whether it's a row in a `Grid` or a slot in a `Form`. No per-context fork.

**When to use:** You're defining a new FieldDef (rating, slider, chip-picker, currency, etc.) and want it to drop cleanly into both row-based grids and labeled forms. Or you're moving existing fields into the surfaces ecosystem.

**The insight:** `<Cell>` adapts its chrome to the surrounding surface (form vs grid). Wrap your editor in `<Cell>` and your read-only view in `<Run>` — surfaces does the rest. The same atom component can serve as `static atom` AND `static edit`, since `<Cell>` provides the editor wrapper either way.

**Recipe shape:**

```ts
import { Cell, Run } from './surfaces/index.js';

class FooAtom    extends Component<…> { <template><Cell> …editor markup… </Cell></template> }
class FooEmbedded extends Component<…> { <template><Run>  …display markup… </Run></template> }

export class FooField extends FieldDef {
  static displayName = 'Foo';
  @field value = contains(<base type>);
  static atom     = FooAtom;
  static embedded = FooEmbedded;
  static edit     = FooAtom;   // same as atom — Cell provides editor chrome
}
```

**Gotchas:**
- The atom is the editor when inside a `<Cell>` — so you typically point `static atom` and `static edit` at the same class.
- Wrap interactive elements (buttons, inputs) inside the `<Cell>`, not around it.
- Read-only display should always use `<Run>` — putting it in `<Cell>` accidentally gives it editor chrome.
- The surfaces bundle path is `./surfaces/index.js` relative to the field file.

**Source:** the workspace's surfaces showcase realm has 17 `surface-*-field.gts` field-type examples covering text, email, salary, bio, active (boolean), pill (single-select), chips (multi-select), budget, launch (date), asset (image enum), stars (rating), slider, checkbox, actions (command picker).

**See also:** `library-surfaces`, `surface-form-card`, `organize-variant-field-dispatcher` (the pre-surfaces variant approach).
