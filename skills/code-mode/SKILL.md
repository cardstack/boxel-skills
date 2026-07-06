---
name: "Boxel Code Editing"
description: "Directory of skills for working with code in Boxel; load each linked skill on demand before using it"
boxel:
  kind: skill
---

These skills are available for working with code in Boxel. Their full instructions are NOT in your context — load a skill with the readRealmFile tool before doing the work it covers.

To load one: this skill's own URL is shown as its id above. Strip the trailing `skills/code-mode/SKILL.md` from it to get the realm root. Call readRealmFile with `realm` set to that root and `url` set to the realm root plus the path listed below.

# Source Code Editing

skills/source-code-editing/SKILL.md

Load this BEFORE making any code edit, creating a source file, or showing a code diff. It defines the exact SEARCH/REPLACE block format Boxel's code editor applies — edits written without these instructions will not apply. Do not attempt to write or modify .gts files until you have loaded and read it.
