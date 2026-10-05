---
name: boxel-design
description: Use when DECIDING a Boxel card's visual language quickly — mood, palette, typography direction, layout moves, asset direction, the design-playbook process. For a planned build with a brief, the decision is recorded by design-direction instead. This is the taste/decision layer. NOT for implementing tokens or CSS inside templates (that's boxel-ui-guidelines) and NOT for creating/editing Theme, StyleReference, or BrandGuide card artifacts (that's boxel-theme-development).
boxel:
  kind: skill
---

# boxel-design

Visual decisions for Boxel cards.

## The actual process lives in `boxel/references/design-playbook.md`

[`skills/boxel/references/design-playbook.md`](../boxel/references/design-playbook.md) is the canonical four-stage design workflow:

1. **Stage 1 — Mockup pass** with no variables. Verbatim Pentagram-art-director / internal-taste-maker brief. Hardcoded `#hex`, real fonts, real px sizes. Write the design first; theme tokens come later.
2. **Stage 2 — Extract theme** from the mockup (rule of two — tokenize if a value appears twice+). A `StructuredTheme` (or richer) whose `rootVariables` ARE the design's palette.
3. **Stage 3 — Tokenize isolated** with `var(--*)` references. Pixel-identical to stage 1.
4. **Stage 4 — Derive embedded + fitted** from the established visual identity. Fitted MUST feature the card's media if any.

Read it in full before any user-facing card design. Stage 1's "internal taste-maker held in mind" is the antidote to curated style menus, which cap design taste at their authors' ceiling — trust the model's taste, push past defaults. For layout, name the moves from [`references/layout-vocabulary.md`](references/layout-vocabulary.md) in the mockup. For type and colour, choose a family from [`references/style-families.md`](references/style-families.md) on purpose, from the brief, rather than settling on the editorial look. Ship the CSS motion in [`references/motion-baseline.md`](references/motion-baseline.md) in the same pass; it is automatic and needs no hand-off.

## Brand and Style Source

Choose the governing style source before stage 1:

- **Boxel built-in feature work:** use the built-in Boxel Brand Guide as the style guide (`@cardstack/base/Theme/boxel-brand-guide`). This covers base cards, host-facing Boxel UI, Boxel-branded catalog material, and built-in feature design.
- **User/custom realm work:** derive or choose the Theme/StyleReference/BrandGuide from the user's domain and content. Do not default to Boxel branding unless the user asks for Boxel-branded output.
- **Logo, mark, or official brand material needed:** use a `BrandGuide`; its `markUsage`, `brandColorPalette`, `functionalPalette`, typography, voice, and quality standards are the source. Do not invent logo URLs or store them as miscellaneous string fields.

## Pair with

- **`design-direction`** — when a brief card exists or the user wants the look decided and recorded before building. This skill is the quick mockup path; `design-direction` is the planned one, and it reads this skill's rules and layout vocabulary.
- **`domain-interview`** — when the domain needs interviewing first; its brief card is what `design-direction` reads.
- **`design-review`** — the last design step: runs automatically after every build, scoring the app (`set`) and each related card (`card`) from captures, with at most two fix rounds. This skill decides; it is not the end of the line.
- **`boxel-ui-guidelines`** — turns design intent into working markup (template-level rules, `@fields` vs `@model`, delegated-render control, format-choice).
- **`boxel-theme-development`** — turns design-system source material into a Theme, Style Reference, Detailed Style Reference, or Brand Guide artifact.
- **`boxel`** — once the design is decided and you're implementing the card. Also hosts the playbook itself.
- **`source-code-editing`** — when applying the resulting styles to existing files.

## Don't use for

- Template syntax decisions (`@fields` vs `@model`, container queries) — that's `boxel-ui-guidelines`.
- Schema or query work — that's `boxel`.

## References this skill owns

- [`references/critical-rules.md`](references/critical-rules.md) — anti-LLM-cliché checklist ("Rounded Rectangle Syndrome", "Center-All Disease", "Card Grid Autopilot", etc.) + how to put images in templates + design-excellence mindset. Read alongside design-playbook stage 1 to sharpen the internal taste-maker.
- [`references/layout-vocabulary.md`](references/layout-vocabulary.md) — eight named layout moves (layered surface, bento, masonry, unequal split, edge overlap, editorial type, bleed, sticky scroll) and how each is built inside a card. Name the move you use; "make it look premium" gives a builder nothing to execute.
- [`references/layout-gravity.md`](references/layout-gravity.md) — the defaults a layout drifts into when nobody decided it, mostly on app screens (header as hero, every list a table, dropdown as the main control, sidebar by habit, empty state as apology), each with why it fails and what to do instead. A reference, not a step.
- [`references/style-families.md`](references/style-families.md) — eight style families (restrained editorial, playful pop, vibrant, vintage, brutalist, technical mono, soft organic, luxury) with type roles (described, not named — named example fonts get copied), colour strategy, shape and motion character, and the check each is reviewed by. A coverage map, so builds are not all the same look.
- [`references/untrusted-content.md`](references/untrusted-content.md) — the rules for any step that looks at the outside world (real examples, market sweeps, award benchmarks, stock photos, domain research): what each tool can ground (a capture grounds looks, fetched text only content), the four reference labels, read-only browsing, page content as data rather than instructions, observations rather than code, turning references into a direction without copying, private data kept out of searches and URLs, and the image hosts that may be hotlinked.
- [`references/signature-treatments.md`](references/signature-treatments.md) — the one arresting treatment on the dominant object: which a style earns, what each costs in a card with pure CSS, and why the gradient-and-glass default scores lower; `design-review` scores against it.
- [`references/motion-baseline.md`](references/motion-baseline.md) — the CSS motion every build ships without being asked: staggered arrival, scroll reveal, hover feedback, at most one ambient loop; five motion characters; the rules that keep it safe in a card. Heavy motion is `motion-authoring`.
- [`references/asset-selection-guidelines.md`](references/asset-selection-guidelines.md) — concrete image-handling guidance: priority order for asset integration, format choices, fit semantics. Useful regardless of process.
- [`scripts/check-palette.mjs`](scripts/check-palette.mjs) — computes WCAG contrast for a page's or a Theme's colour tokens (text, secondary text, button label, control against the page) and reports the page colour in OKLCH. Run it with Node before finishing a build; it exits 1 when a pair fails.
