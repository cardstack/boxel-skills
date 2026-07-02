import { Component, FieldDef, contains, field } from 'https://cardstack.com/base/card-api';
import NumberField from 'https://cardstack.com/base/number';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

// 🧩 PATTERN: Surface-aware FieldDef using Cell + Run.
//
// Wrap the editor in <Cell> and the display in <Run>. The same FieldDef
// renders cleanly in both Form and Grid surfaces because Cell adapts
// its chrome from the surrounding context.

import { Cell, Run } from './surfaces/index.js';

const STAR_INDEXES = [1, 2, 3, 4, 5];

function starStyle(filled: boolean): string {
  let color = filled ? '#f59e0b' : '#cbd5e1';
  return `border:0;background:transparent;font-size:1rem;line-height:1;padding:0 0.1rem;cursor:pointer;color:${color};`;
}

class SurfaceStarsAtom extends Component<typeof SurfaceStarsField> {
  get rating(): number {
    let v = this.args.model?.value as number | undefined;
    return Math.max(0, Math.min(5, Math.round(v ?? 0)));
  }

  @action setRating(n: number): void {
    if (this.args.model) this.args.model.value = n as never;
  }

  styleFor = (n: number): string => starStyle(n <= this.rating);

  <template>
    {{!-- <Cell> provides editor chrome adapted to form vs grid context --}}
    <Cell>
      {{#each STAR_INDEXES as |n|}}
        <button
          type='button'
          style={{this.styleFor n}}
          {{on 'click' (fn this.setRating n)}}
        >★</button>
      {{/each}}
    </Cell>
  </template>
}

class SurfaceStarsEmbedded extends Component<typeof SurfaceStarsField> {
  get display(): string {
    let v = this.args.model?.value as number | undefined;
    let r = Math.max(0, Math.min(5, Math.round(v ?? 0)));
    return `${r} / 5`;
  }

  <template>
    {{!-- <Run> provides read-only display chrome --}}
    <Run @tag='span'>{{this.display}}</Run>
  </template>
}

export class SurfaceStarsField extends FieldDef {
  static displayName = 'Stars';
  @field value = contains(NumberField);

  static atom     = SurfaceStarsAtom;
  static embedded = SurfaceStarsEmbedded;
  static edit     = SurfaceStarsAtom;  // same component — Cell handles editor chrome
}
