# Worked automations

Four complete automations, each a card and a script. Paths are relative to the workspace root.

## 1. A one-time run: end the sale an hour from now

The user, in New York, at 19:10 UTC on 2026-11-18: "End the flash sale an hour from now." The conversation's time plus an hour is 20:10 UTC; New York is UTC−5 in November, so the run is at 15:10 on 2026-11-18 in `America/New_York`. The workspace holds `Sale/flash-sale.json`, a card with a `status` field.

`automations/scripts/end-flash-sale.js`:

```js
/* global realm, console */
// Ends the sale the params name: sets the sale card's status to "ended",
// unless the sale already ended.

realm.progress.plan(['End the sale']);
realm.progress.milestone('End the sale');

const { sale = 'Sale/flash-sale' } = realm.current.automation.params;
const card = await realm.cards.get(sale);
// One milestone, two outcomes, so one task says which.
if (card.attributes.status === 'ended') {
  realm.progress.task(`Left ${sale} as it was: the sale had already ended`);
} else {
  await realm.cards.update(sale, { status: 'ended' });
  realm.progress.task(`Ended the sale ${sale}`);
}
```

`automations/Automation/end-flash-sale.json`:

```json
{
  "data": {
    "type": "card",
    "attributes": {
      "cardInfo": {
        "name": "End the flash sale",
        "summary": "At 3:10 PM Eastern on November 18, 2026, sets the flash sale's status to ended."
      },
      "triggers": [
        {
          "kind": "once",
          "label": "end-of-sale",
          "expression": null,
          "timeZone": "America/New_York",
          "untilDate": null,
          "untilTime": null,
          "count": null,
          "date": "2026-11-18",
          "time": "15:10",
          "webhookPath": null
        }
      ],
      "operations": [],
      "caps": {
        "callApiCalls": 0,
        "responseBytes": 0,
        "resolveCalls": 0,
        "aiCredits": 0,
        "writes": 1,
        "seconds": 30,
        "dailyCredits": 5,
        "monthlyCredits": 5
      },
      "params": [{ "name": "sale", "value": "Sale/flash-sale" }],
      "batchedAI": false
    },
    "relationships": {
      "script": { "links": { "self": "../scripts/end-flash-sale.js" } }
    },
    "meta": {
      "adoptsFrom": {
        "module": "@cardstack/catalog/automation/automation",
        "name": "Automation"
      }
    }
  }
}
```

The reply tells the user the automation will run at "Wednesday, November 18, 2026 at 3:10 PM Eastern" once the automation is switched on, and ends by asking one question: may Boxel Preview the automation now. Only after the Preview's result, in a later turn, does the reply ask whether to switch the automation on, which means confirming the time, the estimate and the monthly cap (_Before anything runs_).

## 2. A weekday digest that keeps one card per issue

The user: "Every weekday at 8:30 my time (Chicago), pull the open issues from our GitHub repo into cards, and mark the ones that closed." The workspace holds a `GitHubRepository` card type with the paging `openIssues` operation from the skill's *Paging and retrying*, and an instance `GitHubRepository/boxel`. An `Issue` card type has `repository`, `number`, `title`, `url`, `labels` and `status`.

`automations/scripts/sync-issues.js`:

```js
/* global realm, console */
// Mirrors a repository's open issues into one Issue card each, at a path made
// from the repository and the issue number, and marks the repository's Issue
// cards closed once their issues leave the open list. Writes only cards whose
// fields changed, and marks nothing closed unless it read the whole list.

realm.progress.plan(['Fetch open issues', 'Update issue cards', 'Mark closed issues']);

const { repository = 'GitHubRepository/boxel' } = realm.current.automation.params;
const MAX_PAGES = 10;
// The card path's prefix: the repository card's name, such as "boxel".
const repoName = repository.split('/').pop();

async function fetchPage(page) {
  // A 5xx or a dropped connection gets two more tries at once; a 4xx stops the run.
  for (let attempt = 1; ; attempt++) {
    try {
      const { document } = await realm.operations.invoke(repository, 'openIssues', { page: String(page) });
      if (document.status < 500 || attempt === 3) return document;
    } catch (error) {
      if (attempt === 3) throw error;
    }
    console.warn(`page ${page}: attempt ${attempt} failed, trying again`);
  }
}

realm.progress.milestone('Fetch open issues');
const open = [];
let complete = false;
for (let page = 1; page <= MAX_PAGES; page++) {
  const { status, headers, body } = await fetchPage(page);
  if (status !== 200) throw new Error(`GitHub answered ${status} for page ${page}`);
  // GitHub lists pull requests as issues too; they carry a pull_request key.
  open.push(...body.filter((item) => !item.pull_request));
  if (!/rel="next"/.test(headers.link ?? '')) {
    complete = true;
    break;
  }
}

realm.progress.task(`Fetched ${open.length} open issues`);

realm.progress.milestone('Update issue cards');
const openPaths = new Set();
let written = 0;
for (const issue of open) {
  const path = `Issue/${repoName}-${issue.number}`;
  openPaths.add(path);
  const fields = {
    repository,
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    labels: issue.labels.map((l) => l.name).join(', '),
    status: 'open',
  };
  let current;
  try {
    current = await realm.cards.get(path);
  } catch {
    current = undefined;
  }
  if (!current) {
    await realm.fs.writeText(
      `${path}.json`,
      JSON.stringify({
        data: {
          type: 'card',
          attributes: fields,
          meta: { adoptsFrom: { module: '../issue', name: 'Issue' } },
        },
      }),
    );
    written++;
  } else if (Object.entries(fields).some(([k, v]) => current.attributes[k] !== v)) {
    await realm.cards.update(path, fields);
    written++;
  }
}
realm.progress.task(
  written ? `Wrote ${written} issue cards that changed` : 'Found no issue card that changed',
);

realm.progress.milestone('Mark closed issues');
let closed = 0;
if (!complete) {
  realm.progress.task(`Marked no issue closed: GitHub listed more than ${MAX_PAGES} pages of open issues`);
}
for (let number = 0, more = complete; more; number++) {
  const { cards, truncated } = await realm.cards.search({
    filter: { on: { module: realm.current.url + 'issue', name: 'Issue' }, eq: { status: 'open', repository } },
    page: { size: 100, number },
  });
  for (const card of cards) {
    const path = card.path.replace(/\.json$/, '');
    if (!openPaths.has(path)) {
      await realm.cards.update(path, { status: 'closed' });
      closed++;
    }
  }
  more = truncated;
}
if (complete) realm.progress.task(`Marked ${closed} issues closed`);
```

The card's trigger is `cron`, `30 8 * * 1-5`, `America/Chicago`, labelled `weekday-mornings`; `operations` names `GitHubRepository`'s `openIssues`; `params` names the repository. Limits: `callApiCalls: 30` (ten pages, three tries each), `responseBytes: 20000000`, `resolveCalls: 0`, `aiCredits: 0`, `writes: 1100` (every issue card on the first run, plus closed ones), `seconds: 300`, and a monthly cap the user confirms. Before the first run the user approves `openIssues` in the secure window, **On a schedule only**.

Two things keep the run cheap and repeatable: the card path comes from the repository and the issue number, so every run finds the same card and an automation for another repository writes cards of its own, and the run writes a card only when a field changed, so a quiet day writes nothing.

## 3. Nightly triage: rules first, AI for the rest

The user: "Every night, sort the new support tickets into billing, bug or question." Each `Ticket` card has `subject`, `body` and `category`; `category` is empty until triage.

`automations/scripts/triage-tickets.js`:

```js
/* global realm, console */
// Sorts every ticket with no category. Plain rules settle the tickets they
// can; one AI request sorts the rest. Leaves a ticket the AI can't place
// as "needs-review" for a person.

realm.progress.plan(['Find new tickets', 'Apply rules', 'Ask the AI', 'Save categories']);

realm.progress.milestone('Find new tickets');
// One AI request sorts the tickets rules leave over; 100 short tickets keep
// the request under realm.resolve's input limit and its answer under the
// 4,096-token cap.
const BATCH = 100;
const tickets = [];
for (let number = 0, more = true; more; number++) {
  const { cards, truncated } = await realm.cards.search({
    filter: { type: { module: realm.current.url + 'ticket', name: 'Ticket' } },
    page: { size: 100, number },
  });
  tickets.push(...cards.filter((card) => !card.attributes.category));
  more = truncated && tickets.length < BATCH;
}
// Tickets past the batch wait for the next night.
tickets.splice(BATCH);
realm.progress.task(`Found ${tickets.length} new tickets`);

realm.progress.milestone('Apply rules');
const category = new Map();
const unclear = [];
for (const t of tickets) {
  const text = `${t.attributes.subject} ${t.attributes.body ?? ''}`;
  if (/\b(invoice|refund|charge|billing|receipt)\b/i.test(text)) {
    category.set(t.path, 'billing');
  } else if (/\b(error|crash|broken|exception|stack trace)\b/i.test(text)) {
    category.set(t.path, 'bug');
  } else {
    unclear.push({ path: t.path, subject: t.attributes.subject, body: (t.attributes.body ?? '').slice(0, 300) });
  }
}
realm.progress.task(`Sorted ${category.size} tickets by rule, leaving ${unclear.length} for the AI`);

realm.progress.milestone('Ask the AI');
if (unclear.length) {
  const { output } = await realm.resolve({
    instruction:
      'Sort each support ticket into billing, bug or question from its subject and body. Use needs-review when none fits.',
    input: { tickets: unclear },
    outputSchema: {
      type: 'object',
      properties: {
        tickets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              category: { type: 'string', enum: ['billing', 'bug', 'question', 'needs-review'] },
            },
            required: ['path', 'category'],
            additionalProperties: false,
          },
        },
      },
      required: ['tickets'],
      additionalProperties: false,
    },
    maxTokens: 4096,
  });
  for (const { path, category: c } of output.tickets) {
    if (unclear.some((u) => u.path === path)) category.set(path, c);
  }
  realm.progress.task(`Sent ${unclear.length} tickets to the AI in one request`);
} else {
  realm.progress.task('Sent nothing to the AI: the rules sorted every ticket');
}

realm.progress.milestone('Save categories');
for (const [path, c] of category) {
  await realm.cards.update(path, { category: c });
}
realm.progress.task(`Saved categories on ${category.size} tickets`);
```

The card's trigger is `cron`, `0 2 * * *` in the user's zone, labelled `nightly`. Limits: `callApiCalls: 0`, `responseBytes: 0`, `resolveCalls: 1`, `aiCredits` enough for one request with 100 short tickets, `writes: 100`, `seconds: 300`. The script trims each ticket's body to 300 characters and takes at most 100 tickets a night, so one request stays under `realm.resolve`'s 128 KiB input limit, its answer fits in 4,096 tokens, and the saves stay within `writes`; tickets past 100 wait for the next night. For a busier queue, raise `resolveCalls` and send the unclear tickets in batches of 100, one request each. The script checks each path the AI returns against the tickets it sent, so the AI can't write a category onto any other card.

## 4. Two steps, two services, safe to Preview

The user, on November 24, 2026: "Every hour, pull new paid orders from my shop into cards and buy a shipping label for each one. Start with today's orders." Two outside services take part: the shop, which the run reads (step 1), and the carrier, where buying a label charges money (step 2). The workspace holds a `Shop` card type with a `paidOrders` operation, a `Carrier` card type with a `buyLabel` operation, an instance of each (`Shop/main`, `Carrier/main`), and an `Order` card type with `orderId`, `customer`, `address`, `weightGrams`, `status`, `labelId` and `trackingNumber`.

The shop's operation answers up to 50 paid orders, oldest first, paid at or after a time the script passes:

```ts
@operation static paidOrders = {
  base: 'callApi',
  label: 'List paid orders, oldest first, paid at or after a time, with your shop key',
  params: { paidFrom: StringField },
  url: 'https://api.shop.example.com/v1/orders',
  query: { status: 'paid', paid_from: params('paidFrom'), sort: 'paid_at', limit: '50' },
  headers: { authorization: 'Bearer {{userKey}}' },
} satisfies OperationDeclaration;
```

The carrier's operation takes everything the carrier needs as params, and sends an idempotency key the carrier reads, so a repeat of the same purchase answers the first label:

```ts
@operation static buyLabel = {
  base: 'callApi',
  label: 'Buy a shipping label for an order, with your carrier key',
  params: {
    idempotencyKey: StringField,
    orderId: StringField,
    address: StringField,
    weightGrams: StringField,
  },
  url: 'https://api.carrier.example.com/v1/labels',
  headers: {
    authorization: 'Bearer {{userKey}}',
    'idempotency-key': params('idempotencyKey'),
  },
  json: {
    reference: params('orderId'),
    to_address: params('address'),
    weight_grams: params('weightGrams'),
  },
} satisfies OperationDeclaration;
```

`automations/scripts/ship-paid-orders.js`:

```js
/* global realm, console */
// Copies up to 50 paid orders a run from the shop into Order cards, at paths
// made from each order's id, then buys shipping labels for up to MAX_LABELS
// order cards with no label and records each label on its card. A cursor file
// holds the paid time of the last order copied. A Preview makes every read
// and writes every card, buys no label, and logs each label a real run would
// buy.

realm.progress.plan(['Fetch paid orders', 'Update order cards', 'Buy shipping labels']);

const { dryRun, params } = realm.current.automation;
const { shop = 'Shop/main', carrier = 'Carrier/main', startAt } = params;
const CURSOR = 'automations/state/ship-paid-orders.json';
// One shop read and MAX_LABELS purchases fit callApiCalls (60); 50 order
// cards, MAX_LABELS earlier cards and the cursor fit writes (120).
const MAX_LABELS = 50;

realm.progress.milestone('Fetch paid orders');
// The first run starts at the time the person confirmed (the startAt param),
// never at the start of the shop's history. The read includes the cursor's
// own time, since orders can share a paid time; an order read again maps to
// the same card and is skipped once labelled.
let paidFrom = startAt;
if (await realm.fs.exists(CURSOR)) {
  paidFrom = JSON.parse(await realm.fs.readText(CURSOR)).paidFrom;
}
// A read changes nothing at the shop, so a Preview makes the read too.
const { document } = await realm.operations.invoke(shop, 'paidOrders', { paidFrom });
if (document.status !== 200) throw new Error(`The shop answered ${document.status}`);
const orders = document.body.orders;
realm.progress.task(`Fetched ${orders.length} paid orders`);

realm.progress.milestone('Update order cards');
// The orders waiting for a label, by card path. A search reads the index as
// the run found the index, so the search finds the orders earlier runs saved
// without a label, and this run's own cards come from the loop below.
const waiting = new Map();
for (let number = 0, more = true; more && waiting.size < MAX_LABELS; number++) {
  const { cards, truncated } = await realm.cards.search({
    filter: { on: { module: realm.current.url + 'order', name: 'Order' }, eq: { status: 'paid' } },
    page: { size: 100, number },
  });
  for (const card of cards) waiting.set(card.path.replace(/\.json$/, ''), card.attributes);
  more = truncated;
}
let written = 0;
for (const order of orders) {
  const path = `Order/${order.id}`;
  let current;
  try {
    current = await realm.cards.get(path);
  } catch {
    current = undefined;
  }
  if (current?.attributes.labelId) continue;
  const fields = {
    orderId: order.id,
    customer: order.customer_name,
    address: order.shipping_address,
    weightGrams: order.weight_grams,
    status: 'paid',
  };
  if (!current) {
    await realm.fs.writeText(
      `${path}.json`,
      JSON.stringify({
        data: {
          type: 'card',
          attributes: fields,
          meta: { adoptsFrom: { module: '../order', name: 'Order' } },
        },
      }),
    );
    written++;
  } else if (Object.entries(fields).some(([k, v]) => current.attributes[k] !== v)) {
    await realm.cards.update(path, fields);
    written++;
  }
  // The run's own version wins over what the search read.
  waiting.set(path, fields);
}
if (orders.length) {
  await realm.fs.writeText(CURSOR, JSON.stringify({ paidFrom: orders.at(-1).paid_at }));
}
realm.progress.task(`Wrote ${written} order cards; ${waiting.size} orders wait for a label`);

realm.progress.milestone('Buy shipping labels');
// Buying a label charges money at the carrier, so a Preview buys none. Every
// card write above comes first: Boxel checks each write as the script makes
// it, so a refused write throws before the carrier charges anything. Orders
// past MAX_LABELS stay paid for the next run.
const batch = [...waiting].slice(0, MAX_LABELS);
let bought = 0;
for (const [path, order] of batch) {
  const payload = {
    // The same order sends the same key on every run, so a purchase repeated
    // after a run that saved nothing answers the first label.
    idempotencyKey: `label-${order.orderId}`,
    orderId: order.orderId,
    // The address itself: the carrier can't read the card, which the
    // workspace saves only after the run ends.
    address: order.address,
    weightGrams: String(order.weightGrams),
  };
  if (dryRun) {
    console.info(`Preview: would buy a label for order ${order.orderId}: ${JSON.stringify(payload)}`);
    continue;
  }
  const { document: label } = await realm.operations.invoke(carrier, 'buyLabel', payload);
  if (label.status !== 200 && label.status !== 201) {
    console.warn(`order ${order.orderId}: the carrier answered ${label.status}`);
    continue;
  }
  await realm.cards.update(path, {
    status: 'labelled',
    labelId: label.body.id,
    trackingNumber: label.body.tracking_number,
  });
  bought++;
}
realm.progress.task(
  dryRun
    ? `Would buy ${batch.length} shipping labels (Preview)`
    : `Bought ${bought} of ${batch.length} shipping labels`,
);
```

The card's trigger is `cron`, `0 * * * *` in the user's zone, labelled `hourly`; `operations` names `Shop`'s `paidOrders` and `Carrier`'s `buyLabel`; `params` names both cards and `startAt`, `2026-11-24T00:00:00-05:00` for "today's orders" in New York, which the user confirms in the chat before the first run. Limits: `callApiCalls: 60`, `responseBytes: 2000000`, `resolveCalls: 0`, `aiCredits: 0`, `writes: 120`, `seconds: 300`, and a monthly cap the user confirms. Before the first run the user approves both operations in the secure window, **On a schedule only**.

Five things make the script safe to Preview and to repeat:

- **The Preview buys nothing and shows everything.** The script reads the shop and writes the order cards in a Preview as in any run, so the person sees which cards a real run writes, and the log lists each label a real run would buy with the payload the carrier would get.
- **The carrier gets the data, not a link.** The order card exists only in the run until the run's save, so the carrier reads the address from the request body.
- **The last step reads the run's own writes from a map.** A search finds the orders earlier runs saved, never the ones this run wrote, so the loop's own fields replace whatever the search read for the same card.
- **A run takes a bounded batch.** The shop answers at most 50 orders and the run buys at most `MAX_LABELS` labels, within `callApiCalls` and `writes`, so a backlog drains over several runs instead of stopping every run at a limit. The first run starts at `startAt`, never at the start of the shop's history.
- **A run that saves nothing can't buy a label twice.** When a run ends without saving after its purchases, the cursor and each order's card stay as they were, and the next run buys the same labels again with the same `label-<order id>` keys; the carrier answers with the first labels, and that run records them on the cards.
