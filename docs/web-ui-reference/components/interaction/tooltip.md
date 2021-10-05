---
id: tooltip
title: Tooltip
sidebar_position: 90
---

<div class="tooltip-examples">

The `alpha-tooltip` component is used provide extra information about another element when it is hovered.

## Setup

```ts
import { provideDesignSystem, alphaTooltip } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTooltip());
```

## Usage

```html live
<div>
  <alpha-button id="anchor">Hover me</alpha-button>
  <alpha-tooltip anchor="anchor">Tooltip text</alpha-tooltip>
</div>
```

## Use cases

Tooltips are often used to supplement UI elements and provide additional information. Tooltips will often provide accessible names or add additional context to other UI components (such as icon buttons). While tooltips are natively provided to elements via the title attribute, they are notoriously difficult to style. Additionally, they are only invoked on hover and not on focus.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tooltip)

</div>