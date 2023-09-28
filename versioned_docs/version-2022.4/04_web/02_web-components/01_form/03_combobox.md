---
title: 'Web Components - Combobox'
sidebar_label: 'Combobox'
id: combobox
keywords: [web, web components, combobox]
tags:
    - web
    - web components
    - combobox
---

A combo-box is an input with an associated pop-up that enables users to select one value from a collection of possible values.

## Set-up

```ts
import { provideDesignSystem, alphaCombobox, alphaOption } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCombobox(), alphaOption());
```
## Attributes

You can define the following attributes in an `<alpha-combobox>`. This component this need to used with `<alpha-option>`

| Name         | Type      | Description                                                                                                                            |
|--------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------|
| autocomplete | `string`  | Defines how autocompletion works in the component. It can be "inline", "list", "both", "none". **Default:** `none`                     |
| disabled     | `boolean` | Similar to `readonly`, but with a blur on the component                                                                                |
| open         | `boolean` | Defines whether the combolist starts opened or not. **Default:** `false`                                                               |
| position     | `string`  | Places the combolist **above** or **below** the combo-box. It can be `above` or `below`. **Default:** it will try to fit with the page | 
| placeholder  | `string`  | Sets placeholder text for the element (which disappears when the user starts typing)                                                   |
| value        | `string`  | Sets the value for this component                                                                                                      | 

These attributes must be defined alongside the declaration of the component.

:::note
For `autocomplete`, this is how the component should behave:

- `inline`: while the user is typing in the combo-box, it will suggest to complete the word based on the options available.
- `list`: while the user is typing in the combo-box, it will display a filtered combolix based on what the user has already typed.
- `both`: it will behave as both `inline` and `list`
- `none`: it will not autocomplete
:::

### Option Attributes

In order to properly use the combo-box, you need to create a list of options, so the user can click on it. You can cate this
list using `<alpha-option>`. Below you see its attributes

| Name     | Type      | Description                                                                     |
|----------|-----------|---------------------------------------------------------------------------------|
| disabled | `boolean` | It disables an option so the user cannot interact with, but it is still visible |
| selected | `boolean` | It defines a default selection for the combo-box                                |

:::note
If you place the `selected` attribute in more than one `option`, only the first occurrence will be activated.
:::

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a combo-box that autocompletes both inline and list with three options, including one disabled
```html title="Example 1"
<alpha-combobox autocomplete="both">
    <alpha-option disabled>Christopher Eccleston</alpha-option>
    <alpha-option>David Tennant</alpha-option>
    <alpha-option>Matt Smith</alpha-option>
</alpha-combobox>
```
- **Example 2**: a combo-box with combolix placed above with a selected option as default
```html title="Example 2"
<alpha-combobox position="above">
    <alpha-option>Christopher Eccleston</alpha-option>
    <alpha-option>David Tennant</alpha-option>
    <alpha-option selected>Matt Smith</alpha-option>
</alpha-combobox>
```
- **Example 3**: a disabled combo-box
```html title="Example 3"
<alpha-combobox disabled>
    <alpha-option>Christopher Eccleston</alpha-option>
    <alpha-option>David Tennant</alpha-option>
    <alpha-option>Matt Smith</alpha-option>
</alpha-combobox>
```

:::warning
The `combobox` component native behavior is to accept whatever entry the user inserts, even if it is not in the options available.
In order to avoid this situation, implement some protections manually.
:::

### Get the user input
Once the user has input a value to this component, you need to make it accessible to the application:

1. Create an `@observable` variable where you want to use this value:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
...
@observable combobox: string
...
}
```

2. Use the `sync` function to insert the value from the component into the variable `combobox`:

```typescript tile="Example 4" {1,4-8}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-combobox value="${sync((x) => x.combobox)}">
            <alpha-option>Christopher Eccleston</alpha-option>
            <alpha-option>David Tennant</alpha-option>
            <alpha-option>Matt Smith</alpha-option>
        </alpha-combobox>
    ...
...    
```

From this point, you can access the value of the component in your application. Note that the value you will get from the combo-box
is the string defined in the `alpha-option`

### Create dynamic list
When you're developing your application, you normally want to generate the combolist instead of creating each option manually.
In this case, you can follow the steps below:

1. Create an `@observable Array<string>` with the options to be available in your combo-box:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
    ...
    @observable options: Array<string> = []
    ...
}
```

With this variable created, you can generate any array you wish using a loop. Here is a simple example:

``` typescript
    for (let i = 0; i < 4; i++) {
      this.options.push("Label " + i);
    }
```

2. Use the `repeat` directive to create an `<alpha-option>` for each element you have in `options`

```html {1,5}
import {... , repeat} from '@microsoft/fast-element';
...
    ...
        <alpha-combobox>
            ${repeat(x => x.options, html`<zero-option>${x => x}</zero-option>`)}
        </alpha-combobox>
    ...
...    
```

The `repeat` directive takes two arguments: 
- The first one is the array/object to be iterated. In the code above, we have `x => x.options` because the variable we created is a simple array named `options`. 
- The second is the component to be repeated as many times as elements that there are in the array/object passed in the first argument. In this case, we
are repeating the component `alpha-option`.

In case you are not familiar with the `repeat` directive, take a look on the [Microsoft Fast documentation](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive).

## Try yourself

```html title="try yourself" live
<alpha-combobox>
  <alpha-option>Try</alpha-option>
  <alpha-option>Your</alpha-option>
  <alpha-option>Self</alpha-option>
</alpha-combobox>
```

## Use cases

- Selecting pre-defined values
- Sorting
- Filtering

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#combobox)
