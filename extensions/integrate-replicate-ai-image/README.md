---
validated: source-proven
---

# integrate-replicate-ai-image — Generate AI images via Replicate

**What this gives you:** A non-core, local-only Command pattern that takes a text prompt + model identifier, calls Replicate's prediction API (via `SendRequestViaProxyCommand`), polls for completion, and returns the resulting image URL(s).

**When to use:** Only when a user explicitly asks for Replicate or you are maintaining old Replicate-backed work. For portable Boxel image-generation apps, use the core `integrate-openrouter-image-generation` pattern instead.

**The insight:** Replicate is async — predictions take 5-30 seconds and you poll. The pattern is:
1. POST `/v1/predictions` with the model version + input.
2. Receive a prediction `id` and `status: 'starting'`.
3. Poll GET `/v1/predictions/{id}` until `status` is `'succeeded'` or `'failed'`.
4. The successful response has `output` — usually an array of image URLs.

For Boxel cards, drive each phase via `@tracked progressStep` so the UI shows status. If the result must persist, download the returned URL, write the bytes with `WriteBinaryFileCommand`, and link an `ImageDef` / `PngDef`; never keep an expiring provider URL as the durable card value.

**Recipe shape:**

```ts
import SendRequestViaProxyCommand from '@cardstack/boxel-host/commands/send-request-via-proxy';

const proxy = new SendRequestViaProxyCommand(this.commandContext);

// 1) Create prediction.
const createRes = await proxy.execute({
  url: 'https://api.replicate.com/v1/predictions',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    version: '<model-version-hash>',
    input: { prompt: 'A purple boxel logo, vector, clean' },
  }),
});
const prediction = JSON.parse(createRes.body);

// 2) Poll until done.
let result = prediction;
while (result.status === 'starting' || result.status === 'processing') {
  await new Promise((r) => setTimeout(r, 2000));
  const poll = await proxy.execute({
    url: `https://api.replicate.com/v1/predictions/${result.id}`,
    method: 'GET',
  });
  result = JSON.parse(poll.body);
}

if (result.status === 'succeeded') {
  const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
  // imageUrl is now a Replicate-hosted URL — typically valid for ~1 hour.
}
```

**Gotchas:**
- **Replicate URLs expire** (typically 1 hour). For long-term storage, immediately write the bytes to a realm file and link a FileDef subtype.
- Always supply the **model version hash**, not just the model name — model versions can change without notice.
- Polling: 2 seconds is a good default; faster wastes API budget, slower frustrates users.
- Model identifiers: see Replicate's catalog. Popular: `stability-ai/sdxl`, `black-forest-labs/flux-schnell`, `bytedance/sdxl-lightning-4step`.
- Schema discovery: model input shapes vary. Read the Replicate model page for the exact `input` keys.

**Source:** Historical provider-specific notes moved out of the portable skill tree.

**See also:** core `integrate-openrouter-image-generation` (preferred), `integrate-filedef-generated-image` (persistence shape), `command-typed-with-progress` (the UI-progress pattern).
