## Asset Selection Guidelines

### Priority Order for Asset Integration

1. **Functionality First** - Asset must load without errors
   - Test all URLs before finalizing
   - Use fallback images for critical UI elements
   - Verify CORS headers for external resources
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

### Getting the image into a card

Field mechanics are in
[`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md)
and [`critical-rules.md`](critical-rules.md) *Images in templates*: an image that can be uploaded or
linked belongs in an `ImageSourceField`. An uploaded file goes in `linksTo(ImageDef)`; an external
URL goes **only** in the URL half (attributes), never in `relationships`.

#### Every media slot ships with an image

A *media slot* is any place the real product would show a picture: posters, film stills, dishes,
listings, products, destinations, vehicles, hero banners, profile photos. Cinema, food, real-estate,
travel, fashion and marketplace apps are mostly media slots, but judge by slot, not by app type.

In the first build, every media slot in every sample instance has an image. A gradient panel, a lone
glyph, or initials in a photo-sized panel is a defect; initials are fine only in a small avatar chip
that is not the main picture of a tile.

#### Source order

1. **The user's own** images or URLs.
2. **Real photos from Openverse, from a terminal** (Claude Code or any session that can run
   `curl`): one API query per subject, each URL load-checked. The recipe is in
   [`sample-images.md`](../../boxel-file-def/references/sample-images.md) → *Openverse*. Unsplash
   and Pexels search pages refuse non-browser requests, so never scrape them.
3. **A labelled placeholder** in theme colours, sized to the slot. This is the default in the
   Boxel app, where the assistant cannot make network requests, and the fallback in a terminal:
   `https://placehold.co/<w>x<h>/<surface-hex>/<muted-ink-hex>.png?text=<url-encoded label>` (the `.png` gives a raster; without it the service returns SVG)
   - The label names the slot and its subject, 40 characters or fewer: `Film still · Paris, Texas`
     becomes `?text=Film+still+%C2%B7+Paris%2C+Texas`. A slot name alone (`image1`) is not a label.
   - Hex colours from the theme, without `#`. Use a surface two steps off the page (`--muted`
     rather than `--card`) so the box reads as a picture slot on a dark page, and the muted text
     colour for the label, so the placeholder stays quieter than the real content around it.
   - The label shrinks with the picture. When one image shows both large and in a small tile, keep
     the label to two or three words (`Clinic photo`, `Rabbit`), and ask for twice the largest
     size it is shown at, so it is sharp there and still readable in the tile.
   - Shape follows the slot, at about twice the display size: poster 2:3 (`600x900`), still or hero
     16:9 (`1280x720`), listing or food 4:3 (`800x600`), avatar or product 1:1 (`400x400`).
4. **In the Boxel app, after the build:** offer AI images once, as one batched single-select question
   ("Generate 8 images for the posters and stills? This uses OpenRouter credit."), never one approval
   per image on the fast path. `generate-thumbnail` writes each into the realm; link it in the
   `ImageDef` half.

Always a labelled placeholder, never a stock or random photo, for **named fictional people**
(drivers, hosts, reviewers: a real face must not pose as a made-up person) and **real copyrighted
or branded subjects** (actual film posters, branded products, real property listings). An invented
sample item is not a real subject: a made-up film can take a photo that fits its title as its still.

`https://picsum.photos/seed/<slug>/<w>/<h>` is a random real photo, the same one per seed. Use it
only where the caption names no subject (a decorative hero, a background, a texture), ideally with
`?blur=2` or `?grayscale`. Never for a named place, dish, person, product, film or listing.

#### Never

- Guess or construct an image URL or photo ID. A made-up Pexels or Pixabay ID either 404s or loads
  an unrelated photo that looks deliberate. A URL the user gave you, or one from a photo page you
  actually opened, is not a guess.
- Hotlink a Google image result ([`untrusted-content.md`](untrusted-content.md) → *Images*).
- Use dead patterns: `source.unsplash.com` (shut down), `via.placeholder.com` (no response), the
  rackcdn unDraw URLs and `svgbackgrounds.com/<pattern>.svg` (404).
- Put an external URL in `relationships`.

#### Load failure

In templates, handle an image that fails to load (an `onerror`, or an empty `resolvedUrl`) with a
gradient from the theme's tokens. That fallback is for a runtime failure only; it is never the image
a build ships with.

#### Other sources that work

- **Icons:** `https://unpkg.com/heroicons@2/24/outline/<name>.svg` works. In a Boxel card, prefer
  the icon sets boxel-ui already ships.
- **Public-domain science imagery:** `https://images-assets.nasa.gov/image/<id>/<id>~thumb.jpg`,
  with a real NASA id.

### Asset Don'ts
- Celebrity or branded content without permission
- A real person's photo presented as a named fictional individual
- Mixing incompatible visual styles (unless intentional)
- Low-res images stretched beyond their quality

**Remember:** a broken image destroys credibility, and so does an empty frame. A labelled,
theme-coloured placeholder beats both.
