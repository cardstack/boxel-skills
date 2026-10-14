# Benchmark and refine — scoring against the field, and looping to the bar

Part of [`design-review`](../SKILL.md). Links are relative to this file.

Two additions to a normal review. The **benchmark** gives the 8.5 gate an outside reference, so the
number stops being the model's feeling. **Refine mode** is the loop that builds, captures, scores
and fixes: one round runs on its own, and each further round runs when the user picks it.

## The benchmark

Run it once per unit, before the first score, and reuse it across rounds.

1. **Pick the category from the brief**, not the style: a portfolio, a SaaS landing page, a
   dashboard, an editorial article, a product page, a booking flow. A record page, a desk or a
   form has no award category; skip the benchmark for those and score against the acceptance lines
   and the aesthetic bar alone.
2. **Find three references.** Look them up online only when the user asks for a benchmark against
   real sites ([`untrusted-content.md`](../../boxel-design/references/untrusted-content.md) →
   *When to research*); the automatic review after a build does not fetch. When you do look, use the
   places that publish recognised work:
   - **Awwwards** — Site of the Day, Honorable Mentions and the category collections
   - **The Webby Awards** — winners and Peoples' Voice in the matching category
   - **FWA** — Site of the Day, in the matching category

   Take recent work. A site from five years ago benchmarks a period, not the bar. Say which three
   you chose, where each was listed, and the URL. Otherwise, name three you know well, label them
   `from memory`, and do not claim to have looked. Labels and the rules for anything a
   page says are in [`untrusted-content.md`](../../boxel-design/references/untrusted-content.md).
3. **Capture each at the same width as the unit** (see `capture.md`), above the fold and one scroll
   down. If you cannot capture a page — no browser, or the capture fails — use the reference's
   published case study or listing screenshot if you can open it, and say so. A reference you
   captured is `rendered`; one you did not is not a visual benchmark. **An unverified benchmark —
   no reference `rendered` — informs the notes and does not pass or fail a round;** the 8.5 gate
   then rests on the acceptance lines and the aesthetic bar alone.
4. **Write one line per reference per dimension:** what it does that the unit does not. Use the
   same dimensions as the aesthetic gate: typography, colour, composition, media, detail, emptiness.

### What the benchmark may and may not decide

- **Compare composition, not technology.** Award winners are often WebGL, full-viewport pinned
  scenes or custom cursors. A card owns only its own scroll box (see `boxel-design/references/signature-treatments.md`), so
  those are not the gap. The gap is hierarchy, type scale and weight, spacing rhythm, image
  treatment, and whether anything dominates.
- **A benchmark never overrides `## Design direction`.** If a reference does something the
  direction decided against, that is not a failure; note it once, as Phase 1 already does for a
  decision you think was wrong.
- **Never copy.** Borrow the principle ("the headline is four times the body and is the only
  thing at that size"), not the layout, assets or copy.
- **Livery versus technique.** A reference's palette and fonts belong to its brand. Record what to
  learn from how it is used, not the values.

The benchmark lands in the report as a short block, above the aesthetic scores:

```
Benchmark (category: freelance portfolio, 3 references, captured at 1280)
- <site> (Awwwards SOTD, <month year>): headline ~5× body, only one size above 48px; unit's is 2×
- <site> (FWA SOTD): one full-width image per project, no thumbnails; unit crops to 4:3 tiles
- <site> (Webby, <category>): …
Gap on the bar: type scale and image treatment
```

## Refine mode — `design-review refine`

Use it when the user asks for the unit to be brought to the bar. The review half of it is not
optional: it runs after every build as the automatic loop in `SKILL.md` (`set` across the app, and
each linked CardDef in the formats the screens show it in). This section is that loop's detail, and
`refine` is its name when the user asks for it.

### Roles

| Role | Does | Must not |
|---|---|---|
| **Builder** (the main agent) | builds the first screen from the brief card; applies fixes each round | score its own work |
| **Reviewer** (a separate subagent, fresh context each round) | captures, runs the benchmark, ticks the acceptance lines and the build check's visual lines, scores, names the gaps; gets the names of the gaps the build left open; from round 2, says whether each earlier gap's fix landed | read the source, see the builder's reasoning, or route the gaps (the main agent does) |

The split exists because a model that has just built something scores it high. The reviewer is
given only the captures, the brief card and the benchmark, and from round 2 the previous round's gap
list with one line per gap on what changed. Without that list, each fresh reviewer re-judges from
scratch and can reverse the last one's advice. A reviewer reverses an earlier gap only when the fix made
things worse, and says so. It reports in the normal `Output` shape.
Where the harness cannot spawn a subagent, say so, and treat the round's scores as provisional.

### The loop

```
build → check → capture → review (independent) → skip gate met? ── yes → report, stop
                                   │
                                   no → fix the named gaps once → check → capture → review → report
                                        (another round only when the user picks it)
```

1. **Build** what the build path produces (for an app, Home and its linked cards), then run the
   builder's pass/fail check ([`build-check.md`](build-check.md)) and fix what fails.
2. **Capture**, then **review** with the benchmark. The reviewer returns the acceptance tally,
   the six scores, the gap list and a verdict.
3. **Clearing the gate** means every acceptance line ticked, the aesthetic score at or above 8.5,
   and no constraint failure (contrast, focus, motion-off). The automatic fix round is skipped only
   by the stricter gate in `SKILL.md` → *Automatic review after every build*, step 5 (nothing fails
   and an independent reviewer scored 9 or more).
4. **Fix** only what the gap list names, in the order it gives, at most the top three gaps per
   round. A gap is a cause: one template cutting off names in six tiles is one gap. Run the build
   check again on every view a fix touched, at desktop and phone width, before the next capture.
   A round that rewrites things nobody flagged makes the next score meaningless; report
   what changed and what was left alone.
5. **One fix round, then the user decides.** The automatic loop fixes once and re-scores, then
   reports every round, saying plainly when the last one made things worse, with "Keep improving:
   one more round" as a choice. The fix round is skipped only by the gate in `SKILL.md` →
   *Automatic review after every build*, step 5. One round, because the first fix round raises the
   score and later rounds move it by about as much as two reviews of the same captures differ. Not
   measured in the Boxel AI assistant.

### What the user sees at the end

One report: rounds run, the score and acceptance tally per round, the benchmark block, what is
still short of the bar and why, and the next step as a structured choice (review the next screen,
revisit a decision, run `set` or `card` mode, or stop). If it did not pass, say so first and give
the number. Do not soften it.

### Limits to state

- The score is a model's judgement from captures. It is steadier with the benchmark and with an
  independent reviewer, and it is still not a human's. Say "cleared the gate" rather than
  "is award-winning".
- A pass on the first screen says nothing about the rest. Run `set` mode once more than one screen
  exists.
- The scorecard and changelog live in the report, not in the realm. Comparing first-shot scores and
  common fixes across many briefs is the eval harness's job: test runs keep each report outside any
  realm.
