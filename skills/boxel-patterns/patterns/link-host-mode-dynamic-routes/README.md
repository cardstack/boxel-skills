---
validated: source-proven
---

# link-host-mode-dynamic-routes — One route for many cards (`/posts/:slug`) via `realm.json`

**What this gives you:** One `hostRoutingRules` entry that serves a page for every card of a kind: `/posts/hello` for the post whose `slug` is `hello`, `/c/shoes/trail-runner` for a product in a category. Fixed routes (one path, one card) are in [`link-host-mode-paths`](../link-host-mode-paths/README.md); read that first for `realm.json`, publishing and the same-realm rule.

**When to use:** "Give each post a page at /posts/its-slug", a product page under its category, a short address for a card, or an old address that must redirect to a new one.

**The insight:** A route's `path` can hold `:name` segments, and the route says how the values find a card. Everything for a dynamic route goes in `attributes`. Only a fixed route's `instance` goes in `relationships`.

## The `:name` segment

- A `:name` takes exactly one whole, non-empty path segment. `/posts/:slug` matches `/posts/hello`, not `/posts` and not `/posts/2026/hello`.
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

**Card id template.** `"card": "./Post/:id"` starts with `./`, has no `.json`, and names a card in this realm. It must use every `:name` of the route's own path, and no name that is not in the path (or a parent's path).

**Field match.** `type` is a code ref (`{ "module": "./site", "name": "Post" }`, where `./site` is `site.gts` at the realm root) and must be a card type. `match` maps a field to a `:name`: `{ "slug": ":slug" }`. Each `:name` of the route's own path is matched by exactly one field, and the path needs at least one `:name`. The field must be on the type and hold a plain value such as a string. For a compound field or a link, use a dotted path (`author.slug`); a path through a link needs the link to be `searchable` (`boxel/references/searchable-fields.md`). `where` is an optional query filter that narrows the cards (`{ "eq": { "status": "published" } }`). The browser must be able to check it: `eq`, `in`, `contains`, `range`, `type`, `any`, `every` and `not` are valid, `matches` is not.

**Nested route.** A child's `path` is relative to its parent's. When both routes are dynamic, the child's card must belong to the parent's card through a link field: a `linksTo` (or `linksToMany`) on the child's card that points to the parent's, or a `linksToMany` on the parent's card. When exactly one such field connects the two types, the server finds it. When there is more than one, name it with `"parent": "<field>"`. Put the link on the child (`Product.category`). A link only on the parent can give a warning, because the child card alone then has no address. A nested card id template always needs `parent`, unless its `card` uses the parent's `:name` (`./Product/:category/:product`). A redirect cannot have child routes, and a fixed route cannot be under a dynamic route.

**Redirect.** `"redirectTo": "/p/:id"` can use only the `:name`s of the route's path. The target is a path in this realm or an `http(s)` URL. `statusCode` is `301` or `302` (the default).

## What makes the server keep a route

The server drops a route that is not valid, with its child routes, and serves the others. Before you save, check:

- The route has a `path` and exactly one form. `instance`, `card`, `type`/`match`/`where` and `redirectTo` do not mix.
- A fixed route (`instance`) has no `:name` in its path.
- The rules in "The route forms" hold: the template uses the path's names, `type` is a card type in the realm, each `:name` has one `match` field, `where` is a filter the browser can check.
- A realm has at most 20 dynamic routes. Each card id template, field match and redirect with a `:name` counts, nested ones included. The server drops the routes after the 20th.
- A route `name`, when set, is unique in the realm.

## Order

- At each level, a route with a literal segment is tried before a route with a `:name` at the same position: `/posts/new` goes before `/posts/:slug`, wherever it is in the list.
- Routes that tie are tried in list order. A dynamic route that finds no card lets the next one try, so `/:slug` for `Post` and then `/:slug` for `Page` both work.
- The first route that finds its card commits its level. When its child routes then find nothing, the visitor gets 404. No other route is tried.
- A card that fits more than one route has one canonical address: the first route in list order (a route's children before its later siblings). Put the address you want visitors to see first.
- When two cards hold the same value, the path serves one of them (the first in the index's default sort). Keep the matched field unique.

## What a visitor gets

- 200 with the card, when a route resolves.
- The redirect's status, for a redirect route. 308 from the trailing-slash form (`/posts/hello/`) to the form without it.
- 404, when a route matches the path and no card is found, or the visitor cannot read the card. A path that is a card's own URL or a file of the realm is still served.
- 503 (or 429), when the lookup fails. The page is not gone; the visitor can try again.
- A path that no route matches is served as it was without routes.

## How to choose a form

- **Field match** when the address shows a value from the card. The card type needs a field for it, usually a `slug` string. Add the field and fill it on every card before you add the route. Use `where` to keep drafts off the site.
- **Card id template** when the card file names are readable (`Post/hello-world.json`) or a plain id in the address is fine. It needs no field and no search.
- **Nested route** when a card only makes sense under another (`/c/:category/:product`).
- **Redirect** for an old or short address. It does not check that the target exists.

## What is not there yet

Do not promise these:

- **No link helper.** A template cannot ask for a card's routed address. Links between pages still use the card's URL.
- **No routes editor.** Write dynamic routes in `realm.json` directly.
- **The published site is a copy.** A change to `realm.json`, a slug or a card is not on the site until the user publishes again from Host mode.

## Recipe shape

Card types `Post` (`slug`, `status`), `Category` (`slug`) and `Product` (`slug`, `category` linksTo `Category`) in `site.gts` (see `example.gts`), and this in `realm.json`:

```json
{
  "data": {
    "type": "card",
    "attributes": {
      "hostRoutingRules": [
        { "path": "/" },
        { "path": "/p/:id", "card": "./Post/:id" },
        {
          "path": "/posts/:slug",
          "type": { "module": "./site", "name": "Post" },
          "where": { "eq": { "status": "published" } },
          "match": { "slug": ":slug" }
        },
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
      "hostRoutingRules.0.instance": { "links": { "self": "./Home/index" } }
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

With a published `Post/a` (`slug: hello`), a draft post (`slug: wip`), categories `shoes` and `hats`, and a product `trail-runner` whose `category` is `shoes`:

| Path | Result |
|---|---|
| `/p/a` | 200, the card `Post/a` |
| `/posts/hello` | 200, the same post |
| `/posts/wip` | 404, `where` excludes the draft |
| `/c/shoes` | 200, the category |
| `/c/shoes/trail-runner` | 200, the product |
| `/c/hats/trail-runner` | 404, the product is not in that category |
| `/go/a` | 301 to `/p/a` |

`Post/a` fits `/p/:id` and `/posts/:slug`. `/p/:id` is first, so it is the canonical address. Put `/posts/:slug` first if that is the address to show.

**Source:** `packages/base/realm-config.gts` (`RoutingRuleField`), `packages/runtime-common/route-pattern.ts`, `host-routes.ts` (validation), `host-route-resolver.ts` (order), `packages/realm-server/handlers/serve-index.ts` (responses), `packages/realm-server/tests/server-endpoints/dynamic-host-routes-test.ts` (a working set).

## See also

- [`link-host-mode-paths`](../link-host-mode-paths/README.md) — fixed routes, the `realm.json` basics, publishing, public asset paths.
- [`app-card-home-with-search`](../app-card-home-with-search/README.md) — the index page that lists the cards, and the anchor overlay that makes its tiles navigate in Host mode.
- `boxel-environment/references/questions-about-boxel.md` — how the user publishes, and what a published site is.
