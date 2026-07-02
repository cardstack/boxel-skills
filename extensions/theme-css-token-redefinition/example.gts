import { CardDef, field, contains, Component } from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// 🧩 PATTERN: Drop-in CSS themes via token redefinition.
//
// This example shows the SKELETON. The actual themes live as sibling
// CSS files — see the surfaces dist `themes/` directory (snapshotted
// under `.claude/extension-libs/surfaces/themes/` as
// `{boxel,figma,linear,notion,spotify}.css`).

type ThemeName = 'boxel' | 'figma' | 'linear' | 'notion' | 'spotify';

const THEME_OPTIONS: ThemeName[] = ['boxel', 'figma', 'linear', 'notion', 'spotify'];

export class ThemedCard extends CardDef {
  static displayName = 'Themed Card';
  @field title = contains(StringField);
  @field body  = contains(StringField);

  static isolated = class extends Component<typeof ThemedCard> {
    @tracked theme: ThemeName = 'boxel';

    @action setTheme(t: ThemeName) { this.theme = t; }

    get themeClass(): string {
      return `themed-${this.theme}`;
    }

    <template>
      <div class={{this.themeClass}}>
        <header class='header'>
          <h1>{{@model.title}}</h1>
          <nav class='theme-picker'>
            {{#each THEME_OPTIONS as |t|}}
              <button
                type='button'
                class={{if (eq this.theme t) 'active' ''}}
                {{on 'click' (fn this.setTheme t)}}
              >{{t}}</button>
            {{/each}}
          </nav>
        </header>

        <article>{{@model.body}}</article>
      </div>

      <style>
        /* All chrome reads from tokens — no hard-coded colors. */
        .header {
          background: var(--background);
          color: var(--foreground);
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .header h1 {
          color: var(--foreground);
        }
        article {
          background: var(--muted);
          color: var(--foreground);
          padding: 1.5rem;
          border-radius: var(--radius);
          margin: 1rem;
        }
        .theme-picker button {
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--border);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius);
        }
        .theme-picker button.active {
          background: var(--accent);
          color: var(--background);
          border-color: var(--accent);
        }

        /* Theme files redefine THESE tokens — drop in one of:
              engine/themes/figma.css
              engine/themes/linear.css
              engine/themes/notion.css
              engine/themes/spotify.css
           ↓ Inline equivalent for demonstration: */

        .themed-boxel {
          --background: var(--boxel-light);
          --foreground: var(--boxel-dark);
          --muted:      var(--boxel-100);
          --border:     var(--boxel-300);
          --accent:     var(--boxel-highlight);
          --radius:     var(--boxel-border-radius);
        }
        .themed-figma {
          --background: #ffffff;
          --foreground: #1e1e1e;
          --muted:      #f5f5f5;
          --border:     #e6e6e6;
          --accent:     #0d99ff;
          --radius:     10px;
        }
        .themed-linear {
          --background: #0a0a0a;
          --foreground: #ededed;
          --muted:      #1a1a1a;
          --border:     #2a2a2a;
          --accent:     #5e6ad2;
          --radius:     6px;
        }
        .themed-notion {
          --background: #ffffff;
          --foreground: #37352f;
          --muted:      #f7f6f3;
          --border:     #e9e9e7;
          --accent:     #2383e2;
          --radius:     4px;
        }
        .themed-spotify {
          --background: #121212;
          --foreground: #ffffff;
          --muted:      #181818;
          --border:     #282828;
          --accent:     #1db954;
          --radius:     8px;
        }
      </style>
    </template>
  };
}
