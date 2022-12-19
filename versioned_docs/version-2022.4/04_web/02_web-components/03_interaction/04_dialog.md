---
title: 'Web Components - Dialog'
sidebar_label: 'Dialog'
id: dialog
keywords: [web, web components, dialog]
tags:
    - web
    - web components
    - dialog
---

A dialog component presents content to the user. Unlike [modal](../../../../web/web-components/interaction/modal/) it doesn't prevent the user from interacting with other content on the page.

## Set-up

```ts
import { provideDesignSystem, alphaDialog } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaDialog());
```

## Usage

```html
<alpha-card id="alpha-dialog">
  <h6>Dialog</h6>
  <alpha-button id="js-alpha-show-dialog">Show Dialog</alpha-button>

  <alpha-dialog>
    <h5 slot="top">Dialog title</h5>
    <p>Some text</p>
    <alpha-button slot="bottom" id="js-alpha-close-dialog">Close dialog</alpha-button>
  </alpha-dialog>
</alpha-card>
```

## Use cases

* Confirmation popups

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#dialog_modal)