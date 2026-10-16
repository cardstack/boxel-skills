# Surface types — what kind of thing is this, so the shell fits

Part of [`boxel-design`](../SKILL.md). Links are relative to this file.

**Why this exists.** Every build drifts toward one editorial frame: a masthead over one long list. A
surface type is the kind of thing being built, and it decides the shell and the structures to search the
catalog for. It sets no style: type, density and colour stay with the look and the model's own judgment.

**This is optional vocabulary, not a menu**, with the same status as `style-families.md`. A brief may carry a
`Surface:` line next to `Look:` inside `designDirection`. Infer it from the user's answer to "What are you
making?" and say it in one line so the user can correct it; do not add a question to the pre-flight call.
Its stored form is one of this table's names, written exactly so (`Surface: Admin / dashboard`). Where no surface
fits, say so and leave the line out.

| Surface | Structure | Search terms (catalog stays the source of truth) |
|---|---|---|
| **Admin / dashboard** | app shell, sidebar, panel grid, tables | app shell, sidebar, dashboard grid, stat, chart, data table |
| **Back-office / data tool** | app shell, sidebar, master-detail, split panes, bulk actions | app shell, sidebar, data grid, filter set, form layout, split panes |
| **Landing / marketing** | sections, bleed, unequal split, a bento lead tile | hero split, cta band |
| **Consumer / mobile app** | bottom nav, cards, sheets | bottom nav, sheet, tabs |
| **Content / document** | prose, table of contents | prose, table of contents |
| **Component / field** | the host app's frame | n/a |

- **The build-check floors are the same for every surface** (hit area, contrast 4.5:1, type floor, phone
  overflow). A surface type sets the shell and what to search for, never a style.
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
- `design-review --layout` judges the shell against the `Surface:` line.
