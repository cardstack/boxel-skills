---
validated: source-proven
---

# library-ember-flow — Embed a flowchart / node-graph editor in a card

**What this gives you:** Drag-droppable nodes, draggable edges, pan/zoom canvas, minimap, controls — the full React Flow (XYFlow) feature set — running inside a Boxel CardDef via Glimmer.

**When to use:** Anything that benefits from a visual node graph: workflow editors, data-pipeline designers, decision trees, mind maps, the visual side of a formula builder, dependency graphs, org charts that need free positioning.

**The insight:** XYFlow is a React library. The Boxel team ported the heavy lifting into a single bundled file (`ember-flow-dependencies.js`) that exposes the same primitives as Glimmer-compatible components. Import them like any other library. The bundle is large but lazy-loaded — only realms that use it pay the cost.

**Recipe shape:**

1. Confirm `ember-flow-dependencies.js` exists at the workspace's `common-libs`-style realm root. If not, **either** copy from the realm that originally hosts it **or** upload the snapshot at `.claude/extension-libs/ember-flow/` (use `boxel file write` per-file — these are two single-file bundles, `ember-flow-dependencies.js` + `ember-flow-markdown-dependencies.js`, pushed to the realm root, not a subdirectory). See [`.claude/extension-libs/README.md`](../../extension-libs/README.md).
2. Import the Flow primitives from `'https://realms-staging.stack.cards/ctse/common-libs/ember-flow-dependencies.js'`.
3. Build your nodes and edges as tracked arrays.
4. Render `<Flow @nodes={{nodes}} @edges={{edges}} @onNodesChange={{action}} @onEdgesChange={{action}} />` inside a sized container.

**Gotchas:**
- The flow container needs an explicit width and height — error code 004 from the bundle is "parent container needs a width and a height to render the graph".
- Define your `nodeTypes` and `edgeTypes` objects *outside* the component (or memoize them) — XYFlow warns when they're re-created.
- Don't put a Handle (connection point) outside a Node — error 010.

**Source:** the workspace's source realm for the ember-flow bundle (`ember-flow-dependencies.js` + consumer cards like `mockup-canvas-flow.gts`, `infinite-canvas.gts`, `canvas-board.gts`, `claude-board.gts`). **Snapshot for upload:** `.claude/extension-libs/ember-flow/` (~700 KB).

**See also:** `library-surfaces` (the surface bundle has its own Canvas/Flow primitives — these may converge), `references/libraries.md`, `layout-design-board`, [`.claude/extension-libs/README.md`](../../extension-libs/README.md).
