---
id: typography
title: Typography Tokens
sidebar_position: 20
sidebar_label: Typography
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can adjust any of the defaults in the `src/_config` folder of your design system.

## Body font

The base typeface for most of the components. You can modify the default as needed.

```ts
export const bodyFontValue = '"Segoe UI", Arial, Helvetica, sans-serif';
```

### Usage in your code

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
font-family: var(--body-font);
```

</TabItem>
<TabItem value="token">

```ts
import {bodyFont} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    font-family: ${bodyFont};
}`;
```

</TabItem>
</Tabs>

## Font sizes and line heights

Group of variables describing the font size and line-height hierarchy.

```ts
export const typeRampBaseFontSizeValue = '14px';
export const typeRampBaseLineHeightValue = '20px';
// ... remaining variables
```

### Usage in your code

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
font-size: var(--type-ramp-minus-1-font-size);
line-height: var(--type-ramp-minus-1-line-height);
```

</TabItem>
<TabItem value="token">

```ts
import {typeRampMinus1FontSize, typeRampMinus1LineHeight} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    font-size: ${typeRampMinus1FontSize};
    line-height: ${typeRampMinus1LineHeight};
}`;
```

</TabItem>
</Tabs>

<typography-tokens></typography-tokens>
