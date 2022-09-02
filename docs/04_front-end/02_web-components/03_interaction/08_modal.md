---
title: 'Modal'
sidebar_label: 'Modal'
id: modal
---

A modal component will prevent the user from interacting with other content on the page. An alternative is the [dialog](/front-end/web-components/interaction/dialog/) component.

As defined by the [W3C](https://w3c.github.io/aria-practices/#dialog_modal):

> A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.
>
> Like non-modal dialogs, modal dialogs contain their tab sequence. That is, Tab and Shift + Tab do not move focus outside the dialog. However, unlike most non-modal dialogs, modal dialogs do not provide means for moving keyboard focus outside the dialog window without closing the dialog.

## Set-up

```ts
import { provideDesignSystem, alphaModal } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaModal());
```

## Usage

```html
<alpha-card id="alpha-modal">
  <alpha-button id="js-alpha-show-modal" appearance="accent">Show Rapid Modal</alpha-button>
  <alpha-modal>
    <h5 slot="top">Modal title</h5>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit/</p> Lorem ipsum found here
    <alpha-button slot="bottom" id="js-alpha-close-modal">Close this modal</alpha-button>
  </alpha-modal>
</alpha-card>
```

## Use cases

* Confirmation popups

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#dialog_modal)