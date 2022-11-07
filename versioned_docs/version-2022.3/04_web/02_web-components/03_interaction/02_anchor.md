---
title: 'Web Components - Anchor'
sidebar_label: 'Anchor'
id: anchor
keywords: [web, web components, anchor]
tags:
    - web
    - web components
    - anchor
---

An anchor is a piece of text that marks the beginning and/or the end of a hypertext link.

`alpha-anchor` is a Web Component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). The `@genesislcap/alpha-design-system` anchor supports the same visual appearances as the button component (accent, lightweight, neutral, outline, stealth) as well as a hypertext appearance for use in line with text.

## Set-up

```ts
import { provideDesignSystem, alphaAnchor } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAnchor());
```

## Usage

```html live
<alpha-anchor href="https://genesis.global/" appearance="hypertext">Genesis</alpha-anchor>
```
