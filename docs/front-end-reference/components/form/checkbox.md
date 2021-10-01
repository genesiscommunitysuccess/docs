# checkbox

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected web-component.

## Setup

```ts
import { provideDesignSystem, alphaCheckbox } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCheckbox());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaCheckbox } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCheckbox());

export const usageStory = () => html`
  <fieldset>
    <legend>Fruits</legend>
    <alpha-checkbox checked="">Apple</alpha-checkbox>
    <alpha-checkbox checked="">Banana</alpha-checkbox>
    <alpha-checkbox>Honeydew</alpha-checkbox>
    <alpha-checkbox checked="">Mango</alpha-checkbox>
  </fieldset>
`;
```

## Use cases

Used anywhere an author might otherwise use an `input[type="checkbox"]`

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#checkbox)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/checkbox/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/checkbox/checkbox.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/checkbox/checkbox.styles.ts)
