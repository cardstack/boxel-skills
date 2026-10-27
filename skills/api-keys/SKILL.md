---
name: api-keys
description: 'Use when a card or the AI assistant needs a user''s API key, or a key shared into a workspace — "this card needs my GitHub token", "the forecast operation was refused binding-not-approved", "let the user add their key", "share my key with this workspace", "add a key button". Covers getting a key from the user only through Boxel''s secure window, with the open-secure-window tool: opening it from a card through `@context.toolContext` or from the assistant, the two modes (enter a key, share a key), what the tool answers, the blocked-popup fallback, telling the user to check the address bar, and never asking for a credential in the chat or building a form for one. Activates on `open-secure-window`, `OpenSecureWindowTool`, "secure window", "API key", "enter a key", "share a key", `{{userKey}}`, `{{apiKey}}`, `binding-not-approved`.'
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

It never says whether the user entered or shared a key. To learn that, ask
again later (try the operation again), never in a loop that reopens the
window.

The tool refuses on a Boxel deployment that doesn't sign users in on the
secure origin, where the window would have no session. Say so to the user
rather than retrying.

## From a card

Give the user a button; on click, run the tool with the card's own
`toolContext`. A click is a user gesture, so the popup is usually let through.

```gts
import { on } from '@ember/modifier';
import { CardDef, Component, contains, field } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import OpenSecureWindowTool from '@cardstack/boxel-host/tools/open-secure-window';

export class WeatherStation extends CardDef {
  static displayName = 'Weather Station';
  @field city = contains(StringField);

  static isolated = class Isolated extends Component<typeof this> {
    addKey = async () => {
      let toolContext = this.args.context?.toolContext;
      if (!toolContext) {
        return; // not in the app (prerender, a published page)
      }
      await new OpenSecureWindowTool(toolContext).execute({
        mode: 'enter-key',
        cardId: this.args.model.id,
        operation: 'forecast',
        reason: 'Weather Station needs your forecast service key',
      });
    };

    <template>
      <button type='button' {{on 'click' this.addKey}}>
        Add your forecast service key
      </button>
    </template>
  };
}
```

- Name the card and the operation, not the service's URL: the window shows the
  destination from the operation's declaration on the server.
- Don't render your own "blocked" message: the app already shows the fallback
  button.
- Don't read anything back from the window. There is no value to read, and the
  window has no handle back to the page.
- To share a key into a workspace, pass `mode: 'share-key'` and `realm`.

## In the AI assistant

The tool is declared in this skill and in the index, so it is callable from
the first step.

- **The moment you learn a key is missing, call it.** The usual signal is an
  operation refused with `binding-not-approved`, or a card that says it needs
  a key. Use `enter-key` with the card and operation, or `share-key` with the
  workspace. Call it once per missing key; don't reopen it in a loop.
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

## What happens after the key is entered

Entering a key stores it for the user; sharing one puts a reference to it into
a workspace. Neither lets an operation send it yet: an operation that carries
a credential slot (`{{userKey}}`, `{{apiKey}}`) is still refused
`binding-not-approved` until the user approves it for that operation. Until
then, tell the user the key is saved and the card can't call the service with
it yet, rather than retrying. See
[`card-operations-authoring`](../card-operations-authoring/SKILL.md) §2 for
slotted operations.

From a terminal, `boxel keys` adds and shares keys too (same section).
