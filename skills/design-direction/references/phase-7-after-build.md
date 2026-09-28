# Phase 7 — After the build comes back

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

The screen is pushed and rendering. This phase exists because nothing else holds the gate
between "built" and "scored" — without it the gate is remembered or not.

**The user looks first.** That look is the only thing that can overrule a layout pick — Phase 2's
picks are revised by looking, not by argument — and it has to happen before anything is scored, or
a fix loop spends its rounds polishing a layout that was about to be rejected.

**Ask the outcome, not permission to review.** One structured choice, each option carrying its own
scope:

| Option | What happens | Scope |
|---|---|---|
| **Language is locked** *(recommended)* | hand to [`design-review`](../../design-review/SKILL.md) | this screen is scored |
| **Layout is wrong** | rewrite this screen's layout block in `DESIGN-DIRECTION.md`, rebuild this screen | one screen. Every other screen's pick stands |
| **Style is wrong** | Phase 4, one question | the `## Style` block — and after the batch this is a rebuild of every screen and every linked card's formats, so say that before re-running |
| *(other — the user names something else)* | | |

**On "locked", hand straight to `design-review`. Do not ask a second time.** The outcome question
already decided it: the other two answers route above and leave nothing stable to score, so "locked"
has only one sensible next step and asking for it again is a question with one answer.

Do not score it here — not the acceptance lines, not the aesthetic bar, not the constraints.
`design-review` owns the rubric, the capture rules and the fix-loop cap, and a second copy of any
of them in this file would drift from the first.
