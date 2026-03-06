# Indexing Operations

Indexing reads realm content and updates the search/query index used by Boxel.

## Cancel Running Indexing Job

Use this when a user asks to stop indexing for a specific realm.

### Preconditions
- User has `write` access to the target realm.
- `realmUrl` is known.

### Behavior
- Cancels currently running jobs in concurrency group `indexing:<realmUrl>`.
- Includes both from-scratch and incremental indexing jobs.
- Does not cancel pending indexing jobs.
- Endpoint response is `204 No Content`, including no-op cases.

### Command Call Template

```json
{
  "name": "cancel-indexing-job_xxxx",
  "payload": {
    "description": "Cancel the currently running indexing job for this realm",
    "attributes": {
      "realmUrl": "<realmUrl>"
    }
  }
}
```
