---
title: 'Progress'
sidebar_label: 'Progress'
id: progress
---

The `Progress` and [`Progress Ring`](/web/web-components/presentation/progress-ring/) components are used to display

- the length of time a process will take
- a visualized percentage value (referred to as a **determinate** state), 
- a visual representation of an unspecified wait time (referred to as an **indeterminate** state)

`Progress` components are typically visually represented by a circular or linear animation. When the `value` attribute is passed, the state is **determinate**; otherwise, it is **indeterminate**.

- For `progress` components that have a linear visual appearance, use `alpha-progress`. 
- For `progress` implementations that are circular, use [`alpha-progress-ring`](/web/web-components/presentation/progress-ring/).

## Set-up

```ts
import { provideDesignSystem, alphaProgress } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaProgress());
```

## Usage

```html live
<alpha-progress min="0" max="100" value="75"></alpha-progress>
```

## Use cases

- Percentage completion indicators

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#progressbar)
