#!/usr/bin/env node
// Repeatable boxel-workspaces -> boxel-skills transformation.
//
// boxel-workspaces is the authoritative source (Luke + Chris planning,
// 2026-07-06). This script rebuilds the canonical skills layout in
// boxel-skills from a sibling boxel-workspaces checkout, so the import that
// was first done by hand (commit "Import skills from boxel-workspaces WIP")
// can be re-run every time boxel-workspaces changes.
//
// Usage:
//   node scripts/import-from-workspaces.mjs [--workspaces <path>] [--dest <path>] [--check]
//
//   --workspaces  path to the boxel-workspaces checkout (default: ../boxel-workspaces)
//   --dest        path to the boxel-skills checkout to write into (default: repo root)
//   --check       write to a temp dir and diff against --dest instead of mutating it;
//                 exits non-zero if they differ (useful in CI / for validation)
//
// What it does (see the RFC "Directional update" + spec §1/§6/§9):
//   .claude/skills/        -> skills/         (SKILL.md gets `boxel.kind: skill`)
//   .claude/commands/      -> commands/       (each .md gets `name:` + `boxel.kind: skill`)
//   CLAUDE.md              -> index.md        (maintained head + rewritten body, with
//                                              extension-referencing prose removed)
//                                              + CLAUDE.md/AGENTS.md symlinks -> index.md
//   .claude/extensions/, .claude/extension-libs/ -> NOT shipped (out of scope for skill
//                            unification — they stay in boxel-workspaces; see Non-goals)
//   .claude/learnings/, .claude/plans/        -> NOT shipped (skipped)
//
// The editorial head of index.md (frontmatter + title + intro) is NOT derived
// from CLAUDE.md — it lives in scripts/index.head.md and is maintained by hand.
// Everything below the first `## ` heading is synced mechanically.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, symlinkSync, existsSync, mkdtempSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');

function parseArgs(argv) {
  const args = { workspaces: join(REPO_ROOT, '..', 'boxel-workspaces'), dest: REPO_ROOT, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--workspaces') args.workspaces = argv[++i];
    else if (a === '--dest') args.dest = argv[++i];
    else if (a === '--check') args.check = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

// ---- path rewriting -------------------------------------------------------
// `.claude/skills/` (and extensions) collapse to repo-root paths; learnings
// stays `.claude/learnings/` (it isn't shipped, but index.md still references it).
function rewritePaths(text) {
  return text
    .replaceAll('.claude/skills/', 'skills/')
    .replaceAll('.claude/extension-libs/', 'extension-libs/')
    .replaceAll('.claude/extensions/', 'extensions/');
}

// ---- frontmatter injection ------------------------------------------------
// Text-level (no YAML dep). Frontmatter is the block between the first two
// `---` lines. Insertions are idempotent: keys already present are left alone.
function splitFrontmatter(content) {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return null;
  const fmEnd = end + '\n---'.length;
  return {
    fm: content.slice(4, end), // between the opening `---\n` and the closing `\n---`
    rest: content.slice(fmEnd), // starts with the newline after closing `---`
  };
}

function ensureFrontmatterKeys(content, { name } = {}) {
  const parts = splitFrontmatter(content);
  if (!parts) {
    // No frontmatter at all — synthesize a minimal one.
    const lines = [name ? `name: ${name}` : null, 'boxel:', '  kind: skill'].filter(Boolean);
    return `---\n${lines.join('\n')}\n---\n${content}`;
  }
  let { fm } = parts;
  const hasName = /^name:/m.test(fm);
  const hasBoxel = /^boxel:/m.test(fm);
  if (name && !hasName) fm = `name: ${name}\n${fm}`;
  if (!hasBoxel) fm = `${fm}\nboxel:\n  kind: skill`;
  return `---\n${fm}\n---${parts.rest}`;
}

// ---- tree copy with per-file transform ------------------------------------
// `transform(src)` returns rewritten content for files it changes, or null to
// copy the file verbatim. Verbatim files go through cpSync so their mode is
// preserved (e.g. executable `scripts/*.py`); writeFileSync would drop +x.
function copyTree(srcDir, destDir, transform) {
  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry);
    const dest = join(destDir, entry);
    if (statSync(src).isDirectory()) {
      copyTree(src, dest, transform);
    } else {
      const out = transform(src);
      if (out == null) cpSync(src, dest);
      else writeFileSync(dest, out);
    }
  }
}

// ---- index.md -------------------------------------------------------------
// Split the CLAUDE.md body (everything from the first `## ` on) into level-2
// sections. Extension-related prose is dropped (extensions are out of scope);
// the rest becomes the index.md body under the maintained head template.
function buildIndex(claudeMd, headTemplate) {
  const bodyStart = claudeMd.indexOf('\n## ');
  const body = bodyStart === -1 ? '' : claudeMd.slice(bodyStart + 1);

  const sections = body.split(/\n(?=## )/); // each starts with `## `
  const indexSections = [];

  for (const section of sections) {
    const heading = section.slice(0, section.indexOf('\n'));
    if (/\.claude\/extension/.test(heading)) continue; // drop extension sections
    // Drop the "For workspace-specific capabilities…" paragraph too.
    const kept = section
      .split('\n')
      .filter((line) => !line.startsWith('For workspace-specific capabilities'));
    indexSections.push(kept.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd());
  }

  const head = headTemplate.trimEnd();
  return rewritePaths(`${head}\n\n${indexSections.join('\n\n')}\n`);
}

// ---- main -----------------------------------------------------------------
function run(workspaces, dest) {
  const claude = join(workspaces, '.claude');
  if (!existsSync(claude)) throw new Error(`No .claude dir in ${workspaces}`);

  // 1. skills/ — SKILL.md gets `boxel.kind: skill`; everything else verbatim.
  copyTree(join(claude, 'skills'), join(dest, 'skills'), (src) =>
    basename(src) === 'SKILL.md' ? ensureFrontmatterKeys(readFileSync(src, 'utf8')) : null,
  );

  // 2. commands/ — each *.md gets `name:` (from filename) + `boxel.kind: skill`.
  copyTree(join(claude, 'commands'), join(dest, 'commands'), (src) =>
    src.endsWith('.md')
      ? ensureFrontmatterKeys(readFileSync(src, 'utf8'), { name: basename(src, '.md') })
      : null,
  );

  // 3. index.md (+ symlinks) from CLAUDE.md.
  const headTemplate = readFileSync(join(SCRIPT_DIR, 'index.head.md'), 'utf8');
  const claudeMd = readFileSync(join(workspaces, 'CLAUDE.md'), 'utf8');
  writeFileSync(join(dest, 'index.md'), buildIndex(claudeMd, headTemplate));
  for (const link of ['CLAUDE.md', 'AGENTS.md']) {
    const p = join(dest, link);
    rmSync(p, { force: true });
    symlinkSync('index.md', p);
  }

  // extensions/, extension-libs/, and the old claude-extensions.md are out of
  // scope for skill unification (they stay in boxel-workspaces). Remove any
  // left over from the earlier by-hand import so the build converges.
  for (const stale of ['extensions', 'extension-libs', 'claude-extensions.md']) {
    rmSync(join(dest, stale), { recursive: true, force: true });
  }

  // learnings/ and plans/ are intentionally not shipped.
}

const { workspaces, dest, check } = parseArgs(process.argv.slice(2));

if (check) {
  const tmp = mkdtempSync(join(tmpdir(), 'boxel-skills-import-'));
  // Seed with a copy of dest so unmanaged files don't show as spurious diffs.
  cpSync(dest, tmp, { recursive: true, filter: (s) => basename(s) !== '.git' });
  run(workspaces, tmp);
  try {
    execFileSync('diff', ['-r', '-x', '.git', dest, tmp], { stdio: 'inherit' });
    console.log('✓ import output matches', dest);
  } catch {
    console.error('✗ import output differs from', dest, '(see diff above)');
    process.exit(1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
} else {
  run(workspaces, dest);
  console.log('✓ imported boxel-workspaces ->', dest);
}
