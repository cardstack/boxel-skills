---
title: Load Data in an Ember Concurrency Task, Not a Loose Promise
impact: HIGH
impactDescription: Loads stop when the component is destroyed, with no hand-written guard
tags: ember-concurrency, tasks, data-loading, anti-pattern
---

## Load Data in an Ember Concurrency Task, Not a Loose Promise

Data a component loads on render, reloads when an argument changes, or refreshes on a timer is loaded in an ember-concurrency task. A component can be destroyed while its load is still pending. A loose promise doesn't know that: the code after its `await` still runs and writes to a destroyed component. A task is cancelled when the object it lives on is destroyed, so nothing after its next `await` runs.

**Incorrect (a loose promise, and the guard it then needs):**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isDestroying, isDestroyed } from '@ember/destroyable';

class UserProfile extends Component {
  @tracked user = null;

  constructor(owner, args) {
    super(owner, args);
    void this.load(); // nothing cancels this when the component goes
  }

  async load() {
    const response = await fetch(`/api/users/${this.args.userId}`);
    // The guard is the symptom: this work should have been a task.
    if (isDestroying(this) || isDestroyed(this)) return;
    this.user = await response.json();
  }

  <template>
    {{#if this.user}}<h1>{{this.user.name}}</h1>{{/if}}
  </template>
}
```

**Correct (a task performed from the constructor, its value read from the task):**

```glimmer-js
// app/components/user-profile.gjs
import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';

class UserProfile extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.loadUser.perform();
  }

  loadUser = restartableTask(async () => {
    const response = await fetch(`/api/users/${this.args.userId}`);
    if (!response.ok) throw new Error(`users answered ${response.status}`);
    return response.json();
  });

  <template>
    {{#if this.loadUser.isRunning}}
      <div>Loading...</div>
    {{else if this.loadUser.last.isError}}
      <div>Error: {{this.loadUser.last.error.message}}</div>
    {{else if this.loadUser.lastSuccessful}}
      <h1>{{this.loadUser.lastSuccessful.value.name}}</h1>
    {{/if}}
  </template>
}
```

Writing `@tracked` state after an `await` inside the task is equally fine, and is the simpler shape when several loads fill one structure (a temperature per city, a page per number):

```glimmer-js
loadUser = restartableTask(async () => {
  const response = await fetch(`/api/users/${this.args.userId}`);
  this.user = await response.json(); // after an await: no render is reading it
});
```

**Polling while the component is open:**

```glimmer-js
import { rawTimeout, restartableTask } from 'ember-concurrency';

refresh = restartableTask(async () => {
  for (;;) {
    const response = await fetch('/api/status');
    if (response.ok) this.status = await response.json();
    // rawTimeout: test helpers' settled() waits for every pending `timeout`,
    // so an endless loop on it would hang a rendering test.
    await rawTimeout(60_000);
  }
});
```

No `setInterval` and no `willDestroy` cleanup: destroying the component cancels the loop.

**Work a getter discovers during a render:**

A getter can't write tracked state, so work it finds missing (a page the count now calls for, a row just added to a list) starts after the render. Perform a task whose first step is an `await`, never a `Promise.resolve().then(…)` or `queueMicrotask(…)`:

```glimmer-js
import { task, timeout } from 'ember-concurrency';

get rows() {
  if (this.pages.length < this.wantedPages) this.grow.perform();
  return this.pages.flatMap((page) => page.rows);
}

grow = task({ drop: true }, async () => {
  await timeout(0); // after the render that asked
  while (this.pages.length < this.wantedPages) this.addPage();
});
```

The render that performs it must not read the task's own state (`isRunning`, `last`), since `.perform()` updates it. A helper class that a component creates gets the same cancelation once it is tied to the component with `associateDestroyableChild(component, helper)` from `@ember/destroyable`.

**Never, in a component or a class it creates:**

1. ❌ `void this.load()`, or an `async` method called without awaiting it inside a task
2. ❌ `.then(…)`, `Promise.resolve().then(…)`, `queueMicrotask(…)`
3. ❌ `setTimeout` / `setInterval` for delays, deferrals or polling
4. ❌ `isDestroying` / `isDestroyed` checks, or an "is mounted" flag, before writing state
5. ❌ A tracked write before a task's first `await`, when a render may have performed it

**TaskInstance API for derived data:**

- `task.last` - The most recent TaskInstance (successful or failed)
- `task.lastSuccessful` - The most recent successful TaskInstance (persists during new attempts)
- `task.isRunning` - Derived boolean if any instance is running
- `taskInstance.value` - The returned value from the task
- `taskInstance.isError` - Derived boolean if this instance failed
- `taskInstance.error` - The error if this instance failed

References:

- [ember-concurrency](https://ember-concurrency.com/)
- [TaskInstance API](https://ember-concurrency.com/api/TaskInstance.html)
- [Task API](https://ember-concurrency.com/api/Task.html)
