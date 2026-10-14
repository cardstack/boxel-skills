# Restyle a reused catalog card

A reused catalog card keeps its fields, computeds and operations, not necessarily its stock look. Its templates can belong to another app (a CRM row with an avatar and a "Customer" pill on a bakery's Home). Take the lowest step that works, judged from a capture you took, not from the code.

## Scope

Every catalog card the app renders as its own UI must look designed for this app. A data-only card needs no step. These steps change what the card shows; the box the host draws around a card is not changed by any of them.

## The steps

1. **The theme**, only when the stock template already has the right structure and visibly picks up the app's theme in a capture. A theme fixes colour and type, never a layout from another domain.
2. **Its fields in your own markup**, for one placement inside one parent: keep the link, read `@model.<field>` and its computeds in the parent's template, never recompute them. Keep any button the card's templates wire to an operation, and invoke the existing action rather than reimplementing it. A card you only link to, such as an existing catalog instance, keeps its stock templates, so this step or a remix is how it gets your look.
3. **Extend it and override the formats it shows in** (`isolated`, `embedded`, `fitted`, `atom`): start here when it is one of the app's own kinds of thing or shows in more than one place; steps 1 and 2 are for an incidental card. Override markup only: render its computeds rather than recomputing them, invoke its existing actions (carry over any button its templates wire to one) rather than reimplementing them, and leave `edit` alone, since it stays schema-driven.
   - Create the app's instances from the subclass. An instance that still adopts the catalog class keeps the stock templates, even when a field is typed as the catalog class.
   - A field typed as the catalog class renders the subclass instance's formats, so the parent never names the subclass.
4. **Remix or build new**, only for a model or behaviour mismatch (it would change what most of its fields mean), and name why.

Record it in the disposition: an adopted hit names its route (`adopted, route: theme`, `own markup` or `extended`); a remix or a new build is a refusal that names the mismatch (`refused: <mismatch>, remixed` or `built new`).

Sample instances need values that pass their field's own validation: a phone number that is not a valid number reads empty.
