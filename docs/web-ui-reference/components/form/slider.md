---
id: slider
title: Slider
sidebar_position: 110
---

An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected web-component. 

## Setup

```ts
import { provideDesignSystem, alphaSlider, alphaSliderLabel } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSlider(), alphaSliderLabel());
```

## Usage

```html live
<alpha-slider min="0" max="100" step="10" value="70">
  <alpha-slider-label position="0"> 0 </alpha-slider-label>
  <alpha-slider-label position="10"> 10 </alpha-slider-label>
  <alpha-slider-label position="90"> 90 </alpha-slider-label>
  <alpha-slider-label position="100"> 100 </alpha-slider-label>
</alpha-slider>
```

## Use cases

* Adjusting the value by dragging the slider in step increments within the constraints of min/max values.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)