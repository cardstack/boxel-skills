# Worked automations

Three complete automations, each a card and a script. Paths are relative to the workspace root.

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

The reply tells the user the automation will run at "Wednesday, November 18, 2026 at 3:10 PM Eastern" once a direct writer of the workspace switches the automation on, and that switching on means confirming the time, the estimate and the monthly cap.

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
realm.progress.task(`Sorted ${category.size} of ${tickets.length} tickets by rule`);

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
}

realm.progress.milestone('Save categories');
for (const [path, c] of category) {
  await realm.cards.update(path, { category: c });
}
realm.progress.task(`Saved categories on ${category.size} tickets`);
```

The card's trigger is `cron`, `0 2 * * *` in the user's zone, labelled `nightly`. Limits: `callApiCalls: 0`, `responseBytes: 0`, `resolveCalls: 1`, `aiCredits` enough for one request with 100 short tickets, `writes: 100`, `seconds: 300`. The script trims each ticket's body to 300 characters and takes at most 100 tickets a night, so one request stays under `realm.resolve`'s 128 KiB input limit, its answer fits in 4,096 tokens, and the saves stay within `writes`; tickets past 100 wait for the next night. For a busier queue, raise `resolveCalls` and send the unclear tickets in batches of 100, one request each. The script checks each path the AI returns against the tickets it sent, so the AI can't write a category onto any other card.
