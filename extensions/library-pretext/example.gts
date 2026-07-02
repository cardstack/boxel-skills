import Modifier from 'ember-modifier';

// ══════════════════════════════════════════════════════════════
// Pretext Modifier — canvas-based text measurement & layout
//
// This modifier does things CSS CANNOT do. It uses canvas
// measureText() for measurement — no DOM reads for text.
//
// Features:
//   data-pretext-fit-text          — binary-search font size to fill width
//   data-pretext-min-size="16"     — min font px for fit-text
//   data-pretext-max-size="72"     — max font px for fit-text
//   data-pretext-flow              — multi-column text with obstacle routing
//   data-pretext-columns="3"       — number of columns
//   data-pretext-gap="24"          — column gap in px
//   data-pretext-balance           — balance column heights
//   data-pretext-content           — marks text source element
//   data-pretext-obstacle="circle" — marks obstacle (circle|rect)
//   data-pretext-padding="10"      — obstacle padding in px
//
// For DOM-based visibility management (if-fits, priority),
// use the FitsModifier from ./fits-modifier instead.
// ══════════════════════════════════════════════════════════════

// ── Canvas measurement engine ──

let _ctx: CanvasRenderingContext2D | null = null;
const _caches = new Map<string, Map<string, number>>();

function ctx(): CanvasRenderingContext2D {
  if (_ctx) return _ctx;
  _ctx = document.createElement('canvas').getContext('2d')!;
  return _ctx;
}

function measureWord(text: string, font: string): number {
  let cache = _caches.get(font);
  if (!cache) { cache = new Map(); _caches.set(font, cache); }
  let w = cache.get(text);
  if (w !== undefined) return w;
  const c = ctx(); c.font = font;
  w = c.measureText(text).width;
  cache.set(text, w);
  return w;
}

function getGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const s = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const r: string[] = []; for (const g of s.segment(text)) r.push(g.segment); return r;
  }
  return Array.from(text);
}

// ── Prepared text ──

interface Prepared {
  widths: number[];
  kinds: string[];
  breakWidths: (number[] | null)[];
  segs: string[];
}

function prepare(text: string, font: string): Prepared {
  let norm = text.replace(/[\t\n\r\f ]+/g, ' ');
  if (norm.charAt(0) === ' ') norm = norm.slice(1);
  if (norm.length > 0 && norm.charAt(norm.length - 1) === ' ') norm = norm.slice(0, -1);
  const widths: number[] = []; const kinds: string[] = [];
  const breakWidths: (number[] | null)[] = []; const segs: string[] = [];
  if (!norm) return { widths, kinds, breakWidths, segs };
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word' });
    for (const s of seg.segment(norm)) {
      const t = s.segment;
      if (t === ' ') { widths.push(measureWord(' ', font)); kinds.push('s'); breakWidths.push(null); segs.push(t); }
      else {
        if (segs.length > 0 && kinds[kinds.length - 1] === 't' && !s.isWordLike && '.,:;!?)]\'"'.indexOf(t) >= 0) {
          const i = segs.length - 1; segs[i] = segs[i] + t; widths[i] = measureWord(segs[i]!, font);
          const gs = getGraphemes(segs[i]!);
          if (gs.length > 1) { const gw: number[] = []; for (const g of gs) gw.push(measureWord(g, font)); breakWidths[i] = gw; }
        } else {
          widths.push(measureWord(t, font)); kinds.push('t'); segs.push(t);
          if (s.isWordLike && t.length > 1) {
            const gs = getGraphemes(t);
            if (gs.length > 1) { const gw: number[] = []; for (const g of gs) gw.push(measureWord(g, font)); breakWidths.push(gw); }
            else breakWidths.push(null);
          } else breakWidths.push(null);
        }
      }
    }
  } else {
    const words = norm.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i > 0) { widths.push(measureWord(' ', font)); kinds.push('s'); breakWidths.push(null); segs.push(' '); }
      if (words[i]!.length > 0) { widths.push(measureWord(words[i]!, font)); kinds.push('t'); segs.push(words[i]!); breakWidths.push(null); }
    }
  }
  return { widths, kinds, breakWidths, segs };
}

interface Line { text: string; width: number; endSI: number; endGI: number; }

function nextLine(p: Prepared, si: number, gi: number, maxW: number): Line | null {
  const { widths, kinds, breakWidths, segs } = p;
  if (gi === 0) { while (si < widths.length && kinds[si] === 's') si++; }
  if (si >= widths.length) return null;
  let lw = 0; let has = false; let lt = ''; let bkT = ''; let bkSI = -1; let bkW = 0;
  if (gi > 0 && breakWidths[si]) {
    const gw = breakWidths[si]!; const gs = getGraphemes(segs[si]!);
    for (let g = gi; g < gw.length; g++) {
      if (has && lw + gw[g]! > maxW + 0.01) return { text: lt, width: lw, endSI: si, endGI: g };
      lw += gw[g]!; lt += gs[g]!; has = true;
    }
    si++; gi = 0;
  }
  while (si < widths.length) {
    const w = widths[si]!; const k = kinds[si]!;
    if (!has) {
      if (w > maxW && breakWidths[si]) {
        const gw = breakWidths[si]!; const gs = getGraphemes(segs[si]!);
        for (let g = 0; g < gw.length; g++) {
          if (has && lw + gw[g]! > maxW + 0.01) return { text: lt, width: lw, endSI: si, endGI: g };
          lw += gw[g]!; lt += gs[g]!; has = true;
        }
        si++; continue;
      }
      lw = w; lt = segs[si]!; has = true;
      if (k === 's') { bkSI = si + 1; bkW = 0; bkT = ''; }
      si++; continue;
    }
    if (lw + w > maxW + 0.01) {
      if (k === 's') return { text: lt.trimEnd(), width: lw, endSI: si + 1, endGI: 0 };
      if (bkSI >= 0) return { text: bkT.trimEnd(), width: bkW, endSI: bkSI, endGI: 0 };
      return { text: lt.trimEnd(), width: lw, endSI: si, endGI: 0 };
    }
    lw += w; lt += segs[si]!;
    if (k === 's') { bkSI = si + 1; bkW = lw - w; bkT = lt.slice(0, -1); }
    si++;
  }
  if (!has) return null;
  return { text: lt.trimEnd(), width: lw, endSI: si, endGI: 0 };
}

function countLines(p: Prepared, maxW: number): number {
  let si = 0; let gi = 0; let n = 0;
  let l = nextLine(p, si, gi, maxW);
  while (l) {
    n++;
    si = l.endSI;
    gi = l.endGI;
    l = nextLine(p, si, gi, maxW);
  }
  return n;
}

// ── Obstacle geometry ──

function circleClip(cx: number, cy: number, r: number, pad: number, lt: number, lb: number, colX: number, colW: number): number {
  if (Math.max(lt, cy - r) >= Math.min(lb, cy + r)) return colW;
  const dy = (lt + lb) / 2 - cy; if (Math.abs(dy) >= r) return colW;
  const hc = Math.sqrt(r * r - dy * dy);
  if (cx > colX + colW / 2) return Math.min(colW, Math.max(0, cx - hc - pad - colX));
  return Math.min(colW, Math.max(0, colX + colW - (cx + hc + pad)));
}

function circleOffset(cx: number, cy: number, r: number, pad: number, lt: number, lb: number, colX: number, colW: number): number {
  if (Math.max(lt, cy - r) >= Math.min(lb, cy + r)) return 0;
  const dy = (lt + lb) / 2 - cy; if (Math.abs(dy) >= r) return 0;
  const hc = Math.sqrt(r * r - dy * dy);
  if (cx <= colX + colW / 2) return Math.max(0, cx + hc + pad - colX);
  return 0;
}

// ── Line pool for flow ──

function syncLines(pool: HTMLDivElement[], count: number, parent: HTMLElement, font: string, lh: number, color: string): void {
  while (pool.length < count) {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;white-space:pre;pointer-events:auto;user-select:text;-webkit-user-select:text;';
    el.style.font = font; el.style.lineHeight = lh + 'px'; el.style.color = color;
    parent.appendChild(el); pool.push(el);
  }
  for (let i = 0; i < pool.length; i++) pool[i]!.style.display = i < count ? '' : 'none';
}

// ── fit-text ──

function applyFitText(el: HTMLElement): void {
  const text = el.textContent || '';
  if (!text.trim()) return;
  const container = el.parentElement;
  if (!container) return;
  const maxW = container.clientWidth || el.clientWidth;
  if (maxW <= 0) return;
  const minS = parseInt(el.getAttribute('data-pretext-min-size') || '12', 10);
  const maxS = parseInt(el.getAttribute('data-pretext-max-size') || '96', 10);
  const cs = getComputedStyle(el);
  const family = cs.fontFamily || 'Georgia, serif';
  const weight = cs.fontWeight || '700';
  let lo = minS; let hi = maxS;
  const c = ctx();
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    c.font = weight + ' ' + mid + 'px ' + family;
    if (c.measureText(text).width <= maxW * 0.95) lo = mid; else hi = mid;
  }
  el.style.fontSize = lo + 'px';
  el.style.lineHeight = '1.1';
}

// ── flow ──

interface FlowState { linePool: HTMLDivElement[]; ruleEls: HTMLDivElement[]; }
const _flowStates = new WeakMap<HTMLElement, FlowState>();

function applyFlow(container: HTMLElement): void {
  const cols = parseInt(container.getAttribute('data-pretext-columns') || '1', 10);
  const gap = parseInt(container.getAttribute('data-pretext-gap') || '24', 10);
  const balance = container.hasAttribute('data-pretext-balance');
  const cs = getComputedStyle(container);
  const font = container.getAttribute('data-pretext-font') || cs.font;
  const lh = parseInt(container.getAttribute('data-pretext-line-height') || '', 10) || parseFloat(cs.lineHeight) || 20;
  const color = cs.color || '#1a1a1a';
  const W = container.clientWidth;
  const H = container.clientHeight;
  if (W <= 0) return;

  let state = _flowStates.get(container);
  if (!state) { state = { linePool: [], ruleEls: [] }; _flowStates.set(container, state); }

  const contentEl = container.querySelector('[data-pretext-content]') as HTMLElement | null;
  if (!contentEl) return;
  const text = contentEl.textContent || '';
  contentEl.style.display = 'none';

  interface Obstacle { cx: number; cy: number; r: number; pad: number; shape: string; rect: DOMRect; }
  const obstacles: Obstacle[] = [];
  const obsEls = container.querySelectorAll('[data-pretext-obstacle]');
  const containerRect = container.getBoundingClientRect();
  for (const obsEl of obsEls) {
    const shape = (obsEl as HTMLElement).getAttribute('data-pretext-obstacle') || 'rect';
    const pad = parseInt((obsEl as HTMLElement).getAttribute('data-pretext-padding') || '10', 10);
    const rect = obsEl.getBoundingClientRect();
    const relX = rect.left - containerRect.left;
    const relY = rect.top - containerRect.top;
    const cx = relX + rect.width / 2;
    const cy = relY + rect.height / 2;
    const r = shape === 'circle' ? Math.max(rect.width, rect.height) / 2 : 0;
    obstacles.push({ cx, cy, r, pad, shape, rect: new DOMRect(relX, relY, rect.width, rect.height) });
  }

  const colW = (W - gap * (cols - 1)) / cols;
  const p = prepare(text, font);

  let targetH = H || 99999;
  if (balance) {
    const totalN = countLines(p, colW);
    const linesPerCol = Math.ceil(totalN / cols);
    targetH = linesPerCol * lh + lh;
  }

  while (state.ruleEls.length < cols - 1) {
    const rule = document.createElement('div');
    rule.style.cssText = 'position:absolute;top:0;width:1px;pointer-events:none;';
    rule.style.background = 'rgba(128,128,128,0.15)';
    container.appendChild(rule); state.ruleEls.push(rule);
  }
  for (let i = 0; i < state.ruleEls.length; i++) {
    if (i < cols - 1) {
      state.ruleEls[i]!.style.left = ((i + 1) * (colW + gap) - gap / 2) + 'px';
      state.ruleEls[i]!.style.height = targetH + 'px'; state.ruleEls[i]!.style.display = '';
    } else { state.ruleEls[i]!.style.display = 'none'; }
  }

  interface PosLine { x: number; y: number; text: string; }
  const lines: PosLine[] = [];
  let si = 0; let gi = 0;

  for (let col = 0; col < cols; col++) {
    const colX = col * (colW + gap); let y = 0;
    while (y + lh <= targetH) {
      let availW = colW; let xOff = 0;
      for (const obs of obstacles) {
        if (obs.shape === 'circle') {
          const cl = circleClip(obs.cx, obs.cy, obs.r, obs.pad, y, y + lh, colX, colW);
          if (cl < availW) { availW = cl; xOff = circleOffset(obs.cx, obs.cy, obs.r, obs.pad, y, y + lh, colX, colW); }
        } else {
          const oL = obs.rect.x; const oR = obs.rect.x + obs.rect.width;
          const oT = obs.rect.y - obs.pad; const oB = obs.rect.y + obs.rect.height + obs.pad;
          if (y + lh > oT && y < oB) {
            if (oL > colX && oL < colX + colW) availW = Math.min(availW, oL - obs.pad - colX);
            if (oR > colX && oR < colX + colW) {
              const ra = colX + colW - oR - obs.pad;
              if (ra < availW) { availW = ra; xOff = oR + obs.pad - colX; }
            }
          }
        }
      }
      const line = nextLine(p, si, gi, Math.max(20, availW));
      if (!line) break;
      lines.push({ x: colX + xOff, y, text: line.text });
      y += lh; si = line.endSI; gi = line.endGI;
    }
    if (!nextLine(p, si, gi, colW)) break;
  }

  syncLines(state.linePool, lines.length, container, font, lh, color);
  for (let i = 0; i < lines.length; i++) {
    state.linePool[i]!.textContent = lines[i]!.text;
    state.linePool[i]!.style.left = lines[i]!.x + 'px';
    state.linePool[i]!.style.top = lines[i]!.y + 'px';
  }

  container.style.setProperty('--pretext-line-count', '' + lines.length);
}

// ── The modifier ──

export class PretextModifier extends Modifier {
  private _observer: ResizeObserver | null = null;
  private _rafId: number | null = null;
  private _lastW: number = 0;

  modify(container: HTMLElement) {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
    if (this._rafId !== null) { cancelAnimationFrame(this._rafId); this._rafId = null; }

    const run = () => {
      const fitTextEls = container.querySelectorAll('[data-pretext-fit-text]');
      for (const el of fitTextEls) applyFitText(el as HTMLElement);

      if (container.hasAttribute('data-pretext-flow')) applyFlow(container);
      const flowEls = container.querySelectorAll('[data-pretext-flow]');
      for (const fc of flowEls) applyFlow(fc as HTMLElement);
    };

    const scheduleRender = () => {
      if (this._rafId !== null) return;
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        const w = container.clientWidth;
        if (w === this._lastW && this._lastW > 0) return;
        this._lastW = w;
        run();
      });
    };

    run();
    this._lastW = container.clientWidth;
    this._observer = new ResizeObserver(scheduleRender);
    this._observer.observe(container);
  }
}

export default PretextModifier;
