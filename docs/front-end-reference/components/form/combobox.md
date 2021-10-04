---
id: combobox
title: Combobox
sidebar_position: 30
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#combobox):

> A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value. The popup may be a listbox, grid, tree, or dialog. Many implementations also include a third optional element -- a graphical Open button adjacent to the combobox, which indicates availability of the popup. Activating the Open button displays the popup if suggestions are available.

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
