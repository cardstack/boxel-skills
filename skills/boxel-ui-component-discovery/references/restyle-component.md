# Restyle a Pret UI or boxel-ui component

A component brings behaviour and accessibility. The app's look comes from the theme and the chosen Look, so a button on a playful app should not look like the library default. Judge it from a capture you took, not from the code. Do not claim a component can look a certain way until the capture shows it. A capture proves one rendered case; it does not make a variable or argument a documented one, so take names from the component's own docs or source.

## The steps

1. **The theme tokens.** Set colour, radius and type once in the app's Theme (`--primary`, `--primary-foreground`, `--background`, `--foreground`, `--border`, `--ring`, `--radius`, and the tokens of any other tone you use); every Pret UI component reads them, so this restyles all of them together.
2. **The component's documented attributes and CSS variables.** They are listed in the component's Spec `readMe` or its writeup (step 3 of the discovery procedure says where for each library). A component that documents none skips this step. For the Pret UI `Button`: `@tone` (unset means `primary`), `@appearance`, `@size`, `@shape` (`@variant` is deprecated sugar over the first two; never pass it), and the variables `--pretui-button-h`, `--pretui-button-px`, `--pretui-button-radius`, `--pretui-button-bg`, `--pretui-button-fg`, set on the button or on an ancestor.
   **A restyle needs no write-up read.** Use a `--pretui-*` variable the user named, or one this file names,
   as given. For a part nobody has named a variable for, use step 1 or step 3, which need no variable
   names.
3. **A CSS rule of your own on a Pret UI component.** Pret UI keeps every component's styles in cascade layers (`PretComponent`, `PretComposite`), so a plain scoped rule of yours wins without `:deep()` or a more specific selector; on the `Button` a one-class rule overrode even `@shape`. The one exception is `Select`: its trigger and option styles are unlayered, and a class on `Select` lands on its wrapper, so the rule has to reach the trigger with `:deep(.pretui-selecttrigger)` and out-specify it. A boxel-ui component takes this step through its knobs only (step 2), never a rule on its classes; when no knob reaches, go to step 4 or 5. Confirm the result in a capture. Because a rule of your own beats the documented arguments, scope it to what they cannot reach, and never let it remove the focus ring.
4. **Wrap or compose it**, keeping its behaviour and accessibility, with no nested interactive elements.
5. **If nothing above reaches the look, keep the component and name the gap.** A look on its own is not a reason for raw HTML; hand-rolling stays for a behaviour gap, under the discovery rules.

## What captures showed (Pret UI `Button`, `Accordion`, `FilterChips`, `FilterSet`)

- `--primary` and `--primary-foreground` set the default `Button`; `--pretui-button-bg` and `--pretui-button-fg` on one button override just that button.
- The other tones (`success`, `danger`, `info`) keep the library's colours unless the theme sets their tokens, so a theme that only sets `--primary` leaves a stock-green `success` button.
- One set of tokens (`--radius`, `--border`, `--ring`, `--background`, `--primary`) restyled all four components, and a class on each (border, shadow, dashed outline, rotation) overrode it. Not every component takes the accent from `--primary`, so check what each one takes before relying on it.
- A default `Button` is about 28px tall: above the 24px WCAG 2.2 AA minimum, below the 44px touch target. Raise `--pretui-button-h` for touch.
- The focus ring stayed visible under token and variable restyles. Check it again after a rule of your own.
- A theme can pair colours that fail contrast (white on `#ff4d6d` is 3.2:1, below 4.5:1 for small text); the component does not fix that. Use the capture to pick the real state and colour pair, then check the effective colours with a contrast tool.
- The same components can carry very different looks (light and calm, playful, dark, elegant) from one token block per look plus a few rules of your own. On each look, check in a capture that every component's numbers, labels and fonts follow the theme; one that does not is a gap to name (step 5).
