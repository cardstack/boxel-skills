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

import { prepareBxlSafe } from 'https://realms-staging.stack.cards/ctse/common-libs/bxl';

const requestSchema = {
  fields: [
    { key: 'requestName', label: 'Request Name' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total' },
    { key: 'requestedDeliveryDays', label: 'Requested Delivery Days' },
    { key: 'approverEmail', label: 'Approver Email' },
    { key: 'termsAccepted', label: 'Terms Accepted' },
  ],
};

const defaultGuideRules = [
  {
    ruleId: 'total-under-limit',
    label: 'Total is within self-serve limit',
    severity: 'error',
    targetPath: 'Total',
    message: 'Requests above 5000 need finance review.',
    expression: 'Total <= 5000',
  },
  {
    ruleId: 'delivery-window',
    label: 'Delivery window leaves time for review',
    severity: 'warning',
    targetPath: '"Requested Delivery Days"',
    message: 'Requests due inside three days should be escalated.',
    expression: '"Requested Delivery Days" >= 3',
  },
  {
    ruleId: 'approver-present',
    label: 'Approver email is present',
    severity: 'error',
    targetPath: '"Approver Email"',
    message: 'Add an approver before submitting.',
    expression: '"Approver Email" | length > 0',
  },
  {
    ruleId: 'terms-accepted',
    label: 'Terms are accepted',
    severity: 'error',
    targetPath: '"Terms Accepted"',
    message: 'The requester must accept the terms.',
    expression: '"Terms Accepted" = true',
  },
];

interface RuleLike {
  ruleId?: string;
  label?: string;
  severity?: string;
  targetPath?: string;
  message?: string;
  expression?: string;
}

interface GuideResult {
  ruleId: string;
  label: string;
  severity: string;
  severityClass: string;
  targetPath: string;
  message: string;
  expression: string;
  passed: boolean;
  state: string;
  valueLabel: string;
  detail: string;
}

function requestInput(model: any) {
  return {
    requestName: model.requestName ?? '',
    status: model.status ?? '',
    total: model.total ?? 0,
    requestedDeliveryDays: model.requestedDeliveryDays ?? 0,
    approverEmail: model.approverEmail ?? '',
    termsAccepted: model.termsAccepted ?? false,
  };
}

function guideRulesFor(model: any): RuleLike[] {
  let rules = model.guideRules ?? [];
  return rules.length ? rules : defaultGuideRules;
}

function formatValue(value: unknown): string {
  if (value === undefined) {
    return '(undefined)';
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function validateRule(rule: RuleLike, input: Record<string, unknown>): GuideResult {
  let severity = rule.severity ?? 'error';
  let expression = rule.expression ?? '';
  let base = {
    ruleId: rule.ruleId ?? rule.label ?? 'guide-rule',
    label: rule.label ?? 'Guide rule',
    severity,
    severityClass: `severity-${severity}`,
    targetPath: rule.targetPath ?? '',
    message: rule.message ?? '',
    expression,
  };

  if (!expression.trim()) {
    return {
      ...base,
      passed: false,
      state: 'error',
      valueLabel: '(empty expression)',
      detail: 'Rule has no bxl expression.',
    };
  }

  let prepared = prepareBxlSafe(expression, { schema: requestSchema }) as any;
  if (!prepared.ok) {
    return {
      ...base,
      passed: false,
      state: 'error',
      valueLabel: '(compile error)',
      detail: prepared.error?.message ?? 'Rule did not compile.',
    };
  }

  let result = prepared.value.evaluate(input);
  if (result?.errors?.length) {
    return {
      ...base,
      passed: false,
      state: 'error',
      valueLabel: '(runtime error)',
      detail: result.errors[0]?.message ?? 'Rule failed at runtime.',
    };
  }

  let value = result?.value;
  let passed = value === true;
  return {
    ...base,
    passed,
    state: passed ? 'pass' : 'fail',
    valueLabel: formatValue(value),
    detail: passed ? 'Passed' : base.message,
  };
}

function validateGuide(model: any) {
  let input = requestInput(model);
  let results = guideRulesFor(model).map((rule) => validateRule(rule, input));
  let issues = results.filter((result) => !result.passed);
  let errors = issues.filter((result) => result.severity === 'error');
  let warnings = issues.filter((result) => result.severity !== 'error');

  return {
    input,
    results,
    issues,
    errors,
    warnings,
    passed: issues.length === 0,
    summary: issues.length === 0
      ? 'Ready'
      : `${errors.length} errors, ${warnings.length} warnings`,
  };
}

export class GuideValidationRule extends FieldDef {
  static displayName = 'Guide Validation Rule';

  @field ruleId = contains(StringField);
  @field label = contains(StringField);
  @field severity = contains(StringField);
  @field targetPath = contains(StringField);
  @field message = contains(StringField);
  @field expression = contains(StringField);

  static embedded = class Embedded extends Component<typeof GuideValidationRule> {
    <template>
      <div class='rule'>
        <strong>{{@model.label}}</strong>
        <code>{{@model.expression}}</code>
      </div>
      <style scoped>
        .rule {
          display: grid;
          gap: 0.25rem;
          padding: 0.65rem;
          border: 1px solid var(--boxel-border-color, #d7dde7);
          border-radius: 6px;
          background: #fff;
        }

        strong {
          color: var(--foreground, #111827);
          font-size: 0.86rem;
        }

        code {
          color: var(--muted-foreground, #64748b);
          font-size: 0.75rem;
          white-space: normal;
        }
      </style>
    </template>
  };
}

export class GuideValidatedRequest extends CardDef {
  static displayName = 'Guide Validated Request';
  static prefersWideFormat = true;

  @field requestName = contains(StringField);
  @field status = contains(StringField);
  @field total = contains(NumberField);
  @field requestedDeliveryDays = contains(NumberField);
  @field approverEmail = contains(StringField);
  @field termsAccepted = contains(BooleanField);
  @field guideRules = containsMany(GuideValidationRule);

  @field cardTitle = contains(StringField, {
    computeVia: function (this: GuideValidatedRequest) {
      return this.requestName ?? 'Guide validated request';
    },
  });

  static isolated = class Isolated extends Component<typeof GuideValidatedRequest> {
    get guide() {
      return validateGuide(this.args.model);
    }

    get requestJson() {
      return JSON.stringify(this.guide.input, null, 2);
    }

    <template>
      <article class='validation'>
        <header>
          <div>
            <p>Guide validation</p>
            <h1>{{@model.requestName}}</h1>
          </div>
          <span class={{if this.guide.passed 'status pass' 'status fail'}}>
            {{this.guide.summary}}
          </span>
        </header>

        <section class='content'>
          <div class='snapshot'>
            <h2>Target card</h2>
            <dl>
              <div><dt>Status</dt><dd>{{@model.status}}</dd></div>
              <div><dt>Total</dt><dd>{{@model.total}}</dd></div>
              <div><dt>Delivery days</dt><dd>{{@model.requestedDeliveryDays}}</dd></div>
              <div><dt>Approver</dt><dd>{{@model.approverEmail}}</dd></div>
              <div><dt>Terms accepted</dt><dd>{{if @model.termsAccepted 'yes' 'no'}}</dd></div>
            </dl>
            <pre>{{this.requestJson}}</pre>
          </div>

          <div class='results'>
            <h2>Guide rules</h2>
            {{#each this.guide.results as |result|}}
              <article class='result {{result.state}}'>
                <div class='result-top'>
                  <span class='badge {{result.state}}'>{{result.state}}</span>
                  <strong>{{result.label}}</strong>
                  <span class='severity {{result.severityClass}}'>{{result.severity}}</span>
                </div>
                <div class='target'>
                  <span>{{result.targetPath}}</span>
                  <code>{{result.expression}}</code>
                </div>
                <p>{{result.detail}}</p>
                <small>value: {{result.valueLabel}}</small>
              </article>
            {{/each}}
          </div>
        </section>
      </article>

      <style scoped>
        .validation {
          display: grid;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--background, #f8fafc);
          color: var(--foreground, #111827);
          font-family: var(--font-sans);
        }

        header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 1rem;
        }

        header p,
        h1,
        h2,
        dl,
        p {
          margin: 0;
        }

        header p {
          color: var(--muted-foreground, #64748b);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        h1 {
          margin-top: 0.2rem;
          font-size: 1.55rem;
          letter-spacing: 0;
        }

        h2 {
          font-size: 0.9rem;
          letter-spacing: 0;
        }

        .status,
        .badge,
        .severity {
          border-radius: 999px;
          padding: 0.25rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status.pass,
        .badge.pass {
          background: #dcfce7;
          color: #166534;
        }

        .status.fail,
        .badge.fail,
        .badge.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .content {
          display: grid;
          grid-template-columns: minmax(16rem, 0.75fr) minmax(0, 1.25fr);
          gap: 1rem;
        }

        .snapshot,
        .results {
          display: grid;
          align-content: start;
          gap: 0.75rem;
        }

        dl {
          display: grid;
          gap: 0.4rem;
          padding: 0.85rem;
          border: 1px solid var(--boxel-border-color, #d7dde7);
          border-radius: 8px;
          background: #fff;
        }

        dl > div {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
        }

        dt {
          color: var(--muted-foreground, #64748b);
        }

        dd {
          margin: 0;
          font-weight: 700;
        }

        pre {
          overflow: auto;
          margin: 0;
          padding: 0.85rem;
          border-radius: 8px;
          background: #111827;
          color: #e5e7eb;
          font-size: 0.76rem;
        }

        .result {
          display: grid;
          gap: 0.55rem;
          padding: 0.85rem;
          border: 1px solid var(--boxel-border-color, #d7dde7);
          border-left-width: 4px;
          border-radius: 8px;
          background: #fff;
        }

        .result.pass {
          border-left-color: #22c55e;
        }

        .result.fail,
        .result.error {
          border-left-color: #ef4444;
        }

        .result-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-top strong {
          flex: 1;
        }

        .severity-error {
          background: #fef2f2;
          color: #991b1b;
        }

        .severity-warning {
          background: #fffbeb;
          color: #92400e;
        }

        .target {
          display: grid;
          gap: 0.2rem;
        }

        .target span {
          color: var(--muted-foreground, #64748b);
          font-size: 0.78rem;
        }

        code,
        small {
          color: var(--muted-foreground, #64748b);
          font-size: 0.76rem;
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof GuideValidatedRequest> {
    get guide() {
      return validateGuide(this.args.model);
    }

    <template>
      <div class='embedded'>
        <strong>{{@model.requestName}}</strong>
        <span class={{if this.guide.passed 'ok' 'needs-work'}}>{{this.guide.summary}}</span>
      </div>
      <style scoped>
        .embedded {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.8rem;
          border: 1px solid var(--boxel-border-color, #d7dde7);
          border-radius: 8px;
          background: #fff;
          color: var(--foreground, #111827);
        }

        span {
          border-radius: 999px;
          padding: 0.2rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .ok {
          background: #dcfce7;
          color: #166534;
        }

        .needs-work {
          background: #fee2e2;
          color: #991b1b;
        }
      </style>
    </template>
  };

  static fitted = class Fitted extends Component<typeof GuideValidatedRequest> {
    get guide() {
      return validateGuide(this.args.model);
    }

    <template>
      <div class={{if this.guide.passed 'fit pass' 'fit fail'}}>
        <span>{{@model.requestName}}</span>
        <strong>{{this.guide.issues.length}}</strong>
      </div>
      <style scoped>
        .fit {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0.65rem;
          border-radius: 8px;
          color: #111827;
          background: #f8fafc;
        }

        .fit.pass {
          background: #dcfce7;
        }

        .fit.fail {
          background: #fee2e2;
        }

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.82rem;
        }

        strong {
          font-size: 1rem;
        }
      </style>
    </template>
  };
}
