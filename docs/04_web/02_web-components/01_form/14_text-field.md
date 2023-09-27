---
title: 'Web Components - Text field'
sidebar_label: 'Text field'
id: text-field
keywords: [web, web components, text field]
tags:
    - web
    - web components
    - text field
---

A text field is an interactive or graphic web component that enables users to input and edit text.
It is a fundamental component of forms, dialogs and user interfaces.

## Set-up

```ts
import { provideDesignSystem, alphaTextField } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextField());
```

## Attributes

You define the following attributes in an `<alpha-text-field>`.

| Name        | Type      | Description                                                                    |
|-------------|-----------|--------------------------------------------------------------------------------|
| autofocus   | `boolean` | When true, the component will be focused when the page has finished loading    |
| appearance  | `string`  | Can be `outline` or `filled`                                                   |
| maxlength   | `number`  | The maximum number of characters allowed                                       |
| minlength   | `number`  | The minimum number of characters allowed                                       |
| placeholder | `string`  | Sets a placeholder for the element                                             |
| readOnly    | `boolean` | If true, the user cannot change the value in the field                         |
| size        | `number`  | Sets the width of the component                                                |
| type        | `string`  | Sets the type of text-field. Can be {"email", "password","tel","text","url"}   | 
| value       | `string`  | Sets the value for this component                                              | 

These attributes must be defined alongside the declaration of the component.

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a text-field with a max length of 10 characters and a placeholder
```html title="Example 1"
<alpha-text-field maxlength="10" placeholder="This is a placeholder">Name</alpha-text-field>
```
- **Example 2**: a text-field with a size of 30 and type `password`
```html title="Example 2"
<alpha-text-field size="30" type="password">Name</alpha-text-field>
```
- **Example 3**: a read-only text-field with a placeholder
```html title="Example 3"
<alpha-text-field readOnly placeholder="you can't touch me">Name</alpha-text-field>
```

### Get the user input
In order to use the value that is input to this component, follow these two steps:

1. Create an `@observable` variable where you want to use this value:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
    ...
    @observable text_field: string
    ...
}
```

2. Use the `sync` function to insert the value from the component into the variable `text_field`:

```typescript tile="Example 4" {1,4}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-text-field value=${sync((x) => x.text_field)}>TEXT</alpha-text-field>
    ...
...    
```

From this point, you can access the value of the component in your application.

## Try yourself

```html title="try yourself" live
<alpha-text-field placeholder="yourself">try</alpha-text-field>
```

## Use cases

- User registration and login
- Data entry
- Search boxes
- Comment sections
- Search filters
