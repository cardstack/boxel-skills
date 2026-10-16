---
title: Never Write Tracked State During Render
impact: HIGH
impactDescription: Prevents backtracking assertions, stale renders, and revalidation loops
tags: components, tracked, reactivity, modifiers, focus
---

## Never Write Tracked State During Render

A render that has read a tracked property must not write it. Development builds throw `You attempted to update `x`, but it had already been used previously in the same computation`; production builds strip that assertion, so the same bug shows as a stale or looping render.

Usual sources:

- A `focusout`/`blur` close handler: browsers fire it synchronously while a focused element is removed, so it runs inside the render that removed it.
- A modifier that reads, then writes, the same tracked field.
- A getter-built array or object passed to a modifier: a fresh reference every render re-runs it.

Derive instead of store: clamp an "open id" or "active index" in a getter against the current data, so nothing has to reset it. De-duplicate a modifier against a plain (untracked) field. Pass modifiers primitives (an id, a joined string). Defer only the DOM half of a change (focus, scroll), never the tracked write.

**Incorrect → Correct:**

```javascript
// ❌ stored; a focusout that fires mid-render resets it
@tracked openId = null;
@action close() { this.openId = null; }

// ✅ derived: vanishes with its row, nothing to reset
@tracked requestedId = null;
get openId() {
  let live = this.args.items.some((i) => i.id === this.requestedId);
  return live ? this.requestedId : null;
}
@action close() {
  if (this.openId !== null) this.requestedId = null;
}
```

Reference: [Autotracking in depth](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
