---
id: radio
title: Radio
sidebar_position: 90
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Setup

```ts
import { provideDesignSystem, alphaRadio } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadio());
```

## Usage

```html live
<alpha-radio value="apple">Apple</alpha-radio>
```

For a radio group example, see the [`alpha-radio-group` documentation](/front-end-reference/components/form/radio-group/).

## Use cases

* Used anywhere `input[type="radio"]` could be used. Used to facilitate choice where only one choice is acceptable.

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radio)

