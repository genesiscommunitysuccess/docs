---
title: 'Web Components - Number field'
sidebar_label: 'Number field'
id: number-field
keywords: [web, web components, number field]
tags:
  - web
  - web components
  - number field
---

A text field for numeric entry.

## Set-up

```ts
import { provideDesignSystem, alphaNumberField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaNumberField());
```
## Attributes

You can define the following attributes in an `<alpha-number-field>`.

| Name           | Type      | Description                                                                          |
|----------------|-----------|--------------------------------------------------------------------------------------|
| appearance     | `string`  | Controls the general view of the element. It can be **filled** or **outline**        |
| autofocus      | `boolean` | When true, the component will be focused when the page has finished loading          |
| disabled       | `boolean` | Disables this component, users will not be able to change its value                  |
| hideStep       | `boolean` | Hides the step control of the element                                                |
| max            | `number`  | Defines maximum number allowed                                                       |
| maxlength      | `number`  | The maximum number of characters allowed                                             |
| min            | `number`  | Defines minimum number allowed                                                       |
| minlength      | `number`  | The minimum number of characters allowed                                             |
| placeholder    | `string`  | Sets a placeholder for the element (which disappears when the user starts inputting) |
| size           | `number`  | Defines the width of the component                                                   |
| step           | `number`  | Defines the step rate when using the arrows in the element. **Default: `1`**         |
| value          | `string`  | Defines a value for the component when it is created                                 |
| withFormatting | `boolean` | Allows number formatting                                                             |

These attributes must be defined alongside the declaration of the component.

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a number-field with maximum number 50 and minimum 10 hiding the step control
```html title="Example 1"
<alpha-number-field min="10" max="50" hidestep>number-field</alpha-number-field>
```

- **Example 2**: a number-field with step 0.5 - each time the user clicks on a step arrow, the value increases or decreases by 0.5
```html title="Example 2"
<alpha-number-field step="0.5">Number-field</alpha-number-field>
```

### Get the user input
In order to use a value input to this component, follow these two steps:

1. Create an `@observable` variable where you want to use this value:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
...
@observable number_field: number
...
}
```

2. Use the `sync` function to insert the value from the component into the variable `text_area`:

```typescript tile="Example 4" {1,4}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-number-field value=${sync((x) => x.number_field)}>TEXT</alpha-number-field>
    ...
...    
```

From this point, you can access the value of the component in your application.

## Try yourself

```html title="try yourself" live
<alpha-number-field>Try</alpha-number-field>
```


## Use cases

- Display numbers
- Insert numbers
- Search boxes
