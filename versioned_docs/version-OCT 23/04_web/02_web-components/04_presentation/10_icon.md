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

The `icon` icon component enables you to display the chosen icon in three available variants, which are:

- solid
- regular
- brand 

The default variant is solid. You also have to choose the name and size of the icon.

:::info
Available icon names from the listed variants can be found here: 
- [solid/regular](https://fontawesome.com/search?o=r&m=free)
- [brand](https://fontawesome.com/search?o=r&m=free&f=brands)
:::

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
