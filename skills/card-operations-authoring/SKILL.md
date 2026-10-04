---
name: card-operations-authoring
description: 'Use when adding an operation to a card — "let users add a comment / invite a guardian / create a linked X from this card", "batch create and link", "append to a log without loading the card", "a saved search on this card type". Covers declaring `@operation` as data (the nine base operations, `params`, the typed references `params()` / `actor()` / `instance()` / `realmConfig()` / `card()`, the sugar clauses and the `bxl` escape hatch), invoking through `operations()` and `atomic()`, `nonGrantable`, the rules lowering enforces, the refusals a caller sees (under a realm policy too), and the access posture a policy-gated realm gives. Activates on `@operation`, `operations(`, `atomic(`, `appendContainsMany`, `appendLine`, `nonGrantable`, `operation-not-permitted`, "card operation", "named operation".'
boxel:
  kind: skill
---

# Authoring card operations

An operation is a named action on a card — "escalate this event", "record
vitals", "request a consult" — declared by the author as **plain data** rather
than as JavaScript. The realm reads the declaration out of its definition cache
and carries it out itself, so no code from the card's module runs on the write
path.

```ts
import StringField from '@cardstack/base/string';
import {
  actor,
  operation,
  params,
  type OperationDeclaration,
} from '@cardstack/base/operations';

export class ExternalReport extends CardDef {
  @field comments = containsMany(CommentField);

  @operation static addComment = {
    base: 'transform',
    params: { body: StringField },
    append: {
      to: 'comments',
      value: { body: params('body'), postedBy: actor() },
    },
  } satisfies OperationDeclaration;
}
```

```ts
await operations(report).addComment({ body: 'Reviewed.' });
```

Keep `satisfies OperationDeclaration` in author code. It type-checks the
declaration in place and preserves the literal types (`base: 'transform'` rather
than `base: string`) that the payload and bucket types read. Without it the
declaration is invisible to those types and the payload goes unchecked.

## 1. When an operation is the right tool

| You want                                                | Reach for                                      |
| ------------------------------------------------------- | ---------------------------------------------- |
| A user edits a field in the card's own editor            | A plain field — no operation                   |
| A value derived from other fields on the same card       | `computeVia` — no operation                    |
| A named action that writes the card, invocable from a template, another card, or an agent | **An operation**        |
| Several cards changed all-or-nothing                     | **An operation** inside `atomic()`             |
| Work that needs network access, an LLM, or host services | A command — operations run no author JavaScript |

The dividing line is that an operation is *data the realm executes*. That buys
concurrency safety an author cannot write by hand — two callers titrating the
same dose compose rather than overwrite — and costs the ability to run arbitrary
code. Anything needing a fetch, a model call, or a host service is a command.

## 2. Declaring

`@operation static <name> = { base, … }` on a `CardDef`. The `base` names the
built-in behavior the operation builds on; the name is what a caller invokes.
The two are read separately, so a `delete` declared on `transform` is a soft
delete: asking that card to delete itself archives it.

### The nine base operations

| Base                  | What it does                                                        | Carried by |
| --------------------- | ------------------------------------------------------------------- | ---------- |
| `read`                | Serves the card's indexed document                                   | cards, files |
| `readSource`          | Serves the bytes stored at the URL                                   | cards, files |
| `create`              | Mints a new card — type-scoped                                       | cards      |
| `update`              | Merges field values and replaces links                               | cards, files |
| `delete`              | Removes the card                                                     | cards      |
| `query`               | A saved search, run by the search engine                             | cards      |
| `transform`           | Runs a program over the card's stored document                       | cards      |
| `appendContainsMany`  | Appends into a `containsMany` by editing stored JSON, without loading the document | cards |
| `appendLine`          | Appends one newline-terminated line to a text file                   | files      |

`readSource` is **not declarable** under any name or as any `base`: the realm
answers it before it would consult a stored definition, so a declaration under
it would never be reached.

**A file's operations are the ones its class declares, and its class comes from
its extension.** The platform maps each file extension to a base file class, and
a realm does not configure it. Two of those classes carry a declared operation:
every stored `.log` is `LogFile` and every stored `.jsonl` is `JSONLFile`, and
each declares `record`, an `appendLine` whose line the realm composes rather
than the caller:

```ts
// @cardstack/base/log-file-def
export class LogFile extends TextFileDef {
  @operation static record = {
    base: 'appendLine',
    params: { what: StringField },
    input: bxl`. + { line: (TEXT(NOW(); "yyyy-mm-dd hh:mm:ss") + " " + actor() + " " + params("what")) }`,
  } satisfies OperationDeclaration;
}
```

`JSONLFile.record` takes the same `what` and appends
`{"at": …, "actor": …, "what": …}` as one line, so the file stays parseable
entry by entry. Link the file with the class that declares the operation, and
invoke it by name on the linked instance:

```ts
@field auditLog = linksTo(LogFile);
```

```ts
b.on(this.record.auditLog).record({ what: 'transferred to intensive care' });
```

The linked instance is a `LogFile` because its extension says so, whatever
class the field names. Naming `LogFile` (not `TextFileDef` or `FileDef`) on the
field is what types `record` on the linked value and keeps the file picker to
`.log` files. The base `update` and `appendLine` stay available on every file
alongside it.

**A declaration on your own `FileDef` subclass is unreachable rather than
broken.** No stored file resolves to an author's subclass, so an operation
declared on one lowers, indexes, and is never found by name — and the instance
carries no such member either, so the call throws before any request is made.
For an append-only record, store it as a `.log` or `.jsonl` and use `record`;
for anything the realm must compute on a card, declare the operation on the
card.

The names `atomic`, `on`, `find`, `parallel` and `serial` belong to the
invocation surface and cannot name an operation. Nor can `query`: it is the
name an ad-hoc search is invoked and granted under, so a saved search declared
under it would share that grant with every filter a caller writes over the
type — the `query` base is declarable, under any other name. Neither can a name
that already
resolves on the class, such as `displayName` — except an inherited operation of
the same name, which is how a subclass overrides one.

### `params` — the payload schema

Field classes for scalars, `linkTo(CardClass)` for a card identity:

```ts
params: {
  question: StringField,
  deltaMg: NumberField,
  clinician: linkTo(Clinician),
}
```

The schema is the single source for the payload's TypeScript type, for checking
`params('…')` references, and for the endpoint's validation. A `linkTo` param
accepts a saved card's URL, or — inside a batch — the handle of a card the same
batch is minting.

### The typed references

Values known only at invocation are written as markers. They are ordinary
function calls, not interpolation syntax:

| Marker                | Resolves to                                                      |
| --------------------- | ----------------------------------------------------------------- |
| `params('key')`       | That member of the request payload                                 |
| `actor()`             | The caller's Matrix user id — **only** that                        |
| `instance()`          | The target's own stored values — its `id` and its attributes      |
| `realmConfig('key')`  | A setting from the realm's `config` on `realm.json`                |
| `card(…)`             | A link identity, from a URL or another marker                      |

`actor()` takes no argument and **is not a card**. It belongs in text fields and
query filters. A link to the person acting is a `params` member declared
`linkTo(Person)` — an `actor()` where a card identity belongs is refused.

`realmConfig` is what lets one card type read a value that differs per realm — an
approver, a threshold, a default — without hard-coding it. A realm that
configures no such setting refuses the invocation rather than resolving the
marker to nothing.

### The sugar clauses

Each base accepts its own:

```ts
// transform: append, assert, set
@operation static addConsultant = {
  base: 'transform',
  params: { clinician: linkTo(Clinician) },
  assert: {
    unique: 'consultTeam',
    by: params('clinician'),
    snapshot: true,
    message: 'That clinician is already on this consult team',
  },
  append: { to: 'consultTeam', value: card(params('clinician')) },
} satisfies OperationDeclaration;

// create: of (required), fill
@operation static requestConsult = {
  base: 'create',
  of: ConsultRequest,
  params: { specialty: StringField, question: StringField },
  fill: {
    specialty: params('specialty'),
    status: 'requested',
    requestedBy: actor(),
    patient: instance('id'),
  },
} satisfies OperationDeclaration;

// appendContainsMany: field + item, or fields mapping each name to its item
@operation static recordVitals = {
  base: 'appendContainsMany',
  field: 'vitals',
  params: { heartRate: NumberField },
  item: { heartRate: params('heartRate'), recordedBy: actor() },
} satisfies OperationDeclaration;

// query: query (required)
@operation static admittedOnUnit = {
  base: 'query',
  params: { careUnit: StringField },
  query: {
    filter: {
      on: () => PatientRecord,
      eq: { careUnit: params('careUnit'), status: 'admitted' },
    },
    sort: [{ on: () => PatientRecord, by: 'patientName', direction: 'asc' }],
  },
} satisfies OperationDeclaration;
```

A class that filters on itself takes the thunk form `() => PatientRecord`,
because the class binding is not initialized while its own statics are built.

`append` adds to a collection; cardinality comes from the field type, so the
declaration names the field and the value and nothing else. `set` writes field
values. `assert` guards **data state** — it is never an authorization check.

`fill` and `set` differ only in which base carries them: `fill` populates a new
card, `set` writes an existing one.

### `input` — a value the caller cannot forge

`input` runs first, over the payload the caller sent, and produces the payload
the operation uses — so a value it supplies satisfies a declared param the
caller left out. It reads `.` (that payload), `params()`, `actor()` and
`realmConfig()`.

That is the difference between a log the caller writes and a log the realm
keeps. An `appendLine` declaring a `line` param hands the whole line to the
caller, including the part naming who wrote it; an `input` program composes the
line where a caller cannot reach it.

Two things to get right, both quiet when wrong:

- **`. +` merges into the payload; a bare object replaces it.** Writing
  `{ line: … }` on its own drops every declared param.
- **`NOW()` answers a spreadsheet serial, not a timestamp.** Format it —
  `TEXT(NOW(); "yyyy-mm-dd hh:mm:ss")` — or the line carries a number like
  `46023.518`.

`input` is accepted on every base, including the two appends and a file's
`update`, which carry no `transformations` program at all. So it is the only
stage that can stamp a realm-supplied value into an appended line.

### The raw escape hatch

For work the clauses do not express, a `transformations` program:

```ts
@operation static titrateDose = {
  base: 'transform',
  params: { medication: StringField, deltaMg: NumberField },
  transformations: bxl`
    assert(
      .status == "admitted";
      "A dose is titrated only while the patient is admitted"
    );
    (.medications[] | select(.name == params("medication")) | .doseMg)
      |= . + params("deltaMg");
  `,
} satisfies OperationDeclaration;
```

`|= . + …` reads the value the realm holds and moves it, so two callers
titrating at once compose instead of the second overwriting the first. Removing
an item needs a program too — `del(… | select(…))` — since no clause expresses
it.

The `bxl` tag **takes no substitutions**. A program reads the payload, the
caller and the target through the `params()`, `actor()`, `instance()` and
`realmConfig()` builtins rather than having values spliced into its text.

A declaration expresses its work with clauses **or** with a program, never both.
The two appends and a file's `update` edit stored bytes rather than running a
program over a document, so they carry no `transformations` at all.

### `optimistic`

A declaration may carry `optimistic`, and it is validated and stored on the
lowered operation. Nothing reads it, so setting it changes no behavior — write
it only to record an intent, never expecting an effect.

### `nonGrantable` — out of every policy grant

`nonGrantable: true` keeps an operation out of reach of every grant in a
realm's policy:

```ts
@operation static addToCareTeam = {
  base: 'transform',
  params: { memberId: StringField },
  append: { to: 'careTeamIds', value: params('memberId') },
  nonGrantable: true,
} satisfies OperationDeclaration;
```

The realm's own permissions are untouched: a realm writer still invokes it,
and so does a reader when it reads. Only a caller the realm admits through a
grant is refused, with the refusal a grant that does not hold gets (§5). A
policy grant naming it records `grants-authorization-infrastructure` and is
left out.

Mark an operation this way when it does either of two things:

- **It edits authorization-bearing state** — a field a policy's `where` reads
  to decide access, such as a care-team list. A grant on it would let whoever
  it admits widen their own access, and anyone else's.
- **Its answer should not reach a caller the realm admits only through a
  grant.** `explain` and `validate`, which answer what a policy decides and
  what it compiles to, always carry it; the decorator refuses either declared
  without it.

**The flag sticks.** It holds on the type that declares it and on every
subtype, and a subclass that redeclares the operation without it does not
make it grantable. Lowering keeps it on a declaration with findings too, so a
broken declaration never becomes grantable by breaking.

**A built-in is marked by redeclaring it under its own name:**

```ts
@operation static update = { base: 'update', nonGrantable: true };
```

A redeclaration with no clauses is the built-in behavior. Redeclaring
`update`, `create` or `delete` also takes the card+json verb of that name
away from a caller the realm admits through a grant, since a verb reaches the
built-in only (§6). `readSource` and the name `query` cannot be declared, so
neither can be marked.

The value must be a boolean. Anything else is refused by the decorator when
the class is defined.

## 3. Invoking

```ts
import { operations } from '@cardstack/base/operations';

let result = await operations(report).addComment({ body: 'Reviewed.' });
let created = await operations(Report).create({ headline: 'From class' });
```

Nothing hangs off the instance itself — a card's property namespace belongs to
its author's fields — so a card is passed to a function the way it is to
`isSaved(instance)`.

**Typing an instance call.** TypeScript cannot read a class's statics through an
instance type, so name the class to get typed members:

```ts
get ops() {
  return operations<typeof PatientRecord>(this.record);
}
```

A call that names no class still works and still reaches every operation; its
members simply take any payload.

### What a write answers

```ts
{ id: string, version: string, generation: number, lastModified: number }
```

plus `lid` on a create **that a batch staged** — a single
`operations(Class).create(…)` names no local id, so none comes back. A write
reports identity and version rather than reprinting the document: the caller
supplied the state, and reconciling against the version is the common case. A
`read` answers its document. A `delete` answers `null`.

### Batches

`atomic()` commits several operations all-or-nothing, in one realm:

```ts
await this.ops.atomic((b) => {
  let consult = b.requestConsult({ specialty, question });
  b.addConsult({ consult });
  b.on(this.record.auditLog).record({ what: 'consult requested' });
});
```

`b.create()` and every declared operation answer a **handle**. A create's handle
is the local id a later entry links the new card by — the one spelling of a link
to a card that has no URL yet.

- `b.on(card)` targets another card in the same realm. A card in another realm is
  refused: a batch commits under one realm's write lock.
- `b.find(filter, { field, expect })` targets whatever the realm matches.
- `b.parallel((p) => …)` and `p.serial((s) => …)` nest to any depth. The top
  level is serial, and results mirror the nesting.
- Returning handles from the builder types and orders the results; returning
  nothing answers every entry's result positionally.

**No read-your-own-writes.** A read entry sees pre-batch state. Two members of
one parallel group that write the same card are a `conflicting-targets` refusal,
because members are evaluated against the state the group started from — two
entries touching one target belong in serial order.

### Saved searches

A declared `query` is **the one member that is not awaited**. It answers a live
entries resource that re-runs as realms index:

```ts
@cached
get onThisUnit() {
  return operations(PatientRecord).admittedOnUnit.query({
    careUnit: this.args.model.unitName ?? '',
  });
}
```

```hbs
<@context.searchResultsComponent @query={{this.onThisUnit}} @mode='hover' />
```

Calling it answers the resource; `.query()` answers the wire query, which is what
a card hands to `@context.searchResultsComponent` to render the rows itself.

Every call builds an **independent** search with its own realm subscriptions, so
make the call **once** and hold what it answers: a field, a one-time assignment,
never an uncached getter and never during render.

A field is the plain form, and it fixes the payload at construction. Where the
payload arrives later — `@model` is typed with every field optional, because a
template renders a card that may still be loading — a `@cached` getter is the
variant that lets it through, at the cost of building a fresh search whenever
what it reads changes. A payload whose values are tracked moves an existing
search without a second call, so reach for the getter only when the payload
itself is not.

**A search that compares against the caller answers nothing when the session
cannot supply one** — nobody signed in, or a render, which authenticates as
itself. That is the one silent case, and it applies only to a declaration that
reads `actor()` — which is the search worth guarding:

```hbs
{{#if this.myPatients}}
  <@context.searchResultsComponent @query={{this.myPatients}} @mode='hover' />
{{/if}}
```

The search component treats an absent query as idle, so a card may hand it over
either way; the guard is what lets the surrounding markup say something else
instead. A search that names no `actor()` always answers, so guarding one buys
nothing. Everything else — a payload the declaration cannot resolve, a realm
scope that will not resolve — is raised at the call rather than swallowed.

**A saved search is as fresh as the index.** It reads the search index, which
lags a write until that write is indexed. To read a card just written, read the
card.

## 4. What lowering refuses

These are recorded when the module is indexed, not thrown. An operation carrying
findings has no runnable form, and invoking it is refused with
`invalid-operation`.

| Finding                   | What it means                                                      |
| ------------------------- | ------------------------------------------------------------------- |
| `unknown-field`           | A clause names a field the type does not have                       |
| `not-a-collection`        | Appending to, or asserting over, a single-value field               |
| `undeclared-param`        | `params('x')` for a key `params` does not declare                   |
| `computed-write`          | A write into a computed field — the next read overwrites it         |
| `read-only-write`         | A write into a query-resolved field, or the card's `id`             |
| `link-collection-replace` | A `set` replacing a whole link collection — use `append`            |
| `path-crosses-collection` | A dotted path crossing a collection addresses nothing               |
| `link-requires-identity`  | A link position holding something that is not a card identity       |
| `write-through-link`      | A write whose path crosses a `linksTo` / `linksToMany`              |
| `unsearchable-read`       | Reading across a link not marked `searchable`                       |
| `unsnapshotted-assert`    | An `assert` over a computed or linked path without `snapshot: true` |
| `unresolved-type`         | A class no module exports under a name                              |
| `actor-not-a-card`        | An `actor()` where a card identity belongs                          |
| `invalid-program`         | A raw program that does not parse                                   |
| `invalid-query`           | A declared query the query grammar refuses                          |
| `reserved-name`           | An operation named `readSource` or `query`, or built on `readSource` |
| `base-not-carried`        | A base the def type does not carry                                  |
| `unrunnable-program`      | A program on a base that runs none                                  |
| `incomplete-append`       | An `appendContainsMany` that does not say what to append where      |
| `instance-out-of-scope`   | An `instance()` in a declared append, which never loads the document |
| `lowering-failed`         | Lowering itself threw on this operation — a fault in the realm, not the declaration |

The decorator refuses several of these where the class is defined — a
reserved name, a base the def type does not carry, a malformed `nonGrantable`
— so author code rarely records them. Lowering checks them again because a
stored definition outlives the code that built it. `lowering-failed` costs
only the operation it hit: the entry stays stored, invalid and with its
`nonGrantable` kept, so its name never falls back to a grantable built-in.

Three of these account for most first attempts:

**An operation binds only to the target card's own stored values.** A linked card
is a separate document with its own operations, so a write whose path crosses a
link is refused — change the other card with its own entry in a batch.

**Reading across a link requires that link to be `searchable`.** A filter reaches
a linked card's fields only when the link that gets there says so:

```ts
@field attending = linksTo(Clinician, { searchable: true });
```

**An `assert` over a computed or linked value needs `{ snapshot: true }`.** A
program reads the card's stored document, which holds a link's target as a
reference rather than as the linked card and holds no computed value at all, so
the values the check compares have to be gathered first. That costs reads, which
the author opts into rather than paying invisibly. There is no non-snapshot form
of that check.

**An append has no `instance()` in scope.** An append edits stored bytes without
ever assembling the document, which is the whole reason the behavior exists;
offering `instance()` would mean the read the operation avoids. `params()`,
`actor()` and `realmConfig()` work. An item that needs the card's own values
belongs on a `transform`.

In an `appendContainsMany` item this is caught as `instance-out-of-scope` when
the module is indexed. An `input` program is not read that way, so an
`instance()` inside one fails at invocation instead — in an `appendLine`, which
has no clause and composes its line there, that is the only form it takes.

## 5. Refusals a caller sees

Thrown as `OperationsError`, whose `detail` carries the sentence:

```ts
import { OperationsError } from '@cardstack/base/operations';

try {
  await this.ops.escalateRhythmEvent({ eventId, findings });
} catch (err) {
  this.refusal =
    err instanceof OperationsError ? (err.detail ?? err.message) : String(err);
}
```

| Code                       | Meaning                                                      |
| -------------------------- | ------------------------------------------------------------- |
| `assertion-failed`         | A precondition did not hold — carries the author's `message`  |
| `invalid-params`           | The payload does not satisfy `params`, or a marker cannot resolve |
| `invalid-operation`        | The declaration has findings, so there is no runnable form    |
| `unknown-operation`        | No operation of that name                                     |
| `operation-not-allowed`    | The target's def type does not carry that behavior            |
| `target-not-found`         | Nothing at the target's URL                                   |
| `target-not-indexed`       | Written but not yet indexed — waiting resolves it             |
| `target-errored`           | The target's index row is an error row                        |
| `actor-required`           | The operation reads the caller, or the realm names a policy, and the request authenticated nobody |
| `operation-not-permitted`  | The realm's permissions declined the caller and no policy grant admits the operation |
| `policy-predicate-failed`  | No grant admitted the operation and a policy predicate threw  |
| `conflicting-targets`      | Two members of a parallel group write the same file           |
| `version-conflict`         | A conditional write whose base version had moved              |
| `precondition-unverifiable`| A conditional write the realm could not decide                |
| `payload-too-large`        | Over the realm's ceiling for a card or file                   |
| `wrong-entry-point`        | Reached the operation core with a `query`                     |
| `internal-error`           | Not the caller's — an unreadable definition, a failing executor, a policy that won't load |

An author writes the `assertion-failed` text, so write it as the sentence a user
should read: "That rhythm event is not open, so there is nothing to escalate."

A batch is all-or-nothing, so a refused batch answers one error and no results —
nothing was written, whichever entry was wrong. `OperationsError.entry` says
which: an index at the top level, or a path such as `[2].boxel:operations[0]` to
a member of a group.

### Under a realm policy

In a realm that names a policy, what a caller the realm's permissions declined
is told turns on one thing: whether those permissions let them read the realm.
The same table holds through `operations()` (the `_operations` envelope) and
the card+json routes:

| Situation                                              | Caller who may read the realm                    | Caller who may not |
| ------------------------------------------------------ | ------------------------------------------------ | ------------------ |
| No grant holds                                         | 403 `operation-not-permitted`                    | 404 `target-not-found` |
| The target's def type does not carry the operation     | 405 `operation-not-allowed`                      | 404 `target-not-found` |
| No such operation, a declaration with findings, an unresolvable type, nothing at the URL | Its own refusal — 404 `unknown-operation`, 422 `invalid-operation`, 404 `target-not-found` | 404 `target-not-found` |
| A predicate threw and no other grant held              | 500 `policy-predicate-failed`                    | 404 `target-not-found` |
| The policy won't load or compile                       | 500 `internal-error`, "Policy unavailable"       | 500 `internal-error`, "Policy unavailable" |
| A create whose type names another realm                | 400 `invalid-params`                             | 404 `target-not-found` |
| A create naming its type by a relative module          | 400 `invalid-params`                             | 400 `invalid-params` |

A caller who may read the realm reaches the policy only by writing — their
reads are the permissions' to allow — so a policy that won't load is a 500 to
them on writes alone. A realm writer never reaches the policy at all.

**A caller who may not read the realm learns nothing about what exists.**
Every refusal their invocation meets before it is admitted, resolution
failures included, answers the same bytes a target that isn't there does.
Over `_operations` that is `title: 'Not found'`, `detail: 'no such target'`,
and nothing of `meta` beyond `meta.entry`; over card+json it is the route's own
not-found. Until a write's grant is decided, anything else the realm would
answer about the write is masked the same way, unless the grant's predicate
holds against the card as stored: a card+json write's 400 for a body it can't
use, its 405, its 412 for a conditional write whose version moved, its 415.
A predicate that throws is logged on the realm's `realm:policy` channel, which
is where the policy's author finds it.

**Nobody signed in.** On the routes that consume the outcome of the realm's
permissions — the ones a grant can reach — in a realm that names a policy, a
request that authenticated nobody, where the permissions want someone, gets
401 `actor-required` as a JSON:API error, whatever the path names. Elsewhere, and in a realm with no policy, it
gets the realm's plain-text 401 `Missing Authorization header`.

**A relative `adoptsFrom` is refused** with 400 `invalid-params` through
`_operations` for every caller, realm owner included, and through a card+json
`POST` for every caller the realm's permissions decline: a card that isn't
stored yet has no location for a relative module to resolve against. Name the
type by URL or registered prefix.

**A card+json error body carries a status and a title, and no `code`.** Over
those routes the status is the whole answer.

[`realm-policy-authoring`](../realm-policy-authoring/SKILL.md) §10 states the
same refusals from the policy author's side.

## 6. Access posture

**The realm's own read/write permissions come first.** Any caller who can write
the realm can invoke any mutating operation on it, a `nonGrantable` one
included; any caller who can read it can invoke any read. A realm that names a
policy is consulted only for what those permissions declined: everything, for
a caller with no permission on the realm; writes, for one who may read it.

**A policy only widens.** It admits callers the permissions declined, one
operation and card type at a time, and never narrows what the permissions
allow. Writing one is
[`realm-policy-authoring`](../realm-policy-authoring/SKILL.md).

**A write's predicate is judged under the write lock, against the state before
the write.** The card the grant reads is the one the write changes, as it
stands when the lock is taken — inside a batch, as the entries before it leave
it. So a caller a list admits can take themselves off that list, and a grant
on an operation that writes the list lets whoever it admits put anyone on it:
mark such an operation `nonGrantable` (§2). A create against a type is judged
by the card it would mint, after `fill` and `input` have run; a named create
anchored on an existing card is judged by that card.

**For a caller who may not read the realm, the realm mints every created
card's id.** A chosen path would tell them which paths hold a card. Their
`lid` still links the cards of one batch to each other and comes back beside
the minted id as `{ lid, id }`, but names no file, so a create sent again with
the same `lid` mints a second card. Their card+json `POST` targets the realm
root; one aimed at a directory beneath it answers 404. A caller who may read
the realm names their own cards, as any writer does.

**The card+json verbs reach the built-in behavior only.** For a caller the
realm admits through a grant, a `PATCH` merges and a `DELETE` removes whatever
the type declares under those names, so a type that redeclares `update`,
`create` or `delete` has that verb refused to such a caller, and the grant is
used through `operations()`. A card+json write that side-loads cards in
`included` is refused to them too.

**An `output` projection shapes an operation's answer and nothing more.** A
field left out of one is still reachable through the card's plain read, its
stored source, or a search. A granted `read` serves the card's whole
representation, as the type's `read` declaration shapes it (§2 covers how far
its links reach). A granted `create` or `update` over card+json answers with
the whole card it wrote, unprojected, whatever `read` grant the caller holds.
**Leave a value out because a consumer does not need it, never because a
caller may not have it.**

A card whose buttons carry real consequence should say so in its own visible
text.

## 7. Worked reference

`packages/experiments-realm/clinical/` is a realm driven entirely by named
operations: a program-guarded `transform`, an arithmetic one, a declarative
`assert` over a link collection, a named `create` that links back through
`instance('id')`, an `appendContainsMany` vitals log, base `LogFile`'s `record`
on a linked `.log` audit file, whose `input` program stamps the timestamp and
the actor, a create-and-link `atomic` batch, a parallel transfer across three
cards, and two saved searches rendered through
`@context.searchResultsComponent`.
`packages/experiments-realm/clinical/patient-record.gts` is the file to copy
from.
