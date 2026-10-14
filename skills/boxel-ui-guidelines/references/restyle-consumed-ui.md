# Restyle consumed UI

A builder consumes things it did not design: a catalog card, a base card, a Pret UI or boxel-ui component. Their stock look can belong to another app (a CRM row with an avatar and a "Customer" pill on a bakery's Home). Reuse the behaviour, own the look.

Take the lowest step that works, judged from a capture you took, not from the code. Card chrome (corners, halo, surface colour of a linked child) has its own ladder in [`delegated-render-control.md`](delegated-render-control.md), and that file wins there.

## Scope

Every catalog card the app renders as its own UI must look designed for this app. A data-only card or a field needs no step: its parent styles it.

## The steps, for a catalog card

1. **The theme**, only when the stock template already has the right structure and visibly picks up the app's theme in a capture. A theme fixes colour and type, never a layout from another domain.
2. **Its fields in your own markup**, for one placement inside one parent: keep the link, read `@model.<field>` and its computeds in the parent's template, never recompute them. For a linked, compound or typed field (a phone number, an address) render it through its field component instead; a typed field read as `@model.x` can come out empty.
3. **Extend it and override the formats it shows in** (`isolated`, `embedded`, `fitted`, `atom`): the default when it is one of the app's own kinds of thing or shows in more than one place. Override markup only: render its computeds rather than recomputing them, invoke its existing actions (carry over any button its templates wire to one) rather than reimplementing them, and leave `edit` alone, since it stays schema-driven.
   - Create the app's instances from the subclass. An instance that still adopts the catalog class keeps the stock templates, even when a field is typed as the catalog class.
   - A field typed as the catalog class renders the subclass instance's formats, so the parent never names the subclass.
4. **Remix or build new**, only for a model or behaviour mismatch (it would change what most of its fields mean), and name why.

Record the route in the disposition: `theme`, `own markup`, `extended`, or the refusal.

## The steps, for a component

1. The theme tokens.
2. The component's documented attributes and CSS variables.
3. A plain CSS rule of your own: Pret UI components are being moved into cascade layers, so a caller's one-class rule can override a layered component. Verify it in a capture; not every component is layered yet.
4. Wrap or compose it, keeping its behaviour and accessibility.
5. Hand-roll it only when nothing above fits, and name the gap.

Do not claim a component can look a certain way until the capture shows it.
