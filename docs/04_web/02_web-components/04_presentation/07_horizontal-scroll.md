---
title: 'Web Components - Horizontal scroll'
sidebar_label: 'Horizontal scroll'
id: horizontal-scroll
keywords: [web, web components, horizontal scroll]
tags:
    - web
    - web components
    - horizontal scroll
---

An implementation of a content scroller as a Web Component.

## Set-up

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
