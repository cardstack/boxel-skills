# Phase 2 — Layout (you decide)

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

For each screen, pick one direction from [`references/screen-types.md`](screen-types.md), adapted to the real blocks.
**Do not offer them.** That file is the brief you write from, not a menu.

Pick by the content contract: whichever block the must-contain list puts first is the dominant
object, and the primary action goes where the reading order reaches it first.

**An image field nominates the dominant object.** Where the unit carries imagery, the image is the
dominant object unless the content contract's priority order puts something above it — and
overriding it is a decision you write down, like any gravity well kept on purpose. Upstream is
blunt about the consequence: *"Media is featured. If the card has imagery (hero, cover, headshot),
it appears at scale. Don't hide it in a corner."* The failure is not ugly, which is why it survives
review: a card with one good photo gets a headline-led layout and a thumbnail, and nothing about it
looks wrong. Incidental imagery is the real exception — an avatar on an invoice row, a vendor mark
on a purchase order — and naming it as incidental is the write-down.

Check the pick against [`references/layout-gravity.md`](layout-gravity.md) and name any well it still contains — a direction may keep
one deliberately if you say why. Never pick one whose regions are all equal weight; equal weight
tells the reader nothing matters more than anything else, which is never true.

Record per screen, in `## Design direction`:

- the direction and **one line of reason**
- the dominant object and its share of the viewport
- reading order (single column, F, Z, spotlight)
- where the primary action sits
- what is above the fold at 1200×700, and how it stacks at 400 wide
- the four layout controls: stage type, information architecture, content priority, responsive
- **`prefersWideFormat`, true or false, with one line of reason** — decided here because it is a
  layout decision: whether the `isolated` view would look broken or cramped at ~720px. The rule,
  the true/false tables and the symptoms are upstream's [`prefers-wide-format.md`](../../boxel/references/prefers-wide-format.md); apply it, never restate it. Decide it
  for every CardDef in the Phase 1 list that has its own `isolated` view, not only the screens —
  found late, it costs a layout rewrite that a one-line static property would have prevented

When the user overrules this on the built screen, rewrite that screen's layout block and rebuild
that one screen. The other picks stand.
