---
title: 'Web Components - Checkbox'
sidebar_label: 'Checkbox'
id: checkbox
keywords: [web, web components, checkbox]
tags:
  - web
  - web components
  - checkbox
---

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected Web Component.

## Set-up

```ts
import { provideDesignSystem, alphaCheckbox } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCheckbox());
```

## Attributes

You can define the following attributes in an `<alpha-checkbox>`.

| Name        | Type      | Description                                                                          |
|-------------|-----------|--------------------------------------------------------------------------------------|
| checked     | `boolean` | Sets and retrieve the current state of the component                                 |
| disabled    | `boolean` | Similar to `readonly`, but with a blur on the component                              |
| readonly    | `boolean` | If true, the user cannot change the value of this field                              |

These attributes must be defined alongside the declaration of the component.

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a checkbox disabled
```html title="Example 1"
<alpha-checkbox disabled>Checkbox</alpha-checkbox>
```
- **Example 2**: a checkbox starting checked `password`
```html title="Example 2"
<alpha-checkbox checked="true">Name</alpha-checkbox>
```

### Get the user input
Once the user has input a value to this component, you need to make it accessible to the application:

1. Create an `@observable` variable where you want to use this value:

```html {1,5}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
...
@observable checkbox: boolean
...
}
```

2. Use the `sync` function to insert the value from the component into the variable `checkbox`:

```typescript tile="Example 4" {1,4}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-checkbox :checked="${sync((x) => x.checkbox, 'boolean')}">checkbox number 1</alpha-checkbox>
    ...
...    
```

From this point, you can access the value of the component in your application.

## Try yourself

```html title="try yourself" live
<alpha-checkbox>Click on me</alpha-checkbox>
```


## Use cases

- Multi-selection forms
- Filtering
- Sorting
- To-Do lists
- Privacy and consent

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#checkbox)