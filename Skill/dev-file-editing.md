# File Editing

The SEARCH/REPLACE block format and the `.gts` edit-tracking convention (line-1 banner, `// ⁿ` markers) are defined in the canonical **Source Code Editing** skill (`skills/source-code-editing/SKILL.md`), not here. Consult that skill before editing or creating any file.

Key reminders:

- ALWAYS use SEARCH/REPLACE for `.gts` files — never `write-text-file`.
- Every `.gts` file starts with the `// ═══ [EDIT TRACKING: ON] Mark all changes with ⁿ ═══` banner; mark changed lines with sequential `// ⁿ` superscript comments. `.json` files never get tracking comments.
- For new files, append `(new)` after the file URL line.
- SEARCH text must match the existing file exactly; keep blocks small.
