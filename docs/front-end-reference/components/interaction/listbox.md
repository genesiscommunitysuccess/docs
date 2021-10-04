---
id: listbox
title: Listbox
sidebar_position: 55
---

An implementation of a [listbox](https://w3c.github.io/aria-practices/#Listbox). While any DOM content is permissible as a child of the listbox, only [`alpha-option`](/front-end-reference/components/form/option/) elements, `option` elements, and slotted items with `role="option"` will be treated as options and receive keyboard support.

The `listbox` component has no internals related to form association. For a form-associated `listbox`, see the [`alpha-select` component](/front-end-reference/components/form/select/).

## Setup

```ts
import { provideDesignSystem, alphaListbox, alphaOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaListbox(), alphaOption());
```

## Usage

```html live
<div>
  <label id="preferred-format">Preferred Format:</label><br />
  <alpha-listbox aria-labelledby="preferred-format" name="preferred-format">
    <alpha-option value="vinyl">Vinyl Record</alpha-option>
    <alpha-option value="casette">Casette</alpha-option>
    <alpha-option value="cd">Compact Disc</alpha-option>
    <alpha-option value="digital">Digital</alpha-option>
  </alpha-listbox>
</div>
```

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#Listbox)