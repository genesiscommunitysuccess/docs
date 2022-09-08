---
title: 'Customise look and feel using layout and styles'
sidebar_label: 'Customise look and feel'
id: customize-look-and-feel
---

## Section objectives
The goal of this section is to customise our styles in the UI.

## Styling ag-grid

You might want to apply specific styles to some columns. 
We start by creating a stylesheet document that will have some style definitions for the grid.

Create a stylesheet file called trades.styles.ts and provide the following code:

```typescript
import {css, ElementStyles} from '@microsoft/fast-element';

export const tradesGridStyles: ElementStyles = css`
    .quantity-column {
        color: blue;
    }
`
```

Configure your column to have the specific class name [column config](https://ag-grid.com/javascript-data-grid/cell-styles/#cell-class):

```typescript
 {field: 'QUANTITY', cellClass: 'quantity-column'},
```

In home.template.ts, in the grid tag, include utility that will inject your stylesheet to the component:

```html
import {tradesGridStyles} from "./trades.styles";

<zero-ag-grid>
    ...    
    <slotted-styles :styles=${() => tradesGridStyles}></slotted-styles>
    ...
</zero-ag-grid>
`
```

If you need to provide different class names for specific conditions, you can provide a function to the `cellClass` column config, as shown in the example below:

```typescript
 {field: 'SIDE', cellClass: (params) => params.value === 'BUY' ? : 'buy-side', 'sell-side'},
```

Remember to add the new styles to your stylesheet file.

```diff
import {css, ElementStyles} from '@microsoft/fast-element';

export const tradesGridStyles: ElementStyles = css`    
     .quantity-column {
         color: blue;
     }

+    .buy-side {
+        color: green;
+    }
    
+    .sell-side {
+        color: red;
+    }
`
```

## Layout 
By default, all elements on screen will use `display: block`, but we can easily customise it using our custom component that supports responsive web design.

```html
<foundation-flex-layout class="flex-row flex-sm-column spacing-2x">
    <!--content-->
</foundation-flex-layout>
```


## Styling other parts of application
This was only small part of the platform's capabilities in terms of styling. You can read more about design-system configuration [here](/front-end/design-systems/introduction/).
