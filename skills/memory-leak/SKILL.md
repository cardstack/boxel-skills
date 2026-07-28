---
name: memory-leak
description: Run a lifecycle and allocation audit near completion of Boxel builds that use animation frames, timers, media, canvas/WebGL, observers, object URLs, fetches, or subscriptions, and whenever a leak is suspected. Do not load this skill on every turn.
---

# Memory-leak completion gate

Use this once when an interactive or media-heavy build is close to complete, before browser soak testing or publication. Use it immediately when memory growth is reported. Do not make it a per-turn ritual.

This workspace adaptation is based on the `component-memory-leaks` rule in the monorepo's `ember-best-practices` skill. It extends that Ember lifecycle guidance for Boxel cards and GPU-backed Manim/canvas fields.

## Static audit first

Do not open a page known to exhaust memory before completing this audit.

1. Search authored code for `requestAnimationFrame`, timers, event listeners, observers, subscriptions, fetches, workers, object URLs, audio/video contexts, renderers, scenes, geometries, materials, and textures.
2. Pair every acquired resource with cleanup owned by the same component or modifier:
   - `requestAnimationFrame` / `cancelAnimationFrame`
   - `setInterval` / `clearInterval`
   - `setTimeout` / `clearTimeout`
   - `addEventListener` / `removeEventListener` using the same function and compatible options
   - `observe` / `disconnect`, `subscribe` / `unsubscribe`
   - `fetch(signal)` / `AbortController.abort()`
   - `URL.createObjectURL` / `URL.revokeObjectURL`
   - renderer, scene, mobject, geometry, material, texture, worker, and audio-context creation / `dispose`, `terminate`, or `close`
3. Prefer modifier cleanup functions for DOM-owned resources. Use `registerDestructor` for resources owned by a long-lived Glimmer object without a DOM modifier.
4. Confirm cleanup is idempotent and runs both when dependencies change and when the card unmounts.

## Hot-loop allocation gate

Treat audio clocks, animation frames, pointer moves, scrolling, and reactive render passes as hot loops.

- Never construct replacement scenes, Mobjects, WebGL geometries/materials, media blobs, or large arrays on every tick.
- Create persistent render objects once and mutate their bounded numeric state in place.
- Rebuild only when topology or preset identity changes; dispose the old scene objects before replacement.
- Cap tracked UI invalidation to the cadence the lesson actually needs (normally 20–30 fps for timeline-driven diagrams), and skip insignificant scalar changes.
- Ensure a repeated `playing`, mount, or dependency-change event cannot start a second animation loop.
- Keep runtime objects out of tracked card data and serialized JSON.

## Verification after the static fix

Only after the leak path is removed:

1. Run Boxel file lint locally.
2. Exercise mount → play → pause → seek → manual mode → resume → unmount with a deliberately short run.
3. Watch browser-process memory and WebGL resource counts. Stop immediately on monotonic explosive growth.
4. Repeat the short cycle several times. Memory may fluctuate, but must return to a bounded plateau after garbage collection.
5. Run the normal render smoke test, then publish.

Document the leak's acquisition path, cleanup owner, hot-loop bound, and verification result in the handoff.
