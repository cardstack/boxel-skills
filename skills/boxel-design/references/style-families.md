# Style families — a coverage map so every build does not look alike

Part of [`boxel-design`](../SKILL.md); read by both the quick-mockup path and
[`design-direction`](../../design-direction/SKILL.md). Links are relative to this file.

**Why this exists.** Left alone, a model drifts to one look: a large light-weight serif or thin
display face, a small bold sans for labels, one accent colour, a lot of restraint. That is a good
look for an editorial page and the wrong one for a pet shop, a game, a festival or a bank's
students' app. The earlier rules in this skill described only that look, so everything converged
on it. This file adds the rest of the range.

**This is a coverage map, not a menu.** It does not tell you which family to pick. It exists so
that the pick is made on purpose, from the brief, and so that a choice of "restrained editorial"
has to be justified like any other. A list of eight things still caps the result at what is on it:
mix across families when the brief calls for it, and name what you took from each.

## Choose the family, in this order

1. **The user's words and attachments.** A named style, a reference site, a brand guide, a font URL
   decides it. Stop here.
2. **The brief.** The domain, the audience and the reader's moment from `## Story` or the
   two-sentence story: who they are, how they feel, what the thing sells or does.
3. **Research.** For an award-style category, read what the best examples actually use (see
   [`../../design-review/references/benchmark-and-refine.md`](../../design-review/references/benchmark-and-refine.md)).
   In a fetched page's stylesheet, `font-family`, the heading `font-weight` and the colour variables
   say more than the screenshot. Record the *principle* (display face is a heavy grotesque at 800;
   five colours each tied to a product), not the brand's values.
4. **The guard.** Before finalising, write one line: *family · display face + weight · body face ·
   colour strategy*. If it reads "light serif or thin display + small sans + one accent", say which
   sentence of the brief asked for that. If none did, pick another family. Two consecutive builds
   for different briefs with the same line is a finding.

## The families

Type roles are the point: **display** carries the headline, **body** carries reading, and a third
**label** role (small caps, mono, a rounded sans) is optional. The pairs are suggestions. Every
family named is on Google Fonts, which is what a Theme card can load.

| Family | Fits | Type roles and weight pattern | Example pairs (Google Fonts) | Colour strategy | Shape and imagery | Motion character |
|---|---|---|---|---|---|---|
| **Restrained editorial** | publications, portfolios, essays, legal, clinical | display serif or humanist sans, **light to regular** at large size; body in the same family or a quiet sans; small tracked **bold** labels | Fraunces + Inter · Newsreader + DM Sans · Instrument Serif + Inter | one neutral ground, **one accent** in at most two places | square to slightly rounded; full-width photography, captions | calm |
| **Playful pop** | pets, kids, snacks, games, creative tools, community | display is **heavy and round** (700–900); body a friendly rounded sans at 400–500; no light weights | Fredoka + Nunito · Baloo 2 + DM Sans · Bagel Fat One + Nunito | **3–5 saturated colours, each with a named role**; a cream or white ground so they read | very round, thick outlines, stickers, cut-outs; illustration over stock | springy |
| **Vibrant and saturated** | music, events, fashion drops, consumer apps, sports | display grotesque or wide face at **700–800**, tight tracking; body a clean sans | Unbounded + Inter · Syne + DM Sans · Bricolage Grotesque + Inter | **high-chroma duotone or triad on dark or white**; gradients allowed when they carry a role | oversized type as image, bold crops, duotone photos | snappy |
| **Vintage and nostalgic** | cafés, bakeries, craft goods, heritage brands, travel | display is a **slab, fat serif or script**; body a warm serif; small mono or small caps labels | Abril Fatface + Lora · Bevan + Libre Baskerville · Alfa Slab One + Courier Prime | **muted, warm, low-saturation**: cream paper, ink, one or two faded accents | stamps, ticket stubs, borders, grain; photos warmed and framed | slow |
| **Brutalist** | studios, zines, galleries, anything wanting to look unpolished on purpose | display is a **condensed or mono heavy**; body a mono or a plain grotesque; **no** soft weights | Archivo Black + Space Mono · Anton + IBM Plex Mono · Rubik Mono One + Space Grotesk | black, white and one **loud** flat colour | no radius, hard shadow, visible grid and rules | snappy |
| **Technical and mono** | developer tools, data products, infrastructure, dashboards | display and body a precise sans; **mono for data and labels**; regular to semibold | IBM Plex Sans + IBM Plex Mono · Space Grotesk + JetBrains Mono · Inter + JetBrains Mono | **dark or neutral ground, one signal colour** plus status colours with fixed meanings | thin rules, dense tables, charts over photos | snappy |
| **Soft and organic** | wellness, food, family, nature, community care | display a **soft serif or rounded sans at 500–600**; body a humanist sans | Young Serif + Karla · Quicksand + Nunito · Fraunces + Karla | **earthy or pastel, low contrast between neighbours** but readable text | large radius, blobs, hand-drawn marks, natural photography | gentle |
| **Luxury** | jewellery, hospitality, high-end retail, private services | display a **high-contrast serif**, light to regular, wide tracking; body a light geometric sans | Cormorant Garamond + Jost · Bodoni Moda + Montserrat · Playfair Display + Josefin Sans | **deep ground with metallic or ivory accent**, or ivory with black | thin rules, generous space, few large images | calm |

Restrained editorial and Luxury both use light display weights. That is deliberate and belongs to
those two families only.

## What each family's check is

`design-review` reads the declared family before it scores type and colour. A family is not a free
pass: each one has a check as specific as the editorial rules were.

| Family | Typography check | Colour check |
|---|---|---|
| Restrained editorial | large at light or regular weight, small at bold, tracked uppercase labels; not everything at 500–600 | one accent, in at most two places |
| Playful pop | display at 700+ and visibly round; no thin weights anywhere; body stays readable at 16px+ | every colour has a named role; no two colours the same value and saturation competing for the same job |
| Vibrant and saturated | display at 700+ with tight tracking; one size step far above everything else | at most three high-chroma colours; text on them passes contrast |
| Vintage and nostalgic | display face has real character (slab, fat serif, script); body a warm serif at ≥16px | muted, warm palette; no pure `#000` or `#fff` unless the family wants paper and ink |
| Brutalist | heavy or mono display; **hard edges**, no soft weights | black, white and one flat loud colour; no gradients |
| Technical and mono | mono used for data and labels only, not for paragraphs | signal colour has one meaning; status colours consistent |
| Soft and organic | rounded or soft forms throughout; weights not below 400 | neighbouring colours differ in hue, not only lightness; text still ≥4.5:1 |
| Luxury | high-contrast serif with generous tracking; plenty of space | restrained: one metallic or ivory accent |

A mixed direction names its parents ("playful pop display with a technical-mono label role") and
is checked against both.

## Limits

- Font availability is not verified here. Before a pair is final, check that both families exist on
  Google Fonts and that the Theme's derived `cssImports` loads them
  ([`font-loading-theme-card-owns-imports.md`](../../boxel-ui-guidelines/references/font-loading-theme-card-owns-imports.md)).
  If a family is missing, pick another in the same family's role.
- Contrast is computed, not eyeballed: run [`../scripts/check-palette.mjs`](../scripts/check-palette.mjs) on the page
  or Theme. Mid-tone accents used as button fills or link text are where it fails.
- A very heavy display face at small `fitted` sizes becomes unreadable; the type line must say what
  the display role does at `fitted` and `atom`.
- The weights and colour rules above are starting positions drawn from common practice. Where a
  brief or a researched example contradicts them, the brief wins.
