# Boxel Flavored Markdown (BFM)

BFM is the markdown dialect Boxel reads and writes. It extends CommonMark + GitHub Flavored Markdown with directives for embedding cards by URL.

## Where BFM is used

BFM is the same dialect everywhere Boxel parses or emits markdown:

- `.md` files stored in a realm (rendered by the base realm's MarkdownTemplate)
- `MarkdownField` values (inline markdown stored in a card's JSON)
- AI assistant messages in Boxel
- The `markdown` format output of any card (served via `Accept: text/markdown` or produced by "Copy as Markdown")
- The "Rendered" view of the code-mode markdown preview panel

The same text copies cleanly between these surfaces.

## Base syntax

Standard CommonMark plus GFM. The common subset you can rely on:

- ATX headings (`# H1` … `###### H6`) — marker and text must be on the **same line**
- Paragraphs, hard breaks (two trailing spaces + `\n`), horizontal rules
- Emphasis (`*em*`, `**strong**`), inline code (`` `x` ``), fenced code blocks
- Lists (bullet `-`/`+`/`*`, ordered `1.` — note `.` not `)`)
- Links `[text](url)` and images `![alt](url)`
- GFM tables (`|`-separated), strikethrough (`~~x~~`), autolinks

## Card directives (the Boxel extension)

Two forms reference a card by its full URL:

### Inline: `:card[URL]`

Renders the target card in **atom** format, inline with surrounding text.

```md
Written by :card[https://my.realm/Author/jane] for the team.
```

Use inline form when the card should flow with the sentence.

### Block: `::card[URL]`  or  `::card[URL | spec]`

Renders the target card in a block slot, separated from surrounding prose. Default format is **embedded**.

```md
See the latest post:

::card[https://my.realm/BlogPost/first-look]
```

The optional `| spec` after the URL controls size/format. Common specs:

| Spec                  | Meaning                                          |
| --------------------- | ------------------------------------------------ |
| `embedded` (implicit) | Default when no spec is given                    |
| `isolated`            | Full detailed view                               |
| `fitted`              | Fitted format at its container's natural size    |
| `fitted 250x40`       | Fitted format at a specific width × height (px)  |
| `strip`               | Horizontal strip layout                          |

```md
Featured authors:

::card[https://my.realm/Author/jane | fitted 300x120]
::card[https://my.realm/Author/mohammed | fitted 300x120]
```

### Unresolved references

If the renderer can't resolve a card URL (deleted, permissions, offline), the directive falls back to a muted pill badge showing the URL. Don't rely on card directives for content that must render without the Boxel runtime — plain markdown links (`[text](url)`) are safe everywhere.

### Inside code blocks

Card directives inside fenced or inline code are **not** converted — they render as literal text. Use this when you need to show directive syntax in documentation.

## Authoring notes

- **Use full URLs in directives**, not relative paths — directives are resolved by the Boxel store, not by the surrounding document's base.
- **Escape user-supplied text** before interpolating it into a BFM string. `[`, `]`, `(`, `)`, `|`, `:`, `#`, `*`, `` ` ``, `_`, `~`, `!`, `<`, `>`, leading `+`/`-`, and line-start `1.` all have meaning. See the `dev-markdown-format` skill for `markdownEscape` and helper functions.
- **Prettier reflows markdown.** When a template's output must preserve column-zero placement (ATX headings, fence columns), protect it with `{{!-- prettier-ignore --}}`.

## Quick reference

```md
# Heading

A paragraph with **bold**, *italic*, `code`, and a [link](https://example.com).

Inline card: :card[https://my.realm/Author/jane]

Block card (embedded default):

::card[https://my.realm/BlogPost/first-look]

Block card with size:

::card[https://my.realm/Author/jane | fitted 300x120]

- bullet
- another

1. ordered
2. another

| col | col |
| --- | --- |
|  a  |  b  |

```lang
fenced code
```
```
