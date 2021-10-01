# combobox

As defined by the [W3C](https://w3c.github.io/aria-practices/#combobox):

> A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value. The popup may be a listbox, grid, tree, or dialog. Many implementations also include a third optional element -- a graphical Open button adjacent to the combobox, which indicates availability of the popup. Activating the Open button displays the popup if suggestions are available.

## Setup

```ts
import { provideDesignSystem, alphaCombobox, getOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCombobox(), getOption());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaCombobox, getOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCombobox(), getOption());

export const usageStory = () => html`
  <alpha-combobox autocomplete="both">
    <alpha-option>Christopher Eccleston</alpha-option>
    <alpha-option>David Tenant</alpha-option>
    <alpha-option>Matt Smith</alpha-option>
    <alpha-option>Peter Capaldi</alpha-option>
    <alpha-option>Jodie Whittaker</alpha-option>
  </alpha-combobox>
`;
```

## Use cases

- _A customer using the component on a web page._
  On a web page a customer is providing their US mailing address for an order form. The customer clicks a `<alpha-combobox>` to fill in their state (California, Ohio, etc.) and sees a list of options. The customer begins typing the state name and the field is automatically populated with the closest matching state. Then, the customer uses the arrow keys to highlight their state and presses `enter` to commit the value to the combobox.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#combobox)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/combobox/README.md)
- [Fast specification](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/combobox)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/combobox/combobox.styles.ts)
