import {
  CardDef,
  Component,
  FieldDef,
  contains,
  containsMany,
  field,
} from 'https://cardstack.com/base/card-api';
import BooleanField from 'https://cardstack.com/base/boolean';
import NumberField from 'https://cardstack.com/base/number';
import StringField from 'https://cardstack.com/base/string';

import { expression, fx, jq } from './bxl';

export class InvoiceLineField extends FieldDef {
  static displayName = 'Invoice Line';

  @field sku = contains(StringField);
  @field description = contains(StringField);
  @field category = contains(StringField);
  @field quantity = contains(NumberField);
  @field unitPrice = contains(NumberField);
  @field discountPct = contains(NumberField);
  @field taxable = contains(BooleanField);

  @field lineTotal = contains(NumberField, {
    computeVia: expression(
      jq`ROUND((.quantity * .unitPrice) * (1 - (.discountPct / 100)); 2)`,
    ),
  });

  @field label = contains(StringField, {
    computeVia: expression(jq`"\(.sku) - \(.description)"`),
  });

  static embedded = class Embedded extends Component<typeof InvoiceLineField> {
    <template>
      <article class='line'>
        <div>
          <strong>{{@model.label}}</strong>
          <span>{{@model.category}}</span>
        </div>
        <div class='amount'>{{@model.lineTotal}}</div>
      </article>
      <style scoped>
        .line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.55rem 0;
          border-bottom: 1px solid var(--boxel-border-color, #d7dde7);
        }

        .line div:first-child {
          display: grid;
          gap: 0.15rem;
        }

        strong {
          font-size: 0.9rem;
          color: var(--boxel-dark, #171717);
        }

        span {
          font-size: 0.75rem;
          color: var(--boxel-muted-dark, #6b7280);
        }

        .amount {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--boxel-dark, #171717);
        }
      </style>
    </template>
  };
}

export class BxlComputedInvoice extends CardDef {
  static displayName = 'BXL Computed Invoice';
  static prefersWideFormat = true;

  @field invoiceNumber = contains(StringField);
  @field status = contains(StringField);
  @field taxRate = contains(NumberField);
  @field shipping = contains(NumberField);
  @field lineItems = containsMany(InvoiceLineField);

  @field subtotal = contains(NumberField, {
    computeVia: expression(jq`[.lineItems[].lineTotal] | add // 0`),
  });

  @field taxableSubtotal = contains(NumberField, {
    computeVia: expression(
      jq`[.lineItems[] | select(.taxable) | .lineTotal] | add // 0`,
    ),
  });

  @field taxAmount = contains(NumberField, {
    computeVia: expression(jq`ROUND((.taxableSubtotal * .taxRate) / 100; 2)`),
  });

  @field grandTotal = contains(NumberField, {
    computeVia: expression(
      jq`ROUND(.subtotal + .taxAmount + (.shipping // 0); 2)`,
    ),
  });

  @field needsReview = contains(BooleanField, {
    computeVia: expression(fx`OR(["Grand Total" > 1000, "Tax Amount" = 0])`),
  });

  @field invoiceSummary = contains(StringField, {
    computeVia: expression(jq`"\(.invoiceNumber) / \(.status) / \(.grandTotal)"`),
  });

  get cardTitle() {
    return this.cardInfo?.name ?? this.invoiceNumber ?? 'BXL invoice';
  }

  static isolated = class Isolated extends Component<typeof BxlComputedInvoice> {
    <template>
      <article class='invoice'>
        <header>
          <p class='eyebrow'>BXL computeVia</p>
          <h1>{{@model.invoiceNumber}}</h1>
          <p>{{@model.invoiceSummary}}</p>
        </header>

        <section class='lines'>
          <@fields.lineItems @format='embedded' />
        </section>

        <dl class='totals'>
          <div><dt>Subtotal</dt><dd>{{@model.subtotal}}</dd></div>
          <div><dt>Taxable</dt><dd>{{@model.taxableSubtotal}}</dd></div>
          <div><dt>Tax</dt><dd>{{@model.taxAmount}}</dd></div>
          <div><dt>Shipping</dt><dd>{{@model.shipping}}</dd></div>
          <div class='grand'><dt>Total</dt><dd>{{@model.grandTotal}}</dd></div>
        </dl>

        {{#if @model.needsReview}}
          <p class='review'>Review required</p>
        {{/if}}
      </article>
      <style scoped>
        .invoice {
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

        .eyebrow {
          margin: 0;
          color: var(--muted-foreground, #6b7280);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: 1.6rem;
          letter-spacing: 0;
        }

        p {
          margin: 0;
        }

        .lines {
          border-top: 1px solid var(--boxel-border-color, #d7dde7);
        }

        .totals {
          display: grid;
          gap: 0.35rem;
          margin: 0;
          max-width: 24rem;
          justify-self: end;
          width: min(100%, 24rem);
        }

        .totals > div {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        dt {
          color: var(--muted-foreground, #6b7280);
        }

        dd {
          margin: 0;
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .grand {
          padding-top: 0.5rem;
          border-top: 1px solid var(--boxel-border-color, #d7dde7);
        }

        .review {
          width: fit-content;
          padding: 0.35rem 0.55rem;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          background: #fffbeb;
          color: #92400e;
          font-size: 0.8rem;
          font-weight: 700;
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof BxlComputedInvoice> {
    <template>
      <article class='embedded'>
        <strong>{{@model.invoiceNumber}}</strong>
        <span>{{@model.grandTotal}}</span>
      </article>
      <style scoped>
        .embedded {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem;
          color: var(--foreground, #111827);
        }

        span {
          font-family: var(--font-mono);
          font-weight: 700;
        }
      </style>
    </template>
  };

  static fitted = class Fitted extends Component<typeof BxlComputedInvoice> {
    <template>
      <article class='fitted'>
        <span>{{@model.invoiceNumber}}</span>
        <strong>{{@model.grandTotal}}</strong>
      </article>
      <style scoped>
        .fitted {
          display: grid;
          align-content: center;
          gap: 0.25rem;
          min-block-size: 100%;
          padding: 0.75rem;
          color: var(--foreground, #111827);
        }

        span {
          overflow: hidden;
          color: var(--muted-foreground, #6b7280);
          font-size: 0.75rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        strong {
          font-family: var(--font-mono);
          font-size: 1.1rem;
        }
      </style>
    </template>
  };
}
