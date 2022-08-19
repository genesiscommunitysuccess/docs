---
title: 'Customise look and feel using layout and styles'
sidebar_label: 'Customise look and feel'
id: customize-look-and-feel
---

## Styling ag-grid

You might want to apply specific styles to some columns. 
We start by creating a stylesheet document that will have some style definitions for the grid.

Create a stylesheet file called trades.styles.ts and provide following code

```typescript
import {css, ElementStyles} from '@microsoft/fast-element';

export const tradesGridStyles: ElementStyles = css`
    .currency-column {
        color: blue;
    }
`
```

Configure your column to have specific class name [column config](https://ag-grid.com/javascript-data-grid/cell-styles/#cell-class)

```typescript
 {field: 'CURRENCY', cellClass: 'currency-column'},
```

In home.template.ts in the grid tag include utility that will inject your stylesheet to the component.

```html
import {tradesGridStyles} from "./trades-grid.styles";

<zero-ag-grid>
    ...    
    <slotted-styles :styles=${() => tradesGridStyles}></slotted-styles>
    ...
</zero-ag-grid>
`
```

If you need to provide different class names under specific conditions you can provide function to cellClass column config like on the example below

```typescript
 {field: 'SIDE', cellClass: (params) => params.value === 'BUY' ? : 'buy-side', 'sell-side'},
```

Remember to add new styles in your stylesheet file

```diff
import {css, ElementStyles} from '@microsoft/fast-element';

export const tradesGridStyles: ElementStyles = css`    
     .currency-column {
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


## Styling custom component

https://www.fast.design/docs/fast-element/leveraging-css/#styles-and-the-element-lifecycle

## Styling user management
