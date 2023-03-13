---
title: 'Web Components - Toolbar'
sidebar_label: 'Toolbar'
id: toolbar
keywords: [web, web components, toolbar]
tags:
    - web
    - web components
    - toolbar
---

<div class="toolbar-examples">

As defined by the [W3C](https://w3c.github.io/aria-practices/#toolbar):

> A toolbar is a container for grouping a set of controls, such as buttons, menubuttons, or checkboxes.
>
> When a set of controls is visually presented as a group, the toolbar role can be used to communicate the presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be an effective way of reducing the number of tab stops in the keyboard interface.

## Set-up

```ts
import { provideDesignSystem, alphaToolbar } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaToolbar());
```

## Usage

```html live
<alpha-toolbar>
  <alpha-button>Button</alpha-button>
  <alpha-select>
    <alpha-option>Option 1</alpha-option>
    <alpha-option>Second option</alpha-option>
    <alpha-option>Option 3</alpha-option>
  </alpha-select>
  <alpha-radio-group>
    <alpha-radio checked="">One</alpha-radio>
    <alpha-radio>Two</alpha-radio>
    <alpha-radio>Three</alpha-radio>
  </alpha-radio-group>
</alpha-toolbar>
```

## Use cases

* Used anywhere someone may want to visually and structurally group related interactive controls.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#toolbar)

</div>