---
title: 'Web Components - text area'
sidebar_label: 'Text area'
id: text-area
keywords: [web, web components, text area]
tags:
  - web
  - web components
  - text area
---

A text-area is a graphic user-interface element that provides a region where users can input, edit or display text that extends over multiple lines.

This component is an implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected Web Component.

## Set-up

```ts
import { provideDesignSystem, alphaTextArea } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTextArea());
```

## Attributes

You can define the following attributes in an `<alpha-text-area>`.

| Name        | Type      | Description                                                                                                 |
|-------------|-----------|-------------------------------------------------------------------------------------------------------------|
| appearance  | `string`  | Changes the general view of the element; this can be **filled** or **outline**                              |
| autofocus   | `boolean` | When true, the component will be focused when the page has finished loading                                 |
| cols        | `boolean` | Defines the size of the element horizontally. **Default: 20**                                               |
| disabled    | `boolean` | Similar to `readonly`, but with a blur on the component                                                     |
| form        | `string`  | Associates this component to a form. Form `id` needs to be passed. If no Id informed, then it will be associated with the ancestor form |
| maxlength   | `number`  | The maximum number of characters allowed                                                                    |
| minlength   | `number`  | The minimum number of characters allowed                                                                    |
| name        | `string`  | Defines the name of the element                                                                             |
| placeholder | `string`  | Sets placeholder text for the element, which disappears when the user starts inputting                          |
| readonly    | `boolean` | If true, the user cannot change the value of this field                                                     |
| resize      | `string`  | Allows the user to resize the element; this can be {"none","both","vertical","horizontal"}. **Default: none** |
| row         | `number`  | Defines the size of the element vertically. **Default: 2**                                                   |

These attributes must be defined alongside the declaration of the component.

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a text-area with 5 rows and 20 columns, which the user cannot resize
```html title="Example 1"
<alpha-text-area rows="5" cols="20" resize="none">text-area</alpha-text-area>
```
- **Example 2**: a text-area that is in focus, and which displays the placeholder text **This is a placeholder**
```html title="Example 2"
<alpha-text-area placeholder="This is a placeholder" autofocus>Name</alpha-text-area>
```
- **Example 3**: a text-area that displays placeholder text, which the user is unable to change
```html title="Example 3"
<alpha-text-area disabled placeholder="you can't touch me">Name</alpha-text-area>
```

### Get the user input
Once the value has been input, you need to make it accessible to your application. 

1. Create an `@observable` variable where you want to use this value:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
...
@observable text_area: string
...
}
```

2. Use the `sync` function to insert the value from the component into the variable `text_area`:

```typescript tile="Example 4" {1,4}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-text-area value=${sync((x) => x.text_area)}>TEXT</alpha-text-area>
    ...
...    
```

From this point, you can access the value of the component in your application.

## Try yourself

```html title="try yourself" live
<alpha-text-area placeholder="yourself">try</alpha-text-area>
```


## Use cases

- Comments
- Descriptions
- Multi-line text inputs
- Complex searches
