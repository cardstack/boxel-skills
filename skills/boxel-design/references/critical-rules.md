## ⚠️ Critical Rules

These are anti-pattern rules that hold regardless of process. The four-stage design-playbook (`boxel/references/design-playbook.md`) is now the canonical design workflow; this file complements it by naming the failure modes LLMs fall into when "designing from defaults."

### Avoid Default LLM Design Clichés

- **Rounded Rectangle Syndrome** — Not everything needs `border-radius`. Sharp corners are a design choice; round corners are not the default.
- **Rainbow Overload** — Restraint > using every color available. ONE accent in ≤2 places is a stronger move than four-color schemes, unless the declared style family earns more colours with a named role each ([`style-families.md`](style-families.md)).
- **Flat Hierarchy** — Create dramatic scale differences, not uniform sizes. Large light + tiny bold beats four sizes all bolded; heavy display families (playful pop, brutalist) set their own weights in [`style-families.md`](style-families.md).
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
