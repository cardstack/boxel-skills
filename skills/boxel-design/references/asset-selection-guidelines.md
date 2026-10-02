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
| **Tech/Futuristic** | Abstract patterns, gradients, dark backgrounds | Unsplash, Hero Patterns, SVGBackgrounds |
| **Editorial** | Documentary style, authentic moments, natural light | Unsplash, Pexels, Life of Pix |
| **Playful/Illustrated** | Flat colors, geometric shapes, consistent style | unDraw, Open Doodles |
| **Luxury/Fashion** | High contrast, dramatic lighting, premium textures | Unsplash, Burst (lifestyle), Pexels (fashion) |
| **Data/Scientific** | Charts, diagrams, technical imagery | NASA, NOAA, USGS |

### Getting the image into a card

Where the photo comes from (the user's own, AI-generated, a stock photo, or a placeholder) and how
it reaches a card instance are covered in
[`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md).
The short version:

- **Field choice.** An image that can be uploaded or linked externally belongs in an
  `ImageSourceField` (it wraps `ImageDef` and a URL, and computes `resolvedUrl`); upload-only is
  `linksTo(ImageDef)`. Order and recipe: [`critical-rules.md`](critical-rules.md) *Images in templates*.

- **Never guess an image URL.** A made-up Pexels or Pixabay ID either 404s or loads an unrelated
  photo that looks deliberate. Use a URL the user gave you, or one from a photo page you actually
  opened.
- **Placeholders that work for any value** (checked 2026-09-30):
  - `https://picsum.photos/seed/<slug>/<w>/<h>`: a real photo, stable per seed, random subject
  - `https://placehold.co/<w>x<h>/<bg-hex>/<text-hex>?text=<label>`: a labelled box
- **Dead patterns, never use:** `source.unsplash.com` (shut down), `via.placeholder.com` (no
  response), the rackcdn unDraw URLs and `svgbackgrounds.com/<pattern>.svg` (404).
- **Icons:** `https://unpkg.com/heroicons@2/24/outline/<name>.svg` works. In a Boxel card, prefer
  the icon sets boxel-ui already ships.
- **Public-domain science imagery:** `https://images-assets.nasa.gov/image/<id>/<id>~thumb.jpg`,
  with a real NASA id.
- **Fallback:** a solid colour or gradient from the theme's tokens beats a broken image.

### Asset Don'ts
- Using celebrity/branded content without permission
- Mixing incompatible visual styles (unless intentional)
- Low-res images stretched beyond their quality

**Remember:** A broken image destroys credibility faster than a generic placeholder. When in doubt, use abstract patterns or solid colors that match your theme.
