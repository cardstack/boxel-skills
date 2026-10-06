#!/usr/bin/env node
// Checks a page's colour tokens for contrast, and reports the page colour in OKLCH.
// Reads the first definition of each CSS custom property in an .html, .css or Theme .json
// file, maps the tokens to roles by name, and computes WCAG contrast. No dependencies.
//
//   node check-palette.mjs <file> [--canvas=#hex] [--ink=#hex] [--action=#hex] ...
//
// Roles: canvas, surface, ink, ink-muted, action, on-action. A flag overrides the name match.
// Exit code 1 when a contrast pair fails.

import { readFileSync } from 'node:fs';

const ROLE_PATTERNS = {
  canvas: /^(canvas|bg|background|ground|page|paper|base|body-bg|color-bg)$/,
  surface: /^(surface|card|panel|raised|bg-2|surface-1|background-2)$/,
  ink: /^(ink|text|fg|foreground|body|color-text|text-primary)$/,
  'ink-muted': /^(ink-muted|ink-2|muted-foreground|text-muted|text-secondary|fg-muted)$/,
  action: /^(action|primary|accent|brand|cta|link)(-\d|-main)?$/,
  'on-action': /^(on-action|on-primary|on-accent|primary-foreground|accent-foreground|action-ink)$/,
};

const PAIRS = [
  ['ink', 'canvas', 4.5, 'body text'],
  ['ink', 'surface', 4.5, 'body text on cards'],
  ['ink-muted', 'canvas', 4.5, 'secondary text'],
  ['on-action', 'action', 4.5, 'button label'],
  ['action', 'canvas', 3.0, 'control against the page'],
];


// ---- colour parsing and conversion -------------------------------------------------------

function parseColour(raw) {
  const v = raw.trim().toLowerCase();
  let m = v.match(/^#([0-9a-f]{3,8})\b/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((c) => c + c).join('');
    return srgbFromBytes(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
  }
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (m) return srgbFromBytes(+m[1], +m[2], +m[3]);
  m = v.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/);
  if (m) {
    const L = m[2] ? +m[1] / 100 : +m[1];
    return srgbFromOklch(L, +m[3], +m[4]);
  }
  if (v === 'white' || v === '#fff') return [1, 1, 1];
  if (v === 'black') return [0, 0, 0];
  return null;
}
const srgbFromBytes = (r, g, b) => [r / 255, g / 255, b / 255];
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function oklchFromSrgb([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  const H = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}
function srgbFromOklch(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => clamp01(fromLinear(c)));
}
const luminance = ([r, g, b]) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
function contrast(x, y) {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}
const hex = ([r, g, b]) => '#' + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
// Hue is noise below about C 0.006; above it, even a faint tint reads as warm or cool.
const fmt = ({ L, C, H }) => `oklch(${(L * 100).toFixed(0)}% ${C.toFixed(3)} ${C < 0.006 ? '—' : H.toFixed(0)})`;

// ---- reading the file ----------------------------------------------------------------------

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error('usage: node check-palette.mjs <file.html|.css|.json> [--canvas=#hex] [--ink=#hex] ...');
  process.exit(2);
}
let text = readFileSync(file, 'utf8');
if (file.endsWith('.json')) text = text.replace(/\\n/g, '\n').replace(/\\"/g, '"');

// First definition wins: the light theme on :root comes before any dark override.
const vars = {};
// A StructuredTheme card keeps its tokens as JSON keys (`rootVariables.cardForeground`), not as
// `--name: value` text. Read those first, in kebab case, so they map to roles like any CSS token.
if (file.endsWith('.json')) {
  try {
    const attrs = JSON.parse(readFileSync(file, 'utf8'))?.data?.attributes ?? {};
    for (const [key, value] of Object.entries(attrs.rootVariables ?? {})) {
      const name = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      if (typeof value === 'string' && !(name in vars)) vars[name] = value.trim();
    }
  } catch {
    // Not a card document: fall through to the text scan below.
  }
}
for (const m of text.matchAll(/--([\w-]+)\s*:\s*([^;}{]+)[;}]/g)) {
  const name = m[1].toLowerCase();
  if (!(name in vars)) vars[name] = m[2].trim();
}
const resolve = (value, depth = 0) => {
  const ref = value.match(/^var\(\s*--([\w-]+)/);
  if (ref && depth < 5 && vars[ref[1]]) return resolve(vars[ref[1]], depth + 1);
  return parseColour(value);
};

const roles = {};
for (const [name, value] of Object.entries(vars)) {
  const colour = resolve(value);
  if (!colour) continue;
  for (const [role, pattern] of Object.entries(ROLE_PATTERNS)) {
    if (!roles[role] && pattern.test(name)) roles[role] = { name: '--' + name, colour };
  }
}
// The body's own background beats a guessed token when it is a literal colour.
const bodyBg = text.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*([^;}]+)/i);
if (bodyBg) {
  const c = resolve(bodyBg[1].trim());
  if (c) roles.canvas = { name: 'body background', colour: c };
}
for (const flag of flags) {
  const m = flag.match(/^--([\w-]+)=(.+)$/);
  if (m && m[1] in ROLE_PATTERNS) {
    const c = parseColour(m[2]);
    if (c) roles[m[1]] = { name: 'flag', colour: c };
  }
}
if (!roles['on-action'] && roles.action) {
  // No label colour declared: assume the best of white, black, ink and canvas on the action fill.
  const options = [[1, 1, 1], [0, 0, 0], roles.ink?.colour, roles.canvas?.colour].filter(Boolean);
  const best = options.reduce((x, y) => (contrast(y, roles.action.colour) > contrast(x, roles.action.colour) ? y : x));
  roles['on-action'] = { name: '(assumed best case — pass --on-action=#hex for the real label)', colour: best };
}


// ---- report ---------------------------------------------------------------------------------

let failed = false;
console.log(`file: ${file}\n`);
console.log('roles');
for (const role of Object.keys(ROLE_PATTERNS)) {
  const r = roles[role];
  console.log(`  ${role.padEnd(10)} ${r ? `${hex(r.colour)}  ${fmt(oklchFromSrgb(r.colour)).padEnd(24)} from ${r.name}` : '— not found (pass --' + role + '=#hex)'}`);
}

console.log('\ncontrast');
for (const [fg, bg, min, what] of PAIRS) {
  if (!roles[fg] || !roles[bg]) continue;
  const ratio = contrast(roles[fg].colour, roles[bg].colour);
  const ok = ratio >= min;
  if (!ok) failed = true;
  console.log(`  ${(fg + ' on ' + bg).padEnd(24)} ${ratio.toFixed(2).padStart(5)}:1  needs ${min}  ${ok ? 'pass' : 'FAIL'}  (${what})`);
}

const g = roles.canvas && oklchFromSrgb(roles.canvas.colour);
if (g) {
  const band = g.L < 0.25 ? 'dark' : g.L < 0.7 ? 'mid' : g.C < 0.006 ? 'light neutral' : 'light tinted';
  console.log(`\nground: ${band}, ${fmt(g)}${g.C >= 0.006 ? (g.H >= 40 && g.H <= 110 ? ', warm' : g.H >= 180 && g.H <= 290 ? ', cool' : '') : ''}`);
}
console.log(`\n${failed ? 'FAIL: fix the contrast pairs above (move lightness first, keep hue)' : 'contrast: pass'}`);
process.exit(failed ? 1 : 0);
