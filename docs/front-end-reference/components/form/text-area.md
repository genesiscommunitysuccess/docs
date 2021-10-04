---
id: text-area
title: Textarea
sidebar_position: 130
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `alpha-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import { provideDesignSystem, alphaTextArea } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextArea());
```

## Usage

```html live
<alpha-text-area placeholder="Describe your experience">How was your stay?</alpha-text-area>
```

## Use cases

* Used anywhere `<textarea></textarea>` could be used

