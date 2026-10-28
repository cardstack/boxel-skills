---
name: api-keys
description: 'Use when a card or the AI assistant needs a user''s API key, or a key shared into a workspace — "this card needs my GitHub token", "the forecast operation was refused binding-not-approved", "let the user add their key", "share my key with this workspace", "add a key button". Also "sign in to GitHub from this card", "connect my account", "the operation was refused credential-rejected", "should I register a GitHub App or an OAuth App". Covers getting a key from the user only through Boxel''s secure window, with the open-secure-window tool: opening it from a card through `@context.toolContext` or from the assistant, the three modes (enter a key, share a key, connect an account through OAuth), what the tool answers, the blocked-popup fallback, telling the user to check the address bar, OAuth clients and connections (when to use a connection rather than a static key, what the card declares, opening connect mode, `credential-rejected` and its reasons, sharing a client into a workspace, and why GitHub takes a GitHub App), and never asking for a credential in the chat or building a form for one. Activates on `open-secure-window`, `OpenSecureWindowTool`, "secure window", "API key", "enter a key", "share a key", "OAuth", "connect", "Reconnect", "GitHub App", `{{userKey}}`, `{{apiKey}}`, `binding-not-approved`, `credential-rejected`.'
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
a workspace. Neither fills an operation's credential slot: an operation that
carries one (`{{userKey}}`, `{{apiKey}}`) is refused `binding-not-approved`
whatever keys the user has, and nothing is sent. So once the user has entered
the key, tell them it is saved and that the card can't call the service with
it, rather than retrying or reopening the window. See
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2 for
slotted operations.

From a terminal, `boxel keys` adds and shares keys too (same section).

## OAuth connections

Many services sign a person in through OAuth instead of handing out a key. Two
kinds of key carry it, and both live in the secure window like any other:

- An **OAuth client** is an app registered with the service: its client id and
  secret, its sign-in and token addresses, the permissions (scopes) it asks
  for and the API hosts it serves. Whoever registered it adds it in the secure
  window (`enter-key`, kind **OAuth app**). Most clients are for people to sign
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

**For GitHub, register a GitHub App, not an OAuth App.** An OAuth App's only
scope that reaches private repositories, `repo`, can also write to them, so
every connection through it could. A GitHub App can be limited to read-only
permissions. Where it is deployed, Boxel offers its own read-only GitHub App,
so a card that only reads from GitHub needs no client of the workspace's.

Token endpoints are the realm server's alone: no `callApi` can send a
credential to one, so a card never refreshes or exchanges a token itself.
