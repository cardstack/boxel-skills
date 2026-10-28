---
name: api-keys
description: 'Use when a card or the AI assistant needs a user''s API key, or a key shared into a workspace — "this card needs my GitHub token", "the forecast operation was refused binding-not-approved", "let the user add their key", "share my key with this workspace", "add a key button". Covers getting a key from the user only through Boxel''s secure window, with the open-secure-window tool: opening it from a card through `@context.toolContext` or from the assistant, the two modes (enter a key, share a key), what the tool answers, the blocked-popup fallback, telling the user to check the address bar, and never asking for a credential in the chat or building a form for one. Also covers asking first with `@context.keyReadiness` — the answers (`ready`, `needs-connect`, `needs-approval`, `needs-reapproval`, `needs-admin`, `needs-sign-in`), what a card shows for each and what the secure window can fix, and treating `undefined` as "not known yet" so prerendered HTML never shows Connect. Activates on `open-secure-window`, `OpenSecureWindowTool`, `keyReadiness`, "secure window", "API key", "enter a key", "share a key", `{{userKey}}`, `{{apiKey}}`, `binding-not-approved`.'
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/open-secure-window'
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

| Field       | Holds                                                                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`      | `enter-key` (add a key) or `share-key` (share one of the user's keys into a workspace). Required                                         |
| `cardId`    | `enter-key`: the card instance whose operation needs the key, as a URL or prefix-form id                                                 |
| `module`, `name`, `realm` | `enter-key`, for an operation on a card **type** instead of an instance: the type's module, its export name, and the workspace it is used in |
| `operation` | `enter-key`: the name of the operation that needs the key. Needs `cardId`, or `module` + `name` + `realm`                                 |
| `realm`     | `share-key`: the workspace the key is shared into. Required                                                                              |
| `reason`    | One short line the window shows, labelled as written by whoever opened it ("Weather Station needs your forecast service key")            |

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

## Asking first: `keyReadiness`

A card shouldn't render a control that is only going to be refused. Before
it calls an operation that carries a credential slot, it asks
**`@context.keyReadiness(operation, target)`** whether the call would have
its key, and shows what would fix it if not. `target` is the card (or its
URL), or a card class with `{ realm }` for an operation on a type, as for
`@context.canInvoke`. It is asked on the same request as `canInvoke` and
answers the same way: synchronously, from what the app already knows, and
re-rendering when the answer lands.

| Answer             | Means                                                                                                          | The card shows                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ready`            | The call will have its key                                                                                     | The data; call the operation                                                                         |
| `needs-connect`    | None of the user's keys may be sent where the operation sends                                                  | A button that opens the secure window (`enter-key`), saying the operation needs approving before the card can use the key |
| `needs-approval`   | The user has a key that could be sent there, but the operation isn't approved here, or not for use from a card | A message that the operation needs approving, no button                                              |
| `needs-reapproval` | What the operation sends changed since it was approved                                                         | A message that the operation changed and needs approving again, no button                            |
| `needs-admin`      | A key the workspace provides isn't set up for this, and the user can't set it up                               | "An administrator of this workspace needs to set this up", no button                                 |
| `needs-sign-in`    | Nobody is signed in, and the key the operation needs isn't available to signed-out visitors                    | Sign in                                                                                              |
| `undefined`        | **Not known yet**                                                                                              | Nothing                                                                                              |

**What the secure window can fix.** It adds and shares keys. It doesn't
approve an operation, and a key may be sent somewhere only once an operation
sending there is approved. So entering a key there leaves `needs-connect` as
it was, and `needs-approval` and `needs-reapproval` have no page in the window
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
workspace's key, its name or its budget. A limit, a used-up budget or a key
the service rejected is not a readiness answer: the call's own refusal carries
it (`rate-limited`, `over-budget`, `credential-rejected`).

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
  `enter-key` with the card and operation, or `share-key` with the workspace.
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

From a terminal, `boxel keys` adds and shares keys too (same section).
