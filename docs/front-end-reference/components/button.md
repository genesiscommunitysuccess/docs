---
id: button
sidebar_label: Button
sidebar_position: 20
title: Button
tags:
  - components
  - frontend
  - ui
  - button
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#button):

> A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.

`zero-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The `@genesislcap/foundation-zero` button supports several visual appearances (accent, lightweight, neutral, outline, stealth).

## Setup

```typescript
import {provideZeroDesignSystem, zeroButton} from '@genesislcap/foundation-zero';

provideZeroDesignSystem()
    .register(
        zeroButton()
    );
```

## Usage

```html
<zero-button>Hello World</zero-button>
```

## Use cases

- Creating simple button or link elements

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/button.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/button/button.styles.ts)
