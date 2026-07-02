---
validated: deprecated
---

# integrate-cloudflare-image-upload — Deprecated Cloudflare image-card upload

**Deprecated:** Do not use this pattern for new app/card work. `CloudflareImage` is deprecated. Prefer `@cardstack/boxel-host/commands/write-binary-file` to write the image bytes into the realm, then store `linksTo(ImageDef/PngDef/FileDef)`.

**Replacement shape:**

```gts
import WriteBinaryFileCommand from '@cardstack/boxel-host/commands/write-binary-file';
import { ImageDef, linksTo } from 'https://cardstack.com/base/card-api';

@field outputImage = linksTo(ImageDef);

let writeResult = await new WriteBinaryFileCommand(commandContext).execute({
  path: 'GeneratedImages/result.png',
  realm: realmUrl,
  base64Content,
  contentType: 'image/png',
  useNonConflictingFilename: true,
});

card.outputImage = new ImageDef({
  id: writeResult.fileIdentifier,
  sourceUrl: writeResult.fileIdentifier,
  url: writeResult.fileIdentifier,
  name: 'result.png',
  contentType: 'image/png',
});
```

The remaining notes below are historical reference only.

**What this gave you:** A Command (`UploadImageCommand`) that takes a `data:` URI, `blob:` URL, or `http(s)` URL and uploads to Cloudflare Images, returning a `CloudflareImage` card with the resulting CDN URL. Tracks progress via a `progressStep` state machine the invoking component renders live.

**When to use:** Anywhere a user picks/pastes/uploads an image and you want it stored on Cloudflare's CDN (instead of embedded base64). Avatars, hero images, image galleries, screenshot uploads.

**The insight:** Cloudflare's Images API expects either a multipart upload to a *direct-upload URL* (for files/blobs) or a server-side fetch from a remote URL. The boxel-host provides `SendRequestViaProxyCommand` to route those API calls through the realm server (so the Cloudflare API key never leaves the host). The Command orchestrates: request direct-upload URL → upload blob → save `CloudflareImage` card. Each step transitions `@tracked progressStep` so the calling component re-renders in real time.

**Recipe shape:**

```ts
import { Command, isCardInstance } from '@cardstack/runtime-common';
import { tracked } from '@glimmer/tracking';
import SaveCardCommand from '@cardstack/boxel-host/commands/save-card';
import SendRequestViaProxyCommand from '@cardstack/boxel-host/commands/send-request-via-proxy';

type UploadStep =
  | 'idle' | 'requesting-direct-upload-url' | 'parsing-data-uri'
  | 'fetching-local-file' | 'uploading-local-file' | 'uploading-remote-url'
  | 'saving-card' | 'completed' | 'error';

export default class UploadImageCommand extends Command<typeof InputCard, typeof CardIdCard> {
  @tracked progressStep: UploadStep = 'idle';

  protected async run(input: InputCard): Promise<CardIdCard> {
    const proxy = new SendRequestViaProxyCommand(this.commandContext);

    this.progressStep = 'requesting-direct-upload-url';
    const { uploadURL, id } = await this.requestDirectUploadUrl(proxy);

    this.progressStep = 'uploading-local-file';
    const cf = await this.uploadBlob(uploadURL, blob);

    this.progressStep = 'saving-card';
    const card = await this.saveCloudflareImageCard(cf.id);

    this.progressStep = 'completed';
    return card;
  }
}
```

The companion `CloudflareImage` CardDef computes its `url` from the Cloudflare `id`:

```ts
const CLOUDFLARE_ACCOUNT_ID = '4a94a1eb2d21bbbe160234438a49f687';
@field url = contains(UrlField, {
  computeVia: function (this: CloudflareImage) {
    return `https://i.boxel.site/${this.cloudflareId}/public`;
  },
});
```

**Gotchas:**
- The Cloudflare account ID is realm-specific — currently hard-coded in `boxel-catalog/cloudflare-image.gts`. Treat it as a constant for your realm.
- The CDN variant (`public`) is also realm-config — switch to `thumbnail` / `avatar` etc. as the account allows.
- For `blob:` URLs, you must `fetch()` them yourself (the realm can't fetch local browser blobs). `data:` URIs are parsed inline.
- Always proxy via `SendRequestViaProxyCommand` — never call Cloudflare's API directly from the card (CORS + auth issues).

**Source:** `boxel-catalog/commands/upload-image.ts` (the full Command), `boxel-catalog/cloudflare-image.gts` (the CloudflareImage CardDef).

**See also:** `integrate-send-request-via-proxy`, `command-typed-with-progress`, `boxel-file-def` (for FileDef alternatives).
