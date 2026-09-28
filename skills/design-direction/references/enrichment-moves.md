# Enrichment moves — what to add when a surface is too plain

This file runs **twice**, and the first run is the one that matters:

1. **Forward, in Phase 4** — the style declares an ornament *baseline*, and every surface in the
   unit is assigned a rung before anything is built. This is what stops a first generation coming
   out as headings and paragraphs when the style was never plain to begin with.
2. **As a correction, on demand** — someone looks at something built and says *this block is too
   plain* or *this screen is exhausting*, and one surface moves one rung, up or down.

Both runs answer the same question: **given the style this unit already has, what does this
surface earn?**

It does not pick a style, does not touch the layout, and does not produce a second arresting
element. A style change is Phase 4; a layout change is judged on the built screen; the one
arresting thing is [`signature-treatments.md`](signature-treatments.md). This file is the vocabulary for everything that is
*not* the signature — the surfaces that should not be bare and must not out-shout it.

## Why a catalogue instead of "make it richer"

Told to enrich a surface with no vocabulary, a model reaches for a blurred gradient and a frosted
panel every single time — the default look that upstream's [`critical-rules.md`](../../boxel-design/references/critical-rules.md) names as *Gradient
Overuse*. The catalogue exists so the answer is *this style's ornament*, not *the generation
default*. A field guide grounds a surface with stipple and a hairline; a brutalist one with a
coarse grid and a hard shadow; a ledger with a rule and tabular numerals. None of those is a
gradient.

## The baseline — derived from the style, not asked

A style is not neutral about ornament. Read the baseline off the style's visual DNA in Phase 4;
it is a conclusion, not a question for the user.

| Baseline | The style sounds like | Default rung for an ordinary surface |
|---|---|---|
| **Restrained** | editorial, Swiss, field guide, legal, clinical, terminal | **L0–L1** — type and rules carry everything; a mark where a row needs identifying |
| **Balanced** | most product and brand work | **L1** — every surface gets its mark; grounds are spent on the few surfaces that lead |
| **Rich** | gaming HUD, sports broadcast, arcade, trading floor, festival, kids' product, luxury retail | **L2** — surfaces are *grounded by default*; a bare panel reads as unfinished, not as restraint |

"Rich dashboard", "gaming UI", "make it feel like a game HUD" is a **Rich** baseline, and the
consequence is concrete: panels arrive with grounds, frames, state colour and iconography in the
first build, because in that language an un-grounded panel is a missing asset. Nobody should have
to ask for that afterwards.

**The baseline sets the default rung, never the ceiling.** All three baselines keep the same cap:
one L3 per unit, on the dominant object.

### Rich costs more, in three specific ways

A high baseline is not a licence; it buys three new failure modes that a restrained one does not
have, and Phase 4 must answer them when it picks Rich:

- **Contrast needs troughs.** If every surface is grounded, nothing reads as important. A Rich
  unit must name the surfaces that sit **one rung below baseline** on purpose — the rests — and
  they are usually the ones carrying the most text. Loud everywhere is the same information as
  quiet everywhere.
- **The signature still has to win.** Raising the floor raises what L3 must clear. Either the
  signature gets louder or the surfaces around it get quieter; doing neither is how a rich style
  ends up with no focal point.
- **Grounds cost frames.** Blurred, animated or filtered grounds composite every frame and the
  card can be on screen several times at once. Cap them per screen, prefer a static pattern or a
  gradient over an animated blur, and keep the `prefers-reduced-motion` resting state — same
  constraints as [`signature-treatments.md`](signature-treatments.md).

## The ladder — every surface sits on one rung

| Rung | What it has | Where it belongs |
|---|---|---|
| **L0 Bare** | type and spacing only | dense table rows, `atom`, the smallest fitted sizes, anything whose job is scanning |
| **L1 Marked** | exactly **one** mark: an icon, an eyebrow, a hairline, an oversized numeral, a colour band | most `embedded` views, list rows, meta strips |
| **L2 Grounded** | the surface gets a *ground* — pattern, texture, tint or a scrimmed gradient — plus its L1 mark | cards, panels, the secondary regions of `isolated` |
| **L3 Signature** | reserved. The unit's one arresting thing | only Phase 2's dominant object, once per unit |

Three rules hold the budget:

- **One L3 per unit**, whatever the baseline. A correction run raises a surface **by one rung at a
  time** and never reaches L3 on its own. Promoting something to L3 means demoting the current L3 first, and that is a Phase 4
  decision the user makes, not a side effect of "this looks plain".
- **No L2 may out-shout the signature.** If the enriched surface now competes, the move was too
  loud — take the quieter version of the same idea, not a different idea.
- **Bare is sometimes correct, and at a Rich baseline it is mandatory somewhere.** A dense
  comparison table, an `atom`, a fitted tile at its smallest size: these are L0 by design. "Plain"
  is a failure only where the surface had room and a job that reading alone does not serve — and
  under Rich, a deliberately quiet surface is what makes the loud ones legible.

## The moves

Pick from the style, not from the top of this list. Every move must be derivable from the style's
visual DNA — if you cannot say which line of the style's DNA produced it, it is decoration from
somewhere else.

| Move | What it is | Cost / where it is illegal |
|---|---|---|
| **Icon** | one glyph carrying the row's kind or state | from `@cardstack/boxel-icons` — **never emoji** (the anti-patterns block fails it on sight). One per row; an icon per field is noise |
| **Eyebrow** | a kicker above the title — uppercase, tracked, small | the whole set gets **one** eyebrow treatment; two is drift `design-review set` will catch |
| **Hairline / rule** | a 1px rule separating or underlining | at compact and dense spacing this is structure, not ornament — it does not count as the L1 mark |
| **Oversized numeral** | the figure that matters, typeset huge | needs tabular numerals; it and the title cannot both be the loudest thing — pick one |
| **Colour band / edge stripe** | a band carrying status, tier or category | the cheapest mark that survives at the smallest sizes; the colour must already mean something in the palette |
| **Background pattern** | repeating-linear, dot grid, conic, hatch — pure CSS | text sitting on it needs a scrim or a clear zone; an un-scrimmed pattern under body copy is a contrast failure |
| **Texture / grain** | an inline SVG `feTurbulence` data URI overlay | keep the data URI small — it inflates the template; pair with `pointer-events: none` |
| **Scrimmed gradient** | a gradient as **ground**, with a solid or semi-opaque scrim under any text | a gradient is never the signature by itself. `background-clip: text` needs a fallback `color` for when the animation is off and for high-contrast mode |
| **Tinted / duotone media** | the image treated so it belongs to the palette | reverses the *stock photo tile* gravity well; a raw photo in a styled surface reads as a placeholder |
| **Corner mark / stamp** | a mark in one corner — a seal, a monogram, a number | stays **inside** the surface; the outermost element's corners belong to the host |
| **Weight jump** | one step of real contrast between label and value | free, and the first thing to try before anything above it |

**The contrast clause.** Any move that puts something behind text — pattern, texture, gradient,
tinted media — owes a legibility answer in the same breath: a scrim, a clear zone, or text placed
off the ground entirely. "It looked fine in the screenshot" is not one; the ground moves with the
data.

**The motion clause.** If the move animates, `prefers-reduced-motion` gets a resting state that is
the finished state — same rule as every treatment in [`signature-treatments.md`](signature-treatments.md), and its four
runtime constraints (no document-level queries, container units not `vw`/`vh`, reduced motion, the
host owns the outermost element) apply here unchanged. Do not restate them; read them there.

## Per format

| Format | Ceiling | Notes |
|---|---|---|
| `isolated` | L3 (if this is where the signature lives), else L2 | the secondary regions are the usual "too plain" complaint — ground them at L2, leave the hero as the loudest |
| `embedded` | L2 | carries one **compressed** version of the unit's idea — the same texture, the same rule, smaller. Not a shrunken hero |
| `edit` | L1 | form surfaces earn a mark and nothing more; ornament in a form reads as a control |
| `atom` | L0 | text. The style survives as wording |
| `fitted` | **deferred — see below** | |

### `fitted` defers to upstream, always

`fitted` is the one format where this file does not decide. The host wraps every fitted template in
its own size container and upstream's [`container-query-fitted-layout.md`](../../boxel/references/container-query-fitted-layout.md) owns the size ladder, which
regions survive at each size, and the `FittedCard` component that implements it. That document is
the authority and it moves; **read it at build time rather than working from a copy** — numbers
restated here go stale and a stale copy is worse than a pointer.

So when someone says a fitted view is plain, enrichment works **inside** the ladder, never on it.
In bounds — all of it *placement and ornament within the regions a size already has*:

- **which field leads** at the sizes that have room for one — the signature field, not the
  title-and-truncated-description default;
- **which field goes in which region** — what is head, what is meta, what is body, and what is
  dropped early because it never earned its place;
- **the single mark** for the sizes where the head is all there is — a numeral, a stamp, a colour
  band, chosen from the table above;
- **whether the tile has a hero at all**, or the no-image composition applies;
- **ornament inside a region** — an icon, a colour band, a scrimmed ground — subject to the same
  contrast clause as everywhere else, since a fitted tile is the surface most likely to be read at
  a glance;
- **tuning** the composition through the sanctioned knobs: `FittedCard`'s `--fc-*` custom
  properties and `@container fitted-card (…)` overrides in the card's own scoped CSS. Upstream's
  own words are *tune, don't fork*.

Out of bounds — the ladder itself:

- **do not move, restate or invent a breakpoint.** The sizes and what they show are upstream's;
  a `DESIGN-DIRECTION.md` that repeats their numbers goes stale and then quietly contradicts them.
- **do not ask for a region a size does not have.** "Show the badge on the smallest tile" is a
  request to break the contract, not an enrichment.
- **do not fix spacing or type as a style decision in `DESIGN-DIRECTION.md`.** Where the composition needs
  tightening, that is a `--fc-*` tune or a container-query override made at build time against the
  live document — not a number written down here.
- **never `vw` / `vh`**, and nothing on the template root that the host owns.

**Where this file and upstream disagree about fitted, upstream wins.**

## How a forward run goes (Phase 4)

1. **Read the baseline off the style** — restrained, balanced or rich, with the line of visual DNA
   that decided it.
2. **Assign a rung to every surface** in the inventory — screens' regions, and each format of each
   card. Default is the baseline; the dominant object is L3; name the **rests** that sit one rung
   below.
3. **Name the moves for the surfaces above L0**, each traced to the style, each with its contrast
   and motion answer.
4. **Write the budget map into `DESIGN-DIRECTION.md`** so the builder builds it that way the first time and
   `design-review` has a standard to score against.

At a Rich baseline, also answer the three costs above — which surfaces are the troughs, how the
signature still wins, and how many animated grounds a screen is allowed.

## How a correction run goes (on demand)

1. **Name the surface** — which block, which screen, which format. One at a time; "the whole app is
   plain" is a Phase 4 style question, not this.
2. **Read the unit's `DESIGN-DIRECTION.md`** — the style, its visual DNA, its anti-patterns, and where the L3
   signature currently lives.
3. **Say the current rung and the target** — one step, in either direction. *Too plain* is
   L0 → L1 or L1 → L2; *too busy / exhausting / nothing stands out* is the same move downward, and
   at a Rich baseline that is the more common complaint. Lowering a surface is a legitimate
   enrichment outcome: the fix for "nothing stands out" is almost never adding more.
4. **Pick moves the style earns**, with the line of visual DNA each came from, plus the contrast and
   motion answers each one owes.
5. **Write it back into `DESIGN-DIRECTION.md`** — an `Enrichment` line on that surface, and an acceptance line
   a reviewer can tick. A move that is not written down is rebuilt away the next time that surface
   is touched, and `design-review` has no standard to score it against.
6. **Rebuild that one surface.** Nothing else changes.

## Never

- Raise something to L3 because it looked plain.
- Ask the user to pick an ornament baseline. It is read off the style they already chose.
- Ground every surface because the style is rich. A unit with no troughs has no hierarchy.
- Enrich more than one surface per run without saying which one is now the loudest.
- Add a move the style cannot account for.
- Reach for a blurred gradient plus a frosted panel. That is the default look, not an answer.
- Decide fitted structure here. Upstream owns it.
