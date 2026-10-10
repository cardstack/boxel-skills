---
name: source-code-editing
description: Use the run-realm-code tool to create and edit source files in a Boxel realm.
boxel:
  kind: skill
  tools:
    - codeRef:
        module: '@cardstack/boxel-host/tools/run-realm-code'
        name: default
---

# Source Code Editing

Use the `run-realm-code` tool for every source-file creation or edit. Do not emit file edits as prose. The tool executes JavaScript in the isolated realm runner. Each `realm.fs` call goes to the host, which reads files in the given realm and saves each write before the call returns.

The script runs in a small QuickJS sandbox, not in Node.js or a browser. The script is the body of an async function, so you can use `await` and `return` at the top level. The only global that the sandbox adds is `realm`; the standard JavaScript built-ins (`JSON`, `Math`, `Date`, `RegExp`, `Promise`, and so on) also work. There is no `console`, `print`, `nodeRepl`, `process`, `require`, `import`, `fetch`, `setTimeout`, DOM or Node API. A call to one of these stops the script with a `ReferenceError`. The tool result shows only the value that the script returns, as JSON, and nothing else. To see a value, `return` it, for example `return { files: await realm.fs.list() };`. A script that does not return a value gives a result with no value.

Before editing, read the current contents of every target file with `await realm.fs.readText(path)` in the script. To see what a folder holds, call `await realm.fs.list(path)`; with no path it lists the realm root. It returns one `{ name, path, kind }` entry for each file and folder directly in that folder, where `kind` is `'file'` or `'directory'` and `path` is relative to the realm root (a folder's `path` ends with `/`). To read or list without writing, return the result from the script, for example `return await realm.fs.readText('person.gts');`, and read it in the tool result. Pass the workspace realm URL and room ID supplied by the host. Use `await realm.fs.replace(path, exactCurrentText, replacement)` for an existing file. Use `await realm.fs.writeText(path, content)` for a new file; it refuses a file that already exists. `path` is relative to the realm root, such as `person.gts`; a full file URL inside the realm also works. File content often contains backticks and `${`, for example a BXL `fx` expression or a template string in a computed field. If you put such content inside a JavaScript template literal, escape each backslash in it as `\\` first, then each backtick as `` \` `` and each `${` as `\${`. Without this, the script does not parse, or it saves different text without an error: `/\d+/` becomes `/d+/`, and `${name}` is replaced with a value. Escape the `exactCurrentText` argument of `realm.fs.replace` the same way, or it does not match the file. Use `await realm.fs.exists(path)` to check whether a file exists. Await every call. Write all files of a build in one call, within the limits of one call: at most 20 files (each file path given to `readText`, `exists`, `replace` or `writeText` counts; `list` does not), a script of at most 100,000 characters, and 55 seconds. Split a larger build across calls. A `.gts` or `.ts` write with lint errors that autofix cannot repair is refused, and the script stops there. Each write is saved when its call returns, so if the script fails partway, the files written before the failure stay saved; the error names them.

To find cards in the realm, call `await realm.cards.search(query)`. `query` is a card query: a `filter` built from `on`/`type`, `eq`, `contains`, `range`, `in`, `any`, `every`, `not` and full-text `matches`, an optional `sort`, and an optional `page` (`{ size, number }`, where `number` starts at 0). The query syntax is in `boxel-environment/references/searching-and-querying.md`. It answers `{ cards, total, truncated }`. Each card is `{ id, path, type, attributes, relationships }`: `id` is the card's URL, which `show-card` takes; `path` is its `.json` file relative to the realm root, which `realm.fs.readText` and `realm.fs.replace` take; `type` is `{ module, name }` with a full module URL, so you can pass it back as a query's `type` or `on`; `relationships` maps each link field's path to the URL of the card it links to; a `linksToMany` field's links are keyed `field.0`, `field.1`, and so on. The data comes from the realm's index, not from the file: `attributes` include computed fields, and a card saved a moment ago can still show its old values. Read and edit the file through `path`, never by writing `attributes` back. A card that failed to index is not in the results. A page holds `page.size` cards, 50 when the query names none, and never more than 100; `truncated` is `true` while more cards match past this page, so ask for the next `page.number` until it is `false`. A page too large to return fails with the `page.size` that fits. A search searches only the realm the script runs in; to search another realm, run another script in that realm. A search does not count toward the 20-file limit, but each file you read or edit afterwards does, so for more than 20 cards collect every path first, then edit them across several calls. To search, edit and report in one script:

```js
const { cards, truncated } = await realm.cards.search({
  filter: { on: { module: realm.current.url + 'recipe', name: 'Recipe' }, eq: { cuisine: 'unknown' } },
});
for (const card of cards) {
  await realm.fs.replace(card.path, '"cuisine": "unknown"', '"cuisine": "Italian"');
}
return { edited: cards.map((card) => card.path), truncated };
```

Return only what you need from a search, such as the paths or a few attributes; the whole result goes into the tool result.

To look at what the script made, call `await realm.capture(path, options)` after the write; `options` is optional (`format`: `isolated` or `embedded`, `viewportWidth`/`viewportHeight`, `fullPage`). To see a card, view an instance (`Person/sample` or `Person/sample.json`); viewing a `.gts` path shows the module's source file, not the card it defines. It captures the card or file at `path` in this realm and attaches the image to the tool result, so you see it alongside the result; the script gets back only `{ path, kind, format, width, height, attached }`, never the image. A run can capture at most 3 times, and each capture spends the run's 55 seconds; a capture that would outrun the run, or a fourth one, is refused with a message to use the `view-visually` tool instead. A card you just wrote can take a moment to index; if its capture fails, view it with `view-visually` in your next step.

To create a workspace for the user, call `await realm.workspaces.create({ name, endpoint })`. Both options are optional: a random name is made when `name` is missing, and `endpoint`, the URL path segment, is made from the name when it is missing. It returns `{ url, name }`. Report the URL to the user. When the run ends, the host opens the new workspace. A run works in one realm only, so the script cannot write to the new workspace. To add files to it, run `run-realm-code` again with the new URL as `realm`. One run can create at most 5 workspaces.

To delete a workspace that the user owns, with all of its cards and files, call `await realm.workspaces.delete(url)`. It returns `{ url, deleted: true }`. A delete cannot be undone, so confirm with the user before you call it. Write the call exactly as `realm.workspaces.delete(...)` in the script. A run whose code contains that text always waits for the user to approve it, also in act mode. A run that gets to the delete in a different way is refused.

Keep the script deterministic and narrowly scoped. Do not access browser globals, network services, credentials, or files outside the given realm. After the tool returns, inspect its result and address any correctness errors with another tool call.
