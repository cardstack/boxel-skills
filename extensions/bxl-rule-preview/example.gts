import { CardDef, Component } from 'https://cardstack.com/base/card-api';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { eq } from '@cardstack/boxel-ui/helpers';

import { prepareBxlSafe } from './bxl';

const invoiceSchema = {
  fields: [
    { key: 'status', label: 'Status' },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'taxRate', label: 'Tax Rate' },
    { key: 'taxAmount', label: 'Tax Amount' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'total', label: 'Total' },
    { key: 'dueDays', label: 'Due Days' },
    {
      key: 'customer',
      label: 'Customer',
      kind: 'object',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'tier', label: 'Tier' },
        { key: 'creditLimit', label: 'Credit Limit' },
      ],
    },
    {
      key: 'lineItems',
      label: 'Line Item',
      kind: 'array',
      item: {
        fields: [
          { key: 'sku', label: 'SKU' },
          { key: 'category', label: 'Category' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'lineTotal', label: 'Line Total' },
          { key: 'taxable', label: 'Taxable' },
        ],
      },
    },
    {
      key: 'payments',
      label: 'Payment',
      kind: 'array',
      item: {
        fields: [
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
        ],
      },
    },
    {
      key: 'shipments',
      label: 'Shipment',
      kind: 'array',
      item: {
        fields: [
          { key: 'carrier', label: 'Carrier' },
          { key: 'delivered', label: 'Delivered' },
        ],
      },
    },
  ],
};

const invoiceInput = {
  status: 'open',
  subtotal: 80,
  taxRate: 8.25,
  taxAmount: 4.54,
  shipping: 12.5,
  total: 89.04,
  dueDays: 30,
  customer: {
    name: 'Acme Legal',
    tier: 'gold',
    creditLimit: 500,
  },
  lineItems: [
    { sku: 'PAPER-01', category: 'Supplies', quantity: 2, lineTotal: 10, taxable: true },
    { sku: 'BRAND-RED', category: 'Marketing', quantity: 5, lineTotal: 10, taxable: false },
    { sku: 'COPY-03', category: 'Supplies', quantity: 3, lineTotal: 12, taxable: true },
    { sku: 'COPY-04', category: 'Service', quantity: 9, lineTotal: 18, taxable: true },
    { sku: 'SRV-01', category: 'Service', quantity: 1, lineTotal: 15, taxable: false },
    { sku: 'HARD-02', category: 'Hardware', quantity: 2, lineTotal: 15, taxable: true },
  ],
  payments: [
    { amount: 30, status: 'captured' },
    { amount: 25, status: 'pending' },
    { amount: 10, status: 'failed' },
  ],
  shipments: [
    { carrier: 'UPS', delivered: true },
    { carrier: 'FedEx', delivered: false },
  ],
};

const rules = [
  {
    kind: 'constraint',
    name: 'Line totals match subtotal',
    expression: 'SUM("Line Item"[all]."Line Total") = Subtotal',
  },
  {
    kind: 'visibleWhen',
    name: 'Show reviewer section',
    expression: 'Customer.Tier = "gold" and Total > 50',
  },
  {
    kind: 'autofill',
    name: 'Suggested remaining credit',
    expression: 'Customer."Credit Limit" - Total',
  },
  {
    kind: 'workflow',
    name: 'Can close invoice',
    expression: 'all(Shipment[], Delivered = true)',
  },
  {
    kind: 'notification',
    name: 'Failed payment alert',
    expression: 'any(Payment[], Status = "failed")',
  },
];

function format(value: unknown): string {
  if (value === undefined) {
    return '(undefined)';
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function evaluateRule(source: string) {
  let prepared = prepareBxlSafe(source, { schema: invoiceSchema }) as any;
  if (!prepared.ok) {
    return {
      ok: false,
      phase: prepared.error?.phase ?? 'compile',
      error: prepared.error?.message ?? 'Compile failed',
      compiled: '',
      warnings: [],
      output: '(error)',
    };
  }

  let result = prepared.value.evaluate(invoiceInput);
  if (result?.errors?.length) {
    return {
      ok: false,
      phase: 'runtime',
      error: result.errors[0]?.message ?? 'Runtime error',
      compiled: prepared.value.compiledSource ?? '',
      warnings: prepared.value.warnings ?? [],
      output: '(error)',
    };
  }

  return {
    ok: true,
    phase: 'ok',
    error: '',
    compiled: prepared.value.compiledSource ?? '',
    warnings: prepared.value.warnings ?? [],
    output: format(result.value),
  };
}

export class BxlRulePreview extends CardDef {
  static displayName = 'BXL Rule Preview';
  static prefersWideFormat = true;

  static isolated = class Isolated extends Component<typeof BxlRulePreview> {
    @tracked activeIndex = 0;
    @tracked expression = rules[0].expression;
    @tracked output = '(run a rule)';
    @tracked compiled = '';
    @tracked error = '';
    @tracked phase = '';
    @tracked warnings: string[] = [];

    get rules() {
      return rules;
    }

    get activeRule() {
      return rules[this.activeIndex] ?? rules[0];
    }

    get fixtureJson() {
      return JSON.stringify(invoiceInput, null, 2);
    }

    selectRule = (index: number) => {
      this.activeIndex = index;
      this.expression = rules[index]?.expression ?? '';
      this.run();
    };

    updateExpression = (event: Event) => {
      this.expression = (event.target as HTMLTextAreaElement).value;
    };

    run = () => {
      let result = evaluateRule(this.expression);
      this.output = result.output;
      this.compiled = result.compiled;
      this.error = result.error;
      this.phase = result.phase;
      this.warnings = result.warnings.map((warning: any) =>
        typeof warning === 'string' ? warning : warning?.message ?? JSON.stringify(warning),
      );
    };

    <template>
      <article class='preview'>
        <header>
          <p>BXL rule preview</p>
          <h1>{{this.activeRule.name}}</h1>
        </header>

        <nav>
          {{#each this.rules as |rule index|}}
            <button
              type='button'
              class={{if (eq index this.activeIndex) 'active'}}
              {{on 'click' (fn this.selectRule index)}}
            >
              {{rule.kind}}
            </button>
          {{/each}}
        </nav>

        <section class='workspace'>
          <div class='editor'>
            <label for='bxl-rule'>Expression</label>
            <textarea
              id='bxl-rule'
              value={{this.expression}}
              {{on 'input' this.updateExpression}}
            ></textarea>
            <button type='button' {{on 'click' this.run}}>Run</button>
          </div>

          <div class='result'>
            <div>
              <span>Output</span>
              <pre>{{this.output}}</pre>
            </div>
            {{#if this.error}}
              <div class='error'>
                <span>{{this.phase}}</span>
                <pre>{{this.error}}</pre>
              </div>
            {{/if}}
            {{#if this.compiled}}
              <div>
                <span>Compiled jq</span>
                <pre>{{this.compiled}}</pre>
              </div>
            {{/if}}
          </div>
        </section>

        <details>
          <summary>Fixture</summary>
          <pre>{{this.fixtureJson}}</pre>
        </details>
      </article>
      <style scoped>
        .preview {
          display: grid;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--background, #f8fafc);
          color: var(--foreground, #111827);
          font-family: var(--font-sans);
        }

        header {
          display: grid;
          gap: 0.25rem;
        }

        header p {
          margin: 0;
          color: var(--muted-foreground, #6b7280);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: 0;
        }

        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        button {
          border: 1px solid var(--boxel-border-color, #cbd5e1);
          border-radius: 6px;
          padding: 0.45rem 0.65rem;
          background: #fff;
          color: #111827;
          font: inherit;
          cursor: pointer;
        }

        button.active,
        .editor button {
          border-color: #111827;
          background: #111827;
          color: #fff;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
        }

        .editor,
        .result {
          display: grid;
          align-content: start;
          gap: 0.6rem;
        }

        label,
        .result span {
          color: var(--muted-foreground, #6b7280);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        textarea,
        pre {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--boxel-border-color, #cbd5e1);
          border-radius: 6px;
          background: #fff;
          color: #111827;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          line-height: 1.4;
        }

        textarea {
          min-block-size: 7rem;
          padding: 0.75rem;
          resize: vertical;
        }

        pre {
          overflow: auto;
          margin: 0.25rem 0 0;
          padding: 0.75rem;
          white-space: pre-wrap;
        }

        .error pre {
          border-color: #fca5a5;
          background: #fef2f2;
          color: #991b1b;
        }

        details {
          color: var(--muted-foreground, #6b7280);
        }

        @media (max-width: 44rem) {
          .workspace {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof BxlRulePreview> {
    <template>
      <p>BXL rule preview</p>
    </template>
  };

  static fitted = class Fitted extends Component<typeof BxlRulePreview> {
    <template>
      <div class='fitted'>BXL rules</div>
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
