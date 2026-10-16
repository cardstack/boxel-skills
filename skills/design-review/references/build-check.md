# Build check — finish the basics before judging taste

Part of [`design-review`](../SKILL.md). Links are relative to this file.

Run automatically after the playbook's last stage on everything the build produced, including
linked cards in the formats the app shows. This is pass/fail, never a design score. Fix every
failing line within the authorized build; re-capture and check the affected views. Report
"Fixed N items" and what remains open, without a scorecard, an 8.5 verdict or a review invitation.
Stop when the checks pass or a named blocker prevents further progress; never call an open check passed.
Skip only for a utility card with no user-facing surface, with a one-line reason.

For existing work, run the same check silently before reviewing, **without editing**. Report one
*Basics* block with failed lines and evidence, grouping instances by cause. Use the actual applicable
denominator (14 numbered lines, with 4a/4b under line 4); show open and n/a separately.
More than half of applicable lines failing means taste scores wait until basics are repaired.

The builder may inspect source for 4a, 13 and 14; the main agent owns these checks separately from
the visual reviewer. For existing work, the main agent still runs 13 and 14 from source, but does not
read source to infer responsive behaviour: 4a stays open (unverified) until an authorized repair, and
4b uses captures. DOM, measured colours and exercising
controls can verify behaviour and accessibility; source never substitutes for a capture.

## Capture

Use `realm.capture` in a `run-realm-code` script in the app, or `npx boxel screenshot` from a
terminal, and inspect every image. Read [`capture.md`](capture.md) for tool limits and retries.

- Home and every linked card's `isolated` view at desktop (1280px) and phone (390px), including
  lower sections: use full height or a tall viewport, not just the first screen.
- Each format the app actually renders, at narrow and wide placements, even when an existing card
  declares no breakpoints. Fitted: smallest/largest envelopes used; embedded: narrowest/widest
  placement. A format used at only one size makes the comparison n/a, not a responsive defect.
- Capture fitted inside its parent. `realm.capture` cannot capture fitted alone; unreachable
  placements are `uncaptured: <format/size> (<reason>)`, and the dependent check stays open.
  From a terminal, `npx boxel screenshot --format fitted --envelope WxH` can cover other sizes;
  verify apparent theme loss inside the parent before reporting it.

## The check

Each numbered line is pass, fail, open or n/a, with evidence for every failure.

1. **Names.** Names and titles show in full or wrap to two lines at every size used. Include the
   longest realistic name in sample records.
2. **Fill and key fact.** Each format carries its content matrix's key fact (price, person,
   status, time), never just a bigger title. A demoted or missing key fact in fitted/embedded,
   or a tile 70–80% empty, fails. More than about a third unused space in a data tile or row
   prompts giving space to the fact/media, or choosing embedded when the child owns its height.
   Deliberate breathing room in a composition is not an empty data tile.
3. **Media and blanks.** Media slots load an image or labelled placeholder, not initials or a
   gradient where a photo belongs. Labels remain readable in their panels (small avatars sharing
   the URL are exempt). Follow [`sample-images.md`](../../boxel-file-def/references/sample-images.md).
   Re-capture a blank region once; if blank again, fail it rather than waiting for an entrance.
4. **Phone and responsiveness.** At 390px, no horizontal overflow or clipped text or controls.
   **4a (builder source):** every custom container query has a valid ancestor container; fitted
   uses the host's `fitted-card`, never a container on the element its own query styles.
   **4b (captures):** compare narrow and wide views where the layout needs to adapt. Identical
   desktop composition at both sizes, or columns overflowing instead of stacking, is reported as
   **"no responsive breakpoints"**, with both captures. A fluid single-column layout that fits
   both sizes does not fail merely for keeping its structure. For a standard fitted repair,
   use `FittedCard` from `@cardstack/boxel-ui/components`, tuned through documented `--fc-*`
   variables, rather than adding hand-written responsive CSS. For other formats, search for a
   suitable responsive structure. Bespoke fitted compositions remain governed by the playbook's
   custom-CQ exception; name that mismatch before choosing it. Unreachable sizes stay open.
5. **Contrast.** Text on every surface and in every state reaches 4.5:1. Measure effective colours,
   do not eyeball them. Faint 11–13px grey text near or below the floor needs measurement; below
   the floor fails. Preserve the app's colour roles when correcting it.
6. **Type floor.** In isolated and embedded, no text under 12px, including uppercase labels and
   numerals. Fitted uses its [per-role minimums](../../boxel/references/container-query-fitted-layout.md).
   Surface types do not lower these floors; the type ladder's taste belongs to the review.
7. **Affordance legibility.** Measure hit area, not ink: under 24×24 CSS px fails unless the
   WCAG 2.2 SC 2.5.8 spacing exception applies (a 24px circle centred on it overlaps no other
   target). Aim for 44×44 for the main action and phone controls; below that aim is a minor note,
   not a failure when the minimum passes. Verify a resting cue (fill, border, underline or chevron),
   visible hover and `cursor: pointer`; capture one hover per control kind. Hover-only bare text
   and invisible row overlays with no cue fail. Five or fewer options use buttons/chips rather
   than a dropdown unless the task needs otherwise.
8. **Main action and clickable controls.** Name the primary user and action from the UI and check
   against the content contract. Reach the action through `operations()` (hide only on
   `canInvoke === false`), a real link, or a disabled control with a marked slot explaining what
   is needed. Other controls use linked cards, supplied URLs, `viewCard` (including edit), or
   tracked filters. Every link has a real `href`. Exercise the main action and one control of each
   kind; check the remainder in the DOM. An unexercised action is open, not passed. An absent or
   unreachable main action is a blocker; dead controls or a stub main action are major defects.
   **Pseudo-controls** (a styled span/div/li that looks interactive with no real wired control)
   fail here, including a primary-action phrase drawn only as text. In an unfinished mockup,
   report them as notes instead.
9. **Keyboard and focus.** Anything pressable has a real control, keyboard access and visible
   focus. Preserve focus rings when restyling; hover styling alone does not provide focus.
10. **Clarity and domain fit.** A first-time user can tell what this is and what to do. Use the
    domain's conventions rather than furniture that obscures the task. The action's visual
    prominence and dominant object are review questions, not scored here.
11. **Same facts everywhere.** Time, person and status agree across screens; counts match their
    underlying records (including full match counts for query-backed collections).
12. **Robustness.** Check long strings, missing media, zero rows, one row and many rows. No clipping,
    broken layout or inaccessible action in these states. The voice of empty/error copy is taste.
13. **Theme-token integrity (source).** Production UI colours use core tokens; data series use
    `--chart-1` … `--chart-7` in order. Token-derived mixes, `transparent`, `currentColor` and
    data-supplied colours are allowed. Name replacements by role for other literals.
    Indistinguishable series fail. Component styling beside themed controls is judged in review.
14. **Baseline motion and accessibility.** The builder cites `file:line` or a reasoned n/a for
    each row of the [baseline](../../boxel/references/design-playbook.md#after-stage-4--baseline-motion).
    Applicable missing rows fail, as do entrances on fitted/embedded roots and hidden/offset resting
    states. No `opacity: 0` in base CSS. Prerender skips the initial state with `isLiveRender()`;
    CSS keyframes rest at their final state. An explicit no-motion request makes baseline rows n/a
    and any added motion a failure. Run [the motion-off pass](capture.md#the-motion-off-pass):
    every element survives, and every state conveyed by motion remains reachable without it.
    Unavailable browser checks stay open; an independent visual reviewer need not read source.

After any authorized fix round, repeat this check on affected views at both widths. Taste and
coherence, including stock component styling beside themed controls, live in the requested
review. Do not start a scored review automatically.
