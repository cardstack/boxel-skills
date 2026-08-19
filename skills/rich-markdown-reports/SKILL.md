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

**Write it as a `.md` file in a realm — do not paste it into the chat.** The card and file embeds only render as live cards when the markdown lives as a file in a realm (the realm renders the directives). The same BFM typed into a chat reply stays raw text — the embeds don't resolve.

Create the file with a **SEARCH/REPLACE block** — read `source-code-editing` for the exact format; it applies to `.md` files just as it does to `.gts`/`.json`. First line is the new file's URL followed by ` (new)`, then an empty SEARCH section, then your BFM in the REPLACE section. Use Boxel's box markers **exactly** — `╔═══ SEARCH ════╗`, `╠═══════════════╣`, `╚═══ REPLACE ═══╝` — never git-style `<<<<<<<` / `=======` / `>>>>>>>`, and put nothing after the closing marker. If the markers are wrong the host writes them into the file as literal text instead of applying the edit. Don't use `write-text-file` (it doesn't stream, so the UI freezes). A report that never becomes a realm file hasn't used this skill.

## Embedding cards and files

See the `boxel-flavored-markdown` skill for the full grammar. In short:

- Inline, flowing within a sentence: `:card[<url>]` (renders as an atom by default).
- Block, alone on its own line: `::card[<url> | embedded]`, `::card[<url> | fitted 400x200]`, `::file[<url> | embedded]`.
- Choose the format to fit the report: `atom` for a passing mention, `embedded` / `fitted` to show the card in place, `isolated` for a full spotlight.

## Don't use for

- Content that genuinely references no Boxel cards or files — plain markdown is fine there.
- BFM grammar edge cases or a card's rendering internals — that's the `boxel-flavored-markdown` skill.
