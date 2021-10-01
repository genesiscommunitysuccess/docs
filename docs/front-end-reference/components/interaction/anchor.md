
# anchor

As defined by the W3C:

> An anchor is a piece of text which marks the beginning and/or the end of a hypertext link.

`alpha-anchor` is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). The `@genesislcap/alpha-design-system` anchor supports the same visual appearances as the button component (accent, lightweight, neutral, outline, stealth) as well as a hypertext appearance for use inline with text.

## Setup

```ts
import { provideDesignSystem, alphaAnchor } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAnchor());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaAnchor } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAnchor());

export const usageStory = () => html` <alpha-anchor href="https://fast.design" appearance="hypertext">FAST</alpha-anchor> `;
```

## Additional resources

- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/anchor/README.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/anchor/anchor.styles.ts)
