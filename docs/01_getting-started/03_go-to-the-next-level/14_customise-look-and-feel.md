---
title: 'Customise look and feel using layout and styles'
sidebar_label: 'Customise look and feel'
id: customize-look-and-feel
---

## Section objectives
The goal of this section is to customise our styles in the UI.

## Styling Grid Pro

You might want to apply specific styles to some columns. 
We start by creating a stylesheet document that will have some style definitions for the grid.

Create a stylesheet file called `positionsGrid.styles.ts` and provide the following code:

```typescript title='positionsGrid.styles.ts'
import {css, ElementStyles} from '@microsoft/fast-element';

export const positionGridStyles: ElementStyles = css`
    .quantity-column {
        color: blue;
    }
`
```

Configure your column to have the specific class name.

```typescript title="positionColumnDefs.ts"
 {field: 'QUANTITY', cellClass: 'quantity-column'},
```

In home.template.ts, in the grid tag, include utility that will inject your stylesheet to the component:

```html {1,4} title='home.template.ts'
import {positionGridStyles} from "./positionsGrid.styles";

<zero-grid-pro>
    <slotted-styles :styles=${() => positionGridStyles}></slotted-styles>
    ...    
    ...
</zero-grid-pro>
`
```

If you need to provide different class names for specific conditions, you can provide a function to the `cellClass` column config, as shown in the example below:

```typescript title="positionColumnDefs.ts"
 {field: 'PNL', cellClass: (params) => params.value > 0 ? 'profit' : 'loss'},
```

Remember to add the new styles to your stylesheet file.

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

## Layout 
By default, all elements on screen will use `display: block`, but we can easily customise it using our custom component that supports responsive web design.

```html
<foundation-flex-layout class="flex-row flex-sm-column spacing-2x">
    <!--content-->
</foundation-flex-layout>
```


## Styling other parts of application
This was only small part of the platform's capabilities in terms of styling. You can read more about design-system configuration [here](web/design-systems/introduction/).
