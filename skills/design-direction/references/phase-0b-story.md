# Phase 0b — The story (write it before any style, layout or motion)

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

The feeling answer from Phase 0 is one line — a word, a song, a film, a place. A builder cannot
build from a line, and a model given only a line reaches for the defaults that line usually
produces: "calm" becomes a pale grey page, "premium" becomes black and gold. **So before choosing
a palette, a layout or a single beat, write the unit as a story.** Everything after this phase is
derived from it: the three style directions read the story's image, the layout serves its scenes,
the ornament rungs follow its intensity, and the Narrative arc is its scenes with the adjectives
taken out.

You write the story from three inputs: the brief (what and who), the feeling answer (a scene or a
reference), and the reader's-moment answer. **Anchor the image in something real**: a detail the
user gave you, or a concrete part of the service itself. Never invent a named person, a family
scene or a history to carry it. Ask nothing more before writing. When the feeling answer
is a reference rather than a scene (a song, a film, a painting, a lyric pasted in full), read it
yourself and write from that reading; Phase 3's style pick confirms it.

**Don't ask the user to approve the story** (inside this skill; the index's quick "Just build it" path instead shows its two-sentence story so the user can redirect it, because no style step follows to judge it). A paragraph is hard to judge before anything exists,
the same way a wireframe is. Build from it straight away. The user checks it in Phase 3, where
each of the three style directions shows its reading of the story next to a real palette and
type pairing. Picking a direction is picking a reading of the story.

## What the story contains

Write it into `## Story`, directly under `## Brief` in the `designDirection` field.

| Part | What it is | Length |
|---|---|---|
| **The feeling, in one breath** | an *image*, not adjectives — the one picture the whole unit keeps returning to | two or three sentences |
| **Who is reading** | a specific person at a specific moment, drawn from the brief's users: their job, their state of mind, what they are tired of | two sentences |
| **Whose voice** *(optional)* | only when the copy's register is not already settled by the brief; skip it otherwise | one sentence |
| **Scenes** | one per screen (a multi-object app), one per band of the page (a single-surface page), one per format (a card), one per state (a component) — in the brief's priority order | three lines each, no more |
| **The one rule** | what every moving or accented thing on the unit *is* — the thread that ties the scenes to one image | one sentence |

Each scene has the same three lines:

- **Scene** — what is seen, sensory and concrete, in the story's image: *"dark water, no horizon yet; a single line of lamplight travels left to right, the way light reaches a far shore."*
- **What they feel** — the test every design choice in that scene must pass, in the reader's own words: *"Someone is here, and they're calm."*
- **Never** — the tempting move that would break the feeling: *"the headline animating in; the words are already there, only the light arrives."*

A scene may be still. *"Nothing moves here at all"* is a legitimate scene, and often the right one
for the part of a unit that has to be most trusted — prices, a legal line, a confirmation.

## Rules

- **Images and feelings only.** No hex, no font names, no px, no easings, no layout words ("hero
  section", "two-column grid") in `## Story`. The story is the source those are argued from; a
  story that already names them has skipped the step it exists for.
- **One image carries the unit.** The feeling-in-one-breath image becomes the signature treatment in
  Phase 3. A story with two central images produces two arresting things, and the cap is one.
- **Scenes follow the brief, never invent it.** Each scene maps to a content-contract block (or a
  screen, format or state) that already exists and keeps its priority order. The story may
  rename a band for the reader ("the harbour" for Packages) but never adds a feature, a field or a
  claim the spec does not hold.
- **The reader is a person, not a persona.** "Users who value quality" is not a reader. "A
  marketing lead at a bank, tab six of eight, tired of copy that comes back needing a lawyer" is.
- **Write the never lines.** They are what stop the build from reaching for the default, and they
  become acceptance lines almost unchanged.

## Keep it short, and hand off

The story fixes the **feeling and the Never lines**. It does not decide composition, and a story
alone does not produce a good layout: that happens in Phase 2, where a scene with a layout problem
gets the move from [`layout-vocabulary.md`](../../boxel-design/references/layout-vocabulary.md) that
is for that problem, and the pick's **Why** cites the scene. A scene with no such problem needs no
move.

Trim anything that does not change a later decision. A story longer than the screen it governs is
decoration.

## What derives from it

| Later step | Reads from the story |
|---|---|
| Phase 1 — Inventory | nothing new — the scenes are the inventory's screens, bands, formats or states, in order |
| Phase 2 — Layout | each layout pick's **Why** names the scene it serves and its *what they feel* line |
| Phase 3 — Style | the three directions are three different readings of the one image; each direction's inspirations and visual DNA say which scene lines they serve. The signature treatment is the image made buildable |
| Phase 3 — Ornament budget | a scene's intensity sets its rung: a still scene sits at L0–L1, the scene carrying the image is the one L3 |
| Narrative arc | the build fields (still frame, beats, budget, ways) are the scenes with the adjectives removed. `motion-authoring` writes its Goal paragraph from the story, not from the beat list |
| Acceptance lines | every **Never** becomes a tickable line (*"the Packages band has no entrance motion"*); at least one *what they feel* line is made tickable the same way |

## Not a story

- **An adjective list.** "Modern, clean, elegant, trustworthy" names four defaults and decides none.
- **A description of the UI.** "A hero section with a headline and a CTA, then a grid of cards" is
  a layout, and it is the default layout.
- **A mood with no reader.** A story nobody is reading has nothing to test a design choice against.
- **A second brief.** New features, numbers or claims belong in `spec`, through `domain-interview`.

## Example (abbreviated)

From a one-page portfolio for a freelance copywriter, feeling given as a song about devotion:

> **The feeling, in one breath.** Night on still water. Far off, someone has lit a lamp and is
> keeping it lit. Whatever the weather, it will still be burning when you come back.
>
> **Who is reading.** A marketing lead at a regulated company at the end of a long day, tab six of
> eight, tired of writers who need their hand held. They are looking for someone they can stop
> worrying about.
>
> **Scene — the harbour** *(Packages)*. Nothing moves here at all; the prices sit in plain rows like
> boats on their moorings. *They feel:* clarity, no surprises. *Never:* motion on a price, a
> "most popular" badge, anything that sells.
>
> **The one rule.** Everything that moves is the same lamplight.

That story produced, downstream: a dark ink-and-moonlight palette with one lamplight accent, a
hero set like a seascape with the headline on the horizon, a price list that never animates, and a
Narrative arc whose every beat is the same line of light.
