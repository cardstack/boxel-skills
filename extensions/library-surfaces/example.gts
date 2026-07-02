// team-roster.gts — minimum surfaces grid exemplar.
//
// Edits 3 linked Person cards through a <Grid>. Five columns ride
// stock primitive widgets (text / date / boolean); four columns are
// backed by custom FieldDefs that declare a SINGLE pair of `static
// atom` / `static edit` views. The grid's `<Cell @field>` forwards
// the FieldDef instance into those views as boxel's standard `@model`
// arg; inside the views, `<Cell>` from @cardstack/surfaces adapts
// the chrome to the surrounding surface (grid vs card form).
//
// Engine ownership (zero host code):
//   • click / arrow / Tab / Enter / F2 / Esc keyboard
//   • selection chrome (paints data-bx-grid-active)
//   • <Cell> preview ↔ editor swap and edit lifecycle
//   • TanStack table, per-cell read/write coercion, commit routing,
//     and FieldDef bridging — all wrapped by `getSheet(owner, opts)`.
//
// Host owns:
//   • the column declaration (key / label / type|field / width)
//   • the data thunk (`() => @model.members`)

import {
  CardDef,
  Component,
  contains,
  field,
  linksToMany,
} from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';

import { Environment } from './surfaces/index.js';
import { Cell, Grid, Row, getSheet, type SheetColumn } from './surfaces/grid/index.js';
import { Layout } from './surfaces/layout/index.js';

import { Person } from './person';
import { EmailField    } from './email-field';
import { PhoneField    } from './phone-field';
import { RoleField     } from './role-field';
import { CurrencyField } from './currency-field';

// 5 primitive-typed columns + 4 FieldDef-typed columns.
// FieldDef-typed columns declare `field: SomeField` instead of `type`;
// the grid resolves the FieldDef's `static atom` / `static edit` into
// the cell preview / editor via `fieldWidget()` under the hood.
const COLUMNS: SheetColumn[] = [
  { key: 'firstName', label: 'First',  type: 'text',          width: 'minmax(7rem, 0.9fr)'  },
  { key: 'lastName',  label: 'Last',   type: 'text',          width: 'minmax(7rem, 0.9fr)'  },
  { key: 'email',     label: 'Email',  field: EmailField,     width: 'minmax(12rem, 1.4fr)' },
  { key: 'phone',     label: 'Phone',  field: PhoneField,     width: 'minmax(9rem, 1fr)'    },
  { key: 'role',      label: 'Role',   field: RoleField,      width: 'minmax(8rem, 0.9fr)'  },
  { key: 'birthDate', label: 'Born',   type: 'date',          width: '7rem'                  },
  { key: 'hireDate',  label: 'Hired',  type: 'date',          width: '7rem'                  },
  { key: 'salary',    label: 'Salary', field: CurrencyField,  width: '7rem'                  },
  { key: 'isActive',  label: 'Active', type: 'boolean',       width: '5rem'                  },
];

export class TeamRoster extends CardDef {
  static displayName = 'Team Roster';
  static prefersWideFormat = true;

  @field title   = contains(StringField);
  @field members = linksToMany(() => Person);

  @field cardTitle = contains(StringField, {
    computeVia(this: TeamRoster) {
      return this.title ?? 'Team Roster';
    },
  });

  static isolated = class extends Component<typeof TeamRoster> {
    // One call. Reads from @model.members reactively; routes every
    // cell commit back to the linked Person's @field with type coercion.
    sheet = getSheet<Person>(this, {
      data: () => (this.args.model?.members as Person[] | undefined) ?? [],
      columns: COLUMNS,
    });

    <template>
      <Environment @space={{@model}} @mode="use" data-test-team-roster>
        <Layout @preset="page" @tag="article">

          <header class="rstr-head">
            <p class="rstr-eyebrow">Minimum Otter · grid exemplar</p>
            <h1>{{@model.title}}</h1>
            <p class="rstr-sub">
              {{this.sheet.rows.length}} people · 9 fields each ·
              click any cell to edit
            </p>
          </header>

          <Grid
            class="rstr-grid"
            @table={{this.sheet.table}}
            @gridTemplateColumns={{this.sheet.gridTemplateColumns}}
          >
            <:header>
              {{#each this.sheet.columns as |col|}}
                <div role="columnheader" data-col-key={{col.key}} class="rstr-hdr">
                  {{col.label}}
                </div>
              {{/each}}
            </:header>

            <:body>
              {{#each this.sheet.rows as |row|}}
                <Row class="rstr-row" @rowKey={{row.key}}>
                  {{#each row.cells as |cell|}}
                    <Cell
                      class="rstr-cell"
                      data-col-key={{cell.colKey}}
                      @value={{cell.value}}
                      @type={{cell.kind}}
                      @field={{cell.field}}
                      @editable={{cell.editable}}
                      @onCommit={{cell.commit}}
                    />
                  {{/each}}
                </Row>
              {{/each}}
            </:body>
          </Grid>

        </Layout>
      </Environment>

      <style>
        [data-test-team-roster] {
          min-height: 100%;
          background: #f8fafc;
          color: #0f172a;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .rstr-head { padding: 18px 22px 14px; display: grid; gap: 4px; }
        .rstr-head h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
        .rstr-eyebrow {
          margin: 0;
          color: #4338ca;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .rstr-sub { margin: 0; color: #475569; font-size: 13px; }
        .rstr-grid {
          margin: 0 22px;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          background: #ffffff;
          font-size: 13px;
        }
        .rstr-hdr {
          padding: 10px 14px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-bottom: 1px solid #c7d2fe;
        }
        .rstr-cell { min-width: 0; font-variant-numeric: tabular-nums; }
      </style>
    </template>
  };
}
