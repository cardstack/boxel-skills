---
name: rich-markdown-reports
description: Read before writing or editing any .md file in a realm (report, summary, notes, briefing, doc). Author it as a rich Boxel markdown file with embedded cards and files instead of plain text — applies whenever a task will produce a markdown file, even if the user never said "rich".
boxel:
  kind: skill
---

# Rich Markdown Reports

_When you'd write a plain `.md`, write a rich Boxel markdown file instead: embed the live cards and files the report is about, and link real data rather than restating it._

Boxel `.md` files render as Boxel Flavored Markdown (BFM). A report that embeds the cards it discusses is worth more than one that paraphrases them — the embeds stay live and clickable, and update as the underlying cards change.

## The rule

Whenever you are about to create a markdown file — a report, summary, meeting notes, briefing, or write-up of one or more cards — make it a **rich** markdown file:

- Embed the cards and files the report is about with BFM directives instead of describing them in prose.
- Reference real data rather than copying values into the text, so the report stays current as the cards change.
- Structure it with headings so it's navigable.

**Write it as a `.md` file in a realm — do not paste it into the chat.** The card and file embeds only render as live cards when the markdown lives as a file in a realm; the same BFM typed into a chat reply stays raw text and the embeds don't resolve. Save it to a realm the user can write to — see **Pair with** below for how to create the file. A report that never becomes a realm file hasn't used this skill.

## Pair with

- **`boxel-flavored-markdown`** — the directive grammar your embeds use (`:card` / `::card` / `::file`, embed formats, fenced renderers). Pick the format that fits the report.
- **`source-code-editing`** — the SEARCH/REPLACE block format used to write the file to the realm. The block format is the same for a `.md` file as for code, so reuse it here even though a report isn't source code.

## Don't use for

- Content that genuinely references no Boxel cards or files — plain markdown is fine there.
- BFM grammar edge cases or a card's rendering internals — that's the `boxel-flavored-markdown` skill.
