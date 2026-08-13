---
name: rich-markdown-reports
description: Use when you're about to create a .md file — author it as a rich Boxel markdown file with embedded cards and files instead of plain text. Activates whenever a request would produce a report, summary, briefing, or document saved to a realm.
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

Save it with the file-writing tools you already have, into a realm the user can write to.

## Embedding cards and files

See the `boxel-flavored-markdown` skill for the full grammar. In short:

- Inline, flowing within a sentence: `:card[<url>]` (renders as an atom by default).
- Block, alone on its own line: `::card[<url> | embedded]`, `::card[<url> | fitted 400x200]`, `::file[<url> | embedded]`.
- Choose the format to fit the report: `atom` for a passing mention, `embedded` / `fitted` to show the card in place, `isolated` for a full spotlight.

## Don't use for

- Content that genuinely references no Boxel cards or files — plain markdown is fine there.
- BFM grammar edge cases or a card's rendering internals — that's the `boxel-flavored-markdown` skill.
