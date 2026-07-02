import GlimmerComponent from '@glimmer/component';
import { prerenderedCardSearchComponent } from '@cardstack/runtime-common/prerendered-card-search';

// 🧩 PATTERN: Generic table over Query + realm
//
// One component, any query. Caller passes the query + the columns to render.

interface Query {
  filter: {
    on: { module: string; name: string };
    [key: string]: any;
  };
  sort?: Array<{ by: string; on?: any }>;
}

interface TableSignature {
  Args: {
    query: Query;
    realm: string;
    columns: string[];          // field names to render
    headers?: string[];         // optional header labels (defaults to columns)
  };
}

export class CardTable extends GlimmerComponent<TableSignature> {
  PrerenderedCards = prerenderedCardSearchComponent;

  get headers(): string[] {
    return this.args.headers ?? this.args.columns;
  }

  <template>
    <table class='card-table'>
      <thead>
        <tr>
          {{#each this.headers as |h|}}
            <th>{{h}}</th>
          {{/each}}
        </tr>
      </thead>
      <tbody>
        <this.PrerenderedCards
          @query={{@query}}
          @format='embedded'
          @realms={{(array @realm)}}
        >
          <:loading>
            <tr><td colspan={{@columns.length}}>Loading…</td></tr>
          </:loading>
          <:response as |cards|>
            {{#each cards as |c|}}
              <tr>
                {{#each @columns as |col|}}
                  <td>
                    {{!--
                      In production: use a FieldRenderer with a
                      WeakMap<Box, BoxComponent> cache to avoid re-renders.
                      Sketch:  this.fieldFor(c, col)
                    --}}
                    {{get c.card col}}
                  </td>
                {{/each}}
              </tr>
            {{else}}
              <tr><td colspan={{@columns.length}}>No results.</td></tr>
            {{/each}}
          </:response>
        </this.PrerenderedCards>
      </tbody>
    </table>
  </template>
}

// === Usage ============================================================
//
// import { Person } from './person';
//
// const personModule = new URL('./person', import.meta.url).href;
//
// <CardTable
//   @query={{hash filter=(hash on=(hash module=personModule name='Person'))}}
//   @realm='https://realms.example.com/team/'
//   @columns={{array 'firstName' 'lastName' 'email'}}
//   @headers={{array 'First' 'Last' 'Email'}}
// />
