# Phase 6 — Hand off

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Show a two-line summary per screen (layout pick and reason · style · the moment), then **one
line for motion**: `MOTION.md: needed — <which trigger: arc / scrubbed subject / direct
manipulation / library way / reference site>` or `MOTION.md: not needed — all ways discrete`. This
is the only place the user sees whether [`motion-authoring`](../../motion-authoring/SKILL.md) will run before those beats are built; a hand-off
that skips the line skips the decision. You never write `MOTION.md` yourself. Then offer:

**Build the first screen** (recommended) — hand `DESIGN-DIRECTION.md` to the build, which follows upstream
[`boxel`](../../boxel/SKILL.md): the [`catalog-reuse`](../../catalog-reuse/SKILL.md) search first, then
the [design-playbook](../../boxel/references/design-playbook.md)'s Stage 0 planning, then Stage 1 —
one core screen as a real `.gts` on **real CardDefs with the domain's real links**: image fields
are `ImageSourceField`, `prefersWideFormat` set on every CardDef to the value `DESIGN-DIRECTION.md`
recorded, every primary action a real control — styled with hardcoded values, standing on
one or two instances per def, pushed. Then the user looks.

**Which screen goes first is a rule, not a preference: the one that puts the most of the domain's
data on a single surface and holds the primary action.** Tie-break to the screen that renders the
most linked CardDefs. For an app that is usually the Home / desk screen, because it exercises many
cards' `embedded` and `fitted` at once; when Home is only a list of thin tiles, the richest record
screen goes first and Home leads the batch. The reason is the gate: the user's one look locks the
language, and the data-richest screen locks the most of it — and it is where a thin schema shows
while fixing it still costs one file. Name the pick and its reason in `DESIGN-DIRECTION.md` → Build order.

**Then the batch** — every remaining screen **and all five formats of every linked CardDef**
built static, same language, pushed — one CardDef at a time rather than in one turn, which is where
the tail gets dropped. Then `design-review set` and `design-review card` per linked CardDef.
Formats are built here, not derived later.

**Then theming and wiring** — playbook Stages 2–3: theme extracted, everything tokenized
pixel-identical, live queries, the full data set, then every action wired to the mechanism its
content contract declared. Theming belongs here and nowhere earlier; what is hardcoded on purpose
before this is *style and data volume*, never structure. The theme card itself is
[`boxel-theme-development`](../../boxel-theme-development/SKILL.md)'s, and the token authority is
upstream's [`theme-token-contract.md`](../../boxel-ui-guidelines/references/theme-token-contract.md).

Other options: **revise a pick** (Phase 3 or 4 for one choice — layout is revised by looking, not
here), or **stop here** with `DESIGN-DIRECTION.md` as the deliverable.

**Ask this hand-off as a structured choice**, not a plain offer of prose. Present the options above
— build the first screen (recommended once `DESIGN-DIRECTION.md` is written), then the batch, then theming
and wiring, revise a pick, or stop here — as selectable options with room for the user to name
something else, the same choice-tool pattern used for Phase 0/3/4 questions.

You do not build and you do not review.
