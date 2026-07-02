import GlimmerComponent from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

// 🧩 PATTERN: Outline-panel as a second display axis.
//
// Outline ON adds a sidebar TOC reading from the focus tree.
// Outline OFF gives the canvas full width. Container queries
// handle the field reflow — no template branching needed.

import {
  createFocusLadder, createFociStore, createSurfaceRuntime, surfaceRoot,
} from './surfaces/index.js';

import { SurfacifiedTemplate } from './default-card-surface'; // see surface-default-template
import { OutlinePanel } from './outline-panel';                // see outline-reader

interface Args {
  Args: {
    model: any;
    fields: any;
    format: 'isolated' | 'edit';
  };
}

export class OutlinedCardTemplate extends GlimmerComponent<Args> {
  // UI state — not on the model.
  @tracked outlineOpen = true;

  focusTree = createFocusLadder();
  fociStore = createFociStore();
  runtime   = createSurfaceRuntime({ focusLadder: this.focusTree, fociStore: this.fociStore });

  @action toggleOutline() {
    this.outlineOpen = !this.outlineOpen;
  }

  <template>
    <div
      class='card-shell {{if this.outlineOpen "outline-on" "outline-off"}}'
      {{surfaceRoot focusTree=this.focusTree id='layout:card' surface='layout'}}
    >
      {{#if this.outlineOpen}}
        <aside class='outline-sidebar'>
          <OutlinePanel @focusTree={{this.focusTree}} />
          <button
            type='button'
            class='outline-toggle'
            {{on 'click' this.toggleOutline}}
          >Hide outline</button>
        </aside>
      {{else}}
        <button
          type='button'
          class='outline-toggle floating'
          {{on 'click' this.toggleOutline}}
        >Show outline</button>
      {{/if}}

      <div class='canvas'>
        {{!--
          The canvas is the same SurfacifiedTemplate from surface-default-template.
          With outline ON, the canvas is narrower and fields reflow via container query.
          With outline OFF, the canvas is full width and fields can use multi-column.
        --}}
        <SurfacifiedTemplate
          @model={{@model}}
          @fields={{@fields}}
          @format={{@format}}
        />
      </div>
    </div>

    <style>
      .card-shell {
        display: grid;
        gap: 0;
        height: 100%;
        background: var(--background);
      }
      .card-shell.outline-on   { grid-template-columns: 240px 1fr; }
      .card-shell.outline-off  { grid-template-columns: 1fr; }

      .outline-sidebar {
        background: var(--muted);
        border-right: 1px solid var(--border);
        padding: 1rem;
        overflow-y: auto;
      }
      .outline-toggle {
        background: transparent;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 0.25rem 0.5rem;
        color: var(--foreground);
        font-size: 0.75rem;
      }
      .outline-toggle.floating {
        position: absolute;
        top: 1rem;
        left: 1rem;
      }

      /* 🎯 Container query, not media query — fields reflow based on
            the canvas width, not the viewport. */
      .canvas {
        container-type: inline-size;
        padding: 2rem;
        overflow-y: auto;
      }
      .canvas :global(form:fields) {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @container (min-width: 720px) {
        .canvas :global(form:fields) {
          grid-template-columns: 1fr 1fr;
        }
      }
    </style>
  </template>
}
