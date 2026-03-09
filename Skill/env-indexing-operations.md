# Indexing Operations

Indexing reads realm content and updates the search/query index used by Boxel.

## Invalidate Specific URLs

Use this when a user wants specific files re-indexed for a realm. The user may ask that the card be refreshed or reloaded when they want a card to be re-indexed.

### Preconditions
- User has `write` access to the target realm.
- `realmUrl` is known.
- `urls` contains the specific file or card URLs that should be re-indexed.

### Behavior
- Triggers incremental indexing for the specified URLs.
- Use this to target specific files instead of canceling or starting broader indexing work.
- The command accepts multiple URLs in one request.

### Command Call Template

```json
{
  "name": "invalidate-realm-urls_xxxx",
  "payload": {
    "description": "Trigger indexing for specific files in this realm",
    "attributes": {
      "realmUrl": "<realmUrl>",
      "urls": [
        "<url1>",
        "<url2>"
      ]
    }
  }
}
```

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
