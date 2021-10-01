# progress

<alpha-progress></alpha-progress>

_Progress_ and _progress ring_ are used to display the length of time a process will take or to visualize percentage value (referred to as a **determinate** state) and to represent an unspecified wait time (referred to as an **indeterminate** state). _Progress_ components are typically visually represented by a circular or linear animation. When the `value` attribute is passed the state is **determinate**, otherwise it is **indeterminate**.

For progress components which have a linear visual appearance, use `alpha-progress`. For progress implementations which are circular, use [`alpha-progress-ring`](/front-end-reference/components/presentation/progress-ring/).

## Setup

```ts
import { provideDesignSystem, alphaProgress } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaProgress());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaProgress } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaProgress());

export const usageStory = () => html` <alpha-progress min="0" max="100" value="75"></alpha-progress> `;
```

## Use cases

- Susan is downloading a large collection of music onto her hard-drive. She sees a linear progress displaying the percentage complete for the currently downloading song and indeterminate linear progress for those songs in queue.

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#progressbar)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/progress/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/progress/progress.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/progress/progress.styles.ts)
