# `!important`, `:deep()`, `:global()` — smells, not tools

**Never write (or advise) one of these without first establishing that the
use case is legitimate.** Reaching for one almost always means a component
boundary is in the wrong place, a value that should be a token is
hard-coded, or a platform behavior needs fixing upstream.

These escape hatches all do the same thing: they let one component reach
across a boundary and overrule another. That works — right up until the
component on the other side changes, at which point the override silently
stops matching or silently starts fighting something new. The cost is
deferred, not avoided.

## The check, before writing one

1. **Whose decision is this, really?** If component A keeps overriding
   component B's padding/color/width, B probably shouldn't be hard-coding
   it. Give B a token with a sensible default
   (`padding-inline: var(--site-gutter, 2.5rem)`) and let A set the token.
   A token is a *declared* extension point; `:deep()` is an undeclared one.
2. **Can the value be inherited instead of overridden?** CSS custom
   properties inherit. Passing a value down beats reaching down to
   overwrite one.
3. **Is the thing I'm fighting actually a platform bug?** If a host wrapper
   resets values it shouldn't, the honest move is a bug report plus a
   commented workaround — not a silent override that hides the defect.
4. **Only then**, if the boundary genuinely cannot be changed (third-party
   markup, host-injected DOM, yielded content carrying the caller's scope
   id), use the escape hatch — and **comment why**, so the next reader
   knows it was a decision, not a reflex.

`!important` specifically: if it's needed to win a cascade fight against
code you own, fix the specificity or the ordering. Legitimate uses are
close to none.

## Three worked verdicts (from a real refactor)

**Legitimate — yielded content.** A page shell yields page content into its
`<main>`. Yielded blocks carry the *caller's* scope id, so the shell's
`<style scoped>` genuinely cannot reach them any other way, and no token
substitutes because the shell styles structure the caller owns. `:deep()`
is correct here.

**Not legitimate — neutralizing child-card padding.**

```css
.resource-body :deep(.boxel-pricing-container),
.resource-body :deep(.section-layout),
.resource-body :deep(.legal) { padding-inline: 0; max-width: none; }
```

One component reaching into three others to undo framing they each
hard-coded. It enumerates children by class name — a fourth content card
silently breaks alignment. **The real fix:** each child reads
`padding-inline: var(--site-gutter, <its current value>)`; the wrapper sets
`--site-gutter` once; future cards align for free. (Tell-tale artifact:
`max-width: none` in one rule immediately overridden by `max-width: 52rem`
in the next — fighting your own override means you're on the wrong layer.)

**Legitimate-with-caveat — working around a host behavior.** The host wraps
each linked card in `.boxel-card-container` and re-declares theme tokens
there from that card's own theme, resetting dark-mode values partway down
the tree. Re-publishing the tokens under private `--site-*` names and
mapping them back inside the container is defensible — the resetting DOM is
host-injected — but it's a workaround for a platform gap and must be
**filed upstream**, not just absorbed.

## The tell

If the override enumerates specific child class names, or you're overriding
your own override, or the comment would read "because X sets Y and we don't
want that" — stop. That's the shape of a missing token or a misplaced
boundary, and the fix is usually smaller than the workaround.
