# Build check — the builder looks before the reviewer does

The builder runs this after the playbook's last stage and before the first review round. In five
end-to-end builds, round 1 of the review kept finding the same faults: names cut off in fitted
tiles, half-empty tiles, broken phone layouts, placeholder labels too small to read, the accent
colour spreading, controls under 44px. Every one of them shows in a screenshot. The builder had
never looked at one, so the review spent its rounds finding them instead of raising the design.

The check is pass or fail, never a score. A builder that scores its own work scores it high, and a
number here would stand in for the review that follows.

## Capture

Capture with `npx boxel screenshot` from a terminal, or `view-visually` in the app
([`capture.md`](capture.md)), and look at every image. Reading the template is not the check.

- Home and each card's `isolated` view at desktop (`--viewport 1280x…`) and phone (`--viewport 390x…`),
  at full height (a tall viewport, `390x2400`), not only the first screen: lower sections break too.
- Each linked CardDef in every format a screen shows it in: `embedded` at the width it is shown,
  `fitted` at the sizes it is shown plus the standard set in
  [`fitted-formats.md`](../../boxel/references/fitted-formats.md).

Check fitted views inside the parent that shows them first: a standalone fitted capture can lose
the theme ([`capture.md`](capture.md)).

## The check

Each line passes or fails on every capture.

1. **Names.** Every name and title shows in full, or wraps to two lines, at every size the app
   shows it. The sample data holds the longest realistic name for each card type (a two-word
   surname, a long class name), so the check sees the worst case.
2. **Fill.** No tile or row is more than about a third empty, and each format shows what its
   content matrix promises (design-playbook, Stage 0f). Room left over goes to the photo or the
   primary fact, not to blank space.
3. **Media.** Every media slot shows a loaded image or a labelled placeholder, never initials or a
   gradient where a photo belongs. A placeholder's label is readable in the panel it fills (a small avatar that shares its URL is exempt)
   ([`asset-selection-guidelines.md`](../../boxel-design/references/asset-selection-guidelines.md)).
4. **Phone.** At 390px, no horizontal scroll, no clipped text or controls. Every `@container`
   query has a container: a fitted view's comes from the host, any other needs `container-type`
   declared on an element inside the template. A query with no container never fires and leaves
   the desktop layout in place.
5. **Colour roles.** The accent appears only on the main action, the current selection and the
   roles the theme gives it, never on prices, counts or labels. A state colour (present, overdue,
   selected) never reuses a category colour.
6. **Type.** No text under 12px, uppercase labels and numerals included. Section headings sit
   visibly between body and display size.
7. **Controls.** Every hit area is at least 44×44px (32×32 inside a dense row, 8px apart). A choice
   of five or fewer options is a row of buttons or chips, not a dropdown.
8. **Main action and controls.** The main action is on Home without scrolling, at desktop and
   phone width ([`critical-rules.md`](../../boxel-design/references/critical-rules.md) → *Main
   action always on screen*). Every other control that looks pressable is one of at most three
   cheap ones and is wired (*Every visible control works*): its click handler calls `viewCard`, sets
   a tracked value, or invokes the main operation, and every link has a real `href`.
9. **One app, one signature.** The signature the Home uses (a lane rope, a ticket stub, a kraft
   label) marks each card's main object once, so the cards read as one family. It is not stamped
   on every row: a list of five bordered slips reads as a pattern, not a signature. A catalog
   card shown through its own stock template fails this line
   ([`catalog-reuse`](../../catalog-reuse/SKILL.md) → *Reuse the model, own the look*).
10. **Job first.** Each screen's largest element is what its user opens it to do: on a booking page
    the free times, on a staff card today's list, on Home what the day needs next. A screen led by
    the record's name, a form's first field or a placeholder photo fails.
11. **Same facts everywhere.** A record shows the same time, person and status on every screen it
    appears on, and a count matches the rows it counts. Sample data that contradicts itself between
    Home and a card reads as a broken app.

Fix every failure, re-capture those views, and check them again. Then start the review. The
reviewer gets the captures and the brief as usual, not this list's results.

Run it again after each review round's fixes, on every view a fix touched, at both widths. In the
bakery re-run, a fix that set a three-column grid with a 22rem minimum pushed the phone view off
the screen, and the next round scored lower for it.
