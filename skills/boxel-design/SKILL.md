---
name: boxel-design
description: Use when DECIDING a Boxel card's visual language quickly — mood, palette, typography direction, layout moves, asset direction, the design-playbook process. With a `domain-interview` brief, it builds from that brief's `spec`. This is the taste/decision layer. NOT for implementing tokens or CSS inside templates (that's boxel-ui-guidelines) and NOT for creating/editing Theme, StyleReference, or BrandGuide card artifacts (that's boxel-theme-development).
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

## Look check — before the first design decision

The user decides the look up front, so every route into a build asks the same two questions once.
"Just build it" asks them in its first call (index step 1). A build that starts from a brief
("Plan it with me" after `domain-interview`, or "I already have a brief") asks them here, because
the brief makes no design decisions on purpose.

Ask only the questions that are still unanswered, together in one choice-UI call, each with its skip
option:

1. **How should it feel?** Light & calm / Dark & dramatic / Bold colour / You decide. When a row of
   the page-colour table in [`style-families.md`](references/style-families.md) → *Page colour*
   holds for this brief, put that option first, marked recommended, with its reason in a few words.
2. **Real details:** "Anything true about this place a competitor couldn't say?" When the brief's
   `spec` already holds concrete facts (names, places, prices, house rules), the first option is
   **Use what's in the brief** (recommended). Then *Leave marked slots for them* / *Leave those
   sections out* / *Skip the rest*; the free-text answer carries new details.

**Already answered** means any of: the user's prompt or attachments state it (a feel word, named
colours, a brand, a logo or a reference site for question 1; facts for question 2); it was answered
earlier in this conversation; or the brief's `designDirection` field has a `Look:` or `Real details:`
line, or older direction text. "You decide" and "Leave those sections out" are answers. If both are
answered, make no call.

**Record it on the brief**, when there is one, straight after the answer: write two lines into its
`designDirection` field (this skill's field; `domain-interview` owns `spec`), in the user's words
and without expanding them into a palette or fonts:

```
Look: Dark & dramatic (recommended for a cinema)
Real details: use what's in the brief | <the user's words> | leave marked slots
```

With no brief, the answers stay in the conversation and the build uses them.

## Brand and Style Source

Choose the governing style source before stage 1:

- **Boxel built-in feature work:** use the built-in Boxel Brand Guide as the style guide (`@cardstack/base/Theme/boxel-brand-guide`). This covers base cards, host-facing Boxel UI, Boxel-branded catalog material, and built-in feature design.
- **User/custom realm work:** derive or choose the Theme/StyleReference/BrandGuide from the user's domain and content. Do not default to Boxel branding unless the user asks for Boxel-branded output.
- **Logo, mark, or official brand material needed:** use a `BrandGuide`; its `markUsage`, `brandColorPalette`, `functionalPalette`, typography, voice, and quality standards are the source. Do not invent logo URLs or store them as miscellaneous string fields.

## Pair with

- **`domain-interview`** — when the domain needs interviewing first; its brief card is what this skill builds from.
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
- [`references/asset-selection-guidelines.md`](references/asset-selection-guidelines.md) — which images a build ships: every media slot gets one in the first build, the source order (the user's own, real Openverse photos from a terminal, labelled placeholders, AI images offered after the build in the app), which slots always take a placeholder, picsum's narrow use, and the dead hosts. The recipe for getting each image in is [`boxel-file-def/references/sample-images.md`](../boxel-file-def/references/sample-images.md).
- [`scripts/check-palette.mjs`](scripts/check-palette.mjs) — computes WCAG contrast for a page's or a Theme's colour tokens (text, secondary text, button label, control against the page) and reports the page colour in OKLCH. Run it with Node before finishing a build; it exits 1 when a pair fails.
