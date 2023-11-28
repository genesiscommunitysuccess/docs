---
title: 'Web Components - Icon'
sidebar_label: 'Icon'
id: icon
keywords: [web, web components, icon]
tags:
    - web
    - web components
    - icon
---

`foundation-icon` extends `foundation-element`.

The `icon` icon component enables you to display a specified icon.

You can use any free publicly-available icon from fontawesome. These are available via the links below:
- [solid/regular](https://fontawesome.com/search?o=r&m=free) icons
- [brand](https://fontawesome.com/search?o=r&m=free&f=brands) icons

To find an icon name,

1. Go to the relevant link and search for a relevant word (for example, **microphone**).
2. In the list displayed, you can see the icons and their names. You can use any name that is not marked as **pro**.
3. Use that name to declare the icon; for example:

   `<alpha-icon name="microphone" variant="solid"></alpha-icon>`

## variants
You can use the `variant` setting to change the appearance of an icon:

- `solid` is the default
- `regular` usually is slightly more finely drawn
- `brand` is for brand icons only

If no `variant` is set, the default is `solid`. Some icons only work with the `solid` variant; others will only work with `regular`. If in doubt, use `solid'.

For brand icons, you must use the `brand` variant.

## size
You can use the `size` setting to control the size of the icon. Any of the following settings can be used (these are in order from smallest to largest):

'2xs'  'xs' 'sm' 'lg' 'xl' '2xl' '1x' '2x' '3x' '4x' '5x' '6x' '7x' '8x' '9x' '10x'

For example:
`<alpha-icon name="car" variant="solid" size="xl"></alpha-icon>`

## Set-up

```ts
import { provideDesignSystem, alphaIcon } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaIcon());
```

## Usage

```html live
<alpha-card>
  <alpha-icon name="house"></alpha-icon>
  <alpha-icon name="user" variant="regular"></alpha-icon>
  <alpha-icon name="github" variant="brand"></alpha-icon>
</alpha-card>
```

## Use cases

* an addition to presenting listbox-option
* cell-renderers and many others
