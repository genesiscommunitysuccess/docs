---
title: "Design systems - preview"
sidebar_label: "Preview"
id: preview
keywords: [web, design system, preview]
tags:
  - web
  - design system
  - preview
---

## Introduction

The Design System Configurator you see below, will be the tool we use to configure the design tokens and determine the look that's best suited for our application.

On the left hand side, is the [Editor](../../../web/design-systems/preview/#editor), where we can make all the modifications we want. On the right side, we can see the [Preview](../../../web/design-systems/preview/#preview) with the results of those changes.

Try changing the configurations and observe the reflected changes on the right.

<design-system-editor>
  <design-system-preview></design-system-preview>
  <design-system-export slot="export"></design-system-export>
</design-system-editor>

## Editor

The checkbox in the editor is ticked by default.

![](/img/checkbox.PNG)

This means that when you switch between Design Systems, all of your actively made selections are retained. For instance, if you configure the design tokens in the `Zero` Design System, and then switch to the `Foundation UI`, you will see the changes you configured there as well. 

Alternatively, if it's unticked, switching between Design Systems will not retain the configurations but only display the default values of the Design System selected.

:::important
An important configuration to note, is the `Design System`. In the dropdown list of `Design System` you will see `Zero` and `Foundation UI`. Depending on which one you choose to create your designs on, will give you a different look.
:::

In the editor, after we have made all the configurations to the design tokens, there are two more things we can do:

We can [save](../../../web/design-systems/preview/#saving-tokens) all these changes or [reset](../../../web/design-systems/preview/#resetting-tokens) them.

### Saving Tokens

Once you're happy with all the changes, you can hit the `Save` button. At this point, a modal is prompted that shows you the configured design tokens in a JSON format. 

:::note
Because this is only a preview, we only show the `Close` button on the modal but when the `DSC` (Design System Configurator) app is launched, you will see another `Save` button parallel to the `Close` one. Clicking the `Save` button, results in all of the changes being saved and reflected in the application we're currently running the Design System Configurator from.
:::

See the images below.

|         |         |
| :-------: | :-------: |
| Preview Modal | Application Modal|
| ![Image 1](/img/close_modal.PNG) |![Image 2](/img/save_modal.PNG) |

### Resetting Tokens

Alternatively, if we found that we no longer need the modifications we have made, we can always hit the `Reset` button and this will revert the values back to their default state.

## Preview

In the preview we can see three tabs displaying the information as suggested by their titles. 

### Components

The contents of the `Components` tab reflect the components that are affected by the configurations of the design tokens. 

:::note
The components we see here, are only a small collection used for the purpose of displaying an example. There are many more ***[components](../../../web/web-components/overview)*** that we have access to. 
:::

### Typography

The `Typography` tab displays the list of typography tokens avilable for us to use. Click on the tab in the preview and observe the changes on the `Body Font`, `Base Font Size` and `Base Line Height` as you configure those tokens on the left hand side. 

### Colors

The `Colors` tab as you may suspect, shows the design tokens available for use that pertain to color. Click on the `Color` tab and observe the reflected changes as you configure the `Accent color` and `Neutral color` design tokens. 