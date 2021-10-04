---
id: text-field
title: Textfield
sidebar_position: 140
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `alpha-text-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.

## Setup

```ts
import { provideDesignSystem, alphaTextField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextField());
```

## Usage

```html live
<alpha-text-field appearance="filled" placeholder="user@email.com">Email</alpha-text-field>
```

## Use cases

Used anywhere an author might otherwise use:

- input\[type="text"]
- input\[type="email"]
- input\[type="password"]
- input\[type="tel"]
- input\[type="url"]

