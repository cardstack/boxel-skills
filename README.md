# Boxel Skills

The canonical source of official Boxel agent skills. Everything here is authored directly in this repository — there is no upstream authoring repo and no import step.

## Who consumes this repo

- **The skills realm** — merges to `main` sync to the staging realm; published GitHub releases sync to production (https://app.boxel.ai/skills/). See `.github/workflows/sync-to-workspace.yml`.
- **The boxel-cli plugin** — `skills/` is copied verbatim from a pinned release tag into `packages/boxel-cli/plugin/` in the [boxel monorepo](https://github.com/cardstack/boxel), which distributes it to end users and to the Software Factory. Skills are the only surface: Codex plugins have no commands slot, and Claude Code reads them from `skills/` too.
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

Three invariants to keep by hand (nothing rewrites your files):

- Self-references are realm-root-relative — `skills/<name>/…` — never absolute `https://…/skills/` URLs, so the realm stays cloneable to other hosts.
- Every shipped `SKILL.md` carries `boxel.kind: skill` frontmatter; the `boxel-skill-authoring` skill documents the full contract.
- **Author guidance into both `skills/` and `Skill/`.** The same conventions live in two hand-maintained trees — `skills/` (Claude Code plugin + boxel-cli) and `Skill/` (the in-app AI assistant's cards) — and nothing syncs them. Update only one and the two harnesses drift. This double-authoring is interim: it goes away once the assistant consumes skill markdown files directly ([CS-11809](https://linear.app/cardstack/issue/CS-11809)). A `Skill/<name>.json` card can avoid the duplication for a single topic by pointing its `instructionsSource` at `../skills/<name>/SKILL.md` instead of a sibling `.md` — see `Skill/source-code-editing.json` and `Skill/bxl-authoring.json`. One file then serves both harnesses and cannot drift from itself.

## Layout

- `skills/` — the skill trees (`<name>/SKILL.md` + `references/`), in the shape Claude Code consumes.
- `Skill/` — legacy SkillPlusMarkdown cards (`<name>.json` + `<name>.md`) loaded by the **in-app AI assistant**. Overlaps in content with `skills/`, but nothing syncs the two — see the double-authoring invariant above.
- `index.md` — the realm's entry document; `CLAUDE.md` and `AGENTS.md` are symlinks to it.
- `.claude-plugin/plugin.json` — makes a checkout loadable via `claude --plugin-dir` for authoring. Not pushed to the realm (see `.boxelignore`).
