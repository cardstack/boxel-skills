---
name: realm-policy-authoring
description: 'Use when writing, linking, or debugging a realm policy — "let teachers read their own classrooms", "let anyone signed in create a ticket", "why does this grant admit nobody", "point this realm at a policy". The reference for a `RealmPolicy` card: the `policy` pointer on `realm.json`, the `rules` → `targetType` / `grants` → `operation` / `where` shape, what a grant admits and what it never can, the create lane, file and source-read grants and why code needs the realm''s own read, writing `where` in the `policy` BXL profile (membership, the refused partial-match builtins, parentheses), which `query` grants compile to a search filter, `snapshot: true` reads, every issue code and its effect, `validate`, calling `explain` against the live policy or a draft (one card, a search, a page of cards), and the refusals a caller sees. Activates on `RealmPolicy`, `PolicyRule`, `OperationGrant`, `"policy"` in `realm.json`, `where`, `actor()` in a grant, `nonGrantable`, `readSource`, `grants-module-source`, `operation-not-permitted`, `policy-not-filterable`, `partial-match`, `unsnapshotted-policy-read`, `explain`, `explainDraft`, `policy-not-in-force`, "why was this caller refused", "what would this rule change".'
boxel:
  kind: skill
---

# Authoring a realm policy

A realm's permissions say who may read it and who may write it, realm-wide. A
**policy** lets a caller those permissions turn away do particular things to
particular cards: a teacher with no permission on the school's realm may read
the classrooms that list them as a teacher, and rename those classrooms, and
nothing else.

A policy is a card. The realm's `realm.json` names it, and its rules grant
operations on card types, each grant optionally conditioned on a BXL predicate
over the card:

```json
{
  "data": {
    "type": "card",
    "attributes": {
      "rules": [
        {
          "targetType": {
            "module": "https://school.example/education/classroom",
            "name": "Classroom"
          },
          "grants": [
            { "operation": "read", "where": ".teacherIds | any(. == actor())" },
            { "operation": "rename", "where": ".teacherIds | any(. == actor())" },
            { "operation": "query", "where": ".teacherIds | any(. == actor())" }
          ]
        }
      ]
    },
    "meta": {
      "adoptsFrom": {
        "module": "@cardstack/catalog/realm-policy/realm-policy",
        "name": "RealmPolicy"
      }
    }
  }
}
```

Most of what goes wrong with a policy does not throw. A grant the realm cannot
apply is recorded as an issue and left out, and the rest of the policy applies
without it, so the symptom is a caller who is refused for no visible reason.
Check the policy's issues (§9) after every edit.

The operations a grant names are the ones `card-operations-authoring` covers:
the base operations every card carries and the named ones a card type
declares.

## 1. Linking a policy

The pointer is the `policy` string on the realm's `RealmConfig` card —
`realm.json`, `data.attributes.policy`:

```json
{
  "data": {
    "type": "card",
    "attributes": {
      "cardInfo": { "name": "Education" },
      "policy": "https://school.example/org/policies/education"
    },
    "meta": {
      "adoptsFrom": { "module": "@cardstack/base/realm-config", "name": "RealmConfig" }
    }
  }
}
```

| `policy` holds                                         | The realm                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Nothing, `null`, or a blank string                      | Names no policy. Its permissions alone decide every request                                 |
| An absolute `http(s)` card URL                          | Is governed by that card                                                                    |
| A prefix-form id (`@cardstack/catalog/policies/…`)      | Is governed by that card, for a prefix the server maps to a realm                           |
| A relative path, an unmapped prefix, a non-`http(s)` URL, or a non-string | **Names no policy.** The value is dropped and the realm serves on its permissions alone |
| A well-formed id of a card that is missing, errored, or not a `RealmPolicy` | **Refuses every caller its permissions decline**, with a 500 (§9)       |

The last two rows are the trap. A typo in the *shape* of the pointer silently
removes the policy. A well-formed pointer to the wrong card fails closed.

- **The policy card may live in another realm**, including one nobody the
  governed realm serves can read. The realm reads it from the server's index
  on its own authority, so the card must be indexed on the same server, without
  error. A pointer into a realm the server doesn't serve reads as
  `policy-card-missing`.
- **Repointing takes effect at once.** The pointer is read from `realm.json` on
  disk. Settings a predicate reads with `realmConfig()` follow the index pass of
  `realm.json`, so they can trail a direct file edit briefly.
- **A published realm names no policy.** Publishing strips `policy` from the
  published copy of `realm.json`; the published realm answers on its own
  permissions. The source realm keeps its pointer.

**Any writer of the realm can repoint it** — at another policy, at none, or at
a policy card in a realm they cannot read. The realm applies whatever it names
on the server's authority. So the policy constrains callers the realm's
permissions decline; it does not constrain the realm's own writers, and a
realm writer can learn whether a compiling policy sits at a URL (a 500 against
an ordinary refusal) and exercise its grants against cards they control. A
policy's rules are not secret from the writers of other realms on the server.
**Never put a value that must stay secret in a predicate.**

## 2. The card shape

The definitions live in the catalog realm:

```
RealmPolicy   (CardDef)   rules     = containsMany(PolicyRule)
PolicyRule    (FieldDef)  targetType = contains(CodeRefField)
                          grants    = containsMany(OperationGrant)
OperationGrant(FieldDef)  operation = contains(StringField)
                          where     = contains(PolicyPredicateField)
```

An instance adopts from `@cardstack/catalog/realm-policy/realm-policy`, name
`RealmPolicy`. Write it as JSON. A rule is a field holding a `containsMany` of
grants, and the card API renders no editor for a `containsMany` nested inside a
field, so the card's edit view can't reach a rule's grants.

**`targetType`** is a code ref, `{ "module", "name" }`. The module is an
absolute URL, a prefix form (`@cardstack/base/card-api`), or a path relative to
the policy card's own URL — `../classroom` for a policy card at
`policies/education` in the realm that holds `classroom.gts`. A module that
re-exports the type works too.

**`operation`** is the name a caller invokes — a base operation (`read`,
`update`, `query`, …) or a named operation the type declares (`rename`).

**`where`** takes three forms:

| `where`                                   | Means                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------- |
| absent or `null`                          | Unconditional — the grant admits every card the rule matches           |
| `".teacherIds \| any(. == actor())"`      | A BXL predicate over the card's stored values                         |
| `{ "bxl": ".headTeacher == actor()", "snapshot": true }` | A predicate that may read computed values and searchable links (§8) |

`""` (or whitespace) is not "no condition"; it records `invalid-predicate`.
Leave `where` out for an unconditional grant.

**Any other shape breaks the whole card, not just the grant.** An object with a
key besides `bxl` and `snapshot`, a `bxl` that isn't a string, or a `snapshot`
that isn't a boolean (`"yes"`) fails the card when it is indexed. The realm then
records `policy-card-unloadable` and the whole policy is out of force: every
caller the realm's permissions decline gets 500 (§9).

The card also carries operations no grant can reach: `validate`, which
answers what the policy compiles to (§9), and `explain` with its draft, search
and listing forms, which answer what it decides for one caller, card and
operation (§10). Its isolated view runs both.

## 3. What a grant admits

**A policy only widens access.** A request the realm's permissions allow never
reaches the policy — a realm writer's write and a realm reader's read evaluate
no predicate. The policy is consulted only for what the permissions declined:
everything, for a caller with no permission on the realm; writes, for a caller
who may read it.

**Grants union.** A request is admitted when any grant in any rule that
matches holds. Order changes nothing, and nothing in a policy denies. Two rules
on the same type are two sets of grants, either of which can admit.

**A rule covers its type and every subtype, never an ancestor.** A rule on
`Classroom` covers a `Homeroom extends Classroom`; a rule on `Homeroom` does not
cover a plain `Classroom`.

**Name the root type to mean everything:**

| You mean            | `targetType`                                                       |
| ------------------- | ------------------------------------------------------------------ |
| every card          | `{ "module": "@cardstack/base/card-api", "name": "CardDef" }`        |
| every file          | `{ "module": "@cardstack/base/file-api", "name": "FileDef" }`        |

**Never `BaseDef`.** A rule on `BaseDef`, or on any field definition, compiles
to no grants: the realm records each grant on it as `unknown-operation` ("BaseDef
has no `read` operation…"), whatever operation it names. The message blames the
operation; the cause is the type.

**A named operation is grantable only on the type that declares it, or a
subtype.** A rule on `CardDef` naming `rename` records `unknown-operation` even
though `Classroom` declares `rename`, and that grant is inactive. Put the grant
on a rule for `Classroom`.

**A grant on a named operation never grants its base.** Granting `rename` (a
`transform`) does not grant `transform`; granting `appendActivity` (a `create`)
does not grant a plain `create` of the card type it mints. That is the point of
a named operation: the grant admits the one narrow write the declaration
expresses.

**What each target carries.** A card carries `read`, `readSource`, `create`,
`update`, `delete`, `query`, `transform` and `appendContainsMany`, plus its
named operations. On a **file**, a grant only ever admits `readSource` (§5).
`explain` and `validate` are never granted (§11).

**A `query` grant only scopes search.** It never admits a direct read of a
card, and a `read` grant never puts a card in anyone's search results. To let a
teacher both open and list their classrooms, grant both (§7).

**The card+json verbs reach the built-in behavior only.** A granted `update`,
`delete` or `create` admits `PATCH`, `DELETE` and `POST` on the card+json
routes — unless the type redeclares that operation, in which case the verb is
refused to a caller the permissions declined, and the grant is used only
through `_operations`. A card+json write that side-loads cards in `included` is
refused to such a caller too, whatever the grants say.

**A granted `read` serves the card's whole representation**, as the type's own
`read` declaration shapes it for every caller: under the default `links:
'full'`, the linked cards and the results of query-backed fields arrive in
`included`, even when the caller holds no grant on those cards' types and a
direct read of one would be refused. Under `links: 'ids'` the relationships name
their targets and nothing is assembled. The realm records
`grant-reaches-ungranted-type` against such a grant as a warning (§9). **A
declaration applies uniformly**: the response shape never depends on how the
caller was authorized, so a grant can't be given a narrower representation than
a realm reader gets — narrow the declaration itself (`card-operations-authoring`
§2).

## 4. The create lane

A create has no stored card to test, so it is matched and judged differently.

- **It is judged by the resolved type**, never by the type the payload claims.
  A payload whose `adoptsFrom` names a module that re-exports `Bulletin` is a
  `Bulletin` create; one whose class is *called* `Bulletin` but resolves to
  `Classroom` is a `Classroom` create.
- **A `CardDef` rule granting `create` covers every create.** A rule on a type
  covers creates of its subtypes.
- **Only a `create` grant admits a create.** `read`, `update` and `delete` grants
  never do, on any type.
- **A `where` on a create reads the card being minted** — its attributes as the
  payload leaves them after staging. A named create anchored on an existing
  card (`appendActivity` invoked on a classroom) is judged by that card instead.
- **A create grant cannot use a snapshot read.** The new card is not in the
  index yet; a `create` grant with a `snapshot` predicate that reads a computed
  or linked value records `unsnapshotted-policy-read` (§8).
- **`adoptsFrom` must name an absolute or prefix-form module.** A create whose
  type is `{ "module": "./bulletin" }` is refused with 400 `invalid-params`
  through `_operations` for every caller, realm owner included, and through a
  card+json `POST` for every caller the realm's permissions decline: a card
  that isn't stored yet has no location for a relative module to resolve
  against.
- **For a caller who cannot read the realm, the realm chooses the new card's
  id.** It lands under the type's directory (`…/Bulletin/<minted>`). A `lid`
  still links the cards of one batch to each other, but names no file. Their
  card+json `POST` targets the realm root; a `POST` to a subdirectory answers
  404.

## 5. Files and source

`readSource` is the read of a path's stored bytes: a data file's bytes, or a
card's raw `.json`. It is the one operation a grant admits on a file, and it is
judged differently from every other read, because it is matched on what is
stored at the path rather than on an index row.

### How a file resolves to a type

A card's `.json` is matched on the card's type. Every other stored file is
matched on the `FileDef` subclass its **extension** names, and nothing else:
not its bytes, not its index row. **Renaming a file changes which rule matches
it, and whoever can write a file chooses its name.** A realm writer who saves
a document as `notes.png` puts it under every grant on `PngDef` and `ImageDef`.

A rule matches through ancestry (§3), so a rule on an intermediate class
covers every extension beneath it:

| Name                                        | Resolves to                                  | Also matched by a rule on        |
| ------------------------------------------- | -------------------------------------------- | -------------------------------- |
| `logo.png`                                  | `PngDef`                                     | `RasterImageDef`, `ImageDef`, `FileDef` |
| `photo.jpg`, `photo.jpeg`                   | `JpgDef`                                     | `RasterImageDef`, `ImageDef`, `FileDef` |
| `icon.svg`                                  | `SvgDef`                                     | `ImageDef`, `FileDef` — not `RasterImageDef` |
| `notes.md`, `notes.markdown`                | `MarkdownDef`                                | `FileDef`                        |
| `readme.txt`                                | `TextFileDef`                                | `FileDef`                        |
| `build.log`                                 | `LogFile`                                    | `TextFileDef`, `FileDef`         |
| `grades.csv`                                | `CsvFileDef`                                 | `FileDef`                        |
| `syllabus.pdf`                              | `PdfDef`                                     | `FileDef`                        |
| `song.mp3`                                  | `Mp3Def`                                     | `AudioDef`, `FileDef`            |
| `song.mid`                                  | `MidiDef`                                    | `FileDef` — not `AudioDef`       |
| `clip.mp4`                                  | `Mp4Def`                                     | `VideoDef`, `FileDef`            |
| `data.json` whose bytes are not a card document | `JsonFileDef`                            | `FileDef`                        |
| `Classroom/1.json` holding a card document  | The card's type, from its `adoptsFrom`       | That type's ancestors, up to `CardDef` |
| `theme.css`, `site.yml`, `LICENSE`, `.gitignore`, `bundle.mjs` | `FileDef` itself          | —                                |
| `classroom.gts`, `util.ts`, `app.js`, `app.gjs` | No type: module source (see below)       | Nothing                          |

- **The extension is the last dot of the file name, in any case.** `photo.PNG`
  is a `PngDef`; `backup.tar.gz` is a `.gz`, which no def covers, so `FileDef`.
- **An extension no def is written for, or none, resolves to `FileDef`
  itself.** So does a dot-file: `.gitignore` has no extension. A rule on a
  narrower type never matches one.
- **A `.json` is a card's source only if its bytes are a card document.** It is
  then matched on the type the document names, judged from the stored bytes,
  never from the index, so a card written a moment ago and not yet
  indexed is matched on its new type. A card whose type doesn't resolve is
  matched by nothing, not read as a data file. Any other `.json` is a
  `JsonFileDef`.
- **A path with nothing stored at it is matched by nothing**, so a grant
  answers "not found" for it as for a file it refuses.

Name a narrower type in `targetType` the way §2 names any type —
`{ "module": "@cardstack/base/image-file-def", "name": "ImageDef" }`.

### What a `readSource` grant serves

- **A grant on a card type serves that card's raw `.json`**, and a subtype's. A
  rule on `CardDef` granting `readSource` serves every card's raw source except
  the realm's config card and policy cards, which no grant reaches (§11).
- **A card's `.json` is its whole stored document**, including every field the
  type's `read` declaration leaves out of a read. A `readSource` grant beside a
  narrower `read` hands the caller everything that `read` was written to
  withhold. Grant `readSource` on a card type only where the caller may see all
  of it.
- **A rule on `FileDef` serves every stored file that isn't module source**:
  every data file, every dot-file (`.gitignore` and the like), and files of
  types nobody has written a def for. A rule on `FileDef` is a catch-all; to
  keep dot-files out, grant a narrower type (`ImageDef`, `PdfDef`, …), which a
  dot-file never matches.
- **No grant reaches a path the realm ignores**: anything in a `.git` or
  `node_modules` directory at any depth, and whatever the `.gitignore` at the
  realm's root names. A caller reaching the realm only through grants is told such a path
  holds nothing. The `.gitignore` itself is served by a rule on `FileDef`
  unless its own patterns name it.

### Over HTTP

A `readSource` grant is honored on the routes that serve a path's bytes: the
`card+source` read and the realm's raw file serve, `GET` and `HEAD`. For a
caller the realm's permissions decline, those routes read the name **exactly
as given**:

- **No extension fallback and no redirect.** Ask for `Classroom/1.json`, not
  `Classroom/1`; `room.v2` is not redirected to `room.v2.json`, and
  `./classroom` never reaches `classroom.gts`.
- **No transpile, and neither the source cache nor the transpile cache.**
  Nothing the route cached for a reader answers them, and nothing read for them
  is cached for anyone else.
- **A granted response is always `Cache-Control: private`.**
- **`If-None-Match` and the other validators count only after the gate has
  admitted the read**, so a refused caller can't probe a file's content with an
  `ETag`.
- **A refused `GET` is a 404 identical to a missing path**, and a refused
  `HEAD` gets the realm's discovery answer, as for any path such a caller can't
  read (§12).

### Predicates on a file

A file has no document to read. A `where` on a file rule sees only the file's
URL, through `instance("id")`, and the caller, through `actor()`. `.` holds no
fields and `instance()` no other key, so write the predicate on those two:

```json
{
  "operation": "readSource",
  "where": "instance(\"id\") | startswith(\"https://school.example/education/handouts/\")"
}
```

The path is a name a writer chose, so a path predicate inherits the rename
caveat above: anyone who can write into `handouts/` decides what it serves.

### Code needs the realm's own read

Module source is never grantable:

- **`.ts`, `.gts`, `.js` and `.gjs` resolve to no type**, so no rule reaches
  them. Neither the transpiled module a browser's `import` loads nor a
  directory listing has a type either. Other script extensions (`.mjs`,
  `.cjs`) are not module source to the realm: they are data files a `FileDef`
  rule serves.
- **A rule whose type is `TsFileDef` or `GtsFileDef`, or descends from one,
  records `grants-module-source`**, and the whole rule is dropped (§9).
  `GtsFileDef` extends `TsFileDef`, so a rule on either is caught.
- **A caller who reaches the realm only through grants is told of code what
  they are told of an empty path:** a `GET` gets a 404 identical to a missing
  path, and a `HEAD` gets the realm's discovery answer. A caller who is not
  signed in gets the realm's own plain-text 401 on a module path, not
  `actor-required`.

So **code mode needs the realm's own read permission** — browsing the file tree
and opening a module both do. The host doesn't offer code mode to a caller
without it: the submode switcher, a card's error and an attached file offer no
way in, and the assistant's tools that open code mode refuse. That is a
courtesy, not the boundary; the endpoints are. A shared link can still land a
grant-reached caller in code mode, where the file tree and every module are
refused and only a file a grant reaches opens — and a card's `.json` granted
by `readSource` can show there beside a preview its missing `read` refuses.
Anyone who authors code in a realm needs the realm's own read permission, and
its write permission to save.

## 6. Writing `where`

A predicate is BXL validated against the **`policy` profile**. It must evaluate
to exactly `true`; anything else — `false`, `null`, a string — does not hold.
`bxl-authoring` covers the language; this section covers what the profile
changes.

### What `.` is

`.` is the card's **stored** values, projected the way a card operation sees
them:

| Read                                   | Gets                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| `.title`, `.address.city`              | Stored scalars and contained values                               |
| `.id`                                  | The card's own URL                                                |
| `.lead.id`                             | The absolute URL a `linksTo` names (relative links are resolved)  |
| `.lead == null`                        | An unset `linksTo`                                                |
| `.teachers \| any(.id == "https://…")` | A `linksToMany`, as a list of `{ id }`                            |

There is no `.attributes` or `.relationships`. A computed field's value and a
linked card's fields are **not** in `.` — reading one needs `snapshot: true`
(§8).

### The calls

| Call                 | Gives                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| `actor()`            | The caller's Matrix user id, `"@teacher:school.example"` — only that          |
| `instance("key")`    | One of the card's raw stored attributes; `instance("id")` is its URL          |
| `realmConfig("key")` | A setting from the governed realm's `config` object on `realm.json`            |

`params()` is refused (`invalid-predicate`): a grant decides whether a caller
may invoke, never what they sent. `NOW()`, `TODAY()` and the random functions
are refused too — a predicate gives one answer for one card and one caller.

```json
{ "operation": "approve", "where": "realmConfig(\"approver\") == actor()" }
```

with the governed realm's `realm.json` holding
`"config": { "approver": "@principal:school.example" }`.

### Membership: `any(. == actor())`

Spell "the caller is in this list" as:

```
.teacherIds | any(. == actor())
```

- `actor() in .teacherIds` compiles and **throws** on every card.
- `contains` is a **substring** match: `.teacherIds | contains([actor()])` holds
  for `@bob:school.example` against a list holding `@bob:school.example.org`. The
  realm refuses it — see below.

### Partial-match builtins are refused

Any call that can hold for a value it matches only in part records
`partial-match`, and the grant is inactive. The call is refused wherever it
appears in the predicate, not only next to `actor()`:

| Kind                         | Refused                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Substring                    | `contains`, `inside`, `index`, `rindex`, `indices`, `FIND`, `SEARCH`, `isIn`  |
| Pattern                      | `test`, `match`, `capture`, `scan`, `matches`, `like`                          |
| Nearest-value lookup         | `MATCH`, `LOOKUP`, `LOOKUP_BY`, `VLOOKUP`, `VLOOKUP_BY`, `HLOOKUP`, `XLOOKUP`, `bsearch` |
| Internal helpers             | any call whose name starts with `_`                                            |
| Anchored at a variable value | `startswith`, `endswith`, `ltrimstr`, `rtrimstr`, `trimstr` — unless their one argument is a fixed string literal |

Compare strings with `==`. A fixed prefix or suffix is allowed, and the realm
cannot check where the literal ends, so end a prefix at a delimiter and start a
suffix at one:

```
actor() | endswith(":school.example")
```

`":school.example"` cannot be satisfied by `@eve:evilschool.example`;
`"school.example"` can.

### Parenthesize every membership test in a compound predicate

`|` binds more loosely than `or` and `and`, so an unwrapped second test joins
the first pipeline and the predicate throws:

```
(.teacherIds | any(. == actor())) or (.leadTeacherIds | any(. == actor()))
```

### Other refusals

All of these record `invalid-predicate`, whose message names the rule broken:

- **Single quotes.** `.status == 'open'` doesn't tokenize. Use double quotes —
  escaped inside JSON: `".status == \"open\""`.
- **Aggregates** — `SUM`, `COUNT`, `MAX`, jq `max`/`min`, and the rest.
- **Error masking** — `try`, `IFERROR`, `ISERROR` and kin. A predicate that
  fails must fail visibly.
- **Structure** — `def`, `reduce`/`foreach`, `..`, assignment, `label`/`break`,
  `@base64` and the other formats.

Bindings (`. as $c`), `IF(…)`, `has(…)`, `length`, `tonumber`, case folding and
`split` are fine.

### A predicate that throws

A predicate that throws on a card — `(.title | tonumber) > 0` on a title that
isn't a number — **denies**, unless another grant holds. When none does, the
caller gets 500 `policy-predicate-failed` if they may read the realm, and the
same 404 as any refusal if not; explaining the decision answers
`predicate-threw` (§10). A throw
is a bug in the policy, not a refusal: guard the value (`.title != null and
…`) rather than relying on it.

## 7. `query` grants and search

A `query` grant is never evaluated card by card. Its predicate is compiled into
a search filter, and every ad-hoc search by a caller the realm's permissions
decline — the realm's `_search` and `_federated-search` — is narrowed by it.

**A grant on a named query is a different grant.** A grant whose `operation`
names a `query` operation the type declares (`listMySchedules`) compiles its
`where` the same way, and its filter narrows only that saved search, invoked by
name. It never admits an ad-hoc search, and a grant on `query` never admits the
saved one: granting a saved search is not granting the freedom to write any
filter over its type. Prefer the named form when the type's `query`
declaration narrows what each row carries (its `links`), since an ad-hoc search
serves every row with its whole link closure. A predicate the filter compiler can't express records
`policy-not-filterable`, and the grant admits nothing.

What compiles:

| Predicate reads                       | Compiles when                                                          |
| ------------------------------------- | ---------------------------------------------------------------------- |
| A text field                          | `==` / `!=` against a string or `actor()`, on a field whose type is exactly `StringField`, `TextAreaField`, `MarkdownField` or `ReadOnlyField` |
| A number field                        | `==`, `!=`, `<`, `<=`, `>`, `>=` against a number literal, on exactly `NumberField` |
| A `containsMany` of text              | Membership only: `.teacherIds \| any(. == actor())`                     |
| A `linksTo`                           | `.lead.id == "<absolute URL>"`                                           |
| A `linksToMany`                       | `.teachers \| any(.id == "<absolute URL>")`                              |
| A computed field                      | Only with `snapshot: true`, under the same rules as a stored field      |
| No condition                          | Always — every card of the type and its subtypes                        |

Combine with `and`, `or` and `not` — except that a membership test or an id
comparison can't sit under `not` or `!=`.

What doesn't compile, and records `policy-not-filterable`:

- `realmConfig()`, and string functions — `startswith`, `ascii_downcase`, even
  where the gate would accept them.
- A link's id compared with `actor()`, a relative URL, or a prefix-form id. A
  link is a card, never a person; compare `actor()` with a text field that holds
  user ids.
- A link compared as a whole, `.lead == null` included — only its `.id` is
  comparable. The gate accepts `.lead == null`; a search filter doesn't.
- Any field of a linked card (`.lead.name`), even with `snapshot: true`.
- A query-backed field, in any form.
- Bindings (`. as $c`) and variables, though the gate accepts them.
- `true`/`false` literals, fields of any other type (`BooleanField`, `DateField`,
  custom fields), a whole list (`.teacherIds == […]`), a list position
  (`.teacherIds[0]`), lists of numbers, arithmetic, `//`, `if`, and one field
  compared with another.

How a filter and its predicate can differ:

- **The filter can be narrower.** A comparison BXL holds for an unset value
  doesn't list a card that has none: `.roomNumber < 200` holds in BXL for a
  classroom with no room number (`null < 200`), and `.providerId != actor()`
  for one with no provider, and the filter lists neither. Say `== null` when
  you mean those cards — `.providerId == null` compiles.
- **A subtype that redeclares a field the filter compares is kept out of that
  comparison**, so its cards aren't judged by a field that means something else
  there. If the realm can't name such a subtype in a filter, the grant records
  `policy-not-filterable`.
- **A caller's own condition on the same list field the grant reads must be
  satisfied by the same element.** With the grant
  `.teacherIds | any(. == actor())`, a teacher's search for "classrooms whose
  `teacherIds` include my colleague" returns nothing, even for classrooms that
  list both. Filter such a search on another field.

A `query` grant compiles only on a card type, so a caller a grant reaches never
searches file rows. The config card and every policy card are left out of
every policy-scoped search, so even an unconditional `query` grant on `CardDef`
does not list them.

## 8. `snapshot: true`

A predicate reads the card's stored source by default. Stored source holds a
link as a reference and holds no computed value at all, so a grant that needs
either opts into a **snapshot**: the realm lays the card's indexed values under
its stored ones before evaluating.

| Predicate reads                                         | Needs                                              |
| ------------------------------------------------------- | -------------------------------------------------- |
| Stored fields, `.lead.id`, `.teachers \| any(.id == …)` | Nothing                                            |
| A computed field (`.headTeacher`)                       | `snapshot: true`                                   |
| A field of a `linksTo` marked `searchable` (`.lead.handle`) | `snapshot: true`                               |
| Fields behind a `linksToMany`, a non-`searchable` link, a link inside a contained value or a linked card, a computed value inside a list, a query-backed field, or `instance()` of a computed field | **Unreadable** — no snapshot holds them |

```json
{ "operation": "read", "where": { "bxl": ".headTeacher == actor()", "snapshot": true } }
```

A predicate that reads a value from the second or third row without the
annotation, or a value from the last row in any form, records
`unsnapshotted-policy-read`, and the grant is inactive in both lanes. An
annotated predicate that reads only stored values compiles as an ordinary one.

What a snapshot read costs:

- **It is as fresh as the index.** The indexed values trail a write until that
  write is indexed. A card that is not indexed, or whose index row is an error,
  admits nothing through a snapshot grant.
- **Computed values always come from the index**, even when the stored JSON holds
  a value under the same key.
- **A linked card's fields count only while the stored link still names the
  card the index expanded.**
- **No create** — §4.

Whether a given grant may rest on index-time values is a judgment about how
stale a decision may be; make it per grant.

## 9. When a policy is wrong

**The policy fails closed.** A policy the realm can't compile refuses every
caller its permissions decline. There is no fallback to an earlier version.

**An issue takes out the part it names.** A grant with an issue is inactive and
the rest of its rule applies; a rule with an issue is dropped and the other
rules apply. Each issue has a `code`, a `path` at the author's position
(`rules[1].grants[0].where`, or `""` for the whole card), a plain-language
`message`, and a `severity`:

| Code                                  | Severity | Part     | Means                                                                 |
| ------------------------------------- | -------- | -------- | --------------------------------------------------------------------- |
| `policy-card-missing`                 | inactive | card     | The index holds no card at the pointer                                 |
| `policy-card-unloadable`              | inactive | card     | The card's index row is an error, or its last visit failed            |
| `not-a-policy`                        | inactive | card     | The card isn't a `RealmPolicy`                                         |
| `invalid-rule` (at `rules`)           | inactive | card     | `rules` isn't a list                                                   |
| `invalid-rule`                        | inactive | rule     | `targetType` lacks `module`/`name`, or `grants` isn't a list           |
| `unresolved-type`                     | inactive | rule     | The `targetType` resolves to no exported type                          |
| `grants-module-source`                | inactive | rule     | The rule's type is `TsFileDef` or `GtsFileDef`, or descends from one (§5) |
| `invalid-grant`                       | inactive | grant    | The grant names no `operation`                                         |
| `unknown-operation`                   | inactive | grant    | The type has no such operation (and every grant on `BaseDef`)          |
| `grants-invalid-operation`            | inactive | grant    | The operation is declared but failed to lower                          |
| `grants-authorization-infrastructure` | inactive | grant    | The operation is `nonGrantable`, or the rule's type is a `RealmPolicy` (§11) |
| `unresolved-type` (at `.operation`)   | inactive | grant    | An ancestor of the type has no readable definition, so whether it marks the operation `nonGrantable` can't be told |
| `invalid-predicate`                   | inactive | grant    | `where` is empty, doesn't parse, or breaks the `policy` profile (§6)   |
| `partial-match`                       | inactive | grant    | `where` calls a partial-match builtin (§6)                             |
| `unsnapshotted-policy-read`           | inactive | grant    | `where` reads a value its form can't (§8)                              |
| `policy-not-filterable`               | inactive | grant    | A `query` grant's `where` can't compile to a search filter (§7)        |
| `grant-reaches-ungranted-type`        | warning  | grant    | A `read` or `query` answer carries cards of a type no rule grants a read of (§3) |
| `render-reaches-ungranted-type`       | warning  | grant    | A `query` grant's rendered rows draw on such a type                    |

A card-level issue makes the whole policy uncompilable, and every caller the
realm's permissions decline gets 500 (§12). The two warnings keep their grant
live; every other code takes its part out.

### The reach warnings

A grant on a row covers the row's whole returned representation, and nothing
fails when that reaches further than the rule reads. The two reach warnings are
what say so. They are recorded where the policy compiles, from the definitions
of the types the closure crosses, so they cost no index pass and read no card;
a link added to one of those types is found the next time the policy
revalidates.

**`grant-reaches-ungranted-type`** is recorded against a `read` or `query`
grant whose document, under the `links` strategy that governs it, carries cards
of a type no rule lets a caller read. Its `path` is the grant's, and its
`message` names the **reaching type** (the rule's), the **reached type**, and
the **field path** the closure took (`lead.office`). Each reached type gets its
own issue.

- **The strategy that governs it.** A grant on a `read`-based operation is
  served under that operation's declaration — the type's own `read` unless it
  names another; a named query grant under that query's `links`.
  An ad-hoc `query` grant has no declaration, so it is always `full`. Only
  `full` assembles anything, so only a `full` document is walked.
- **What counts as granted.** A reached type is readable when a rule on it, or
  on an ancestor, keeps a `read`, a `readSource`, or a `query` that compiled a
  filter. A rule that only lets a caller write or delete the type doesn't count,
  and neither does a `query` grant that admits nothing. The config card and
  every policy card never count, even under a catch-all `CardDef` rule.
- **The grant stays live.** Plenty of realms reach across a link on purpose;
  the warning tells you the reach is there.

The fix goes on the **granted** side:

| The grant is                | To send only the links                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| `read`-based                | `links: 'ids'` on the granted operation's declaration                     |
| A named query               | `links: 'ids'` (or `'none'`) on that query                                |
| The ad-hoc `query`          | Grant a named query that declares `links: 'ids'` instead — the ad-hoc search can't be narrowed |

Or, to share the reached cards on purpose, add a rule that lets callers read the
reached type (never offered for a policy card, the config card, or a type
every card descends from). **A declaration on the reached type never helps**: a
card carried through a link is carried whatever its own type declares. Nor
does a narrower `where` on the grant: every card it does admit still carries
its closure.

**`render-reaches-ungranted-type`** is the same check over a `query` grant's
**rendered** rows. A search row carries its prerendered HTML, and a render
draws the card's links whatever `links` says, so `links: 'ids'` doesn't clear
it. Mark every format `unshareable` in the named query's `html`
(`card-operations-authoring` §2) — the check can't tell which formats draw the
link, so one left shareable keeps the warning — or grant such a named query in
place of the ad-hoc `query`, or change the type's templates so they don't draw
the linked cards. A `read` grant serves no rendering and never records it.

### Seeing the issues

- **The policy card's isolated view** validates the policy as the realm compiles
  it: a "not in force" alert when it won't compile, an "inactive" mark on each
  rule and grant an issue takes out, a warning mark on a grant that stays live,
  and an issues list. It re-checks after each index pass of the realms the
  policy reads. Embedded and fitted views don't.
- **The realm's config card** shows whether the policy its pointer names is in
  force, beside the `policy` field. It is the only place the pointer problems
  (`policy-card-missing`, `not-a-policy`) appear for a card that isn't there.
- **`validate`**, invoked on the policy card (or `validatePolicy` on the realm's
  config card), answers the same thing as data:

  ```json
  POST <policy card's realm>/_operations
  X-HTTP-Method-Override: QUERY
  Content-Type: application/vnd.api+json;ext="https://boxel.ai/ext/operations"
  Accept: application/vnd.api+json;ext="https://boxel.ai/ext/operations"

  { "boxel:operations": [
      { "op": "invoke", "boxel:name": "validate", "href": "https://school.example/org/policies/education" }
  ] }
  ```

  Its result lists `issues`, and `rules` — the rules and grants in force, each a
  `path`. A rule or grant missing from `rules` is inactive; a grant carrying
  `admitsNothing: "unfilterable"` is kept but admits nothing. Only a caller who
  can read the policy card's realm, and every realm the compile read, may ask.

**An edit reaches the gate within seconds.** The compiled policy is
revalidated when the index of the policy card, or of a type its rules read,
moves, and at least every 5 s. Validate after each edit, then explain the
grant for a caller it should admit and one it shouldn't (§10).

## 10. Explaining a decision

A policy narrower than you meant produces refusals someone has to report. A
policy wider than you meant produces nothing at all. **`explain`** asks the
realm directly: for one caller, one card and one operation, it runs the target
realm's gate the way that invocation would, stops at the decision, and reports
how the gate reached it. Nothing is invoked, so explaining a `delete` deletes
nothing.

### Asking

Every policy card carries six explain operations, all built on base `explain`.
Each is a separate declaration because a declared param is always required:

| Operation             | Asks about                                      | Params beyond the question |
| --------------------- | ----------------------------------------------- | -------------------------- |
| `explain`             | One card or file                                | —                          |
| `explainDraft`        | One card or file, against a draft               | `draft`                    |
| `explainSearch`       | What a search returns to the caller             | `search`                   |
| `explainDraftSearch`  | The same, against a draft                       | `search`, `draft`          |
| `explainListing`      | Each card on one page of a realm                | `list`                     |
| `explainDraftListing` | The same, against a draft                       | `list`, `draft`            |

The question is three strings:

| Param       | Holds                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| `actor`     | The caller's Matrix user id, or `""` for a caller who isn't signed in                    |
| `target`    | The URL of a card or file. For a search or a listing, the URL of the realm it runs in   |
| `operation` | The name the invocation would invoke: `read`, `rename`, `listMine`, …                    |

**Invoke it on the policy card the target's realm names**, in the policy card's
realm. The explain asks the gate of the realm that holds the target, so the
policy card and the cards it governs can sit in different realms.

The calls below are made against the school example realms, which ship in the
boxel repository at `packages/school-example-realm`: `school-org` holds the
roster and the policy card, and `school-education` holds the classrooms. Each
deployment links `school-education`'s `realm.json` to that policy card and fills
in the roster's Matrix ids, since both differ by environment. They are shown
mounted at `https://school.example/it-admin/`, which is a different place from
the illustrative realms the earlier sections use, with a different policy. Alice
teaches Room 204 and leads Room 205; Room 206 is Ben's alone. Why can't Alice
read Room 206?

```ts
import { operations } from '@cardstack/base/operations';
import { RealmPolicy } from '@cardstack/catalog/realm-policy/realm-policy';

let explanation = await operations<typeof RealmPolicy>(policy).explain({
  actor: '@alice:school.example',
  target:
    'https://school.example/it-admin/school-education/classrooms/room-206',
  operation: 'read',
});
```

Over the wire it is an entry in an `_operations` request to the policy card's
realm, sent as `QUERY` the way `validate` is (§9), and its answer is that
entry's result:

```json
POST https://school.example/it-admin/school-org/_operations
X-HTTP-Method-Override: QUERY
Content-Type: application/vnd.api+json;ext="https://boxel.ai/ext/operations"
Accept: application/vnd.api+json;ext="https://boxel.ai/ext/operations"

{ "boxel:operations": [
    { "op": "invoke", "boxel:name": "explain",
      "href": "https://school.example/it-admin/school-org/policies/education",
      "data": {
        "actor": "@alice:school.example",
        "target": "https://school.example/it-admin/school-education/classrooms/room-206",
        "operation": "read"
      } }
] }
```

Asked by the IT admin, who reads both realms, the realm answers:

```json
{ "atomic:results": [ {
    "actor": "@alice:school.example",
    "target": "https://school.example/it-admin/school-education/classrooms/room-206",
    "operation": "read",
    "acl": { "read": false, "write": false },
    "decision": "denied",
    "reason": "predicate-false",
    "refusal": { "status": 404, "code": "target-not-found" },
    "rules": [
      { "targetType": { "module": "https://school.example/it-admin/school-code/classroom", "name": "Classroom" },
        "path": "rules[0]",
        "grants": [
          { "path": "rules[0].grants[0]",
            "where": "(.teacherIds | any(. == actor())) or (.leadTeacherIds | any(. == actor()))",
            "tier": "stored", "outcome": "did-not-hold" }
        ] }
    ]
} ] }
```

Only the `read` grant is listed: a rule's `grants` holds the grants that name
the operation asked about, so the rule's `appendActivity` grant doesn't appear.
The same question about Room 204, whose `teacherIds` list Alice, answers
`allowed`, `granted`, the grant's `outcome` as `held`, no `refusal`, and
`"admittedBy": { "rule": 0, "grant": 0 }`.

The policy card's isolated view asks the same questions from its **Explain a
decision** panel: one card, a search, or every card in a realm, each optionally
against a draft.

**The target is a card or a file, never a type.** A plain `create` mints from a
type and has no stored card to name, so it can't be explained. A named create
invoked on an existing card (`appendActivity` on a classroom) can be, since its
target is that card.

### Who may ask

- **The caller needs read on both realms**: the policy card's and the target's.
  Read is the whole requirement, not ownership. A reader of both may explain any
  actor, themselves included, and learns that actor's standing in the target
  realm's permissions (`acl`), which the realm's permissions listing shows only
  to its owners.
- **The caller is judged by their own session.** A revoked session, or one
  delegated to the policy card's realm alone, asks as nobody.
- **No grant reaches it.** Every explain operation is `nonGrantable` (§11). A
  grant naming `explain` on a `RealmPolicy` rule records
  `grants-authorization-infrastructure`. On a rule for any other type,
  `CardDef` included, it records `unknown-operation`, because only a policy
  card declares `explain`. Either way the grant is inactive, so a caller who
  reaches the policy card's realm only through a grant can't explain anything,
  their own access included.

How each refusal reads:

| Situation                                                                 | Answer                                         |
| ------------------------------------------------------------------------- | ---------------------------------------------- |
| The caller can't read the policy card's realm | That realm's own refusal before explain runs: 404 `target-not-found` where the policy card's realm names a policy of its own, its permissions' 403 where it doesn't. Either way the same bytes whatever the question asks about |
| The caller can't read the target's realm, the session is revoked or delegated, the target doesn't exist, its realm isn't served here, or its realm is archived | 404 `target-not-found`, the same bytes in every case |
| The request sends no credentials                                          | 401 before explain runs (`actor-required` where the policy card's realm names a policy) |
| The target's realm doesn't name this policy card                          | 422 `policy-not-in-force`                      |
| A draft names a type in a realm the caller can't read                     | 403 `operation-not-permitted`, refused whole   |
| The question is malformed, or asks about more than 100 decisions          | 400 `invalid-params`                           |

A caller who can't read the target's realm learns nothing from an explain about
which cards exist there.

### What it answers

The answer is a `PolicyExplanation`, the object `explain(…)` resolves to:

| Field        | Holds                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------- |
| `actor`, `target`, `operation` | The question as the realm read it. `actor` is `null` for `""`          |
| `acl`        | `{ read, write }`: what the target realm's own permissions allow the actor               |
| `decision`   | `allowed`, `denied`, or `failed` (deciding faults, and the invocation would answer 500)  |
| `reason`     | Why, from the table below                                                                 |
| `refusal`    | `{ status, code }` exactly as the actor would receive it. Absent when allowed            |
| `rules`      | Every rule whose `targetType` is the target's type or an ancestor, in policy order: `targetType`, `path`, and `grants`, the rule's grants that name the operation. A rule governing the type with no grant for the operation is listed with `grants: []` |
| `admittedBy` | `{ rule, grant }`: the grant that admitted it, where one did                              |
| `draft`      | `{ issues }`, when answered against a draft                                              |
| `search`     | What the policy composes into a search, when a search was asked about                   |

**`admittedBy` indexes the explanation, not the policy.** `{ "rule": 0,
"grant": 0 }` is the first grant listed in the explanation's first rule. That
grant's `path` (`rules[2].grants[1]`) is where it sits in the policy card, in
the same form a policy issue's `path` takes.

**`refusal` is what the actor sees, not what the asker sees.** An actor who
can't read the target's realm is refused with 404 `target-not-found` whatever
the reason; `reason` still says why. Over a card+json route, the actor sees only
the status (§12).

Each listed grant carries its `path`, its `where` as written (absent for an
unconditional grant), the `tier` its predicate reads (`stored`, or `snapshot`
for one marked `snapshot: true`, which is checked against the index's copy of
the card, §8), and an `outcome`:

| `outcome`       | Means                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| `unconditional` | No `where`; the grant admits outright                                          |
| `held`          | The predicate evaluated to `true`                                              |
| `did-not-hold`  | It evaluated to anything else                                                  |
| `threw`         | It threw (§6)                                                                  |
| `not-evaluated` | The gate decided without it: an earlier grant admitted, or a refusal came first. On a search, every grant with a `where` |

| `reason`                       | Means                                                                       |
| ------------------------------ | --------------------------------------------------------------------------- |
| `acl`                          | The realm's own permissions allow this, so the policy isn't consulted and `rules` is empty |
| `granted`                      | A grant admits it                                                           |
| `no-grant`                     | No rule for the target's type grants this operation                          |
| `predicate-false`              | Grants for the operation matched, and none of their predicates held          |
| `predicate-threw`              | A predicate threw and no other grant held (`decision: failed`)               |
| `non-grantable`                | The operation is `nonGrantable` on the type or an ancestor, or is an explain or a validate |
| `query-lane`                   | The operation is built on `query`; see below                                  |
| `authorization-infrastructure` | The target is the realm's config card or its policy card, or the operation reads, writes or mints a policy card (§11) |
| `unmatchable-target`           | No rule can match: a card whose index row is an error, a file for anything but `readSource`, module source, or a path the realm ignores |
| `not-resolved`                 | The target doesn't carry the operation; `refusal` says how it's refused      |
| `actor-required`               | `actor` is `""` and the permissions don't let an anonymous caller in: 401   |
| `policy-unloadable`            | The realm can't load its policy (`decision: failed`)                         |

**An operation built on `query`, explained on a card, answers `query-lane`**,
with no rules: a query isn't invoked on a card, and its grants are judged by
the search it's named in. Explain the search instead, with `explainSearch`. A
query that is `nonGrantable` on the type or any ancestor answers
`non-grantable`, even where a subtype redeclares it without the flag. A caller
who can read the realm answers `acl`.

The answer doesn't say what to change. A `draft.issues` entry has the same
shape as a policy issue; §9 says what each code means.

### Explaining a search

`search` names the search the way its request would, and `target` is the realm
it runs in:

| The search            | `operation`             | `search`                                  |
| --------------------- | ----------------------- | ----------------------------------------- |
| A named query         | Its name (`listMine`)   | `{ "on": <type that declares it>, "params": { … } }`, `params` optional |
| An ad-hoc search      | `query`                 | `{ "filter": <the filter it sends> }`     |

A search refuses nobody it can run for; it returns rows, or none. So `denied`
on a search means the search has no rows, and carries a `refusal` only where
the search itself would be refused:

| `decision` / `reason`        | The search                                                                |
| ---------------------------- | ------------------------------------------------------------------------- |
| `allowed` / `acl`            | Runs unscoped: the actor can read the realm                               |
| `allowed` / `granted`        | Runs narrowed by the grants that admit it                                 |
| `denied` / `no-grant`        | Returns nothing: no grant on its operation compiled a filter               |
| `denied` / `non-grantable`   | Returns nothing: a grant compiled, and a declaration keeps the query out of every policy |
| `denied` / `not-resolved`    | Is refused as sent: no such named query, or a filter the search grammar rejects. `refusal` is the search's own |
| `denied` / `actor-required`  | Is refused 401: `actor` is `""` and the realm's permissions want someone |
| `failed` / `policy-unloadable` | Fails: the realm can't load its policy                                  |

The answer's `search` holds `operation`; `types`, the types whose rules count
(the declaring type, or each type the filter anchors to; empty when the filter
anchors to none, so nothing can grant it); `filter`, the search's own filter as
the realm runs it; `fragment`, what the policy adds, so the search runs
`{ "every": [filter, fragment] }`; and `index`. Each listed grant carries
`filterable: true` or `false` in place of an evaluated outcome. A grant with
`filterable: false` is one that records `policy-not-filterable` (§7).

**A search is as fresh as the index.** `index.pending` counts the index passes
yet to land, and `index.oldestPendingMs` how long the oldest has waited. Until
they land, the search answers from the cards as they were, while an explain of
the same card answers from it as stored. `{ "pending": 0 }` means the index has
caught up.

### Explaining every card on a page

`list` is `{ "on"?: <type>, "page"?: { "number"?, "size"? } }`, and `target` is
the realm. It explains each card on one page of the realm's cards, of `on` and
its subtypes or of every type, ordered by URL, each as its own question. The
answer is `{ explanations, page: { number, size, total } }`, plus `draft` once
when answered against a draft. A card deleted while the page is read is left
out.

**One request explains at most 100 decisions.** `size` defaults to 100 and may
not exceed it. The cap counts every explain in a batch together: a listing
counts its `size`, and any other explain counts one. So a hundred single
explains pass, and two listings of 60, or a full page and one more explain, are
refused whole with 400 `invalid-params` before anything is explained. Page
through the rest with `page.number`.

### Against a draft

The `draft` param is a policy document: an object holding the `rules` a
`RealmPolicy` card holds, as in its `data.attributes`. A whole card document
(`{ "data": … }`) is refused with 400 `invalid-params`.

- **The draft is compiled in memory, for this answer alone**, in place of the
  card the target's realm names. Nothing caches it or serves it, the policy in
  force doesn't change, and a predicate that throws in it isn't logged as the
  realm's fault. A relative `targetType` module resolves against the card in
  force.
- **It rides the explain of the card in force.** Invoke `explainDraft` (or its
  search and listing forms) on the policy card the target's realm names. A
  separate draft card that no realm names answers 422 `policy-not-in-force`
  for its own explain, draft or not.
- **The answer carries `draft.issues`**: what compiling the draft recorded, in
  the shape of the policy's own issues (§9). An empty list means it compiled
  cleanly. A grant an issue takes out is missing from `rules`, and a draft with
  a card-level issue answers `failed` / `policy-unloadable` for every question
  the policy would decide; an actor the realm's permissions admit still gets
  `allowed` / `acl`, and an operation that doesn't resolve still gets
  `not-resolved`.

**Before widening a rule, explain the draft.** Edit the rules as a draft,
explain the cases you care about — a caller the change should admit, one it
shouldn't, and the searches and listings it touches — then save the rules onto
the card in force, or onto a new card and repoint the realm at it (§1). The
panel's draft starts from the card's own rules.

## 11. Authorization infrastructure

Some cards decide who may do what. No grant reaches them:

- **The realm's config card** (`realm.json`) and **the card its `policy` names**:
  no grant reads, writes, or source-reads them, under any operation name.
- **Every `RealmPolicy` card, and every subtype's**, whether or not any realm
  names it: no grant reads, writes or creates one. Every grant on a rule whose
  type is `RealmPolicy` (or a subtype), `query` included, records
  `grants-authorization-infrastructure`.
- **Every policy-scoped search** leaves out the config card and every policy
  card.
- **An operation declared `nonGrantable`** — on the type or anywhere up its
  chain — can't be granted; a grant naming it records
  `grants-authorization-infrastructure`. A subtype that redeclares it without
  the flag doesn't make it grantable. `explain` and `validate` are always
  `nonGrantable`. Mark a card's own operation this way when the card holds
  authorization — a field a predicate reads to decide access:

  ```ts
  @operation static addTeacher = {
    base: 'transform',
    params: { teacherId: StringField },
    append: { to: 'teacherIds', value: params('teacherId') },
    nonGrantable: true,
  } satisfies OperationDeclaration;
  ```

**These refusals cover an operation invoked on one of these cards, not a card
carried inside another's answer.** A granted `read`, or a row a `query` grant
admits, is served with its whole link closure. If a granted type links to the
config card or a policy card, every caller the grant admits receives that card
— the policy's whole rule list — in `included`. The realm records
`grant-reaches-ungranted-type` against such a grant (§9). Don't link to these
cards from a granted type, or declare a narrower `links` on the read or the
named query that serves it.

Only the realm's own writers can change these cards. **Keep the field a
predicate reads out of reach of the grant it authorizes**: a grant that lets a
teacher `update` a classroom whose `teacherIds` admits them lets them add
anyone to it. Grant a named operation that writes only what the caller should
change, and mark the authorization-bearing write `nonGrantable`.

## 12. Refusals a caller sees

How the realm refuses depends on whether the caller may read the realm:

| Situation                                   | Caller who may read the realm                     | Caller who may not                     |
| ------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| No grant holds                              | 403 `operation-not-permitted`                     | 404, identical to "not found"           |
| The type doesn't carry the operation        | 405 `operation-not-allowed`                       | 404, identical to "not found"           |
| A predicate threw and no other grant held   | 500 `policy-predicate-failed`                     | 404, identical to "not found"           |
| The policy won't compile                    | 500 `internal-error`, "Policy unavailable" (on writes) | 500 `internal-error`, "Policy unavailable" |
| Nobody signed in, on a gated route          | —                                                 | 401 `actor-required`                    |

The codes are the `code` on an `_operations` error. A card+json route answers
with the same status and a title, and its body carries no `code`, so over those
routes the status is the whole answer.

A caller who may not read the realm learns nothing about what exists: a card
that isn't there and a card a grant refuses answer the same bytes. A realm with
no policy answers with its permissions' own 401 and 403. For the rest of an
operation's refusals, see `card-operations-authoring` §5.

## 13. Before calling a policy done

- The policy card's issues list is empty, or holds only warnings you mean to keep.
- Every membership test is `any(. == actor())`, parenthesized inside `or`/`and`.
- Every grant that needs a computed or linked value says `snapshot: true`, and
  no `create` grant does.
- Every `query` grant compiled a filter (no `policy-not-filterable`), and every
  card a teacher should open also has a `read` grant.
- Every `readSource` grant on a card type is meant to reveal the whole stored
  document, and every file rule names the narrowest `FileDef` that fits.
- No grant can write the field its own predicate reads.
- You explained each grant for a caller it should admit and one it shouldn't
  (§10), and explained a draft before widening any rule.
