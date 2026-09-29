---
name: domain-interview
description: >-
  Use when someone asks for an app, kit or card in a domain ("build me a scheduling app for
  salons", "spec this out"), or when a brief is too vague to build from — even when the user sounds
  confident. Interviews the user and writes a buildable brief as a brief card — schema, coverage
  matrix, per-screen content contracts, flows, real sample data — that a builder builds from. NOT for layout, style or motion (boxel-design and the design-playbook own those).
boxel:
  kind: skill
---

# Domain Interview

_What the thing is, never how it looks._

| Contract | |
|---|---|
| **Reads** | The user's answers, asked in rounds; the catalog, through a `catalog-reuse` search, for the coverage matrix |
| **Writes** | One brief card in the target realm: `Brief/<slug>.json`, a `BriefCard` whose `spec` field is the spec — and `brief-card.gts` beside it when the realm has no definition yet |
| **Stops when** | The brief card is written and read back, and the hand-off (`design-direction` or keep refining) is offered as a choice. It never decides which; what runs next is the user's call |

**While this skill is active, the brief card is the only deliverable.** It replaces the build path
for this conversation: do not run the design-playbook or its Stage 0 artifacts, do not pick a
theme, do not write any `.gts`, and do not build a Home app — the index's build rules apply to
whatever builds from the brief, not to this skill. The only files you write are
`Brief/<slug>.json` and, when the realm lacks it, `brief-card.gts`. Start with interview round 1 below; do not open with a design, a
mockup or a schema.

You are interviewing to find out what a practitioner in this domain actually does, then writing
it down as something a builder can build from. Two jobs, in order: **upskill the user** so they
can judge the result, and **produce the spec**.

**Make no design decisions.** No layout, no style, no palette, no typography, no motion, no
mockups, no adjectives about feel. Content contracts describe *what information must be present
and in what priority* — never where it sits or what it looks like. This boundary is the point of
the skill: mixing the two is how a spec ends up prescribing a dashboard before anyone asked
whether the job needs one, and the design step cannot do its job on a spec that has already half-decided the screens.

## Interview

Research the domain first if you can — real workflows, real terminology, what practitioners
complain about. Arriving with context makes the interview shorter and better, and the user
usually cannot list what they have never had to name.

Ask in rounds, not all at once. Each round should change what you ask next.

1. **Who and what** — who uses this, what job it does for them, what they use today and what is
   wrong with it.
2. **The work itself** — walk one real instance end to end. Concrete: names, numbers, what
   happens on a bad day. Vague answers here mean the spec will be vague.
3. **The unwritten rules** — what a novice gets wrong, what the domain's edge cases are, what
   must never happen. This is where expert-level features come from.
4. **Scope** — MoSCoW (must / should / could / won't) against what you have heard. Say what you
   are cutting and why, so the user can push back while it is cheap.

**Upskill as you go.** When the domain has a concept the user has not named, explain it in a
sentence and ask whether it applies. A spec the user cannot evaluate is a spec that gets
approved and then rebuilt.

**Ask with selectable options, not a blank prompt, whenever the environment supports it.** Most
of this interview's questions have a small, nameable set of likely answers ("shared stock across
platforms, or separate per platform?", "full status lifecycle, or a simple resolved/unresolved
flag?"). When the harness offers a structured choice tool (e.g. Claude Code's `AskUserQuestion`),
use it for these instead of typing the question as prose the user must answer from scratch — it
is friendlier to someone who is not a domain expert and does not yet have the vocabulary to
compose an answer, and naming the options is itself part of upskilling them. Always include a
recommended option and leave room for free text (the tool's "Other" is enough). Reserve plain
open-ended chat questions for the ones no short option list could represent — "walk me through a
real order end to end," "what's the worst version of this you've dealt with." Batch a round's
related questions into one multi-question call rather than one at a time. If a question call is
rejected or the user wants to answer in free text instead, drop the tool for that round and
continue in chat — don't force it.

## Output

The spec is a **brief card**: a `BriefCard` instance at `Brief/<slug>.json`, its `spec` field
written from `references/brief-template.md`. The card URL is the deliverable. The card has one
MarkdownField per stage — `spec` (this skill), `designDirection` (`design-direction`), `motion`
(`motion-authoring`) — so no stage ever touches another stage's text.

**Where it goes.** In the realm the user named. If they named none, the current realm — the
`realmUrl` in your context — when its `realmPermissions.canWrite` is true; otherwise ask which
realm to use before writing.

**The definition.** `BriefCard` is `references/brief-card.gts`. Search the target realm for it
first — `brief-card.gts` at the realm root, or any instance whose `adoptsFrom` names `BriefCard`.
If the realm has none, write it there with one SEARCH/REPLACE block: the URL line is
`<realm-url>brief-card.gts (new)` and the body is the reference file verbatim. Instances then adopt
from `./brief-card`, so nothing crosses realms.

| Field | Holds |
|---|---|
| `cardInfo.name` | the brief title — `{Name}`, without a "— brief" suffix |
| `cardInfo.summary` | the Overview paragraph |
| `spec` | the spec markdown, from Overview to Open questions |
| `designDirection` | empty — `design-direction` writes it |
| `motion` | empty — `motion-authoring` writes it, and only when the direction asked for an arc |

**Writing it in the Boxel AI assistant.** Three steps, so the spec markdown is never hand-escaped
into a JSON string and never patched into a card that is not indexed yet:

1. **Create the instance** with one SEARCH/REPLACE block (read `source-code-editing` first if you
   have not read it this session). The URL line is `<realm-url>Brief/<slug>.json (new)`; the body
   is the card JSON with `adoptsFrom` `{ "module": "./brief-card", "name": "BriefCard" }`,
   `cardInfo.name`, `cardInfo.summary`, and `spec`, `designDirection` and `motion` all `null`.
2. **Wait until it is a card.** `patch-fields` applies only to an indexed card. Read the instance
   back with `read-card-for-ai-assistant`; if it does not resolve yet, read again rather than
   patching a card that is not there.
3. **Fill `spec`** with `patch-fields` on that card, passing the whole spec markdown as the value.
   The tool serializes it; do not escape newlines or quotes yourself. `spec` is this skill's own
   field, so replacing it whole touches nothing another stage wrote.

**Refining a brief that already exists.** A change to one section of an existing `spec` — a
screen's content contract, a schema row — is an `apply-markdown-edit` on the `spec` field with that
section as `currentContent`, not a second full `patch-fields`: the field is long, and re-sending all
of it to change one paragraph is how a paragraph elsewhere gets dropped. Other stages' fields are
never yours to edit.

**Then check it landed.** Read the card back. If `spec` is empty or shorter than the spec you
wrote, patch it again — never tell the user the brief is saved until the card you read back holds
it.

It carries:

- **Overview** — one paragraph: what it does, who for, the single deliverable.
- **Domain primer** — enough for an engineer with no domain knowledge to make sensible calls:
  why the domain exists, a glossary, and the practitioner's workflow as steps, not screens.
- **Schema** — CardDefs, FieldDefs, relationships. Say which fields are computed, which are
  sensitive, which are **links rather than contained copies** — that call is load-bearing, because
  the build declares the real link from the first screen rather than standing it in. **Any field
  whose data is an image is an image field, never a URL string**: the catalog's `Image Source Field`
  lets each instance choose a pasted URL *or* a file uploaded into the realm, and a `StringField`
  removes that choice before the user sees the form. Several images means the multi form; where
  caption and credit matter, they belong in the same field, not in strings beside it. Do not design the field *types* in detail;
  name what the data is and let the build stage pick.
- **Element coverage matrix** — every card, field, component and command the build needs, each
  marked **new / extend / reuse**. The reuse column is what stops the build re-inventing a
  field the catalog already ships; leave it unmarked and it will. Fill it from a real search, not
  from memory — `catalog-reuse` says what to search for and declares
  the tool. Name the **commands** even when they look obvious — the built app is checked against
  this row, and a command that was never listed is a command nobody notices is missing.
- **Content contracts, per screen** — for each screen: its purpose, whether it **reads, writes or
  both**, the primary action **and its mechanism**, what it must contain **in priority order**, the
  key moment, and what the empty state has to say. The priority order is the most load-bearing
  thing in the spec — the design step decides layout by reading which block the list puts first.

  **Mechanism** is one of four words, and it costs nothing to write here while costing a rewrite to
  discover late: **navigate** (opens another card), **write** (changes a field on a card), **work**
  (runs a command), or **read-only** (this screen has no primary action, which is a legitimate
  answer and should be said out loud). The build turns each into a real control at its first
  screen and wires it at the end, and a row whose mechanism was never declared is a row nobody
  can wire. Do not describe *how* the action presents — that is the design step's.

  A screen that writes also says **what it writes to**: which CardDef and which fields. A form
  whose target is unnamed is how a build ends up with an enquiry form bound to one thing and a save
  button bound to another, both looking finished.
- **Flows** — the two or three paths that matter, as steps.
- **Sample data** — three to five instances per CardDef, written as real content: real names,
  real numbers, real dates. Lorem ipsum here produces a thin-looking app later, because the
  build stage composes against whatever content exists.

## Schema thickness

A card with three or four thin fields will look thin no matter what anyone does with it later.
When the domain has detail — a rating, an author, a duration, a category, a status history —
put it in the schema. Err toward more fields; the build stage can ignore one, but it cannot
compose with one that was never specified.

Expect schema to grow at build time when the design needs something. That is not a spec failure.

## Finish

The brief card is the whole deliverable. Give the user its URL. If the brief still has open
questions, say so in one line before the hand-off.

**Then hand off — offer the next stage, don't decide it.** Ask, with a structured choice tool
where the environment supports it: move on to `design-direction` (decide how it looks before
anything is built), or keep refining this brief. Recommend `design-direction` when the brief has
no open questions left; recommend refining when it does. Do not start `design-direction` yourself
and do not build anything — naming the next stage is as far as this skill goes.

## Pair with

- **`catalog-reuse`** — the search behind the coverage matrix's reuse column.
- **`boxel`** — the CardDef, FieldDef and link rules the schema has to respect.
- **`design-direction`** — the hand-off after the brief; reads this brief card's `spec` and
  writes its `designDirection` field. Never run it from inside this skill — only offer it.

## Don't use for

- Deciding layout, style, colour or motion — that is `boxel-design` and the design-playbook (`boxel/references/design-playbook.md`), after this spec is agreed.
- Writing CardDef or FieldDef code — that is `boxel` or the software factory, building from the brief.
- A catalog search on its own — that is `catalog-reuse`; this skill only uses it to fill the coverage matrix.

## Sections (load on demand)

- `references/brief-template.md` — the `spec` field, section by section
- `references/brief-card.gts` — the `BriefCard` definition, written into a realm that has none
