## Prefer Component APIs; Write New Components When Needed

Always reach for existing Pret UI components (boxel-ui where Pret UI has no equivalent; see `use-boxel-ui-components.md`) before writing custom HTML + CSS. Every custom element you avoid keeps templates shorter and inherits future design-system improvements automatically.

**Wrong — bespoke HTML for something Pret UI already covers:**
```gts
<div class='pill'>Draft</div>
<style scoped>
  .pill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: var(--boxel-border-radius-pill);
    background-color: var(--muted);
    font-size: var(--boxel-font-size-xs);
  }
</style>
```

**Right — use the existing component:**
```gts
import { Chip } from '@cardstack/pretui/components/chip';

<Chip @label='Draft' />
```