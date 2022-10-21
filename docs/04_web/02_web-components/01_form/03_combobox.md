---
title: 'Web Components - Combobox'
sidebar_label: 'Combobox'
id: combobox
keywords: [web, web components, combobox]
tags:
    - web
    - web components
    - combobox
---
<div class="combobox-examples">

A combobox is an input with an associated pop-up that enables users to select a value from a collection of possible values (auto-complete).

## Set-up

```ts
import { provideDesignSystem, alphaCombobox, alphaOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCombobox(), alphaOption());
```

## Usage

```html live
<alpha-combobox autocomplete="both">
  <alpha-option>Christopher Eccleston</alpha-option>
  <alpha-option>David Tennant</alpha-option>
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