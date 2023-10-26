---
title: 'Web Components - Segmented Control'
sidebar_label: 'Segmented Control'
id: segmented-control
keywords: [web, web components, segmented control]
tags:
    - web
    - web components
    - segmented control
---

A segmented control is a set of checkable buttons. No more than one button can be checked at a time. When a user checks an unchecked button, the previously checked button is automatically unchecked.

It is possible to initialise the set with all buttons in the unchecked state. This forces the user to check one of the buttons before moving past a certain point in the workflow.

## Set-up

```ts
import { provideDesignSystem, alphaSegmentedControl, alphaSegmentedItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSegmentedControl(), alphaSegmentedItem());
```

## Usage

```html live
<alpha-segmented-control>
  <alpha-segmented-item>Item 1</alpha-segmented-item>
  <alpha-segmented-item>Item 2</alpha-segmented-item>
  <alpha-segmented-item>Item 3</alpha-segmented-item>
</alpha-segmented-control>
```

## Use cases

* Used anywhere someone may want to visually and structurally group related interactive controls.
