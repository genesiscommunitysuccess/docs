---
title: 'Web Components - Slider'
sidebar_label: 'Slider'
id: slider
keywords: [web, web components, slider]
tags:
    - web
    - web components
    - slider
    - slide label
---

An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected Web Component. This component is used alongside with
`alpha-slide-label`

## Set-up

```ts
import { provideDesignSystem, alphaSlider, alphaSliderLabel } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaSlider(), alphaSliderLabel());
```
## Attributes

You can define the following attributes in an `<alpha-slider>`.

| Name        | Type      | Description                                                   |
|-------------|-----------|---------------------------------------------------------------|
| disabled    | `boolean` | Similar to `readonly`, but with a blur layer in the component |
| max         | `number`  | Defines maximum number of the slider                          |
| min         | `number`  | Defines minimum number of the slider                          |
| step        | `number`  | Defines the step of the slider                                |
| readonly    | `boolean` | It blocks the user to interact with the element               |
| value       | `number`  | Defines a value for the component when it is created          |
| orientation | `string`  | Define the orientation to `vertical` or `horizontal`          |

These attributes must be defined alongside the declaration of the component.

:::note
If you use the vertical orientation, the height of the component is defined as 160px as default. If you want to change it,
go to your css and adjust the height of the component.
:::

### slide-label
You can use this component with a `<alpha-slide-label>`. This component creates a label along with the slider so you
can point out some values.

| Name     | Type     | Description                                                |
|----------|----------|------------------------------------------------------------|
| position | `number` | A position relative to min or max value to place the label |

## Usage
All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

- **Example 1**: a slider with min = 0 and max = 100 with value set as 70
```html title="Example 1"
<alpha-slider min="0" max="100" value="70"></alpha-slider>
```
- **Example 2**: a slider with min = 0 and max = 100 with 3 labels positioning in 0, 50 and 100 with step of 5
```html title="Example 2"
<alpha-slider min="0" max="100" step="5">
    <alpha-slider-label position="0"> low </alpha-slider-label>
    <alpha-slider-label position="50"> mid </alpha-slider-label>
    <alpha-slider-label position="100"> high </alpha-slider-label>
</alpha-slider>
```
- **Example 3**: a vertical slider
```html title="Example 3"
<alpha-slider orientation="vertical"></alpha-slider>
```

### Get the user input
In order to use a value input to this component, you may have 2 options: retrieving the information in a number type using `valueAsNumber` or in
a string type using: `valueTextFormatter`. For both options, follow the following steps:

1. Create an `@observable` variable where you want to use this value. Remember to choose the right type.

```html {1,5,6}
import {... , observable} from '@microsoft/fast-element';
...
export class TEMPLATE extends FASTElement {
...
@observable slider_value_number: number
@observable slider_value_string: string
...
}
```

2. Use the `sync` function to insert the value from the component into the variable `slider_value_number` or `slider_value_string`:

```typescript tile="Example 4" {1,7,8}
import {sync} from '@genesislcap/foundation-utils';
...
    ...
        <alpha-slider 
            min="0" 
            max="100" 
            valueAsNumber=${sync((x) => x.slider_value_number)} 
            valueTextFormatter=${sync((x) => x.slider_value_string)}></alpha-slider>
    ...
...    
```

From this point, you can access the value of the component in your application.

## Try yourself

```html title="try yourself" live
<alpha-slider min="0" max="100" step="10" value="50">
    <alpha-slider-label position="0"> very low </alpha-slider-label>
    <alpha-slider-label position="30"> low </alpha-slider-label>
    <alpha-slider-label position="70"> high </alpha-slider-label>
    <alpha-slider-label position="100"> very high </alpha-slider-label>
</alpha-slider>
```

## Use cases

- Interact with data visualization
- Input for numeric values
- Dynamic filters

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)