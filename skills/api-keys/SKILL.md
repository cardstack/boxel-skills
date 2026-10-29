---
name: api-keys
description: 'Use when a card or the AI assistant needs a user''s API key, or a key shared into a workspace — "this card needs my GitHub token", "the forecast operation was refused binding-not-approved", "let the user add their key", "share my key with this workspace", "add a key button". Also "sign in to GitHub from this card", "connect my account", "the operation was refused credential-rejected", "the service rejected my key", "should I register a GitHub App or an OAuth App". Covers getting a key from the user only through Boxel''s secure window, with the open-secure-window tool: opening it from a card through `@context.toolContext` or from the assistant, the three modes (enter a key, share a key, connect an account through OAuth), what the tool answers, the blocked-popup fallback, telling the user to check the address bar, what to do when the service rejects a key (stop polling, offer Try again, replace the key), OAuth clients and connections (when to use a connection rather than a static key, what the card declares, opening connect mode, `credential-rejected` and its reasons, sharing a client into a workspace, and why GitHub takes a GitHub App), and never asking for a credential in the chat or building a form for one. Also covers asking first with `@context.keyReadiness` — the answers (`ready`, `needs-connect`, `needs-approval`, `needs-reapproval`, `needs-admin`, `needs-sign-in`), what a card shows for each and what the secure window can fix, and treating `undefined` as "not known yet" so prerendered HTML never shows Connect. Activates on `open-secure-window`, `OpenSecureWindowTool`, `keyReadiness`, "secure window", "API key", "enter a key", "share a key", "OAuth", "connect", "Reconnect", "GitHub App", `{{userKey}}`, `{{apiKey}}`, `binding-not-approved`, `credential-rejected`.'
boxel:
  kind: skill
  tools:
    - codeRef:
        module: "@cardstack/boxel-host/tools/open-secure-window"
        name: default
---

# Getting a key from the user

A user's API key is typed in exactly one place: **Boxel's secure window**, a
popup whose address bar shows Boxel's secure address (`secure.boxel.ai` in
production). Never in the app page, a card, a field, a form, a file or the
chat. Card code runs in the app page and can read everything there, so a key
typed anywhere else is exposed to every card the user opens. A card can draw
a look-alike form; it can't forge another window's address bar.

So there is one way to start key entry, used by cards, the app and the AI
assistant alike: the **`open-secure-window`** host tool. It opens the window
on the right page, says what the key is for, and gives nothing back but
whether the window opened. The window signs in on its own, stores the key
sealed on the realm server, and closes when the user is done.

## The tool

`@cardstack/boxel-host/tools/open-secure-window` (default export,
`OpenSecureWindowTool`). Its input:

| Field                     | Holds                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                    | `enter-key` (add a key), `share-key` (share one of the user's keys into a workspace) or `connect` (sign in at a service through OAuth, see [below](#oauth-connections)). Required |
| `cardId`                  | `enter-key`, `connect`: the card instance whose operation needs the key, as a URL or prefix-form id                                                                               |
| `module`, `name`, `realm` | `enter-key`, `connect`, for an operation on a card **type** instead of an instance: the type's module, its export name, and the workspace it is used in                           |
| `operation`               | `enter-key`, `connect`: the name of the operation that needs the key. Needs `cardId`, or `module` + `name` + `realm`                                                              |
| `realm`                   | `share-key`: the workspace the key is shared into. Required. `connect`, on its own: offers the clients shared into that workspace                                                 |
| `reason`                  | One short line the window shows, labelled as written by whoever opened it ("Weather Station needs your forecast service key")                                                     |

Every field **names** something; none carries a value. Never pass a key, a
token, a destination URL or anything secret. The window asks the realm server
what each name refers to and shows that, so a card can't make the window say
something the server doesn't.

It answers `status`:

- **`opened`** — the window is open.
- **`blocked`** — the browser's popup blocker stopped it. The app shows the
  user a small dialog with an **Open the secure window** button, which opens
  the same window on their click, and names the address to check. Nothing else
  for the caller to do.

It never says whether the user entered or shared a key, and nothing the app
can call does: the window has no handle back to the page, and a stored key
doesn't by itself change how the card's operation answers (see the last
section). Open the window once for what it is needed for; never reopen it in a
loop.

The tool refuses on a Boxel deployment that doesn't sign users in on the
secure origin, where the window would have no session. Say so to the user
rather than retrying.

## From a card

Give the user a button; on click, run the tool with the card's own
`toolContext`. A click is a user gesture, so the popup is usually let through.

```gts
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { CardDef, Component, contains, field } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import OpenSecureWindowTool from '@cardstack/boxel-host/tools/open-secure-window';

export class WeatherStation extends CardDef {
  static displayName = 'Weather Station';
  @field city = contains(StringField);

  static isolated = class Isolated extends Component<typeof this> {
    @tracked problem: string | undefined;

    addKey = async () => {
      let toolContext = this.args.context?.toolContext;
      if (!toolContext || !this.args.model.id) {
        return; // not in the app (prerender, a published page), or not saved
      }
      this.problem = undefined;
      try {
        await new OpenSecureWindowTool(toolContext).execute({
          mode: 'enter-key',
          cardId: this.args.model.id,
          operation: 'forecast',
          reason: 'Weather Station needs your forecast service key',
        });
      } catch (e) {
        // e.g. a Boxel deployment that offers no secure window
        this.problem = e instanceof Error ? e.message : String(e);
      }
    };

    <template>
      <button type='button' {{on 'click' this.addKey}}>
        Add your forecast service key
      </button>
      {{#if this.problem}}<p role='alert'>{{this.problem}}</p>{{/if}}
    </template>
  };
}
```

- `execute` throws when the window can't be opened for what it was given (a
  deployment with no secure window, a card that isn't saved yet); show the
  message rather than leaving the click silent.
- Name the card and the operation, not the service's URL: the window shows the
  destination from the operation's declaration on the server.
- Don't render your own "blocked" message: the app already shows the fallback
  button.
- Don't read anything back from the window. There is no value to read, and the
  window has no handle back to the page.
- To share a key into a workspace, pass `mode: 'share-key'` and `realm`.
- To have the user sign in at the service instead of pasting a key, pass
  `mode: 'connect'` with the same card and operation (see
  [OAuth connections](#oauth-connections)).

## Asking first: `keyReadiness`

A card shouldn't render a control that is only going to be refused. Before
it calls an operation that carries a credential slot, it asks
**`@context.keyReadiness(operation, target)`** whether the call would have
its key, and shows what would fix it if not. `target` is the card (or its
URL), or a card class with `{ realm }` for an operation on a type, as for
`@context.canInvoke`. It is asked on the same request as `canInvoke` and
answers the same way: synchronously, from what the app already knows, and
re-rendering when the answer lands.

| Answer                | Means                                                                                                          | The card shows                                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`               | The call will have its key                                                                                     | The data; call the operation                                                                                                                                               |
| `needs-connect`       | None of the user's keys may be sent where the operation sends                                                  | A button that opens the secure window (`enter-key`, or `connect` for a service the user signs in to), saying the operation needs approving before the card can use the key |
| `needs-approval`      | The user has a key that could be sent there, but the operation isn't approved here, or not for use from a card | A message that the operation needs approving, no button                                                                                                                    |
| `needs-reapproval`    | What the operation sends changed since it was approved                                                         | A message that the operation changed and needs approving again, no button                                                                                                  |
| `needs-admin`         | A key the workspace provides isn't set up for this, and the user can't set it up                               | "An administrator of this workspace needs to set this up", no button                                                                                                       |
| `needs-sign-in`       | Nobody is signed in, and the key the operation needs isn't available to signed-out visitors                    | Sign in                                                                                                                                                                    |
| `credential-rejected` | The service rejected the key, and the realm server is holding it back until its next retry                     | That the service rejected the key, with Try again; no secure-window button                                                                                                 |
| `undefined`           | **Not known yet**                                                                                              | Nothing                                                                                                                                                                    |

**What the secure window can fix.** It adds and shares keys and connects
accounts. It doesn't
approve an operation, and a key may be sent somewhere only once an operation
sending there is approved. So entering a key or connecting an account there leaves
`needs-connect` as it was, and `needs-approval` and `needs-reapproval` have no page in the window
to send the user to. That is why those rows show a message, and why the
Connect button says the card can't use the key yet. Never open the window
again on the same answer.

**`undefined` is never "not ready".** It is the answer while the realm is
being asked, where nothing can answer (a caller who may not invoke the
operation at all, a realm that sends no outside requests), and **always in
prerendered HTML**. Prerendered HTML is rendered once and served to every
viewer, so a Connect button in it would be shown to people who are already
connected. Branch on the named answers and render nothing for `undefined`.

An operation that carries no credential slot is `ready`. The answer names
what to show, never whose key fills a slot: a reader is never told who owns a
workspace's key, its name or its budget. A limit or a used-up budget is not a
readiness answer: the call's own refusal carries it (`rate-limited`,
`over-budget`). A key the service rejected reads `credential-rejected` while
the realm server is holding it back; show what
[When the service rejects the key](#when-the-service-rejects-the-key) shows.

```gts
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { eq } from '@cardstack/boxel-ui/helpers';
import { CardDef, Component, contains, field } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import OpenSecureWindowTool from '@cardstack/boxel-host/tools/open-secure-window';

export class WeatherStation extends CardDef {
  static displayName = 'Weather Station';
  @field city = contains(StringField);

  static isolated = class Isolated extends Component<typeof this> {
    @tracked problem: string | undefined;

    get readiness() {
      return this.args.context?.keyReadiness?.('forecast', this.args.model);
    }

    addKey = async () => {
      let toolContext = this.args.context?.toolContext;
      if (!toolContext || !this.args.model.id) {
        return;
      }
      this.problem = undefined;
      try {
        await new OpenSecureWindowTool(toolContext).execute({
          mode: 'enter-key',
          cardId: this.args.model.id,
          operation: 'forecast',
          reason: 'Weather Station needs your forecast service key',
        });
      } catch (e) {
        this.problem = e instanceof Error ? e.message : String(e);
      }
    };

    <template>
      {{#if (eq this.readiness 'ready')}}
        {{! render the forecast }}
      {{else if (eq this.readiness 'needs-connect')}}
        <button type='button' {{on 'click' this.addKey}}>
          Add your forecast service key
        </button>
        <p>The forecast needs approving before it can use your key.</p>
      {{else if (eq this.readiness 'needs-approval')}}
        <p>The forecast needs approving before it can use your key.</p>
      {{else if (eq this.readiness 'needs-reapproval')}}
        <p>The forecast changed and needs approving again.</p>
      {{else if (eq this.readiness 'needs-admin')}}
        <p>An administrator of this workspace needs to set this up.</p>
      {{/if}}
      {{#if this.problem}}<p role='alert'>{{this.problem}}</p>{{/if}}
    </template>
  };
}
```

- **The card learns what changed only through readiness.** When the user
  comes back to the app from the secure window, every readiness answer on the
  page is asked again, and the template re-renders with the new one. Don't
  poll it, and don't read anything from the tool's result beyond `opened` /
  `blocked`.
- **Advisory, like `canInvoke`.** The call checks its approval again, so a
  `ready` card still handles a refusal from the call itself.
- Guard on `keyReadiness` being there (`?.`): it is absent where nothing can
  answer.

## In the AI assistant

The tool is declared in this skill and in the index, so it is callable from
the first step.

- **When you learn the user's key is needed, call it once.** The signal is an
  operation refused "Binding not approved" whose message names a credential
  slot "for the invoking user's own key", or a card that says it needs the
  user's key. A slot "for the realm's key" is filled by a key the workspace
  holds, so it is never a reason to open the window. Use
  `enter-key` with the card and operation, `connect` when the card says the
  user signs in at the service, or `share-key` with the workspace.
  Call it once per operation in a conversation. The same refusal comes back
  after the user enters a key (see the last section), so a repeated refusal is
  never a reason to reopen the window.
- **In the same reply, say what you opened and why**: which card needs which
  key, that the user enters it in Boxel's secure window, and that the window's
  address bar should show Boxel's secure address. If the tool answered
  `blocked`, tell them to use the **Open the secure window** button.
- **Never ask for a credential in the chat.** No "paste your API key here", no
  "send me your token". If the user pastes one anyway, don't use or repeat it;
  tell them to enter it in the secure window instead, and to replace the key
  with the service, since it has been exposed.
- **Never build something that collects a key**: no field, form, card or file
  for one, and no suggestion to make one.

## What a stored key does

Entering a key stores it for the user; sharing one puts a reference to it into
a workspace. Neither fills an operation's credential slot (`{{userKey}}`,
`{{apiKey}}`): an approval of the operation in that workspace does, and nothing
approves one for use from a card. So an operation that carries a slot is
refused `binding-not-approved` (or `interactive-use-not-approved`) whatever
keys the user has, and nothing is sent; `@context.keyReadiness` (above) reads
`needs-connect` or `needs-approval` for it. Once the user has entered the key,
tell them it is saved and that the card can't call the service with it,
rather than retrying or reopening the window. See
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2 for
slotted operations.

From a terminal, `boxel keys` adds and shares keys, and connects accounts
through OAuth, too (same section, and [OAuth connections](#oauth-connections)).

## When the service rejects the key

An operation refused **`credential-rejected`** (424, "Credential rejected")
sends a key the service rejected: it answered 401 at the address the key is
sent to. The call that got the 401 did reach the service. From then on the
realm server holds that key back from that address, and refuses calls with
it there without sending them, except for **one call every 15 minutes or
so**, which it lets through as a retry. A retry the service accepts brings the
key back, and so does its owner replacing the key. The owner is told once,
and for a key shared into a workspace, so are the workspace's writers. The
refusal's message names the credential slot and the address. While a call
would be held back, `@context.keyReadiness` reads `credential-rejected` for it,
and `ready` again once the retry is due. This is a stored key's refusal; a
connection's has its own reasons, under [OAuth connections](#oauth-connections).

- **A card stops polling on its own** and says the service rejected the key,
  with a **Try again** button. A timer that keeps calling only collects the
  same refusal. A call the user starts after the interval (a click, or
  opening the card again) is the retry, so a key the service accepts again is
  picked up the next time the card is used. Read the refusal's `code`:

  ```gts
  import { OperationsError } from '@cardstack/base/operations';

  // in the component, around the operation call
  try {
    this.result = await this.load();
    this.rejected = false;
  } catch (err) {
    if (err instanceof OperationsError && err.code === 'credential-rejected') {
      this.rejected = true; // stop the polling loop; show the message
      return;
    }
    throw err;
  }
  ```

  ```gts
  {{#if this.rejected}}
    <p>The forecast service rejected your key.</p>
    <button type='button' {{on 'click' this.tryAgain}}>Try again</button>
  {{/if}}
  ```

- **The key is replaced on its own page in Boxel's secure window**, or with
  `boxel keys replace <name>` from a terminal. That is what clears the
  rejection. `open-secure-window`'s `enter-key` mode adds a **new** key, which
  leaves the rejected one in place, so don't open it for this refusal.
- **In the AI assistant**, on an operation refused "Credential rejected", tell
  the user which service rejected the key (the message names it). Say that
  the key's owner replaces it on the key's page in Boxel's secure window or
  with `boxel keys replace`, and that the card picks it up again on its own
  once the service accepts the key. Don't open the secure window for it, and
  never ask for the key in the chat.
- A **403** from the service is not this refusal. It arrives as the
  operation's answer (`status: 403`), because a service also uses 403 for a
  missing permission on one resource or for a rate limit. Read the body.

## OAuth connections

Many services sign a person in through OAuth instead of handing out a key. Two
kinds of key carry it, and both live in the secure window like any other:

- An **OAuth client** is an app registered with the service: its client id and
  secret, its sign-in and token addresses, the permissions (scopes) it asks
  for and the API hosts it serves. Whoever registered it adds it in the secure
  window (`enter-key`, kind **Sign-in app (OAuth)**). Most clients are for people to sign
  in through; a `client_credentials` client gets tokens for itself, with no
  person signing in.
- An **OAuth connection** is one person's sign-in through a client. It is a
  personal key: it fills a `{{userKey}}` slot as a pasted key does, and its
  owner approves the operations that use it as for any key of theirs. The
  realm server mints a short-lived access token from it, reuses it until it
  is due, and refreshes it; no token reaches the app page, the card or the
  chat.

**A connection or a static key.** Prefer a connection when the service offers
OAuth: the user approves the permissions the client asks for on the service's
own page, can revoke
the sign-in there, and never handles a long-lived token. Use a static key when
the service only issues API keys. The card can't tell which fills its slot and
doesn't need to.

**What a slot looks like** for a connection is no different from a pasted
key: a `{{userKey}}` slot where the service expects its token. Whether to
write a slotted operation at all is governed by
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2 and
[What a stored key does](#what-a-stored-key-does): a slotted operation is
sent only from a scheduled pipeline the realm server runs, never when a card,
the assistant or the CLI invokes it. A connection changes what fills the
slot, not that rule. For a pipeline, the slot reads:

```ts
@operation static profile = {
  base: 'callApi',
  label: 'Read your GitHub profile',
  url: 'https://api.github.com/user',
  headers: {
    accept: 'application/vnd.github+json',
    authorization: 'Bearer {{userKey}}',
  },
  output: bxl`{status: .status, login: .body.login}`,
} satisfies OperationDeclaration;
```

The declaration names no client, client id, scope or token address: the
window picks the client from the operation's destination.

**Opening connect mode.** Use the button from [From a card](#from-a-card) with
`mode: 'connect'` and the same card and operation, and a `reason` such as
"Pull Request Inbox signs in to GitHub to read your pull requests". Open it
when the operation is refused for the user's own key (as above) and the card
signs in rather than taking a pasted key. Connect mode always makes a **new**
connection; signing an existing one in again is its **Reconnect** button on
the user's key page in the secure window, which keeps its approvals. The window lists the clients that serve the operation's
destination — Boxel's own, those shared into the workspace and the user's
own — each with the permissions it asks for. The user picks one and signs in
on the service's page; the service sends them back to the realm server, never
to the app. With no client to offer, the window says who can set one up.

**When a connection stops working**, a pipeline call through it is refused
**`credential-rejected`** (424) and nothing is sent. The refusal's
`meta.reason` says why: `rejected` (the service no longer accepts the sign-in;
its owner reconnects from their key page), `needs-admin` (the client itself
was refused or is gone: its secret was rejected, or its share in the
workspace was removed or suspended; the client's owner or a workspace writer
fixes it) or `unavailable` (the service's token endpoint kept failing; a
later run may succeed). A card or the assistant invoking an operation never
sees this refusal: such a call is refused before any token is minted (see
[What a stored key does](#what-a-stored-key-does)).

**Sharing a client into a workspace.** A workspace writer registers one app
with the service, adds it in the secure window, and shares it into the
workspace with `share-key`, like any key. Connect mode then offers it to
everyone who can read the workspace, and each teammate signs in with their own
account. The client secret is stored once and nobody else sees it; replacing it
reaches every connection made through the client. Boxel also offers clients of
its own wherever they are deployed.

**Registering the app with the service** needs two things from its settings
there: the **callback (redirect) URL**, which is the realm server's
`/_oauth/callback` (for example `https://app.boxel.ai/_oauth/callback`),
since a service refuses a sign-in that returns anywhere it wasn't told; and,
for a GitHub App, an **installation** on the account or organization whose
repositories it reads, since a connection reaches only repositories the app is
installed on.

**From a terminal**, `boxel keys` adds a client, shares it into a workspace
and connects an account through it; registering the app with the service, as
above, comes first. The client secret is typed at a masked prompt in the
user's own terminal (or read from a file they name with `--key-file`), never
given as an argument or passed through the chat, and no command prints a
token. Who runs which command, and the browser sign-in these need, are in
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2:

```bash
# Add the app you registered with the service, then share it in
boxel keys add forge-app --kind oauth-client --client-id <id> \
  --authorize-url https://forge.example/oauth/authorize \
  --token-url https://forge.example/oauth/token \
  --scopes read:user --api-host https://api.forge.example/
boxel keys share forge-app --realm <workspace-url> --as "Forge"

# What you can connect through: Boxel's own, yours, and the workspace's
boxel keys clients --realm <workspace-url>

# Sign in at the service in the browser; the result is your connection
boxel keys connect my-forge --client Forge --realm <workspace-url>
boxel keys connect my-github --client platform:github
```

`--api-host` names the API addresses the client serves, so the secure window
offers it for operations sent there. `connect` names a shared client by its
label with `--realm`, one of your own by its key name, and one of Boxel's as
`platform:<name>`. It opens the service's sign-in page and waits. The service
sends the browser back through the realm server's `/_oauth/callback` to a
page of Boxel's secure window, which asks the user to **Continue in the
terminal** and hands the sign-in back to the CLI; the CLI finishes it with
its own sign-in, so the browser needn't be signed in to Boxel. The command
ends once the connection is saved. Like a connection made in the secure
window, it doesn't by itself let an operation send it (see
[What a stored key does](#what-a-stored-key-does)).

**For GitHub, register a GitHub App, not an OAuth App.** An OAuth App's only
scope that reaches private repositories, `repo`, can also write to them, so
every connection through it could. A GitHub App can be limited to read-only
permissions. Where it is deployed, Boxel offers its own read-only GitHub App,
so a card that only reads from GitHub needs no client of the workspace's.

Token endpoints are the realm server's alone: no `callApi` can send a
credential to one, so a card never refreshes or exchanges a token itself.
