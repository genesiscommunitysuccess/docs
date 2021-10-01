# radio-group

As defined by the [W3C](https://w3c.github.io/aria-practices/#radiobutton):

> A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.

While any DOM content is permissible as a child of the radiogroup, only `alpha-radio`'s and slotted content with a role of `radio` will receive keyboard support.

## Setup

```ts
import { provideDesignSystem, alphaRadioGroup, getRadio } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadioGroup(), getRadio());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaRadio, getRadioGroup } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadio(), getRadioGroup());

export const usageStory = () => html`
  <alpha-radio-group value="mango" name="favorite-fruit">
    <alpha-radio value="apple">Apple</alpha-radio>
    <alpha-radio value="mango">Mango</alpha-radio>
    <alpha-radio value="orange">Orange</alpha-radio>
  </alpha-radio-group>
`;
```

## Use cases

Radio group allows the user to be presented with a list of all the options visible which can facilitate the comparison of choice.

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radiogroup)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio-group/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio-group/radio-group.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/radio-group/radio-group.styles.ts)
