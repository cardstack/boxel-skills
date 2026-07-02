import { Command } from '@cardstack/runtime-common';
import { tracked } from '@glimmer/tracking';
import { CardDef, field, contains } from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import UrlField from 'https://cardstack.com/base/url';
import ImageCard from 'https://cardstack.com/base/image';

import SendRequestViaProxyCommand from '@cardstack/boxel-host/commands/send-request-via-proxy';

// 🧩 PATTERN: Cloudflare image upload from a Boxel card.

const CLOUDFLARE_ACCOUNT_ID = '<your-account-id>';
const CLOUDFLARE_VARIANT = 'public';
const CF_DIRECT_UPLOAD_URL =
  `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`;

// === The CloudflareImage CardDef ======================================

export class CloudflareImage extends ImageCard {
  static displayName = 'Cloudflare Image';

  @field cloudflareId = contains(StringField);

  @field url = contains(UrlField, {
    computeVia: function (this: CloudflareImage) {
      if (!this.cloudflareId) return undefined;
      return `https://i.boxel.site/${this.cloudflareId}/${CLOUDFLARE_VARIANT}`;
    },
  });
}

// === Inputs / Outputs =================================================

export class UploadImageInput extends CardDef {
  @field sourceImageUrl = contains(UrlField); // data:, blob:, or https:
  @field targetRealmUrl = contains(StringField);
}

export class CardIdCard extends CardDef {
  @field cardId = contains(StringField);
}

// === The Command ======================================================

type UploadStep =
  | 'idle' | 'requesting-direct-upload-url' | 'parsing-data-uri'
  | 'fetching-local-file' | 'uploading-local-file' | 'uploading-remote-url'
  | 'saving-card' | 'completed' | 'error';

export default class UploadImageCommand extends Command<
  typeof UploadImageInput,
  typeof CardIdCard
> {
  static actionVerb = 'Upload';

  @tracked progressStep: UploadStep = 'idle';

  async getInputType() { return UploadImageInput; }

  protected async run(input: UploadImageInput): Promise<CardIdCard> {
    if (!input.sourceImageUrl) throw new Error('sourceImageUrl is required');
    if (!input.targetRealmUrl) throw new Error('targetRealmUrl is required');

    const proxy = new SendRequestViaProxyCommand(this.commandContext);
    const src = input.sourceImageUrl.trim();
    let cfId: string;

    if (src.startsWith('data:') || src.startsWith('blob:')) {
      // Local-origin upload: get a direct-upload URL, then multipart-post the blob.
      this.progressStep = 'requesting-direct-upload-url';
      const { uploadURL, id } = await this.requestDirectUploadUrl(proxy);

      this.progressStep = src.startsWith('data:') ? 'parsing-data-uri' : 'fetching-local-file';
      const blob = await this.materializeBlob(src);

      this.progressStep = 'uploading-local-file';
      const payload = await this.uploadBlobMultipart(uploadURL, blob);
      cfId = payload?.result?.id ?? id;
    } else {
      // Remote-origin upload: server-side fetch from the URL.
      this.progressStep = 'uploading-remote-url';
      const payload = await this.forwardRemoteUrl(proxy, src);
      cfId = payload.result.id;
    }

    if (!cfId) throw new Error('Cloudflare returned no image id');

    this.progressStep = 'saving-card';
    const card = await this.saveCloudflareImageCard(cfId, input.targetRealmUrl);

    this.progressStep = 'completed';
    return card;
  }

  // ⚠️ Pseudocode helpers — see boxel-catalog/commands/upload-image.ts for the
  // real implementations of requestDirectUploadUrl, materializeBlob,
  // uploadBlobMultipart, forwardRemoteUrl, and saveCloudflareImageCard.
  private async requestDirectUploadUrl(proxy: SendRequestViaProxyCommand) {
    void proxy;
    return { uploadURL: CF_DIRECT_UPLOAD_URL, id: '' };
  }
  private async materializeBlob(src: string): Promise<Blob> {
    void src;
    return new Blob();
  }
  private async uploadBlobMultipart(url: string, blob: Blob): Promise<any> {
    void url;
    void blob;
    return { result: { id: '' } };
  }
  private async forwardRemoteUrl(proxy: SendRequestViaProxyCommand, src: string): Promise<any> {
    void proxy;
    void src;
    return { result: { id: '' } };
  }
  private async saveCloudflareImageCard(id: string, realm: string): Promise<CardIdCard> {
    void id;
    void realm;
    return new CardIdCard();
  }
}
