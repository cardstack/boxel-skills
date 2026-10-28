---
name: api-keys
description: 'Use when a card or the AI assistant needs a user''s API key, or a key shared into a workspace — "this card needs my GitHub token", "the forecast operation was refused binding-not-approved", "the service rejected my key", "let the user add their key", "share my key with this workspace", "add a key button". Covers getting a key from the user only through Boxel''s secure window, with the open-secure-window tool: opening it from a card through `@context.toolContext` or from the assistant, the three modes (enter a key, replace the key an operation sends, share a key), what the tool answers, the blocked-popup fallback, what to do when the service rejects a key (stop polling, offer Reconnect, which opens the window to replace the key), telling the user to check the address bar, and never asking for a credential in the chat or building a form for one. Activates on `open-secure-window`, `OpenSecureWindowTool`, "secure window", "API key", "enter a key", "replace a key", "Reconnect", "share a key", `{{userKey}}`, `{{apiKey}}`, `binding-not-approved`, `credential-rejected`.'
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
| `mode`      | `enter-key` (add a key), `replace-key` (replace the key an operation sends) or `share-key` (share one of the user's keys into a workspace). Required |
| `cardId`    | `enter-key`, `replace-key`: the card instance whose operation needs the key, as a URL or prefix-form id                                  |
| `module`, `name`, `realm` | `enter-key`, `replace-key`, for an operation on a card **type** instead of an instance: the type's module, its export name, and the workspace it is used in |
| `operation` | `enter-key`, `replace-key`: the name of the operation that needs the key. Needs `cardId`, or `module` + `name` + `realm`. Required for `replace-key` |
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
- To replace the key an operation sends, pass `mode: 'replace-key'` with the
  same `cardId` and `operation` (see the last section).

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
a workspace. Neither fills an operation's credential slot: an operation that
carries one (`{{userKey}}`, `{{apiKey}}`) is refused `binding-not-approved`
whatever keys the user has, and nothing is sent. So once the user has entered
the key, tell them it is saved and that the card can't call the service with
it, rather than retrying or reopening the window. See
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2 for
slotted operations.

From a terminal, `boxel keys` adds and shares keys too (same section).

## When the service rejects the key

An operation refused **`credential-rejected`** (424, "Credential rejected")
sends a key the service rejected: it answered 401 at the address the key is
sent to. The call that got the 401 did reach the service. From then on the
realm server holds that key back from that address, and refuses calls with
it there without sending them, except for **one call every 15 minutes or
so**, which it lets through as a retry. A retry the service accepts brings the
key back, and so does its owner replacing the key. The owner is told once,
and for a key shared into a workspace, so are the workspace's writers. The
refusal's message names the credential slot and the address.

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

- **The key is replaced in Boxel's secure window, from a Reconnect button.**
  Replacing the key is what clears the rejection, so show **Reconnect** beside
  Try again, and have it open the window with `mode: 'replace-key'`, naming the
  card and the operation as `enter-key` does. The card never names a key: the
  window finds the key from the user's approval of that operation and offers
  to replace it. When the slot is filled by a key someone else shared into the
  workspace, the window tells the user who can replace it instead. Don't open
  `enter-key` for this refusal: it adds a **new** key and leaves the rejected
  one in place. From a terminal, `boxel keys replace <name>` replaces it too.

  ```gts
  reconnect = async () => {
    let toolContext = this.args.context?.toolContext;
    if (!toolContext || !this.args.model.id) {
      return;
    }
    await new OpenSecureWindowTool(toolContext).execute({
      mode: 'replace-key',
      cardId: this.args.model.id,
      operation: 'forecast',
      reason: 'The forecast service rejected your key',
    });
  };
  ```

  ```gts
  {{#if this.rejected}}
    <p>The forecast service rejected your key.</p>
    <button type='button' {{on 'click' this.reconnect}}>Reconnect</button>
    <button type='button' {{on 'click' this.tryAgain}}>Try again</button>
  {{/if}}
  ```

  As for `enter-key`, the tool says only whether the window opened. The card
  learns the key works again the next time a call succeeds, so Try again after
  the window closes is the way to check.
- **In the AI assistant**, on an operation refused "Credential rejected", call
  `open-secure-window` once with `mode: 'replace-key'`, the card and the
  operation. In the same reply, tell the user which service rejected the key
  (the message names it) and that they replace it in the window that opens.
  Never ask for the key in the chat.
- A **403** from the service is not this refusal. It arrives as the
  operation's answer (`status: 403`), because a service also uses 403 for a
  missing permission on one resource or for a rate limit. Read the body.
