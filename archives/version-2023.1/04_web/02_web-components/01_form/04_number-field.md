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

A text field for numeric entry. By default, this includes steps - up and down arrows where the user can click to increase or decrease the number in the field.

## Set-up

```ts
import { provideDesignSystem, alphaNumberField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaNumberField());
```
## Attributes

You can define the following attributes when you declare an `<alpha-number-field>`.

| Name           | Type      | Description                                                                                                                             |
|----------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| appearance     | `string`  | Controls the general appearance of the element. It can be **filled** or **outline**                                                     |
| autofocus      | `boolean` | When true, the component will be in focus when the page has finished loading                                                            |
| disabled       | `boolean` | Disables this component; users will not be able to change its value                                                                     |
| locale         | `string`  | Defines a number format based on language and location. **Default: "en-US"**. Must be used with `withFormatting`                    |
| form           | `string`  | Associates this component with a form. Form `id` needs to be passed. If no Id is provided, then it will be associated with the ancestor form |
| hideStep       | `boolean` | Hides the step control (up and down arrows) for the element                                                                             |
| max            | `number`  | Defines the maximum value allowed                                                                                                       |
| maxlength      | `number`  | The maximum number of characters allowed                                                                                                |
| min            | `number`  | Defines minimum value allowed                                                                                                           |
| minlength      | `number`  | The minimum number of characters required                                                                                               |
| placeholder    | `string`  | Sets a placeholder for the element (which disappears when the user starts inputting)                                                    |
| size           | `number`  | Defines the width of the component                                                                                                      |
| step           | `number`  | Defines the step rate for each user click on the arrows (steps) in the element. **Default: `1`**                                        |
| value          | `string`  | Defines a value for the component when it is created                                                                                    |
| withFormatting | `boolean` | Enables you to format the number                                                                                                               |


### Setting the number of decimal places

To set the number of decimal places, use the `withFormatting` attribute `maximumFractionDigits`.


| Variable              | Type     | Default | Description                               |
|-----------------------|----------|---------|-------------------------------------------|
| maximumFractionDigits | `number` | 3       | Maximum number of decimal digits accepted (up to 11 digits)|


## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a number-field with maximum number 50 and minimum 10; the step control is hidden
```html title="Example 1"
<alpha-number-field min="10" max="50" hidestep>number-field</alpha-number-field>
```

- **Example 2**: a number-field with step 0.5 - each time the user clicks on a step arrow, the value increases or decreases by 0.5
```html title="Example 2"
<alpha-number-field step="0.5">Number-field</alpha-number-field>
```

- **Example 3**: a number-field with a maximum of 2 digits 
```html title="Example 3"
<alpha-number-field withFormatting :options=${() => ({maximumFractionDigits: 2})}>Number-field</alpha-number-field>
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
