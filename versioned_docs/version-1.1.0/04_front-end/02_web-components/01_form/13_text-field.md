---
title: 'Text field'
sidebar_label: 'Text field'
id: text-field
---
An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected Web Component. The `alpha-text-field` supports two visual appearances: outline and filled, with the control defaulting to the outline appearance.

This component filters out slotted _text_ nodes that are only white space to hide the label when it is not in use.

## Set-up

```ts
import { provideDesignSystem, alphaTextField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextField());
```

## Usage

```html live
<alpha-text-field>Name</alpha-text-field>
```

## Use cases

Used anywhere an author might otherwise use:

- input\[type="text"]
- input\[type="email"]
- input\[type="password"]
- input\[type="tel"]
- input\[type="url"]
