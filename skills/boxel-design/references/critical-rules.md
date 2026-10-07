## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Restraint > using every color available. ONE accent in ≤2 places is a stronger move than four-color schemes.
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. Large light + tiny bold beats four sizes all bolded.
- **Single Font Monotony** — Mix typefaces purposefully (serif heads + sans body, or one display + one mono). One typeface for everything is a tell.
- **Accent Border Laziness** — No thick left/top borders as "design." A 4px accent stripe is the LLM default and it always looks like one.
- **Center-All Disease** — Asymmetry creates visual interest. Centering every element flattens hierarchy.
- **Card Grid Autopilot** — Break the predictable 3-column-card layout. Editorial grids, single-column long-reads, asymmetric layouts all read more intentional.
- **Shadow Everything** — Strategic depth, not universal drop-shadows. Use shadow as punctuation, not as default chrome.
- **Icon Sprinkles** — Icons should enhance meaning, not fill space. An eyebrow + section heading without an icon is often stronger.
- **Safe Spacing** — Push extremes: ultra-tight or magazine-wide margins. The "comfortable middle" is the LLM default.
- **Gradient Overuse** — Not every element needs a gradient. Gradients are the 2024 over-used signature; flat color with intentional contrast often wins.
- **Average Quality Trap** — Aim for top 1% execution, not median competence. The design-playbook's "internal taste-maker" framing exists to push past the default.

### Images in templates

Never put a relationship in `src`: `<img src={{@model.heroImage}}>` is wrong when `heroImage` is `linksTo(ImageDef)`, because that value is a card, not a URL. Pick the field by what the image needs:

1. **An image that may be an external URL** (a placeholder, a stock photo, a URL the user pastes), later perhaps a realm file: the URL/ImageDef pair, `linksTo(ImageDef)` + `contains(UrlField)` (Cardinal Rule 12; recipe in [`base-field-catalog.md`](../../boxel/references/base-field-catalog.md)). The catalog's `ImageSourceField` (`@cardstack/catalog/fields/image-source/image-source`) packages that pair with a `sourceMode` switch and a computed `resolvedUrl`: render `{{@model.hero.resolvedUrl}}`, or `<@fields.hero @format='embedded' />`. For several images, `MultiImageSourceField` (`@cardstack/catalog/fields/multi-image-source/multi-image-source`).
2. **Uploads only**: `linksTo(ImageDef)`, rendered with `<@fields.hero @format='embedded' />`. It cannot hold a URL, so a slot that the first build fills with a placeholder or photo URL needs route 1.

An external URL never goes in `relationships.<field>.links.self` (Cardinal Rule 12). Both routes keep the image editable per instance.

### Design Excellence Mindset

Every element should demonstrate:

- **Intentionality** — clear rationale for each decision (and you should be able to articulate it in stage 1 of the playbook).
- **Craft** — obsessive attention to detail.
- **Innovation** — at least one fresh perspective.
- **Coherence** — a unified vision throughout.
- **Surprise** — something unexpected yet perfect.

If the final card has none of those, the design-playbook stage 1 wasn't run honestly — the "internal taste-maker" was satisfied with the LLM default. Go back and redo stage 1 with a more demanding taste-maker held in mind.
