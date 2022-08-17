---
title: 'Switch'
sidebar_label: 'Switch'
id: switch
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected Web Component.

## Set-up

```ts
import { provideDesignSystem, alphaSwitch } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSwitch());
```

## Usage

```html live
<alpha-switch>
  Theme
  <span slot="checked-message">Dark</span>
  <span slot="unchecked-message">Light</span>
</alpha-switch>
```

## Use cases

* Toggling visibility of a UI section
* Disaling & enabling features

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#switch)