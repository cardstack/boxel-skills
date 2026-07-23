# Boxel Skills

The canonical source of official Boxel agent skills and slash commands. Everything here is authored directly in this repository — there is no upstream repo and no sync step.

## Who consumes this repo

- **The skills realm** — merges to `main` sync to the staging realm; published GitHub releases sync to production (`app.boxel.ai/skills/`). See `.github/workflows/sync-to-workspace.yml`.
- **The boxel-cli Claude Code plugin** — `skills/` and `commands/` are copied verbatim from a pinned release tag into `packages/boxel-cli/plugin/` in the [boxel monorepo](https://github.com/cardstack/boxel), which distributes them to end users and to the Software Factory.
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

## Layout

- `skills/` — the skill trees (`<name>/SKILL.md` + `references/`), in the shape Claude Code consumes.
- `commands/` — slash-command definitions, one `.md` per command.
- `index.md` — the realm's entry document; `CLAUDE.md` and `AGENTS.md` are symlinks to it.
- `.claude-plugin/plugin.json` — makes a checkout loadable via `claude --plugin-dir` for authoring. Not pushed to the realm (see `.boxelignore`).
