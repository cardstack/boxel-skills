# Build check — the builder looks before the reviewer does

Part of [`design-review`](../SKILL.md). Links are relative to this file.

The builder runs this after the playbook's last stage, as the end of the build and before the first
review round. Every fault it lists shows in a screenshot: names cut off in fitted tiles, half-empty
tiles, broken phone layouts, placeholder labels too small to read, the accent colour spreading,
controls too small to hit, a button that does nothing. A builder that never looks at a capture
leaves them for the review, which then spends its round finding them instead of raising the design.

The check is pass or fail, never a score. A builder that scores its own work scores it high, and a
number here would stand in for the review that follows. Record the tally before fixing (the
report's *Build output* line), then fix.

For *Scoring existing work*, the reviewer runs the same lines as the report's *Basics* block.

## Capture

Capture with `view-visually` in the app or `npx boxel screenshot` from a terminal
([`capture.md`](capture.md)), and look at every image. Reading the template is not the check.

- Home and each card's `isolated` view at desktop (`--viewport 1280x…`) and phone (`--viewport 390x…`),
  at full height (a tall viewport, `390x2400`), not only the first screen: lower sections break too.
- Each linked CardDef in every format a screen shows it in: `embedded` at the width it is shown,
  `fitted` at the sizes the app actually renders ([`fitted-formats.md`](../../boxel/references/fitted-formats.md)
  lists them).

Capture fitted views inside the parent that shows them: in the app that is the only way, and from a
terminal a standalone fitted capture can lose the theme ([`capture.md`](capture.md)).

## The check

Each line passes or fails on every capture.

1. **Names.** Every name and title shows in full, or wraps to two lines, at every size the app
   shows it. The sample data holds the longest realistic name for each card type (a two-word
   surname, a long class name), so the check sees the worst case.
2. **Fill.** No tile or row is more than about a third empty, and each format shows what its
   content matrix promises (design-playbook, Stage 0f). Room left over goes to the photo or the
   primary fact, not to blank space.
3. **Media.** Every media slot shows a loaded image or a labelled placeholder, never initials or a
   gradient where a photo belongs. A placeholder's label is readable in the panel it fills (a small
   avatar that shares its URL is exempt)
   ([`sample-images.md`](../../boxel-file-def/references/sample-images.md) → *Labelled placeholders*).
4. **Phone.** At 390px, no horizontal scroll, no clipped text or controls. Every `@container`
   query has a container: a fitted view's comes from the host, any other needs `container-type`
   declared on an element inside the template. A query with no container never fires and leaves
   the desktop layout in place.
5. **Colour roles.** The accent appears only on the main action, the current selection and the
   roles the theme gives it, never on prices, counts or labels. A state colour (present, overdue,
   selected) never reuses a category colour.
6. **Type.** In `isolated` and `embedded`, no text under 12px, uppercase labels and numerals
   included. A `fitted` view follows its own per-role minimums
   ([`container-query-fitted-layout.md`](../../boxel/references/container-query-fitted-layout.md)).
   Section headings sit visibly between body and display size.
7. **Controls.** No hit area is under 24×24 CSS px unless a 24px circle centred on it overlaps no
   other target (WCAG 2.2 SC 2.5.8); a default Pret UI `Button` (about 28px) passes. The main action
   and controls used on a phone aim for 44×44. A choice of five or fewer options is a row of buttons
   or chips, not a dropdown.
8. **Clickable.** Every control the screens draw does something
   ([`critical-rules.md`](../../boxel-design/references/critical-rules.md) → *First-shot designs are
   clickable*): it opens a linked card, follows a link the user gave, calls `viewCard` into the
   right-hand stack or the edit view, sets a `@tracked` filter, or invokes the main `@operation`
   through `operations()`. A target that cannot exist yet is a disabled control with a marked slot
   naming what is needed. No control that looks live does nothing, and every link has a real `href`.
9. **One app, one signature.** The signature the Home uses (a lane rope, a ticket stub, a kraft
   label) marks each card's main object once, so the cards read as one family. It is not stamped
   on every row: a list of five bordered slips reads as a pattern, not a signature. A reused catalog
   card may keep its stock layout for a format when that layout fits under the app's theme
   ([`restyle-reused-card.md`](../../catalog-reuse/references/restyle-reused-card.md)); it fails this
   line only when it shows without the theme, or still reads as another app.
10. **Job first.** Each screen's largest element is what its user opens it to do: on a booking page
    the free times, on a staff card today's list, on Home what the day needs next. A screen led by
    the record's name, a form's first field or a placeholder photo fails.
11. **Same facts everywhere.** A record shows the same time, person and status on every screen it
    appears on, and a count matches the rows it counts. Sample data that contradicts itself between
    Home and a card reads as a broken app.
12. **Components take the app's look.** No Pret UI or boxel-ui component shows at its library
    default (colour, radius, type) beside controls that carry the app's theme, unless the build
    named it as a gap no restyle step reaches
    ([`restyle-component.md`](../../boxel-ui-component-discovery/references/restyle-component.md), step 5).

Fix every failure, re-capture those views, and check them again. Then start the review. The
reviewer gets the captures and the brief as usual, not this list's results.

Run it again after each review round's fixes, on every view a fix touched, at both widths: a fix
that sets a three-column grid with a wide minimum can push the phone view off the screen, and the
next round then scores lower for it.
