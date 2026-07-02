import { CardDef, Component } from 'https://cardstack.com/base/card-api';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { eq } from '@cardstack/boxel-ui/helpers';

import { prepareBxlSafe } from './bxl';

const schema = {
  fields: [
    {
      key: 'lineItems',
      label: 'Line Item',
      kind: 'array',
      item: {
        fields: [
          { key: 'sku', label: 'SKU' },
          { key: 'description', label: 'Description' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'lineTotal', label: 'Line Total' },
        ],
      },
    },
  ],
};

const originalRows = [
  { sku: 'PAPER-01', description: 'Office Paper', quantity: 2, lineTotal: 10 },
  { sku: 'BRAND-RED', description: 'Brand Kit', quantity: 5, lineTotal: 10 },
  { sku: 'COPY-03', description: 'Copy Toner', quantity: 3, lineTotal: 12 },
  { sku: 'COPY-04', description: 'Copy Desk Service', quantity: 9, lineTotal: 18 },
  { sku: 'SRV-01', description: 'Setup Service', quantity: 1, lineTotal: 15 },
];

const reorderedRows = [
  originalRows[3],
  originalRows[0],
  originalRows[1],
  originalRows[2],
  originalRows[4],
];

function evaluate(source: string, input: unknown): string {
  let prepared = prepareBxlSafe(source, { schema }) as any;
  if (!prepared.ok) {
    return prepared.error?.message ?? 'Compile failed';
  }

  let result = prepared.value.evaluate(input);
  if (result?.errors?.length) {
    return result.errors[0]?.message ?? 'Runtime error';
  }

  return JSON.stringify(result.value);
}

export class BxlStableTargetPaths extends CardDef {
  static displayName = 'BXL Stable Target Paths';
  static prefersWideFormat = true;

  static isolated = class Isolated extends Component<typeof BxlStableTargetPaths> {
    @tracked reordered = false;

    positionalPath = '"Line Item"[#4].Quantity';
    stablePath = '"Line Item"[SKU = "COPY-04"].Quantity';
    compositePath = '"Line Item"[row 4, SKU = "COPY-04"].Quantity';

    get rows() {
      return this.reordered ? reorderedRows : originalRows;
    }

    get displayRows() {
      return this.rows.map((row, index) => ({ row, number: index + 1 }));
    }

    get input() {
      return { lineItems: this.rows };
    }

    get positionalValue() {
      return evaluate(this.positionalPath, this.input);
    }

    get stableValue() {
      return evaluate(this.stablePath, this.input);
    }

    get compositeValue() {
      return evaluate(this.compositePath, this.input);
    }

    toggleRows = () => {
      this.reordered = !this.reordered;
    };

    <template>
      <article class='anchors'>
        <header>
          <p>BXL target paths</p>
          <h1>Predicate anchors survive reorder</h1>
          <button type='button' {{on 'click' this.toggleRows}}>
            {{if this.reordered 'Restore order' 'Move COPY-04 to top'}}
          </button>
        </header>

        <section class='grid'>
          <table>
            <thead>
              <tr><th>#</th><th>SKU</th><th>Description</th><th>Qty</th></tr>
            </thead>
            <tbody>
              {{#each this.displayRows as |entry|}}
                <tr class={{if (eq entry.row.sku 'COPY-04') 'target'}}>
                  <td>{{entry.number}}</td>
                  <td>{{entry.row.sku}}</td>
                  <td>{{entry.row.description}}</td>
                  <td>{{entry.row.quantity}}</td>
                </tr>
              {{/each}}
            </tbody>
          </table>

          <div class='paths'>
            <article>
              <span>positional</span>
              <code>{{this.positionalPath}}</code>
              <strong>{{this.positionalValue}}</strong>
            </article>
            <article>
              <span>predicate</span>
              <code>{{this.stablePath}}</code>
              <strong>{{this.stableValue}}</strong>
            </article>
            <article>
              <span>composite check</span>
              <code>{{this.compositePath}}</code>
              <strong>{{this.compositeValue}}</strong>
            </article>
          </div>
        </section>
      </article>
      <style scoped>
        .anchors {
          display: grid;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--background, #f8fafc);
          color: var(--foreground, #111827);
          font-family: var(--font-sans);
        }

        header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 0.25rem 1rem;
          align-items: center;
        }

        header p {
          grid-column: 1 / -1;
          margin: 0;
          color: var(--muted-foreground, #6b7280);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: 1.3rem;
          letter-spacing: 0;
        }

        button {
          border: 1px solid #111827;
          border-radius: 6px;
          padding: 0.45rem 0.65rem;
          background: #111827;
          color: #fff;
          font: inherit;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
          gap: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          overflow: hidden;
          border: 1px solid var(--boxel-border-color, #cbd5e1);
          border-radius: 6px;
          background: #fff;
        }

        th,
        td {
          padding: 0.55rem 0.65rem;
          border-bottom: 1px solid var(--boxel-border-color, #e5e7eb);
          text-align: left;
        }

        th {
          color: var(--muted-foreground, #6b7280);
          font-size: 0.72rem;
          text-transform: uppercase;
        }

        .target td {
          background: #ecfdf5;
          color: #065f46;
          font-weight: 700;
        }

        .paths {
          display: grid;
          gap: 0.65rem;
        }

        .paths article {
          display: grid;
          gap: 0.4rem;
          padding: 0.75rem;
          border: 1px solid var(--boxel-border-color, #cbd5e1);
          border-radius: 6px;
          background: #fff;
        }

        .paths span {
          color: var(--muted-foreground, #6b7280);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        code {
          overflow-wrap: anywhere;
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }

        strong {
          font-family: var(--font-mono);
          font-size: 1.1rem;
        }

        @media (max-width: 44rem) {
          header,
          .grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof BxlStableTargetPaths> {
    <template>
      <p>BXL stable target paths</p>
    </template>
  };

  static fitted = class Fitted extends Component<typeof BxlStableTargetPaths> {
    <template>
      <div class='fitted'>BXL anchors</div>
      <style scoped>
        .fitted {
          display: grid;
          place-items: center;
          min-block-size: 100%;
          padding: 0.75rem;
          font-weight: 700;
        }
      </style>
    </template>
  };
}
