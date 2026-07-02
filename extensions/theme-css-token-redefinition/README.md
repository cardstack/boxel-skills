---
validated: source-proven
---

# theme-css-token-redefinition — Drop-in CSS themes via token re-definition

**What this gives you:** Multiple visual themes (figma, linear, notion, spotify, boxel) for the same cards, applied by linking one CSS file. No JS theme switcher, no template branching — pure CSS cascade.

**When to use:** You want to ship the same surface card with different "moods" (a designer-style figma look, a clean linear look, a Notion-grayscale look, etc.) or you want users to pick their own visual language.

**The insight:** Boxel already has a small set of standard CSS custom properties — `--background`, `--muted`, `--border`, `--radius`, plus the broader `--boxel-*` chain. A theme is just a CSS file that re-defines those tokens with different values. Drop the file at `engine/themes/<name>.css` and link the one you want; the cascade does the rest. The surfaces engine intentionally avoids inventing a parallel `--surface-*` namespace — themes use Boxel's existing tokens so cards still look like Boxel cards, just dressed differently.

**Recipe shape:**

```css
/* engine/themes/figma.css */
:root, .themed-figma {
  --background: #ffffff;
  --foreground: #1e1e1e;
  --muted:      #f5f5f5;
  --border:     #e6e6e6;
  --accent:     #0d99ff;
  --radius:     10px;
  /* …re-define all the tokens the surfacified template references. */
}
```

```css
/* engine/themes/linear.css */
:root, .themed-linear {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted:      #1a1a1a;
  --border:     #2a2a2a;
  --accent:     #5e6ad2;
  --radius:     6px;
}
```

Then on a card root:

```gts
<div class={{this.themeClass}}>...</div>
```

Or link the file directly via a `<link>` tag in your isolated template. Or even apply by realm-wide attribute selector.

**Gotchas:**
- Tokens must be the **same set** across all themes — missing a token leaves cards in an undefined state for that theme.
- Don't theme functional things (event handling, focus rings on `:focus-visible`, etc.). Only color, spacing, radius, shadow.
- Boxel's existing `--boxel-*` tokens should also map cleanly — don't break the fallback chain (`color: var(--foreground, var(--boxel-foreground))`).
- Theme files should be CSS, not JS. The whole point is no runtime branching.

**Source:** the surfaces dist bundles ship a `themes/` directory with five drop-in CSS files (`boxel`, `figma`, `linear`, `notion`, `spotify`). The snapshot under `.claude/extension-libs/surfaces/themes/` carries them.

**See also:** `boxel-design`, `boxel/references/theme-design-system.md`, `boxel/references/styling-design.md`, `library-surfaces`.
