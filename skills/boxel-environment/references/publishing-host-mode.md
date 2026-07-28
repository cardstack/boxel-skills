# Publishing & host mode — realm publication, portability, and published-site behavior

Everything about `boxel realm publish`, what a published realm actually is,
and the reference-portability rules that make a card graph survive
publication. Companion to `indexing-operations.md` (indexing mechanics) and
the `link-host-mode-paths` pattern (routing rules).

---

## Publish targets and workflow

- `boxel realm publish <source> <published>` rejects any published-realm URL
  not ending in **`boxel.space` or `boxel.site`** (HTTP 400 "publishedRealmURL
  must use a valid domain"). `app.boxel.ai/...` URLs are never valid publish
  targets. Publish under the profile that owns the source realm.
- **Never use `--no-wait`.** Observed: `--no-wait` returned `status: pending`
  and left the published realm with a stale modules cache — the entire site
  served HTTP 500 (`FilterRefersToNonexistentTypeError ... may be caused by a
  stale modules cache`). Re-running publish *without* `--no-wait` and letting
  it block to completion recovered the site fully.
- **A readiness timeout is not a failed publish.** `boxel realm wait-for-ready`
  timed out (240s against `_readiness-check`) on a publish that had succeeded
  and was already serving new content. Verify by fetching the published page,
  not by trusting that poll.
- **Realm tokens lapse between `npx boxel` invocations in long sessions** —
  "No realm token available" is fixed by `npx boxel profile switch <profile>`
  immediately before the command in the same shell operation; it is not a
  sign of missing access.

## A published realm is a snapshot

Pushing new files to the source realm does **not** update the published copy.
Re-run the same `boxel realm publish` command (same published URL) after
every batch of source changes. Symptom of forgetting: the published host
serves the old modules/templates while `app.boxel.ai` has the new ones, and
no amount of browser cache-busting helps.

Also: the published **prerendered HTML** can lag a just-pushed change by a
beat even when the published module and instance JSON are already correct —
the page hydrates and renders correctly anyway. Check the hydrated DOM, not
`curl` output, before concluding a change didn't publish.

## Portability: the pre-publish reference audit

Before publishing, scan **every card reachable from each entry point** — not
just the workspace card — for absolute source-realm URLs in:

- `relationships.*.links.self` (including `cardInfo.theme`, media links,
  child cards, entry points)
- `meta.adoptsFrom.module`

Convert same-realm references to explicit relative URLs (`./` or `../`) so
the publish operation can rewrite the whole graph onto its public mount.
**Relative is the house rule** — for `adoptsFrom` too. (A staging-Host bug
can rebase a relative `adoptsFrom` against the parent card instead of the
child resource in deep `Workspace.entryPoints` graphs — see bug report
`2026-07-22-nested-adoptsfrom-rebased-against-parent.md`; we assume the
upstream fix rather than switching to absolute URLs.)

Runtime URLs returned by searches or FileDefs can still retain the source
realm identity even when the JSON is portable — published-host navigation
and raw media access must rebase those onto the active published mount
before use.

**The end-to-end gate:** after republishing, click every pinned entry point
in an **anonymous** public Host session and verify both the
`?hostModeStack=` target and the browser logs (no private-realm auth
failures, no fetch failures). A successful publish command alone is not a
navigation test; `_publishability` reporting "private external dependencies"
means the audit above was incomplete.

## In-realm images and files on published pages

An absolute source-realm file URL baked into a string field returns **HTTP
401 for anonymous visitors** on the published site — the host does not
rewrite absolute strings. Reference in-realm files through a **relative
FileDef link** (`linksTo(ImageDef/FileDef)`): the URL is derived from a
relationship and follows whichever realm serves the card. Details and the
two gotchas below live in `boxel-file-def/references/using-filedef-in-cards.md`
("Raw images in published host mode"); the publication-specific facts:

- **A FileDef link cannot live inside a `containsMany` FieldDef** —
  `linksTo`/`linksToMany` are only valid on a CardDef. Hoist the file links
  to the owning CardDef as an index-aligned parallel array
  (`@field shots = linksToMany(ImageDef)` next to
  `@field demos = containsMany(DemoField)`; render with
  `(get @model.shots index)`).
- **The base ImageDef fitted template paints a background-image** (zero
  intrinsic size) and embedded renders `height:auto`. If a layout depends on
  an image's intrinsic width, keep a real `<img src={{shot.url}}>` and give
  the grid column an explicit width — never rely on intrinsic image size.

## Realm root as an app (index card)

For a card that IS the page on a published realm:

1. **Set the card as `index.json`** (same attributes/adoptsFrom as a normal
   instance, `./module` relative paths). Otherwise the realm root renders the
   default CardsGrid — visitors land on a card browser, not the app.
2. **The CardDef must set `static prefersWideFormat = true`** — without it
   the isolated format renders as a centered narrow "paper" column and the
   realm's wallpaper shows around it. Put any max-width column *inside* the
   card's own full-bleed root. See `boxel/references/prefers-wide-format.md`.

Republish after the index swap or the old grid keeps serving.

## Deep links carry state in query params, never hash fragments

The host SPA preserves `?c=CODE` on a published card URL
(`window.location.search` sees it) but **eats `#CODE` during routing**.
Encode deep-link state as query params, and strip them with
`history.replaceState` after reading once (replay hygiene).

## Raw file serving is Accept-header-gated

A **published** realm serves raw file bytes to any request whose `Accept` is
not `text/html`. `curl` (Accept `*/*`) gets the file with a correct MIME
type; a browser *navigation* is routed to the card-rendering host app — that
is the real cause of "Loading card…" pages for `.html` files. The
`convert-accept-header-qp` middleware accepts `?acceptHeader=*/*` as an
override for a top-level document, but the ruling is to not serve static
pages raw at all: rewrite them as cards.

The useful flip side: a `<script src>` request sends `Accept: */*`, so
**cards can script-load vendored UMD bundles from their own published
realm** (verified 200 `text/javascript`). Rules that make it robust:

- Push the upstream dist as an ordinary realm file.
- Keep the URL **explicit** (a card field), not `import.meta.url` — the same
  card renders from several origins and only the published one serves those
  bytes without auth. In Interact mode the load fails; degrade to the
  non-library path rather than breaking the screen.
- Cache the load promise at module scope, but reset it to `undefined` in the
  `onerror` handler — a transient failure otherwise poisons every later
  attempt.
- A published realm also serves its own `.ts`/`.gts` modules as ES modules
  to a plain browser-console `import()` — handy for testing a card's
  internal module without a harness.

## Porting instances between realms

Copied `.json` instances carry a **mix** of relative and absolute
`adoptsFrom.module` values (one real port: 21 of 32 absolute; no pattern —
assume a mix). In the target realm the absolute ones keep pointing at the
*source* realm; if the target credential can't read it, every affected card
fails with a 401 — but only under `Accept: application/vnd.card+json`
(full index resolution). `vnd.card+source` reads and `boxel file ls` look
completely successful.

**Fix:** after copying, rewrite source-realm absolute module URLs to
relative before pushing (`raw.replace("https://<server>/<owner>/<realm>/", "../")`
for instances one folder deep), then verify with a `vnd.card+json` fetch.
Also strip links that will dangle in the target (`cardInfo.theme` to an
uncopied card poisons the indexing write — Cardinal Rule 13).
`boxel realm ingest-card` bundles same-realm deps but only works when source
and target are on the *same realm server*.

## Retiring files

`npx boxel file delete <path> --realm <url>` exists and is the clean way to
remove files from a realm (no `--yes` flag; it does not prompt).
