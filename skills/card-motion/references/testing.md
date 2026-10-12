# Testing an animated card

Co-located `.test.gts` files run under `boxel test` (see `boxel/references/qunit-testing.md` for the file contract). `glimmer-motion/test-support` and `@cardstack/choreo/test-support` are available there.

```gts
import { click } from '@ember/test-helpers';
import { setupChoreo, live, orphanCount } from '@cardstack/choreo/test-support';
import { setupCardTest } from '@cardstack/host/tests/helpers';
import { renderCard } from '@cardstack/host/tests/helpers/render-component';
import { getService } from '@universal-ember/test-support';
import { animationsSettled } from 'glimmer-motion/test-support';
import { module, test } from 'qunit';

import { Inbox } from './inbox';

module('Inbox', function (hooks) {
  setupCardTest(hooks);
  setupChoreo(hooks);

  test('a deleted row flies to the bin and is gone', async function (assert) {
    let loader = getService('loader-service').loader;
    await renderCard(loader, new Inbox({ /* … */ }), 'isolated');
    await animationsSettled();

    await click(live('[data-test-delete="row-2"]')!);
    await animationsSettled();

    assert.dom('[data-test-row="row-2"]').doesNotExist();
    assert.strictEqual(orphanCount(), 0, 'nothing left parked mid-exit');
  });
});
```

- **Never `sleep`.** A sleep encodes a duration the test doesn't own; change a spring and it flakes. **`animationsSettled()`** resolves when every motion element, layout animation and `<Choreo>` run has stopped, and on timeout names what was still moving (`whatIsBusy()` is the probe).
- **`setupMotion(hooks)`** (`glimmer-motion/test-support`) resets what outlives a test — the projection root, the layout-loop guard, motion speed — and fails a test in which a layout loop ran. **`setupChoreo(hooks)`** is the same plus Choreo's document-wide state — beacons, far matching — and is the one to use whenever the card renders `<Choreo>`. Without it a beacon name registered by an earlier test wins over the next test's real one.
- **`live(selector)`** (`@cardstack/choreo/test-support`) — while a leaver may still be parked in `[data-choreo-orphans]`, a bare query can return its ghost. Interact and assert through `live()` / `liveAll()`.
- After an interruption test (click again mid-flight on purpose), assert `orphanCount() === 0` and that `strandedTransforms()` is empty: nothing parked, nothing wearing a transform nobody is animating.
- **`boxel test` delivers no stylesheet** (it stamps the scoped-CSS attributes only), so don't assert computed styles or measured layout that depends on CSS. Assert what the card controls: which elements exist, what they say, what state they're in. Where geometry matters, `bounds(el)` and `shape(el)` from `glimmer-motion/test-support` measure relative to the test container and read the cumulative transform.
- Hooks for tests are `data-test-*` attributes; hooks your own code queries are other data attributes.
