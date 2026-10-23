# Module Structure: Splitting Card Code Across Files

A realm module is one `.gts` or `.ts` file. Every module is linted, indexed, compiled and loaded in the browser as a unit, and every edit to it rewrites the whole file. A module of a few hundred lines is cheap at each of those steps. A module of 20,000 lines with two dozen cards in it is slow at all of them. It is also hard to read and to change safely, for a person or a model, because every change has to find its place in text nobody can hold in view.

Nothing in Boxel needs an app to live in one file. Cards import each other with relative paths, and format components, helpers and constants can each live in their own module. Lay the files out before writing the first one.

## The rules

1. **One CardDef per module.** The module is named after the card in kebab-case: `blog-post.gts` exports `BlogPost`.
2. **A FieldDef gets its own module once more than one card uses it,** or once its own templates pass a few dozen lines. A small FieldDef that only one card uses can stay in that card's module.
3. **Format components move out as they grow.** A format (`isolated`, `embedded`, `fitted`, `edit`) of up to about 200 lines, CSS included, can stay inline as `static isolated = class Isolated extends Component<typeof this> { … }`. A bigger one goes in its own module under `components/`, and so does any component that two cards share.
4. **Logic with no template goes in a plain `.ts` module.** Pure helpers (formatting, scoring, date maths), constants, lookup tables and shared types. Put them under `utils/`, or name the file after what it holds (`pricing.ts`).
5. **Shared enums get their own module.** An `enumField` or option list that two cards read lives in one place, so the two can't drift.

### The size budget

**Keep every module under 800 lines.** That counts everything in the file: imports, the class, its templates and their `<style>` blocks.

Before an edit that would take a module past 800 lines, split it first and then make the edit. Move things out in this order, and stop as soon as the module is back under budget:

1. the largest format component, usually `isolated`, to `components/`;
2. helper functions and constants to a `.ts` module;
3. any other CardDef or FieldDef in the file, each to its own module.

A new feature on an existing app is a new module (a new card, a new component, a new helper file) wired in with an import. Don't grow one file to hold it.

The budget is per module, not per app. An app of ten cards, each in a 400-line module, is the shape to aim for.

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
- A component that only needs the type of a card imports it with `import type`. A component that needs the class as a value, for a query's `codeRef`, builds the ref from the module path with `codeRef(here, '../task', 'Task')` and doesn't import the class.

Imports between realm modules are relative and leave off the extension: `'./task'`, `'../project'`, `'./components/task-row'`.

Writing several small files costs no extra turns. Write all of a build's files in one `run-realm-code` call, up to 20 files per call (see `source-code-editing`). Each `.gts` or `.ts` file is linted on its own, so lint each module you write.

## Splitting an existing large file

A card's identity is **the module it is defined in plus its export name**. That pair is what an instance's `meta.adoptsFrom` names, what saving an instance writes, and what queries match on. Moving a class to a new module changes its identity, so a split has to bring every reference to the old identity along with it in the same change.

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

1. **Before moving anything, list what refers to the class.** Search for its instances: `realm.cards.search({ filter: { type: { module, name } } })` with the class's current module returns each instance's `path`. Then read every `.gts`, `.ts` and `.json` file in the realm for the old module path. The path is relative, so search for the old module's file name, not one fixed string. The references to find:
   - `meta.adoptsFrom` in each instance file;
   - `meta.fields.<field>.adoptsFrom` in instances where a contained field holds a subclass of a moved FieldDef;
   - `codeRef(here, './old-module', 'Name')` in query code;
   - `type` and `on` refs in query JSON stored in instances;
   - the `ref` of a Spec card for the class;
   - `import` lines in other modules, including subclasses that extend the moved class.
2. **Write the new module, then cut the class from the old one.** Write the new file with `realm.fs.writeText` first and change the old file with `realm.fs.replace` second, in the same script. That way any import or re-export the old module keeps points at a file that already exists.
3. **Update every reference from step 1 in the same change.** `adoptsFrom` is part of the instance file, not a field value, so change it with `realm.fs.replace` on the `.json`; `realm.cards.update` only changes attributes. The new `module` path is relative to the instance file: an instance at `Task/write-copy.json` moving from `../project-tracker` to `../task` gets `"module": "../task"`.
4. **Leave a re-export in the old module when you can't update every reference.** That covers instances in another realm that adopt from this module by URL, more instances than one change can hold, or a published listing. Remove the re-export only once nothing names the old module.
5. **Verify.** Lint every module you changed. Read one instance of each moved type with `realm.cards.get(path)`: it fails with the error's message if the instance doesn't load. Run each query you changed and check that it returns the rows it did before.

Move one card at a time when the file holds many. Each move is small enough to check, and a mistake breaks one type's instances, not all of them.
