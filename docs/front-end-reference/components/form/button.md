---
id: button
title: Button
sidebar_position: 10
---


Button component allows users to perform actions. It comes in several different style variants, and supports icons in addition to text labels.

<alpha-button>Button</alpha-button>

## Apperance 

The following variants can be used to distinguish between actions of different importance in the UI:

<alpha-button appearance="neutral">neutral</alpha-button>
<alpha-button appearance="accent">accent</alpha-button>
<alpha-button appearance="outline">outline</alpha-button>
<alpha-button appearance="lightweight">lightweight</alpha-button>
<alpha-button appearance="stealth">stealth</alpha-button>

## Other

<alpha-button appearance="primary-purple">Primary Purple Button</alpha-button>
<alpha-button appearance="primary-gradient">Primary Gradient Button</alpha-button>
<alpha-button appearance="primary-blue">Primary Blue Button</alpha-button>

## Disabled

Buttons representing actions that are not currently available to the user should be either hidden or disabled.
A disabled button is rendered as "dimmed", and is excluded from the focus order (such as when interactive UI elements are focused using the tab key).

<alpha-button appearance="neutral" disabled>neutral</alpha-button>
<alpha-button appearance="accent" disabled>accent</alpha-button>
<alpha-button appearance="outline" disabled>outline</alpha-button>
<alpha-button appearance="lightweight" disabled>lightweight</alpha-button>
<alpha-button appearance="stealth" disabled>stealth</alpha-button>



As defined by the [W3C](https://w3c.github.io/aria-practices/#button):

> A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.

`alpha-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The `@genesislcap/alpha-design-system` button supports several visual appearances (accent, lightweight, neutral, outline, stealth).

## Setup

```ts
import { provideDesignSystem, alphaButton } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaButton());
```

## Use cases

- Creating simple button or link elements

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/button.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/button/button.styles.ts)
