# Boxel Design Guide

🏆 **Transform simple requests into distinctive, memorable Boxel UI through systematic design discovery.**

## The Design Challenge Standard

**Every design should be executed as if it were a challenge crafted by a world-class art director and judged by the preeminent tastemaker in that field.**

When approaching any Boxel design:
1. **Identify the domain's standard of excellence** - Who sets the bar in this specific field?
2. **Execute at creative director level** - What would make this portfolio-worthy? Every decision must be intentional and defensible
3. **Design for critical eyes** - Assume your work will be reviewed by those who've seen everything
4. **Push beyond the expected** - Safe design doesn't move culture forward

This is an optional skill to activate before code generation when you want to explore what design direction would work best for your project. It helps you move beyond default patterns to create something memorable and cohesive. Run the design discovery process whenever you need fresh design inspiration or want to completely redesign an existing interface.

## Design Discovery Process

```
User Request → [Boxel Design Skill Active?]
  │ No → Generate Code
  │ Yes → DESIGN DISCOVERY
      │
      ├─ PHASE 1: STYLE
      │  Select primary + secondary from style reference
      │  Include inspiration refs
      │  Write rationale + tech needs
      │
      ├─ CREATIVE VISION
      │  Architecture · Distinguishing elements
      │  Visual language · Complete copy
      │  Assets · Award-winning factor
      │
      ├─ PHASE 2: DESIGN CONTROLS MAPPING
      │  Set primary/secondary ratio for each control
      │  (95/5 whisper → 50/50 hybrid)
      │  Map style personality to specific settings
      │  Document rationale for each choice
      │
      ├─ PHASE 3: THEME
      │  Extract into CSS variables
      │  Add style-specific properties
      │  Enable white-label flexibility
      │
      ├─ ⚠️ PAUSE: HANDOFF CHECKPOINT
      │  • Disable Design Skill: update-skill-activation
      │  • Check LLM: Switch to coding model if needed
      │  • Continue only after context cleared
      │
      └─ GENERATE CODE
         │
         ├─ EDIT/ATOM → Theme & UX focus
         │  • Base variables
         │  • Standard patterns
         │  • Accessibility
         │
         └─ ISOLATED/FITTED/EMBEDDED → Style focus
            • Push aesthetic limits
            • Signature moments
            • Portfolio-worthy
            
         **⚠️ NO LAZY CSS - TREAT THIS AS A FOLLOW-UP "DON'T BE LAZY" PROMPT:**
         Every single element must embody the design discovery output.
         Generic styles = failed execution. If Bold/Asymmetric was chosen,
         then buttons, inputs, errors, tooltips, shadows, spacing - EVERYTHING
         reflects that choice. This is the difference between top 1% and
         mediocre. Execute with the same intensity as if criticized for
         being lazy on the first attempt.
```

## Style Reference

| # | Style Name | Inspirations | Visual DNA & Generation Cues |
|---|------------|--------------|------------------------------|
| 1 | Ultra Minimal | Apple.com • Tesla.com • Muji | Wide whitespace, grayscale, crisp sans, hero product photos, gentle motion |
| 2 | Vintage Luxury | Gucci Vault • Burberry Archive • Hermès Heritage | Sepia tones, serif heads, collage layout, gold‑foil touches, patina textures |
| 3 | Playful Illustration | Mailchimp • Slack • Headspace | Flat doodles, chunky lines, pastel pops, witty copy, asym‑grid |
| 4 | Gradient Tech | Stripe • Linear.app • Raycast | Dark BG, vibrant gradients, glass cards, code snippets, sleek motion |
| 5 | Kinetic Story | Nike "Better World" • Apple AirPods Pro • Spotify Unwrapped | Scroll‑parallax, big video, action type, dynamic panels |
| 6 | Futurist Lab | SPACE10 • Google ATAP • MIT Media Lab | Dark mode, monospaced heads, WebGL, generative shapes, speculative copy |
| 7 | Editorial Minimal | Cereal Magazine • Kinfolk • Monocle | Wide margins, serif+sans, muted photos, slow fades, magazine grid |
| 8 | Inclusive Data‑Viz | Volvo E.V.A • Gapminder • Our World in Data | Soft blues, human icons, clean charts, WCAG focus |
| 9 | Neon Maximalist | Razzle‑Dazzle.one • MTV microsite • Adult Swim | Fluoro palette, GIF layers, cursor FX, chaotic type |
| 10 | Neo‑Brutalist | Array‑of‑Stars • Brutalist.website • Gumroad | Raw HTML vibe, thick borders, mono text, no shadows, broken grid |
| 11 | Sensory Editorial | Aesop • Le Labo • Byredo | Earth palette, slow cross‑fade, fragrance‑first, ambient audio |
| 12 | Futurist Luxury | BMW i7 • Mercedes EQS • Rolls-Royce Spectre | Dark glass, holographic glow, hero video, sleek serif |
| 13 | Activist Rugged | Patagonia • REI • The North Face | Textured BGs, hand‑drawn icons, bold CTAs, eco greens |
| 14 | Vibrant Gradient | Adobe CC • Instagram • Spotify | Kaleido blobs, radial gradients, floating cards, playful UI |
| 15 | Luxe Commerce | Farfetch • Net‑a‑Porter • SSENSE | Neutral canvas, editorial photos, thin serif, sticky filters |
| 16 | Pop Data‑Viz | Spotify Wrapped • Apple Music Replay • Strava Year in Sport | Bright blocks, animated stats, share cards, burst transitions |
| 17 | Monochrome Code | Vercel • GitLab • Railway | Black‑white, monospace snippets, grid cards, dev tone |
| 18 | Skeuo‑Story | IKEA Museum • LEGO timeline • Disney100 | Scrap‑book edges, skeuo shadows, timeline scroller |
| 19 | High‑Fashion Immersive | Moncler Genius • Jacquemus • Balenciaga | Dark glam, runway loops, oversized serif, hover reveals |
| 20 | Cinematic Editorial | NYT "Snow Fall" • The Guardian "Firestorm" • National Geographic | Full‑bleed video, parallax chapters, map embeds |
| 21 | Playful 3‑D | LEGO Kids • Nintendo Labo • Minecraft Education | WebGL bricks, primaries, hover bounce, gamified nav |
| 22 | Minimal Monochrome | Notion • Linear docs • Obsidian | Grey palette, minimal icons, modular blocks, calm motion |
| 23 | Dark Cinematic | Netflix Tudum • HBO Max • Apple TV+ | Black UI, poster grid, red accent, trailer hovers |
| 24 | Scientific 3‑D | NASA Eyes • ESA Solar Sys • Google Earth | Space black, 3‑D models, telemetry overlays |
| 25 | Creative Community | Dribbble • Behance • DeviantArt | Masonry cards, pastel header, infinite scroll, like counters |
| 26 | Kaleidoscope Deco | Palace Lido • Tame Impala site • The Great Gatsby (2013) | Art‑deco frames, neon jewels, marquee text, ornate borders |
| 27 | Raw Commerce | Gumroad • Carrd • Buy Me a Coffee | Plain HTML, system font, instant checkout, bold links |
| 28 | Swiss‑Grid | Dropbox.design • GridSystem.io • Vignelli Center | 12‑col grid, Helvetica, numeric margins, red rules |
| 29 | Swiss Modern | Swiss Air • Lufthansa • SBB Mobile | ITS grid, left‑aligned, airline icons, primary red |
| 30 | Retro Revival | Burger King rebrand • Pepsi Throwback • Pizza Hut Classic | Brown‑orange, chunky Cooper, wavy stripes, grain |
| 31 | Luxury Maximal | LV Dream • Dolce & Gabbana • Versace Home | Deep blacks, gold accents, flourish borders, luxe serif |
| 32 | Humorous Parallax | Old Spice • Dollar Shave • Liquid Death | Gag scroll, mascots, explosion GIFs, comic bubbles |
| 33 | Campaign 3‑D | Heineken "Closer" • Coke "Beat Heat" • Nike "You Can't Stop Us" | Rotating cans, neon glow, confetti, CTA modals |
| 34 | Maker Grid | Kickstarter • Indiegogo • Product Hunt | Pastels, rounded cards, progress bars, community avatars |
| 35 | Friendly Fintech | Monzo • N26 • Cash App | Punchy coral, emoji icons, clean graphs, rounded sans |
| 36 | Blueprint Tokens | Atlassian Design • IBM Carbon • Shopify Polaris | Component diagrams, token tables, code playground |
| 37 | ASCII Minimal | GitHub Octoverse • Terminal.css • Hacker News | Monospace, ASCII charts, black screen, blinking cursor |
| 38 | Safety Blue | Volvo EV • Ford Sync • Waymo | Sky‑blue, inclusive imagery, infographic icons, checklists |
| 39 | Cause Interactive | UNICEF Tap • Charity Water • GoFundMe | Aqua gradient, ripple cursor, donation meter |
| 40 | Museum Modernist | MoMA • Tate • Centre Pompidou | White cube look, art‑first, modernist grid |
| 41 | Typographic Lab | Cooper Hewitt Labs • Variable‑Fonts • Google Fonts | Oversized glyphs, sliders, neon guides, code panels |
| 42 | Climate Data | CNN Climate • CarbonClock • Climate.gov | Urgent reds, stacked charts, timeline scrubber, CO2 counters |
| 43 | Fashion Immersive | Fendi • Bottega 360 • Saint Laurent | Edge‑to‑edge video, split lookbook, dark glamour |
| 44 | Retro Photography | Polaroid Originals • Kodak • Lomography | Film frames, rainbow stripe, grain filter, script heads |
| 45 | Cyberpunk Neon | Synthwave Records • Retrowave.fm • Cyberpunk 2077 | Magenta‑cyan grid, VHS noise, glow type |
| 46 | Poetic Story | Broken‑Relationships Museum • Humans of New York • StoryCorps | Sparse layout, serif italics, muted palette, long‑form prose |
| 47 | Calm Health | One Medical • Forward Health • Headspace Health | Soft teal, rounded inputs, friendly photos, empathetic tone |
| 48 | Font Showcase | Adobe Fonts • Google Fonts • MyFonts | Dark canvas, live sliders, glyph grid, filter sidebar |
| 49 | Data‑Art Flat | Information Is Beautiful • Flourish • Datawrapper | Rainbow palette, playful SVG charts, interactive legend |
| 50 | Kinetic Type | Array‑Expressive • Animography • Motionographer | Scroll‑triggered morphs, oversized mono, motion blur |
| 51 | Bauhaus Geometric | Bauhaus archives • Google Bauhaus • Harvard Art Museums | Primary blocks, geometric grid, minimalist type |
| 52 | Swiss Typography | Helvetica specimen • Vignelli manuals • International Style posters | Strict grid, neutral sans, objective hierarchy |
| 53 | Art Nouveau | Musée d'Orsay • Jugendstil posters • Tiffany & Co. | Flowing lines, floral motifs, ornate frames |
| 54 | Art Deco | Jazz‑Age hotels • Gatsby posters • Chrysler Building | Geometric glamour, metallic accents, sunbursts |
| 55 | Constructivist | Soviet propaganda • Russian avant‑garde • El Lissitzky | Diagonal bars, red/black/white, bold sans |
| 56 | De Stijl | Mondrian canvases • Dutch Neoplasticism • Rietveld furniture | Primary rectangles, thick black lines, abstract grid |
| 57 | Memphis Milano | Memphis Group • 80s patterns • Saved by the Bell | Clashing hues, playful geometrics, pop squiggles |
| 58 | Pop Art | Warhol prints • Comic‑book ads • Supreme drops | Primary brights, halftone dots, consumer icons |
| 59 | Psychedelic '60s | Woodstock posters • Tie‑dye merch • Jefferson Airplane | Kaleido swirls, warped type, saturated colors |
| 60 | Mid‑Century Modern | Palm‑Springs modernism • Atomic ads • Mad Men | Clean lines, starburst motifs, optimistic hues |
| 61 | Italian Futurism | Futurist manifestos • Speed‑line posters • Vespa ads | Dynamic angles, motion lines, bold italics |
| 62 | Grunge Aesthetic | Ray Gun mag • 1990s band sites • Urban Outfitters | Distressed textures, torn layers, chaotic type |
| 63 | Punk Zine | Sniffin' Glue • DIY Xerox flyers • CBGB | Cut‑out collage, ransom letters, photocopy grain |
| 64 | Surreal Collage | Dada art • Contemporary collagists • Adult Swim bumps | Dreamlike juxtapositions, fragmented imagery |
| 65 | Maximalist | Kitsch interiors • PIN‑UP spreads • Versace Casa | Layer‑upon‑layer, rich textures, color clash |
| 66 | Baroque Ornament | Versailles décor • Grand opera houses • Dolce & Gabbana Alta Moda | Gold scrollwork, ornate serif, classical paintings |
| 67 | Zen Minimalism | Muji stores • Japanese Zen gardens • Uniqlo | Neutral earth, natural materials, tranquil space |
| 68 | Kawaii Pop | Sanrio • LINE Friends • Pusheen | Cute mascots, pastels, bubbly icons |
| 69 | Scandinavian Modern | IKEA catalog • Nordic lifestyle • HAY Design | Light woods, soft neutrals, functional layouts |
| 70 | Islamic Geometry | Mosque mosaics • Dubai Expo tiles • Alhambra Palace | Intricate patterns, rich blues, symmetrical motifs |
| 71 | Afrofuturism | Diaspora sci‑fi art • Sun Ra imagery • Black Panther | Neon tech + tribal motifs, vibrant prints |
| 72 | Latin Vibrance | Carnaval posters • Mexico tourism • Havaianas | Tropical brights, folkloric patterns, festive vibe |
| 73 | Indian Ornate | Jaipur Lit Fest • Mughal art • Sabyasachi | Jewel tones, mandala borders, intricate paisley |
| 74 | Bollywood Glam | Hindi‑film promos • Music‑video sets • Manish Malhotra | Neon gradients, glamorous portraits, dramatic type |
| 75 | Chinese Traditional | Spring‑Festival posters • Calligraphy shows • China Airlines | Red & gold, paper‑cut clouds, lucky symbols |
| 76 | Korean Neon | K‑Pop fan cafés • Seoul nightlife • Samsung Galaxy | Electric hues, animated stickers, techno glow |
| 77 | African Tribal | Afropunk art • Kente patterns • Nigerian fashion week | Bold tribal prints, earthy + bright hues |
| 78 | Latin Folk | Frida crafts • Andean textiles • Anthropologie | Vibrant warm palette, floral embroidery |
| 79 | Indigenous Art | Maori motifs • First‑Nations patterns • Pendleton | Sacred symbols, turquoise/terracotta, respectful tone |
| 80 | Mediterranean Mosaic | Greek isle tiles • Moroccan zelige • Amalfi Coast hotels | Blue‑white grid, mosaic background, arch frames |
| 81 | Japandi Minimalism | Scandi‑Japanese interiors • &Tradition • Norm Architects | Neutral hues, natural wood, serene balance |
| 82 | Boho Chic | Anthropologie • Urban Outfitters • Free People | Layered textiles, warm earth tones, relaxed vibe |
| 83 | Tropical Paradise | Caribbean resort promos • Island drinks • Tommy Bahama | Palm fronds, turquoise sea, breezy art |
| 84 | Flat Design | Windows 8 tiles • Pure‑flat templates • Google Material 1.0 | Two‑tone tiles, bright solids, icon flatness |
| 85 | Digital Paper Layers | Google Material demos • Gmail cards • Microsoft Fluent | Card elevation, bold accents, tactile depth |
| 86 | Adaptive Hue UI | Android dynamic color • Material‑You • Spotify Blend | Auto palette, rounded modules, personal theme |
| 87 | Typographic Tile Grid | Metro UI hubs • News tiles • Bloomberg Terminal | Large text blocks, vibrant solids, content‑first |
| 88 | Skeuomorphic | Classic iOS • Aqua buttons • Real Racing 3 | Real textures, beveled controls, analog metaphors |
| 89 | Neomorphic | Soft‑UI demos • Pale dashboards • Banking apps | Inset shadows, subtle extrusions, pastel low‑contrast |
| 90 | Acrylic Depth | Fluent acrylic • Vista Aero+ • macOS Monterey | Frosted glass, translucency, spotlight depth |
| 91 | Glassmorphic | macOS Big‑Sur blurs • iOS panels • Windows 11 | Backdrop blur, pastel tint, floating translucency |
| 92 | Claymorphic | Clay‑look kits • 3‑D avatars • Meta Horizon | Smooth blobs, chunky shadow, pastel palette |
| 93 | Soft Brutalism | Pretty brute sites • Pastel blocks • Discord Rebrand | Raw grid, rounded corners, gentle colors |
| 94 | Corporate Minimalism | McKinsey portals • SaaS landings • Deloitte Digital | White fields, muted navy, authoritative sans |
| 95 | Abstract Workspace Pals | Corporate‑Memphis illos • Slack • Microsoft Teams | Geometric bendy limbs, vivid flat colors |
| 96 | Gradient Blast | Stripe 2018 • Neon‑gradient trend • Instagram Stories | Vibrant diagonal gradient, energetic lighting |
| 97 | Pastel Dream | Wellness‑app UIs • Feminine boards • Canva templates | Soft pastels, organic blobs, friendly vibe |
| 98 | Dark‑Mode Luxe | Premium EV pages • Gaming gear • Apple Pro Display | Rich blacks, neon/gold accents, moody photos |
| 99 | Earthy Minimalism | Eco skincare • Sustainable cafés • Reformation | Beige‑olive palette, organic shape, calm tone |
| 100 | Organic Nature | WWF • Wilderness lodges • Patagonia Provisions | Leaf motifs, green‑brown palette, wood texture |
| 101 | Soft‑Shadow Primitives | shadcn/ui • Radix + Tailwind • Vercel Design | Neutral grays, 1‑px borders, subtle shadows |
| 102 | Americana Fireworks | US July‑4 shows • Patriotic concerts • Ralph Lauren | Red‑white‑blue bursts, star bunting, brass serif |
| 103 | Harvest Hearth | Thanksgiving cook sites • Autumn catalogs • Williams Sonoma | Pumpkin palette, plaid linens, cornucopia icons |
| 104 | Gridiron Glow | HS football nights • Super Bowl hype • ESPN | Turf texture, yard‑line numerals, flood‑light glare |
| 105 | Carnival Triad | New Orleans Mardi‑Gras • Jazz posters • Café du Monde | Purple‑green‑gold, bead strands, confetti scroll |
| 106 | Desert Mirage Boho | Coachella Valley • Joshua‑Tree retreats • Urban Outfitters | Sun‑bleached sand, tie‑dye fade, macramé fringe |
| 107 | Dust Frontier | Burning‑Man camps • Playa art cars • Mad Max: Fury Road | Sepia haze, LED glyphs, plywood stencil |
| 108 | Spectrum Pride | Pride parades • LGBTQ+ charities • Target Pride | Six‑stripe rainbow, protest placards, joyful sans |
| 109 | Moonlit Jack‑o‑Lantern | Halloween retail • Horror nights • Spirit Halloween | Midnight violet, carved faces, slime‑drip font |
| 110 | Freedom Jubilee | Juneteenth heritage sites • NAACP archives • Black History Museum | Pan‑African colors, kente trim, emancipation icons |
| 111 | Frost & Fir | Holiday tree lightings • Cozy gifts • Starbucks Holiday | Evergreen plaid, snow dots, gingerbread script |
| 112 | Glacier Fjord Clean | Nordic outdoor brands • Scandinavian fintech • Visit Norway | Icy blues, crisp air whitespace, rune icons |
| 113 | Shibuya Street Neon | Tokyo neon districts • Late‑night malls • Blade Runner 2049 | Kanji signs, fuchsia glow, wet asphalt reflections |
| 114 | Carioca Samba Burst | Rio carnival promos • Tropical sandals • Corona Extra | Feather plumes, lime‑aqua fireworks, samba drums |
| 115 | Tuareg Dune Trail | Sahara tours • Indigo textiles • National Geographic Expeditions | Burnt dunes, indigo cloth, kilim border |
| 116 | Baltic Loom Song | Baltic folk fests • Nordic choir days • Marimekko | Linen embroidery, wood‑block type, forest green |
| 117 | Starforge Visionary | Private rockets • Cybertruck reveals • SpaceX | Matte charcoal, rocket schematics, audacious copy |
| 118 | Tidy Nest Calm | KonMari media • Minimal home blogs • The Container Store | Soft beige grid, rounded ticks, spark‑joy tone |
| 119 | Nature Narrator | BBC Earth docs • Wildlife portals • Planet Earth | Moss browns, sweeping landscapes, calm serif |
| 120 | Sidewalk Haute Remix | Street‑lux runway • Sneaker collabs • Off-White | Helvetica caps, zip‑tie red tag, safety‑orange highlight |
| 121 | Empowerment Radiance | Oprah Daily • Wellness rebrands • Goop | Plum‑gold gradient, spotlight portrait, pull‑quote script |
| 122 | Copper Gleam | Designer copperware • Retro trailers • West Elm | Rose‑metal gradient, brushed texture, rivet dots |
| 123 | Ocean Plastic Pop | Re‑crafted plastic lines • Loop shoes • Adidas x Parley | Speckled HDPE, cyan‑lime pops, eco arrows |
| 124 | Verdant Living Wall | Interior green walls • Eco tech hubs • Bloomberg London | Moss carpet, dew‑drop gloss, carbon badge |
| 125 | Concrete Brutalist | Urban art spaces • Raw concrete tours • Barbican Centre | Cool grey slabs, shutter wood grain, numeric stencil |
| 126 | Bamboo Whisper | Zen spa resorts • Bamboo crafts • Aman Resorts | Pale nodes, washi texture, jade accents |
| 127 | Swipe‑Story Stack | Ephemeral story UI • Vertical reels • TikTok | Card carousel, gradient ring, swipe arrow |
| 128 | Thumb‑Zone Reach | Ergonomic phone UIs • Pop‑socket demos • One UI | Lower‑third controls, curved buttons, heatmap hint |
| 129 | Pulse Haptics | Haptic demos • Gaming headsets • PlayStation 5 | Ripple animation, micro‑shadow spots, sonic blue |
| 130 | Floating Pill Halo | Dynamic islands • Hole‑punch banners • iPhone 14 Pro | Black pill header, depth glow, floating glyphs |
| 131 | Cloud‑Refresh Sky | Pull‑to‑refresh arcs • Cloud bounce • Twitter | Cyan arc, arrow flip, bounce puff |
| 132 | Capitol Archive Serif | LOC digitals • Congressional records • National Archives | Cream folio, drop‑cap serif, catalog cards |
| 133 | Mall Gallery Exhibit | National Mall museums • Exhibit maps • Smithsonian | Label sans, object‑ID tags, slate captions |
| 134 | Marble Gallery Classic | British Museum halls • Artefact view • The Met | Off‑white veins, column dividers, small‑caps |
| 135 | Illuminated Codex | Medieval manuscript scans • Scriptorium • Book of Kells | Gold‑leaf borders, ornate initials, ruby seal |
| 136 | Silk Caravan Archive | UNESCO Silk‑Road • Desert museums • Marco Polo | Sand gradient, camel art, knot border |
| 137 | Slate Monochrome | Mono camera sites • Dark‑mode blogs • Leica | Pure greyscale, high‑contrast imagery, outline icons |
| 138 | Blush Millennial | Pastel DTC brands • Beauty boutiques • Glossier | Soft salmon, rounded sans, subtle inner shadow |
| 139 | Neon‑Lime Zest | Gen‑Z resale apps • Greenroom chat • Depop | Hi‑lime glow, VHS noise, bold italic |
| 140 | Golden‑Hour Ombre | Sunset gradient packs • Vacation ads • Airbnb Experiences | Orange‑violet fade, soft blur, silhouette icons |
| 141 | Gelato Pastel | Pastel SaaS boards • Sorbet UI kits • Notion Templates | Mint‑peach‑lavender tiles, friendly avatars |
| 142 | Cobalt Lightning | Micromobility dash • Verify badges • Twitter Blue | Vivid azure, lightning streak, neon edge |
| 143 | Antique Sepia | Vintage photo scans • Book archives • Library of Congress | Brown wash, deckle edge, typewriter serif |
| 144 | Fuchsia Flash | Hot‑pink telecom • Neon fashion promos • T-Mobile | Magenta glow, sticker shapes, playful italic |
| 145 | Terracotta Curve | Earth‑tone crafts • Outdoor lines • REI Co-op | Umber chips, topo lines, dotted texture |
| 146 | Snow Quartz Frost | Nordic white tech • Ice lodges • Bose | Pure white, frosted blur, ultra‑light sans |
| 147 | Pastel Islandcraft | Cozy‑island sims • Pastel cottage games • Animal Crossing | Soft cube grass, pastel wood, leaf icon |
| 148 | Pop Royale Rush | Party‑bean battle games • Hero drop zones • Fall Guys | Cel‑shade heroes, comic wow burst, dancing emotes |
| 149 | Astral Impostor | Crew‑bean space games • Deception clones • Among Us | Dark star field, emergency red, bubbly mono |
| 150 | Chrome Hero Forge | Neon hero shooters • Ability grids • Overwatch | Neon edge light, gradient HP bars, hero portraits |
| 151 | Runic Tarnish | Souls‑like epics • Gothic ARPGs • Elden Ring | Gold on soot‑black, cracked serif, mist swirl |
| 152 | Teal Visor HUD | Sci‑fi visor UIs • Exo cockpits • Minority Report | Teal hologram, visor frame, radar sweep |
| 153 | Turbo Neon Racer | Car‑ball stadium • Drift arena • Rocket League | Neon trail, stadium LEDs, techno italic |
| 154 | Arcade Pixel KO | Retro fighter cabinets • Classic sprites • Street Fighter | Pixel 'KO', sprite grid, quarter‑circle arrow |
| 155 | Bright Beast Quest | Monster‑catch RPGs • Digi tamer sims • Pokémon | Candy‑bright critters, capture roundels, grass gradient |
| 156 | Red-Packet Rush | Temu • Taobao • Wish | Flash‑sale orange, hongbao icons, timer bursts, stacked coupons |
| 157 | Geek‑Blue Aisle | Best Buy • Newegg • B&H Photo | Royal‑blue bars, yellow tags, spec grids, circuit icons |
| 158 | Chrome & Rebel | Harley‑Davidson • Indian Motorcycle • Chrome Hearts | Matte black steel, chrome, skull badge, slab stencil |
| 159 | Purple Reign Court | LA Lakers • LA Sparks • Sacramento Kings | Purple‑gold gradient, star sparkles, jersey numerals |
| 160 | Flamingo Side Net | Inter Miami CF • Palermo FC • Victoria's Secret Pink | Neon pink+black, palm shadows, crest glow |
| 161 | Wing‑Voltage | Red Bull • Monster • 5-hour Energy | Electric slashes, wing icon, metallic energy can |
| 162 | Trailhead Evergreen | REI • MEC • Arc'teryx | Forest topo, rugged serif, backpack icons |
| 163 | Moonwave Calm | Calm • Headspace • Ten Percent Happier | Indigo gradient, sine wave, crescent moon |
| 164 | Rainbow Giggle‑Tunes | CoComelon • Baby Shark • Disney Junior | Crayon rainbow, bubbly font, smiling mascots |
| 165 | Orange Apron DIY | The Home Depot • B&Q • Lowe's | Construction orange, blueprint grid, tool pictos |
| 166 | Capsule Nordic | Uniqlo • COS • Everlane | Milk‑white canvas, tidy cubes, crisp sans |
| 167 | Patchwork Viva | Desigual • Missoni • Anthropologie | Kaleido knits, mosaic stripes, stitch doodles |
| 168 | Emerald Fizz | Perrier • San Pellegrino • Sprite | Bottle green, rising bubbles, citrus spark |
| 169 | Sky‑Saver Jet | Ryanair • easyJet • Southwest | Sky‑blue panels, fuselage bands, fare stickers |
| 170 | Rescue‑Peak Red | Mammut • Ortovox • Mountain Rescue | Snow white, rescue red, peak contour map |
| 171 | Violet Wallet Wave | Nubank • Wise • Revolut | Royal violet, minimal cards, neo‑sans numerals |
| 172 | Safaripay | M‑Pesa • Airtel Money • Venmo Africa | Savanna green, feature‑phone frame, SMS ticker |
| 173 | Jade Super‑Ride | Grab • Gojek • Uber Green | Jade gradient, scooter avatars, live ETA chip |
| 174 | Arrow‑Parcel Pulse | DHL • Correos • FedEx | Sun‑yellow canvas, red arrow stripe, route lines |
| 175 | Crimson Fan‑Market | Rakuten • Mercari • Yahoo Auctions Japan | Red sun disk, kana headline, pixel tiles |
| 176 | Teal Velocity | AMG Petronas F1 • INEOS Grenadiers • Aston Martin F1 | Teal streaks, brushed silver, telemetry digits |
| 177 | Iberian Flash‑Vogue | Zara • Mango • Massimo Dutti | Editorial portrait, slab caps, rapid carousel |
| 178 | Dewdrop K‑Glow | Laneige • Innisfree • Glow Recipe | Dew gradient, porcelain pastel, glazed buttons |
| 179 | Helvetic Chrono | Rolex • Omega • Swatch | Sunburst dials, gilt indices, forest leather |
| 180 | Breaker Surf Pop | Billabong • Rip Curl • Vans | Coral sunset, palm cutouts, wax swirl |
| 181 | Chai‑Street Spice | Chaayos • Chai Point • Starbucks Teavana | Saffron cardamom, clay‑cup badge, paisley steam |
| 182 | Selva Verde | Natura & Co • O Boticário • The Body Shop | Rain‑forest green, açaí purple, eco stamp |
| 183 | Oat‑Ink Quirk | Oatly • Minor Figures • NotMilk | Off‑white cartons, hand‑ink headlines, oat icons |
| 184 | Warehouse Pulse | Berghain • Ableton • Boiler Room | Charcoal gradient, strobe stripe, mono labels |
| 185 | Macaron Royale | Ladurée • Pierre Hermé • Magnolia Bakery | Pastel shells, gold filigree, cursive monogram |
| 186 | Spice‑Tile Bazaar | Mavi • Grand Bazaar IST • World Market | Cobalt tiles, brass tassels, Ottoman serif |
| 187 | Azulejo Coast | Vista Alegre • Bordallo • CB2 | Blue‑white grid, ceramic crackle, rope border |
| 188 | Tweed & Heather | Harris Tweed • Barbour • Ralph Lauren | Fog plaid, wax cotton, brass snap, stag crest |
| 189 | Black Fern Legend | NZ All Blacks • Silver Ferns • Air New Zealand | Pitch black, silver fern, haka blur |
| 190 | Maple Heritage Stripe | Roots • Hudson's Bay • Tim Hortons | Buffalo plaid, heritage stripe, maple badge |
| 191 | Amber Brauhaus | Paulaner • Hofbräu • Oktoberfest | Blue‑white diamonds, amber froth, brass tuba |
| 192 | Jade‑Chat Hub | WeChat • Alipay • LINE | Jade gradient, QR halo, mini‑app icons |
| 193 | Panda Courier Dash | Meituan Waimai • Ele.me • DoorDash | Yellow panda, bag sticker, route confetti |
| 194 | Lime‑Ride Flow | Bolt • Lime • Bird | Neon lime header, dark map, ride bubble |
| 195 | Gaelic Malt Gold | Jameson • Bushmills • Johnnie Walker | Bottle green, gold crest, barley sketch |
| 196 | Tropi‑Fizz Pop | Guaraná Antarctica • Inca Kola • Fanta | Lime fizz, jungle leaf, retro script |
| 197 | Aurora Flux | Hurtigruten • Philips Hue • Northern Lights Tours | Prismatic ribbon gradient, deep-indigo sky, slow shimmer, meteor-line motion |
| 198 | Diffusion Dreamscape | Midjourney • Runway ML • Adobe Firefly | Soft-noise texturing, painterly sweeps, latent blur, surreal object morphs |
| 199 | Fold-Future Canvas | Samsung Galaxy Z Fold • Motorola Razr+ • Microsoft Surface Duo | Crease-edge glow, overlapping glass panels, hover hinge, split-screen card flow |
| 200 | Zero-Carbon Horizon | Tesla Solar Roof • Rivian R1T • Beyond Meat | Matte graphite, neon-lime battery bar, sunrise orange accent, net-zero badge |

## Base Theme Variables

```css
.theme {
  /* Colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  
  /* Core */
  --radius: 0.5rem;
  
  /* Charts */
  --chart-1 through --chart-5: [contextual colors]
}
```

*Custom style-specific variables extend this base set.*

## Design Controls

**Stage Type:** 
- `Full Screen` (no chrome, edge-to-edge like Spotify's immersive now-playing)
- `Device Frame` (iPhone/Android bezels for app previews, Clay-style presentations) 
- `Environment` (3D space or AR context, Apple Vision Pro experiences)
- `Floating Panel` (overlays/modals, Notion's slash commands)
- `Embedded Widget` (inline components, Stripe's payment forms)
- `Spatial Context` (physical mockups, Koto's environmental brand applications)

**Information Architecture:**
- `Single Focus` (one primary action, Airbnb's home search)
- `Hub & Spoke` (central navigation to sections, classic iOS home screen)
- `Sequential Flow` (step-by-step wizard, Mailchimp's onboarding)
- `Network Graph` (interconnected nodes, Spotify's artist relations)
- `Nested Hierarchy` (folders within folders, Dropbox's file browser)
- `Parallel Tracks` (simultaneous workflows, Figma's multiplayer canvas)

**Interaction Model:**
- `Direct Manipulation` (drag & drop, Collins' tactile interfaces)
- `Conversational` (chat-based, Interbrand's AI brand assistants)
- `Ambient` (passive updates, Google's Material You adaptive theming)
- `Gestural` (swipe/pinch primary, TikTok's vertical feed)
- `Command-Based` (keyboard shortcuts, Linear's power-user design)
- `Exploratory` (discovery through interaction, Netflix's browse experience)

**Visual Density:**
- `Sparse` (10% - maximum whitespace, Chermayeff's minimal logos)
- `Breathable` (30% - generous spacing, DesignStudio's Airbnb work)
- `Balanced` (50% - equal content/space, Wolff Olins' Met rebrand)
- `Rich` (70% - information-dense, Bloomberg Terminal inspiration)
- `Dense` (90% - maximum content, JKR's retail packaging systems)

**Motion Character:**
- `Static` (no motion, traditional print approach)
- `Micro` (subtle feedback, Ramotion's button states)
- `Fluid` (smooth transitions, iOS's physics-based animations)
- `Kinetic` (scroll-triggered sequences, Apple's product pages)
- `Immersive` (constant ambient motion, Riot Games' League client)

**Type System:**
- `Mono-scale` (single size throughout, brutalist websites)
- `Dual-hierarchy` (headline + body, Medium's article format)
- `Editorial` (3+ distinct sizes, Monocle's magazine layouts)
- `Expressive` (variable fonts with axis play, Collins' Twitch rebrand)
- `Systematic` (modular scale, IBM's Carbon design system)

**Color Strategy:**
- `Monochrome` (single hue + neutrals, Braun's product design)
- `Duo-tone` (two contrasting colors, Spotify's duo-tone imagery)
- `Analogous` (adjacent on wheel, Instagram's gradient evolution)
- `Complementary` (opposites attract, Twitch's purple/green)
- `Triadic` (three equidistant, Burger King's retro palette)
- `Full Spectrum` (rainbow/many hues, Google's material palette)

**Spatial Model:**
- `Flat` (zero depth, Windows 8 Metro design)
- `Layered` (z-index stacking, Material Design's paper metaphor)
- `Elevated` (subtle shadows, Apple's current UI language)
- `Perspective` (3D transforms, Stripe's animated gradients)
- `Environmental` (full 3D space, Nike's WebGL experiences)

**Content Priority:**
- `Text-First` (typography leads, Medium's article design)
- `Image-Led` (visuals dominate, Instagram's grid)
- `Data-Driven` (charts/metrics focus, Interbrand's brand valuations)
- `Interactive-Core` (interaction is content, Figma's canvas)
- `Video-Primary` (motion content focus, TikTok's interface)
- `Mixed-Media` (equal blend, modern editorial sites)

**Responsive Behavior:**
- `Adaptive` (distinct breakpoint layouts, Bootstrap approach)
- `Fluid` (percentage-based scaling, Koto's liquid layouts)
- `Container-Query` (component-based responsiveness, modern CSS)
- `Content-Aware` (typography-driven breaks, iA Writer's approach)
- `Device-Optimized` (platform-specific, Apple's iOS/iPadOS split)

### Application Matrix

| Context | Common Combinations |
|---------|-------------------|
| **Mobile Web** | Device Frame + Sequential Flow + Gestural + Breathable + Fluid |
| **Billboard/Display** | Full Screen + Single Focus + Ambient + Sparse + Kinetic |
| **Form/Input** | Floating Panel + Sequential Flow + Direct Manipulation + Balanced + Micro |
| **Dashboard/Analytics** | Full Screen + Hub & Spoke + Exploratory + Rich + Layered |
| **AI Interface** | Embedded Widget + Conversational + Command-Based + Breathable + Static |
| **Media Experience** | Environment + Network Graph + Immersive + Dense + Environmental |

## Design Discovery Process

### Phase 1: Style Selection
Choose primary + secondary styles that are:
- Unexpected yet appropriate
- Domain-enhancing
- Include inspiration references
- Note technical needs (WebGL, D3)

**Design Challenge Thinking**: Consider what excellence means in this specific domain - whether that's the design field itself or the specialized area (medical devices, financial tools, educational platforms). Select styles that would earn respect from those who understand the unique constraints and opportunities of this space.

### Creative Vision
Craft a comprehensive design direction covering:
- Architecture & flows
- 3-5 signature moments
- Color/type/motion story
- Complete copy (minimum 10 content elements)
- Media assets (images/icons/patterns to reach 10 total with copy)
- Portfolio-worthy differentiator

**The Critical Eye**: Before writing, ask yourself:
- What would make a design master pause and study this?
- How would this advance the medium?
- Would this earn recognition from those who've seen everything?
- Does this respect users while pushing boundaries?

Your vision should articulate a direction that would excite someone who's shaped design history.

**Content & Media Checklist (10 minimum)**:
Copy elements: Headlines, subheads, body text, CTAs, microcopy, error states
Media elements: Hero images, icons, patterns, illustrations, backgrounds
*Example: 3 headlines + 2 body sections + 2 CTAs + 3 hero images = 10 elements*

**Write for designers, not clients.** Use precise design language that communicates direction:
- ✅ "16px baseline grid with 64px macro units" not "clean and organized"
- ✅ "Stagger animations at 80ms intervals" not "delightful experience"
- ✅ "High contrast 12:1 for brutalist impact" not "bold and eye-catching"
- ✅ "Z-index layering: base→content→nav→modal" not "intuitive hierarchy"

Focus on **buildable specifications** over aspirational descriptions.

### Phase 2: Design Controls Mapping
**Translate style personality into concrete UI decisions that guide code generation.**

Map style DNA to Design Controls:
- **Visual Composition**: How does the style balance space? (Minimal → `Center Stage`, Editorial → `Golden Ratio`, Bold → `Asymmetric`)
- **Content Structure**: What organization supports the narrative? (Tech → `Grid System`, Story → `Hero + Sections`)
- **Navigation Pattern**: Where does wayfinding live? (Clean → `Top Bar`, Immersive → `Floating Action`)
- **Component Density**: How much breathing room? (Luxury → `Spacious`, Data-viz → `Dense`)
- **Animation Level**: What motion personality? (Swiss → `None`, Playful → `Bouncy`, Futurist → `Heavy`)
- **Motion Timing**: How fast do things move? (Instant → Micro → Standard → Deliberate → Cinematic)
- **Mobile Behavior**: How does it adapt? (Editorial → `Responsive`, Gaming → `App-like`)

Set primary/secondary ratio for each control (95/5 → 50/50).

#### Example: Mapping "Gradient Tech" Style to Controls

**Selected Style**: #4 Gradient Tech (Stripe • Linear.app • Raycast)

**Design Controls Mapping**:
- **Stage Type**: `Full Screen` (90%) + `Floating Panel` (10%)
  *Rationale: Immersive gradient backgrounds with minimal overlay elements*
  
- **Visual Composition**: `Center Stage` (75%) + `Asymmetric` (25%)
  *Rationale: Hero focus with dynamic off-center accents*
  
- **Content Structure**: `Single Column` (80%) + `Grid System` (20%)
  *Rationale: Clean reading flow with occasional feature grid breakouts*
  
- **Navigation Pattern**: `Floating Action` (60%) + `Top Bar` (40%)
  *Rationale: Balance between minimal chrome and persistent navigation*
  
- **Visual Style**: `Gradient Heavy` (95%) + `Dark Mode` (5%)
  *Rationale: Signature vibrant gradients with just hints of dark elements*
  
- **Animation Level**: `Smooth` (70%) + `Subtle` (30%)
  *Rationale: Refined transitions complementing the gradient flow*

**Result**: Creates a gradient-forward experience where each control uses different ratios to achieve the perfect balance - from whisper-level dark mode influence to prominent navigation mixing.

### Phase 3: Theme Extraction
Transform into variables:
- All colors → OKLCH values
- Typography → Google Fonts
- Style-specific properties
- White-label ready

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

### Quick URL Patterns for LLM Generation

**⚠️ Note: LLM constructs URLs based on patterns below - no search capability, just pattern-based generation**

```html
<!-- Pexels Photo Pattern -->
https://images.pexels.com/photos/[6-7 DIGITS]/pexels-photo-[SAME DIGITS].jpeg?auto=compress&cs=tinysrgb&w=1920
<!-- Try sequential IDs like: 1271619, 2102416, 3184292, 4145354 -->

<!-- Heroicons (reliable icon names) -->
https://unpkg.com/heroicons@2/24/outline/[ICON].svg
<!-- Common: star, heart, user, menu, search, home, settings, trash, plus, x, check, bell, mail -->

<!-- unDraw Illustrations (consistent slugs) -->
https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/[SLUG].svg
<!-- Common: designer, developer, team_work, data_processing, mobile_app, dashboard, analytics -->

<!-- SVG Patterns (predictable names) -->
https://www.svgbackgrounds.com/[PATTERN].svg?color=%23[HEX]&opacity=[0.1-1]
<!-- Patterns: topography, circuit-board, hexagons, temple, jupiter, overlapping-circles -->

<!-- Pixabay Fallback -->
https://cdn.pixabay.com/photo/2020/[01-12]/[01-31]/[ID]_640.jpg
<!-- Structure: year/month/day/id - try common dates and 7-digit IDs -->

<!-- NASA Public Domain -->
https://images-assets.nasa.gov/image/[MISSION-ID]/[MISSION-ID]~thumb.jpg
<!-- Common: PIA12345, as11-40-5874, hubble-arp273 -->

<!-- Placeholder Services (always work) -->
https://via.placeholder.com/[WIDTH]x[HEIGHT]/[BG-HEX]/[TEXT-HEX]?text=[TEXT]
https://picsum.photos/[WIDTH]/[HEIGHT]
https://source.unsplash.com/[WIDTH]x[HEIGHT]/?[KEYWORD]
```

### LLM Strategy for Asset Selection

1. **Start with placeholder services** for guaranteed working images
2. **Use common icon names** from Heroicons (star, heart, user, etc.)
3. **Try sequential Pexels IDs** in the millions range (1000000-9999999)
4. **Apply SVG patterns** with predictable names for backgrounds
5. **Fallback to solid colors** or gradients if external assets fail

### Working Examples (high success rate)

```html
<!-- Reliable hero images -->
<img src="https://picsum.photos/1920/1080" alt="Hero image">
<img src="https://source.unsplash.com/1920x1080/?technology" alt="Tech hero">

<!-- Common icons that exist -->
<img src="https://unpkg.com/heroicons@2/24/outline/star.svg" alt="Star">
<img src="https://unpkg.com/heroicons@2/24/outline/menu.svg" alt="Menu">

<!-- SVG patterns that work -->
<div style="background-image: url('https://www.svgbackgrounds.com/topography.svg?color=%23e0e0e0&opacity=0.4')">

<!-- Safe placeholder with custom text -->
<img src="https://via.placeholder.com/800x400/6366f1/ffffff?text=Welcome" alt="Welcome banner">
```

### Quick Integration Patterns

```html
<!-- Hero image with fallback -->
<img 
  src="https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1920"
  onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1920 1080\'%3E%3Crect fill=\'%23f3f4f6\' width=\'1920\' height=\'1080\'/%3E%3C/svg%3E'"
  alt="Descriptive text"
/>

<!-- Optimized background pattern -->
<div style="background-image: url('https://www.svgbackgrounds.com/topography.svg?color=%23000000&opacity=0.1')">

<!-- Icon with local fallback -->
<img src="https://unpkg.com/heroicons@2/24/outline/star.svg" 
     onerror="this.textContent='★'" />
```

### Asset Don'ts
- Using celebrity/branded content without permission
- Mixing incompatible visual styles (unless intentional)
- Low-res images stretched beyond their quality

**Remember:** A broken image destroys credibility faster than a generic placeholder. When in doubt, use abstract patterns or solid colors that match your theme.

## ⚠️ Critical Rules

**Avoid Default LLM Design Clichés:**
- **Rounded Rectangle Syndrome** - Not everything needs border-radius
- **Rainbow Overload** - Restraint > using every color available
- **Flat Hierarchy** - Create dramatic scale differences, not uniform sizes
- **Single Font Monotony** - Mix typefaces purposefully (serif heads + sans body)
- **Accent Border Laziness** - No thick left/top borders as "design"
- **Center-All Disease** - Asymmetry creates visual interest
- **Card Grid Autopilot** - Break the predictable card layout pattern
- **Shadow Everything** - Strategic depth, not universal drop-shadows
- **Icon Sprinkles** - Icons should enhance meaning, not fill space
- **Safe Spacing** - Push extremes: ultra-tight or magazine-wide margins
- **Gradient Overuse** - Not every element needs a gradient background
- **Average Quality Trap** - Aim for top 1% execution, not median competence

**Image URL Best Practice:**
When using image URLs in templates, always add them to the field system:
```typescript
// In template
<img src={{@model.heroImage}} alt="Hero" />
```
This ensures images are editable while providing sensible defaults.

**✅ Instead: Explore → Experiment → Edit**
First generate 3-5 wildly different approaches, then refine the most compelling direction. The best design is rarely the first idea.

**Design Excellence Mindset:**
Every element should demonstrate:
- **Intentionality**: Clear rationale for each decision
- **Craft**: Obsessive attention to detail
- **Innovation**: At least one fresh perspective
- **Coherence**: A unified vision throughout
- **Surprise**: Something unexpected yet perfect

**Remember:**
- Edit/Atom = functional focus - follows theme and layout guidance
- Isolated/Fitted/Embedded = style reference showcase
- Never use brand/style names in code
- After sprint, disable Boxel Design Skill:
  ```json
  {
    "name": "update-skill-activation",
    "payload": {
      "roomId": "!current-room-id:matrix.org",
      "skillCardId": "[check-system-prompt-for-actual-skill-url]",
      "isActive": false
    }
  }
  ```
  **⚠️ IMPORTANT:** Always check system prompt/context for the actual Boxel Design Skill URL before sending command
- If design sprint completed in non-coding model, hand off to Boxel Environment's recommended coding model before generating code

## Expand the possible. Execute the exceptional. Exceed the expected.