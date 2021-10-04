---
id: number-field
title: NumberField
sidebar_position: 50
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `alpha-number-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import { provideDesignSystem, alphaNumberField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaNumberField());
```

## Usage

```html live
<alpha-number-field appearance="filled" min="0" max="10"></alpha-number-field>
```

## Use cases

* Anywhere where `input[type="number"]` could be used


