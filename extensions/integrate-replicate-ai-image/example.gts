import { Command } from '@cardstack/runtime-common';
import { tracked } from '@glimmer/tracking';
import { CardDef, field, contains } from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import UrlField from 'https://cardstack.com/base/url';

import SendRequestViaProxyCommand from '@cardstack/boxel-host/commands/send-request-via-proxy';

// 🧩 PATTERN: Replicate AI image generation (create + poll + result).

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';

// === Inputs / Outputs =================================================

export class GenerateImageInput extends CardDef {
  @field prompt        = contains(StringField);
  @field modelVersion  = contains(StringField); // Replicate model version hash
}

export class GeneratedImage extends CardDef {
  @field prompt   = contains(StringField);
  @field imageUrl = contains(UrlField);
}

// === Progress states ==================================================

type GenStep =
  | 'idle'
  | 'creating-prediction'
  | 'waiting-for-model'
  | 'completed'
  | 'failed';

// === The Command ======================================================

export default class GenerateImageCommand extends Command<
  typeof GenerateImageInput,
  typeof GeneratedImage
> {
  static actionVerb = 'Generate';
  description = 'Generate an image via Replicate';

  @tracked progressStep: GenStep = 'idle';

  async getInputType() { return GenerateImageInput; }

  protected async run(input: GenerateImageInput): Promise<GeneratedImage> {
    if (!input.prompt) throw new Error('prompt is required');
    if (!input.modelVersion) throw new Error('modelVersion is required');

    const proxy = new SendRequestViaProxyCommand(this.commandContext);

    // 1) Create prediction.
    this.progressStep = 'creating-prediction';
    const createRes = await proxy.execute({
      url: REPLICATE_API,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: input.modelVersion,
        input: { prompt: input.prompt },
      }),
    });
    let result = JSON.parse(createRes.body);

    // 2) Poll until terminal.
    this.progressStep = 'waiting-for-model';
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await proxy.execute({
        url: `${REPLICATE_API}/${result.id}`,
        method: 'GET',
      });
      result = JSON.parse(pollRes.body);
    }

    if (result.status !== 'succeeded') {
      this.progressStep = 'failed';
      throw new Error(`Replicate prediction failed: ${result.error ?? 'unknown'}`);
    }

    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    if (!imageUrl) {
      this.progressStep = 'failed';
      throw new Error('Replicate returned no output URL');
    }

    this.progressStep = 'completed';
    return new GeneratedImage({
      prompt: input.prompt,
      imageUrl,
    });

    // Note: Replicate URLs expire (~1 hour). For long-term storage, download
    // the URL, write the bytes with WriteBinaryFileCommand, and link ImageDef.
  }
}
