---
title: 'Web Components - Stepper'
sidebar_label: 'Stepper'
id: stepper
keywords: [web, web components, stepper]
tags:
    - web
    - web components
    - stepper
---

The `<alpha-stepper>` component offers a versatile solution for guiding users through a multi-step process or dynamic form. Configurable attributes such as orientation and validation conditions provide flexibility, allowing developers to tailor the stepper's behavior to specific use cases. 

:::note
Available only from foundation versions grater than **14.114.0**
:::

## Attributes

You can define the following attributes in an `<alpha-stepper>`.

| Name        | Type      | Description                                                   |
|-------------|-----------|---------------------------------------------------------------|
| orientation | `string`  | Defines the orientation: `vertical` or `horizontal`. **Default: `Vertical`**            |
| validation  | - | An array of objects to define the condition for each step to be completed |

These attributes must be defined alongside the declaration of the component.

### validation

The validation field is used to set the condition for when the stepper permits the user to move forward. You define the validation attribute as follows:

```html title="validation"
  <zero-stepper
    :validation=${(x) => [
      {
        isValid: () => x.valid === '123' && x.valid2 === 'abc' && x.valid3 === 'test',
      },
      { isValid: () => x.valid4 === 'abc' },
      { isValid: () => x.valid5 === 'finish' }
    ]}
  >
```

The index of each array element is related to the corresponding tab position. E.g.: index number 1 is related to the first tab of the stepper, index number 2 is related to the second tab of the stepper, etc.

The corresponding tab will only allow the user to proceed to the next step when the field `isValid` receives a `true` value. You can define it as the example above, or you can call a fuction to perform more complicated logic tests. 

### Events

You can use the following events when implements the `<alpha-stepper>`:

|Event | Description |
|------|-------------|
| @submit | Possibility to pass the function to be performed in the last step after clicking submit. |

Below you see a simple example of how to implement it.

```html
  <zero-stepper
    @submit=${() => alert('You completed form')}
  >
```

### `Tab` & `Panel`

Alongside the `<alpha-stepper>`, you must use the `<zero-stepper-tab>` and `<zero-stepper-tab-panel>`. Below you find the description of these two new components:

| Name | Description |
|------|-------------|
|`<zero-stepper-tab>` | Defines the name of each step of the stepper |
|`<zero-stepper-tab-panel>` | Defines the content of each step of the stepper |


## Usage
Below you find an example using the `alpha-design-system`. If you are using any other design system, change the declaration
of this component accordingly.

```html title="Stepper"
  <zero-stepper
    :validation=${(x) => [
      {
        isValid: () => x.valid === '123' && x.valid2 === 'abc' && x.valid3 === 'test',
      },
      { isValid: () => x.valid4 === 'abc' },
      { isValid: () => x.valid5 === 'finish' },
    ]}
    @submit=${() => alert('You completed form')}
  >
    <zero-stepper-tab>Step 1</zero-stepper-tab>
    <zero-stepper-tab>Step 2</zero-stepper-tab>
    <zero-stepper-tab>Step 3</zero-stepper-tab>
    <zero-stepper-tab-panel>
      <zero-text-field style="margin-left: 10px;" value=${sync((x) => x.valid)}>
        Must be equal to: 123
      </zero-text-field>
      <zero-text-field style="margin-left: 10px;" value=${sync((x) => x.valid2)}>
        Must be equal to: abc
      </zero-text-field>
      <zero-text-field style="margin-left: 10px;" value=${sync((x) => x.valid3)}>
        Must be equal to: test
      </zero-text-field>
    </zero-stepper-tab-panel>
    <zero-stepper-tab-panel>
      <h5>Must be equal to: abc</h5>
      <zero-select style="margin: 10px 0 0 10px;" :value=${sync((x) => x.valid4)}>
        <zero-option>123</zero-option>
        <zero-option>abc</zero-option>
      </zero-select>
    </zero-stepper-tab-panel>
    <zero-stepper-tab-panel>
      <zero-text-field style="margin-left: 10px;" value=${sync((x) => x.valid5)}>
        Must be equal to: finish
      </zero-text-field>
    </zero-stepper-tab-panel>
  </zero-stepper>
```

## Use cases

- Create dynamic forms
- Display processes ongoing