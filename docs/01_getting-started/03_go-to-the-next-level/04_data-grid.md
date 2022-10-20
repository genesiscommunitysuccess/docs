---
title: 'Show data using Data Grid'
sidebar_label: 'Show data using Data Grid'
id: data-grid
---

## Prerequisites

There are a couple of steps that have to be done before seeing the user interface running.
- your database must be running
- the back-end services must be deployed
- you must have imported the example data in the csv files

### Connecting the back end and front end
In this step, we shall configure an nginx server working as a reverse proxy.

In your CentOS terminal, enter the following three commands:

1.  Enter your artifactory credentials:
```shell
docker login genesisglobal-docker-internal.jfrog.io
...

2. Pull the latest version of the Genesis software:
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
...

3. Run the following command:
```shell
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
...


### Installing the dependencies

Before we make any changes, you need to install your npm dependencies; run the following in your terminal:

```shell title="./client"
npm run bootstrap
```

Once you have all dependencies installed, use the following command in the terminal to run your UI: 

```shell title="./client"
npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

## Section objectives
The goal of this section is to run the UI for the first time and add a data grid.

## Showing all positions 

For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

In the template file, start by adding the Genesis data source pointing to the appropriate resource name; this must be wrapped in a grid of your choice.

[//]: # (link to grid-pro-genesis-datasource tsdocs)
```html title="home.template.ts"
<zero-grid-pro>
    <grid-pro-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </grid-pro-genesis-datasource>
</zero-grid-pro>
```

This will result in a grid displaying all the columns available in the `ALL_POSITIONS` resource:

![](/img/positions-grid.png)

## Grid interaction

To add new columns that are not part of the API, we can add additional column definitions.

```html {6} title="home.template.ts"
<zero-grid-pro>
    <grid-pro-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </grid-pro-genesis-datasource>
    <grid-pro-column :definition="${x => x.singlePositionActionColDef}" />
</zero-grid-pro>

```

In the component definition file, we can provide a method that enables us to interact with the rest of the class.
The example below creates a column with a button that logs data in the row to the console.
Here you can easily swap logging the row data with some custom logic (such as calling a back-end api, which we shall cover in more detail later on).

```typescript title="home.ts"
  public singlePositionActionColDef = {
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

After refreshing the application, the grid should now also include a column containing a button:

![](/img/positions-grid-with-button.png)

## Custom column config

If you want to customise how each column is displayed, you can provide a column config for every column.

Create a new file called **positionColumnDefs.ts** in the same directory.

```typescript title="positionColumnDefs.ts"
export const positionColumnDefs = [
  {field: 'INSTRUMENT_ID', headerName: 'Instrument', sort: 'desc', flex: 2},
  {field: 'QUANTITY', headerName: 'Quantity', type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'NOTIONAL', headerName: 'Traded Value', type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'VALUE', headerName: 'Market Value', type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
  {field: 'PNL', headerName: 'PNL', type: 'rightAligned', flex: 1, enableCellChangeFlash: true},
];
```

To stop automatic generation of columns, you need to add the `only-template-col-defs` attribute to the zero-grid-pro.

Then use the [repeat](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive) directive; this includes all the columns from our column config array.


```typescript {1,2,6,12-14} title="home.template.ts"
import {positionColumnDefs} from './positionColumnDefs';
import {repeat} from '@microsoft/fast-element';

<zero-grid-pro only-template-col-defs>
    <grid-pro-genesis-datasource
        resourceName="ALL_POSITIONS"
        orderBy="INSTRUMENT_ID">
    </grid-pro-genesis-datasource>
    ${repeat(() => positionColumnDefs, html`
    <grid-pro-column :definition="${x => x}"></grid-pro-column>
    `)}
    <grid-pro-column :definition="${x => x.singlePositionActionColDef}"></grid-pro-column>
</zero-grid-pro>
```

Columns will now flash green as the value inside changes:
![](/img/positions-grid-with-cell-change-flash.png)

## Saving user preferences

You can add the `persist-column-state-key` to the zero-grid-pro to persist user changes to things such as sorting, column order, and visibility on the user machine. With this, when the user reloads the browser, they get the same configuration.

```html {2}
<zero-grid-pro
    persist-column-state-key='position-grid-settings'
>
```


[//]: # (link to zero-grid-pro tsdocs)


