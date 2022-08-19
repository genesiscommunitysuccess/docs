---
title: 'Badge'
sidebar_label: 'Badge'
id: badge
---

The `badge` component is used to highlight an item or flag its status.

## Set-up

```ts
import { provideDesignSystem, alphaBadge } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaBadge());
```

## Usage

```html live
<alpha-badge fill="primary" color="primary" class="badge">Badge</alpha-badge>
```

The `fill` and `color` attributes of the _badge_ create CSS custom properties, which can be used to style the control.

```css
alpha-badge {
  --badge-fill-primary: #00ff00;
  --badge-fill-danger: #ff0000;
  --badge-color-light: #ffffff;
  --badge-color-dark: #000000;
}
```

## Use cases

* Flagging an item as part of a category
* Representing a value of unread messages

