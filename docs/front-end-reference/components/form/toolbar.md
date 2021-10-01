# toolbar

As defined by the [W3C](https://w3c.github.io/aria-practices/#toolbar):

> A toolbar is a container for grouping a set of controls, such as buttons, menubuttons, or checkboxes.
>
> When a set of controls is visually presented as a group, the toolbar role can be used to communicate the presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be an effective way of reducing the number of tab stops in the keyboard interface.

## Setup

```ts
import { provideDesignSystem, alphaToolbar } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaToolbar());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import {
  provideDesignSystem,
  getButton,
  getCombobox,
  getOption,
  getRadio,
  getRadioGroup,
  getSelect,
  getToolbar,
} from '@genesislcap/alpha-design-system';

provideDesignSystem().register(
  getButton(),
  getCombobox(),
  getOption(),
  getRadio(),
  getRadioGroup(),
  getSelect(),
  getToolbar(),
);

export const usageStory = () => html`
  <alpha-toolbar>
    <alpha-button>Button</alpha-button>
    <alpha-radio-group>
      <alpha-radio checked="">One</alpha-radio>
      <alpha-radio>Two</alpha-radio>
      <alpha-radio>Three</alpha-radio>
    </alpha-radio-group>
    <alpha-combobox>
      <alpha-option>Please Please Me</alpha-option>
      <alpha-option>With The Beatles</alpha-option>
      <alpha-option>A Hard Day's Night</alpha-option>
      <alpha-option>Beatles for Sale</alpha-option>
      <alpha-option>Help!</alpha-option>
      <alpha-option>Rubber Soul</alpha-option>
      <alpha-option>Revolver</alpha-option>
      <alpha-option>Sgt. Pepper's Lonely Hearts Club Band</alpha-option>
      <alpha-option>Magical Mystery Tour</alpha-option>
      <alpha-option>The Beatles</alpha-option>
      <alpha-option>Yellow Submarine</alpha-option>
      <alpha-option>Abbey Road</alpha-option>
      <alpha-option>Let It Be</alpha-option>
    </alpha-combobox>
    <alpha-button>Button</alpha-button>
    <alpha-select>
      <alpha-option>Option 1</alpha-option>
      <alpha-option>Second option</alpha-option>
      <alpha-option>Option 3</alpha-option>
    </alpha-select>
  </alpha-toolbar>
`;
```

## Use cases

Used anywhere someone may want to visually and structurally group related interactive controls.

- Tom is reading his favorite internet newspaper. Upon finishing an article, he notices that it has accrued nearly one thousand comments. Tom decides to read the comments and he ends up writing a response to someone he disagrees with. As he gets ready to submit, he realizes it will be easier for others to read his comment if he formats it. Tom sees a toolbar with formatting options and is able to bold all the words he deems important. He submits his comment and waits to see what happens next.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#toolbar)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/toolbar/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/toolbar/toolbar.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/toolbar/toolbar.styles.ts)
