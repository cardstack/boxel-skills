import {
  CardDef,
  Component,
  field,
  contains,
} from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';
import TextAreaField from 'https://cardstack.com/base/text-area';
import SparklesIcon from '@cardstack/boxel-icons/sparkles';
import Modifier from 'ember-modifier';

// ══════════════════════════════════════════════════════════════
// Pretext Engine (inlined) — canvas for MEASUREMENT only
// ══════════════════════════════════════════════════════════════

let _measureCtx: CanvasRenderingContext2D | null = null;
const _metricCaches = new Map<string, Map<string, number>>();

function getMeasureCtx(): CanvasRenderingContext2D {
  if (_measureCtx) return _measureCtx;
  const c = document.createElement('canvas');
  _measureCtx = c.getContext('2d')!;
  return _measureCtx;
}

function getMetricCache(font: string): Map<string, number> {
  let cache = _metricCaches.get(font);
  if (!cache) { cache = new Map(); _metricCaches.set(font, cache); }
  return cache;
}

function measureSeg(text: string, font: string, cache: Map<string, number>): number {
  let w = cache.get(text);
  if (w !== undefined) return w;
  const ctx = getMeasureCtx();
  ctx.font = font;
  w = ctx.measureText(text).width;
  cache.set(text, w);
  return w;
}

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const result: string[] = [];
    for (const g of segmenter.segment(text)) result.push(g.segment);
    return result;
  }
  return Array.from(text);
}

interface PreparedText {
  widths: number[];
  kinds: string[];
  breakableWidths: (number[] | null)[];
  segments: string[];
}

function prepareText(text: string, font: string): PreparedText {
  let normalized = text.replace(/[\t\n\r\f ]+/g, ' ');
  if (normalized.charAt(0) === ' ') normalized = normalized.slice(1);
  if (normalized.length > 0 && normalized.charAt(normalized.length - 1) === ' ') normalized = normalized.slice(0, -1);
  const cache = getMetricCache(font);
  const widths: number[] = []; const kinds: string[] = [];
  const breakableWidths: (number[] | null)[] = []; const segments: string[] = [];
  if (normalized.length === 0) return { widths, kinds, breakableWidths, segments };
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
    for (const seg of segmenter.segment(normalized)) {
      const t = seg.segment;
      if (t === ' ') {
        widths.push(measureSeg(' ', font, cache)); kinds.push('space');
        breakableWidths.push(null); segments.push(t);
      } else {
        if (segments.length > 0 && kinds[kinds.length - 1] === 'text' && !seg.isWordLike && '.,:;!?)]\'"'.indexOf(t) >= 0) {
          const pi = segments.length - 1;
          segments[pi] = segments[pi] + t;
          widths[pi] = measureSeg(segments[pi]!, font, cache);
          if (segments[pi]!.length > 1) {
            const gs = splitGraphemes(segments[pi]!);
            if (gs.length > 1) { const gw: number[] = []; for (const g of gs) gw.push(measureSeg(g, font, cache)); breakableWidths[pi] = gw; }
          }
        } else {
          widths.push(measureSeg(t, font, cache)); kinds.push('text'); segments.push(t);
          if (seg.isWordLike && t.length > 1) {
            const gs = splitGraphemes(t);
            if (gs.length > 1) { const gw: number[] = []; for (const g of gs) gw.push(measureSeg(g, font, cache)); breakableWidths.push(gw); }
            else breakableWidths.push(null);
          } else breakableWidths.push(null);
        }
      }
    }
  } else {
    const words = normalized.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i > 0) { widths.push(measureSeg(' ', font, cache)); kinds.push('space'); breakableWidths.push(null); segments.push(' '); }
      const word = words[i]!;
      if (word.length > 0) { widths.push(measureSeg(word, font, cache)); kinds.push('text'); segments.push(word); breakableWidths.push(null); }
    }
  }
  return { widths, kinds, breakableWidths, segments };
}

interface LayoutLine { text: string; width: number; endSegmentIndex: number; endGraphemeIndex: number; }

function layoutNextLine(prepared: PreparedText, startSI: number, startGI: number, maxWidth: number): LayoutLine | null {
  const { widths, kinds, breakableWidths, segments } = prepared;
  let si = startSI; let gi = startGI;
  if (gi === 0) { while (si < widths.length && kinds[si] === 'space') si++; }
  if (si >= widths.length) return null;
  let lineW = 0; let hasContent = false; let lineText = '';
  let lastBreakText = ''; let lastBreakSI = -1; let lastBreakW = 0;
  if (gi > 0 && breakableWidths[si] !== null) {
    const gWidths = breakableWidths[si]!; const graphemes = splitGraphemes(segments[si]!);
    for (let g = gi; g < gWidths.length; g++) {
      const gw = gWidths[g]!;
      if (hasContent && lineW + gw > maxWidth + 0.01) return { text: lineText, width: lineW, endSegmentIndex: si, endGraphemeIndex: g };
      lineW += gw; lineText += graphemes[g]!; hasContent = true;
    }
    si++; gi = 0;
  }
  while (si < widths.length) {
    const w = widths[si]!; const kind = kinds[si]!;
    if (!hasContent) {
      if (w > maxWidth && breakableWidths[si] !== null) {
        const gWidths = breakableWidths[si]!; const graphemes = splitGraphemes(segments[si]!);
        for (let g = 0; g < gWidths.length; g++) {
          const gw = gWidths[g]!;
          if (hasContent && lineW + gw > maxWidth + 0.01) return { text: lineText, width: lineW, endSegmentIndex: si, endGraphemeIndex: g };
          lineW += gw; lineText += graphemes[g]!; hasContent = true;
        }
        si++; continue;
      }
      lineW = w; lineText = segments[si]!; hasContent = true;
      if (kind === 'space') { lastBreakSI = si + 1; lastBreakW = 0; lastBreakText = ''; }
      si++; continue;
    }
    const newW = lineW + w;
    if (newW > maxWidth + 0.01) {
      if (kind === 'space') return { text: lineText.trimEnd(), width: lineW, endSegmentIndex: si + 1, endGraphemeIndex: 0 };
      if (lastBreakSI >= 0) return { text: lastBreakText.trimEnd(), width: lastBreakW, endSegmentIndex: lastBreakSI, endGraphemeIndex: 0 };
      return { text: lineText.trimEnd(), width: lineW, endSegmentIndex: si, endGraphemeIndex: 0 };
    }
    lineW = newW; lineText += segments[si]!;
    if (kind === 'space') { lastBreakSI = si + 1; lastBreakW = lineW - w; lastBreakText = lineText.slice(0, -1); }
    si++;
  }
  if (!hasContent) return null;
  return { text: lineText.trimEnd(), width: lineW, endSegmentIndex: si, endGraphemeIndex: 0 };
}

// ══════════════════════════════════════════════════════════════
// Obstacle geometry
// ══════════════════════════════════════════════════════════════

function circleClipWidth(cx: number, cy: number, r: number, pad: number, lineTop: number, lineBot: number, colX: number, colW: number): number {
  const bandTop = Math.max(lineTop, cy - r); const bandBot = Math.min(lineBot, cy + r);
  if (bandTop >= bandBot) return colW;
  const yMid = (lineTop + lineBot) / 2; const dy = yMid - cy;
  if (Math.abs(dy) >= r) return colW;
  const halfChord = Math.sqrt(r * r - dy * dy);
  if (cx > colX + colW / 2) return Math.min(colW, Math.max(0, cx - halfChord - pad - colX));
  return Math.min(colW, Math.max(0, colX + colW - (cx + halfChord + pad)));
}

function circleTextOffset(cx: number, cy: number, r: number, pad: number, lineTop: number, lineBot: number, colX: number, colW: number): number {
  const bandTop = Math.max(lineTop, cy - r); const bandBot = Math.min(lineBot, cy + r);
  if (bandTop >= bandBot) return 0;
  const yMid = (lineTop + lineBot) / 2; const dy = yMid - cy;
  if (Math.abs(dy) >= r) return 0;
  const halfChord = Math.sqrt(r * r - dy * dy);
  if (cx <= colX + colW / 2) return Math.max(0, cx + halfChord + pad - colX);
  return 0;
}

// ══════════════════════════════════════════════════════════════
// DOM-based obstacle demo (matches pretext's original pattern)
// Uses real <div> elements for text — selectable, accessible
// ══════════════════════════════════════════════════════════════

// Element pool: grow when needed, toggle display for unused
// Styles applied inline because scoped CSS won't reach dynamic children
function syncLinePool(pool: HTMLDivElement[], count: number, parent: HTMLElement): void {
  while (pool.length < count) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.whiteSpace = 'pre';
    el.style.font = '15px Georgia, serif';
    el.style.lineHeight = '24px';
    el.style.color = '#e8e4dc';
    el.style.zIndex = '1';
    el.style.userSelect = 'text';
    el.style.pointerEvents = 'auto';
    parent.appendChild(el);
    pool.push(el);
  }
  for (let i = 0; i < pool.length; i++) {
    pool[i]!.style.display = i < count ? '' : 'none';
  }
}

// Persistent state across frames
let _orbState: { x: number; y: number; r: number; vx: number; vy: number } | null = null;
let _lastFrameTime: number | null = null;
let _linePool: HTMLDivElement[] = [];
let _orbEl: HTMLDivElement | null = null;
let _ruleEl: HTMLDivElement | null = null;

const BODY_FONT = '15px Georgia, serif';
const BODY_LINE_HEIGHT = 24;

function renderObstacleDOM(stage: HTMLElement, bodyText: string, now: number): boolean {
  if (!bodyText) return false;
  const W = stage.clientWidth;
  const H = stage.clientHeight || 500;
  if (W <= 0) return false;

  // Create orb element once (inline styles for scoped CSS compat)
  if (!_orbEl) {
    _orbEl = document.createElement('div');
    _orbEl.style.position = 'absolute';
    _orbEl.style.borderRadius = '50%';
    _orbEl.style.pointerEvents = 'none';
    _orbEl.style.zIndex = '10';
    _orbEl.style.willChange = 'transform';
    _orbEl.style.background = 'radial-gradient(circle at 35% 35%, rgba(217,119,87,0.35), rgba(217,119,87,0.12) 55%, transparent 72%)';
    _orbEl.style.boxShadow = '0 0 60px 15px rgba(217,119,87,0.18), 0 0 120px 40px rgba(217,119,87,0.07)';
    stage.appendChild(_orbEl);
  }

  // Create column rule once
  if (!_ruleEl) {
    _ruleEl = document.createElement('div');
    _ruleEl.style.position = 'absolute';
    _ruleEl.style.top = '0';
    _ruleEl.style.width = '1px';
    _ruleEl.style.background = 'rgba(232,228,220,0.1)';
    _ruleEl.style.pointerEvents = 'none';
    _ruleEl.style.zIndex = '0';
    stage.appendChild(_ruleEl);
  }

  // Initialize orb physics
  if (!_orbState) {
    _orbState = { x: W * 0.6, y: H * 0.4, r: Math.min(W * 0.14, 90), vx: 35, vy: 22 };
  }

  const orb = _orbState;
  orb.r = Math.min(W * 0.14, 90);

  // Physics (Euler + wall bounce)
  const dt = _lastFrameTime ? Math.min((now - _lastFrameTime) / 1000, 0.05) : 0.016;
  _lastFrameTime = now;
  orb.x += orb.vx * dt;
  orb.y += orb.vy * dt;
  if (orb.x - orb.r < 0) { orb.x = orb.r; orb.vx = Math.abs(orb.vx); }
  if (orb.x + orb.r > W) { orb.x = W - orb.r; orb.vx = -Math.abs(orb.vx); }
  if (orb.y - orb.r < 0) { orb.y = orb.r; orb.vy = Math.abs(orb.vy); }
  if (orb.y + orb.r > H) { orb.y = H - orb.r; orb.vy = -Math.abs(orb.vy); }

  // Position orb DOM element
  _orbEl.style.left = (orb.x - orb.r) + 'px';
  _orbEl.style.top = (orb.y - orb.r) + 'px';
  _orbEl.style.width = (orb.r * 2) + 'px';
  _orbEl.style.height = (orb.r * 2) + 'px';

  // Layout text in 2 columns with obstacle routing
  const gap = 28;
  const cols = 2;
  const colW = (W - gap * (cols - 1)) / cols;
  const prepared = prepareText(bodyText, BODY_FONT);

  // Position column rule
  _ruleEl.style.left = (colW + gap / 2) + 'px';
  _ruleEl.style.height = H + 'px';

  // Compute all line positions
  interface PosLine { x: number; y: number; text: string; }
  const lines: PosLine[] = [];
  let si = 0; let gi = 0;

  for (let col = 0; col < cols; col++) {
    const colX = col * (colW + gap);
    let y = 0;

    while (y + BODY_LINE_HEIGHT <= H) {
      let availW = colW;
      let xOff = 0;
      const clipped = circleClipWidth(orb.x, orb.y, orb.r + 12, 14, y, y + BODY_LINE_HEIGHT, colX, colW);
      if (clipped < availW) {
        availW = clipped;
        xOff = circleTextOffset(orb.x, orb.y, orb.r + 12, 14, y, y + BODY_LINE_HEIGHT, colX, colW);
      }

      const line = layoutNextLine(prepared, si, gi, availW);
      if (line === null) break;

      lines.push({ x: colX + xOff, y, text: line.text });
      y += BODY_LINE_HEIGHT;
      si = line.endSegmentIndex;
      gi = line.endGraphemeIndex;
    }

    const peek = layoutNextLine(prepared, si, gi, colW);
    if (peek === null) break;
  }

  // Sync DOM pool and render lines
  syncLinePool(_linePool, lines.length, stage);
  for (let i = 0; i < lines.length; i++) {
    const el = _linePool[i]!;
    const ln = lines[i]!;
    el.textContent = ln.text;
    el.style.left = ln.x + 'px';
    el.style.top = ln.y + 'px';
  }

  return true;
}

// Modifier: RAF animation loop + ResizeObserver
class AnimatedObstacle extends Modifier {
  private _rafId: number | null = null;
  private _observer: ResizeObserver | null = null;
  private _running = true;

  modify(stage: HTMLElement, [bodyText]: [string]) {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
    if (this._rafId !== null) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    this._running = true;

    const scheduleRender = () => {
      if (this._rafId !== null || !this._running) return;
      this._rafId = requestAnimationFrame((now) => {
        this._rafId = null;
        if (!this._running) return;
        const stillAnimating = renderObstacleDOM(stage, bodyText, now);
        if (stillAnimating) scheduleRender();
      });
    };

    scheduleRender();

    this._observer = new ResizeObserver(scheduleRender);
    this._observer.observe(stage);
  }
}

// Auto-fit headline via binary search
class FitHeadline extends Modifier {
  modify(element: HTMLElement) {
    const text = element.textContent || '';
    if (!text.trim()) return;
    const container = element.parentElement;
    if (!container) return;
    const maxWidth = container.clientWidth;
    if (maxWidth <= 0) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const fontFamily = getComputedStyle(element).fontFamily || 'Georgia, serif';
    const fontWeight = getComputedStyle(element).fontWeight || '700';
    let lo = 24; let hi = 100;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      ctx.font = fontWeight + ' ' + mid + 'px ' + fontFamily;
      if (ctx.measureText(text).width <= maxWidth * 0.92) lo = mid; else hi = mid;
    }
    element.style.fontSize = lo + 'px';
    element.style.lineHeight = '1.1';
  }
}

// ══════════════════════════════════════════════════════════════
// Card Definition
// ══════════════════════════════════════════════════════════════

export class PretextShowcase extends CardDef {
  static displayName = 'Pretext Showcase';
  static icon = SparklesIcon;
  static prefersWideFormat = true;

  @field title = contains(StringField);
  @field subtitle = contains(StringField);
  @field bodyText = contains(TextAreaField);

  @field cardTitle = contains(StringField, {
    computeVia: function (this: PretextShowcase) {
      return this.title ?? 'Pretext Showcase';
    },
  });

  static isolated = class Isolated extends Component<typeof PretextShowcase> {
    fitHeadline = FitHeadline;
    animatedObstacle = AnimatedObstacle;

    <template>
      <div class="showcase">

        {{! ── HERO ── }}
        <section class="hero">
          <svg class="hero-bg" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(217,119,87,0.12)" />
                <stop offset="50%" style="stop-color:rgba(100,140,255,0.06)" />
                <stop offset="100%" style="stop-color:rgba(196,163,90,0.1)" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(217,119,87,0)" />
                <stop offset="30%" style="stop-color:rgba(217,119,87,0.4)" />
                <stop offset="70%" style="stop-color:rgba(100,140,255,0.3)" />
                <stop offset="100%" style="stop-color:rgba(100,140,255,0)" />
              </linearGradient>
            </defs>
            <rect width="1200" height="400" fill="url(#grad1)" />
            <path class="hero-wave hero-wave-1" d="M0,280 C200,220 400,320 600,260 S1000,300 1200,240" stroke="url(#lineGrad)" stroke-width="1" fill="none" />
            <path class="hero-wave hero-wave-2" d="M0,300 C300,250 500,350 700,280 S1000,320 1200,270" stroke="url(#lineGrad)" stroke-width="0.6" fill="none" opacity="0.5" />
            <path class="hero-wave hero-wave-3" d="M0,320 C150,290 350,360 550,300 S850,340 1200,290" stroke="url(#lineGrad)" stroke-width="0.4" fill="none" opacity="0.3" />
            <g opacity="0.08">
              <circle cx="100" cy="60" r="1.5" fill="#e8e4dc" /><circle cx="140" cy="60" r="1.5" fill="#e8e4dc" /><circle cx="180" cy="60" r="1.5" fill="#e8e4dc" /><circle cx="220" cy="60" r="1.5" fill="#e8e4dc" /><circle cx="260" cy="60" r="1.5" fill="#e8e4dc" />
              <circle cx="100" cy="100" r="1.5" fill="#e8e4dc" /><circle cx="140" cy="100" r="1.5" fill="#e8e4dc" /><circle cx="180" cy="100" r="1.5" fill="#e8e4dc" /><circle cx="220" cy="100" r="1.5" fill="#e8e4dc" /><circle cx="260" cy="100" r="1.5" fill="#e8e4dc" />
              <circle cx="100" cy="140" r="1.5" fill="#e8e4dc" /><circle cx="140" cy="140" r="1.5" fill="#e8e4dc" /><circle cx="180" cy="140" r="1.5" fill="#e8e4dc" /><circle cx="220" cy="140" r="1.5" fill="#e8e4dc" /><circle cx="260" cy="140" r="1.5" fill="#e8e4dc" />
            </g>
          </svg>
          <div class="hero-content">
            <div class="hero-badge">INTERACTIVE DEMO</div>
            <div class="headline-wrap">
              <h1 class="headline" {{this.fitHeadline}}>{{@model.title}}</h1>
            </div>
            {{#if @model.subtitle}}
              <p class="hero-subtitle">{{@model.subtitle}}</p>
            {{/if}}
          </div>
        </section>

        <svg class="divider" viewBox="0 0 1200 3" preserveAspectRatio="none">
          <line x1="0" y1="1.5" x2="1200" y2="1.5" stroke="rgba(217,119,87,0.4)" stroke-width="1" />
        </svg>

        {{! ── TWO PHASES ── }}
        <section class="section phases-section">
          <div class="section-label">The Architecture</div>
          <h2 class="section-title">Two Phases, Worlds Apart</h2>
          <p class="section-body">
            Pretext splits text layout into two phases. Phase 1 (prepare) segments text and measures each word via canvas &mdash; expensive but runs only once. Phase 2 (layout) is pure arithmetic on cached widths &mdash; fast enough for 60fps resize.
          </p>
          <div class="timing-chart">
            <div class="timing-row">
              <span class="timing-label">prepare()</span>
              <div class="timing-bar-wrap">
                <div class="timing-bar timing-bar-prepare"></div>
              </div>
              <span class="timing-value">~19ms</span>
            </div>
            <div class="timing-row">
              <span class="timing-label">layout()</span>
              <div class="timing-bar-wrap">
                <div class="timing-bar timing-bar-layout"></div>
              </div>
              <span class="timing-value">~0.09ms</span>
            </div>
          </div>
          <p class="timing-caption">211&times; faster. That&rsquo;s the difference between measuring and just counting.</p>
        </section>

        <svg class="divider" viewBox="0 0 1200 20" preserveAspectRatio="none">
          <line x1="200" y1="10" x2="1000" y2="10" stroke="rgba(232,228,220,0.08)" stroke-width="0.5" />
          <circle cx="600" cy="10" r="3" fill="rgba(217,119,87,0.3)" />
        </svg>

        {{! ── OBSTACLE ROUTING (DOM rendered) ── }}
        <section class="section obstacle-section">
          <div class="section-label">Live Demo</div>
          <h2 class="section-title">Text Flows Around Obstacles</h2>
          <p class="section-body">
            The orb below bounces continuously. On every frame, each line&rsquo;s available width is recalculated based on where the orb is &mdash; and pretext reflows the text in under 0.1ms. The text below is real, selectable DOM &mdash; not a canvas bitmap.
          </p>
          <div
            class="stage"
            {{this.animatedObstacle @model.bodyText}}
          ></div>
        </section>

        <svg class="divider" viewBox="0 0 1200 20" preserveAspectRatio="none">
          <line x1="200" y1="10" x2="1000" y2="10" stroke="rgba(232,228,220,0.08)" stroke-width="0.5" />
          <circle cx="600" cy="10" r="3" fill="rgba(100,140,255,0.3)" />
        </svg>

        {{! ── GEOMETRY EXPLAINER ── }}
        <section class="section geometry-section">
          <div class="section-label">The Math</div>
          <h2 class="section-title">Circle-Line Intersection</h2>
          <p class="section-body">
            For each line of text, we compute how much horizontal space the obstacle occupies at that vertical position. The chord width follows from the Pythagorean theorem: halfChord = &radic;(r&sup2; &minus; dy&sup2;). The remaining space is what pretext gets as maxWidth.
          </p>
          <div class="geometry-diagram">
            <svg viewBox="0 0 500 360" class="geometry-svg">
              <defs>
                <linearGradient id="chordGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgba(217,119,87,0.6)" />
                  <stop offset="100%" style="stop-color:rgba(217,119,87,0.6)" />
                </linearGradient>
              </defs>
              <rect x="20" y="20" width="460" height="320" rx="4" fill="rgba(232,228,220,0.03)" stroke="rgba(232,228,220,0.08)" stroke-width="0.5" />
              <circle cx="300" cy="180" r="100" fill="rgba(217,119,87,0.08)" stroke="rgba(217,119,87,0.3)" stroke-width="1.5" stroke-dasharray="6 4" />
              <line x1="300" y1="180" x2="400" y2="180" stroke="rgba(196,163,90,0.6)" stroke-width="1" />
              <text x="345" y="174" fill="rgba(196,163,90,0.8)" font-size="11" font-family="sans-serif">r</text>
              <circle cx="300" cy="180" r="3" fill="rgba(217,119,87,0.6)" />
              <line class="sweep-line" x1="20" y1="140" x2="480" y2="140" stroke="rgba(100,140,255,0.5)" stroke-width="1" />
              <line class="sweep-chord" x1="220" y1="140" x2="380" y2="140" stroke="url(#chordGrad)" stroke-width="3" stroke-linecap="round" />
              <line class="avail-left" x1="20" y1="148" x2="210" y2="148" stroke="rgba(100,200,140,0.5)" stroke-width="1.5" />
              <polygon class="avail-left-arrow" points="210,144 210,152 218,148" fill="rgba(100,200,140,0.5)" />
              <text class="avail-label-left" x="100" y="162" fill="rgba(100,200,140,0.7)" font-size="10" font-family="sans-serif" text-anchor="middle">available width</text>
              <line class="avail-right" x1="390" y1="148" x2="480" y2="148" stroke="rgba(100,200,140,0.5)" stroke-width="1.5" />
              <text class="avail-label-right" x="435" y="162" fill="rgba(100,200,140,0.7)" font-size="10" font-family="sans-serif" text-anchor="middle">available</text>
              <line x1="305" y1="140" x2="305" y2="180" stroke="rgba(196,163,90,0.4)" stroke-width="0.8" stroke-dasharray="3 3" />
              <text x="312" y="164" fill="rgba(196,163,90,0.7)" font-size="10" font-family="sans-serif">dy</text>
              <g opacity="0.25">
                <rect x="30" y="42" width="430" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="62" width="410" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="82" width="440" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="102" width="170" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="122" width="160" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="142" width="180" height="2" rx="1" fill="#e8e4dc" />
                <rect x="390" y="142" width="80" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="162" width="160" height="2" rx="1" fill="#e8e4dc" />
                <rect x="400" y="162" width="70" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="182" width="150" height="2" rx="1" fill="#e8e4dc" />
                <rect x="410" y="182" width="60" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="202" width="160" height="2" rx="1" fill="#e8e4dc" />
                <rect x="400" y="202" width="70" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="222" width="180" height="2" rx="1" fill="#e8e4dc" />
                <rect x="390" y="222" width="80" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="242" width="430" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="262" width="440" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="282" width="400" height="2" rx="1" fill="#e8e4dc" />
                <rect x="30" y="302" width="420" height="2" rx="1" fill="#e8e4dc" />
              </g>
              <text x="250" y="345" fill="rgba(232,228,220,0.5)" font-size="12" font-family="Georgia, serif" font-style="italic" text-anchor="middle">
                halfChord = &radic;(r&sup2; &minus; dy&sup2;)
              </text>
            </svg>
          </div>
        </section>

        <footer class="showcase-footer">
          <svg class="footer-rule" viewBox="0 0 600 20" preserveAspectRatio="xMidYMid meet">
            <line x1="0" y1="10" x2="260" y2="10" stroke="rgba(232,228,220,0.15)" stroke-width="0.5" />
            <circle cx="280" cy="10" r="2" fill="rgba(217,119,87,0.4)" />
            <circle cx="300" cy="10" r="3" fill="rgba(217,119,87,0.5)" />
            <circle cx="320" cy="10" r="2" fill="rgba(217,119,87,0.4)" />
            <line x1="340" y1="10" x2="600" y2="10" stroke="rgba(232,228,220,0.15)" stroke-width="0.5" />
          </svg>
          <div class="footer-text">Built with pretext &middot; DOM rendered &middot; Selectable text</div>
        </footer>
      </div>

      <style scoped>
        .showcase {
          background: radial-gradient(ellipse at 50% 30%, #13121a 0%, #0a0a0e 100%);
          color: #e8e4dc;
          font-family: Georgia, 'Times New Roman', serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero { position: relative; padding: 4rem 2.5rem 3rem; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-wave { animation: waveFloat 8s ease-in-out infinite; }
        .hero-wave-2 { animation-delay: -2.5s; animation-duration: 10s; }
        .hero-wave-3 { animation-delay: -5s; animation-duration: 12s; }
        @keyframes waveFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .hero-content { position: relative; z-index: 1; max-width: 900px; }
        .hero-badge {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.3em; color: #d97757;
          margin-bottom: 1.25rem; padding: 0.3rem 0.8rem;
          border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 20px; display: inline-block;
        }
        .headline-wrap { overflow: hidden; margin-bottom: 1rem; }
        .headline { font-weight: 700; font-size: 3rem; line-height: 1.1; letter-spacing: -0.03em; margin: 0; }
        .hero-subtitle {
          font-size: 1.15rem; font-style: italic; color: rgba(232, 228, 220, 0.55);
          line-height: 1.5; margin: 0; max-width: 680px;
        }

        /* ── Dividers ── */
        .divider { display: block; width: 100%; height: 20px; }

        /* ── Sections ── */
        .section { padding: 2.5rem; max-width: 960px; margin: 0 auto; }
        .section-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.25em; color: rgba(100, 140, 255, 0.7); margin-bottom: 0.75rem;
        }
        .section-title { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 1rem; }
        .section-body {
          font-size: 0.95rem; line-height: 1.7; color: rgba(232, 228, 220, 0.65);
          margin: 0 0 1.5rem; max-width: 640px;
        }

        /* ── Timing Chart ── */
        .timing-chart { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .timing-row { display: flex; align-items: center; gap: 1rem; }
        .timing-label {
          font-family: 'Menlo', 'Consolas', monospace; font-size: 0.75rem;
          color: rgba(232, 228, 220, 0.5); width: 80px; text-align: right;
        }
        .timing-bar-wrap {
          flex: 1; height: 24px; background: rgba(232, 228, 220, 0.04);
          border-radius: 4px; overflow: hidden;
        }
        .timing-bar { height: 100%; border-radius: 4px; animation: barGrow 1.5s ease-out forwards; transform-origin: left; }
        .timing-bar-prepare {
          width: 85%; background: linear-gradient(90deg, rgba(217, 119, 87, 0.7), rgba(217, 119, 87, 0.4));
          animation-delay: 0.3s;
        }
        .timing-bar-layout {
          width: 0.4%; min-width: 3px;
          background: linear-gradient(90deg, rgba(100, 200, 140, 0.8), rgba(100, 200, 140, 0.5));
          animation-delay: 0.8s;
        }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .timing-value { font-family: 'Menlo', 'Consolas', monospace; font-size: 0.75rem; color: rgba(232, 228, 220, 0.7); width: 60px; }
        .timing-caption { font-size: 0.8rem; font-style: italic; color: rgba(196, 163, 90, 0.6); margin: 0; }

        /* ── Stage (DOM-rendered text lines) ── */
        .obstacle-section .section-label { color: rgba(217, 119, 87, 0.7); }
        .stage {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(232, 228, 220, 0.06);
          background: rgba(232, 228, 220, 0.02);
        }

        /* Dynamic children styled inline via modifier */

        /* ── Geometry ── */
        .geometry-section .section-label { color: rgba(196, 163, 90, 0.7); }
        .geometry-diagram { max-width: 500px; margin: 0 auto; }
        .geometry-svg { width: 100%; height: auto; }
        .sweep-line, .sweep-chord { animation: sweepDown 4s ease-in-out infinite; }
        @keyframes sweepDown {
          0%, 100% { transform: translateY(-60px); opacity: 0.3; }
          25% { opacity: 0.8; }
          50% { transform: translateY(60px); opacity: 0.8; }
          75% { opacity: 0.8; }
        }

        /* ── Footer ── */
        .showcase-footer { padding: 2rem 2.5rem 3rem; text-align: center; }
        .footer-rule { width: 200px; height: 20px; margin: 0 auto 1rem; display: block; }
        .footer-text {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(232, 228, 220, 0.25);
        }
      </style>
    </template>
  };

  static embedded = class Embedded extends Component<typeof PretextShowcase> {
    <template>
      <article class="embedded">
        <div class="badge">SHOWCASE</div>
        <h3 class="title">{{@model.title}}</h3>
        {{#if @model.subtitle}}<p class="sub">{{@model.subtitle}}</p>{{/if}}
      </article>
      <style scoped>
        .embedded { padding: 0.75rem; background: radial-gradient(ellipse at 50% 30%, #1a192a 0%, #0e0e12 100%); color: #e8e4dc; font-family: Georgia, serif; }
        .badge { font-family: sans-serif; font-size: 0.5rem; font-weight: 700; letter-spacing: 0.2em; color: #d97757; margin-bottom: 0.4rem; }
        .title { font-size: 1rem; font-weight: 700; margin: 0 0 0.25rem; line-height: 1.2; }
        .sub { font-size: 0.8rem; font-style: italic; color: rgba(232,228,220,0.5); margin: 0; line-height: 1.3; }
      </style>
    </template>
  };

  static fitted = class Fitted extends Component<typeof PretextShowcase> {
    <template>
      <article class="fitted">
        <div class="badge">SHOWCASE</div>
        <h3 class="title">{{@model.title}}</h3>
      </article>
      <style scoped>
        .fitted {
          height: 100%; padding: 0.5rem;
          background: radial-gradient(ellipse at 50% 30%, #1a192a 0%, #0e0e12 100%);
          color: #e8e4dc; font-family: Georgia, serif;
          display: flex; flex-direction: column; justify-content: center;
        }
        .badge { font-family: sans-serif; font-size: 0.45rem; font-weight: 700; letter-spacing: 0.2em; color: #d97757; margin-bottom: 2px; }
        .title { font-size: 0.85rem; font-weight: 700; margin: 0; line-height: 1.15; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      </style>
    </template>
  };
}
