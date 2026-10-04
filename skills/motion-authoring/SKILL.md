---
name: motion-authoring
description: >-
  Turn a `## Design direction` narrative arc, scroll-scrubbed signature or direct-manipulation way into a
  `motion` field on the same brief card that a builder executes number-for-number — the still frame,
  the engine, the load-bearing structure, every beat as target · property · from → to · trigger · duration
  · ease, and the three capture points. Opt-in: use it only when `## Design direction` already asked for
  narrative or continuous motion
  (a Narrative arc, a scroll-scrubbed subject, a spatial model of perspective or scene, an Interaction
  row marked library, or a reference site the user wants "to move like"), after the `## Design direction` section is written
  and before those beats are built, or when a built arc "doesn't feel like the reference". Not for
  the baseline motion every build already ships (`boxel-design/references/motion-baseline.md`), and not for
  motion that is only discrete feedback under 400 ms — and not for deciding whether a unit moves (that
  is design-direction).
boxel:
  kind: skill
---

# Motion Authoring

_Write the motion the way the best prompt libraries do._

| Contract | |
|---|---|
| **Reads** | The unit's brief card: its `designDirection` field — Narrative arc, signature treatment, spatial model, Interaction table — and the layout block of the screen the arc lives on |
| **Writes** | The `motion` field of that same brief card, and nothing else: no markdown files, no other field |
| **Stops when** | The field is written and read back, each beat and library row is reported in one line, and the next stage is offered as a choice. It never builds and never scores |

Everywhere below, `## Design direction` means the brief card's `designDirection` field and
`## Motion` its `motion` field.

`design-direction` decides *whether* a unit moves and *what* the arc reveals. It records that as a
Narrative arc — a still frame, three beats, a total budget, a way per beat with its achievability.
That is the right altitude for a design decision and the wrong one for a build: a builder handed
"scroll-linked progress, library" invents the start and end offsets, the easing, the lag and the
geometry, and the result is a scroll page that moves, but not like anything anyone chose.

The libraries that reliably get an LLM to build a *specific* motion (motionprompts.dev's build
prompts, the `prompt.md` files in pulkitxm/claude-directory, MotionSites' paid prompts) all do the
same thing: **they write motion as executable specification, not adjectives.** Code for the
effect, the exact CSS geometry the effect depends on, the DOM hooks the code binds to, a
start/mid/end description, and a list of what the component claims at document level. This skill
brings that discipline to the units that need it — and only those.

## Not a second Interaction table

The `## Design direction` section's Interaction table and this section's Effect table look alike and are
not. The
Interaction table answers *which* way an action gets — one line, a budget, a fallback — and every
unit has one. The Effect table answers *exactly how* a beat that `## Design direction` already chose moves —
offsets, ease, geometry, the call — and only units with an arc have one. Nothing is decided in
both: a way with no numbers is a `## Design direction` problem, a number with no way is a `## Motion` row that
should not exist. If a beat here has no parent line in `## Design direction`, delete it or send it back.

## Opt-in: most units never get a `## Motion` section

This skill covers **heavy** motion only. Every build already carries the CSS baseline (staggered arrival, scroll reveal, hover feedback, one ambient loop) from [`boxel-design/references/motion-baseline.md`](../boxel-design/references/motion-baseline.md), applied automatically and never handed here. A unit with only baseline motion has nothing to write.

Motion of this weight is expensive to build, to review from stills, and to make accessible. It is
also what most units do not want. Open this skill only when the `## Design direction` section already contains one of:

| Trigger in `## Design direction` | Why it needs a spec |
|---|---|
| A **Narrative arc** block | three beats and a budget are a brief, not a build |
| Signature treatment = **scroll-scrubbed subject** | one element's transform follows scroll — the mapping is the design |
| Spatial model = **perspective** or **scene** | a camera has parameters nobody wrote down |
| An Interaction row whose way is **direct manipulation** (orbit, sequence scrub, explode, camera parallax) | input → value mapping, bounds and release behaviour |
| Any way marked **library** | a library loads once theming and wiring begin; its call and its host have to be written somewhere |
| The user gave a **reference site** for how it moves | the Technique column of `design-direction`'s reference inventory needs numbers |

A unit whose Interaction table is all discrete ways — navigate, panel, reflow, stamp, crossfade,
all under 400 ms — has its motion fully specified already. **Do not write a `## Motion` section for it.**
Say so in one line and hand back.

## Where it sits in the build

After `## Design direction` is written and before the first screen is built — `design-direction`'s
hand-off line `Heavy motion: needed — <trigger>`, and the hand-off choice it offers alongside it, is what
sends a unit here. `## Motion` is written into the same brief card's `motion` field,
and each library row names both the capability and its host. The first screen and the batch build
the CSS-achievable beats from it with hardcoded numbers; theming and wiring load the library rows;
`design-review` captures at the three points `## Net journey` names.
`## Motion` is read at every one of those and changed at none of them without a note saying why.

Ask nothing. Everything this section needs has been decided upstream of it — the still frame, the
beats, the signature, the budget. Where a beat is under-specified, pick the number, write the
reason, and mark it `assumed` so review can see which numbers were chosen rather than given.

## Phase 1 — Read the arc back

From Design direction: still frame · beats in order · total budget · ways and achievability · what the
arc serves. From the layout block: the dominant object and its share of the viewport, the format
it lives on (must be `isolated`), `prefersWideFormat`. From the Interaction table: any
direct-manipulation row and its input → value line.

Check two things before writing anything:

- **The still frame stands alone.** If the composition only works mid-arc, send it back — that is
  a Phase 2 problem in `design-direction`, not a number to tune.
- **One arc, one scroll owner, one full-viewport effect.** motionprompts' composition rules put
  it plainly: 105 of 248 components each claim to be the page's only scroller, and two of them on
  one page kill both. A card has exactly one scroller — its own root — so a unit gets one runway,
  one pinned sequence, at most one canvas the size of the card.

## Phase 2 — Pick one motion system

Every number in the file comes from one token set — ease, durations, stagger, scroll philosophy —
chosen from `references/motion-systems.md` and named at the top of `## Motion`. One per unit.

The reason is measured, not aesthetic: in a 248-component library, 22 components registered a
custom ease named `hop` with 13 different curves, and the last one evaluated silently won. Two
beats on one page with two eases read as two products. Fix the system, then every beat inherits
its `base` duration and `primary` ease unless the row says otherwise and says why.

The system also decides the engine class: a **staged-arrival** or **discrete-feedback** system is
CSS; **scrub-welded** is CSS scroll timelines where supported plus the scrub modifier in
`show-scroll-reveal-and-scrub`;
**scrub-lagged** and **pointer-follow** need a per-frame loop and are usually the library row.

## Phase 3 — Write the `## Motion` section

Use `references/motion-template.md`. Sections, in the order the reference libraries use them and for the reasons
each one earns its place:

| Section | What goes in it | What it prevents |
|---|---|---|
| **Goal** | one paragraph: what the reader sees at rest, what moves when they scroll or wait, where it ends — written from the direction's `## Story` scenes when it has one. Bold the signature move | a list of features instead of a scene |
| **Engine** | the system name; per beat, **CSS** (which property, which timeline) or **library** (the capability, the import shape, the plugin list, what is *not* used, and the host — pinned CDN URL or realm bundle) | a `<script>` on the first screen with no host decided; SplitText pulled in for one headline |
| **Load-bearing structure** | the DOM as an indented tree with the hooks the code binds to (`data-*`, never classes), then the CSS geometry the effect depends on — runway height, sticky viewport, track width, anchor positions, `will-change`, `isolation` — marked **may not change** | a builder "tidying" the `calc(100% / var(--screens))` that makes sticky work |
| **Effect — exhaustive** | one row per beat: target · property · from → to · trigger (load / scroll `start` → `end` / pointer) · duration · ease · stagger · once or replay. For a library beat, the actual call. For a mapping, the formula and its bounds | adjectives. "Parallax" is not a spec; a 3:4 rate difference between two triggers is |
| **Net journey** | three lines — start / mid / end — of what is on screen. These are `design-review`'s capture points | a review that captures scroll 0 only and passes an arc that never moved |
| **Behaviour notes** | trigger class (scroll-only / autoplay / one-shot) · reversible? · once vs replay with the reason · reduced-motion answer as a *state*, not "off" · keyboard and touch equivalents · desktop-first or not | a rotation only a mouse can reach; a fade that re-hides on scroll-back |
| **Composition contract** | what this unit claims at card level — the scroller, a fixed overlay, custom properties on the root, the one L3 — and what a second unit on the same page must not also claim | two runways, two preloaders, `--ink` defined twice |

Two rules on the numbers:

- **Copy the numbers into the row, do not reference them.** A row that says "base duration" is
  read by a builder as "pick one". Write `480ms`, and let the system table explain where it came
  from.
- **Every transform is `transform` and `opacity` only, and every entrance beat is `transform`
  only** — `references/card-constraints.md` §3 has the capture-timing reason. Where a reference
  site scrubs `filter`, `width` or a shadow, translate it to a compositor property and note the
  translation.

## Phase 4 — Apply the card constraints

Read `references/card-constraints.md` and check every row of the Effect table against it. The
reference libraries assume they own the document; a card owns a scroll box inside a host pane
that may be 400 px wide, opened twice, and screenshotted at a fixed moment. Each constraint there
was paid for on a real build; the file exists so the next build does not pay again.

Fold the results back into the `## Motion` section as concrete lines — `root: <the card's scroller>`, not
"observe correctly".

## Phase 5 — Hand back

One line per beat: name · engine · trigger · the one number that defines its feel, plus one line
per library row with its host. The build then proceeds from `## Design direction` + `## Motion` together.

**Writing it onto the brief card.** Read the card back first so it has resolved, then
`patch-fields` the `motion` field with the whole section as the value — it is this skill's own
field, so nothing else on the card is re-sent or at risk. A later change to one row is an
`apply-markdown-edit` on `motion` with that row's block as `currentContent`. Read the card back and
check the field holds it before saying it is saved.

**Then hand off — offer the next stage, don't decide it.** Ask as one single-select question in the
choice UI (`AskUserQuestion` in Claude Code; lettered options in chat when no choice tool exists): build the first screen now that its numbers exist (recommended), or
adjust the arc before anything is built. Do not start either yourself.

When a built arc comes back "not like the reference": re-read the reference's technique column,
find the beat whose numbers differ, change that row, note the change. Do not re-open the arc's
existence — that is `design-direction`'s triage row for **Motion**.

## Never

- Write a `## Motion` section for a unit whose motion is all discrete feedback. The Interaction table is
  the spec.
- Decide whether a unit moves, add a beat `## Design direction` did not name, or promote motion to the
  arresting thing. The arc serves the signature.
- Name a library without its host, or a host without the capability it serves.
- Use `vh`/`vw`, `document.querySelector`, a document-level listener, `root: null`, or
  `container-type: size` on the root — `references/card-constraints.md`.
- Ship an entrance that animates `opacity`, on a card reviewed from stills — `transform` alone.
  `design-direction/references/signature-treatments.md` lists `translateY` + `opacity` as an allowed staggered reveal, and that
  stands for a unit with no `## Motion` section; once an arc is specified here it is captured at three
  points and an opacity entrance makes those captures unreadable.
- Mix two motion systems in one unit.
- Score the result. `design-review` captures the three points and owns the rubric.

## Pair with

Read live; never restate their content here. Local links are relative to this skill's folder.

| What | Where | For |
|---|---|---|
| The spec shape this skill borrows: Goal · Tech · Layout · load-bearing CSS · exhaustive effect · Net journey · Behavior notes · composition contract | `https://motionprompts.dev/prompts/<slug>.md` (any), `https://motionprompts.dev/llms.txt` | Phase 3 — the shape, not the components, which assume a document, a bundler and absolute asset paths |
| One motion system per page; the `hop` collision | `https://motionprompts.dev/api/v1/motion-systems.json`, `.../composition-rules.json` | Phase 2 |
| Whether and what — the arc, the ways, achievability | `design-direction/references/interaction-ways.md` → *Narrative ways*, *Direct manipulation* | Phase 1 |
| The scrubbed subject and the spatial model | `design-direction/references/signature-treatments.md` | Phase 1 |
| Reveal and scrub modifiers with `root`, `unobserve`, reduced-motion already applied | `show-scroll-reveal-and-scrub` | Engine — start from it, never rewrite the observer |
| Async CDN load; which URL; realm-bundled route | `boxel/references/external-libraries.md`, `boxel-patterns/references/integration-surfaces.md` §6 and §8 | Engine → library rows |
| Resting state is the final state | `boxel-ui-guidelines/references/template-patterns.md` | Behaviour notes |
| Capturing the three points, the motion-off pass | `design-review/references/capture.md` | Net journey |

MotionSites' own prompts are paid and their scraped copies were taken down (GitHub DMCA, June and
September 2026). Do not fetch them; the open sources above carry the same structure.

## Don't use for

- Deciding whether a unit moves, or what its arc reveals — that is `design-direction`.
- Discrete feedback under 400 ms — the `## Design direction` Interaction table is already its whole spec.
- Scoring built motion — that is `design-review`, capturing at the three Net journey points.

## Sections (load on demand)

- `references/motion-template.md` — the output, and what `design-review` captures against
- `references/motion-systems.md` — the five token sets, one per unit, and how each maps to an engine
- `references/card-constraints.md` — what a card runtime does to motion written for a document: scroller, sizing, capture timing, double-mount, library loading
