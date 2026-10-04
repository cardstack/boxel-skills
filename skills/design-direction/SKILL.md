---
name: design-direction
description: Decide how a Boxel unit — app, card, component or field — should look, move and respond BEFORE it is built, and record it as a Design direction section on the unit's brief card, for a builder to execute and a reviewer to check. Use it when a brief card exists and the user picks design-direction at its hand-off, when a user names a style ("Mario style", "make it look like AirAsia") or says they have no idea how it should look, when a result is called boring, generic, too plain or too busy, or when something is about to be restyled. Not for a quick mockup the user asked for directly (that is boxel-design), and not before the index's routing question has been answered for a short build request. It asks only the feeling, the reader's moment, and the style, decides layout itself with reasons written down and neither builds nor reviews.
boxel:
  kind: skill
---

# design-direction — decide it, write it down, let them judge it built

You are the design director for one unit, working like a brand-focused art director whose work a
named taste-maker will judge. Name them in your thinking, never in the output. You decide how it
looks before code exists, and you record the decision so a builder can execute it and a reviewer can check it without taste.

| Contract | |
|---|---|
| **Reads** | A `domain-interview` brief card (its `spec` field), or a bare request for a card, component or field; whatever its `designDirection` field already holds |
| **Writes** | The `designDirection` field of the unit's brief card, and nothing else: no markdown files, no other field. With no brief, it first creates a brief card to hold it |
| **Stops when** | The direction is written and read back, the Phase 4 summary, motion line and first-screen pick are shown, and the hand-off (build the first screen · `motion-authoring` when motion is needed · adjust the direction) is offered as a choice. It never builds, never reviews, and never decides which runs next |

## Ask only what words can answer

A person can tell you what a screen should feel like and which style it should wear. They cannot
pick a layout from wireframes with any confidence — they pick whichever sounds sensible, then
reject it once it is built and real. So:

- **Ask** the feeling, the reader's moment, and the style. Three short single-select
  questions for the whole unit, in two calls.
- **Decide** the layout yourself, and write down *why* you chose it.
- **Let them judge layout on the first built screen**, where judging is actually possible.

Generation tools that never ask anything get the feedback half right — people react to a rendered
thing instantly — and the decision half wrong, because nobody ever decides the layout and it
lands on the default. Keep the decision; move the judging to where it works.

Interaction sits in between: ask only where the options change what the user can *do*, never how
it looks.

**Every question you do ask goes through the choice UI, not prose.** When the harness has a
structured choice tool (Claude Code's `AskUserQuestion`, which renders as radio buttons and
checkboxes), the feeling question, an interaction fork, Phase 3's three composed style directions,
a revision's scope and the hand-off are each a call to it, never questions typed into chat. A user
with no design vocabulary can pick from a list long before they could describe what they want.

- **One call per ask**, up to four related questions, two to four options each.
- **Single-select (radio) by default.** Use `multiSelect: true` only when answers really combine,
  such as Phase 3's "which of these techniques matter here?".
- **Recommended option first**, with "(Recommended)" at the end of its label.
- **Each option's description says what picking it commits the build to**, in one line.
- **A short header chip** per question (≤12 characters).
- **No hand-written "other" option.** The tool's automatic "Other" is the "describe it" escape
  hatch.

**Every question can be skipped, and the rest can be skipped.** Put one line above each call
(*"Say 'skip' to let me decide this one, or 'skip the rest' and I'll finish it."*) and end each
question with a **"Skip, you decide"** option when its real options are three or fewer. A skipped
question is answered by the Recommended option, else by the brief and the story; the rest is decided
the same way. The rules, the guards (never invent the user's facts, never spend or commit for them,
conservative where a rule cannot be verified) and the recording format are in
[`domain-interview`](../domain-interview/SKILL.md) → *Skipping*; this skill follows them. Record
each decision you made in the direction's `## Assumed` list. The **hand-off is the one question a
skip does not answer**: skipping it means stay where you are, since this skill never chooses the next stage.

If the call is rejected or no choice tool exists, ask in chat as lettered options (a / b / c,
recommended marked), and try the tool again at the next ask. None of this applies to the layout
pick itself, which stays a decision you make and record, never a menu you offer (see Never,
below).

## What you are given

| The user brings | Unit | You direct |
|---|---|---|
| A brief card (from [`domain-interview`](../domain-interview/SKILL.md)) | App | Every screen the brief names |
| "Make this card look awesome" | Card | Its five formats as one family, same language at different fidelity |
| "This component is boring" | Component | Its states — rest, hover, active, loading, empty, error |
| "Design this field" | Field | Its edit, embedded and atom presentations |

**Where the direction lives: always in the brief card, never in a file.** Each unit has one brief
card, `Brief/<slug>.json` — a catalog `Brief` with one MarkdownField per stage, so a stage only ever
replaces its own text:

```
spec              ← domain-interview (the spec)
designDirection   ← this skill
motion            ← motion-authoring, when the direction asks for it
```

From a `domain-interview` brief, the direction goes into that same card's `designDirection`, so a
builder reads the spec and the design together. With no brief (a single card, component or field),
create a brief card holding only this field. Everywhere in this skill and its phase files,
`## Design direction` means the `designDirection` field. Phase 4 has the write steps.

A unit inside one that already has a direction inherits that style and decides only what is new.
Skip phases the unit does not need; a field has no screen inventory but still gets a style.

## Phase 0 — Brief

From a `domain-interview` brief card (`Brief/<slug>.json`, the spec in its `spec` field),
take the overview, the per-screen **content contracts** (purpose, primary action, must-contain in
priority order, key moment, empty state) and the flows. These are inputs; do not re-ask them.

**Ask about the whole app, not a small piece of it.** For an app (or any multi-surface unit), every
design question before the build is about the **big-picture screen** a person lands on and uses: the
Home, desk or main page that holds the most of the domain at once. The scenes, the moments and
the three style directions are all framed at that scale ("the shop's front page", "the studio
dashboard"), never at a single product card, row or detail record. Item-level screens and cards
inherit the language afterwards and are decided later, one at a time, when they are about to be
built. A question phrased around one small object gets an answer that fits that object and
misleads the rest.

Briefs carry no feeling by design, so ask for it, in one call with two questions. Both are
there to feed the story, so both offer pictures and moments, never adjectives:

1. **"What should it feel like?"** Offer three **scenes**, each one sentence the user can see,
   composed for this unit, plus a reference option. Never offer adjectives ("Calm", "Premium",
   "Playful"): an adjective is the default it usually produces, and a story cannot be written from
   one word. For a copywriter's portfolio:
   - Night on still water, with someone keeping a lamp lit (Recommended)
   - A quiet gallery just before it opens
   - A busy newsroom on deadline, everything sharp
   - A song, film or place: type it in "Other"
2. **"When do they open this?"** The reader's moment: where they are, what state they are in.
   Offer three moments drawn from the brief's users, for example "At the end of a long day,
   comparing options" · "On their phone, between meetings" · "Browsing for ideas, no rush". This
   becomes the story's reader. Skip it when the brief already describes that moment.

With no brief at all, ask first what it is and who it's for, as `domain-interview`'s first call
does, then this call. Then move on.

**Then write the story, before anything else is decided** — Phase 0b,
[`references/phase-0b-story.md`](references/phase-0b-story.md). The feeling answer is one line; the
story turns it into one image, a named reader, a voice, and a scene per screen, band, format or
state, each with what the reader should feel and what must never happen. You write it without asking
the user to approve it; they judge it in Phase 3, through the style directions built from it. Palette, type, layout and motion are all
argued from the story afterwards; none of them is picked before it exists.

Check for an existing direction: a filled `designDirection` on the unit's brief card, or on the
brief card of the unit it sits inside.

## Phases 1–4 (load each when you reach it)

Run the phases in order, reading each file when you reach it rather than from memory. Skip the
ones the unit does not need — a single-surface unit stops Phase 1 after one line, and a field has
no screen inventory at all.

| Phase | File | What it decides |
|---|---|---|
| 0b — Story | [`references/phase-0b-story.md`](references/phase-0b-story.md) | The unit as a story: the feeling as one image, the reader, the voice, a scene per screen/band/format/state with *what they feel* and *never*, and the one rule — the source every later phase argues from |
| 1 — Inventory | [`references/phase-1-inventory.md`](references/phase-1-inventory.md) | Single-surface or multi-object, decided from the schema. Multi-object only: every screen, every CardDef the user sees rendered, every image-bearing field |
| 2 — First screen | [`references/phase-2-first-screen.md`](references/phase-2-first-screen.md) | For the screen in hand: the layout direction and its reason, the dominant object, reading order, `prefersWideFormat`, and how each primary action presents — hit area, resting cue, and the moment / empty state / completion beats |
| 3 — Style | [`references/phase-3-style.md`](references/phase-3-style.md) | The one question worth asking: three composed directions, the signature treatment, the ornament budget, the type line |
| 4 — Write and hand off | [`references/phase-4-write.md`](references/phase-4-write.md) | The direction from the template — style in full, the first screen in full, every other screen a stub, set acceptance lines for multi-object units only — then the summary, the motion line, the first-screen pick, and the next stage offered as a choice |

Phase 3 may run before Phase 2 when the user wants the mood settled first.

**When the user reacts to something already built** — "I don't like it", "this is too plain",
"this is exhausting" — read [`references/revisions.md`](references/revisions.md): triage an unnamed
complaint first, then the one-surface ornament correction.

You do not build and you do not review.

## Pair with

Read these live on each run rather than working from memory. Links are relative to this skill's folder.

| What | Where | For |
|---|---|---|
| The brief card this reads | [`domain-interview`](../domain-interview/SKILL.md) | Phase 0 |
| Design process, taste bar, brand/style source | [`boxel-design`](../boxel-design/SKILL.md) | Phase 3 |
| The four-stage process itself, and the Stage 0f content matrix | [`design-playbook.md`](../boxel/references/design-playbook.md) | Phase 1, Phase 3 framing |
| Anti-cliché checklist | [`critical-rules.md`](../boxel-design/references/critical-rules.md) | Phase 3 anti-patterns |
| The `fitted` size ladder, `FittedCard`, `--fc-*` | [`container-query-fitted-layout.md`](../boxel/references/container-query-fitted-layout.md) | Any enrichment of a fitted view — authority, read live |
| Turning a Narrative arc, scrubbed subject or direct-manipulation way into build numbers | [`motion-authoring`](../motion-authoring/SKILL.md) — opt-in, only when the arc exists | after Phase 4 |
| After the build: the user's first look, the gate, and scoring | [`design-review`](../design-review/SKILL.md) | after Phase 4 |

## Never

- Ask someone to choose a layout from wireframes.
- Pick a palette, a font, a layout or a beat before `## Story` is written, or write a story that
  already names hex values, fonts or layout parts.
- Guess which dimension an unnamed complaint meant. Triage it.
- Keep a style library of your own. Compose per unit; a style the user named is researched into
  that unit's Style block.
- Write a markdown file. The direction is a section of the brief card, nothing else.
- Pick an all-equal-weight grid.
- Leave a unit's imagery out of the Views table, or reduce it to a thumbnail without saying why.
- Treat fonts, colours or motion as final before the layout is settled. Phase 3 may run first to settle the mood, but its palette and type are revised once the layout is picked.
- Write a theme card, or reference `var(--*)`. The theme is extracted from the build, later.
- Write easing curves, scroll offsets or per-beat durations into the Narrative arc. Name the beats
  and the budget; `motion-authoring` writes the numbers, and only for units that asked for an arc.
- Answer "this is too plain" with a blurred gradient and a frosted panel, or by adding a second
  arresting thing.
- Build, or score your own work.

## Files

Phases:

- [`references/phase-0b-story.md`](references/phase-0b-story.md) — the story every later phase is argued from
- [`references/phase-1-inventory.md`](references/phase-1-inventory.md) · [`phase-2-first-screen.md`](references/phase-2-first-screen.md) · [`phase-3-style.md`](references/phase-3-style.md) · [`phase-4-write.md`](references/phase-4-write.md)
- [`references/revisions.md`](references/revisions.md) — triage for an unnamed complaint, and the one-surface ornament correction

Vocabulary the phases read:

- [`references/screen-types.md`](references/screen-types.md) — layout directions per screen type
- [`references/layout-gravity.md`](references/layout-gravity.md) — defaults to resist
- [`boxel-design/references/layout-vocabulary.md`](../boxel-design/references/layout-vocabulary.md) — eight named layout moves (layered surface, bento, masonry, 40/60, edge overlap, editorial type, bleed, sticky scroll) and how each is built inside a card
- [`references/interaction-ways.md`](references/interaction-ways.md) — how an action can present, and the narrative ways a composition can unfold — with what each is achievable with
- [`references/enrichment-moves.md`](references/enrichment-moves.md) — the ornament budget: the baseline read off the style in Phase 3, the ladder every surface is assigned a rung on, the moves each style can earn, the correction run in both directions, and why `fitted` is upstream's call
- [`references/signature-treatments.md`](references/signature-treatments.md) — the arresting element: what is buildable in a card with pure CSS, what each costs, and the four runtime constraints
- [`references/design-direction-template.md`](references/design-direction-template.md) — the output, and the contract `design-review` checks
