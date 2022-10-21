---
title: 'Web Components - Select'
sidebar_label: 'Select'
id: select
keywords: [web, web components, select]
tags:
    - web
    - web components
    - select
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

## Use cases

- selecting from a list of options

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

</div>