# Phase 5 — Write DESIGN-DIRECTION.md

Part of [`design-direction`](../SKILL.md). Links are relative to this file.

Use [`references/design-direction-md-template.md`](design-direction-md-template.md), saved beside the unit's code (for an app, at the kit root). It must
carry, per screen: the layout pick with its reason, the interaction way per action with budgets
and fallbacks, the three beats, the style with its controls and reference and type line, the
gravity wells kept on purpose, and **acceptance lines** a reviewer can tick without taste.

For apps, also write **set acceptance lines** — what must hold across every screen *and every
linked card's embedded view*: one display face, the accent in the same role and nowhere else, one
eyebrow treatment, the same way for the same kind of action, one empty-state voice. Include at
least one line that only a card can fail, such as: every linked card's embedded view leads with the
field that identifies it, not with its title and a truncated description. `design-review set` ticks these across all screens at
once, and they are the only thing that catches five screens that are each fine alone.
