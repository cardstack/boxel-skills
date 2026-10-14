## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Restraint > using every color available. ONE accent in ≤2 places is a stronger move than four-color schemes, unless the brief earns more colours with a named role each ([`style-families.md`](style-families.md)).
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. Large light + tiny bold beats four sizes all bolded; a direction with a heavy display role (playful pop, brutalist) sets its own weights; see the examples in [`style-families.md`](style-families.md).
- **Single Font Monotony** — Mix typefaces purposefully (serif heads + sans body, or one display + one mono). One typeface for everything is a tell.
- **Accent Border Laziness** — No thick left/top borders as "design." A 4px accent stripe is the LLM default and it always looks like one.
- **Center-All Disease** — Asymmetry creates visual interest. Centering every element flattens hierarchy.
- **Card Grid Autopilot** — Break the predictable 3-column-card layout. Editorial grids, single-column long-reads, asymmetric layouts all read more intentional.
- **Shadow Everything** — Strategic depth, not universal drop-shadows. Use shadow as punctuation, not as default chrome.
- **Icon Sprinkles** — Icons should enhance meaning, not fill space. An eyebrow + section heading without an icon is often stronger.
- **Safe Spacing** — Push extremes: ultra-tight or magazine-wide margins. The "comfortable middle" is the LLM default.
- **Gradient Overuse** — Not every element needs a gradient. Gradients are the 2024 over-used signature; flat color with intentional contrast often wins.
- **Average Quality Trap** — Aim for top 1% execution, not median competence. The design-playbook's "internal taste-maker" framing exists to push past the default.

### Never invent proof

When the build starts from a brief, its `designDirection` `Real details:` line (see `boxel-design` → *Look check*) says which of the rules below applies: `leave sections out` and `leave marked slots` set how a missing claim is handled, and `concept (demo mode)` is the only value that allows invented proof.

**Copy or record?** Before writing a fact, ask which it is.

- **Copy that claims something about the user's real business**: a hero line, an About section, a
  rating badge, a testimonial, "Trusted by 2,000 families", "Since 1998", an award, a named member
  of staff, the business's own prices or opening hours stated as fact, a service or policy it
  offers ("we see emergencies the same day", "ask about a sports guard"). It needs a source.
  Without one, describe what this kind of visit or product involves in general ("a check-up looks
  at…"), never as a promise from this business.
- **A record the app stores and the user will edit or replace**: a menu item, a screening, a
  recipe, a product in a demo catalogue, a patient in a demo list. Invent it freely and
  realistically, prices and times included. An item is a record when it is one of many
  interchangeable entries the user will edit or replace and the page only lists it (a dish, a drink,
  a product, a screening). Fees for a service the business performs (treatments, consultations,
  lessons, memberships) are copy even when stored as cards, because the figure is a commitment about
  this business's own pricing, and so is a price written in prose or a headline ("from $89").
  Ratings, testimonials, awards and founding years are copy even when stored in a card, unless the
  app *is* a review or awards tracker.

A source is something the user supplied: their prompt or answers, a file they attached, or a page
whose URL they gave and you opened. A search result or "their website" you did not open is not a
source. Quote people word for word. Other facts may be reformatted ("SINCE 2011", "Founded 2011")
but never rounded, inflated or reworded into a bigger claim ("since 2011" does not become "over a
decade of trusted care").

When a copy fact is missing:

1. **Omit it** by default. Rating badges, testimonial bands and "since" marks go unless the user
   named them.
2. **Use a role** instead of a person ("the owner"), only for a role the brief establishes. "Your
   hygienist" claims the clinic has one.
3. **Use a marked slot** only when the section is central (a restaurant's reviews, its booking
   link): one visibly unfinished placeholder style and a plain label saying what goes there ("A
   patient review goes here"). Outside demo mode, never an invented number with "(sample)" beside
   it. Usually zero slots, at most two per page; reaching for a third means omitting instead.

**Demo mode, only on the user's word.** When the user says the build is a concept, a mockup, a
pitch or a demo (or picks that answer to the real-details question), invent realistic proof, and
mark every invented claim visibly with a small "Sample" label that stays on the published page.
Never infer demo mode from a short or vague prompt: without the user's word, the rules above hold.
Even in demo mode, invent nothing that could belong to someone real: no quote attributed to a real
publication, no rating from a real platform, no award from a real body, no credential (medical,
legal, financial), an obviously fictional business name and street, a 555-01xx phone number and an
`example.com` address.

**A personal site (a portfolio, a CV) is the exception, even when the user picked demo mode:** never
invent its owner. The name, headline, bio, employer, work history, clients, rates and contact are
slots in the one placeholder style, not invented samples, and the two-slot cap does not apply to
them.

### Main action always on screen

Most apps have one main action: the thing their primary user comes to do. Before writing the Home
card, state it in one line in your plan, from the answer about who it is for.

- Public apps (visitors): book a seat, buy, enrol, sign up.
- Internal apps (operators): add a swimmer, take attendance, new booking. Prefer the operator's most
  frequent daily task. When the app is plainly record-keeping and the brief names no task, the
  single-record create.
- Read-only apps (a dashboard, a reference, a portfolio): the main action may be to open the record
  that matters most. Never invent a write workflow only to have a button.
- Apps with both audiences: the first build serves the primary one, with at most one `@operation`;
  the other audience's action is usually an outside link.

The main action is a real control: a button for an in-app operation, a link for an outside
destination. It is visible on the Home card without scrolling, at desktop and phone widths, and
shown again on the card for the record it acts on (a session card shows "Take attendance").

How it behaves depends on where its target lives:

- **Outside the app** (ticketing, payment, an external form): link to the URL the user gave. With
  none, draw the control in its final style, disabled, with a marked slot beside it: "Booking link
  not set: paste your ticketing URL". Never hide it because the link is missing, never open a
  dialog for it, and never build a booking system in its place unless the user said the app *is*
  the booking system.
- **Inside the app** (creating or changing cards in this realm): it works in the first build, as an
  `@operation` invoked through `operations()`
  ([`card-operations-authoring`](../../card-operations-authoring/SKILL.md)). A button that only
  says "coming soon" is not a marked slot; it is a broken app. The card it creates must look like
  the rest of the app: link the app's theme on it (`cardInfo.theme`), or have its CardDef take
  `cardTheme` from a card it always links to. A new record with no theme opens on a white page in
  system fonts.

Disabled is the last resort, not a shortcut: only after the operation is written and still fails
when run once against a real card (it errors, or the created card does not appear linked). Then
show the button disabled with the reason beside it, and report it as open in the build's hand-off.
These two disabled cases are the only exceptions to *Every visible control works*.

### Every visible control works

Anything that looks pressable works, or it is not drawn: a button, a row with a chevron or hover
cue, a tab, a checkbox. After the main action:

| Budget | Controls | How |
|---|---|---|
| **Free**, use as needed | A linked card | render it with `<@fields.x />`; the host makes it open on click |
| | A real link the user gave (`tel:`, `mailto:`, a URL) | `<a href>`; never invent a number, address or URL to have one |
| | A button a reused catalog card already wires and that works | keep it ([`catalog-reuse`](../../catalog-reuse/SKILL.md)); show operator buttons (confirm, check in) only where operators look, never on a page visitors see |
| **Up to three kinds** | Open a record beside this one (the side panel) | `this.args.viewCard?.(card, 'isolated', { openCardInRightMostStack: true })` |
| | Edit a record (the host's edit view is the short form) | `this.args.viewCard?.(card, 'edit', { openCardInRightMostStack: true })` |
| | Tabs, filters, "Show all" | a `@tracked` value over rows already loaded on the screen |
| **Not in the first build** | everything else | listed under "Next to add" |

A kind counts once however many instances it has: one filter row is one, and every row that opens
its record is one.

Render an open-or-edit row as a control only when `@viewCard` is there; in some previews it is
missing, and then the row is plain text, with no chevron and no hover cue:

```hbs
{{#if @viewCard}}
  <button class='row row--link' {{on 'click' (fn this.open record)}}>{{record.title}}</button>
{{else}}
  <div class='row'>{{record.title}}</div>
{{/if}}
```

Never build a drawer, dialog or off-canvas panel inside a card to open or edit a record: the
host's side stack already handles scroll, focus and close.

"Next to add" lists what waits: a second `@operation` ("Mark arrived"), a custom form, search, a
new "All …" page, anything that calls an external service or API. The build's final reply to the
user ends with it, as a short "Next to add" list, every time: even an empty list says "Nothing
waits".
It is shown on Home only in an internal app, as a short note, never on a page visitors see. A
control that is not finished when the build is handed off is deleted and listed there, never left
half-wired.

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
