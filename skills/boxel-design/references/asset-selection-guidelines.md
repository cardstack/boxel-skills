## Asset Selection Guidelines

### Priority Order for Asset Integration

1. **Functionality First** - Asset must load without errors
   - Load-check every external URL before finalizing: from a terminal with the check in
     [`sample-images.md`](../../boxel-file-def/references/sample-images.md) → *Openverse*. In the
     Boxel app the assistant cannot fetch a URL to check it, so it uses the user's URLs and
     placeholders
   - Use fallback images for critical UI elements
   - A photo that will be downloaded into the realm needs CORS: the download runs in the browser
   - Check CDN stability (prefer established CDNs)

2. **Aesthetic Harmony** - Match the selected style reference
   - **Color grading**: Assets should complement the palette
   - **Visual weight**: Balance with overall composition
   - **Era/mood**: Vintage styles need period-appropriate imagery
   - **Quality**: Resolution and compression appropriate for use

3. **Content Relevance** - Support the narrative
   - Generic > specific when prototyping
   - Avoid overly literal interpretations
   - Consider cultural context and inclusivity

### Asset-to-Style Matching Guide

| Style Category | Asset Characteristics | Recommended Sources |
|----------------|----------------------|-------------------|
| **Minimal/Clean** | High whitespace, isolated subjects, neutral tones | Unsplash, Pexels (search: "minimal"), Burst |
| **Vintage/Retro** | Film grain, sepia/faded colors, historical subjects | Unsplash, Wikimedia Commons, NASA archives |
| **Tech/Futuristic** | Abstract patterns, gradients, dark backgrounds | Unsplash; patterns drawn in CSS or copied in as SVG (Hero Patterns), never hotlinked |
| **Editorial** | Documentary style, authentic moments, natural light | Unsplash, Pexels, Life of Pix |
| **Playful/Illustrated** | Flat colors, geometric shapes, consistent style | unDraw, Open Doodles: copy the SVG into the card, never hotlink |
| **Luxury/Fashion** | High contrast, dramatic lighting, premium textures | Unsplash, Burst (lifestyle), Pexels (fashion) |
| **Data/Scientific** | Charts, diagrams, technical imagery | NASA, NOAA, USGS |

The sources name where a person would look for that style. In a build, a photo comes only through
the source order below, never as a URL guessed from one of these sites.

### Getting the image into a card

Field mechanics are in
[`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md)
and [`critical-rules.md`](critical-rules.md) *Images in templates*: an image that may be an external
URL uses the URL/ImageDef pair (Cardinal Rule 12) or the catalog's `ImageSourceField`, which packages
that pair. An uploaded file goes in `linksTo(ImageDef)`; an external URL goes **only** in the URL
half (attributes), never in `relationships`.

#### Every media slot ships with an image

A *media slot* is any place the real product would show a picture: posters, film stills, dishes,
listings, products, destinations, vehicles, hero banners, profile photos. Cinema, food, real-estate,
travel, fashion and marketplace apps are mostly media slots, but judge by slot, not by app type.

In the first build, every media slot in every sample instance has an image. That is a rule for
sample data: the template still shows a designed state for an instance with no image, since real
records often have none (*Load failure*, below). A gradient panel, a lone
glyph, or initials in a photo-sized panel is a defect; initials are fine only in a small avatar chip
that is not the main picture of a tile. A fitted tile shows the item's own image, cropped to the tile
(the design-playbook's "focused crop of the hero"), never a second stock photo.

#### Source order

1. **The user's own** images or URLs.
2. **Real photos from Openverse, from a terminal** (Claude Code or any session that can run
   `curl`): one API query per subject, each URL load-checked. The recipe is in
   [`sample-images.md`](../../boxel-file-def/references/sample-images.md) → *Openverse*. Never
   scrape Unsplash or Pexels search pages.
3. **A labelled placeholder** in theme colours, sized to the slot. This is the default in the
   Boxel app, where the assistant has no declared tool to look up photos, and the fallback in a terminal:
   `https://placehold.co/<w>x<h>/<surface-hex>/<muted-ink-hex>.png?text=<url-encoded label>` (the `.png` gives a raster; without it the service returns SVG)
   - The label names the subject in as few words as read in the panel it fills: `Paris, Texas
     still` in a hero (`?text=Paris%2C+Texas+still`), a name alone in a tile. When one URL also
     serves a small avatar, label it for the panel, never with initials: the label will not read in
     the avatar, and initials would fill the panel. A slot name alone (`image1`) is not a label.
   - Hex colours from the theme, without `#`. Use a surface two steps off the page (`--muted`
     rather than `--card`) so the box reads as a picture slot on a dark page, and the muted text
     colour for the label, so the placeholder stays quieter than the real content around it. With no
     theme yet (a stage-1 mockup), `e5e7eb` and `6b7280`; switch them to the theme's once it exists.
     The colours are fixed in the URL, so a later theme change needs the placeholders rewritten.
   - The label shrinks with the picture: ask for twice the largest size the image is shown at, so
     it is sharp there and the label still reads where it is shown small.
   - Shape follows the slot, at about twice the display size: poster 2:3 (`600x900`), still
     16:9 (`1280x720`), full-width hero 16:9 (`1920x1080`), listing or food 4:3 (`800x600`), avatar or product 1:1 (`400x400`).
4. **AI images in the Boxel app.** When the user asked for them, or the design is brand-heavy,
   generate them during the mockup pass (design-playbook → *Brand-guided imagery during mockup*).
   Otherwise, after the build, offer them once, as one single-select question ("Generate 6 images
   for the dishes? This uses OpenRouter credit."), never one question per image. Leave out the slots
   that always take a placeholder (below), unless the user asks. Make
   every `generate-thumbnail` call in one reply, so the user approves them together; each writes a
   file into the realm, linked in the `ImageDef` half.

Always a labelled placeholder, never a stock or random photo, for **named fictional people**
(drivers, hosts, reviewers: a real face must not pose as a made-up person; an AI portrait is fine
when the user asks for one) and **real copyrighted
or branded subjects** (actual film posters, branded products, real property listings). An invented
sample item is not a real subject: a made-up film can take a photo that fits its title as its still
or its poster.

`https://picsum.photos/seed/<slug>/<w>/<h>` is a random real photo, the same one per seed. Use it
only where the caption names no subject (a decorative hero, a background, a texture), ideally with
`?blur=2` or `?grayscale`. Never for a named place, dish, person, product, film or listing.

#### Never

- Guess or construct an image URL or photo ID. A made-up Pexels or Pixabay ID either 404s or loads
  an unrelated photo that looks deliberate. A URL the user gave you, or one from a photo page you
  actually opened, is not a guess.
- Hotlink a Google image result: its page is not the image's host, and its licence is unknown.
- Use dead patterns: `source.unsplash.com` (shut down), `via.placeholder.com` (no response), the
  rackcdn unDraw URLs and `svgbackgrounds.com/<pattern>.svg` (404).
- Put an external URL in `relationships`.

#### Load failure

In templates, handle an image that fails to load (an `onerror`, or an empty `resolvedUrl`) with a
gradient from the theme's tokens. That fallback is for a runtime failure only; it is never the image
a build ships with. `FittedCard`'s `:placeholder` slot is the same case: an instance whose image a
user later cleared, never a sample instance in the first build.

#### Other sources that work

- **Icons:** in a Boxel card, use `@cardstack/boxel-icons`
  ([`icons.md`](../../boxel/references/icons.md)) rather than hotlinking an icon SVG.
- **Public-domain science imagery:** `https://images-assets.nasa.gov/image/<id>/<id>~thumb.jpg`,
  with a real NASA id.

### Asset Don'ts
- Celebrity or branded content without permission
- A real person's photo presented as a named fictional individual
- Mixing incompatible visual styles (unless intentional)
- Low-res images stretched beyond their quality

**Remember:** a broken image destroys credibility, and so does an empty frame. A labelled,
theme-coloured placeholder beats both.
