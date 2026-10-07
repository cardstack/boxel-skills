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

### Images in a build

Which image a build puts in each media slot (the user's own, an Openverse photo, a labelled
placeholder or an AI image), and how it gets into the card without breaking the realm, is in
[`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md).
The sources above name where a person would look for a style; a build never guesses a URL from them.

- Icons: `@cardstack/boxel-icons` ([`icons.md`](../../boxel/references/icons.md)), not hotlinked SVGs.
- NASA public domain: `https://images-assets.nasa.gov/image/<id>/<id>~thumb.jpg`, with a real id.

### Asset Don'ts
- Using celebrity/branded content without permission
- Mixing incompatible visual styles (unless intentional)
- Low-res images stretched beyond their quality

**Remember:** A broken image destroys credibility faster than a generic placeholder. When in doubt, use a labelled placeholder ([`sample-images.md`](../../boxel-file-def/references/sample-images.md)).
