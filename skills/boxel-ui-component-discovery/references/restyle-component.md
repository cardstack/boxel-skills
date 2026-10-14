# Restyle a Pret UI or boxel-ui component

A component brings behaviour and accessibility. The app's look comes from the theme and the chosen Look, so a button on a playful app should not look like the library default. Judge it from a capture you took, not from the code. Do not claim a component can look a certain way until the capture shows it.

## The steps

1. **The theme tokens.**
2. **The component's documented attributes and CSS variables.** For the Pret UI `Button`: `@variant`, `@tone`, `@appearance`, `@size`, `@shape`, and the variables `--pretui-button-h`, `--pretui-button-px`, `--pretui-button-radius`, set on the button or on an ancestor.
3. **A plain CSS rule of your own on the component**: Pret UI components are being moved into cascade layers, so a caller's one-class rule can override a layered component. Verify it in a capture; not every component is layered yet.
4. **Wrap or compose it**, keeping its behaviour and accessibility.
5. **Hand-roll it** only when nothing above fits, and name the gap.

What a capture of the `Button` showed:

- `--primary` and `--primary-foreground` set the default (`accent`) button; `--pretui-button-bg` and `--pretui-button-fg` on one button override just that button.
- The other tones (`success`, `danger`, `info`) keep the library's colours unless the theme sets their tokens, so a playful theme that only sets `--primary` leaves a stock-green `success` button.
- A default `Button` is about 28px tall, under 44px; raise `--pretui-button-h` when the hit area matters. The focus ring stayed visible on a restyled button.
- A theme can pair colours that fail contrast (white on `#ff4d6d` is 3.2:1, below 4.5:1); the component does not fix that. Check contrast in the capture.

Other Pret UI components follow the same channel. In a capture, one set of tokens (`--radius`, `--border`, `--ring`, `--background`, `--primary`) restyled `Accordion`, `FilterChips` and `FilterSet` as well, and a class on each (border, shadow, dashed outline, rotation) overrode it. The selected `FilterChips` chip stayed a white pill under a pink `--primary`, so check what each component takes from `--primary` before relying on it for the accent.
