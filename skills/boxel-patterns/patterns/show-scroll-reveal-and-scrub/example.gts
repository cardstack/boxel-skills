import {
  CardDef,
  Component,
  field,
  contains,
  StringField,
} from '@cardstack/base/card-api';
import { modifier } from 'ember-modifier';

// 🧩 PATTERN: Scroll reveal + scroll scrub inside a Boxel card.
//
// The card scrolls inside itself — `height: 100%; overflow-y: auto` in a host
// pane — so the window is never the timeline. Every measurement here is taken
// against the card's own scroller, found by walking up the computed overflow.
//
// Read README.md for why each of these is the way it is. The short version:
//   1. IntersectionObserver `root` = the card's scroller, never null
//   2. the MODIFIER hides the element, the CSS does not (resting = finished)
//   3. once means unobserve() at the hit, not disconnect() at teardown
//   4. no vw/vh — track length comes from the scroller's measured height
//   5. data-* attributes are the JS hooks; classes are for styling only

// ---------------------------------------------------------------------------
// Shared: find the card's scroll container.
// ---------------------------------------------------------------------------

function findScroller(element: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = element.parentElement;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return node;
    }
    node = node.parentElement;
  }
  // No scroller yet (a card rendered in a pane that never scrolls). Callers
  // must treat this as "show the finished state", not as an error.
  return null;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Frame-rate-independent exponential damping. `tauMs` is the time constant:
// after tauMs the value has covered 63% of the distance, after 3 × tauMs 95%.
// A per-frame factor (`current += (target - current) * 0.1`) settles twice as
// fast on a 120 Hz screen as on 60 Hz; this does not. Shared by the lagged
// scrub below and by any pointer-follow loop.
export function damp(
  current: number,
  target: number,
  tauMs: number,
  dtMs: number,
): number {
  return current + (target - current) * (1 - Math.exp(-dtMs / tauMs));
}

// ---------------------------------------------------------------------------
// 1. revealOnScroll — a block animates in ONCE as it enters the card's view.
//
//    Sets `--reveal` from 0 to 1. The CSS fallback is 1, so with no JS at all
//    every block renders complete. Deleting this modifier must never make
//    content disappear — that is the test.
// ---------------------------------------------------------------------------

export const revealOnScroll = modifier(
  (
    element: HTMLElement,
    _positional: [],
    named: { threshold?: number; repeat?: boolean },
  ) => {
    const threshold = named.threshold ?? 0.25;
    const repeat = named.repeat ?? false;

    const show = () => element.style.setProperty('--reveal', '1');
    const hide = () => element.style.setProperty('--reveal', '0');

    const scroller = findScroller(element);
    if (prefersReducedMotion() || !scroller) {
      show();
      return;
    }

    // The modifier owns the hidden state, so a missing modifier is harmless.
    hide();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            // Once-only is the default: stop watching at the hit, not at
            // teardown, or the callback runs on every re-entry forever.
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            hide();
          }
        }
      },
      { root: scroller, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  },
);

// ---------------------------------------------------------------------------
// 2. scrollScrub — one subject's state follows scroll position, both ways.
//
//    Applied to the TRACK. Writes `--progress` (0 → 1) on the track and
//    `--scroller-h` (px) so the CSS can size the track without vw/vh.
//    Expects one `[data-scrub-stage]` descendant, which is `position: sticky`.
//
//    `lag` (ms, default 0) is the scrub-lagged system: `--progress` trails the
//    scroll position and keeps travelling after the reader stops, damped with
//    time constant `lag`. 0 is welded (1:1). CSS scroll timelines cannot lag,
//    so a lagged scrub is always this modifier.
//
//    This modifier is the default scrub engine. `animation-timeline: view()`
//    is an optional enhancement only: if a card uses it, put it under
//    `@supports (animation-timeline: view())` and do not also apply this
//    modifier to the same element, so two engines never drive one property.
// ---------------------------------------------------------------------------

export const scrollScrub = modifier(
  (
    track: HTMLElement,
    _positional: [],
    named: { restProgress?: number; lag?: number },
  ) => {
    const restProgress = named.restProgress ?? 0;
    const lag = named.lag ?? 0;

    const stage = track.querySelector('[data-scrub-stage]') as HTMLElement | null;
    // Host mode: the card IS the page. No scroller exists above the root (or the
    // root was never height-constrained), so fall back to the document scroller,
    // flag the root, and let CSS size the runway in dvh under [data-page].
    const root = track.closest('[data-motion-root]') as HTMLElement | null;
    const found = findScroller(track);
    const isPage =
      !found || (root ? root.offsetHeight > window.innerHeight * 1.5 : false);
    const scroller = found ?? (document.scrollingElement as HTMLElement | null);
    root?.toggleAttribute('data-page', isPage);

    const write = (progress: number) =>
      track.style.setProperty('--progress', progress.toFixed(4));
    // A capture waits for this instead of guessing a delay.
    const settled = (yes: boolean) => track.toggleAttribute('data-motion-settled', yes);

    // The still frame carries the composition — a subject whose composition
    // only works mid-scrub has no composition. The CSS collapses the runway
    // under reduced motion, so this frame is all there is.
    if (!stage || !scroller || prefersReducedMotion()) {
      write(restProgress);
      settled(true);
      return;
    }

    const measure = () => {
      track.style.setProperty('--scroller-h', `${scroller.clientHeight}px`);
    };

    const scrollProgress = () => {
      // Relative to the SCROLLER's box, not the viewport's. Using the raw
      // viewport top only works when the scroller happens to start at the top
      // of the screen, which is exactly the bug that survives local testing —
      // except in page mode, where the viewport is the scroller.
      const top = isPage
        ? track.getBoundingClientRect().top
        : track.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      return Math.min(1, Math.max(0, -top / travel));
    };

    // One step per frame; a scroll listener can otherwise run several times
    // between paints. Welded: write the measured value. Lagged: damp toward
    // it and keep stepping until it lands, then stop — no idle loop.
    let current: number | null = null;
    let frame = 0;
    let last = 0;
    const step = (now: number) => {
      frame = 0;
      const target = scrollProgress();
      if (!lag || current === null) {
        // The first step snaps, so a capture or a restored scroll position
        // shows the right state at once instead of gliding in from 0.
        current = target;
      } else {
        const dt = last ? Math.min(now - last, 64) : 16.7; // clamp tab-inactive gaps
        current = damp(current, target, lag, dt);
        if (Math.abs(target - current) < 0.0005) current = target; // land exactly
      }
      write(current);
      if (current !== target) {
        last = now;
        frame = requestAnimationFrame(step);
      } else {
        last = 0;
        settled(true);
      }
    };
    const schedule = () => {
      settled(false);
      if (!frame) frame = requestAnimationFrame(step);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resizeObserver.observe(scroller);

    measure();
    step(performance.now());
    const scrollTarget: EventTarget = isPage ? window : scroller;
    scrollTarget.addEventListener('scroll', schedule, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', schedule);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  },
);

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

class Isolated extends Component<typeof ScrollMotionExample> {
  reveal = revealOnScroll;
  scrub = scrollScrub;

  <template>
    <section class='piece' data-motion-root>
      <header class='intro' data-reveal {{this.reveal}}>
        <h1>{{@model.title}}</h1>
        <p>{{@model.standfirst}}</p>
      </header>

      {{! The scrubbed subject: one element, transform only. }}
      <div class='track' data-scrub-track {{this.scrub}}>
        <div class='stage' data-scrub-stage>
          <div class='subject' aria-hidden='true'></div>
          <p class='readout'>{{@model.caption}}</p>
        </div>
      </div>

      <div class='notes'>
        <p data-reveal {{this.reveal}}>Blocks arrive as you read them.</p>
        <p data-reveal {{this.reveal}}>They never leave again.</p>
      </div>
    </section>

    <style scoped>
      /* The card's own scroller. The host owns the outermost box — no radius,
         border or shadow here. */
      .piece {
        height: 100%;
        overflow-y: auto;
        container-type: inline-size;
        background: #0e0f12;
        color: #f2f0ea;
      }
      /* host mode (see README §1b): the viewport is the container */
      .piece[data-page] {
        height: auto;
        overflow: visible;
      }
      .piece[data-page] [data-scrub-track] {
        height: calc(100dvh * var(--scrub-length, 2.4));
      }
      .piece[data-page] [data-scrub-stage] {
        height: 100dvh;
      }

      /* ---- reveal ----------------------------------------------------- */
      /* Fallback is the FINISHED state: no modifier, no JS, no observer —
         still fully visible. The modifier is what hides it. */
      /* Transform only: a full-page capture never scrolls, so an opacity
         reveal would leave every block below the fold blank in it. */
      [data-reveal] {
        transform: translateY(calc((1 - var(--reveal, 1)) * 20px));
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      }

      @media (prefers-reduced-motion: reduce) {
        [data-reveal] {
          transform: none;
          transition: none;
        }
      }

      /* ---- scrub ------------------------------------------------------ */
      /* Track length is measured screenfuls of the CARD's scroller, not vh.
         --scrub-length is the one knob: how much scroll the arc is worth. */
      [data-scrub-track] {
        position: relative;
        height: calc(var(--scroller-h, 600px) * var(--scrub-length, 2.4));
        /* beats: each takes its own slice of one --progress (README, Beats) */
        --b1: clamp(0, var(--progress, 0) / 0.6, 1);
        --b2: clamp(0, (var(--progress, 0) - 0.5) / 0.5, 1);
      }

      [data-scrub-stage] {
        position: sticky;
        top: 0;
        display: grid;
        place-items: center;
        height: var(--scroller-h, 600px);
        overflow: hidden;
      }

      /* Reduced motion: rest on the still frame and collapse the runway, so
         no blank track is left behind. The review's motion-off pass injects
         the same two rules globally (design-review capture.md). */
      @media (prefers-reduced-motion: reduce) {
        [data-scrub-track],
        .piece[data-page] [data-scrub-track] {
          height: auto;
        }
        [data-scrub-stage] {
          position: static;
        }
      }

      /* transform only on the subject. Beat 1 moves decoration; the caption
         is readable at progress 0, because that is the frame every capture
         and every first view shows. */
      .subject {
        width: 40cqi;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #cfe8ff, #37506b);
        transform: translateY(calc((var(--b1) - 0.5) * 40cqi))
          rotate(calc(var(--b1) * 180deg))
          scale(calc(0.7 + var(--b1) * 0.5));
      }

      .readout {
        position: absolute;
        bottom: 1.5rem;
        transform: translateY(calc(var(--b2) * -2rem));
      }

      .intro,
      .notes {
        padding: 2rem;
      }
    </style>
  </template>
}

export class ScrollMotionExample extends CardDef {
  static displayName = 'Scroll Motion Example';

  @field standfirst = contains(StringField);
  @field caption = contains(StringField);

  static isolated = Isolated;
  // No scrub, no reveal in embedded/fitted/atom — they render inside someone
  // else's composition and have no meaningful scroll of their own.
}
