# One element: the `{{motion}}` modifier

`{{motion}}` goes on the element you already have — any HTML or SVG element, no wrapper. Its named args are Motion's props, with the same names and types.

```gts
import { motion, spring, to } from 'glimmer-motion';

const soft = spring({ bounce: 0.14, visualDuration: 0.48 });

<template>
  <article
    {{motion initial=(to opacity=0 y=12) animate=(to opacity=1 y=0) transition=soft}}
  >…</article>
</template>
```

- `to`, `spring`, `tween`, `inertia`, `stagger`, `ease` and `styles` are plain functions used as template helpers; they exist so Glint typechecks the target. `(hash …)` from `@ember/helper` also works.
- A target or transition used more than once belongs in a module constant, not inline.
- **`animate` is a target, not an event.** It re-runs whenever its value changes, so drive it from a getter over tracked state (which lives on a top-level component class, not inside `static isolated = class {…}` — see the SKILL's card rules):
  ```gts
  get pose() { return this.open ? OPEN : CLOSED; }
  // template: {{motion animate=this.pose transition=soft}}
  ```
- **Transforms are values.** Animate `x`, `y`, `scale`, `rotate`; never compose a `transform` string — the engine owns `transform`.
- Keyframes: pass arrays (`animate=(to x=(array 0 40 0))`).
- Variants, `custom`, `staggerChildren` / `delayChildren` and `when` work as in Motion; `inherit` controls propagation to children.
- Gestures: `whileHover`, `whileTap`, `whileFocus`, `whileInView`, plus their handlers. Keyboard activates tap.
- `<MotionConfig @transition @reducedMotion>` sets defaults for a subtree. `@reducedMotion` defaults to `"user"`, which honours `prefers-reduced-motion`.

## Motion values: per-frame data without re-rendering

Anything updating at pointer or frame rate — a follower, a scrub readout, a progress fill — must not go through tracked state: that is a render per frame. Make a motion value, bind it once through an object passed to `style=`, and drive it: `.set(v)` writes a value, `animate(value, to, transition)` animates to one, `.jump(v)` teleports and stops whatever was driving it.

```gts
import { CardDef, Component } from '@cardstack/base/card-api';
import { on } from '@ember/modifier';
import { animate, motion, motionValue, spring } from 'glimmer-motion';

const tight = spring({ visualDuration: 0.2, bounce: 0 });

export class Follower extends CardDef {
  static isolated = class Isolated extends Component<typeof this> {
    x = motionValue(0);
    dot = { x: this.x };
    follow = (event: Event) => {
      let { clientX, currentTarget } = event as PointerEvent;
      let box = (currentTarget as HTMLElement).getBoundingClientRect();
      void animate(this.x, clientX - box.left, tight);
    };
    <template>
      <div class='stage' {{on 'pointermove' this.follow}}>
        <span class='dot' {{motion style=this.dot}}></span>
      </div>
    </template>
  };
}
```

`styleEffect(element, { opacity: value })` binds a motion value to an element without the modifier; `transformValue` derives one value from others; `frame` schedules work on the engine's frame loop. All come from `glimmer-motion`.

## Timing

Hand-rolled durations (a `setTimeout` meant to match a spring) drift from the engine and ignore the user's tempo. Use `scaleTransition` / `onMotionSpeed` from `glimmer-motion` if you must, or better, sequence with `<Choreo>` ([choreo.md](choreo.md)).

## Escalate when

The element leaves the DOM → [presence.md](presence.md). Its position or size changes because the layout did → [layout.md](layout.md). Several elements must move in order → [choreo.md](choreo.md).
