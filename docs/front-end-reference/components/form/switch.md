---
id: switch
title: Switch
sidebar_position: 120
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component.

## Setup

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