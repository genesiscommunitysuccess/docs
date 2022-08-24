---
title: 'Show data using Data Grid'
sidebar_label: 'Show data using Data Grid'
id: data-grid
---

For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

Before we make any changes you need to install your npm dependencies by running in your terminal

```shell
npm run bootstrap
```

Once you have all dependecies install you can run your UI with following command in terminal

```shell
npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)


In the template file we start by adding genesis data source pointing to appropriate resource name and wrapped in a grid of our choice. For this example we will use ag-grid.

[//]: # (link to ag-genesis-datasource tsdocs)
```html title="home.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </ag-genesis-datasource>
</zero-ag-grid>
```

This will result in grid displaying all the columns available in the for this resource.

### Grid interaction

To add new columns that are not part of the API we can add additional column definitions.

```html {6} title="home.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
            resourceName="ALL_POSITIONS"
            orderBy="INSTRUMENT_ID">
    </ag-genesis-datasource>
    <ag-grid-column :definition="${x => x.singlePositionActionColDef}" />
</zero-ag-grid>

```

In component definition file we can provide method that will allow us to interact with the rest of the class.
The example below would create a column with a button that will log data in the row to the console.
Here you can easily swap logging the row data with some custom logic like calling backend api that we will cover in more details later on.

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

### Providing custom column config

If we want to fully customise how columns are displayed we can provide column config for every column.

Create a new file called positionColumnDefs.ts in the same directory
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

To stop automatic generation of columns we need to add `only-template-col-defs` attribute to the zero-ag-grid.

Then we use [repeat](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive) directive to include all the columns from our column config array


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

### Saving user preferences

Additionally, we can supply another attribute to zero-ag-grid called `persist-column-state-key` that would persist users changes to things like sorting, column order, visibility and others on their machine so when they reload the browser they would end up with the same configuration

```html {2}
<zero-ag-grid
    persist-column-state-key='position-grid-settings'
>
```


[//]: # (link to zero-ag-grid tsdocs)


