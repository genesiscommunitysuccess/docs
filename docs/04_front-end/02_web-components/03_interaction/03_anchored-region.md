---
title: 'Anchored region'
sidebar_label: 'Anchored region'
id: anchored-region
---

An _anchored region_ is a container component that enables you to create layouts where the contents of the anchored region can be positioned relative to another "anchor" element. Additionally, the _anchored region_ can react to the available space between the anchor and a parent ["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most available space, or even resize itself based on that space.

## Set-up

```ts
import { provideDesignSystem, alphaAnchoredRegion } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAnchoredRegion());
```

## Usage

A region that always renders above the anchor element.

```html live
<div id="viewport">
  <alpha-button id="anchor">Button is an anchor</alpha-button>
  <alpha-anchored-region anchor="anchor" vertical-positioning-mode="locktodefault" vertical-default-position="top">
    This shows up above the button
  </alpha-anchored-region>
</div>
```

## Use cases

* Building block for components that need to position elements relative to another HTML Element (e.g. select, flyout, tooltip)
* Used on its own in responsive layouts

