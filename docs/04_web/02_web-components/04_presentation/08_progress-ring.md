---
title: 'Progress ring'
sidebar_label: 'Progress ring'
id: progress-ring
---

The [`Progress`](/web/web-components/presentation/progress/) and `Progress Ring` components are used to display one of the following:

- the length of time a process will take
- a visual percentage value (referred to as a **determinate** state)
- a visual representation of an unspecified wait time (referred to as an **indeterminate** state)

`Progress` components are typically visually represented by a circular or linear animation. When the `value` attribute is passed, the state is **determinate**; otherwise, it is **indeterminate**.

- For `progress` components that have a linear visual appearance, use [`alpha-progress`](/web/web-components/presentation/progress/). 
- For `progress` implementations that are circular, use `alpha-progress-ring`.

## Set-up

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
