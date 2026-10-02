# Revisions — on demand

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Two correction paths, for when the user reacts to something already built. Neither is how a unit's design first arrives.

## triage first, when the complaint names nothing

"I don't like it", "this feels off", "can you make it better" name neither a surface nor a
dimension. Do not guess which one they meant: every correction path below has a different scope,
and guessing wrong either changes something the user was happy with or leaves the thing they
disliked untouched.

Ask which it is, as one single-select question in the choice UI, and state each option's scope in the option itself so the
user can see what they are authorising:

| They pick | Path | What changes |
|---|---|---|
| **Layout** — what sits where, what dominates, the reading order | Phase 2 overrule, judged on the built screen | that screen's layout block, that screen rebuilt. Every other screen's pick stands |
| **Style** — palette, type, mood, the whole thing feels generic | Phase 3, one question | the `## Style` block. Layout picks stand — but read the stage warning below |
| **Ornament** — this surface is too plain, or too busy | the correction run below | one surface, one rung |
| **Motion** — it feels static, or it is too much | Phase 2 for an action's way; the **Narrative arc** for a page that unfolds | those rows only |
| **Content** — the wrong things are on screen, or in the wrong order | not a design question: the content contract in `domain-interview`'s brief card | the brief, then re-run Phase 2 for the screens whose priority order changed |

If the user's own words already name a surface or a dimension, skip the question and route.

**A style change costs more once everything is built.** At the first screen it is one question and one
screen rebuilt. Once every screen is built, every screen and every linked CardDef's five formats are hardcoded
in the old style, so re-running Phase 3 means rebuilding all of them — and once the theme has been
extracted, it was extracted from those values too. Say that cost out loud and get a yes before Phase 3 re-runs;
switching to a one-surface ornament move is often what the user actually wanted.

## "this is too plain" / "this is exhausting"

The correction path, for when the built thing disagrees with the budget Phase 3 set. It is **not**
how ornament first arrives — if a first generation comes out bare under a rich style, the bug is
that Phase 3 never assigned the rungs, and the fix is there.

When someone names a surface that is plain, bare or boring — or, under a rich baseline, busy,
exhausting or focus-less — run [`references/enrichment-moves.md`](enrichment-moves.md) against **that one surface**: read
the unit's `## Design direction` style and budget, move that surface **one rung**, up or down, pick moves the
style can account for, write an `Enrichment` line and an acceptance line back into `## Design direction`,
rebuild only that surface. Downward is a real outcome: the fix for "nothing stands out" is almost
never adding more.

Two bounds keep it from turning into a redesign:

- **It never reaches L3 on its own.** The unit has one arresting thing; promoting a second means
  demoting the first, and that is a Phase 3 decision the user makes.
- **`fitted` works inside the ladder, never on it.** The host's size container and upstream's
  [`container-query-fitted-layout.md`](../../boxel/references/container-query-fitted-layout.md) own the breakpoints, the regions each size shows and the
  `FittedCard` implementation — read it at build time, never from a copy restated here. Enriching a
  plain fitted view is *placement and ornament within the regions that size already has*: which
  field leads, which field sits in which region, the single mark where the head is all there is,
  whether there is a hero, and ornament inside a region — tuned through `--fc-*` and
  `@container fitted-card` overrides. Not in scope: moving or restating a breakpoint, asking for a
  region a size does not have, or writing spacing and type numbers into `## Design direction`. Where the two
  disagree, upstream wins.

Being asked for the whole unit — "the app looks generic" — is a style question, not this. Go to
Phase 3.
