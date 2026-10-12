---
name: boxel-design
description: Use when DECIDING a Boxel card's visual language — mood, palette, typography direction, asset direction, one visual signature, the design-playbook process. This is the taste/decision layer. NOT for implementing tokens or CSS inside templates (that's boxel-ui-guidelines) and NOT for creating/editing Theme, StyleReference, or BrandGuide card artifacts (that's boxel-theme-development).
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

Read it in full before any user-facing card design. This skill (`boxel-design`) used to host a menu-driven discovery process; that was removed because curated style menus cap intrinsic LLM design taste at the menu authors' ceiling. Stage 1's "internal taste-maker held in mind" is the antidote — trust the model's taste, push past defaults.

## Look check — before the first design decision

The user decides the look up front, so every route into a build asks the same two questions once.
"Just build it" asks them in its first call (`index.md`, the paragraph under "Just build it" that
begins "still gets one call of questions"). A build that starts from a brief ("Plan it with me"
after `domain-interview`, or "I already have a brief") asks them here, because the brief makes no
design decisions on purpose. A user who brings only a design (a mockup, a reference site, a Figma
file) has answered the feel question by doing so; ask the real-details question only. Names and
prices inside the design are not facts the user stated.

Ask only the questions that are still unanswered, together in one choice-UI call, each with its skip
option (rules: [`domain-interview`](../domain-interview/SKILL.md) → *Skipping*):

1. **How should it feel?** Light & calm / Dark & dramatic / Bold colour / You decide.
2. **Real details:** "Anything true about this place a competitor couldn't say?" When the brief's
   `spec` already holds concrete facts the user stated (names, places, prices, house rules, as in its
   Interview record), the real options are
   **Use what's in the brief** (recommended) / *No details — leave marked slots for them* / *It's a
   concept or pitch — make up realistic details, marked as samples*. With no such facts, they are
   *No details — leave marked slots for them* (recommended) / *No details — leave those sections
   out* / the concept-or-pitch option. Then *Skip the rest*, which takes the recommended option; the
   free-text answer carries new details. When this is the only question left in the call, it is the
   last question, so it carries *Skip the rest*; the feel question alone ends with *You decide*. The rule behind these options, and what demo mode allows, is
   [`critical-rules.md`](references/critical-rules.md) → *Never invent proof*.

**Already answered** means any of: the user's prompt or attachments state it (a feel word, named
colours, a brand, a logo or a reference site for question 1; facts for question 2); it was answered
earlier in this conversation; or the brief's `designDirection` field has a `Look:` or `Real details:`
line, or older direction text that states a look (for question 1) or real details (for question 2);
a note with neither answers nothing. Facts that sit only in the brief's `spec` do not answer
question 2: they only decide its first option. "You decide" and "Leave those sections out" are answers. If both
are answered, make no call.

**Record it on the brief**, when there is one, straight after the answer, including what the user's
prompt already said. Write the `Look:` and `Real details:` lines it does not already have into its `designDirection` field (this skill's field;
`domain-interview` owns `spec`) with `run-realm-code`, changing only that field: add the two lines after any text already there, never deleting it; if the
attribute is missing or `null` in the brief's JSON, set it. The line is the user's own words, never expanded
into a palette or fonts: the label of the option they picked, or the feel phrase they typed ("dark
and moody like a noir poster", not the whole request).

```
Look: Dark & dramatic
Real details: use what's in the brief | facts: <the user's words> | leave marked slots | leave sections out | concept (demo mode)
```

On `Look:` a skipped question records `You decide`. On `Real details:` the value is one of those
five, written exactly so (they are the stored form of the options, not their labels); details the
user typed always start with `facts:`, so typed text can never be read as one of the other four, and
they add to the facts the user stated in the brief, never replace them. A
skip records the one it took. The build reads both lines as given: the look steers the mockup, and the
real-details line decides what the build may write about the user's business. Only what the user stated counts as a source under
[`critical-rules.md`](references/critical-rules.md) → *Never invent proof*: the brief's Interview
record and anything the user typed into it. Its Domain primer, Schema, Sample data and Assumptions
are written by the assistant and are never a source, so "Use what's in the brief" leaves them out.

With no brief, the answers stay in the conversation and the build uses them.

## Brand and Style Source

Choose the governing style source before stage 1:

- **Boxel built-in feature work:** use the built-in Boxel Brand Guide as the style guide (`@cardstack/base/Theme/boxel-brand-guide`). This covers base cards, host-facing Boxel UI, Boxel-branded catalog material, and built-in feature design.
- **User/custom realm work:** derive or choose the Theme/StyleReference/BrandGuide from the user's domain and content. Do not default to Boxel branding unless the user asks for Boxel-branded output.
- **Logo, mark, or official brand material needed:** use a `BrandGuide`; its `markUsage`, `brandColorPalette`, `functionalPalette`, typography, voice, and quality standards are the source. Do not invent logo URLs or store them as miscellaneous string fields.

## Pair with

- **`boxel-ui-guidelines`** — turns design intent into working markup (template-level rules, `@fields` vs `@model`, delegated-render control, format-choice).
- **`boxel-theme-development`** — turns design-system source material into a Theme, Style Reference, Detailed Style Reference, or Brand Guide artifact.
- **`boxel`** — once the design is decided and you're implementing the card. Also hosts the playbook itself.
- **`source-code-editing`** — when applying the resulting styles to existing files.

## Don't use for

- Template syntax decisions (`@fields` vs `@model`, container queries) — that's `boxel-ui-guidelines`.
- Schema or query work — that's `boxel`.

## References this skill still owns

- [`references/critical-rules.md`](references/critical-rules.md) — anti-LLM-cliché checklist ("Rounded Rectangle Syndrome", "Center-All Disease", "Card Grid Autopilot", etc.) + image-URL field-routing rule + design-excellence mindset. Read alongside design-playbook stage 1 to sharpen the internal taste-maker.
- [`references/asset-selection-guidelines.md`](references/asset-selection-guidelines.md) — concrete image-handling guidance: priority order for asset integration, format choices, fit semantics. Useful regardless of process. Images for a build's sample instances: [`sample-images.md`](../boxel-file-def/references/sample-images.md).
- [`references/layout-vocabulary.md`](references/layout-vocabulary.md) — eight named layout moves, what each is for and not for, and how each is built in a card. Decide the sections first; zero moves is a valid answer.
- [`references/layout-gravity.md`](references/layout-gravity.md) — defaults a layout drifts into when nobody decided it, mostly on app screens. Check a finished layout against it.

The previous five files (`style-reference.md`, `design-controls.md`, `design-discovery-process.md`, `the-design-challenge-standard.md`, `base-theme-variables.md`) were removed — superseded by the design-playbook's stages 1–2.
