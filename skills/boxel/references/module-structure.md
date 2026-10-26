# Module Structure: Splitting Card Code Across Files

A realm module is one `.gts` or `.ts` file. Every module is linted, indexed, compiled and loaded in the browser as a unit, and every edit to it rewrites the whole file. A module of a few hundred lines is cheap at each of those steps. A module of 20,000 lines with two dozen cards in it is slow at all of them. It is also hard to read and to change safely, for a person or a model, because every change has to find its place in text nobody can hold in view.

Nothing in Boxel needs an app to live in one file. Cards import each other with relative paths, and format components, helpers and constants can each live in their own module. Lay the files out before writing the first one.

## The rules

1. **One CardDef per module.** The module is named after the card in kebab-case: `blog-post.gts` exports `BlogPost`.
2. **A FieldDef gets its own module once more than one card uses it,** or once its own templates pass a few dozen lines. A small FieldDef that only one card uses can stay in that card's module.
3. **Format components move out as they grow.** A format (`isolated`, `embedded`, `fitted`, `edit`) of up to about 500 lines, CSS included, can stay inline as `static isolated = class Isolated extends Component<typeof this> { … }`. A bigger one goes in its own module under `components/`, and so does any component that two cards share.
4. **Shared or sizeable logic with no template goes in a plain `.ts` module.** A helper, constant, lookup table or type that two or more modules use moves out, and so does a card's own helper set once it runs to a few hundred lines. Put them under `utils/`, or name the file after what it holds (`pricing.ts`). A helper only one card uses, and a short one, stays in that card's module.
5. **Shared enums get their own module.** An `enumField` or option list that two cards read lives in one place, so the two can't drift.

### The size budget

**Aim to keep every module under about 2,000 lines.** That counts everything in the file: imports, the class, its templates and their `<style>` blocks. This is a strong suggestion, not a limit: nothing refuses a longer file, and a module a little past it is fine when splitting it would only scatter code that belongs together. A module well past it, or still growing, is the signal to split.

When a module is heading past 2,000 lines, split it before adding more. Move things out in this order, and stop once the module is comfortably back under:

1. the largest format component, usually `isolated`, to `components/`;
2. helper functions and constants to a `.ts` module;
3. any other CardDef or FieldDef in the file, each to its own module.

**A module that already holds more than one CardDef, or runs to about 1,500 lines or more, takes no new feature inline.** Check before you add: return `text.split('\n').length` from the script that reads the file. The feature goes in new modules wired in with an import, even when it would still fit under 2,000:

- a new card gets a module of its own (`bill.gts`), never a class appended to the long file;
- a new section of an existing format (a panel on a dashboard, a new tab) is its own component under `components/`, typed against the card, and the format renders it with one line such as `<UpcomingBills @model={{@model}} />`;
- the new section's getters and styles live in that component, not in the format.

The long file then changes by a few lines: an import, a field, the line that renders the component. A feature added to a module well under 1,500 lines goes where it belongs.

The budget is per module, not per app. An app of ten cards, each in a module of a few hundred to a thousand lines, is the shape to aim for.

## A worked layout

A project tracker with three cards that link to each other:

```
project-tracker/
├── project.gts                  # CardDef Project
├── task.gts                     # CardDef Task
├── team-member.gts              # CardDef TeamMember
├── task-status.ts               # enum options shared by Task and Project
├── utils/
│   └── schedule.ts              # pure date helpers, no template
├── components/
│   ├── project-isolated.gts     # Project's isolated format
│   └── task-row.gts             # a component both Project and Task render
├── Project/
│   └── website-relaunch.json
├── Task/
│   └── write-copy.json
└── TeamMember/
    └── sample-member.json
```

`project.gts` imports its neighbours and plugs its isolated component in:

```gts
import { CardDef, field, contains, linksTo, linksToMany } from '@cardstack/base/card-api';
import StringField from '@cardstack/base/string';
import { Task } from './task';
import { TeamMember } from './team-member';
import { ProjectIsolated } from './components/project-isolated';

export class Project extends CardDef {
  static displayName = 'Project';
  @field name = contains(StringField);
  @field owner = linksTo(() => TeamMember);
  @field tasks = linksToMany(() => Task);

  static isolated = ProjectIsolated;
}
```

`components/project-isolated.gts` types itself against the card with `import type`, so the component and the card can import each other without a runtime cycle:

```gts
import { Component } from '@cardstack/base/card-api';
import type { Project } from '../project';
import { TaskRow } from './task-row';
import { daysUntil } from '../utils/schedule';

export class ProjectIsolated extends Component<typeof Project> {
  <template>
    {{! … }}
  </template>
}
```

`task.gts` links back to `Project`. Two cards in separate modules that link to each other both use the thunk form `linksTo(() => Other)`. The thunk is called when the field is first used, after both modules have loaded, so it doesn't matter which one loads first:

```gts
import { CardDef, field, linksTo } from '@cardstack/base/card-api';
import { Project } from './project';
import { TeamMember } from './team-member';

export class Task extends CardDef {
  static displayName = 'Task';
  @field project = linksTo(() => Project);
  @field assignee = linksTo(() => TeamMember);
}
```

The rest of the imports in this layout:

- `utils/schedule.ts` exports plain functions (`export function daysUntil(date: Date): number { … }`). It has no template and imports nothing from `card-api`.
- `task-status.ts` exports the option list (`export const taskStatusOptions = [{ value: 'todo', label: 'To do' }, …];`). `task.gts` builds its `enumField` from it, and `project.gts` reads the same list for its counts.
- A component that only needs the type of a card imports it with `import type`. A component that needs the class as a value, for a query's `codeRef`, builds the ref from the module path and doesn't import the class:

  ```gts
  import { codeRef } from '@cardstack/runtime-common';

  // @ts-expect-error import.meta is valid ESM but TS detects .gts as CJS
  const here: string = import.meta.url;

  const taskRef = codeRef(here, '../task', 'Task');
  ```

Imports between realm modules are relative and leave off the extension: `'./task'`, `'../project'`, `'./components/task-row'`.

Writing several small files costs no extra turns. Write all of a build's files in one `run-realm-code` call, up to 20 files per call (see `source-code-editing`). Each `.gts` or `.ts` file is linted on its own, so lint each module you write.

## Splitting an existing large file

A card's identity is **the module it is defined in plus its export name**. That pair is what an instance's `meta.adoptsFrom` names, what saving an instance writes, and what queries match on. Moving a class to a new module changes its identity, so every reference to the old identity has to move with it, and the old module keeps a re-export until they have.

### What happens to existing instances

- **The old module no longer exports the class.** Every instance whose `adoptsFrom` still names the old module fails to load with `could not find card: '…'`, and a query naming the old module matches nothing. The module write and its lint both succeed, so nothing warns you: the instances turn into errors when they are re-indexed.
- **Each instance's `adoptsFrom` is updated to the new module.** The instances load as before. Their data doesn't change.
- **The old module re-exports the class:**

  ```gts
  // project-tracker.gts, after Task moved to task.gts
  export { Task } from './task';
  ```

  Instances that still name the old module keep loading. A query whose `type` or `on` names the old module still matches them, because a re-exported name resolves to the module that defines the class. The next save of each instance rewrites its `adoptsFrom` to the new module.

### The procedure

The re-export is what keeps a move safe: with it in place, every instance keeps loading while its references are updated, however many runs that takes. Put it in first and take it out last.

1. **Before moving anything, list what refers to the class.**
   - Instances: `realm.cards.search({ filter: { type: { module: realm.current.url + 'project-tracker', name: 'Task' } } })` returns each instance's `path`. The `module` must be the full URL: a relative path in a search filter is not resolved. A search doesn't count toward the 20-file limit, so page through all of it.
   - Modules: list the realm's `.gts` and `.ts` files with `realm.fs.list` and read the ones that could import the class, looking for the old module's file name in their `import` lines (including subclasses that extend the class) and in `codeRef(here, './old-module', 'Name')` calls.
   - Other instance files: read the `.json` files that can hold a ref to the class rather than every one in the realm. Those are the instances the search returned (for `meta.adoptsFrom`, and `meta.fields.<field>.adoptsFrom` where a contained field holds a subclass of a moved FieldDef), cards whose stored query JSON has a `type` or `on` ref, and the Spec card for the class (its `ref`).
   - Every `readText` counts toward the 20-file limit of one `run-realm-code` call, so spread a large listing over several calls.
2. **Write the new module, and replace the class in the old module with a re-export, in one script.** Write the new file with `realm.fs.writeText` first, then `realm.fs.replace` the class in the old file with `export { Task } from './task';`. The re-export then points at a file that already exists, and nothing that names the old module breaks.
3. **Update the references, in as many runs as it takes.** `adoptsFrom` is part of the instance file, not a field value, so change it with `realm.fs.replace` on the `.json`; `realm.cards.update` only changes attributes. The new `module` path is relative to the instance file: an instance at `Task/write-copy.json` moving from `../project-tracker` to `../task` gets `"module": "../task"`. Update the `import` lines, `codeRef` calls, stored queries and the Spec `ref` the same way. One run can touch at most 20 files, so a type with many instances takes several runs. The re-export keeps the instances you haven't reached yet loading in the meantime.
4. **Check that nothing still names the old module.** While the re-export is in place, `realm.cards.get` succeeds whether or not an instance was updated, so it can't tell you which ones are done. Re-read the files from step 1 and confirm each names the new module.
5. **Remove the re-export last,** once step 4 comes back clean. Keep it instead when references live where you can't update them: instances in another realm that adopt from this module by URL, or a published listing.
6. **Verify.** Lint every module you changed. After the re-export is gone, read one instance of each moved type with `realm.cards.get(path)`: it fails with the error's message if the instance doesn't load. Run each query you changed and check that it returns the rows it did before.

Move one card at a time when the file holds many. Each move is small enough to check, and a mistake breaks one type's instances, not all of them.
