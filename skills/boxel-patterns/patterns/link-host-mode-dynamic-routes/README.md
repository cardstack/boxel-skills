---
validated: source-proven
---

# link-host-mode-dynamic-routes — One route for many cards (`/posts/:slug`) via `realm.json`, and links to them with `hrefTo`

**What this gives you:** One `hostRoutingRules` entry that serves a page for every card of a kind: `/posts/hello` for the post whose `slug` is `hello`, `/c/shoes/trail-runner` for a product in a category. And a template helper, `hrefTo`, that gives a link the routed address of the card it points to. Fixed routes (one path, one card) are in [`link-host-mode-paths`](../link-host-mode-paths/README.md); read that first for `realm.json`, publishing and the same-realm rule.

**When to use:** "Give each post a page at /posts/its-slug", a product page under its category, a short address for a card, an old address that must redirect to a new one, or any `<a>` in a site's template that points to another card.

**The insight:** A route's `path` can hold `:name` segments, and the route says how the values find a card. Everything for a dynamic route goes in `attributes`. Only a fixed route's `instance` goes in `relationships`. A template never writes a route's path: it says which card the link points to (`{{hrefTo post}}`), and the realm's routes give the address.

## The `:name` segment

- A `:name` takes exactly one whole, non-empty path segment. `/posts/:slug` matches `/posts/hello`, not `/posts` and not `/posts/news/hello`.
- No wildcards, no optional segments, no regular expressions. A `:` is only valid at the start of a segment: `/post-:id` and `/:a-:b` are invalid.
- A name has letters, digits and `_`, and does not start with a digit. A name is used once in a path, and a child route cannot reuse a name of its parents.
- A literal segment has letters, digits, `-`, `_`, `.`, `~` or `%XX`.

## The route forms

A route sets `path` and exactly one form.

| Form | Keys (all in `attributes`) | What the server does |
|---|---|---|
| Card id template | `card` | Fills the template with the path values and loads that card by id. |
| Field match | `type`, `match`, optional `where` | Searches cards of `type` where each `match` field equals its path value, and `where` holds. |
| Nested route | `routes` on a card route | Resolves the parent's card, then a child route for the rest of the path. |
| Redirect | `redirectTo`, optional `statusCode` | Copies the path values into the target. No card is looked up. |

**Card id template.** `"card": "./Post/:id"` starts with `./`, has no `.json`, and names a card in this realm. It must use every `:name` of the route's own path, and no name that is not in the path (or a parent's path). It has no `where`: it serves every card the id finds, a draft included.

**Field match.** `type` is a code ref (`{ "module": "./site", "name": "Post" }`, where `./site` is `site.gts` at the realm root) and must be a card type. The type's module must be in this realm, the base realm or the catalog. The server drops a route that names a type from another workspace. `match` maps a field to a `:name`: `{ "slug": ":slug" }`. Each `:name` of the route's own path is matched by exactly one field, and the path needs at least one `:name`. The field must be on the type and hold a plain value such as a string. For a compound field or a link, use a dotted path (`author.slug`); a path through a link needs the link to be `searchable` (`boxel/references/searchable-fields.md`). `where` is an optional query filter that narrows the cards (`{ "eq": { "status": "published" } }`). The browser must be able to check it: `eq`, `in`, `contains`, `range`, `type`, `any`, `every` and `not` are valid, `matches` is not.

**Nested route.** A child's `path` is relative to its parent's. When both routes are dynamic, the child's card must belong to the parent's card through a stored link field: a `linksTo` (or `linksToMany`) on the child's card that points to the parent's, or a `linksToMany` on the parent's card. When exactly one such field connects the two types, the server finds it. When there is more than one, name it with `"parent": "<field>"`. A query-backed link (a `linksTo` or `linksToMany` declared with a `query`) does not count: the server skips it when it looks for the link, and drops a route whose `parent` names one. Put the link on the child (`Product.category`). A link only on the parent can give a warning, because the child card alone then has no address. A nested card id template always needs `parent`, unless its `card` uses the parent's `:name` (`./Product/:category/:product`). A redirect cannot have child routes, and a fixed route cannot be under a dynamic route.

**Redirect.** `"redirectTo": "/p/:id"` can use only the `:name`s of the route's path. The target is a path in this realm or an `http(s)` URL. `statusCode` is `301` or `302` (the default).

**Alias.** A card id template or a field match with `"statusCode": 301` is an alias. It finds its card, then answers 301 to the card's canonical address (see Order). When the card has no other address, it serves the card. An alias is never a card's canonical address. The server ignores any other `statusCode` on a card route.

## What makes the server keep a route

The server drops a route that is not valid, with its child routes, and serves the others. Before you save, check:

- The route has a `path` and exactly one form. `instance`, `card`, `type`/`match`/`where` and `redirectTo` do not mix.
- A fixed route (`instance`) has no `:name` in its path.
- The rules in "The route forms" hold: the template uses the path's names, `type` is a card type in this realm (or the base realm or the catalog), each `:name` has one `match` field, `where` is a filter the browser can check, a nested route has one stored link to its parent.
- A realm has at most 20 dynamic routes. Each card id template, field match and redirect with a `:name` counts, nested ones included. The server drops the routes after the 20th.
- A route `name`, when set, is unique in the realm.

The server checks the routes when it indexes `realm.json`. A type whose module has an error makes its route invalid until the module is correct and the realm is indexed again.

## Order

- At each level, a route with a literal segment is tried before a route with a `:name` at the same position: `/posts/new` goes before `/posts/:slug`, wherever it is in the list.
- Routes that tie are tried in list order. A dynamic route that finds no card lets the next one try, so `/:slug` for `Post` and then `/:slug` for `Page` both work.
- The first route that finds its card commits its level. When its child routes then find nothing, the visitor gets 404. No other route is tried.
- A card that fits more than one route has one canonical address: the first route in list order that fits it (a route's children before its later siblings, never an alias). `hrefTo` gives this address. Put the address you want visitors to see first.
- When two cards hold the same value, the path serves one of them (the first in the index's default sort), and a link to the other card opens the first. Keep the matched field unique. In a nested route, it only has to be unique within its parent.

## What a visitor gets

- 200 with the card, when a route resolves.
- The redirect's status, for a redirect route. 301 from an alias. 308 from the trailing-slash form (`/posts/hello/`) to the form without it.
- 404, when a route matches the path and no card is found, or the visitor cannot read the card. A path that is a card's own URL or a file of the realm is still served.
- 503 (or 429), when the lookup fails or the routes cannot be read. The page is not gone; the visitor can try again.
- A path that no route matches is served as it was without routes.

## How to choose a form

- **Field match** when the address shows a value from the card. The card type needs a field for it, usually a `slug` string. Add the field and fill it on every card before you add the route. Use `where` to keep drafts off the site.
- **Card id template** when the card file names are readable (`Post/hello-world.json`) or a plain id in the address is fine. It needs no field and no search.
- **Nested route** when a card only makes sense under another (`/c/:category/:product`).
- **Redirect** for an old or short address. It does not check that the target exists.

## Links: `hrefTo`

Use `hrefTo` for every `<a>` in a template that points to a card. Do not write a route's path in a template.

```gts
import { hrefTo } from '@cardstack/base/href-to';

<a href={{hrefTo @model.author}}>{{@model.author.name}}</a>
```

A link says what it points to in one of three ways:

| Syntax | Points to | When no route fits |
|---|---|---|
| `{{hrefTo post}}`, `{{hrefTo entry.id}}` | A card, or a card id (a plain string is a card id). | The card's own URL. |
| `{{hrefTo Tag name='crag'}}` | A card type and the values of the fields a field-match route matches. No card is loaded or checked, and `where` is not checked. | No `href`. |
| `{{hrefTo person route='people'}}` | The route with that `name`, with one card or value for each dynamic level. | No `href`. |

- **What the link gets.** The canonical routed address of the card, on the realm's URL: `/posts/hello` for a published post in the example below. A card that no route fits (a draft, when the only route has `where: published`) gets its own card URL, so the same template works in a realm with other routes or with none.
- **Nested routes.** Give one card for each dynamic level, outermost first (`{{hrefTo category product}}`), or only the innermost card when it holds the link to its parent (`{{hrefTo product}}`).
- **Prefer the card form.** A card type that other realms can use must not name a route. Use `route=` only in a site's own cards, such as its home page or its frame.
- **Other realms.** A link into another realm keeps that card's own URL.
- **Loading.** While a card that the routes read is still loading, the link has the card's own URL, and it changes when the card arrives. An empty argument gives no `href`. A link never fails the render because of what it points to.
- **Where it applies.** A link gets its routed address on the published site and in the HTML that is stored for the realm. In the app (Interact, Code and Host mode), a link keeps the card's own URL.

## What is not there yet

Do not promise these:

- **No routed links in the app.** In Interact, Code and Host mode, a `hrefTo` link has the card's own URL. To see routed addresses, open the published site.
- **No routes editor.** Write dynamic routes in `realm.json` directly.
- **The published site is a copy.** A change to `realm.json`, a slug or a card is not on the site until the user publishes again from Host mode.
- **A route change does not refresh stored links.** After the routes change, links in pages that are already stored can keep their old addresses until those cards are indexed again.
- **No memory of old addresses.** When an address moves, add a redirect route from the old path.

## Recipe shape

Card types `Post` (`slug`, `status`), `Category` (`slug`), `Product` (`slug`, `category` linksTo `Category`) and `Blog` (`posts` linksToMany `Post`) in `site.gts` (see `example.gts`), and this in `realm.json`:

```json
{
  "data": {
    "type": "card",
    "attributes": {
      "hostRoutingRules": [
        { "path": "/" },
        {
          "path": "/posts/:slug",
          "type": { "module": "./site", "name": "Post" },
          "where": { "eq": { "status": "published" } },
          "match": { "slug": ":slug" }
        },
        { "path": "/p/:id", "card": "./Post/:id" },
        {
          "path": "/c/:category",
          "type": { "module": "./site", "name": "Category" },
          "match": { "slug": ":category" },
          "routes": [
            {
              "path": "/:product",
              "type": { "module": "./site", "name": "Product" },
              "match": { "slug": ":product" }
            }
          ]
        },
        { "path": "/go/:id", "redirectTo": "/p/:id", "statusCode": 301 }
      ]
    },
    "relationships": {
      "hostRoutingRules.0.instance": { "links": { "self": "./Blog/home" } }
    },
    "meta": {
      "adoptsFrom": {
        "module": "@cardstack/base/realm-config",
        "name": "RealmConfig"
      }
    }
  }
}
```

With a published `Post/a` (`slug: hello`), a draft `Post/b` (`slug: wip`), categories `shoes` and `hats`, and a product `trail-runner` whose `category` is `shoes`:

| Path | Result |
|---|---|
| `/posts/hello` | 200, the card `Post/a` |
| `/posts/wip` | 404, `where` excludes the draft |
| `/p/a` | 200, the same post as `/posts/hello` |
| `/c/shoes` | 200, the category |
| `/c/shoes/trail-runner` | 200, the product |
| `/c/hats/trail-runner` | 404, the product is not in that category |
| `/go/a` | 301 to `/p/a` |

The list of posts on the home card links each post with `hrefTo`:

```gts
{{#each @model.posts as |post|}}
  <li><a href={{hrefTo post}}>{{post.headline}}</a></li>
{{/each}}
```

| Link | Address on the published site |
|---|---|
| `{{hrefTo post}}` for `Post/a` | `/posts/hello`: `/posts/:slug` is the first route that fits |
| `{{hrefTo post}}` for the draft `Post/b` | `/p/b`: `where` excludes it from `/posts/:slug`, and `/p/:id` fits next |
| `{{hrefTo product}}` | `/c/shoes/trail-runner`: the category comes from `product.category` |

`/p/:id` also serves the draft. To keep drafts off the site, remove that route, or make it an alias (`"statusCode": 301`) and accept that a draft is then served at `/p/b`. With only `/posts/:slug`, a link to a draft has the draft's card URL.

For a list that comes from a search and not from a link field, give `hrefTo` the id: `<a href={{hrefTo entry.id}}>` (see the anchor overlay in [`app-card-home-with-search`](../app-card-home-with-search/README.md)).

**Source:** `packages/base/realm-config.gts` (`RoutingRuleField`), `packages/base/href-to.ts`, `packages/runtime-common/route-pattern.ts`, `host-routes.ts` (validation), `host-route-resolver.ts` (order), `host-route-address.ts` (the address of a card), `packages/realm-server/handlers/serve-index.ts` (responses), `packages/realm-server/tests/server-endpoints/dynamic-host-routes-test.ts` and `packages/host/tests/integration/href-to-test.gts` (working sets).

## See also

- [`link-host-mode-paths`](../link-host-mode-paths/README.md) — fixed routes, the `realm.json` basics, publishing, public asset paths.
- [`app-card-home-with-search`](../app-card-home-with-search/README.md) — the index page that lists the cards, and the anchor overlay that makes its tiles navigate in Host mode.
- `boxel-environment/references/questions-about-boxel.md` — how the user publishes, and what a published site is.
