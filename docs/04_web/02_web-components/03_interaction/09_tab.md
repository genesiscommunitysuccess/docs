---
title: 'Web Components - Tabs'
sidebar_label: 'Tabs'
id: tabs
keywords: [web, web components, tab]
tags:
    - web
    - web components
    - tab
---

_Tabs_ are a set of layered sections of content that display one panel of content at a time. Each tab panel has an associated tab element that, when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

## Set-up

```ts
import { provideDesignSystem, alphaTabs, alphaTab, alphaTabPanel } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTabs(), alphaTab(), alphaTabPanel());
```
## Attributes

When you declare an `<alpha-tabs>`, you can define the following attributes:

| Name            | Type      | Description                                                                                           |
|-----------------|-----------|-------------------------------------------------------------------------------------------------------|
| activeid        | `string`  | Sets the corresponding `<alpha-tab>` to active                                                        | 
| activeindicator | `boolean` | Activates or deactivates the selected tab indicator                                                   | 
| orientation     | `string`  | Defines the orientation of the tabs. It can be: `horizontal` or `vertical`. **Default:** `horizontal` | 

These attributes must be defined alongside the declaration of the component.

### alpha-tab

In order to use the tabs, you need to create `<alpha-tab>`, you can define the following attributes:

| Name        | Type      | Description                                                                                           |
|-------------|-----------|-------------------------------------------------------------------------------------------------------|
| disabled    | `boolean` | Disables the tab, so the user cannot interact with                                                    | 
| id          | `string`  | Sets the id for the tab                                                                               | 

These attributes must be defined alongside the declaration of the component.

### alpha-tab-panel

In order to use tab, you need to create `alpha-tab-panel`. This is the component that will host all the content available in each tab.

| Name | Type     | Description                              |
|------|----------|------------------------------------------|
| id   | `string` | Links the panel to its corresponding tab |

### Event

These are the available events you can use:

| Name   | component                        | Description                           |
|--------|----------------------------------|---------------------------------------|
| change | `<alpha-tabs>`                   | Fires an event when changing tabs     |
| click  | `<alpha-tabs>` and `<alpha-tab>` | Fires an event when clicking on a tab |

:::warning
If you use the event `@click` with `<alpha-tabs>` it will fire this event everytime this component is clicked, whether 
it is clicking in a tab or in its content.
:::

## Examples

Below you find three examples on how to use `tabs`, `tab` and `tab-panel`

- Create three tabs, with the first one disabled:
```html
<alpha-tabs activeid="tab1">
    <alpha-tab disabled id="tab1">Tab 1</alpha-tab>
    <alpha-tab id="tab2">Tab 2</alpha-tab>
    <alpha-tab id="tab3">Tab 3</alpha-tab>
    <alpha-tab-panel id="tab1">
        This is tab number 1
    </alpha-tab-panel>
    <alpha-tab-panel id="tab2">
    This is tab number 2
    </alpha-tab-panel>
    <alpha-tab-panel id="tab3">
        This is tab number 3
    </alpha-tab-panel>
</alpha-tabs>
```
- Create three tabs, vertically orientated:
```html
<alpha-tabs orientation="vertical">
    <alpha-tab id="tab1">Tab 1</alpha-tab>
    <alpha-tab id="tab2">Tab 2</alpha-tab>
    <alpha-tab id="tab3">Tab 3</alpha-tab>
    <alpha-tab-panel id="tab1">
      This is tab number 1
    </alpha-tab-panel>
    <alpha-tab-panel id="tab2">
      This is tab number 2
    </alpha-tab-panel>
    <alpha-tab-panel id="tab3">
      This is tab number 3
    </alpha-tab-panel>
</alpha-tabs>
```
- Create three tabs, with a `@change` event calling a function called `function()`. This function needs to be defined in
the main class of your application

```html
<alpha-tabs @change=${(x) => x.function()}>
  <alpha-tab id="tab1">Tab 1</alpha-tab>
  <alpha-tab id="tab2">Tab 2</alpha-tab>
  <alpha-tab id="tab3">Tab 3</alpha-tab>
  <alpha-tab-panel id="tab1">
      This is tab number 1
  </alpha-tab-panel>
  <alpha-tab-panel id="tab2">
      This is tab number 2
  </alpha-tab-panel>
  <alpha-tab-panel id="tab3">
      This is tab number 3
  </alpha-tab-panel>
</alpha-tabs>
```

## Try yourself

```html live
<alpha-tabs>
    <alpha-tab id="tab1">Tab 1</alpha-tab>
    <alpha-tab id="tab2">Tab 2</alpha-tab>
    <alpha-tab id="tab3">Tab 3</alpha-tab>
    <alpha-tab-panel id="tab1">
        This is tab number 1
    </alpha-tab-panel>
    <alpha-tab-panel id="tab2">
        This is tab number 2
    </alpha-tab-panel>
    <alpha-tab-panel id="tab3">
        This is tab number 3
    </alpha-tab-panel>
</alpha-tabs>
```

## Use cases

* Information grouping
* Wizard steps

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tabpanel)