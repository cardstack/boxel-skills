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

    boxel realm push skills https://app.boxel.ai/myuser/myworkspace/

Commit, push your branch, and raise a PR. Merged changes go to the staging realm; tagged releases go to production and become eligible for the plugin's version pin.

Two invariants to keep by hand (nothing rewrites your files):

- Self-references are realm-root-relative — `<name>/…`, since the realm root is `skills/` — never absolute `https://…/skills/` URLs, so the realm stays cloneable to other hosts.
- Every shipped `SKILL.md` carries `boxel.kind: skill` frontmatter; the `boxel-skill-authoring` skill documents the full contract.

## Releasing

A release is a published GitHub release whose tag is `v<version>`, where `<version>` is the `version` in `.codex-plugin/plugin.json`: Codex decides whether a user's copy is current from that field. Four steps: bump `version` on `main`, run the `Release` workflow (Actions → Release → Run workflow), open the draft release it makes and click **Publish release**, then, once it is published, move the pin in the boxel monorepo (below). The workflow reads the version, refuses if that tag already exists, and drafts the release from `main`, so the tag and the manifest cannot disagree. A person publishes the draft because GitHub starts no workflow for a release the workflow's own token publishes, and the production sync runs on a published release. The `Check plugin version` workflow still flags a release made by hand whose tag does not match, and the boxel monorepo refuses to pin one. `.claude-plugin/plugin.json` deliberately carries no version, so Claude Code tracks the commit the boxel marketplace pins.

Claude Code and Codex users get a release once the boxel monorepo moves its pin: the `ref` of the `boxel-skills` entry in both `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json`. The monorepo's Software Factory and test suites read the same tag. The pin must name a published release: the monorepo's tests clone the tag, and a draft has none.

## Layout

- `skills/` — the skills realm's root, synced to `https://app.boxel.ai/skills/`, so `skills/boxel/SKILL.md` is served at `https://app.boxel.ai/skills/boxel/SKILL.md`. It holds the skill trees (`<name>/SKILL.md` + `references/`), read by Claude Code, Codex, boxel-cli and the in-app AI assistant, beside the realm's own files: `index.md` (the entry document), `realm.json` and `index.json`.
- `CLAUDE.md` and `AGENTS.md` — point agents working in this repository at `skills/index.md`.
- `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` — make this repository installable as the `boxel-skills` plugin, and a checkout loadable via `claude --plugin-dir` for authoring. Outside `skills/`, so not pushed to the realm.
