# Surface types — what kind of thing is this, so the defaults fit

Part of [`boxel-design`](../SKILL.md). Links are relative to this file.

**Why this exists.** Every build drifts toward one editorial look, and `style-families.md` only varies the
*look*. It does not say that a back-office tool wants dense small type and a shell, while a landing page
wants large type and one message. A surface type is the kind of thing being built; the look is how it is
dressed.

**This is optional vocabulary, not a menu**, with the same status as `style-families.md`. A brief may carry a
`Surface:` line next to `Look:` inside `designDirection`. Infer it from the user's answer to "What are you
making?" and list it only for override; do not add a question to the pre-flight call. Where no surface
fits, say so and leave the line out.

| Surface | Density and type | Structure | Colour | Search terms (catalog stays the source of truth) |
|---|---|---|---|---|
| **Admin / dashboard** | dense; about 13–14px body; tabular numerals; 28–32px controls | app shell, sidebar, panel grid, tables | neutral ground; colour reserved for status and data | app shell, sidebar, dashboard grid, stat, chart, data table |
| **Back-office / data tool** | densest; forms and filters; keyboard first | master-detail, split panes, bulk actions | plain; status chips only | data grid, filter set, form layout, split panes |
| **Landing / marketing** | large type, generous space, one message | sections, bleed, unequal split, a bento lead tile | a real signature moment and one call to action | hero split, cta band |
| **Consumer / mobile app** | 44px targets | bottom nav, cards, sheets | brand colour carries more | bottom nav, sheet, tabs |
| **Content / document** | reading measure; 16–18px | prose, table of contents | quiet | prose, table of contents |
| **Component / field** | takes the host app's look | tokens only | the host theme's | n/a |

The numbers are starting points. Refine them against real captures; do not invent a rule silently.

- **The build-check floors are the same for every surface** (hit area, contrast 4.5:1, type floor, phone
  overflow). A surface type changes taste defaults only. Dense does not mean under 12px.
- **Admin, dashboard and back-office surfaces open on a fixed sidebar shell**: a fixed left sidebar of the app's
  destinations (an icon and a label each), and a content area that scrolls beside it. The sidebar is
  the convention for these surfaces, so it is a chosen layout, not the "Sidebar by habit" well in
  [`layout-gravity.md`](layout-gravity.md); that well still applies to other surfaces, decided by
  destination count. Build the shell from the Pret UI app shell Spec, and name two or more
  destinations (for orders: Orders, Customers, Products, Reports) rather than one page with a header.
  A masthead, a hero headline and a stat strip over one long list is the editorial default, not a
  back-office tool.
- **Read this file before the first mockup**, for any build whose "What are you making?" answer, or
  prompt, names a tool, desk, admin, dashboard, back office, CRM or similar. Take the `Surface:` line
  from the brief when it has one; otherwise infer the surface from the prompt and say which you chose
  in one line.
- `design-review --typo` and `--layout` judge against the `Surface:` line.
