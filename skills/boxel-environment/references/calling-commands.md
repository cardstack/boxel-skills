## 🎯 Command Call Template (CRITICAL - FOLLOW EXACTLY)

### ⚠️ STOP AND READ BEFORE ANY COMMAND CALL

**The #1 error is malformed command calls. MEMORIZE this exact JSON shape:**

```
{
  "name": "command-name_xxxx",
  "payload": {
    "description": "...",
    "attributes": { ...key-value pairs here... }
  }
}
```

### 📐 VISUAL MAP (Study This Carefully)

```
┌─────────────────────────────────────────────────────┐
│ LEVEL 1 (root object)                               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ "name": "patch-fields_3e67"     ← STRING        │ │
│ │ "payload": {                    ← OBJECT        │ │
│ │   ┌───────────────────────────────────────────┐ │ │
│ │   │ LEVEL 2 (inside payload)                  │ │ │
│ │   │ "description": "What this does" ← STRING  │ │ │
│ │   │ "attributes": {                 ← OBJECT  │ │ │
│ │   │   ┌─────────────────────────────────────┐ │ │ │
│ │   │   │ LEVEL 3 (command-specific keys)     │ │ │ │
│ │   │   │ "cardId": "https://..."             │ │ │ │
│ │   │   │ "realm": "https://..."              │ │ │ │
│ │   │   │ "path": "Product/item.json"         │ │ │ │
│ │   │   └─────────────────────────────────────┘ │ │ │
│ │   │ }                                         │ │ │
│ │   └───────────────────────────────────────────┘ │ │
│ │ }                                               │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 🔢 The 3 Nesting Levels Explained

| Level | Key | Type | What Goes Here |
|-------|-----|------|----------------|
| **1** | `"name"` | STRING | Command name with hash suffix (e.g., `"patch-fields_3e67"`) |
| **1** | `"payload"` | **OBJECT** | Wrapper that contains levels 2 and 3 |
| **2** | `"description"` | STRING | Brief text explaining what this call does |
| **2** | `"attributes"` | **OBJECT** | Contains level 3 key-value pairs |
| **3** | *(varies by command)* | varies | Command-specific keys like `cardId`, `realm`, `path`, etc. |

**⚠️ CRITICAL CLARIFICATION:** 
- Level 3 is NOT called "parameters" — it's just the key-value pairs INSIDE `attributes`
- The keys at level 3 vary per command (e.g., `cardId` for patch-fields, `originSourceUrl` + `destinationSourceUrl` for copy-source)
- `attributes` is ALWAYS a JSON object `{ }`, NEVER a string

### 🔴 THE ONE TRUE FORMAT (Copy This Exactly)

```json
{
  "name": "command-name_xxxx",
  "payload": {
    "description": "Brief description of what this does",
    "attributes": {
      "paramName": "value",
      "anotherParam": "value"
    }
  }
}
```

### 🚨 TYPE RULES (Non-Negotiable)
| Key | Type | Example |
|-----|------|--------|
| `"payload"` | OBJECT | `{ ... }` |
| `"description"` | STRING | `"Show the product card"` |
| `"attributes"` | OBJECT | `{ "cardId": "..." }` |

**NEVER:**
- `"attributes": "{\"cardId\": ...}"` ← STRING (wrong!)
- `"attributes": "<parameter>..."` ← XML (wrong!)
- `"arguments": { ... }` ← wrong key name!

## ✅ Pre-Flight Checklist

Before generating ANY command call, verify:
- [ ] Wrapped in `"payload": { }`
- [ ] Has `"description"` field (not empty)
- [ ] Has `"attributes"` as JSON object `{ }`
- [ ] NO `"arguments"` key (use `"payload"` instead)
- [ ] NO string-encoded JSON (attributes must be object, not string)
- [ ] NO XML syntax like `<parameter>`

## 📋 Working Examples

### Example 1: copy-source (multiple attributes)
```json
{
  "name": "copy-source_5d09",
  "payload": {
    "description": "Duplicate a card definition next to the original",
    "attributes": {
      "originSourceUrl": "https://realm-url/product-catalog.gts",
      "destinationSourceUrl": "https://realm-url/product-catalog-v2.gts"
    }
  }
}
```

### Example 2: Empty attributes (when no params needed)
```json
{
  "name": "some-command_xxxx",
  "payload": {
    "description": "Perform action without parameters",
    "attributes": {}
  }
}
```

## ⛔ Critical "Never Do This"

```json
❌ {"name": "...", "arguments": {...}}              → Missing "payload" wrapper
❌ {"payload": {"attributes": {...}}}               → Missing "description"
❌ {"payload": {"description": "...", ...}}         → Missing "attributes"
❌ {"attributes": "{\"key\": \"value\"}"}           → Attributes as string (must be object)
❌ {"attributes": "<parameter name='x'>val</..."}   → XML syntax (pure JSON only)
```
