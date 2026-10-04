# Phase 3 — Style (the one question worth asking)

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Style is what a person can answer in words, so this is where you ask. Fix the source first:

- Boxel built-in, host-facing or Boxel-branded work → the built-in brand guide,
  `@cardstack/base/Theme/boxel-brand-guide`.
- A user or custom realm → derive the style from that domain and its content. Do not default to
  Boxel branding.
- Logos, marks or official brand material involved → a `BrandGuide` card is the source. Never
  invent logo URLs.

**When the user gives a link or a screenshot, inventory it before composing.** A reference carries
two different things, and the skill used to read only the first:

| Column | What goes in it | What happens to it |
|---|---|---|
| **Livery** | palette, type, spacing, imagery treatment, density | borrowable — feeds the three fields below |
| **Technique** | how it moves and unfolds: scroll-linked progress, pinned sequences, text splitting, ambient canvas, smooth scroll, each marked **CSS-achievable / needs JS / not available in a card** per [`references/interaction-ways.md`](interaction-ways.md) → *Narrative ways* | shown to the user as a structured choice — which of these matter here? |

Ask that one question with the technique column, because "like this site" usually means one or
two techniques, not the palette — and a technique marked *needs a library* is named as a
capability for the build to source (upstream's
[`external-libraries.md`](../../boxel/references/external-libraries.md)), not a design decision. The
still frame the reference would have without its motion is what the livery column describes;
design that first. Keep the reference URL in the Narrative arc block: `motion-authoring` reads the technique
column back to write the numbers, and "moves like the reference" is only checkable against the
reference.

**Sweep the market first — only where the market is the benchmark.** A landing, marketing,
pricing or onboarding screen is judged against the best of its kind before anyone reads a word, so
compose against the field, not from a blank page: name three to five real sites in the domain's own
world, one line each — what to borrow, and whether it is livery or technique. Where the harness can
search the web (Claude Code's `WebSearch` / `WebFetch`), look, and say you looked. Where it cannot —
the Boxel assistant has no page fetch; its proxy forwards only to whitelisted APIs — name them from
what you know, say so, and pull the one real reference as a screenshot with `search-google-images`.
Five lines at most, and a record page, a desk or a form gets no sweep. The lines land in the Style
block's Inspirations and Reference, nowhere else.

Then **compose three directions yourself, each one a different reading of the `## Story` image**
(`phase-0b-story.md`) — the same night-on-water story can be read as an editorial nocturne, a
faded postcard or a monochrome seascape, and each reading says which scene lines its palette and
type serve. The signature treatment is the story's one image made buildable. There is no style
menu to pick from, deliberately,
because a curated list caps the result at whatever the list's author imagined. Hold the
[design-playbook](../../boxel/references/design-playbook.md)'s Stage 1 framing while you compose: a brand-focused art director, judged by a
taste-maker you name in your thinking and never in the output. Give each direction the same three
fields: **name · inspirations · visual DNA**.

**Derive each direction's palette and type from the story, then show them.** Every colour has a
job in the story's image: the ground is the story's setting, the accent is the one image, and
the text colour is the reader's register (the `## Story` voice line, when it has one). For the night-on-water story: ground = deep ink water, accent = the
lamplight, text = moonlight grey. Write down the role of each colour, not only its hex, so the
build and the reviewer can check it against the story.

Offer the three directions as one single-select question in the choice UI, recommended first.
Each option carries a **preview** (the choice tool's side-by-side preview box) with the concrete
things a user can judge at a glance:

```
Editorial nocturne
Story: the lamp seen from the shore, steady and far.
Palette  ground  #0E1726  deep ink water
         accent  #F2B35B  lamplight
         text    #C9D1DC  moonlight
Type     Fraunces (display) · Inter (text)
Feels    quiet, trusted, unhurried
Main screen  the shop's front page: one wide image band, the three rooms
             as large tiles, prices in plain rows below
```

**Every preview shows the app's big-picture screen** (its Home, desk or main page), as a one-line
`Main screen` composition beside the palette and type, never a single product card or record. The
user is choosing the language of the whole app; a small object cannot show them that.

This is where the user checks the story: each preview shows how that direction reads it, next to
a palette they can react to. The tool's automatic "Other" is where the user names or describes a
style of their own, or says the story itself is off, in which case rewrite `## Story` and
compose the three again.

When the user names a style instead, research it into the same three fields yourself — what it is
known for, who made it, what a person would recognise it by — and record the result in the
direction's Style block, like a composed one. Livery and mood may be borrowed; wordmarks, logos and
real brand assets stay out. There is no shared style file: a style named again for another unit is
researched again, so it fits that unit rather than being copied from the last one.

**Imagery is briefed from the style, like everything else.** Where the unit carries images, say
what they are *of* and how they are treated — subject, crop, light, palette relationship, whether
people appear — because that brief is the prompt an image model is given, and the
[design-playbook](../../boxel/references/design-playbook.md) shows the recipe: brand DNA + the CardDef's role + this instance's data + the
composition slot. A treatment named here is what stops a generated image from arriving in a
different palette than the card around it. **Do not decide where the image comes from** — placeholder,
generated or the user's own is a sourcing decision the build makes, and an `ImageSourceField` lets
each instance change it without a schema change. Generated images are persisted into the realm, per
upstream's
[`integrate-openrouter-image-generation`](../../boxel-patterns/patterns/integrate-openrouter-image-generation/README.md)
and [`integrate-filedef-generated-image`](../../boxel-patterns/patterns/integrate-filedef-generated-image/README.md)
patterns.

**Decide the signature treatment.** Every unit needs one thing that arrests — the dominant object
from Phase 2, given a treatment nobody arrives at by default. Name it here, with the style, because
the treatment has to be what *this* style earns: a field guide's signature is a stipple and a
hairline, a brutalist one's is a hard shadow and an oversized numeral. The blurred-gradient-plus-
frosted-glass family is the current default look and upstream's [`critical-rules.md`](../../boxel-design/references/critical-rules.md) names
*Gradient Overuse* directly — reaching for it unexamined is the Average Quality Trap, not a
signature. [`references/signature-treatments.md`](signature-treatments.md) has the vocabulary, what each technique costs in a
card, and the four runtime constraints that apply to all of them.

Say what the signature becomes at each format: `isolated` has room for it, `embedded` carries one
compressed version of the same idea, `fitted` is usually reduced to a single mark, `atom` survives
as wording. A shrunken copy of the hero is not a treatment.

Record with the pick:

- the style controls: **style family** (chosen on purpose from [`boxel-design/references/style-families.md`](../../boxel-design/references/style-families.md) — never the editorial default unless the brief asked for it), motion character (from [`motion-baseline.md`](../../boxel-design/references/motion-baseline.md)), type system, colour strategy, **spatial model**, visual density — [`references/signature-treatments.md`](signature-treatments.md) defines the spatial-model options (flat · layered · perspective · scene) and what each costs; "flat" is a choice, not the absence of one
- the **signature treatment** and what it reduces to at each format
- the **ornament budget** — [`references/enrichment-moves.md`](enrichment-moves.md), and it is decided **here, before
  anything is built**, not after someone complains. Read the **baseline** off the style you just
  composed — restrained · balanced · rich — then assign every surface a rung on the ladder:
  L0 bare · L1 marked · L2 grounded · L3 signature. A style that is loud by nature sets a high
  baseline and its panels arrive grounded in the *first* build; a restrained one does not. The cap
  never moves: one L3 per unit, on the dominant object, and at a rich baseline you must also name
  the **rests** — the surfaces deliberately one rung below — or nothing reads as important
- **one real reference** — a site, poster or screenshot. A style name alone reads differently to
  every builder; the reference removes the guess.
- the **type line**: display font, body font, the family's weight contrast, the hero size jump, and what the display role does at `fitted` and `atom`. Both families must be on Google Fonts so the Theme can load them. Without a
  font decision the builder defaults to Inter.
- the **anti-patterns** block, including anything this style specifically refuses. Pull what
  applies from upstream's [`critical-rules.md`](../../boxel-design/references/critical-rules.md).

Phase 3 may run before Phase 2 when the user wants the mood settled first; the layout pick then
reads the style's density.
