---
validated: source-proven
---

# automate-run-command-cli — Invoke a Command from the shell via `npx boxel run-command`

**What this gives you:** A Command class you authored for your realm becomes invokable from the shell. When paired with a typed run card, every invocation leaves an auditable trace — a queryable card with steps, logs, progress, errors, and outputs — without writing a separate logging layer.

**When to use:**
- Batch jobs (reindex, regenerate thumbnails, sync from upstream) that you'd otherwise run by hand inside the host UI.
- Cron / scheduled tasks — a CI job calls `npx boxel run-command` on a schedule.
- CI gates — a deploy script checks an exit code or parses the JSON output.
- One-off realm migrations after a schema change (see `boxel-migrate-schema`).

**The insight:** A Command class is already a typed function (`Input → Output`) with `toolContext` access to host primitives. The CLI posts the specifier and `--input` to the realm server, which loads the module in its headless prerender tab, instantiates the Command with a synthetic `toolContext`, builds the input card, runs it, and returns the output, which the CLI prints as JSON. No re-implementation needed; the same Command works from a card menu, a Glimmer component, and the shell.

## Invocation shape

```sh
npx boxel run-command \
  'https://<realm>/example/ReindexCommand' \
  --realm 'https://<realm>/' \
  --input '{ "targetRealm": "https://<realm>/" }' \
  --json
```

The first argument is `<module-url>/<ExportName>`, split at the last `/` — never `module::Export`. Host tools take the form `@cardstack/boxel-host/tools/<name>/default`.

## Recipe shape

```ts
import { Command } from '@cardstack/base/command';

export class ReindexInput extends CardDef {
  @field targetRealm = contains(StringField);
}

export class ReindexOutput extends CardDef {
  @field success = contains(StringField);
  @field count = contains(StringField);
  @field message = contains(StringField);
}

export class ReindexCommand extends Command<
  typeof ReindexInput,
  typeof ReindexOutput
> {
  static displayName = 'Reindex Command';
  static description = 'Re-index every card in the target realm.';

  async getInputType() { return ReindexInput; }

  protected async run(input: ReindexInput): Promise<ReindexOutput> {
    const output = new ReindexOutput();
    // ... do the work via this.toolContext ...
    return output;
  }
}
```

## Pairing with a run card

For history-on-write, link the Command output to a Run CardDef that captures status, steps, logs, start/end timestamps. Persist the run card from inside `run()` and return its URL — every CLI invocation then leaves a queryable trail in the realm. See `command-optimistic-pipeline` for the mutate-in-place + fire-and-forget save shape and `command-typed-with-progress` for the progress-step state machine.

## Conventions

- **`getInputType()` is required.** The CLI uses it to instantiate the input class from the `--input` JSON. Fields not on the class are dropped silently — keep the input shape narrow.
- **Use `this.toolContext` for IO.** `SaveCardCommand`, `SearchCardsByQueryCommand`, etc. — same primitives as in-app, no host UI assumed. Not the AI proxy: `SendRequestViaProxyCommand` and one-shot LLM calls fail with `Cannot login to realm server without matrix client`, because the prerender tab has no Matrix session. Make model calls from a signed-in browser session.
- **Decide the error convention up front.** Most commands prefer to set `output.success = 'false'` and exit 0 so the JSON parses cleanly — useful when the caller is another script. Throw for genuinely exceptional cases when you want a non-zero exit (cron alerting).
- **Static `description` is exposed to `--help`.** Write it for the operator who is reading the shell help text, not the developer.

## Gotchas

- **The module resolves on the realm server, not on your machine.** The CLI never fetches it; it must be readable from the realm with the active profile's session.
- **The command runs in the realm server's headless prerender tab.** `document` and `window` exist, but there is no signed-in user, no Matrix client and no AI proxy (see Conventions). Keep `run()` free of user-session assumptions.
- **Output cards are NOT auto-saved.** Returning a new `ReindexOutput()` prints its serialized JSON; if you want the run history in the realm, call `SaveCardCommand` explicitly.

## Source

- `realms-staging.stack.cards/ctse/personal/save-image-command.gts` — minimal Input/Output/Command shape. Lines 1–84.
- `boxel/references/command-invocation-modes.md` — the CLI mode in the wider Command invocation taxonomy (direct call, reactive resource, menu, typed progress, CLI, atomic install, AI processor).
- `boxel/references/command-development.md` — Command class internals.

## See also

- `command-optimistic-pipeline` — durable run cards with fire-and-forget saves.
- `command-typed-with-progress` — progress-step state machine the calling UI reflects.
- `boxel-migrate-schema` — typical CLI caller for schema migrations.
