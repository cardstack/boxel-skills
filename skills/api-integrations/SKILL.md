---
name: api-integrations
description: 'Use when a card needs data from, or sends data to, a third-party API — "show my GitHub pull requests in a card", "pull my open issues", "a card that calls the weather API with my key", "integrate with Stripe/Twilio/OpenAI", "how often can this card poll", "build a PR inbox". Takes a card author from "I want data from this vendor" to a working card: classifying the integration (no key, a key the workspace shares, the user''s own key, a key that can write), choosing a live card or a scheduled pipeline, declaring the `callApi` operations with labels and credential slots, estimating polling cost, and recipes for GitHub (GraphQL, a GitHub App or a read-only fine-grained token) and for a plain API key sent in a header. Activates on "third-party API", "vendor API", "integration", "pipeline", "poll", "GitHub API", "GraphQL", `callApi`, `{{userKey}}`, `{{apiKey}}`.'
boxel:
  kind: skill
---

# Integrating a third-party API

A card never holds or sends a key itself. It declares each request as a
**`callApi` operation**: data the realm server builds and sends, with any key
filled in by the realm server from an approval the key's owner gave in Boxel's
secure window. This skill decides the shape of an integration; the operation
grammar is in [`card-operations-authoring`](../card-operations-authoring/SKILL.md)
§2, and getting the key from the user is in [`api-keys`](../api-keys/SKILL.md).

## 1. Classify the integration

Ask what the vendor needs before writing anything.

| The API takes                                   | Declare                                                                 | Who sets it up                                                                                     |
| ----------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **No key** (a public endpoint)                  | A `callApi` with no slot. Works from a card at once                     | Nobody                                                                                             |
| **A key the workspace shares** (one account for everyone, a team's API key) | A `{{apiKey}}` slot (`{{apiKey:name}}` when one request needs two)       | A direct writer of the workspace shares one of their keys into it and approves the card's requests |
| **The user's own key** (each person's data)     | A `{{userKey}}` slot                                                    | Each user approves the card's requests with their own key                                          |
| **A key that can write** (post, delete, pay)    | As above, but say so in the `label` and keep these operations few       | As above; ask the user to give the key the fewest permissions the card needs                       |

Prefer a key the vendor lets the user scope down (read-only, one
repository, one project). The window shows every request exactly as it will
be sent, but the vendor decides what a key can do.

## 2. Live card or pipeline

A request carrying a slot is sent **only by a pipeline** the realm server
runs. Approvals are for pipelines only, so the same operation invoked from a
card, the AI assistant or the CLI is refused `interactive-use-not-approved`
and nothing is sent.

**Nothing a card author writes schedules a pipeline.** No card, field,
`realm.json` setting or operation declares one, and no operation turns a
`callApi`'s answer into cards on its own. So a keyed integration a card author
builds today is its declarations and its card: the user can approve the
requests in the secure window, and the card renders fields that only a
pipeline the platform runs would fill. Say so to the user rather than promising
data, and never work around it by invoking the slotted operation from the
card.

- **No key → live card.** The card invokes the operation from an action (a
  click, opening a panel) and renders the answer. Never invoke one during a
  render: that is refused `not-during-render`.
- **A key → pipeline shape.** A pipeline invokes the slotted operation as
  whoever approved it and writes what it learned into cards: one card per pull
  request, say. The card a person opens renders those cards and their fields,
  so it shows the same data in the app, in a search result and in prerendered
  HTML, and its own code never reaches the key. Shape the card this way even
  though nothing in the realm runs the pipeline.

The reason for the split is session exposure: card code runs in the app page
with the viewer's session, so a key a card could send interactively is a key
any card the viewer opens could send. Per-workspace sandboxing of card code
would close that. Without it, private data comes only through a pipeline.

## 3. Declare the `callApi` operations

```ts
import {
  bxl,
  instance,
  operation,
  type OperationDeclaration,
} from '@cardstack/base/operations';

@operation static listPRs = {
  base: 'callApi',
  label: 'List your open pull requests',
  url: 'https://api.github.com/graphql',
  headers: { authorization: 'Bearer {{userKey}}' },
  graphql: {
    document:
      'query($login: String!) { user(login: $login) { pullRequests(states: OPEN, first: 50) { nodes { title url updatedAt } } } }',
    variables: { login: instance('login') },
  },
  output: bxl`{status: .status, pullRequests: .body.data.user.pullRequests.nodes}`,
} satisfies OperationDeclaration;
```

- **A `label` on every operation**, written as what the user agrees to or is
  about to do: "List your open pull requests", not "listPRs". It is shown
  beside the request in the approval, never instead of it, and changing it
  asks nobody to approve again.
- **Unnamed slots** (`{{userKey}}`, `{{apiKey}}`) unless one request carries two
  credentials; then name them (`{{apiKey:token}}`, `{{apiKey:secret}}`).
- **`perInstance: true`** when each card needs its own key (one webhook URL per
  channel card); each card is approved on its own. Its approval is reached by
  opening the window with the card (`cardId`), never the type, and
  `keyReadiness` asked about it on the type answers `undefined`.
- **Put the key in a header.** Never in a body field the vendor stores (a
  comment, a description), and avoid the query string, which vendors log.
- **GraphQL takes variables.** A fixed `document`, every value passed in
  `variables`; never build a query string from values.
- **One operation per request the card makes.** Never a passthrough that takes
  a URL, a path or a body from the caller: the approval shows what is sent, and
  a passthrough would show nothing.
- **Put the fixed part of the path first.** The request's destination is its
  URL up to the first `{name}` segment, or up to the path's last `/` when it
  has none; a key is granted for that destination. So
  `https://api.github.com/repos/{owner}/{repo}/issues` grants
  `api.github.com/repos/`, while `https://api.github.com/graphql` and
  `https://storage.example.com/{bucket}/…` grant the whole host, and the
  window says any request to that host can be sent with the key.

**All of a card's operations are approved together.** When a card asks for
one, the secure window shows every operation on the card that needs approving,
grouped by where it sends, with one key choice and one confirmation. Editing
one operation's request later asks the user about that one again; editing its
`label` or `output` asks nothing.

## 4. Getting the key: what the card shows

Follow [`api-keys`](../api-keys/SKILL.md) → *Asking first: `keyReadiness`*. In
short:

- Ask `@context.keyReadiness(operation, target)` for the one operation the
  card is about to need, and treat `undefined` as "not known yet": render
  nothing for it, so prerendered HTML never shows a button.
- One button per answer the window fixes: **Connect** (`needs-connect`) and
  **Allow** (`needs-approval`) open the window in `approve` mode, **Review
  changes** (`needs-reapproval`) in `review-changes` mode, each for that one
  operation. The window gathers the rest; never loop over operations.
- `needs-admin`: "An administrator of this workspace needs to set this up".
  `needs-sign-in`: a sign-in prompt. `credential-rejected`: the service
  rejected the key, with Try again.
- Don't wait for a message from the window. Readiness is asked again when the
  user comes back to the app.

**In a pipeline-shaped card, readiness can't tell whether the pipeline is
set up.** It answers for a call from the card, per viewer:

- A `{{userKey}}` slot reads `needs-connect` or `needs-approval` for every
  viewer, including the one who approved it.
- An `{{apiKey}}` slot reads `needs-admin` for everyone but the share's owner,
  even once it is approved, and reads `needs-admin` to the owner too until the
  first approval.

So don't gate the card's data on readiness. Render the fields the pipeline
writes whenever they hold something. Offer setup as a plain action that is
always there: **Set up** opens the window in `approve` mode for one
operation. When nothing needs approving, the window says so. A share's owner
can also approve its requests from their key page (**Use with a card…**).

## 5. Polling cost

Estimate calls per day before choosing a schedule:
`viewers × runs per day × operations per run`. Every call counts against the
key owner's vendor rate limit, and for a shared key against everyone's.

- **Batch.** One GraphQL query for everything the card shows beats one REST
  call per item.
- **A pipeline polls once for everyone** who reads its cards; a live card polls
  once per viewer. Prefer the pipeline for anything a team looks at.
- In a live card, fetch only in the `isolated` view, never in `embedded` or
  `fitted` (a search result lists dozens), and pause while the tab is hidden
  (`document.visibilityState`).
- On `credential-rejected`, stop polling until the user acts; on a vendor's
  own rate-limit answer (a 429 or a `retry-after` header in the response), wait
  before calling again.

## 6. Recipes

### GitHub

- **Authenticate with a GitHub App or a fine-grained token**, read-only, for
  the repositories the card reads. A classic token or an OAuth App's `repo`
  scope can also write to every private repository. Where Boxel offers its own
  read-only GitHub App, prefer connecting through it (`connect` mode in
  [`api-keys`](../api-keys/SKILL.md) → *OAuth connections*); otherwise the
  user pastes a fine-grained token as a key.
- **Use GraphQL** (`https://api.github.com/graphql`): one request returns
  pull requests, reviews and comments together. Its destination is the whole
  host, `api.github.com/`, so one approval of the card and one grant cover
  every GraphQL operation on it.
- The key goes in `authorization: 'Bearer {{userKey}}'`.

The PR Inbox, in the pipeline shape: a pipeline would run the operations below
for the user who approved them and write one `PullRequest` card per result;
the inbox card lists those and always offers **Set up**. Nothing in the realm
runs that pipeline, so the list stays empty until the platform does.

```ts
import { CardDef, contains, field, linksToMany } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import {
  bxl,
  instance,
  operation,
  type OperationDeclaration,
} from '@cardstack/base/operations';

export class PullRequest extends CardDef {
  static displayName = 'Pull Request';
  @field title = contains(StringField);
  @field url = contains(StringField);
  @field updatedAt = contains(StringField);
}

const GITHUB = 'https://api.github.com/graphql';
const AUTH = { authorization: 'Bearer {{userKey}}' };

export class PRInbox extends CardDef {
  static displayName = 'PR Inbox';
  @field login = contains(StringField);
  // Written by the pipeline, read by everyone who opens the inbox.
  @field pullRequests = linksToMany(PullRequest);

  @operation static listPRs = {
    base: 'callApi',
    label: 'List your open pull requests',
    url: GITHUB,
    headers: AUTH,
    graphql: {
      document:
        'query($login: String!) { user(login: $login) { pullRequests(states: OPEN, first: 50) { nodes { title url updatedAt } } } }',
      variables: { login: instance('login') },
    },
    output: bxl`{status: .status, nodes: .body.data.user.pullRequests.nodes}`,
  } satisfies OperationDeclaration;

  @operation static listReviewRequests = {
    base: 'callApi',
    label: 'List pull requests waiting for your review',
    url: GITHUB,
    headers: AUTH,
    graphql: {
      document:
        'query($q: String!) { search(type: ISSUE, query: $q, first: 50) { nodes { ... on PullRequest { title url updatedAt } } } }',
      variables: { q: 'is:pr is:open review-requested:@me' },
    },
    output: bxl`{status: .status, nodes: .body.data.search.nodes}`,
  } satisfies OperationDeclaration;
}
```

The inbox's isolated view renders `pullRequests` and, beside them, the
**Set up** button from §4 for `listPRs`; the window approves
`listReviewRequests` in the same confirmation.

### A plain API key in a header

For a vendor that issues one API key per account:

```ts
@operation static current = {
  base: 'callApi',
  label: 'Read the current weather for this city',
  url: 'https://api.weather.example/v1/current',
  query: { city: instance('city') },
  headers: { 'x-api-key': '{{userKey}}' },
  output: bxl`{status: .status, temperature: .body.temperature}`,
} satisfies OperationDeclaration;
```

Use `{{apiKey}}` instead when the workspace pays for one account everyone
shares, and `authorization: 'Basic {{userKey|basic}}'` for a vendor that takes
the key as HTTP Basic credentials.

## 7. Testing locally

A local Boxel stack sends `http:` requests only to local hosts, so point the
operation's `url` at a local stub while developing, approve it in the secure
window at `https://localhost:4208/secure`, and switch the URL to the vendor's
before sharing the card. Changing the URL changes the request, so the
operation is approved again. A call from the card is refused whatever is
approved, so what can be checked locally is the approval: the window's batch,
the grant it creates, and the refusal codes the card handles.

## 8. From the terminal

`boxel lint` (and `boxel file lint`) checks every `callApi` declaration the
way indexing does, so a declaration mistake shows before the module is
indexed rather than as `invalid-operation` on the first call. Each problem
is reported with the code lowering gives it (`slot-out-of-place`,
`unencoded-path-parameter`, `undeclared-param`, and the rest in
`card-operations-authoring`). It also warns on an operation without a
`label` and on a URL that isn't `https:` (a local stub's, while
developing).

The user approves and checks the operations from the CLI too. For the PR
inbox in §6, defined in `pr-inbox.gts` in the workspace (`--operation` takes
the module relative to `--realm`, or its full URL):

```bash
# Approve every operation on the card that needs it, with one of your keys.
# Every request is printed first, then one confirmation approves them.
boxel keys approve "Work GitHub token" --operation pr-inbox#PRInbox --realm <workspace-url>
# Or just one of them.
boxel keys approve "Work GitHub token" --operation pr-inbox#PRInbox.listPRs --realm <workspace-url>

boxel keys pending      # approvals that won't send as approved
boxel keys revoke "Work GitHub token" --operation pr-inbox#PRInbox.listPRs --realm <workspace-url>
boxel keys ungrant "Work GitHub token" --destination https://api.github.com/

# Invoke an operation on a card, or on a type as <module URL>#<Class>.
boxel operations invoke <card-url> <operation> --params '<its params, as JSON>'
```

- **A `{{userKey}}` slot takes one of your keys by its name; an `{{apiKey}}`
  slot takes your share in the workspace by its label**, so for an operation
  written with `{{apiKey}}` the first argument is the label the workspace
  knows the share by. `--slot` picks one slot when an operation has several.
- **One confirmation approves up to a batch's worth.** A card with very many
  operations says how many are left, and running it again approves the rest.
- **A key's first send to a host is confirmed in the secure window.** When
  approving would send a key somewhere it has never been sent, the CLI opens
  the window's approval for that batch and finishes when the window does, so
  it needs someone at the browser and can't run in a script, `--yes` or not.
  An approval that only reuses where the key already goes finishes in the
  terminal. `boxel keys swap` works the same way. Run without a terminal,
  any approval needs `--yes`. The window approves every slot of an
  operation, so `--slot` works only where the key already goes.
- **`pending`** lists the approvals that need approving again: one whose
  request changed since it was approved (even before any call has found it),
  and one whose operation can't be read now. `revoke` and `ungrant` take
  approvals away entirely, so those aren't listed: approve again to put
  them back.
- **The CLI invokes interactively**, as a card or the assistant does, so
  `boxel operations invoke` sends a keyless operation and answers with what
  the vendor answered, while one that sends a key, such as `listPRs`, is
  refused `interactive-use-not-approved`: approvals are for pipelines.
  `--interactive` on `approve` is refused for the same reason. A type is
  named by its module's full URL here, not one relative to a workspace.
- `ungrant` lists the approvals removing the grant would revoke before it
  asks.
