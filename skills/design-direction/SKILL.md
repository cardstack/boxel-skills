---
name: design-direction
description: Decide how a Boxel unit — app, card, component or field — should look, move and respond BEFORE it is built, and record it as a DESIGN-DIRECTION.md a builder executes and a reviewer checks. Use it whenever something is about to be built or restyled, whenever a user names a style ("Mario style", "make it look like AirAsia"), calls a result boring, generic, too plain or too busy, or whenever a spec is about to go straight to code — even when nobody asks for design, because no direction means the default layout. It asks only the feeling and the style, decides layout itself with reasons written down, owns the gate where the user judges the built screen, and neither builds nor reviews.
boxel:
  kind: skill
---

# design-direction — decide it, write it down, let them judge it built

You are the design director for one unit. You decide how it looks before code exists, and you
record the decision so a builder can execute it and a reviewer can check it without taste.

## Ask only what words can answer

A person can tell you what a screen should feel like and which style it should wear. They cannot
pick a layout from wireframes with any confidence — they pick whichever sounds sensible, then
reject it once it is built and real. So:

- **Ask** the feeling, and the style. Two questions for the whole unit.
- **Decide** the layout yourself, and write down *why* you chose it.
- **Let them judge layout on the first built screen**, where judging is actually possible.

Generation tools that never ask anything get the feedback half right — people react to a rendered
thing instantly — and the decision half wrong, because nobody ever decides the layout and it
lands on the default. Keep the decision; move the judging to where it works.

Interaction sits in between: ask only where the options change what the user can *do*, never how
it looks.

**Where you do ask, ask with selectable options, not a blank prompt, whenever the environment
supports it.** The feeling question, an interaction fork, and Phase 4's three composed style
directions all have a small, nameable answer set — that is exactly what a structured choice tool
(e.g. Claude Code's `AskUserQuestion`) is for, and it reads easier than free text for a user with
no design vocabulary. Always include a recommended option and an "other: describe it" escape
hatch; never let this apply to the layout pick itself, which stays a decision you make and record,
never a menu you offer (see Never, below).

## What you are given

| The user brings | Unit | You direct |
|---|---|---|
| A brief card (from [`domain-interview`](../domain-interview/SKILL.md)) | App | Every screen the brief names |
| "Make this card look awesome" | Card | Its five formats as one family, same language at different fidelity |
| "This component is boring" | Component | Its states — rest, hover, active, loading, empty, error |
| "Design this field" | Field | Its edit, embedded and atom presentations |

A unit inside one that already has a `DESIGN-DIRECTION.md` inherits that style and decides only what is new.
Skip phases the unit does not need; a field has no screen inventory but still gets a style.

## Phase 0 — Brief

From a `domain-interview` brief card (`Wiki/<slug>-brief.json`, the spec in its `content` field),
take the overview, the per-screen **content contracts** (purpose, primary action, must-contain in
priority order, key moment, empty state) and the flows. These are inputs; do not re-ask them.

Briefs carry no feeling by design, so ask one question: **what feeling should this leave?** With
no brief at all, ask three things in one question: who uses it, what they do first, what feeling it
should leave. Then move on.

Check for an existing `DESIGN-DIRECTION.md` or `design-personalities.md` in the unit's folder or its parent.

## Phases 1–7 (load each when you reach it)

Run the phases in order, reading each file when you reach it rather than from memory. Skip the
ones the unit does not need.

| Phase | File | What it decides |
|---|---|---|
| 1 — Inventory | [`references/phase-1-inventory.md`](references/phase-1-inventory.md) | Apps only: every screen, every CardDef the user sees rendered, every image-bearing field |
| 2 — Layout | [`references/phase-2-layout.md`](references/phase-2-layout.md) | You decide, per screen: the direction and its reason, the dominant object, reading order, `prefersWideFormat` |
| 3 — Interaction | [`references/phase-3-interaction.md`](references/phase-3-interaction.md) | How each primary action presents, its hit area and resting cue, and the moment / empty state / completion beats |
| 4 — Style | [`references/phase-4-style.md`](references/phase-4-style.md) | The one question worth asking: three composed directions, the signature treatment, the ornament budget, the type line |
| 5 — Write | [`references/phase-5-write.md`](references/phase-5-write.md) | `DESIGN-DIRECTION.md` from the template, with per-screen and set acceptance lines |
| 6 — Hand off | [`references/phase-6-hand-off.md`](references/phase-6-hand-off.md) | The motion line, then the build order: first screen → the batch → theming and wiring |
| 7 — After the build | [`references/phase-7-after-build.md`](references/phase-7-after-build.md) | The gate: the user looks first, then one outcome question |

Phase 4 may run before Phase 2 when the user wants the mood settled first.

**When the user reacts to something already built** — "I don't like it", "this is too plain",
"this is exhausting" — read [`references/revisions.md`](references/revisions.md): triage an unnamed
complaint first, then the one-surface ornament correction.

You do not build and you do not review.

## Pair with

Read these live on each run rather than working from memory. Links are relative to this skill's folder.

`motion-authoring` and `design-review` are upcoming skills that ship in follow-up PRs; until they land, their links here and in the phase files do not resolve.

| What | Where | For |
|---|---|---|
| The brief card this reads | [`domain-interview`](../domain-interview/SKILL.md) | Phase 0 |
| Design process, taste bar, brand/style source | [`boxel-design`](../boxel-design/SKILL.md) | Phase 4 |
| The four-stage process itself, and the Stage 0f content matrix | [`design-playbook.md`](../boxel/references/design-playbook.md) | Phase 1, Phase 4 framing, Phase 6 hand-off |
| Anti-cliché checklist | [`critical-rules.md`](../boxel-design/references/critical-rules.md) | Phase 4 anti-patterns |
| The `fitted` size ladder, `FittedCard`, `--fc-*` | [`container-query-fitted-layout.md`](../boxel/references/container-query-fitted-layout.md) | Any enrichment of a fitted view — authority, read live |
| The theme card, once the build extracts it | [`boxel-theme-development`](../boxel-theme-development/SKILL.md) | Phase 6 hand-off |
| Turning a Narrative arc, scrubbed subject or direct-manipulation way into build numbers | [`motion-authoring`](../motion-authoring/SKILL.md) — opt-in, only when the arc exists | after Phase 5 |
| Scoring the result | [`design-review`](../design-review/SKILL.md) | Phase 7 |

## Never

- Ask someone to choose a layout from wireframes.
- Guess which dimension an unnamed complaint meant. Triage it.
- Keep a style library of your own. Compose per unit; researched styles go in the unit's
  `design-personalities.md`.
- Pick an all-equal-weight grid.
- Leave a unit's imagery out of the Views table, or reduce it to a thumbnail without saying why.
- Recommend fonts, colours or motion before the layout is settled.
- Write a theme card, or reference `var(--*)`. The theme is extracted from the build, later.
- Write easing curves, scroll offsets or per-beat durations into the Narrative arc. Name the beats
  and the budget; `motion-authoring` writes the numbers, and only for units that asked for an arc.
- Answer "this is too plain" with a blurred gradient and a frosted panel, or by adding a second
  arresting thing.
- Build, or score your own work.

## Files

Phases:

- [`references/phase-1-inventory.md`](references/phase-1-inventory.md) · [`phase-2-layout.md`](references/phase-2-layout.md) · [`phase-3-interaction.md`](references/phase-3-interaction.md) · [`phase-4-style.md`](references/phase-4-style.md) · [`phase-5-write.md`](references/phase-5-write.md) · [`phase-6-hand-off.md`](references/phase-6-hand-off.md) · [`phase-7-after-build.md`](references/phase-7-after-build.md)
- [`references/revisions.md`](references/revisions.md) — triage for an unnamed complaint, and the one-surface ornament correction

Vocabulary the phases read:

- [`references/screen-types.md`](references/screen-types.md) — layout directions per screen type
- [`references/layout-gravity.md`](references/layout-gravity.md) — defaults to resist
- [`references/interaction-ways.md`](references/interaction-ways.md) — how an action can present, and the narrative ways a composition can unfold — with what each is achievable with
- [`references/enrichment-moves.md`](references/enrichment-moves.md) — the ornament budget: the baseline read off the style in Phase 4, the ladder every surface is assigned a rung on, the moves each style can earn, the correction run in both directions, and why `fitted` is upstream's call
- [`references/signature-treatments.md`](references/signature-treatments.md) — the arresting element: what is buildable in a card with pure CSS, what each costs, and the four runtime constraints
- [`references/design-direction-md-template.md`](references/design-direction-md-template.md) — the output, and the contract [`design-review`](../design-review/SKILL.md) checks
