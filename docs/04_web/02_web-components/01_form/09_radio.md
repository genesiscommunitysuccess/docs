---
title: "Web Components - Radio"
sidebar_label: "Radio"
id: radio
keywords: [web, web components, radio]
tags:
  - web
  - web components
  - radio
---

A selection input with support for selection of multiple options.

## Set-up

```ts
import {
  provideDesignSystem,
  alphaRadio,
} from "@genesislcap/alpha-design-system";

provideDesignSystem().register(alphaRadio());
```

## Usage

```html live
<div>
  <alpha-radio alpha-radio value="apple">Apple</alpha-radio>
  <alpha-radio alpha-radio value="mango">Mango</alpha-radio>
  <alpha-radio alpha-radio value="orange">Orange</alpha-radio>
</div>
```

## Use cases

Selecting multiple options in the same input: You could have a set of broker codes, for example, and the user could select one or more of those codes.
