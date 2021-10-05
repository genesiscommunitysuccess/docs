---
id: progress-ring
title: Progress Ring
sidebar_position: 100
---

_Progress_ and _progress ring_ are used to display the length of time a process will take or to visualize percentage value (referred to as a **determinate** state) and to represent an unspecified wait time (referred to as an **indeterminate** state). _Progress_ components are typically visually represented by a circular or linear animation. When the `value` attribute is passed the state is **determinate**, otherwise it is **indeterminate**.

For progress components which have a linear visual appearance, use [`alpha-progress`](/web-ui-reference/components/presentation/progress/). For progress implementations which are circular, use `alpha-progress-ring`.

## Setup

```ts
import { provideDesignSystem, alphaProgressRing } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaProgressRing());
```

## Usage

```html live
<alpha-progress-ring min="0" max="100" value="75"></alpha-progress-ring>
```

## Use cases

- Progress indicators
- Metric visualisation

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#progressbar)
