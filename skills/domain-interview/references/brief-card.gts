import {
  CardDef,
  Component,
  contains,
  field,
} from '@cardstack/base/card-api';
import MarkdownField from '@cardstack/base/markdown';
import { FittedCard } from '@cardstack/boxel-ui/components';

// One field per pipeline stage, so a stage only ever replaces its own text.
export class BriefCard extends CardDef {
  static displayName = 'Brief';

  @field spec = contains(MarkdownField);
  @field designDirection = contains(MarkdownField);
  @field motion = contains(MarkdownField);

  static isolated = class Isolated extends Component<typeof this> {
    <template>
      <article class='brief'>
        <header class='brief-header'>
          <p class='eyebrow'>Brief</p>
          <h1 class='title'>{{@model.cardTitle}}</h1>
          <p class='summary'>{{@model.cardDescription}}</p>
        </header>

        <section class='stage'>
          <h2 class='stage-title'>Spec</h2>
          {{#if @model.spec}}
            <@fields.spec />
          {{else}}
            <p class='empty'>Not written yet — <code>domain-interview</code> writes this.</p>
          {{/if}}
        </section>

        <section class='stage'>
          <h2 class='stage-title'>Design direction</h2>
          {{#if @model.designDirection}}
            <@fields.designDirection />
          {{else}}
            <p class='empty'>Not written yet — <code>design-direction</code> writes this.</p>
          {{/if}}
        </section>

        <section class='stage'>
          <h2 class='stage-title'>Motion</h2>
          {{#if @model.motion}}
            <@fields.motion />
          {{else}}
            <p class='empty'>Not needed, or not written yet — <code>motion-authoring</code> writes this only when the direction asked for an arc.</p>
          {{/if}}
        </section>
      </article>

      <style scoped>
        .brief {
          padding: var(--boxel-sp-xl);
          color: var(--foreground);
          background: var(--background);
        }
        .brief-header {
          padding-bottom: var(--boxel-sp-lg);
          border-bottom: 1px solid var(--border);
        }
        .eyebrow {
          margin: 0;
          font: var(--boxel-font-xs);
          letter-spacing: var(--boxel-lsp-xl);
          text-transform: uppercase;
          color: var(--muted-foreground);
        }
        .title {
          margin: var(--boxel-sp-xxs) 0 0;
          font: var(--boxel-font-xl);
        }
        .summary {
          margin: var(--boxel-sp-sm) 0 0;
          max-width: 70ch;
          color: var(--muted-foreground);
        }
        .stage {
          padding-block: var(--boxel-sp-lg);
          border-bottom: 1px solid var(--border);
        }
        .stage:last-child {
          border-bottom: 0;
        }
        .stage-title {
          margin: 0 0 var(--boxel-sp);
          font: var(--boxel-font-lg);
        }
        .empty {
          margin: 0;
          color: var(--muted-foreground);
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof this> {
    <template>
      <article class='brief-embedded'>
        <p class='eyebrow'>Brief</p>
        <h3 class='title'>{{@model.cardTitle}}</h3>
        <p class='summary'>{{@model.cardDescription}}</p>
        <ul class='stages' aria-label='Stages written'>
          <li class='stage {{if @model.spec "is-written"}}'>Spec</li>
          <li class='stage {{if @model.designDirection "is-written"}}'>Direction</li>
          <li class='stage {{if @model.motion "is-written"}}'>Motion</li>
        </ul>
      </article>

      <style scoped>
        .brief-embedded {
          padding: var(--boxel-sp);
          color: var(--foreground);
        }
        .eyebrow {
          margin: 0;
          font: var(--boxel-font-xs);
          letter-spacing: var(--boxel-lsp-xl);
          text-transform: uppercase;
          color: var(--muted-foreground);
        }
        .title {
          margin: var(--boxel-sp-xxxs) 0 0;
          font: var(--boxel-font);
          font-weight: 600;
        }
        .summary {
          margin: var(--boxel-sp-xxs) 0 0;
          font: var(--boxel-font-sm);
          color: var(--muted-foreground);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .stages {
          display: flex;
          gap: var(--boxel-sp-xxs);
          margin: var(--boxel-sp-sm) 0 0;
          padding: 0;
          list-style: none;
        }
        .stage {
          padding: var(--boxel-sp-5xs) var(--boxel-sp-xxs);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font: var(--boxel-font-xs);
          color: var(--muted-foreground);
        }
        .stage.is-written {
          border-color: var(--primary);
          background: var(--primary);
          color: var(--primary-foreground);
        }
      </style>
    </template>
  };

  static fitted = class Fitted extends Component<typeof this> {
    <template>
      <FittedCard>
        <:eyebrow>Brief</:eyebrow>
        <:title><@fields.cardTitle /></:title>
        <:subtitle><@fields.cardDescription /></:subtitle>
        <:footer>
          <span class='stage {{if @model.spec "is-written"}}'>Spec</span>
          <span class='stage {{if @model.designDirection "is-written"}}'>Direction</span>
          <span class='stage {{if @model.motion "is-written"}}'>Motion</span>
        </:footer>
      </FittedCard>

      <style scoped>
        .stage {
          color: var(--muted-foreground);
        }
        .stage.is-written {
          color: var(--foreground);
          font-weight: 600;
        }
      </style>
    </template>
  };
}
