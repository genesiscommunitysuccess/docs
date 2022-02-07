---
id: flipper
title: Flipper
sidebar_position: 50
---

The flipper component is most often used to page through blocks of content or collections of UI elements. As flippers are often a supplemental form of navigation, the flippers are hidden by default to avoid duplicate keyboard interaction. Passing an attribute of `aria-hidden="false"` will expose the flippers to assistive technology.

## Set-up

```ts
import { provideDesignSystem, alphaFlipper } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaFlipper());
```

## Usage

```html live
<alpha-flipper direction="previous"></alpha-flipper>
```

```html live
<alpha-flipper direction="next"></alpha-flipper>
```

## Use cases

* List navigation