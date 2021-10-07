---
id: combobox
title: Combobox
sidebar_position: 30
---

<div class="combobox-examples">

A combobox is an input with an associated popup that enables users to select a value from a collection of possible values (auto-complete).

## Setup

```ts
import { provideDesignSystem, alphaCombobox, alphaOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCombobox(), alphaOption());
```

## Usage

```html live
<alpha-combobox autocomplete="both">
  <alpha-option>Christopher Eccleston</alpha-option>
  <alpha-option>David Tenant</alpha-option>
  <alpha-option>Matt Smith</alpha-option>
  <alpha-option>Peter Capaldi</alpha-option>
  <alpha-option>Jodie Whittaker</alpha-option>
</alpha-combobox>
```

## Use cases

* Auto-complete

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#combobox)

</div>