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
// - `posts` on Blog: the home card lists the posts and links each one
//   with `hrefTo`, which gives the post's routed address (`/posts/hello`)
//   on the published site and the card's own URL where no route fits.

import {
  CardDef,
  Component,
  contains,
  field,
  linksTo,
  linksToMany,
} from '@cardstack/base/card-api';
import { hrefTo } from '@cardstack/base/href-to';
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

export class Blog extends CardDef {
  static displayName = 'Blog';
  static prefersWideFormat = true;

  @field name = contains(StringField);
  @field posts = linksToMany(() => Post);

  static isolated = class Isolated extends Component<typeof this> {
    <template>
      <main class='page'>
        <h1>{{@model.name}}</h1>
        <ul>
          {{#each @model.posts as |post|}}
            {{! The template names the card, never the route's path. }}
            <li><a href={{hrefTo post}}>{{post.headline}}</a></li>
          {{/each}}
        </ul>
      </main>
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
