# text-area

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `alpha-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import { provideDesignSystem, alphaTextArea } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextArea());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaTextArea } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextArea());

export const usageStory = () => html`
  <alpha-text-area placeholder="Describe your experience">How was your stay?</alpha-text-area>
`;
```

## Use cases

Used anywhere an author might otherwise use `<textarea></textarea>`.

## Additional resources

- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/text-area/text-area.styles.ts)
