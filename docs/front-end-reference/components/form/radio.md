# radio

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Setup

```ts
import { provideDesignSystem, alphaRadio } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadio());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaRadio } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadio());

export const usageStory = () => html`
  <div role="radiogroup" aria-labelledby="fruit" name="favorite-fruit">
    <h3 id="fruit">Favorite fruit:</h3>
    <alpha-radio value="apple">Apple</alpha-radio>
    <alpha-radio value="mango">Mango</alpha-radio>
    <alpha-radio value="orange">Orange</alpha-radio>
  </div>
`;
```

For a more ergonomic usage of radios in groups, see [the `alpha-radio-group` documentation](/front-end-reference/components/form/radio-group/).

## Use cases

Used anywhere an author might otherwise use an `input[type="radio"]`. Used to facilitate choice where only one choice is acceptable.

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radio)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio/radio.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/radio/radio.styles.ts)
