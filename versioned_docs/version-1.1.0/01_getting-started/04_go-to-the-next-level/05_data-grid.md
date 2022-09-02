---
title: 'Show data using Data Grid'
sidebar_label: 'Show data using Data Grid'
id: data-grid
---

For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

Before we make any changes, you need to install your npm dependencies by running the following in your terminal:

```shell
npm run bootstrap
```

Once you have all dependencies installed, you can use the terminal to run your UI with the following command: 

```shell
npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)


In the template file, start by adding the Genesis data source pointing to the appropriate resource name; this must be wrapped in a grid of your choice. For this example we shall use ag-grid.

[//]: # (link to ag-genesis-datasource tsdocs)
```html title="home.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </ag-genesis-datasource>
</zero-ag-grid>
```

This will result in grid displaying all the columns available in the for the `ALL_POSITIONS` resource.

## Grid interaction

To add new columns that are not part of the API, we can add additional column definitions.

```html {6} title="home.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
            resourceName="ALL_POSITIONS"
            orderBy="INSTRUMENT_ID">
    </ag-genesis-datasource>
    <ag-grid-column :definition="${x => x.singlePositionActionColDef}" />
</zero-ag-grid>

```

In the component definition file, we can provide a method that enables us to interact with the rest of the class.
The example below creates a column with a button that logs data in the row to the console.
Here you can easily swap logging the row data with some custom logic (such as calling a back-end api that we shall cover in more detail later on).

```typescript title="home.ts"
  public singlePositionActionColDef: ColDef = {
    headerName: 'Action',
    minWidth: 120,
    maxWidth: 120,
    cellRenderer: 'action',
    cellRendererParams: {
      actionClick: async (rowData) => {
        console.log(rowData);
      },
      actionName: 'Add Trade',
      appearance: 'primary-gradient',
    },
    pinned: 'right',
  };
```

## Custom column config

If you want to customise how each column is displayed, you can provide column config for every column.

Create a new file called positionColumnDefs.ts in the same directory.

```typescript title="positionColumnDefs.ts"
export const positionColumnDefs: ColDef[] = [
  {field: 'INSTRUMENT_NAME', headerName: 'Instrument', sort: 'desc', flex: 2},
  {field: 'QUANTITY', headerName: 'Quantity', valueFormatter: formatNumber(0), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'CURRENCY', headerName: 'Ccy', flex: 1, enableCellChangeFlash: true},
  {field: 'NOTIONAL', headerName: 'Traded Value', valueFormatter: formatNumber(2), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'VALUE', headerName: 'Market Value', valueFormatter: formatNumber(2), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'PNL', headerName: 'PNL', valueFormatter: formatNumber(2), type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
];
```

To stop automatic generation of columns, you need to add the `only-template-col-defs` attribute to the zero-ag-grid.

Then use the [repeat](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive) directive; this includes all the columns from our column config array.


```typescript {4,10-12} title="home.template.ts"
import {positionColumnDefs} from './positionColumnDefs.ts';

<zero-ag-grid
    only-template-col-defs
    >
    <ag-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </ag-genesis-datasource>
    ${repeat(() => positionColumnDefs, html`
    <ag-grid-column :definition="${x => x}" />
    `)}
    <ag-grid-column :definition="${x => x.singlePositionActionColDef}" />
</zero-ag-grid>
```

## Saving user preferences

You can add the `persist-column-state-key` to the zero-ag-grid to persist user changes to things such as sorting, column order, and visibility on their machine. With this, when the user reloads the browser, they get the same configuration.

```html {2}
<zero-ag-grid
    persist-column-state-key='position-grid-settings'
>
```


[//]: # (link to zero-ag-grid tsdocs)


