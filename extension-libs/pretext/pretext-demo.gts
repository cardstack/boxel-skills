import {
  CardDef,
  Component,
  field,
  contains,
} from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import TextAreaField from 'https://cardstack.com/base/text-area';
import NumberField from 'https://cardstack.com/base/number';
import LayoutDashboardIcon from '@cardstack/boxel-icons/layout-dashboard';
import { PretextModifier } from './pretext-modifier';

export class PretextDemo extends CardDef {
  static displayName = 'Pretext Demo';
  static icon = LayoutDashboardIcon;
  static prefersWideFormat = true;

  @field headline = contains(StringField);
  @field subhead = contains(StringField);
  @field byline = contains(StringField);
  @field section = contains(StringField);
  @field bodyText = contains(TextAreaField);
  @field pullQuote = contains(StringField);
  @field columnCount = contains(NumberField);

  @field cardTitle = contains(StringField, {
    computeVia: function (this: PretextDemo) {
      return this.headline ?? 'Pretext Demo';
    },
  });

  // ── ISOLATED: All 4 use cases with declarative data-pretext-* ──
  static isolated = class Isolated extends Component<typeof PretextDemo> {
    pretext = PretextModifier;

    get cols() { return this.args.model.columnCount ?? 3; }

    <template>
      <div class="page" {{this.pretext}}>

        {{! ── USE CASE 4: fit-text auto-sizes headline ── }}
        <header class="header">
          {{#if @model.section}}
            <div class="section-label">{{@model.section}}</div>
          {{/if}}
          <h1 data-pretext-fit-text data-pretext-min-size="24" data-pretext-max-size="80"
              class="headline">{{@model.headline}}</h1>
          {{#if @model.subhead}}
            <p class="subhead">{{@model.subhead}}</p>
          {{/if}}
          <div class="meta">
            {{#if @model.byline}}
              <span>By <strong>{{@model.byline}}</strong></span>
            {{/if}}
          </div>
          <div class="rule"></div>
        </header>

        {{! ── USE CASE 4: clamp truncates at word boundary ── }}
        {{#if @model.pullQuote}}
          <blockquote class="pull-quote" data-pretext-clamp="3">
            &ldquo;{{@model.pullQuote}}&rdquo;
          </blockquote>
        {{/if}}

        {{! ── USE CASE 1 + 2: flow + balanced columns with obstacle ── }}
        <div class="body-flow"
             data-pretext-flow
             data-pretext-columns={{this.cols}}
             data-pretext-gap="28"
             data-pretext-balance
             style="position:relative; min-height:400px;">

          {{! Obstacle: text flows around this image ── }}
          <img data-pretext-obstacle="circle"
               data-pretext-padding="16"
               src="https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=300"
               alt="Photo"
               class="obstacle-img" />

          {{! Text source ── }}
          <p data-pretext-content>{{@model.bodyText}}</p>
        </div>

        <footer class="footer">
          <div class="footer-rule"></div>
          <div class="footer-text">Rendered with data-pretext-* declarative layout</div>
        </footer>
      </div>

      <style scoped>
        .page {
          background: var(--card, #faf8f3);
          color: var(--card-foreground, #1a1a1a);
          font-family: Georgia, 'Times New Roman', serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2.5rem 2.5rem;
        }
        .header { margin-bottom: 1.5rem; }
        .section-label {
          font-family: sans-serif; font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.25em;
          color: var(--primary, #8b0000); margin-bottom: 0.75rem;
        }
        .headline {
          font-weight: 900; margin: 0 0 0.5rem; letter-spacing: -0.02em;
        }
        .subhead {
          font-size: 1.15rem; font-style: italic;
          color: var(--muted-foreground, #555); line-height: 1.45;
          margin: 0 0 0.75rem; max-width: 85%;
        }
        .meta {
          font-family: sans-serif; font-size: 0.8rem;
          color: var(--muted-foreground, #777); margin-bottom: 0.75rem;
        }
        .meta strong { color: var(--card-foreground, #1a1a1a); }
        .rule {
          height: 3px; background: var(--card-foreground, #1a1a1a);
        }
        .rule::after {
          content: ''; display: block; height: 1px;
          background: var(--card-foreground, #1a1a1a); margin-top: 3px;
        }
        .pull-quote {
          font-size: 1.2rem; font-style: italic; font-weight: 600;
          line-height: 1.45; color: var(--primary, #8b0000);
          border-top: 3px solid var(--primary, #8b0000);
          border-bottom: 1px solid var(--primary, #8b0000);
          padding: 0.75rem 0; margin: 1rem 0 1.5rem;
        }
        .body-flow {
          font: 15px/24px Georgia, serif;
          color: var(--card-foreground, #1a1a1a);
        }
        .obstacle-img {
          position: absolute;
          right: 5%;
          top: 20px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border, #d4d0c8);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          z-index: 5;
        }
        .footer { margin-top: 2rem; }
        .footer-rule {
          height: 1px; background: var(--card-foreground, #1a1a1a);
          margin-bottom: 0.5rem;
        }
        .footer-text {
          font-family: sans-serif; font-size: 0.6rem;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--muted-foreground, #999); text-align: center;
        }
      </style>
    </template>
  };

  // ── EMBEDDED ──
  static embedded = class Embedded extends Component<typeof PretextDemo> {
    pretext = PretextModifier;

    <template>
      <article class="embedded" {{this.pretext}}>
        {{#if @model.section}}
          <div class="section-tag">{{@model.section}}</div>
        {{/if}}
        <h3 data-pretext-fit-text data-pretext-min-size="12" data-pretext-max-size="20"
            class="title">{{@model.headline}}</h3>
        {{#if @model.subhead}}
          <p data-pretext-clamp="2" class="sub">{{@model.subhead}}</p>
        {{/if}}
      </article>
      <style scoped>
        .embedded { padding: 0.75rem; font-family: Georgia, serif; }
        .section-tag {
          font-family: sans-serif; font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--primary, #8b0000); margin-bottom: 0.25rem;
        }
        .title { font-size: 1rem; font-weight: 700; margin: 0 0 0.25rem; line-height: 1.2; }
        .sub {
          font-size: 0.8rem; font-style: italic; line-height: 1.3;
          color: var(--muted-foreground, #6b6b6b); margin: 0;
        }
      </style>
    </template>
  };

  // ── FITTED: Use case 3 — if-fits conditional elements ──
  static fitted = class Fitted extends Component<typeof PretextDemo> {
    pretext = PretextModifier;

    <template>
      <article class="fitted" data-pretext-fit {{this.pretext}}>
        {{#if @model.section}}
          <div class="section-tag">{{@model.section}}</div>
        {{/if}}
        <h3 data-pretext-fit-text data-pretext-min-size="11" data-pretext-max-size="22"
            class="title">{{@model.headline}}</h3>
        {{#if @model.subhead}}
          <p data-pretext-if-fits data-pretext-priority="medium"
             data-pretext-clamp="2" class="sub">{{@model.subhead}}</p>
        {{/if}}
        {{#if @model.byline}}
          <div data-pretext-if-fits data-pretext-priority="low"
               class="byline">{{@model.byline}}</div>
        {{/if}}
      </article>
      <style scoped>
        .fitted {
          font-family: Georgia, serif;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding: 0.5rem;
          background: var(--card, #faf8f3);
          color: var(--card-foreground, #1a1a1a);
        }
        .section-tag {
          font-family: sans-serif; font-size: 0.5rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--primary, #8b0000); margin-bottom: 2px;
        }
        .title {
          font-weight: 700; margin: 0; line-height: 1.15;
        }
        .sub {
          font-size: 0.75rem; font-style: italic; line-height: 1.25;
          color: var(--muted-foreground, #6b6b6b); margin: 4px 0 0;
        }
        .byline {
          font-family: sans-serif; font-size: 0.6rem;
          color: var(--muted-foreground, #999); margin-top: 4px;
        }
      </style>
    </template>
  };
}
