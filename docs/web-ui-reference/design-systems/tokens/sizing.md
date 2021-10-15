---
id: sizing
title: Sizing tokens
sidebar_label: Sizing
sidebar_position: 30
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can adjust any of the defaults in the `src/_config` folder of your design system.

- `baseHeightMultiplier`: This value, multiplied by `designUnit`, sets the base height of most controls. Works with adaptive `density` values.
- `baseHorizontalSpacingMultiplier`: This value, multiplied by `designUnit`, sets the internal horizontal padding of most controls. Works with adaptive `density` values.
- `controlCornerRadius`: Sets the corner radius used by controls with backgrounds.
- `density`: An adjustment to sizing tokens `baseHeightMultiplier` and `baseHorizontalSpacingMultiplier`.
- `designUnit`: The unit size of the design grid. Used to calculate height and spacing sizes for controls.

## Usage

<Tabs
  defaultValue="css"
  values={[
    { label: 'CSS', value: 'css', },
    { label: 'JavaScript', value: 'token', }
  ]
}>
<TabItem value="css">

```css
border-radius: var(--control-corner-radius);
```

</TabItem>
<TabItem value="token">

```ts
import {controlCornerRadius} from '@genesislcap/alpha-design-system';

const styles = css`
  :host {
    border-radius: ${controlCornerRadius};
}`;
```

</TabItem>
</Tabs>

