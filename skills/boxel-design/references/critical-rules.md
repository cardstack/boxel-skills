## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Colours with no job. In a restrained family, ONE accent in ≤2 places beats a four-colour scheme. In a playful, vibrant or vintage family a multi-colour palette is correct, provided every colour has a named role (see [`style-families.md`](style-families.md)). The failure is colour nobody assigned a purpose.
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. In an editorial family that is large at light weight against tiny bold; in a playful, vibrant or brutalist family it is a heavy display face against a plain body. What fails is every size sitting at 500–600 with a small step between them.
- **Single Font Monotony** — Mix typefaces purposefully, by role: display, body, optional label. One typeface for everything is a tell.
- **Same Look Every Time** — A light serif or thin display face, a small bold sans, one accent and a lot of restraint is one family out of eight. Choose the family from the brief ([`style-families.md`](style-families.md)); if you land on that one, name the line of the brief that asked for it.
- **Dead Page** — A finished build with no motion at all reads as unfinished. Apply the baseline in [`motion-baseline.md`](motion-baseline.md) without being asked.
- **Accent Border Laziness** — No thick left/top borders as "design." A 4px accent stripe is the LLM default and it always looks like one.
- **Center-All Disease** — Asymmetry creates visual interest. Centering every element flattens hierarchy.
- **Card Grid Autopilot** — Break the predictable 3-column-card layout. Editorial grids, single-column long-reads, asymmetric layouts all read more intentional. Sections come from what the visitor is deciding; a layout move only where a section needs one ([`layout-vocabulary.md`](layout-vocabulary.md)).
- **Shadow Everything** — Strategic depth, not universal drop-shadows. Use shadow as punctuation, not as default chrome.
- **Icon Sprinkles** — Icons should enhance meaning, not fill space. An eyebrow + section heading without an icon is often stronger.
- **Safe Spacing** — Push extremes: ultra-tight or magazine-wide margins. The "comfortable middle" is the LLM default.
- **Gradient Overuse** — Not every element needs a gradient. Gradients are the 2024 over-used signature; flat color with intentional contrast often wins.
- **Average Quality Trap** — Aim for top 1% execution, not median competence. The design-playbook's "internal taste-maker" framing exists to push past the default.

### Never invent proof

Facts about the user's business are data, not copy: people's names, ratings and review counts,
testimonials and quotes, founding years and "since" claims, credentials and awards, client or
patient counts, prices, hours and availability. Use them only when the user or a cited source
supplied them, and use them verbatim ("since 2011" does not become "over a decade of trusted
care"). When one is missing:

1. **Omit it** when the section is not load-bearing. Most rating badges, testimonial bands and
   "since" marks simply go.
2. **Use a role** instead of a person: "your hygienist", "the owner".
3. **Use a marked slot** only when the section is central (a restaurant's reviews, a menu's
   prices): one visibly designed placeholder style, a dashed outline and a label saying what the
   real item is ("A patient review — ideally one that mentions the kids' room"). Never an invented
   number with "(sample)" beside it.

A marked slot never removes the main action. See *Main action always on screen* below.

This is about claims a page makes about a real business. Sample records inside an app (a recipe,
a task, a product in a demo catalogue) are still invented freely.

### Main action always on screen

Every app has one main action: the thing its primary user comes to do. Name it before you build the
Home card, from the step-1 answer about who it is for.

- Public apps (visitors): book a seat, buy, enrol, sign up.
- Internal apps (operators): add a swimmer, take attendance, new booking. Prefer the operator's most
  frequent daily task; when unsure, the single-record create.
- Apps with both audiences: one main action per audience's view.

The main action is a real button. It is visible on the Home card without scrolling, at desktop and
phone widths, and repeated on the cards where it applies (a session card shows "Take attendance").

How it behaves depends on where its target lives:

- **Outside the app** (ticketing, payment, an external form): use the link the user gave. With none,
  the button still shows and opens a marked slot that says what goes there ("Booking link: paste
  your ticketing URL"). Never hide the button because the link is missing, and never build a
  booking system in its place unless the user said the app *is* the booking system.
- **Inside the app** (creating or changing cards in this realm): it works in the first build, as an
  `@operation` invoked through `operations()`
  ([`card-operations-authoring`](../../card-operations-authoring/SKILL.md)). A button that only
  says "coming soon" is not a marked slot; it is a broken app. The card it creates must look like
  the rest of the app: link the app's theme on it (`cardInfo.theme`), or have its CardDef take
  `cardTheme` from a card it always links to. A new record with no theme opens on a white page in
  system fonts.

If the main operation cannot be made to pass its checks, show the button disabled with the reason
beside it, and report it as open in the build's hand-off.

### Every visible control works

Anything that looks pressable works, or it is not drawn: a button, a row with a chevron or hover
cue, a tab, a checkbox. After the main action works, add up to **three** other controls, and only
these cheap ones, which reuse what the host and the build already have:

| Cheap: may be on screen | How |
|---|---|
| Open a record beside this one (the side panel) | `this.args.viewCard?.(card, 'isolated', { openCardInRightMostStack: true })` |
| Edit a record (the host's edit view is the short form) | `this.args.viewCard?.(card, 'edit', { openCardInRightMostStack: true })` |
| A linked card | render it with `<@fields.x />`; the host makes it open on click |
| Tabs, filters, "Show all" | a `@tracked` value over rows already loaded on the screen |
| An external link | `<a href>` to a real URL |

The three counts kinds of control you build, not instances: one filter row is one, and every row
that opens its record is one. A linked card and a real link (`tel:`, `mailto:`, a URL) cost nothing
to build, so they do not count.

Where `viewCard` is missing (some previews), render the row as plain text, with no chevron and no
hover cue. Never build a drawer, dialog or off-canvas panel inside a card for this: the host's side
stack already handles scroll, focus and close. Everything else waits in a short "Next to add" note
on Home: a second `@operation` ("Mark arrived"), a custom form, search, a new "All …" page, anything
that calls out. A control that is not finished when the build check runs is deleted and listed
there, never left half-wired.

### First build: Home and four card types at most

The first build of an app is Home plus **at most four card types** the build defines (the theme
and catalog cards it links to do not count). Pick them from the main action: the record it creates
or changes, the people involved, and one or two types the Home cannot be read without. Anything
that needs no page of its own is a field on one of them (a pet's vaccinations, a clinic's visit
types). Every other type waits in the Home's "Next to add" note.

Each card type is three formats to design, fitted at several sizes. In test builds, a vet app with
nine types took about an hour and scored lower than smaller builds, because every extra type is one
more surface built in a hurry and one more for the review to mark down. A brief that names more
types keeps them; the first build makes the four the main action needs, and the next build adds
the rest.

### Image URL in templates

When using image URLs, route them through the field system so instances can override them:

```hbs
<img src={{@model.heroImage}} alt='Hero' />
```

This keeps the image editable per-instance, and the CardDef provides a sensible default URL or fallback handling.

Here `heroImage` is a URL field. A `linksTo(ImageDef)` value is a card, not a URL: never put it in
`src`; render it with `<@fields.heroImage @format='embedded' />`. A slot that may hold either takes
the URL/ImageDef pair or `ImageSourceField` ([`base-field-catalog.md`](../../boxel/references/base-field-catalog.md)).

### Design Excellence Mindset

Every element should demonstrate:

- **Intentionality** — clear rationale for each decision (and you should be able to articulate it in stage 1 of the playbook).
- **Craft** — obsessive attention to detail.
- **Innovation** — at least one fresh perspective.
- **Coherence** — a unified vision throughout.
- **Surprise** — something unexpected yet perfect.

If the final card has none of those, the design-playbook stage 1 wasn't run honestly — the "internal taste-maker" was satisfied with the LLM default. Go back and redo stage 1 with a more demanding taste-maker held in mind.
