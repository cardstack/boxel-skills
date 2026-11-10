import { StringField, Component } from '@cardstack/base/card-api';
import { BoxelSelect } from '@cardstack/boxel-ui/components';
import { eq } from '@cardstack/boxel-ui/helpers';
import { markDefinition } from '@cardstack/base/mark-definition';

// 🧩 PATTERN: Atomic Field factory with view prop
//
// `createOptionSelectField` returns a StringField subclass parameterised by
// option list + edit view. One factory, N enum-ish fields.

type View = 'boxel-select' | 'radio';

interface OptionSelectConfig {
  displayName: string;
  options: readonly string[];
  view?: View;
}

export function createOptionSelectField(config: OptionSelectConfig) {
  let { displayName, options, view = 'boxel-select' } = config;

  return class extends StringField {
    static displayName = displayName;

    static edit = class extends Component<typeof StringField> {
      <template>
        {{#if (eq view 'boxel-select')}}
          <BoxelSelect
            @options={{options}}
            @selected={{@model}}
            @onChange={{@set}}
            as |opt|
          >{{opt}}</BoxelSelect>
        {{else}}
          <fieldset class='radio-group'>
            {{#each options as |opt|}}
              <label>
                <input
                  type='radio'
                  name={{displayName}}
                  value={{opt}}
                  checked={{eq @model opt}}
                  {{on 'change' (set @set opt)}}
                />
                {{opt}}
              </label>
            {{/each}}
          </fieldset>
        {{/if}}
      </template>
    };
  };
}

// === Usage =============================================================

// A class the factory returns gets its identity only through markDefinition,
// so every exported result is wrapped. A result used only in this module
// stays unwrapped: the compiler rejects markDefinition anywhere but the value
// of an exported binding or the default export.

export const StatusField = markDefinition(
  createOptionSelectField({
    displayName: 'Status',
    options: ['todo', 'doing', 'done'] as const,
    view: 'boxel-select',
  }),
);

export const PriorityField = markDefinition(
  createOptionSelectField({
    displayName: 'Priority',
    options: ['P0', 'P1', 'P2'] as const,
    view: 'radio',
  }),
);

// In a card:
//   @field status   = contains(StatusField);
//   @field priority = contains(PriorityField);
