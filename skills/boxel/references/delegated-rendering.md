**Delegated rendering:**
```hbs
<!-- Always use @fields, even for singular -->
<@fields.author @format="embedded" />
<@fields.items @format="embedded" />
```

**Make cards clickable:**
```hbs
<CardContainer
  {{@context.cardComponentModifier
    cardId=card.url
    format='data'
  }}
  @displayBoundaries={{true}}
>
  <card.component />
</CardContainer>
```

**Avoid cycles:**
```gts
// Canonical links only
@field supervisor = linksTo(() => Employee);

// Query for reverse
get directReportsQuery() {
  return {
    filter: {
      on: { module: './employee', name: 'Employee' },
      eq: { supervisor: this.args.model.id }
    }
  };
}
```

### Select and Combobox: Smart Dropdown Menus

Regular HTML selects are limited to plain text. Pret UI's `Select` gives a themed, keyboard-navigable dropdown over `{ value, label }` options (search appears automatically past seven options). When each row needs a secondary line or custom markup, use `Combobox`: its options take an optional `meta` line, and its `<:option>` block replaces the default row.

#### Pattern: Rich Select with Custom Options

```gts
import { Combobox } from '@cardstack/pretui/components/combobox';

export class OptionField extends FieldDef { // Option field for select
  static displayName = 'Option';
  
  @field key = contains(StringField);
  @field label = contains(StringField);
  @field description = contains(StringField);

  static embedded = class Embedded extends Component<typeof this> {
    <template>
      <div class="option-display">
        <strong>{{if @model.label @model.label "Unnamed Option"}}</strong>
        <span>{{if @model.description @model.description "No description"}}</span>
      </div>
    </template>
  };
}

export class ProductCategory extends CardDef { // Card using Combobox
  @field selectedCategory = contains(OptionField);
  
  static edit = class Edit extends Component<typeof this> { // Edit format
    categories = [
      { key: '1', label: 'Electronics', description: 'Phones, computers, and gadgets' },
      { key: '2', label: 'Clothing', description: 'Fashion and apparel' },
      { key: '3', label: 'Home & Garden', description: 'Furniture and decor' }
    ];

    // Combobox options are { value, label, meta? }; meta is the secondary line
    options = this.categories.map((c) => ({ value: c.key, label: c.label, meta: c.description }));

    // @onValueChange yields the chosen value string, or '' when cleared
    updateSelection = (value: string) => {
      let category = this.categories.find((c) => c.key === value);
      this.args.model.selectedCategory = category ? new OptionField(category) : null;
    }

    <template>
      <Combobox
        @label="Product Category"
        @options={{this.options}}
        @value={{@model.selectedCategory.key}}
        @onValueChange={{this.updateSelection}}
        @placeholder="Select a category..."
      >
        <:option as |option|>
          <div class="option-item">
            <span>{{option.label}}</span>
            <span>{{option.meta}}</span>
          </div>
        </:option>
      </Combobox>
    </template>
  };
}
```

### Custom Edit Controls

Create user-friendly edit controls that accept natural input. Hide complexity in expandable sections while keeping ALL properties editable and inspectable.

```gts
// Example: Natural language time period input
import { Field } from '@cardstack/pretui/components/field';
import { Input } from '@cardstack/pretui/components/input';
import { Button } from '@cardstack/pretui/components/button';

static edit = class Edit extends Component<typeof this> {
  @tracked showDetails = false;
  
  parseInput = (value: string) => {
    // Parse "Q1 2025" → quarter: 1, year: 2025, startDate: Jan 1, endDate: Mar 31
    // Parse "April 2025" → month: 4, year: 2025, startDate: Apr 1, endDate: Apr 30
  }
  
  <template>
    <Field @label="Time Period" as |controlId|>
      <Input
        @controlId={{controlId}}
        @placeholder="e.g., Q1 2025 or April 2025"
        @onInput={{this.parseInput}}
      />
    </Field>
    
    <Button {{on 'click' (toggle 'showDetails' this)}}>
      {{if this.showDetails "Hide" "Show"}} Details
    </Button>
    
    {{#if this.showDetails}}
      <!-- Show all parsed values for verification -->
      <!-- Allow manual override of auto-parsed results -->
      <!-- Provide controls for each field property -->
    {{/if}}
  </template>
};
```

### Alternative: Using the viewCard API

Instead of making entire cards clickable, you can create custom buttons or links that use the `viewCard` API to open cards in specific formats.

#### Basic Implementation

```javascript
viewOrder = (order: ProductOrder) => {
  // Open order in isolated view
  this.args.viewCard(order, 'isolated');
};

editOrder = (order: ProductOrder) => {
  // Open card in rightmost stack for side-by-side reference
  // Useful for: 1) reference lookup, 2) edit panel on right while previewing on left
  this.args.viewCard(order, 'edit', {
    openCardInRightMostStack: true
  });
};

viewReturnPolicy = () => {
  // Open card using URL
  const returnPolicyURL = new URL('https://example-realm.test/storefront/ReturnPolicy/return-policy-0525.json');
  this.args.viewCard(returnPolicyURL, 'isolated');
};
```

#### Template Example

```hbs
<div class="order-card">
  <!-- Custom action buttons -->
  <div class="order-actions">
    <Button @variant="primary" {{on "click" (fn this.viewOrder order)}}>
      View Order
    </Button>
    
    <Button @variant="secondary" {{on "click" (fn this.editOrder order)}}>
      Edit Order
    </Button>
  </div>
  
  <Button @variant="ghost" {{on "click" (fn this.viewReturnPolicy)}}>
    Return Policy
  </Button>
</div>
```

#### Available Formats

- `'isolated'` - Read-oriented mode, may have some editable forms or interactive widgets
- `'edit'` - Open card for full editing

#### Use Cases
- Multiple direct call-to-actions per card (view, edit)
- More control over user interactions
- Link to any card via a card URL