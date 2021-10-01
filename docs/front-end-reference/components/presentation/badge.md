# badge

The `alpha-badge` component is used to highlight an item and attract attention or flag status.

## Setup

```ts
import { provideDesignSystem, alphaBadge } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaBadge());
```

## Usage

The `fill` and `color` attributes of the _badge_ create CSS custom properties which can be used to style the control.

```css
fs-badge {
  --badge-fill-primary: #00ff00;
  --badge-fill-danger: #ff0000;
  --badge-color-light: #ffffff;
  --badge-color-dark: #000000;
}
```

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaBadge } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaBadge());

export const usageStory = () => html` <alpha-badge fill="danger" color="dark">Danger</alpha-badge> `;
```

In addition to the color map support detailed above, the `alpha-badge` from the Microsoft component implementation (`@fluentui/web-components`) includes an attribute to set default appearances which ensure WCAG 2.1 AA contrast requirements.

## Use cases

Typical use cases include, but are not limited to, denoting a sale or new item, flagging an item as part of a category or representing a value of unread messages.

## Additional resources

- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/badge/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/badge/badge.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/badge/badge.styles.ts)
