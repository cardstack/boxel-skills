# Restyle a Pret UI or boxel-ui component

A component brings behaviour and accessibility. The app's look comes from the theme and the chosen Look, so a button on a playful app should not look like the library default. Judge it from a capture you took, not from the code. Do not claim a component can look a certain way until the capture shows it. A capture proves one rendered case; it does not make a variable or argument a documented one, so take names from the component's own docs or source.

## The steps

1. **The theme tokens.**
2. **The component's documented attributes and CSS variables.** For the Pret UI `Button`: `@variant`, `@tone`, `@appearance`, `@size`, `@shape`, and the variables `--pretui-button-h`, `--pretui-button-px`, `--pretui-button-radius`, `--pretui-button-bg`, `--pretui-button-fg`, set on the button or on an ancestor.
3. **A CSS rule of your own on the component.** It wins when the component's styles sit in a cascade layer and yours does not, or when your selector out-specifies them. The Pret UI `Button` styles are in `@layer PretComponent`, and a one-class rule on it overrode even `@shape` in a capture. Other components may not be layered, so check the component's source for `@layer` and confirm the result in a capture. Because a rule of your own beats the documented arguments, scope it to what they cannot reach, and never let it remove the focus ring.
4. **Wrap or compose it**, keeping its behaviour and accessibility, with no nested interactive elements.
5. **If nothing above reaches the look, keep the component and name the gap.** A look on its own is not a reason for raw HTML; hand-rolling stays for a behaviour gap, under the discovery rules.

## What captures showed (Pret UI `Button`, `Accordion`, `FilterChips`, `FilterSet`)

- `--primary` and `--primary-foreground` set the default `Button`; `--pretui-button-bg` and `--pretui-button-fg` on one button override just that button.
- The other tones (`success`, `danger`, `info`) keep the library's colours unless the theme sets their tokens, so a theme that only sets `--primary` leaves a stock-green `success` button.
- One set of tokens (`--radius`, `--border`, `--ring`, `--background`, `--primary`) restyled all four components, and a class on each (border, shadow, dashed outline, rotation) overrode it. The selected `FilterChips` chip stayed a white pill under a pink `--primary`, so check what each component takes from `--primary` before relying on it for the accent.
- A default `Button` is about 28px tall: above the 24px WCAG 2.2 AA minimum, below the 44px touch target. Raise `--pretui-button-h` for touch.
- The focus ring stayed visible under token and variable restyles. Check it again after a rule of your own.
- A theme can pair colours that fail contrast (white on `#ff4d6d` is 3.2:1, below 4.5:1 for small text); the component does not fix that. Use the capture to pick the real state and colour pair, then check the effective colours with a contrast tool.
- Two small apps (screenings, bakery orders) in four moods (light calm, playful, dark cinematic, elegant) used the same `Button`, `FilterChips` and `Accordion`, changed by one token block per mood plus a few rules of your own on the rows and buttons; the four read clearly as different. Two things to check on each mood: on the dark mood the `FilterChips` count pill rendered as a pale box that hid its number, and `Accordion` titles kept the component's own sans font under serif moods.
