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
## Attributes

When you declare an `<alpha-dialog>`, you can provide the following attribute:

| Name     | Type   | Description                                                                     |
|----------|--------|---------------------------------------------------------------------------------|
| position | string | Places the dialog to the `right`, `centre` or `left` of the screen. **Default:** `centre` |

:::note
Unlike the `modal` component, the `dialog` component is not positioned in a layer in front of other components. It appears where it is declared. Any change of positioning must be addressed using css. 
:::

## Methods

When declaring an `alpha-dialog` component, the following methods are available:

| Name              | Description                               |
|-------------------|-------------------------------------------|
| show()            | Shows the dialog                          |
| close()           | Closes the dialog                         |
| onShowCallback()  | Callback that runs before open the dialog |
| onCloseCallback() | Callback that runs after close the dialog |

By default, the `dialog-component` starts closed.

## Usage

Below is the standard declaration of the dialog:

```html
<alpha-dialog>
    This is a dialog
</alpha-dialog>
```

### Interaction

In order to interact with the dialog component, you need to use the available methods. To do that, import dialog from `@genesislcap/alpha-design-system`:

``` typescript
import { Dialog as alphaDialog } from '@genesislcap/alpha-design-system';
```
:::note
If you are using `foundation-zero`, then you need to import using `@genesislcap/foundation-zero`
:::

After that, you need to define the local variable to be referred to, in this case `localDialog`:

```js {3}
export class TEMPLATE extends FASTElement {
    ...
    localDialog: alphaDialog;
    ...
}
```

Now that you have your local variable, you can use the directive `ref` to link your component to this variable:

```html {1,5-7}
import {... , ref} from '@microsoft/fast-element';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-dialog ${ref('localDialog')}>
    This is a dialog
    </alpha-dialog>
    }
```

If you are not familiar with the `ref` directive, take a look at the [Microsoft Fast documentation](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive).

From this point, you can use both `show()` and `close()` as methods of `localDialog`.

#### Callbacks

The `dialog` provides two callbacks `onShowCallback()` and `onCloseCallback()`. To work with them, you need to use them inside the `connectedCallback()`. Below is an example using the variable `localDialog` that was defined earlier.

```js
connectedCallback(){
    super.connectedCallback()
    ...

    this.localDialog.onShowCallback = () => {
        //Write your code here
    }
    
    this.localDialog.onCloseCallback = () => {
        //Write your code here
    }
    
    ...
}
```

### Examples

Below we have three examples of how to use both methods:

- Create a dialog positioned to the left:
```html
<alpha-dialog position="left">
    This is a dialog
</alpha-dialog>
```
- Create a button to open a dialog:

```html {6}
import {... , ref} from '@microsoft/fast-element';
import {sync} from '@genesislcap/foundation-utils';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-button @click=${x => x.localDialog.show()}></alpha-button>
    <alpha-dialog ${ref('localDialog')}>
        This is a dialog
    </alpha-dialog>
    }
```

- Create a button inside the dialog to close it:

```html {9}
import {... , ref} from '@microsoft/fast-element';
import {sync} from '@genesislcap/foundation-utils';
...
export const yourTemplate = html<Template>`
    ...
    <alpha-button @click=${x => x.localDialog.show()}>Open dialog</alpha-button>
    <alpha-dialog ${ref('localDialog')}>
        This is a dialog
        <alpha-button @click=${x => x.localDialog.show()}>Close dialog</alpha-button>
    </alpha-dialog>
    }
```

## Use cases

- Confirmation pop-ups
- Alerts
- Forms submissions
- Contextual information

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#dialog_modal)
