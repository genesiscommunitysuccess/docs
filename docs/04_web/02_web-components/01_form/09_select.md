---
title: 'Select'
sidebar_label: 'Select'
id: select
---

<div class="select-examples">

An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) as a form-connected Web Component.

## Set-up

```ts
import { provideDesignSystem, alphaSelect, alphaOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSelect(), alphaOption());
```

## Usage

```html live
<alpha-select id="shirt-size">
  <alpha-option value="s">Small</alpha-option>
  <alpha-option value="m">Medium</alpha-option>
  <alpha-option value="l">Large</alpha-option>
  <alpha-option value="xl">Extra Large</alpha-option>
</alpha-select>
```
By default, 'Select' only allows the user to select one of the options defined. When a user selects an option, it automatically removes the existing selection. 

If you want to allow the user to make multiple selections, add the keyword 'multiple' to the component.

## Use cases

- selecting from a list of options

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

</div>
