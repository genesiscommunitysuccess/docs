---
title: 'Web Components - Checkbox'
sidebar_label: 'Checkbox'
id: checkbox
keywords: [web, web components, checkbox]
tags:
    - web
    - web components
    - checkbox
---

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected Web Component.

## Set-up

```ts
import { provideDesignSystem, alphaCheckbox } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCheckbox());
```

## Usage

```html live
<fieldset>
  <legend>Fruits</legend>
  <alpha-checkbox checked>Apple</alpha-checkbox>
  <alpha-checkbox checked>Banana</alpha-checkbox>
  <alpha-checkbox>Honeydew</alpha-checkbox>
  <alpha-checkbox checked>Mango</alpha-checkbox>
</fieldset>
```

## Use cases

* Used anywhere `input[type="checkbox"]` could be used

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#checkbox)