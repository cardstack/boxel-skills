// CanvasBoard — Phase 1 base
//
// Derived from working EmberFlow samples in
// `emberflow/examples/ember/app/templates/examples/`:
//
//   • parity/editing.gts        — provider + EmberFlow + applyNodeChanges
//   • parity/edges.gts          — onConnect / onReconnect plumbing
//   • parity/resizing.gts       — NodeResizer placement
//   • extended/workshop-board.gts — sticky-board node shape
//
// Surgical rule: each new feature is added by mirroring the sample
// that demonstrates it. `./ember-flow-dependencies.js` is the
// realm-side bundle that re-exports `@xyflow/ember`.

import GlimmerComponent from '@glimmer/component';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  CardDef,
  FieldDef,
  field,
  contains,
  containsMany,
  StringField,
} from 'https://cardstack.com/base/card-api';
import NumberField from 'https://cardstack.com/base/number';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  EmberFlowProvider,
  Handle,
  MiniMap,
  NodeResizer,
  Panel,
  Position,
} from './ember-flow-dependencies.js';

// ── Field defs (saved to the card) ─────────────────────────────────

export class CanvasBoardNode extends FieldDef {
  static displayName = 'Canvas board node';
  @field nodeId = contains(StringField);
  @field kind = contains(StringField);   // 'sticky' | 'shape' | 'text'
  @field x = contains(NumberField);
  @field y = contains(NumberField);
  @field w = contains(NumberField);
  @field h = contains(NumberField);
  @field text = contains(StringField);
  @field tone = contains(StringField);
}

export class CanvasBoardEdge extends FieldDef {
  static displayName = 'Canvas board edge';
  @field edgeId = contains(StringField);
  @field sourceNodeId = contains(StringField);
  @field sourceAnchor = contains(StringField);
  @field targetNodeId = contains(StringField);
  @field targetAnchor = contains(StringField);
  @field label = contains(StringField);
}

export class CanvasBoardViewport extends FieldDef {
  static displayName = 'Canvas board viewport';
  @field tx = contains(NumberField);
  @field ty = contains(NumberField);
  @field zoom = contains(NumberField);
}

export class CanvasBoardDocument extends FieldDef {
  static displayName = 'Canvas board document';
  @field nodes = containsMany(CanvasBoardNode);
  @field edges = containsMany(CanvasBoardEdge);
  @field viewport = contains(CanvasBoardViewport);
}

// ── Custom node component ──────────────────────────────────────────
//
// Mirrors the workshop-board-node pattern but exposes 4 handles each
// of which is BOTH source and target — so the user can drag a
// connector from any side to any other side. xyflow handles the
// magnetic snap natively when the floating endpoint is within
// `connectionRadius` (set on the parent EmberFlow).

interface BoardNodeData extends Record<string, unknown> {
  kind: string;
  text: string;
  tone: string;
}

interface BoardNodeArgs {
  Args: {
    id: string;
    data: BoardNodeData;
    selected?: boolean;
  };
}

class CanvasBoardCustomNode extends Component<BoardNodeArgs> {
  get tone(): string { return this.args.data.tone ?? 'neutral'; }
  get kind(): string { return this.args.data.kind ?? 'shape'; }
  get text(): string { return this.args.data.text ?? ''; }
  get classes(): string {
    return `cb-node cb-node--${this.kind} cb-node--${this.tone}`;
  }
  <template>
    <NodeResizer
      @isVisible={{@selected}}
      @minWidth={{120}}
      @minHeight={{40}}
      @handleClassName='adorn-handle cb-resize-handle'
      @lineClassName='adorn-grip cb-resize-line'
    />

    {{! 4 anchors, top/right/bottom/left.
        Each side gets both a source and a target handle so the user
        can drag a connector out of any side AND drop into any side.
        xyflow's connection radius handles the magnetic feel; the
        engine adds .connectingfrom / .connectingto classes which
        light up the matching handle. }}
    <Handle @type='source' @position={{Position.Top}}    @id='t' class='cb-handle cb-handle--t'/>
    <Handle @type='target' @position={{Position.Top}}    @id='t' class='cb-handle cb-handle--t cb-handle--in'/>
    <Handle @type='source' @position={{Position.Right}}  @id='r' class='cb-handle cb-handle--r'/>
    <Handle @type='target' @position={{Position.Right}}  @id='r' class='cb-handle cb-handle--r cb-handle--in'/>
    <Handle @type='source' @position={{Position.Bottom}} @id='b' class='cb-handle cb-handle--b'/>
    <Handle @type='target' @position={{Position.Bottom}} @id='b' class='cb-handle cb-handle--b cb-handle--in'/>
    <Handle @type='source' @position={{Position.Left}}   @id='l' class='cb-handle cb-handle--l'/>
    <Handle @type='target' @position={{Position.Left}}   @id='l' class='cb-handle cb-handle--l cb-handle--in'/>

    <article class={{this.classes}} data-test-canvas-node={{@id}}>
      <div class='cb-node__body'>{{this.text}}</div>
    </article>
  </template>
}

// ── Helpers ────────────────────────────────────────────────────────

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const NEW_NODE_DEFAULTS: Record<
  string,
  { w: number; h: number; text: string; tone: string }
> = {
  sticky: { w: 220, h: 150, text: 'New note', tone: 'sun' },
  shape:  { w: 240, h: 110, text: 'Rectangle', tone: 'paper' },
  text:   { w: 200, h: 40,  text: 'Text', tone: 'paper' },
};

type ToolName = 'select' | 'pan' | 'sticky' | 'shape' | 'text' | 'connect';

interface XYNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  data: BoardNodeData;
  selected?: boolean;
  className?: string;
  draggable?: boolean;
}

interface XYEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  label?: string | null;
  reconnectable?: boolean | 'source' | 'target';
  className?: string;
  selected?: boolean;
  animated?: boolean;
}

interface XYConnection {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// ── Template ───────────────────────────────────────────────────────

class CanvasBoardTemplate extends GlimmerComponent<{
  Args: { model: CardDef };
}> {
  // Cached node-types registry — referential identity matters to xyflow.
  nodeTypes = { CanvasBoardCustomNode };

  // Tool palette state.
  @tracked activeTool: ToolName = 'select';

  // The live xyflow store (set on @onInit).
  flowStore: unknown = null;

  // Live xyflow state — written into on every change, persisted on
  // terminal events.
  @tracked nodes: XYNode[] = [];
  @tracked edges: XYEdge[] = [];

  reconnectingEdgeId: string | null = null;

  // Initial viewport — read from the document if present.
  get initialViewport(): { x: number; y: number; zoom: number } {
    const v = this.document?.viewport;
    return { x: v?.tx ?? 0, y: v?.ty ?? 0, zoom: v?.zoom ?? 1 };
  }

  constructor(owner: unknown, args: { model: CardDef }) {
    // @ts-expect-error owner type
    super(owner, args);
    this.hydrateFromModel();
  }

  // ── document <-> xyflow ────────────────────────────────────────

  get document(): CanvasBoardDocument | undefined {
    const m = this.args.model as unknown as { document?: CanvasBoardDocument };
    return m.document;
  }

  hydrateFromModel(): void {
    const doc = this.document;
    if (!doc) {
      this.nodes = [];
      this.edges = [];
      return;
    }
    this.nodes = (doc.nodes ?? []).map((n): XYNode => ({
      id: n.nodeId ?? uid('n'),
      type: 'CanvasBoardCustomNode',
      position: { x: n.x ?? 0, y: n.y ?? 0 },
      width: n.w ?? 220,
      height: n.h ?? 110,
      data: { kind: n.kind ?? 'shape', text: n.text ?? '', tone: n.tone ?? 'paper' },
    }));
    this.edges = (doc.edges ?? []).map((e): XYEdge => ({
      id: e.edgeId ?? uid('e'),
      source: e.sourceNodeId ?? '',
      target: e.targetNodeId ?? '',
      sourceHandle: e.sourceAnchor ?? null,
      targetHandle: e.targetAnchor ?? null,
      type: 'default',
      label: e.label || null,
      reconnectable: true,
      className: 'cb-edge',
    }));
  }

  commitDocument(): void {
    const doc = this.document;
    if (!doc) return;
    const nextNodes = this.nodes.map((n) => {
      const cn = new CanvasBoardNode();
      Object.assign(cn as unknown as Record<string, unknown>, {
        nodeId: n.id,
        kind: n.data.kind,
        x: n.position.x,
        y: n.position.y,
        w: n.width,
        h: n.height,
        text: n.data.text,
        tone: n.data.tone,
      });
      return cn;
    });
    const nextEdges = this.edges.map((e) => {
      const ce = new CanvasBoardEdge();
      Object.assign(ce as unknown as Record<string, unknown>, {
        edgeId: e.id,
        sourceNodeId: e.source,
        sourceAnchor: e.sourceHandle ?? 'r',
        targetNodeId: e.target,
        targetAnchor: e.targetHandle ?? 'l',
        label: e.label ?? '',
      });
      return ce;
    });
    (doc as unknown as { nodes: CanvasBoardNode[] }).nodes = nextNodes;
    (doc as unknown as { edges: CanvasBoardEdge[] }).edges = nextEdges;
  }

  // ── EmberFlow callbacks (mirror parity/editing + parity/edges) ──

  @action handleInit(store: unknown): void {
    this.flowStore = store;
  }

  @action handleNodesChange(changes: unknown[]): void {
    this.nodes = applyNodeChanges(changes, this.nodes) as XYNode[];
    const isFinal = (changes as Array<{ type?: string; dragging?: boolean }>)
      .some((c) => c.type === 'remove'
        || c.type === 'dimensions'
        || (c.type === 'position' && c.dragging === false));
    if (isFinal) this.commitDocument();
  }

  @action handleEdgesChange(changes: unknown[]): void {
    this.edges = applyEdgeChanges(changes, this.edges) as XYEdge[];
    this.commitDocument();
  }

  @action handleConnect(connection: XYConnection): void {
    if (!connection.source || !connection.target) return;
    if (connection.source === connection.target) return;
    this.edges = addEdge(
      {
        ...connection,
        id: uid('e'),
        type: 'default',
        reconnectable: true,
        className: 'cb-edge',
      },
      this.edges,
    ) as XYEdge[];
    this.commitDocument();
  }

  @action handleReconnectStart(_e: unknown, edge: XYEdge): void {
    this.reconnectingEdgeId = edge.id;
  }

  @action handleReconnect(oldEdge: XYEdge, newConnection: XYConnection): void {
    this.edges = reconnectEdge(oldEdge, newConnection, this.edges) as XYEdge[];
    this.commitDocument();
  }

  @action handleReconnectEnd(_e: unknown, edge: XYEdge, didReconnect: boolean): void {
    // Tear-off pattern — drop in empty space deletes the edge.
    if (!didReconnect && this.reconnectingEdgeId === edge.id) {
      this.edges = this.edges.filter((e) => e.id !== edge.id);
      this.commitDocument();
    }
    this.reconnectingEdgeId = null;
  }

  @action handlePaneClick(e: PointerEvent): void {
    const tool = this.activeTool;
    if (tool !== 'sticky' && tool !== 'shape' && tool !== 'text') return;
    const store = this.flowStore as
      | { screenToFlowPosition?: (p: { x: number; y: number }) => { x: number; y: number } }
      | null;
    const pt = store?.screenToFlowPosition?.({ x: e.clientX, y: e.clientY })
      ?? { x: e.clientX, y: e.clientY };
    const def = NEW_NODE_DEFAULTS[tool];
    if (!def) return;
    this.nodes = [
      ...this.nodes,
      {
        id: uid('n'),
        type: 'CanvasBoardCustomNode',
        position: { x: pt.x - def.w / 2, y: pt.y - def.h / 2 },
        width: def.w,
        height: def.h,
        data: { kind: tool, text: def.text, tone: def.tone },
      },
    ];
    this.commitDocument();
    this.activeTool = 'select';
  }

  // ── tool palette ───────────────────────────────────────────────

  tools: { value: ToolName; label: string; icon: string; key: string }[] = [
    { value: 'select', label: 'Select', icon: '◉', key: 'V' },
    { value: 'pan', label: 'Hand', icon: '◇', key: 'H' },
    { value: 'connect', label: 'Connect', icon: '/', key: 'C' },
    { value: 'sticky', label: 'Sticky', icon: '▤', key: 'S' },
    { value: 'shape', label: 'Shape', icon: '▢', key: 'R' },
    { value: 'text', label: 'Text', icon: 'T', key: 'T' },
  ];

  @action setTool(t: ToolName): void { this.activeTool = t; }
  isTool = (t: ToolName): boolean => this.activeTool === t;

  get rootClasses(): string {
    return `cb cb--tool-${this.activeTool}`;
  }

  get nodeCount(): number { return this.nodes.length; }
  get edgeCount(): number { return this.edges.length; }

  <template>
    <div class={{this.rootClasses}}>
      <EmberFlowProvider @initialViewport={{this.initialViewport}} as |providedFlow|>
        <EmberFlow
          @store={{providedFlow}}
          @nodes={{this.nodes}}
          @edges={{this.edges}}
          @nodeTypes={{this.nodeTypes}}
          @minZoom={{0.2}}
          @maxZoom={{4}}
          @connectionRadius={{36}}
          @onInit={{this.handleInit}}
          @onNodesChange={{this.handleNodesChange}}
          @onEdgesChange={{this.handleEdgesChange}}
          @onConnect={{this.handleConnect}}
          @onReconnect={{this.handleReconnect}}
          @onReconnectStart={{this.handleReconnectStart}}
          @onReconnectEnd={{this.handleReconnectEnd}}
          @onPaneClick={{this.handlePaneClick}}
          @panOnDrag={{true}}
          @selectionOnDrag={{false}}
          @fitView={{false}}
        >
          {{! layer 0 — background dots }}
          <Background
            @variant={{BackgroundVariant.Dots}}
            @gap={{22}}
            @size={{1.5}}
            @color='#dcdce0'
            @bgColor='#ffffff'
          />

          {{! layer 5a — top-left tool palette }}
          <Panel @position='top-left'>
            <div class='cb-tools' role='toolbar' aria-label='Tools'>
              {{#each this.tools as |t|}}
                <button
                  type='button'
                  class='cb-tool'
                  data-on={{if (this.isTool t.value) 'true' 'false'}}
                  title='{{t.label}} ({{t.key}})'
                  {{on 'click' (fn this.setTool t.value)}}
                >{{t.icon}}</button>
              {{/each}}
            </div>
          </Panel>

          {{! layer 5b — top-right title pill }}
          <Panel @position='top-right'>
            <div class='cb-title'>
              <span class='cb-mark'></span>
              <span>{{if @model.title @model.title 'Canvas board'}}</span>
            </div>
          </Panel>

          {{! layer 5c — bottom status }}
          <Panel @position='bottom-center'>
            <div class='cb-status'>
              <span><b>{{this.nodeCount}}</b> nodes · <b>{{this.edgeCount}}</b> edges</span>
              <span class='cb-status__sep'>·</span>
              <span class='cb-status__hint'>
                drag handle to connect · drag edge endpoint to re-anchor ·
                tear off to empty space to delete
              </span>
            </div>
          </Panel>

          {{! layer 6 — minimap (bottom-right) + layer 7 — controls }}
          <MiniMap @pannable={{true}} @zoomable={{true}} class='cb-minimap'/>
          <Controls />
        </EmberFlow>
      </EmberFlowProvider>
    </div>

    <style scoped>
      .cb {
        --cb-bg: #ffffff;
        --cb-surface: #f5f5f5;
        --cb-surface-2: #f8f7fa;
        --cb-fg: #1a1628;
        --cb-fg-muted: #5a586a;
        --cb-fg-faint: #919191;
        --cb-border: #e8e8e8;
        --cb-accent: #00ebac;
        --cb-accent-soft: rgba(0, 235, 172, 0.18);
        --cb-brand: #6638ff;
        --cb-shadow: 0 1px 2px rgba(26, 22, 40, 0.06), 0 8px 22px rgba(26, 22, 40, 0.08);
        --cb-shadow-lg: 0 14px 40px rgba(26, 22, 40, 0.15);

        position: relative;
        width: 100%;
        height: 100%;
        min-height: 640px;
        background: var(--cb-bg);
        color: var(--cb-fg);
        font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        overflow: hidden;
      }

      /* xyflow theming */
      .cb :deep(.ember-flow) {
        --xy-background-color-default: var(--cb-bg);
        --xy-edge-stroke-default: var(--cb-fg-muted);
        --xy-edge-stroke-selected-default: var(--cb-accent);
        --xy-edge-stroke-width-default: 1.8;
        --xy-handle-background-color-default: var(--cb-bg);
        --xy-handle-border-color-default: var(--cb-accent);
        --xy-controls-button-background-color-default: var(--cb-surface);
        --xy-controls-button-color-default: var(--cb-fg);
        --xy-controls-button-border-color-default: var(--cb-border);
        --xy-minimap-background-color-default: var(--cb-surface);
        --xy-minimap-mask-background-color-default: rgba(0, 235, 172, 0.06);
        --xy-minimap-mask-stroke-color-default: var(--cb-accent);
      }

      /* tool palette */
      .cb-tools {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 6px;
        background: var(--cb-surface);
        border: 1px solid var(--cb-border);
        border-radius: 8px;
        box-shadow: var(--cb-shadow);
      }
      .cb-tool {
        all: unset;
        cursor: pointer;
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 6px;
        font-size: 15px;
        color: var(--cb-fg-muted);
      }
      .cb-tool:hover {
        background: var(--cb-surface-2);
        color: var(--cb-fg);
      }
      .cb-tool[data-on='true'] {
        background: var(--cb-accent-soft);
        color: var(--cb-fg);
        box-shadow: inset 0 0 0 1.5px var(--cb-accent);
      }

      /* title pill */
      .cb-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: var(--cb-surface);
        border: 1px solid var(--cb-border);
        border-radius: 8px;
        box-shadow: var(--cb-shadow);
        font-weight: 600;
        font-size: 13px;
      }
      .cb-mark {
        width: 14px;
        height: 14px;
        border-radius: 4px;
        background: linear-gradient(135deg, var(--cb-accent), var(--cb-brand));
      }

      /* status */
      .cb-status {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 14px;
        background: var(--cb-surface);
        border: 1px solid var(--cb-border);
        border-radius: 8px;
        box-shadow: var(--cb-shadow);
        color: var(--cb-fg-muted);
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 11px;
        white-space: nowrap;
      }
      .cb-status b { color: var(--cb-fg); font-weight: 600; }
      .cb-status__sep { color: var(--cb-fg-faint); }
      .cb-status__hint { color: var(--cb-fg-faint); }

      /* node visuals */
      .cb-node {
        position: absolute;
        inset: 0;
        background: var(--cb-surface);
        border: 1px solid var(--cb-border);
        border-radius: 6px;
        box-shadow: var(--cb-shadow);
        padding: 12px 14px;
        font-size: 13px;
        line-height: 1.4;
        color: var(--cb-fg);
        box-sizing: border-box;
        transition: box-shadow 120ms, border-color 120ms;
      }
      .cb-node__body {
        width: 100%;
        height: 100%;
        overflow-wrap: anywhere;
        overflow: hidden;
      }
      .cb-node--sticky.cb-node--sun { background: #fff3a8; border-color: #e9d96a; }
      .cb-node--sticky.cb-node--mint { background: #d3f9e3; border-color: #76d8a3; }
      .cb-node--sticky.cb-node--coral { background: #ffd5cf; border-color: #f08c7e; }
      .cb-node--sticky.cb-node--lilac { background: #e7daff; border-color: #b09cef; }
      .cb-node--shape { background: var(--cb-bg); }
      .cb-node--text {
        background: transparent;
        border: 1px dashed var(--cb-border);
        box-shadow: none;
      }
      .cb :deep(.ember-flow__node.selected) .cb-node {
        border-color: var(--cb-accent);
        box-shadow: 0 0 0 2px var(--cb-accent), var(--cb-shadow-lg);
      }

      /* connection handles */
      .cb :deep(.ember-flow__handle) {
        width: 10px;
        height: 10px;
        background: var(--cb-bg);
        border: 1.5px solid var(--cb-accent);
        opacity: 0;
        transition: opacity 120ms, transform 120ms, background 120ms;
      }
      .cb :deep(.ember-flow__node:hover) .cb-handle,
      .cb :deep(.ember-flow__node.selected) .cb-handle,
      .cb--tool-connect :deep(.ember-flow__handle) {
        opacity: 1;
      }
      .cb :deep(.ember-flow__handle.connectingfrom),
      .cb :deep(.ember-flow__handle.connectingto) {
        background: var(--cb-accent);
        opacity: 1;
        transform: scale(1.6);
        box-shadow: 0 0 0 4px var(--cb-accent-soft);
      }
      .cb-handle--in {
        /* target stack — invisible underlay so dropping on a side
         * counts whether the source is set as src or tgt */
        background: transparent !important;
        border: none !important;
        opacity: 0 !important;
      }

      /* edges */
      .cb :deep(.ember-flow__edge.cb-edge .ember-flow__edge-path) {
        stroke: var(--cb-fg-muted);
        stroke-width: 1.8;
      }
      .cb :deep(.ember-flow__edge.selected .ember-flow__edge-path) {
        stroke: var(--cb-accent);
        stroke-width: 2.4;
      }

      /* resize handles */
      .cb :deep(.cb-resize-handle) {
        background: var(--cb-accent);
        border: 1px solid var(--cb-bg);
        width: 8px;
        height: 8px;
        border-radius: 2px;
      }
      .cb :deep(.cb-resize-line) { border-color: var(--cb-accent); }

      /* tool-mode cursors */
      .cb--tool-pan :deep(.ember-flow__pane) { cursor: grab; }
      .cb--tool-connect :deep(.ember-flow__pane),
      .cb--tool-sticky :deep(.ember-flow__pane),
      .cb--tool-shape :deep(.ember-flow__pane),
      .cb--tool-text :deep(.ember-flow__pane) { cursor: crosshair; }
    </style>
  </template>
}

// ── CardDef ─────────────────────────────────────────────────────────

export class CanvasBoard extends CardDef {
  static displayName = 'Canvas Board';
  static prefersWideFormat = true;

  @field document = contains(CanvasBoardDocument);

  static isolated = CanvasBoardTemplate;
}
