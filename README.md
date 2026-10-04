# Boxel Skills

The canonical source of official Boxel agent skills. Everything here is authored directly in this repository — there is no upstream authoring repo and no import step.

## Who consumes this repo

- **The skills realm** — merges to `main` sync to the staging realm; published GitHub releases sync to production (https://app.boxel.ai/skills/). See `.github/workflows/sync-to-workspace.yml`.
- **The `boxel-skills` plugin** — the marketplace in the [boxel monorepo](https://github.com/cardstack/boxel) lists this repository as a plugin at a pinned release tag, for Claude Code and Codex. Claude Code installs it automatically with the `boxel-cli` plugin, which declares it as a dependency; Codex users install it alongside `boxel-cli`. The monorepo's Software Factory reads the same pinned tag. Skills are the only surface: Codex plugins have no commands slot, and Claude Code reads them from `skills/` too.
- **Agent sessions authoring skills** — a checkout of this repo is itself a loadable Claude Code plugin (see below).

## Authoring workflow

Clone and branch:

    git clone git@github.com:cardstack/boxel-skills.git
    cd boxel-skills
    git checkout -b my-change

To iterate on a skill live, start Claude Code with the checkout as a plugin — edits to skill bodies are picked up on next use, and `/reload-plugins` refreshes the catalog after adding or renaming a skill:

    claude --plugin-dir /path/to/boxel-skills

To test content changes against a real workspace, install the [Boxel CLI](https://www.npmjs.com/package/@cardstack/boxel-cli) (`npm install -g @cardstack/boxel-cli`, then `boxel profile add` once) and push to a workspace you own:

    boxel realm push . https://app.boxel.ai/myuser/myworkspace/

Commit, push your branch, and raise a PR. Merged changes go to the staging realm; tagged releases go to production and become eligible for the plugin's version pin.

Two invariants to keep by hand (nothing rewrites your files):

- Self-references are realm-root-relative — `skills/<name>/…` — never absolute `https://…/skills/` URLs, so the realm stays cloneable to other hosts.
- Every shipped `SKILL.md` carries `boxel.kind: skill` frontmatter; the `boxel-skill-authoring` skill documents the full contract.

## Releasing

A release is a published GitHub release whose tag is `v<version>`. Before publishing one, set `version` in `.codex-plugin/plugin.json` to that `<version>` on `main`: Codex decides whether a user's copy is current from that field, and the `Check plugin version` workflow fails a release whose tag does not match it. `.claude-plugin/plugin.json` deliberately carries no version, so Claude Code tracks the commit the boxel marketplace pins.

Users get a release once the boxel monorepo moves its pin: the `ref` of the `boxel-skills` entry in both `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json`. The monorepo's Software Factory and test suites read the same tag.

## Layout

- `skills/` — the skill trees (`<name>/SKILL.md` + `references/`), read by Claude Code, boxel-cli and the in-app AI assistant.
- `index.md` — the realm's entry document; `CLAUDE.md` and `AGENTS.md` are symlinks to it.
- `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` — make this repository installable as the `boxel-skills` plugin, and a checkout loadable via `claude --plugin-dir` for authoring. Not pushed to the realm (see `.boxelignore`).
