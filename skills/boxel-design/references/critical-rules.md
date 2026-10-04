## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Colours with no job. In a restrained family, ONE accent in ≤2 places beats a four-colour scheme. In a playful, vibrant or vintage family a multi-colour palette is correct, provided every colour has a named role (see [`style-families.md`](style-families.md)). The failure is colour nobody assigned a purpose.
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. In an editorial family that is large at light weight against tiny bold; in a playful, vibrant or brutalist family it is a heavy display face against a plain body. What fails is every size sitting at 500–600 with a small step between them.
- **Single Font Monotony** — Mix typefaces purposefully, by role: display, body, optional label. One typeface for everything is a tell.
- **Same Look Every Time** — A light serif or thin display face, a small bold sans, one accent and a lot of restraint is one family out of eight. Choose the family from the brief ([`style-families.md`](style-families.md)); if you land on that one, name the line of the brief that asked for it.
- **Dead Page** — A finished build with no motion at all reads as unfinished. Apply the baseline in [`motion-baseline.md`](motion-baseline.md) without being asked.
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
