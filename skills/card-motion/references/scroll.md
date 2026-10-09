# Scroll-driven motion

## Where is the scroll? `scrollProgress()`

`scrollProgress()` returns motion values — `scrollX`, `scrollY`, `scrollXProgress`, `scrollYProgress` — plus three modifiers that say what to track. Bind the values through an object passed to `style=`.

```gts
import { CardDef, Component } from '@cardstack/base/card-api';
import { motion, scrollProgress } from 'glimmer-motion';

export class Story extends CardDef {
  static isolated = class Isolated extends Component<typeof this> {
    scroll = scrollProgress({ offset: ['start end', 'end start'] });
    bar = { scaleX: this.scroll.scrollYProgress };
    <template>
      <div class='reader' {{this.scroll.container}}>
        <div class='bar' {{motion style=this.bar}}></div>
        <section {{this.scroll.target}}>…</section>
      </div>
      <style scoped>
        .reader { overflow-y: auto; max-height: 100%; }
        .bar { transform-origin: left; }
      </style>
    </template>
  };
}
```

- `{{s.container}}` names the scrolling element, `{{s.target}}` the element whose position within it is tracked; options are the offsets (`['start end', 'end start']`) and the axis.
- **A card scrolls inside its stack item, not the window.** `{{s.track}}` (and a `scrollProgress` with no container) follows the document, which barely moves while the card scrolls. Give the card its own scroller and put `{{s.container}}` on it, as above.
- Feed a value through `transformValue` for parallax, or into `scaleX` for a progress bar. The lower-level `scroll()`, `scrollInfo()` and `inView()` are exported too.

## Is it on screen? `InView` / `whileInView`

```gts
<section
  {{motion
    initial=(to opacity=0 y=24)
    whileInView=(to opacity=1 y=0)
    viewport=(hash once=true amount=0.4)
  }}
>…</section>
```

`viewport` takes `root`, `margin`, `amount` and `once`. For a tracked flag your template can branch on — mount something heavy only once it's visible — use `InView`: `visible = new InView({ once: true })`, `<div {{this.visible.observe}}>`, then read `this.visible.isInView`. `useScroll` / `useInView` are deprecated aliases; don't write new code against them.

## Judgment calls

- Reveal-on-scroll wants `once=true` almost always; repeating reveals read as noise on the way back up.
- A hide-on-scroll header follows the direction, not the position: track the sign of the delta, animate `y`, and keep the show threshold smaller than the hide threshold so it doesn't flicker at rest.
- Parallax layers stay subtle (single-digit percentage offsets) and must not create their own scroll height: transform, never `top` or `margin`.
- Scroll-linked values bypass `transition`; the scrubbing is the timing. Wrap them in springs only when you want lag on purpose.
