// site.gts — the card types the routes in the README name.
//
// The routes themselves are in realm.json (see the README). A card type
// needs nothing special to be routed. What the routes rely on:
//
// - `slug` on each type: the field a field-match route compares with the
//   path value (`"match": { "slug": ":slug" }`). Keep it unique per type.
// - `status` on Post: the route's `where` keeps drafts off the site.
// - `category` on Product: the one link between Product and Category, so
//   the nested route `/c/:category` -> `/:product` finds it without a
//   `parent` key, and `/c/hats/trail-runner` is a 404 when the product's
//   category is `shoes`.

import {
  CardDef,
  Component,
  contains,
  field,
  linksTo,
} from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import MarkdownField from '@cardstack/base/markdown';

export class Post extends CardDef {
  static displayName = 'Post';
  static prefersWideFormat = true;

  @field slug = contains(StringField);
  @field status = contains(StringField, {
    description: '"draft" or "published"; only published posts are routed',
  });
  @field headline = contains(StringField);
  @field body = contains(MarkdownField);

  static isolated = class Isolated extends Component<typeof this> {
    <template>
      <article class='page'>
        <h1>{{@model.headline}}</h1>
        <@fields.body />
      </article>
      <style scoped>
        .page {
          max-width: 48rem;
          margin: 0 auto;
          padding: var(--boxel-sp-xl) var(--boxel-sp-lg);
        }
      </style>
    </template>
  };
}

export class Category extends CardDef {
  static displayName = 'Category';
  static prefersWideFormat = true;

  @field slug = contains(StringField);
  @field name = contains(StringField);
}

export class Product extends CardDef {
  static displayName = 'Product';
  static prefersWideFormat = true;

  @field slug = contains(StringField);
  @field name = contains(StringField);
  // The link the nested route checks: this product belongs to that
  // category.
  @field category = linksTo(() => Category);
}
