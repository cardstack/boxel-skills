---
title: Use Ember Concurrency for a Component's Async Work
impact: HIGH
impactDescription: Async work is cancelled when its component is destroyed
tags: ember-concurrency, tasks, user-input, concurrency-patterns
---

## Use Ember Concurrency for a Component's Async Work

Use ember-concurrency for every async operation a component starts: search, form submission and autocomplete, and also loading on render and polling. It provides automatic cancelation when the component is destroyed, debouncing, and prevents race conditions.

**Incorrect (manual async handling with race conditions):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Search extends Component {
  @tracked results = [];
  @tracked isSearching = false;
  @tracked error = null;
  currentRequest = null;

  @action
  async search(event) {
    const query = event.target.value;

    // Manual cancelation - easy to get wrong
    if (this.currentRequest) {
      this.currentRequest.abort();
    }

    this.isSearching = true;
    this.error = null;

    const controller = new AbortController();
    this.currentRequest = controller;

    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal
      });
      this.results = await response.json();
    } catch (e) {
      if (e.name !== 'AbortError') {
        this.error = e.message;
      }
    } finally {
      this.isSearching = false;
    }
  }

  <template>
    <input {{on "input" this.search}} />
    {{#if this.isSearching}}Loading...{{/if}}
    {{#if this.error}}Error: {{this.error}}{{/if}}
  </template>
}
```

**Correct (using ember-concurrency with task return values):**

```glimmer-js
// app/components/search.gjs
import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';

class Search extends Component {
  // restartableTask automatically cancels previous searches
  // IMPORTANT: Return the value, don't set tracked state inside tasks
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json(); // Return, don't set @tracked
  });

  <template>
    <input {{on "input" (fn this.searchTask.perform (pick "target.value"))}} />

    {{#if this.searchTask.isRunning}}
      <div class="loading">Loading...</div>
    {{/if}}

    {{#if this.searchTask.last.isSuccessful}}
      <ul>
        {{#each this.searchTask.last.value as |result|}}
          <li>{{result.name}}</li>
        {{/each}}
      </ul>
    {{/if}}

    {{#if this.searchTask.last.isError}}
      <div class="error">{{this.searchTask.last.error.message}}</div>
    {{/if}}
  </template>
}
```

**With debouncing for user typing:**

```glimmer-js
// app/components/autocomplete.gjs
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';

class Autocomplete extends Component {
  searchTask = restartableTask(async (query) => {
    // Debounce user typing - wait 300ms
    await timeout(300);

    const response = await fetch(`/api/autocomplete?q=${query}`);
    return response.json(); // Return value, don't set tracked state
  });

  <template>
    <input
      type="search"
      {{on "input" (fn this.searchTask.perform (pick "target.value"))}}
      placeholder="Search..."
    />

    {{#if this.searchTask.isRunning}}
      <div class="spinner"></div>
    {{/if}}

    {{#if this.searchTask.lastSuccessful}}
      <ul class="suggestions">
        {{#each this.searchTask.lastSuccessful.value as |item|}}
          <li>{{item.title}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}
```

**Task modifiers for different user concurrency patterns:**

```glimmer-js
import Component from '@glimmer/component';
import { dropTask, enqueueTask, restartableTask } from 'ember-concurrency';

class FormActions extends Component {
  // dropTask: Prevents double-click - ignores new while running
  saveTask = dropTask(async (data) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  });

  // enqueueTask: Queues user actions sequentially
  processTask = enqueueTask(async (item) => {
    const response = await fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(item)
    });
    return response.json();
  });

  // restartableTask: Cancels previous, starts new (for search)
  searchTask = restartableTask(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  });

  <template>
    <button
      {{on "click" (fn this.saveTask.perform @data)}}
      disabled={{this.saveTask.isRunning}}
    >
      Save
    </button>
  </template>
}
```

**Key Principles for ember-concurrency:**

1. **Any async work a component starts** - user actions, loading on render, polling, work deferred past a render. A task is cancelled when its component is destroyed; a loose promise is not.
2. **Prefer return values** - Read `task.last.value` or `task.lastSuccessful.value` where you can. Writing `@tracked` state after an `await` inside a task is also fine.
3. **Never write before the first `await`** - A task performed while a render is running must not write tracked state the render already read.
4. **Choose right modifier**:
   - `restartableTask` - User typing/search, reloading when an argument changes (cancel previous)
   - `dropTask` - Form submit/save (prevent double-click)
   - `enqueueTask` - Sequential processing (queue user actions)

**Never, in a component:**

- ❌ `void this.load()`, `promise.then(…)`, `Promise.resolve().then(…)`, `queueMicrotask(…)` - nothing cancels them when the component goes
- ❌ `setTimeout` / `setInterval` for delays or polling - use `await timeout(ms)` inside a task
- ❌ `isDestroying(this)` / `isDestroyed(this)` checks before writing state - the work they guard belongs in a task

See **advanced-data-loading-with-ember-concurrency.md** for loading data on render.

ember-concurrency provides automatic cancelation and derived state (isRunning, isIdle, last, lastSuccessful) for every async operation a component owns.

Reference: [ember-concurrency](https://ember-concurrency.com/)
