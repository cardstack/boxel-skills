// 🧩 PATTERN: Surfacified default card template.
//
// One forked template, used by N CardDefs via:
//   static isolated = SurfacifiedTemplate;
//   static edit     = SurfacifiedTemplate;
//
// File layout:
//   <realm>/default-card-surface/template.gts  (this file)
//   <realm>/default-card-surface/card-info.gts (forked CardInfo view+edit)
//   <realm>/default-card-surface/index.ts      (re-exports)

import GlimmerComponent from '@glimmer/component';
import { Header } from '@cardstack/boxel-ui/components';
import { cn } from '@cardstack/boxel-ui/helpers';
import { getFieldIcon, cardDefComputedFields } from '@cardstack/runtime-common';
import { startCase } from 'lodash';

import {
  Layout, Pane, Form, Cell,
  createFocusLadder, createFociStore, createSurfaceRuntime, surfaceRoot,
} from './surfaces/index.js';

import { CardInfoTemplates } from './card-info';

interface Args {
  Args: {
    model: any;
    fields: any;
    format: 'isolated' | 'edit';
  };
}

// Field keys we skip at the body level — same exclude list as Boxel core.
const SKIP = new Set(['id', 'cardInfo', 'theme']);

export class SurfacifiedTemplate extends GlimmerComponent<Args> {
  focusTree = createFocusLadder();
  fociStore = createFociStore();
  runtime   = createSurfaceRuntime({ focusLadder: this.focusTree, fociStore: this.fociStore });

  get isolated() { return this.args.format === 'isolated'; }

  get displayFields(): Array<{ key: string; Field: any }> {
    let { model, fields } = this.args;
    let computed = cardDefComputedFields(model.constructor) as Set<string>;
    return Object.entries(fields)
      .filter(([k]) => !SKIP.has(k) && !computed.has(k))
      .map(([key, Field]) => ({ key, Field }));
  }

  <template>
    <Layout
      class={{cn 'default-card-template' (if this.isolated 'isolated' 'edit')}}
      {{surfaceRoot focusTree=this.focusTree id='layout:card' surface='layout'}}
    >
      <Pane @role='header' @id='pane:header'>
        <Header @hasBottomBorder={{true}}>
          {{#if this.isolated}}
            <CardInfoTemplates.view @model={{@model.cardInfo}} />
          {{else}}
            <CardInfoTemplates.edit @model={{@model.cardInfo}} />
          {{/if}}
        </Header>
      </Pane>

      {{#if this.displayFields.length}}
        <Form @id='form:fields'>
          {{#each this.displayFields as |entry|}}
            {{#let entry.key as |key|}}
            {{#let entry.Field as |Field|}}
            {{#let (getFieldIcon @model key) as |icon|}}
              <Cell @id='cell:fields/{{key}}' @label={{startCase key}} @icon={{icon}}>
                <Field class='in-isolated' />
              </Cell>
            {{/let}}
            {{/let}}
            {{/let}}
          {{/each}}
        </Form>
      {{/if}}

      <Pane @role='footer' @id='pane:footer'>
        <Cell @id='cell:footer/notes' @label='Notes'>
          <@fields.cardInfo.notes />
        </Cell>
      </Pane>
    </Layout>
  </template>
}

// === Usage on a CardDef ==============================================
//
// import { SurfacifiedTemplate } from './default-card-surface';
//
// export class MyCard extends CardDef {
//   static isolated = SurfacifiedTemplate;
//   static edit     = SurfacifiedTemplate;
//
//   @field title       = contains(StringField);
//   @field description = contains(StringField);
//   // …
// }
