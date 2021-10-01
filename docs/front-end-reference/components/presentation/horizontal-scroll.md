# horizontal-scroll

An implementation of a content scroller as a web-component.

## Setup

```ts
import { provideDesignSystem, alphaHorizontalScroll, getFlipper } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaHorizontalScroll(), getFlipper());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaButton, getCard, getFlipper, getHorizontalScroll } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaButton(), getCard(), getFlipper(), getHorizontalScroll());

export const usageStory = () => html`
  <style>
    fs-horizontal-scroll {
      max-width: 400px;
    }

    fs-card {
      padding: 10px;
      width: 170px;
    }
  </style>
  <alpha-horizontal-scroll>
    <alpha-card>
      Card number 1
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 2
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 3
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 4
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 5
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 6
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 7
      <alpha-button>A button</alpha-button>
    </alpha-card>
    <alpha-card>
      Card number 8
      <alpha-button>A button</alpha-button>
    </alpha-card>
  </alpha-horizontal-scroll>
`;
```

## Additional resources

- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/horizontal-scroll/README.md)
