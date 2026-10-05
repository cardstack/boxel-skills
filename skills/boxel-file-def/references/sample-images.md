# Sample Images at Build Time

How the assistant fills the image fields of a build's sample instances: a hero photo, a product
shot, a headshot. There are four sources. This file covers picking one and then getting the image
into the instance without breaking the realm. For a card that makes images at runtime (a button
the user clicks), use the `integrate-openrouter-image-generation` and `integrate-thumbnail-card-ai`
patterns instead.

Fill the images for the instances the first screen shows, typically three to five, not for every
instance in the realm. Empty image slots make a mockup look unfinished, and the design-playbook
puts imagery in the mockup pass, not after it.

## Pick the source

| Source | Use it when | Cost | How it gets in |
|---|---|---|---|
| **The user's own** | The image shows something real: their product, their team, their place | none | They upload it, or give a URL you download |
| **AI-generated** | The image must match the style exactly, or no photo of the subject exists (a fictional product, a styled scene) | OpenRouter credit, one approval per image | `generate-thumbnail` writes it to the realm |
| **Stock photo** (Unsplash, Pexels) | Real-looking photos of generic subjects: food, interiors, landscapes, people at work | free | **First draft: the photo's URL goes straight into the URL half of the field, no download.** Final: `download-file-to-realm` saves it to the realm |
| **Placeholder** (Lorem Picsum, placehold.co) | A wireframe or first mockup, where only the image's size and position matter | free | External URL in the URL half of the field |

Choose by the scenario:

- **Something real**: the user's company, product or people. Ask for their own images. Never
  generate or pick a stock photo that claims to be a real person, product or place. Until they
  provide one, use a placeholder and say so.
- **A mockup the user wants to see quickly** (the "Just build it" path): stock photos by URL when
  you can find real ones (see below), otherwise placeholders. No downloads in the first draft.
- **A styled, brand-heavy design** where the image carries the look (a design direction with an
  imagery treatment): AI-generated.
- **Unclear, and the choice costs credit**: ask once, as a single-select question in the choice
  UI. Keep the labels plain: "Placeholder images (fastest)" · "Real stock photos (free)" ·
  "AI images made to match the style (uses credit)".

## Never guess an image URL

A made-up stock URL either 404s or, worse, loads an unrelated photo that looks deliberate: a
guessed Pexels ID returns *some* photo, just not the one you described. Use only:

- a URL the user gave you;
- a photo page you actually opened (a URL seen only in search results doesn't count), if you can
  open web pages: search unsplash.com or pexels.com and take the image URL from the photo's page (`images.unsplash.com/photo-…`,
  `images.pexels.com/photos/…`). Without a way to open pages, stock photos come only from URLs the
  user supplies. A Google image search result is for choosing a direction and is never hotlinked
  ([`untrusted-content.md`](../../boxel-design/references/untrusted-content.md) → *Images*);
- the placeholder patterns below, which work for any value.

Dead patterns still found in older notes, never use them: `source.unsplash.com` (shut down) and
`via.placeholder.com` (no longer responds).

## AI-generated: `generate-thumbnail`

Declared in `boxel-environment/references/host-commands-reference.md`. Despite its name, it
generates any image.

| Input | Value for a sample image |
|---|---|
| `prompt` | Composed as below. Required |
| `targetRealmIdentifier` | The realm the instances live in. Required |
| `targetPath` | `Images` (keep every sample image in one folder) |
| `cardName` | The instance's title, so the file gets a readable name (`beaumont-kitchen-3f2a.png`) |
| `targetCardId` | **Omit**, unless the image is the card's `cardInfo.cardThumbnail`, the only field it can link to by itself |
| `sourceImageUrl` | Optional. A reference image to steer the style (image-to-image) |
| `llmModel` | Omit to use `google/gemini-2.5-flash-image` |

It returns `imageDefIdentifier`, the URL of the new file in the realm, indexed as an `ImageDef` /
`PngDef` automatically. It runs in the Boxel host (the AI assistant, or a card command). From
`npx boxel run-command` it generates the image but cannot write it; see
`boxel-environment/references/indexing-operations.md`.

**Compose the prompt from the brief and the design**, not from the field name. "Kitchen photo"
gets a generic photo that fights the card around it.

```
the instance's own data      (Beaumont Kitchen, 1924 Craftsman, white oak, Inset Shaker)
+ the style                  (the palette, the imagery treatment the style family sets)
+ the composition slot       (4:3 hero, negative space lower-left for the headline, no people)
+ what to leave out          (no text, no logos, no watermarks)
```

See `boxel/references/design-playbook.md`, "Brand-guided imagery during mockup", for a worked
example.

## Stock photo: URL first, download at the end

**First draft: use the URL, skip the download.** Put the photo's image URL in the URL half of the
field (an `ImageSourceField` in `sourceMode: url`, or the URL half of the pair pattern), in
`attributes`. No tool call, no approval, nothing written to the realm, so the first screen is not
waiting on a download per image. Same rule as a placeholder (below): it never goes in
`relationships` (Cardinal Rule 12).

The URL must still be a real one: from the user, or from a photo page you opened (see *Never guess
an image URL*). Size it for its slot (`https://images.unsplash.com/photo-…?w=1600`).

**What the URL costs, and when to pay it.** A hotlinked photo can move or disappear, and the index
cannot track it, so nothing notices when it breaks. That is fine for a draft and not for a shipped
card. Before the work is finalised, or as soon as the user keeps a draft, download the photos that
stay and switch each field to the file: `download-file-to-realm`, then `sourceMode: file` with the
file on the `file` sub-field (see *Link it to the instance*). With an `ImageSourceField` this is a
field-value change, not a schema change, which is why it is the better field for a draft that will
grow up. A plain `linksTo(ImageDef)` field cannot hold a URL at all, so it cannot take this shortcut.

### Downloading, when it is time

Also declared in `host-commands-reference.md`. Download the photo into the realm so the card keeps
working if the remote URL changes, and the image is a real `ImageDef` the index can track.

Also declared in `host-commands-reference.md`. Download the photo into the realm instead of
hotlinking it, so the card keeps working if the remote URL changes, and the image is a real
`ImageDef` the index can track.

| Input | Value |
|---|---|
| `sourceUrl` | The photo's image URL, sized for its slot (`https://images.unsplash.com/photo-…?w=1600`) |
| `path` | `Images/<instance-slug>.jpg`, **with the extension**: the realm infers the file type from it |
| `realm` | The realm the instances live in |
| `useNonConflictingFilename` | `true` |

It returns `fileIdentifier`, linked exactly like a generated image (below).

Unsplash and Pexels photos are free to use, commercial use included, with no attribution required.
Where the schema has a credit or caption field, fill it with the photographer's name anyway.

## Placeholder: an external URL, never a relationship

Placeholders are temporary, so leave them outside the realm, in the URL half of the image field.
They go in `attributes`, never in `relationships` (Cardinal Rule 12: an external URL in
`links.self` rolls back the whole realm's indexing).

| Pattern | Gives |
|---|---|
| `https://picsum.photos/seed/<instance-slug>/1600/900` | A real photo, the same one every time for the same seed. Its subject is random, so use it only where any photo will do |
| `https://placehold.co/1600x900/<bg-hex>/<text-hex>?text=Hero` | A flat box with a label: pure wireframe |

Pick the size from the slot's aspect ratio, and seed Picsum with the instance's slug so each
instance keeps its own photo across reloads.

## Link it to the instance

A realm file (generated, downloaded or uploaded) goes in `relationships`, never in `attributes`
(Cardinal Rules 12, 14 and 16). Write it as a path relative to the instance file, with the file
extension (`using-filedef-in-cards.md`, "File-typed relationships need the file extension"). Use
the file name exactly as the tool returned it: both tools add a suffix to avoid overwriting, so the
name cannot be guessed ahead of the call.

**A plain `linksTo(ImageDef)` field** (`heroImage`):

```json
"relationships": {
  "heroImage": { "links": { "self": "../Images/beaumont-kitchen-3f2a.png" } }
}
```

**A catalog `ImageSourceField`** (`@cardstack/catalog/fields/image-source/image-source`), which
holds either kind. A realm file goes on its `file` sub-field:

```json
"attributes": {
  "heroImage": { "sourceMode": "file", "url": null }
},
"relationships": {
  "heroImage.file": { "links": { "self": "../Images/beaumont-kitchen-3f2a.png" } }
}
```

A placeholder goes in its `url` sub-field, with no relationship:

```json
"attributes": {
  "heroImage": { "sourceMode": "url", "url": "https://picsum.photos/seed/beaumont-kitchen/1600/900" }
}
```

**A `linksToMany` gallery** uses indexed keys (Cardinal Rule 13):

```json
"relationships": {
  "gallery.0": { "links": { "self": "../Images/beaumont-kitchen-3f2a.png" } },
  "gallery.1": { "links": { "self": "../Images/beaumont-pantry-9c1e.jpg" } }
}
```

A plain `linksTo(ImageDef)` field cannot hold a placeholder URL. For placeholders, the field needs
a URL half: an `ImageSourceField`, or the pair pattern in `boxel-patterns/patterns/attach-remote-image`.

## Order of work

1. Pick the source for the scenario (above).
2. Write the instance JSON first, with the image relationship left out. Placeholders and stock
   photo URLs go in right away, in the URL half of the field, since they need no tool call.
3. Call the tool once per image, only for the sources that produce a file: generated images, and
   stock photos at the final download step. A first draft that uses only URLs skips steps 3 and 4.
4. Add each returned URL to its instance's `relationships`, editing the instance JSON the way
   the environment writes files. Edit all of them in one pass.
5. Read one instance back and open it: the image must render. A broken image means the path is
   wrong. Most often the extension or the `../` is missing.

## When a tool is not available

When a tool is missing, the user declines the approval, or the call fails, fall back to a
placeholder in the URL half of the field, or leave the field empty. Never put the external URL in
`relationships` to get around it. Say in one line which instances have placeholder or no images.
