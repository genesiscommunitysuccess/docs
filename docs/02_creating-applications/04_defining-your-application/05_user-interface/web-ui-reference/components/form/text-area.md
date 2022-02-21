---
id: text-area
title: Text area
sidebar_position: 130
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected Web Component. The `alpha-text-area` supports two visual appearances: outline and filled, with the control defaulting to the outline appearance.

## Set-up

```ts
import { provideDesignSystem, alphaTextArea } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextArea());
```

## Usage

```html live
<alpha-text-area placeholder="Your feedback">Free-text comment form</alpha-text-area>
```

## Use cases

* Used anywhere `<textarea></textarea>` could be used

