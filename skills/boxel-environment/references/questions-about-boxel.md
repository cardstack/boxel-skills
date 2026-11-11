# Questions about using Boxel

Some questions are about Boxel itself, not about a card: can I work from Claude Code, how do I put this online, how many credits do I have. Answer them in plain words from this page. Only a credits question needs a tool call to answer, and none needs a workspace open. The answer is a few sentences with the next step, not a tour of Boxel's internals. When a question asks for something this page says Boxel doesn't have, say so; never describe a flow that doesn't exist.

## Working from Claude Code

Yes. A user can work on a workspace from Claude Code, or any editor, with boxel-cli:

- **The CLI.** `npm install -g @cardstack/boxel-cli` installs it as `boxel`; the plugin's skills call it from the PATH. Don't suggest `npx boxel` to someone who hasn't installed it: with nothing installed, it fetches an unrelated npm package named `boxel`. `boxel profile add` signs in: it opens the browser, and the user signs in there.
- **The Claude Code plugin.** In Claude Code, `/plugin marketplace add cardstack/boxel`, then `/plugin install boxel-cli`. Installing it also installs the `boxel-skills` plugin: the same card-building skills the assistant in the app reads, plus skills for the CLI itself (syncing a workspace, reading and writing single files, search, profiles, and signing a browser in). Codex users add the same marketplace and install both plugins themselves, since Codex has no plugin dependencies.
- **The loop.** Pull the workspace to a local folder, edit, lint (`npx boxel file lint`), and push it back. The commands are in the glossary's boxel-cli section.

Two warnings belong in the answer:

- `npx boxel realm pull` overwrites local edits that weren't pushed, with no warning. On a folder already in use, `npx boxel realm status --pull` takes only the files with no local changes. [`shared-mirror-safety.md`](shared-mirror-safety.md) has the details.
- `npx boxel realm sync` doesn't merge. When the same file changed on both sides, sync skips it and reports the conflict, unless a flag picks which side wins (`--prefer-local`, `--prefer-remote` or `--prefer-newest`). With a flag, the other side's edits to that file are lost: `--prefer-remote` drops the local ones.

## Publishing a workspace

The workspace's owner publishes; the assistant can't. Publishing is in Host mode, which the user opens from the mode menu (a `run-realm-code` script switches only between interact and code mode). Host mode shows the workspace as visitors will see it, so it is also where to check the site before publishing. There, **Publish Site** opens a dialog, "Where to?", with a checkbox for each place the workspace can go, and **Publish to selected domains** publishes to the ones checked:

- **Your Boxel Space:** `<username>.boxel.space/<workspace>`. Dots in the username become hyphens (`first.last` → `first-last.boxel.space`), and `<workspace>` is the last part of the workspace's URL, in lower case, not its display name.
- **Unlisted Link:** an address with a random path, for sharing with people who have the link. Until it is published, **New link** picks a different path.
- **Custom Site Name:** a name the user claims, at `<name>.boxel.site`. The dialog says whether the name is free.

Each place has its own **Unpublish**.

**What a visitor sees.** At the root of the site, the workspace's index card. To put a different card at `/`, or cards at paths like `/about`, the workspace's `hostRoutingRules` map paths to cards: [`../../boxel-patterns/patterns/link-host-mode-paths/README.md`](../../boxel-patterns/patterns/link-host-mode-paths/README.md).

**A published site is a copy.** It doesn't change when the workspace does. After editing, publish again: the button reads **Republish Site** once the workspace has been published.

**A domain of the user's own isn't supported.** Say so, and offer a `boxel.site` name instead. Don't describe DNS steps.

**What stops or spoils a publish.** The dialog warns about the first three before publishing:

- **Cards that failed to index.** The dialog warns that the workspace can't be safely published. You can help: find and fix them ([`indexing-operations.md`](indexing-operations.md), "Verifying a change landed").
- **Routing rules that point at a card that no longer exists.** Visitors to those paths get "page not found". Fix or remove the rule in the workspace's `hostRoutingRules`.
- **Private dependencies.** A card that uses a definition or a card from a workspace visitors can't read renders with errors on the published site.
- **Host isn't in the mode menu.** The workspace can't be published: it is itself a published copy (publish from the workspace it was copied from), or a shared system workspace.

From a terminal, `npx boxel realm publish <source> <published>` and `realm unpublish` do the same.

## Credits

A question about the user's plan, how many credits they have left, or what this conversation has cost is answered from `await room.credits()` in a `run-realm-code` script, never from memory. The rule for reading its answer is in `index.md` (*Questions about credits get the user's real numbers*), and the shape of what it returns is in [`../../source-code-editing/SKILL.md`](../../source-code-editing/SKILL.md). Plan prices aren't in it: point to Profile → Membership Tier for those.
