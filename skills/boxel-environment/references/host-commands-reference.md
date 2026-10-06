---
name: host-commands-reference
description: Full catalog of Boxel host commands — what each does and its approval rules.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/switch-submode'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/show-card'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/transform-cards'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/read-card-for-ai-assistant'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/read-file-for-ai-assistant'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/set-active-llm'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/open-workspace'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/create-workspace'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/delete-workspace'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/preview-format'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/update-code-path-with-selection'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/copy-card'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/copy-source'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/patch-fields'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/generate-thumbnail'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/download-file-to-realm'
        name: default
      requiresApproval: true
    - codeRef:
        module: '@cardstack/boxel-host/tools/update-room-skills'
        name: default
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByQueryCommand
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/search-cards'
        name: SearchCardsByTypeAndTitleCommand
      requiresApproval: false
    - codeRef:
        module: '@cardstack/boxel-host/tools/view-visually'
        name: default
      requiresApproval: false
---

# Host Commands Reference

Quick lookup of every command available to this skill, what it does, and notable rules.

## Editing

- **`run-realm-code`** — The way to create or edit source files. It runs a script that saves each file as it writes it, and triggers correctness checks after indexing. Use `realm.fs.writeText` for a new file and `realm.fs.replace` for an existing one.
- `patch-fields_3e67` — Field updates on an indexed card the user is looking at, with their approval. Not for repairing a file you just wrote or one that failed a check: that card may not be indexed yet, so the tool applies to nothing — edit the `.json` with `run-realm-code` instead.
- `patchCardInstance` — Update card data only.
- `ApplyMarkdownEditCommand_c112` — Edit long markdown fields (>500 chars) surgically without truncation (requires approval).
- `copy-card_eefc` — Duplicate a card (requires approval).
- `copy-source_5d09` — Duplicate a file (requires approval).
- `transform-cards_33d7` — Bulk update with a command (requires approval).

## Media

- `generate-thumbnail` — Generate one image through OpenRouter (default `google/gemini-2.5-flash-image`) and save it into a realm as an image file (requires approval: it writes a file and spends OpenRouter credit). Despite the name it makes any image, not only thumbnails. Inputs: `prompt` and `targetRealmIdentifier` (required); `targetPath` (folder, e.g. `Images`), `cardName` (names the file), `sourceImageUrl` (reference image for image-to-image), `llmModel`. It returns `imageDefIdentifier`, the URL of the new file. Passing `targetCardId` links the image to that card's `cardInfo.cardThumbnail` and nowhere else. For any other image field, omit it and write the returned URL into the instance's `relationships` yourself. Full recipe: [`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md).
- `download-file-to-realm` — Download a file from a URL and save it into a realm (requires approval: it writes a file). Inputs: `sourceUrl` and `path` (required; give `path` the right extension, e.g. `Images/kitchen.jpg`, because the realm infers the file type from it), `realm`, `useNonConflictingFilename`. It returns `fileIdentifier`. Use it to bring a stock photo or a user-supplied image into the realm, then link it in `relationships`. Never pass it a guessed URL. Recipe: [`boxel-file-def/references/sample-images.md`](../../boxel-file-def/references/sample-images.md).

## Reading

- `read-file-for-ai-assistant_a831` — Read file contents into context.
- `read-card-for-ai-assistant` — Read a card instance.

## Seeing

- **`view-visually_907b`** — See a card instance or any file in a workspace as it renders. It captures the thing as an image and attaches it to the tool result, so you look at it the way the user does. Pass `url`: a card's id to see the card, or a workspace file's URL to see the file through its file view (HTML, markdown, images, PDFs and other files). A `.gts` URL shows the module's source file, not the card it defines — to see a card's templates, view an instance of it. Optional: `format` (`isolated`, the default, or `embedded`; `fitted` cannot be captured), `viewportWidth`/`viewportHeight` (default 1280×800), and `fullPage`. A full-page capture taller than 4096px is cut to its top; the result says so.

Use it freely, without asking first. You cannot judge visual work from source alone:
- **To see context that carries visual meaning** — a brand guide, a theme, a layout, a card the user points at, an image or an HTML page in the workspace. Look before you describe it, match it, or build on it.
- **To check your own output** — after you create a card or change how one looks (a template, styles, an image, an HTML file, content that drives the layout), look at it and compare it with what was asked. A data edit that changes nothing visible needs no capture. Fix what you see before you report back. Inside a `run-realm-code` script, `realm.capture(path)` does the same right after a write (see `source-code-editing`).

You see an image in the turn it arrives. In later turns the conversation keeps only its name and size, so to look again, capture it again. At most 8 images reach you per turn, the newest first; view only what you need for the step you are on.

What you can and cannot see:
- **Anything in a workspace:** capture it with `view-visually_907b`, as often as you need.
- **An image or PDF the user attached to the chat:** you see it in the turn they send it. To look at it again later, ask them to attach it again, or to upload it into the workspace so you can capture it whenever you need.
- **Any other file the user attached from their computer** (an HTML page, a document): you receive only its source, never how it renders. Say so plainly — tell the user you cannot see it rendered — and ask them either to attach a screenshot or to upload the file into the workspace, so you can capture it yourself. Never describe how it looks from its source as if you had seen it.
- **An image you were told was not sent to you:** the note gives the reason.
  - *The active model does not accept images:* stop viewing. Tell the user once that the current model cannot see images, and offer to switch to one that can (`set-active-llm`).
  - *Newer images filled the turn, or it was too large:* view it again on its own, or a smaller viewport of it, in your next step.
  - In every case, do not guess at what it shows.

## Navigation

- `switch-submode_dd88` — Toggle interact/code modes. Navigation only: it never writes, and it is not a step of creating or editing a file (`run-realm-code` does that). Call it at most once per task, and never when the tab is already in code mode on that file — the last tool result's `context.submode` and `context.codeMode.currentFile` tell you where you are. A bare `submode: "code"` opens code mode in whatever realm the UI last showed — when the task targets a specific realm, pass `codePath` with a plain file URL in that realm (never pass `createFile: true` before writing a new file: it creates an empty file, and `realm.fs.writeText` then refuses it because the file exists).
- `show-card_566f` — Display a card instance in the current mode. `cardId` is the instance id: its URL without the `.json` extension. A `.gts` path is a definition, not a card — passing one opens the definition's own module in the base realm, which is never what you want. To open a file in the editor, use `switch-submode_dd88` with `codePath`.
- `preview-format_cb94` — Open module + preview card (code mode; use after edits).
- `update-code-path-with-selection_f749` — Open file in code editor.
- `open-workspace_1696` — Navigate to a workspace by URL. Lands in **interact mode** — it exits code mode. To work on a specific realm in code mode, use `switch-submode` with a `codePath` in that realm instead.
- `create-workspace_cf0f` — Create a new workspace (realm) for the current user (requires approval). Both inputs are optional: `name` is the display name (a random one is generated when omitted) and `endpoint` is the URL path segment (derived from the name when omitted). When done it opens the new workspace; its URL is the `Workspace:` line in the context returned with the tool result — report that URL to the user.
- `delete-workspace_a465` — Permanently delete a workspace the user owns, with all of its cards and files (requires approval). Pass `realmIdentifier`. Confirm with the user before calling it; it cannot be undone.

## Search

- `SearchCardsByQueryCommand_847d` — Advanced search with filters (preferred).
- `SearchCardsByTypeAndTitleCommand_a959` — Simple title search.

## Skill / LLM management

- `update-room-skills_3875` — Activate/deactivate skills in the current room.
- `set-active-llm_1887` — Switch AI model.

## Indexing (requires write access)

- `invalidate-realm-identifiers_xxxx` — Trigger indexing for specific file/resource identifiers in a realm.
- `reindex-realm_xxxx` — Reindex a realm using default mode.
- `full-reindex-realm_xxxx` — Force a full reindex of a realm.
- `cancel-indexing-job_xxxx` — Cancel currently running indexing job.

## Approval requirements

The following require user approval before execution:
- `transform-cards`, `copy-card`, `copy-source`, `patch-fields`, `apply-markdown-edit`, `generate-thumbnail`, `download-file-to-realm`, `create-workspace_cf0f`, `delete-workspace_a465`
