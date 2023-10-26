---
title: 'Web Components - Radio group'
sidebar_label: 'Radio group'
id: radio-group
keywords: [web, web components, radio group]
tags:
    - web
    - web components
    - radio group
---
As defined by the [W3C](https://w3c.github.io/aria-practices/#radiobutton):

> A radio group is a set of checkable buttons known as radio buttons. No more than one button can be checked at a time. When a user checks an unchecked button, the previously checked button is automatically unchecked.

It is possible to initialise the set with all buttons in the unchecked state. This forces the user to check one of the buttons before moving past a certain point in the workflow.

While any DOM content is permissible as a child of the radio group, only `alpha-radio`s and slotted content with a role of `radio` will receive keyboard support.

## Set-up

```ts
import { provideDesignSystem, alphaRadioGroup, alphaRadio } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaRadioGroup(), alphaRadio());
```

## Usage

```html live
<alpha-radio-group value="apple" name="favorite-fruit">
  <alpha-radio value="apple">Apple</alpha-radio>
  <alpha-radio value="mango">Mango</alpha-radio>
  <alpha-radio value="orange">Orange</alpha-radio>
</alpha-radio-group>
```

## Use cases

* To provide options where only one option is allowed. You could use this for BUY or SELL, for example.

## Additional resources

[W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radiogroup)
