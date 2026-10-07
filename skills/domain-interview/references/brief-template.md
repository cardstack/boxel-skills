# {Name} — brief

> **Written into the brief card's `spec` field.** The title is `cardInfo.name`, so this `#`
> heading is not part of the field; the field starts at the line below and its sections at `##`.

> **Depth decides which sections appear.** Quick writes Overview, Scope (Must rows only), Schema,
> Content contracts, Sample data and Open questions, plus one line saying the build's
> `catalog-reuse` search fills the reuse column. Standard writes every section, with the primer
> cut to the glossary. Deep writes every section in full.

Written by `domain-interview` on {date}, at {Quick | Standard | Deep} depth. Contains no design decisions — layout, style and motion are decided by whatever builds from this brief.

## Overview
{One paragraph: what it does, who for, the single deliverable.}

## Domain primer
**Why this exists** — {what the domain is for, in plain words}

**Glossary**
| Term | Means |
|---|---|
| {term} | {plain-language definition} |

**How a practitioner works** — steps, not screens
1. {step}
2. {step}

**Unwritten rules** — what a novice gets wrong
- {rule, and what goes wrong without it}

## Scope (MoSCoW)
| Priority | Item | Why |
|---|---|---|
| Must | {item} | {why} |
| Should | {item} | |
| Could | {item} | |
| Won't (this round) | {item} | {why cut} |

## Schema
| CardDef | Fields | Links | Notes |
|---|---|---|---|
| {Name} | {field: what the data is} | {linksTo / linksToMany, to what} | {computed, sensitive} |

## Element coverage matrix
| Element | Kind | New / Extend / Reuse | Source if reusing |
|---|---|---|---|
| {name} | card / field / component / command | | {catalog Listing or Spec, base realm, design-system component — from a `catalog-reuse` search} |

## Content contracts
### {Screen name}
- **Purpose**: {what this screen is for}
- **Mode**: {reads | writes | both}
- **Primary action**: {what the user does here first}
- **Mechanism**: {navigate → which card | write → which CardDef and fields | work → which command | read-only}
- **Must contain, in priority order**: 1. {most important} 2. {next} 3. {next}
- **Key moment**: {the action that matters most}
- **Empty state must say**: {what the user needs to know and do}

{repeat per screen}

## Flows
**{Flow name}**: {step} → {step} → {step}

## Sample data
### {CardDef}
- {real name, real numbers, real dates — written as content, not placeholders}

## Assumptions
*(Only when the user skipped a question or the rest. One line each; omit the section otherwise.)*
- {question} · {what was chosen} · {why: recommended option / prompt / research / conservative default}

## Open questions
- [ ] {what the user still needs to decide}
