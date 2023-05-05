---
title: 'Go to the next level - customise look and feel'
sidebar_label: 'Customise look and feel'
id: customize-look-and-feel
keywords: [getting started, quick start, next level, customisation, look and feel]
tags:
    - getting started
    - quick start
    - next level
    - customisation
    - look and feel
---

## Section objectives
The goal of this section is to customise our styles in the UI.

## Styling Grid Pro

Let's apply some specific styles to some columns.

We start by creating a stylesheet document that will have some style definitions for the grid.

Create a stylesheet file called **positionsGrid.styles.ts** under the **client/web/src/routes/home/** and provide the following code:

```typescript title='positionsGrid.styles.ts'
import {css, ElementStyles} from '@microsoft/fast-element';

export const positionGridStyles: ElementStyles = css`
    .quantity-column {
        color: blue;
    }
`
```

Go to your **positionColumnDefs.ts** and add `cellClass: 'quantity-column'`

```typescript title="positionColumnDefs.ts"
{field: 'QUANTITY', headerName: 'Quantity', type: 'rightAligned', flex: 1, cellClass: 'quantity-column', enableCellChangeFlash: true},
```

In **home.template.ts**, in the grid tag, include the utility that will inject your stylesheet to the component:

```html {1,4} title='home.template.ts'
import {positionGridStyles} from "./positionsGrid.styles";

<zero-grid-pro persist-column-state-key="position-grid-settings">
    <slotted-styles :styles=${() => positionGridStyles}></slotted-styles>
    ...
    ...
</zero-grid-pro>
`
```
You should see now your application like this
![](/img/grid-customized.png)


### Advanced styling
If you need to provide different class names for specific conditions (e.g.: style green for buy and red for sell), you can provide a function to the `cellClass` column config, as shown in the example below:

```typescript title="positionColumnDefs.ts"
{field: 'PNL', headerName: 'PNL', type: 'rightAligned', flex: 1, cellClass: (params) => params.value > 0 ? 'profit' : 'loss', enableCellChangeFlash: true},
```

Now add the new styles to your stylesheet file **positionGrid.styles.ts**.

```css {8-14} title='positionsGrid.styles.ts'
import {css, ElementStyles} from '@microsoft/fast-element';

export const positionGridStyles: ElementStyles = css`
     .quantity-column {
         color: blue;
     }

    .profit {
        color: green;
    }

    .loss {
        color: red;
    }
`
```

Your positions grid should be customised now:

![](/img/positions-grid-with-customisation.png)

:::tip
Don't worry too much if the data is different from yours - as long as the grid is customised as expected.
:::

<!--

## Layout
By default, all elements on screen will use `display: block`, but we can easily customise it using our custom component that supports responsive web design.

```html
<foundation-flex-layout class="flex-row flex-sm-column spacing-2x">
    <!--content-->
<!-- </foundation-flex-layout>
```

In the [next section](./15_dynamic_layout.md) you'll have the option to add a dynamic layout to replace the current fixed layout.
-->

## Conclusion
This was only a small part of the platform's capabilities in terms of styling. You can read more about design-system configuration [here](web/design-systems/introduction/).

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/client/web/src/routes/home) as a reference point for this chapter. Note that this repo is a complete application and might not reflect the changes made in this page.
