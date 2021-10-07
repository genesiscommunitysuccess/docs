---
id: skeleton
title: Skeleton
sidebar_position: 120
---

The `skeleton` component is used as a visual placeholder for an element while it is in a loading state and usually presents itself as a simplified wireframe-like version of the UI it is representing.

## Setup

```ts
import { provideDesignSystem, alphaSkeleton } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSkeleton());
```

## Usage

### Basic Usage

```html live
<alpha-skeleton shape="circle"></alpha-skeleton>
```

### Pattern

A URL for an image asset may be passed to the `pattern` attribute. In this mode, the `alpha-skeleton` component is used as a container for a transparent SVG that may express a more complex placeholder

```html live
<alpha-skeleton shape="rect" pattern="/svg/skeleton-test-pattern.svg"></alpha-skeleton>
```

### Shimmer

The `shimmer` boolean attribute will activate the component's shimmer effect.

```html live
<alpha-skeleton
  shape="rect"
  pattern="/svg/skeleton-test-pattern.svg"
  shimmer
></alpha-skeleton>
```

### Custom SVG

An inline SVG can also be inserted into the slot of the `alpha-skeleton`.

```html live
<alpha-skeleton
  shape="rect"
  shimmer
>
  <svg id="pattern" width="100%" height="100%">
    <defs>
      <mask id="mask" x="0" y="0" width="100%" height="100%">
        <rect x="0" y="0" width="100%" height="100%" fill="#ffffff"></rect>
        <rect x="0" y="0" width="100%" height="45%" rx="4"></rect>
        <rect x="25" y="55%" width="90%" height="15px" rx="4"></rect>
        <rect x="25" y="65%" width="70%" height="15px" rx="4"></rect>
        <rect x="25" y="80%" width="90px" height="30px" rx="4"></rect>
      </mask>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" mask="url(#mask)" fill="#ffffff"></rect>
  </svg>
</alpha-skeleton>
```

### Further Customizations

The following CSS variables can be used to customize the appearance.

| CSS Variable                    | Expected value  |
| ------------------------------- | --------------- |
| `--skeleton-fill`               | Color           |
| `--skeleton-animation-fill`     | Color           |
| `--skeleton-animation-gradient` | Linear gradient |
| `--skeleton-animation-timing`   | Easing function |

## Use cases

* Indicating loading state