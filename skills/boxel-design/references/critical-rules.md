## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Restraint > using every color available. ONE accent in ≤2 places is a stronger move than four-color schemes.
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. Large light + tiny bold beats four sizes all bolded.
- **Single Font Monotony** — Mix typefaces purposefully (serif heads + sans body, or one display + one mono). One typeface for everything is a tell.
- **Accent Border Laziness** — No thick left/top borders as "design." A 4px accent stripe is the LLM default and it always looks like one.
- **Center-All Disease** — Asymmetry creates visual interest. Centering every element flattens hierarchy.
- **Card Grid Autopilot** — Break the predictable 3-column-card layout. Editorial grids, single-column long-reads, asymmetric layouts all read more intentional. Named replacements (bento, masonry, 40/60 split, editorial type, bleed, sticky scroll) and how each is built in a card: [`layout-vocabulary.md`](layout-vocabulary.md).
- **Shadow Everything** — Strategic depth, not universal drop-shadows. Use shadow as punctuation, not as default chrome.
- **Icon Sprinkles** — Icons should enhance meaning, not fill space. An eyebrow + section heading without an icon is often stronger.
- **Safe Spacing** — Push extremes: ultra-tight or magazine-wide margins. The "comfortable middle" is the LLM default.
- **Gradient Overuse** — Not every element needs a gradient. Gradients are the 2024 over-used signature; flat color with intentional contrast often wins.
- **Average Quality Trap** — Aim for top 1% execution, not median competence. The design-playbook's "internal taste-maker" framing exists to push past the default.

### Images in templates

Never put a relationship in `src`: `<img src={{@model.heroImage}}>` is wrong when `heroImage` is `linksTo(ImageDef)`, because that value is a card, not a URL. Pick the field by what the image needs, in this order:

1. **Uploads and external URLs both** — `ImageSourceField` (`@cardstack/catalog/fields/image-source/image-source`). It wraps an `ImageDef` link and a `UrlField` and computes `resolvedUrl`. Use `{{@model.hero.resolvedUrl}}`, or `<@fields.hero @format='embedded' />`. For several images, `MultiImageSourceField`.
2. **Uploads only** — `linksTo(ImageDef)`, rendered with `<@fields.hero @format='embedded' />`.
3. **Neither fits** — the `linksTo(ImageDef)` + `contains(UrlField)` pair, with the template choosing between them. Recipe: [`base-field-catalog.md`](../../boxel/references/base-field-catalog.md).

An external URL never goes in `relationships.<field>.links.self` (Cardinal Rule 12). All three routes keep the image editable per instance.

### Design Excellence Mindset

Every element should demonstrate:

- **Intentionality** — clear rationale for each decision (and you should be able to articulate it in stage 1 of the playbook).
- **Craft** — obsessive attention to detail.
- **Innovation** — at least one fresh perspective.
- **Coherence** — a unified vision throughout.
- **Surprise** — something unexpected yet perfect.

If the final card has none of those, the design-playbook stage 1 wasn't run honestly — the "internal taste-maker" was satisfied with the LLM default. Go back and redo stage 1 with a more demanding taste-maker held in mind.
