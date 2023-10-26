---
title: 'Web Components - Button'
sidebar_label: 'Button'
id: button
keywords: [web, web components, button]
tags:
    - web
    - web components
    - button
---

<div class="button-examples">

Button component enables users to trigger actions, such as submitting a form or opening a dialog.

## Set-up

```ts
import { provideDesignSystem, alphaButton } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaButton());
```
## Attributes

When you declare an `<alpha-button>`, you can define the following attributes:

| Name       | Type      | Description                                                                                                                             |
|------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| autofocus  | `boolean` | When true, the component will be focused when the page has finished loading                                                             |
| appearance | `string`  | Can be `neutral`, `accent`, `lightweight`, `outline` or `stealth`                                                                       |
| disabled   | `boolean` | Similar to `readonly`, but with a blur on the component                                                                                 |
| form       | `string`  | Associates this component to a form. Form `id` needs to be passed. If no Id informed, then it will be associated with the ancestor form |
| name       | `string`  | Define the name of the element                                                                                                          |
| type       | `string`  | Defines the mode of the button; can be `button` or `reset`; must be associated with a form. **Default:** `button`                       | 
| value      | `string`  | Defines the value associated  with `name`                                                                                               | 

These attributes must be defined alongside the declaration of the component.

### Types

The `type` attribute changes the button mode from `reset` and `button`. 

- `button` is the default mode of this component. It is a button that performs an action when clicked. 
- `reset`sets the mode of the button to `reset` and can influence a group of components associated with the same form.

The majority of components can be associated with a `<form>` using the attribute `form` with the `id` of the form.
Below you see an example of this association, where a single form wraps up a `text-field`, `number-field`, `text-area` and `button`.

```html title="Form example"
<form id="user_information">
    <alpha-text-field value="name" form="user_information">Name</alpha-text-field>
    <alpha-number-field value="20" form="user_information">Age</alpha-number-field>
    <alpha-text-area value="Address" form="user_information">address</alpha-text-area>
    <alpha-button type="reset" form="user_information">Reset information</alpha-button>
</form>
```

:::tip
In this case, you don't need to indicate the attribute `form`, since it wraps up all the components. Where this is not the case, you must use the `form` attribute.
:::

In the example, if the `button` is pressed, all components will have their values reset to the default values accordingly.

## Usage

All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: a button with a natural appearance
```html title="Example 1"
<alpha-button appearance="natural">Button</alpha-button>
```
- **Example 2**: a disabled button with a type reset
```html title="Example 2"
<alpha-button disabled type="reset">Button</alpha-button>
```

### Trigger an action
When you place a button into your application, the user expects some action to be triggered. This is how you trigger an action in the application:

1. Create a function `functionName()` into the class of the component:

```js {1,5}
export class TEMPLATE extends FASTElement {
    ...
    functionName(){
        // Write an action here
    }
    ...
}
```

2. Use the event `@click` to call your function `functionName()`:

```html tile="Example 4" {1,4}
...
<alpha-button @click=${x => x.functionName()}></alpha-button>
... 
```
:::tip
You can also create functions with arguments (`functionName(arg1: string)`). In that case, don't forget to pass the arguments you defined; otherwise, it will throw a **missing argument** error
:::

From this point, your application can run the action after the button has been clicked.

## Try yourself

```html title="try yourself" live
<alpha-button>Button</alpha-button>
```

## Use cases

- Submit forms
- Trigger actions
- Create interactive elements
- Set options

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)

</div>
