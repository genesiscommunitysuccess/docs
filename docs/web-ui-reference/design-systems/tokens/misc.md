---
id: misc
title: Miscellaneous tokens
sidebar_label: Miscellaneous
sidebar_position: 40
---

Contains a number of tokens which are hard to classify.

## Configuration

You can adjust any of the defaults in the `src/_config` folder of your design system.

### Usage

### Prefix

```ts
export const prefix = 'alpha';
```

Custom Web components (as opposed to standard HTML components like `<h1>` or `<div>`) require a hyphen character (`-`) included in the name e.g. `<alpha-button>`. Part of the name before the hyphen is called prefix and can be customised e.g.:

```ts
export const prefix = 'custom';
```

You will then be able to use your component in HTML as `<custom-button>`.


## direction

The primary document direction (LTR or RTL). Please refer to [the official documentation about this token and `DirectionalStyleSheetBehavior`](https://www.fast.design/docs/design/localization#document-direction) to read more details.

Many CSS layout properties like [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) automatically handle reflow depending on the [document's primary direction](https://www.w3.org/International/questions/qa-html-dir). There are also CSS [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts) that can be used as well to apply localized margins, paddings, borders and positioning. Unfortunately, browser support for these properties is limited and there are still styling cases not covered by these properties (directional glyphs, transforms, etc). That is why FAST provides several mechanisms to apply direction-based styles.

### `direction` DesignToken 
`@microsoft/fast-components ` export `direction` (a design token) that can be used to configure the primary direction of the document.

### DirectionalStyleSheetBehavior
`DirectionalStyleSheetBehavior` can be used to apply arbitrary LTR and RTL stylesheets, depending on the nearest `FASTDesignSystemProvider`s direction property.

**Example: Using `DirectionalStyleSheetBehavior`**
```ts
import { css } from "@microsoft/fast-element";
import { DirectionalStyleSheetBehavior } from "@microsoft/fast-foundation";

const ltr = css`
    :host {
        left: 20px;
    }
`;

const rtl = css`
    :host {
        right: 20px;
    }
`;

const styles = css`
    .host {
        position: relative
    }
`.withBehaviors(new DirectionalStyleSheetBehavior(ltr, rtl))
```




### Usage

```js preview-story
import { direction } from '@genesislcap/alpha-design-system';
import { Direction } from '@microsoft/fast-web-utilities';

class DirectionUsage extends FASTElement {
  static definition = {
    name: 'direction-usage',
    styles: css`
      p {
        direction: ${direction};
      }
    `,
    template: html`
      <button @click=${(x) => x.switch()}>Click to switch the text direction</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>
    `,
  };

  switch() {
    const currentDirection = direction.getValueFor(this);
    const newDirection = currentDirection === Direction.ltr ? Direction.rtl : Direction.ltr;
    direction.setValueFor(this, newDirection);
  }
}

FASTElement.define(DirectionUsage);

export const directionUsageStory = () => html`<direction-usage></direction-usage>`;
```

## disabledOpacity

The opacity of disabled controls.

### Usage

```js preview-story
import { disabledOpacity } from '@genesislcap/alpha-design-system';

class DisabledOpacityUsage extends FASTElement {
  static definition = {
    name: 'disabled-opacity-usage',
    styles: css`
      :host([disabled]) {
        cursor: not-allowed;
        opacity: ${disabledOpacity};
        user-select: none;
      }
    `,
    template: html`Can't touch this.`,
  };
}

FASTElement.define(DisabledOpacityUsage);

export const disabledOpacityUsageStory = () => html`<disabled-opacity-usage disabled></disabled-opacity-usage>`;
```

## strokeWidth

Controls the width of the stroke of a component that has a stroke.

### Usage

```js preview-story
import { strokeWidth } from '@genesislcap/alpha-design-system';

class StrokeWidthUsage extends FASTElement {
  static definition = {
    name: 'stroke-width-usage',
    styles: css`
      :host {
        border: calc(${strokeWidth} * 1px) solid black;
        padding: 5px;
      }
    `,
    template: html`11:59`,
  };
}

FASTElement.define(StrokeWidthUsage);

export const strokeWidthUsageStory = () => html`<stroke-width-usage></stroke-width-usage>`;
```

## focusStrokeWidth

Controls the width of the stroke of a component that has a stroke when it has document focus.

### Usage

```js preview-story
import { focusStrokeWidth } from '@genesislcap/alpha-design-system';

class FocusStrokeWidthUsage extends FASTElement {
  static definition = {
    name: 'focus-stroke-width-usage',
    styles: css`
      button:focus {
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) darkgrey;
        outline: 0;
      }
    `,
    template: html`<button>Focus me</button>`,
  };
}

FASTElement.define(FocusStrokeWidthUsage);

export const focusStrokeWidthUsageStory = () => html`<focus-stroke-width-usage></focus-stroke-width-usage>`;
```


#### Misc.

- `direction`: The primary document direction (LTR or RTL).
- `disabledOpacity`: The opacity of disabled controls.
- `strokeWidth`: Controls the width of the stroke of a component that has a stroke.
- `focusStrokeWidth`: Controls with width of the stroke of a component that has a stroke when it has document focus.