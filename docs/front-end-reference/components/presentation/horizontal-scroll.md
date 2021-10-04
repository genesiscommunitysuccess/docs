---
id: horizontal-scroll
title: Horizontall Scroll
sidebar_position: 90
---

An implementation of a content scroller as a web-component.

## Setup

```ts
import { provideDesignSystem, alphaHorizontalScroll, alphaFlipper } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaHorizontalScroll(), alphaFlipper());
```

## Usage

```html
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
```
