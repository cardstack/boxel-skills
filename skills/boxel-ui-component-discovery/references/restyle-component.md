# Restyle a Pret UI or boxel-ui component

A component brings behaviour and accessibility. The app's look comes from the theme and the chosen Look, so a button on a playful app should not look like the library default. Judge it from a capture you took, not from the code. Do not claim a component can look a certain way until the capture shows it.

## The steps

1. **The theme tokens.**
2. **The component's documented attributes and CSS variables.** For the Pret UI `Button`: `@variant`, `@tone`, `@appearance`, `@size`, `@shape`, and the variables `--pretui-button-h`, `--pretui-button-px`, `--pretui-button-radius`, set on the button or on an ancestor.
3. **A plain CSS rule of your own on the component**: Pret UI components are being moved into cascade layers, so a caller's one-class rule can override a layered component. Verify it in a capture; not every component is layered yet.
4. **Wrap or compose it**, keeping its behaviour and accessibility.
5. **Hand-roll it** only when nothing above fits, and name the gap.

A default `Button` is under 44px tall; raise `--pretui-button-h` when the hit area matters. Check the focus ring, the hit area and contrast in the capture.
