---
validated: source-proven
---

# integrate-send-request-via-proxy — Make HTTP requests through the host proxy

**What this gives you:** A way to call arbitrary HTTP APIs from inside a Boxel card or Command, while routing the request through the realm server so credentials, CORS, and rate-limits are handled host-side.

**When to use:** Any third-party API call that requires:
- An API key the realm holds (you don't want it in the client).
- Cross-origin requests the browser would block.

**When NOT to use:** a public API that needs no key and allows browser requests (its responses carry `Access-Control-Allow-Origin`), such as the MLB Stats API (`statsapi.mlb.com`). Call it with plain `fetch`, following "Calling a public API directly" below. The proxy forwards only to destinations on the realm server's allowlist, so an API like that would need a production allowlist entry it gains nothing from. A keyless API that does not allow browser requests is the exception: it needs the proxy, and so an allowlist entry. If you can't tell which kind an API is, try `fetch` first; a CORS error in the browser console means it needs the proxy.

For first-party LLM calls, prefer `integrate-one-shot-llm` (which is built on top of this primitive). For image generation, prefer `integrate-openrouter-image-generation`. Use `SendRequestViaProxyCommand` directly when you need a custom API surface OneShot doesn't cover, such as OpenRouter image-generation modalities or a non-OpenRouter third-party endpoint.

**The insight:** `SendRequestViaProxyCommand` is the underlying host primitive that routes ANY HTTP request through the realm server. The realm server keeps an allowlist of destinations, each with its own credentials, and adds the matching entry's key to the forwarded request. Cards never see the secrets.

**Recipe shape:**

```ts
import SendRequestViaProxyCommand from '@cardstack/boxel-host/tools/send-request-via-proxy';

const proxy = new SendRequestViaProxyCommand(this.toolContext);

const result = await proxy.execute({
  url: 'https://api.example.com/v1/something',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  requestBody: JSON.stringify({ foo: 'bar' }),
  timeoutMs: 8000, // unset waits indefinitely
});

// result.response is a standard Response.
if (!result.response.ok) {
  throw new Error(`api.example.com answered ${result.response.status}`);
}
const data = await result.response.json();
```

**Gotchas:**
- The request body goes in `requestBody` (not `body`) and must be a JSON string: the realm server parses it and rejects anything else with a 400. The result is `{ response }`, a standard `Response`; read it with `result.response.ok` and `await result.response.json()`.
- The realm server forwards only to allowlisted destinations, matched by origin plus path prefix, and picks the credentials from the matching entry. Any other URL is rejected with a 400. Users and cards cannot add to the allowlist; Boxel staff maintain it. If an API that truly needs a key is not allowlisted, tell the user it needs to be added. Don't suggest a workaround that puts the key in card code.
- For a multipart/form-data upload, pass `multipart: true` and make `requestBody` the JSON string of an object whose keys become the form fields (`JSON.stringify({ … })`). A file field is `{ filename, content, contentType }` with `content` base64-encoded; the realm server builds the multipart body. Don't pass a `FormData`.
- Each user can have at most 8 proxied calls in flight, shared with their model calls through the realm server's OpenRouter passthrough; further calls wait for a free slot. Don't fan many proxied requests out in parallel, and don't proxy an API that plain `fetch` can reach unless viewer privacy calls for it (see "Calling a public API directly").

**Calling a public API directly:**

Security:
- Only for public, keyless APIs. Never put an API key or token in card code, not even a "restricted" one: every viewer can read it.
- Keep the URL's origin a fixed `https://` constant in the module. Never build the host or path from card fields or user input: the card also renders on the server when it is indexed, so a user-controlled URL lets anyone make that server request arbitrary addresses. A user value goes only into a query parameter, through `encodeURIComponent`.
- Pass `credentials: 'omit'` and `referrerPolicy: 'no-referrer'`, so the request carries no cookies and not the card's URL (the `Origin` header still names the site it runs on).
- Treat the response as untrusted input. Render it as text (`{{value}}`); never pass it through `htmlSafe`, `{{{ }}}` or `innerHTML`. If the API returns HTML you have to show, render it with `sanitizeHtmlSafe` (see `boxel/references/common-imports.md`). Before using a URL from the response in `href` or `src`, check that it starts with `https://`.
- Each viewer's browser contacts the API directly, so the API sees their IP address. That's fine for public data like sports schedules. If it isn't fine, use the proxy.

Performance:
- Fetch in the `isolated` view only. `fitted`, `embedded` and `atom` render once per card in every grid and list, so a fetch there sends one request per card on the screen.
- Share one cached request per URL across instances, as below: the same card can be open in several stacks.
- Set a timeout, so a hung API ends in the error state instead of loading forever.
- Show a loading state. The `isolated` view also renders on the server during indexing, which fires the request but doesn't wait for it, so the indexed HTML holds whatever the card shows before the response arrives.
- Keep the response in tracked component state, not in the card's fields. Writing fields saves the card and reindexes it, on every view. If the data has to be searchable, or to survive the API being down, save a snapshot from a user action or a Command instead.
- Ask the API for only what you render, using its date, season or filter parameters.

```gts
import { CardDef, Component } from '@cardstack/base/card-api';
import { FittedCard } from '@cardstack/boxel-ui/components';
import CalendarIcon from '@cardstack/boxel-icons/calendar';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency';

const SCHEDULE_URL =
  'https://statsapi.mlb.com/api/v1/schedule/postseason?season=2026&sportId=1';
const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; data: Promise<unknown> }>();

interface Game {
  gamePk: number;
  teams: { away: { team: { name: string } }; home: { team: { name: string } } };
}
interface ScheduleResponse {
  dates?: { games?: Game[] }[];
}

// One request per URL per TTL, shared by every instance on the page.
function getJSON(url: string): Promise<unknown> {
  let hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.data;
  }
  let data = fetch(url, {
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    signal: AbortSignal.timeout(8000),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`${url} answered ${response.status}`);
    }
    return response.json();
  });
  cache.set(url, { at: Date.now(), data });
  // Don't cache failures: the next view retries.
  data.catch(() => {
    if (cache.get(url)?.data === data) {
      cache.delete(url);
    }
  });
  return data;
}

// Declared outside the card: Glint rejects @tracked inside an inline
// `static isolated = class …` expression.
class Isolated extends Component<typeof PostseasonSchedule> {
  @tracked games: Game[] = [];
  @tracked loading = true;
  @tracked error: string | undefined;

  constructor(owner: any, args: any) {
    super(owner, args);
    this.load.perform();
  }

  private load = restartableTask(async () => {
    try {
      let data = (await getJSON(SCHEDULE_URL)) as ScheduleResponse;
      this.games = (data.dates ?? []).flatMap((date) => date.games ?? []);
    } catch {
      this.error = 'The schedule is unavailable right now.';
    } finally {
      this.loading = false;
    }
  });

  <template>
    <section aria-busy={{this.loading}}>
      <h1><@fields.cardTitle /></h1>
      {{#if this.loading}}
        <p role='status'>Loading the schedule…</p>
      {{else if this.error}}
        <p role='alert'>{{this.error}}</p>
      {{else}}
        <ul>
          {{#each this.games key='gamePk' as |game|}}
            <li>{{game.teams.away.team.name}}
              at
              {{game.teams.home.team.name}}</li>
          {{else}}
            <li>No games are scheduled yet.</li>
          {{/each}}
        </ul>
      {{/if}}
    </section>
  </template>
}

// embedded and fitted render only the card's own fields: they appear once per
// card in grids and lists, so they never fetch.
class Embedded extends Component<typeof PostseasonSchedule> {
  <template>
    <h3><@fields.cardTitle /></h3>
  </template>
}

class Fitted extends Component<typeof PostseasonSchedule> {
  <template>
    <FittedCard>
      <:eyebrow>MLB postseason</:eyebrow>
      <:title><@fields.cardTitle /></:title>
    </FittedCard>
  </template>
}

export class PostseasonSchedule extends CardDef {
  static displayName = 'Postseason Schedule';
  static icon = CalendarIcon;
  static isolated = Isolated;
  static embedded = Embedded;
  static fitted = Fitted;
}
```

**Source:** host command usage in catalog commands and OpenRouter-backed patterns.

**See also:** `integrate-one-shot-llm` (high-level LLM wrapper that uses this under the hood), `integrate-openrouter-image-generation` (image-specific wrapper that persists generated bytes correctly).
