---
name: host-commands-reference
description: Full catalog of Boxel host commands — what each does and its approval rules.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/transform-cards'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/patch-fields'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByQueryCommand
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByTypeAndTitleCommand
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/run-realm-code'
        name: default
---

# Host Commands Reference

Quick lookup of every command available to this skill, what it does, and notable rules.

## Editing

- **`run-realm-code`** — The way to create or edit source files. It runs a script that saves each file as it writes it, and triggers correctness checks after indexing. Use `realm.fs.writeText` for a new file, `realm.fs.replace` for an existing one, and `realm.fs.copy` to duplicate a file in the same realm. `realm.fs.delete` deletes a file, such as a file written by mistake; a run that contains it waits for the user to approve it.
- `patch-fields_3e67` — Field updates on an indexed card the user is looking at (requires approval). Not for repairing a file you just wrote or one that failed a check: that card may not be indexed yet, so the tool applies to nothing — edit the `.json` with `run-realm-code` instead.
- `transform-cards_33d7` — Bulk update with a command (requires approval).

## Media

- **`run-realm-code`** — Generate an image into the realm with `await realm.images.generate({ prompt, path })` in the script (see `source-code-editing`). It returns the saved path, so the same script can link the image in the card JSON. It spends credit, and a script that names the call waits for the user's click before it runs. Recipe: [`sample-images.md`](../../boxel-file-def/references/sample-images.md).
- **`run-realm-code`** — Save a file from a URL into the realm with `await realm.fs.download(sourceUrl, path)` in the script (see `source-code-editing`). `path` needs the right extension: the realm infers the type from it. It returns the saved path, so the same script can link the file in the card JSON. It fetches from the browser, so the source must allow CORS. A script that names the call waits for the user's click before it runs. Recipe: [`sample-images.md`](../../boxel-file-def/references/sample-images.md).

## Reading

- **`run-realm-code`** — Read a file in the workspace with `await realm.fs.readText(path)`, list a folder with `await realm.fs.list(path)`, and read a card instance as data with `await realm.cards.get(path)` in the script. Return what you read from the script to see it in the tool result.

## Seeing

- **`run-realm-code`** — See a card instance or any file as it renders with `await realm.capture(target, options)` in the script. This file declares the `run-realm-code` tool, so you can capture after reading it, also when you write nothing; the sandbox rules for the script are in `source-code-editing`. It captures the thing as an image and attaches it to the tool result, so you look at it the way the user does. `target` is a path in the run's realm (`Pet/mango` for a card, `brand/guide.html` for a file), or a card id or file URL in any workspace the user can read, such as a catalog card. A `.gts` path shows the module's source file, not the card it defines — to see a card's templates, view an instance of it. `options` is optional: `format` (`isolated`, the default, or `embedded`; `fitted` cannot be captured), `viewportWidth`/`viewportHeight` (default 1280×800), and `fullPage`. A full-page capture taller than 4096px is cut to its top; the result says so. A run can capture at most 3 times; capture more in another run.

Use it freely, without asking first. You cannot judge visual work from source alone:
- **To see context that carries visual meaning** — a brand guide, a theme, a layout, a card the user points at, an image or an HTML page in the workspace. Look before you describe it, match it, or build on it.
- **To check your own output** — after you create a card or change how one looks (a template, styles, an image, an HTML file, content that drives the layout), look at it and compare it with what was asked. A data edit that changes nothing visible needs no capture. Fix what you see before you report back. Capture in the same script that made the change, right after the write (see `source-code-editing`).

You see an image in the turn it arrives. In later turns the conversation keeps only its name and size, so to look again, capture it again. At most 8 images reach you per turn, the newest first; view only what you need for the step you are on.

What you can and cannot see:
- **Anything in a workspace:** capture it with `realm.capture`, as often as you need.
- **An image or PDF the user attached to the chat:** you see it in the turn they send it. To look at it again later, ask them to attach it again, or to upload it into the workspace so you can capture it whenever you need.
- **Any other file the user attached from their computer** (an HTML page, a document): you receive only its source, never how it renders. Say so plainly — tell the user you cannot see it rendered — and ask them either to attach a screenshot or to upload the file into the workspace, so you can capture it yourself. Never describe how it looks from its source as if you had seen it.
- **An image you were told was not sent to you:** the note gives the reason.
  - *The active model does not accept images:* stop viewing. Tell the user once that the current model cannot see images, and offer to switch to one that can (`room.setModel` in a `run-realm-code` script).
  - *Newer images filled the turn, or it was too large:* view it again on its own, or a smaller viewport of it, in your next step.
  - In every case, do not guess at what it shows.

## Navigation

- **`run-realm-code`** — Change what the user sees with `realm.ui` in the script (see `source-code-editing`): `realm.ui.switchSubmode('code')` or `('interact')`, `realm.ui.openFile(path)` to open a file in code mode, `realm.ui.previewFormat(cardPath, format)` to open a card's definition with a preview of that card, and `realm.ui.openWorkspace()` to open the run's workspace. The host does the actions after the script finishes. Each tool result's `context.submode` and `context.codeMode.currentFile` tell you where the user is; do not ask for an action that changes nothing. To open a file or a workspace in another realm, run the script in that realm.
- To show a card instance in the current mode, return `{ show: path }` from a `run-realm-code` script, for example `return { show: 'Pet/mango' };`. `path` is the instance's path in the realm, with or without `.json`; a full instance URL in the realm also works. The card opens when the run ends — in the same call that wrote it, or in a call that only returns `{ show }` for a card that already exists. A `.gts` path is a definition, not a card. To open a file in the editor, use `realm.ui.openFile`.
- Create or delete a workspace with `run-realm-code`: `realm.workspaces.create` and `realm.workspaces.delete` (see `source-code-editing`).

## Search

- `SearchCardsByQueryCommand_847d` — Advanced search with filters (preferred).
- `SearchCardsByTypeAndTitleCommand_a959` — Simple title search.
- Not a host command: to find what exists across realms and the catalog (Specs, listings, files), call `await realm.entries.search(query, { realms, scope, limit })` inside a `run-realm-code` script. It is an API of the script sandbox, so it cannot be called as a command (see `source-code-editing`).

## Skill / LLM management

- **`run-realm-code`** — Turn skills on or off in the current room with `room.enableSkills` and `room.disableSkills`, and switch the model with `room.setModel`, in the script (see `source-code-editing`). Change the room's skills only when the user asks for it. To use a skill yourself, read its `SKILL.md` with `readRealmFile` — `index.md` lists the skills. Reading the file loads the skill's instructions and tools; turning it on in the room is not necessary.

## Indexing (requires write access)

- **`run-realm-code`** — Control the index of the run's realm with `realm.index` in the script (see `source-code-editing`):
  - `await realm.index.invalidate(paths)` — index specific files again (a path or an array of 1 to 100 paths).
  - `await realm.index.reindex()` — reindex the realm in the default mode.
  - `await realm.index.fullReindex()` — rebuild the whole index from scratch. Waits for the user's click.
  - `await realm.index.cancelJob()` — cancel the running indexing jobs; queued jobs stay queued. Waits for the user's click.
  Each call starts the work and returns; it does not wait for indexing to finish. It returns a small object when the realm server accepted the request and throws when it did not.
