---
id: web-training-day3
title: Day 3
sidebar_label: Day 3
sidebar_position: 5

---
# Day 3 agenda
Displaying data, filters and streaming data

## Order entry screen
Let's continue the development of the order screen.

### Grid interaction

To add new columns that are not part of the resource model (ALL_ORDERS query in this case), we can add additional column definitions.

```html {6} title="order.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
            resourceName="ALL_ORDERS"
            orderBy="ORDER_ID">
    </ag-genesis-datasource>
    <ag-grid-column :definition="${x => x.singleOrderActionColDef}" />
</zero-ag-grid>

```

In the component definition file, we can provide a method that enables us to interact with the rest of the class.
The example below creates a column with a button that logs data in the row to the console.
Here you can easily swap logging the row data with some custom logic (such as calling a back-end api that we shall cover in more detail later on).

```typescript title="order.ts"
import {ColDef} from '@ag-grid-community/core';

  public singleOrderActionColDef: ColDef = {
    headerName: 'Action',
    minWidth: 120,
    maxWidth: 120,
    cellRenderer: 'action',
    cellRendererParams: {
      actionClick: async (rowData) => {
        console.log(rowData);
      },
      actionName: 'Print Order',
      appearance: 'primary-gradient',
    },
    pinned: 'right',
  };
```
:::tip ColDef and renderes
Find out more about:
- [ColDef and Genesis AG Column](/front-end/web-components/grids/ag-grid/ag-genesis-column/)
- [Cell Renderer](/front-end/web-components/grids/ag-grid/ag-genesis-cell/)
- [AG Renderers](/front-end/web-components/grids/ag-grid/ag-renderers/)
:::

### Custom column config

If you want to customise how each column is displayed, you can provide column config for every column.

Create a new file called orderColumnDefs.ts in the same directory.

```typescript title="orderColumnDefs.ts"
export const orderColumnDefs: ColDef[] = [
  {field: 'INSTRUMENT_ID', headerName: 'Instrument', sort: 'desc', flex: 2},
  {field: 'QUANTITY', headerName: 'Quantity', valueFormatter: formatNumber(0), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'ORDER_ID', headerName: 'Order ID', flex: 1, enableCellChangeFlash: true},
  {field: 'PRICE', headerName: 'Price', valueFormatter: formatNumber(2), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'ORDER_SIDE', headerName: 'Order Side', sort: 'desc', flex: 2},
  {field: 'NOTES', headerName: 'Notes', sort: 'desc', flex: 2},
  
];
```
To stop automatic generation of columns, you need to add the `only-template-col-defs` attribute to the zero-ag-grid.

Then use the [repeat](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive) directive; this includes all the columns from our column config array.


```typescript {4,10-12} title="order.template.ts"
import {orderColumnDefs} from './orderColumnDefs';

<zero-ag-grid
    only-template-col-defs
    >
    <ag-genesis-datasource
        resourceName="ALL_ORDERS"
        orderBy="ORDER_ID">
    </ag-genesis-datasource>
    ${repeat(() => orderColumnDefs, html`
    <ag-grid-column :definition="${x => x}" />
    `)}
    <ag-grid-column :definition="${x => x.singleOrderActionColDef}" />
</zero-ag-grid>
```

### Saving user preferences

You can add the `persist-column-state-key` to the zero-ag-grid to persist user changes to things such as sorting, column order, and visibility on their machine. With this, when the user reloads the browser, they get the same configuration.

```html {2}
<zero-ag-grid
    persist-column-state-key='order-grid-settings'
>
```

### Exercise 3.1: customizing the grid
:::info estimated time
30min
:::
Change the row height of the data grid to '20 px' and add a new column called 'See order' that opens a window.alert with the row data.

:::tip More Genesis ag-grid attributes
You can find all the additional attributes and props, including row height, of the Genesis ag-grid at [Genesis ag-grid documentation](/front-end/web-components/grids/ag-grid/ag-grid-intro/)
:::


### Adding the edit and cancel Order action

### Creating our own grid component
Display this content https://internal-web/uat/secure/front-end/basics/inserting-a-grid/#going-further

## Exercises
- Add a new action 'delete order'
- Display more data on 'Market data' and 'Symbol'

### Adding filters to the Orders data grid
https://internal-web/uat/secure/front-end/web-components/grids/ag-grid/ag-genesis-datasource/
use criteria, orderBy, reverse

### Exercises
- Add a new filter to the data grid - criteria_match
- Ag-grid customization exercises (using Genesis specific attributes)
