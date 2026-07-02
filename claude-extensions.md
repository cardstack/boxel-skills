For workspace-specific capabilities (table-flavored grids via surfaces, spreadsheet logic via bxl, flow/canvas editors via ember-flow, multi-column text via pretext, realm-bundled libraries in general), see `extensions/` and `extension-libs/`.

## `extensions/` — workspace-specific patterns (tracked)

[`extensions/`](extensions/README.md) is a tracked folder for patterns that name _this_ workspace's specific libraries, realms, or bundles — UI surface kits, computation runtimes, canvas/flow editors, etc. Each subdirectory mirrors the `boxel-patterns` shape (`README.md` + `example.gts`). They're committed alongside the rest of the skill tree, but kept separate from the portable patterns because they assume this workspace's setup (an agent ported to a different Boxel workspace wouldn't have these libraries).

**When a user asks about a workspace-specific library** ("how do we use bxl?", "what's the surfaces import?", "where's our canvas library?"), check `extensions/` first. The portable skill tree under `skills/` describes architecture only — specific URLs and import statements live in extensions.

## `extension-libs/` — pre-built bundles for upload (tracked)

[`extension-libs/`](extension-libs/README.md) ships the **actual dist files** for the workspace's realm-bundled libraries (bxl, surfaces, ember-flow, pretext). When the user is building a card whose imports reference one of these libraries and the target realm doesn't have it (or has an out-of-date copy), the agent should upload the relevant subtree from `extension-libs/<lib>/` into the realm so the imports resolve. The bundles are point-in-time snapshots — if a user has a newer build in their canonical source realm, prefer that; if the realm has an older or missing copy, push the snapshot. Three upload methods (`boxel realm push`, `boxel file write`, `WriteBinaryFileCommand` for transactional installs) are documented in the folder's README.
