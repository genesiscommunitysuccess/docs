---
title: 'Miscellaneous'
sidebar_label: 'Miscellaneous'
id: miscellaneous
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Contains a number of tokens and options which are hard to classify. You can adjust any of the defaults in the `src/_config/values` folder of your design system.

* `prefix`: Web component name prefix
* `direction`: The primary document direction (LTR or RTL)
* `disabledOpacity`: The opacity of disabled controls
* `strokeWidth`: Controls the width of the stroke of a component that has a stroke
* `focusStrokeWidth`: Controls with width of the stroke of a component that has a stroke when it has document focus

### prefix

```ts
export const prefix = 'alpha';
```

Custom Web components (as opposed to standard HTML components like `<h1>` or `<div>`) require a hyphen character (`-`) included in the name e.g. `<alpha-button>`. Part of the name before the hyphen is called prefix and can be customised e.g.:

```ts
export const prefix = 'custom';
```

You will then be able to use your component in HTML as `<custom-button>`.

### direction

The primary document direction (LTR or RTL). Many CSS layout properties like [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) automatically handle reflow depending on the [document's primary direction](https://www.w3.org/International/questions/qa-html-dir). There are also CSS [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts) that can be used as well to apply localized margins, paddings, borders and positioning. Unfortunately, browser support for these properties is limited and there are still styling cases not covered by these properties (directional glyphs, transforms, etc). That is why FAST provides several mechanisms to apply direction-based styles.

#### Usage

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
direction: var(--direction);
```

</TabItem>
<TabItem value="token">

```ts
import {direction} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    direction: ${direction};
}`;
```

</TabItem>
</Tabs>

### disabledOpacity

The opacity of disabled controls.

#### Usage

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
opacity: --disabled-opacity;
```

</TabItem>
<TabItem value="token">

```ts
import {disabledOpacity} from '@genesislcap/alpha-design-system';

const styles = css`
  :host([disabled]) {
    opacity: ${disabledOpacity};
}`;
```

</TabItem>
</Tabs>


### strokeWidth

Controls the width of the stroke of a component that has a stroke.

#### Usage

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
border: calc(var(--stroke-width)} * 1px) solid #000;
```

</TabItem>
<TabItem value="token">

```ts
import {strokeWidth} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    border: calc(${strokeWidth} * 1px) solid #000;
}`;
```

</TabItem>
</Tabs>

### focusStrokeWidth

Controls the width of the stroke of a component that has a stroke when it has document focus.

#### Usage

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) #333;
```

</TabItem>
<TabItem value="token">

```ts
import {focusStrokeWidth} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) #333;
}`;
```

</TabItem>
</Tabs>