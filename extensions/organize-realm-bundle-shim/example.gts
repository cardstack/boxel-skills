// 🧩 PATTERN: Realm-bundled library shim.
//
// This file is purely structural — it shows the relationship between
// the shim, the bundle, and the consumer card. Three files together.

// ─────────────────────────────────────────────────────────────────────
// File 1 of 3:  <realm>/mylib.ts   (the SHIM — generated, do not edit)
// ─────────────────────────────────────────────────────────────────────

/*
  // @cardstack/mylib — realm bundle (ESM)
  // Built: 2026-05-21T12:00:00.000Z
  // Source: <local-lib-source-dir>/mylib
  // Regenerate: cd <local-lib-source-dir>/mylib && npm run realm

  export * from './mylib/index';
*/

// ─────────────────────────────────────────────────────────────────────
// File 2 of 3:  <realm>/mylib/index.ts   (the BUNDLE entry)
// ─────────────────────────────────────────────────────────────────────

/*
  import { coreFeature } from './mylib-chunks/chunk-CORE.ts';
  import { lazyFeatureA } from './mylib-chunks/chunk-A.ts';
  import { lazyFeatureB } from './mylib-chunks/chunk-B.ts';

  export {
    coreFeature,
    lazyFeatureA,
    lazyFeatureB,
  };

  export const VERSION = '1.0.0';
*/

// ─────────────────────────────────────────────────────────────────────
// File 3 of 3:  <realm>/cards/example.gts   (the CONSUMER)
// ─────────────────────────────────────────────────────────────────────

import { CardDef, field, contains, Component } from 'https://cardstack.com/base/card-api';
import StringField from 'https://cardstack.com/base/string';

// 🎯 The card imports via the shim path. The realm server resolves
// '../mylib' → '../mylib.ts' → './mylib/index.ts'.
import { coreFeature, VERSION } from '../mylib';

export class ExampleCard extends CardDef {
  static displayName = 'Example Card';
  @field name = contains(StringField);

  static isolated = class extends Component<typeof ExampleCard> {
    result = coreFeature(this.args.model.name ?? '');

    <template>
      <p>Hello {{this.result}} (using mylib v{{VERSION}})</p>
    </template>
  };
}

// ─────────────────────────────────────────────────────────────────────
// Notes
// ─────────────────────────────────────────────────────────────────────
//
// The relative path is the most important piece:
//
//   <realm>/cards/example.gts   →  '../mylib'   (one level deep)
//   <realm>/example.gts         →  './mylib'   (top-level)
//
// The shim must live AT the realm root next to a folder of the same
// name (minus the `.ts`). The realm server resolves `from '../mylib'`
// to `mylib.ts`, which `export *`'s from `./mylib/index`.
//
// Chunks live in <realm>/mylib/mylib-chunks/ and are imported by
// index.ts. The realm prerenderer streams them as needed.
