---
id: web-training-day2
title: Day 2
sidebar_label: Day 2
sidebar_position: 4

---
# Day 2 agenda
Complex forms, data entry components, introduction to Genesis Comms lib.

## Orders screen
Let's continue the development of our web app creating an order screen. We're going to work on these files:
-	***order.template.ts***
-	***order.ts***
-	***order.styles.ts***

You should have created these files in the last exercise of the previous day of the training with the navigation bar pointing to them as well.

Now, let's replace the dummy content of these files with the actual implementation we want. This is how this screen will look like:

**INSERT SCREENSHOT HERE WHEN DONE**

### Requirements

A page listing all the orders with a filter by Type and actions to insert a new order, edit an existing order and cancel an order.

#### Fields
| Field          | Type             | Editable | Notes
|---------------|------------------------------|------------------------------|------------------------------|
| Instrument          | Select or Search (autocomplete field) | Yes | Load data from ALL_INTRUMENTS Data Server
| Market data          | Display price of the selected symbol | No | Load data from GET_PRICE_PER_INSTRUMENT ReqRep
| Quantity          | Integer      | Yes | Must be positive
| Price          | Double      | Yes | Must be positive
| Total          | Double      | No | Display Quantity * Price
| Type          | Dropdown      | Yes | Display types from ENUM ORDER_TYPES
| Notes          | String      | Yes | Free text up to 50 chars

#### Actions
Insert, edit and cancel.

### Adding the Orders data grid
In the template file, start by adding the Genesis [data source](/front-end/web-components/grids/ag-grid/ag-genesis-datasource/) pointing to the appropriate resource name; this must be wrapped in a grid of your choice. For this example we shall use [ag-grid](/front-end/web-components/grids/ag-grid/ag-grid-intro/).


```html title="order.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
        resourceName="ALL_ORDERS"
        orderBy="ORDER_ID">
    </ag-genesis-datasource>
</zero-ag-grid>
```

This will result in grid displaying all the columns available in the for the `ALL_ORDERS` resource.

## Grid interaction

To add new columns that are not part of the API, we can add additional column definitions.

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

## Custom column config

If you want to customise how each column is displayed, you can provide column config for every column.

Create a new file called orderColumnDefs.ts in the same directory.

```typescript title="orderColumnDefs.ts"
export const orderColumnDefs: ColDef[] = [
  {field: 'INSTRUMENT_ID', headerName: 'Instrument', sort: 'desc', flex: 2},
  {field: 'QUANTITY', headerName: 'Quantity', valueFormatter: formatNumber(0), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'ORDER_ID', headerName: 'Order ID', flex: 1, enableCellChangeFlash: true},
  {field: 'PRICE', headerName: 'Price', valueFormatter: formatNumber(2), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'ORDER_TYPE', headerName: 'Order Type', sort: 'desc', flex: 2},
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

## Saving user preferences

You can add the `persist-column-state-key` to the zero-ag-grid to persist user changes to things such as sorting, column order, and visibility on their machine. With this, when the user reloads the browser, they get the same configuration.

```html {2}
<zero-ag-grid
    persist-column-state-key='order-grid-settings'
>
```


### Adding the new Order modal

### Adding the edit and cancel Order action

### Exercises
- Add a new action 'delete order'
- Display more data on 'Market data' and 'Symbol'
- Add a new field dropdown 'Order on behalf' listing all USERs, must select one or none

