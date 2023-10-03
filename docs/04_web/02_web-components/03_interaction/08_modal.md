---
title: 'Web Components - Modal'
sidebar_label: 'Modal'
id: modal
keywords: [web, web components, modal]
tags:
  - web
  - web components
  - modal
---

A modal is a type of `dialog` that prevents the user from interacting with other content on the page. An alternative is the [dialog](../../../../web/web-components/interaction/dialog/) component.

As defined by the [W3C](https://w3c.github.io/aria-practices/#dialog_modal):

> A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern; in some implementations, attempts to interact with the inert content cause the dialog to close.
>
> Like non-modal dialogs, modal dialogs contain their tab sequence. That is, **Tab** and **Shift** + **Tab** do not move focus outside the dialog. However, unlike most non-modal dialogs, modal dialogs do not provide means for moving keyboard focus outside the dialog window without closing the dialog.

## Set-up

```ts
import { provideDesignSystem, alphaModal } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaModal());
```
## Attributes

When you declare an `<alpha-modal>`, you can use the following attribute:

| Name     | Type   | Description                                                                     |
|----------|--------|---------------------------------------------------------------------------------|
| position | string | Places the modal to be on `right`, `centre` or `left`. **Default:** `centre` |

When you declare a modal, you can provide the following attribute:

:::note
If you set `position` to be `left` or `right`, the modal will assume `height: 100%` by default. To change it, make the appropriate css modifications.
:::


## Methods

The following methods are available for the `alpha-modal` component:

| Name    | Description                  |
|---------|------------------------------|
| show()  | Shows the referred modal  |
| close() | Closes the referred modal |

By default, the `modal-component` starts closed.

## Usage

Below you see the standard declaration of the modal:

```html
<alpha-modal>
    This is a modal
</alpha-modal>
```

### Interaction

In order to interact with the modal component, you need to use the available methods. To do that, import modal from `@genesislcap/alpha-design-system`:

``` typescript
import { Modal as alphaModal } from '@genesislcap/alpha-design-system';
```
:::note
If you are using `foundation-zero`, then you need to import using `@genesislcap/foundation-zero`
:::

After that, you need to define the local variable to be referred to, in this case `localModal`:

```js {3}
export class TEMPLATE extends FASTElement {
    ...
    localModal: alphaModal;
    ...
}
```

Now that you have your local variable, you can use the directive `ref` to link your component to this variable:

```html {1,5-7}
import {... , ref} from '@microsoft/fast-element';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-modal ${ref('localModal')}>
    This is a modal
    </alpha-modal>
    }
```

If you are not familiar with the `ref` directive, take a look at the [Microsoft Fast documentation](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive).

From this point, you can use both `show()` and `close()` as methods of `localModal`.

### Examples

Below we have two examples of how to use both methods:

- Create a modal positioned to the left:
```html
<alpha-modal position="left">
    This is a modal
</alpha-modal>
```
- Create a button to open a modal:

```html {6}
import {... , ref} from '@microsoft/fast-element';
import {sync} from '@genesislcap/foundation-utils';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-button @click=${x => x.localModal.show()}></alpha-button>
    <alpha-modal ${ref('localModal')}>
    This is a modal
    </alpha-modal>
    }
```

- Create a button inside the modal to close it:

```html {9}
import {... , ref} from '@microsoft/fast-element';
import {sync} from '@genesislcap/foundation-utils';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-button @click=${x => x.localModal.show()}>Open modal</alpha-button>
    <alpha-modal ${ref('localModal')}>
    This is a modal
    <alpha-button @click=${x => x.localModal.show()}>Close modal</alpha-button>
    </alpha-modal>
    }
```

## Use cases

- Confirmation pop-ups
- Alerts
- Forms submissions
- Contextual information

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#dialog_modal)~~
