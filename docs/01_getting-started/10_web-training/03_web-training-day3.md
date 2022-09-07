---
id: web-training-day3
title: Day 3
sidebar_label: Day three
sidebar_position: 5

---
# Day 3 agenda
Custom data grids, client-side options and filters.

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
Here you can easily swap logging the row data with some custom logic (such as calling a back-end API that we shall cover in more detail later on).

```typescript {3,7,10} title="order.ts"
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
- [Cell Renderers](/front-end/web-components/grids/ag-grid/ag-genesis-cell/)
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

### Exercise 3.1: getting familiar with Genesis ag-grid attributes
:::info estimated time
15min
:::
Change the row height of the data grid to '20 px'.

:::tip More Genesis ag-grid attributes
You can find all the additional attributes and props, including row height, of the Genesis ag-grid at [Genesis ag-grid documentation](/front-end/web-components/grids/ag-grid/ag-grid-intro/).
:::


### Exercise 3.2: adding CANCEL action column
:::info estimated time
40min
:::
Add a new action column called 'Cancel' that calls `EVENT_ORDER_CANCEL` event handler. If an error is returned by the Event, make sure to display an error message.

Note that the event will actually delete the order.

:::tip calling event handlers
If you struggle, make sure to revisit this previous lesson on [calling event handlers](/getting-started/web-training/web-training-day2/#sending-the-data).
:::

## Creating our own grid component
It's possible to create your own grid component if you want something completely customized. We can do that creating a new customElement. 

In the example below, the component is called `positions-ag-grid`. 

```javascript {10}
import {AgGrid as AgGridZero, zeroAgGridTemplate} from '@genesislcap/foundation-zero';
import {customElement} from '@microsoft/fast-element';
import {positionsAgGridStyles} from './ag-grid.styles';

@customElement({
  name: 'positions-ag-grid',
  template: zeroAgGridTemplate,
  styles: positionsAgGridStyles,
})
export class PositionsAgGrid extends AgGridZero {
}
```

Note we are extending `AgGridZero`, not `FASTElement`.

Now you need to provide custom styles for the custom component:

```javascript
import {zeroAgGridStyles} from '@genesislcap/foundation-zero';
import {css, ElementStyles} from '@microsoft/fast-element';
import {BUY_SIDE, SELL_SIDE, NEW_TRADE_STATUS, CANCELLED_TRADE_STATUS} from './colors';

export const positionsAgGridStyles: ElementStyles = css`
  ${zeroAgGridStyles}

  .status-cell {
    display:flex;
    align-items: center;
    margin-left: 6px;
  }
  
  .status-cell::after {
    content: "";
    position: absolute;
    left: 6px;
    height: 100%;
    width: 3px;
  }

  .buy-side-trade.status-cell::after {
    background-color: ${BUY_SIDE};
  }

  .buy-side-trade {
    color: ${BUY_SIDE};
  }

  .sell-side-trade.status-cell::after {
    background-color: ${SELL_SIDE};
  }

  .sell-side-trade {
    color: ${SELL_SIDE};
  }

  .new-status-trade.status-cell::after {
    background-color: ${NEW_TRADE_STATUS};
  }

  .new-status-trade {
    color: ${NEW_TRADE_STATUS};
  }

  .cancel-status-trade.status-cell::after {
    background-color: ${CANCELLED_TRADE_STATUS};
  }

  .cancel-status-trade {
    color: ${CANCELLED_TRADE_STATUS};
  }
`;
```

This allows us to enhance the column definitions by adding conditional classes:

```javascript
const tradeCellClassRules = {
  'buy-side-trade': params => params.value === 'BUY',
  'sell-side-trade': params => params.value === 'SELL',
  'new-status-trade': params => params.value === 'NEW',
  'cancel-status-trade': params => params.value === 'CANCELLED',
};

export const tradeColumnDefs: ColDef[] = [
  {field: 'INSTRUMENT_NAME', headerName: 'Instrument', enableCellChangeFlash: true, flex: 3},
  {field: 'SIDE', headerName: 'Side', cellClass: 'status-cell', cellClassRules: tradeCellClassRules, enableCellChangeFlash: true, flex: 1},
  {field: 'QUANTITY', headerName: 'Quantity', valueFormatter: formatNumber(0), type: 'rightAligned', enableCellChangeFlash: true, flex: 1},
  {field: 'CURRENCY', headerName: 'Ccy', enableCellChangeFlash: true, flex: 1},
  {field: 'PRICE', headerName: 'Price', valueFormatter: formatNumber(2), type: 'rightAligned', enableCellChangeFlash: true, flex: 2},
  {field: 'CONSIDERATION', headerName: 'Consideration', valueFormatter: formatNumber(2), type: 'rightAligned', enableCellChangeFlash: true, flex: 2},
  {field: 'TRADE_DATETIME', headerName: 'Date', valueFormatter: rowData => formatDateLong(rowData.data.TRADE_DATETIME), sort: 'desc', enableCellChangeFlash: true, flex: 2},
  {field: 'COUNTERPARTY_NAME', headerName: 'Counterparty', enableCellChangeFlash: true, flex: 2},
  {field: 'TRADE_STATUS', headerName: 'Trade State', cellClass: 'status-cell', cellClassRules: tradeCellClassRules, enableCellChangeFlash: true, flex: 2},
  {field: 'ENTERED_BY', headerName: 'Entered By', enableCellChangeFlash: true, flex: 2},
];
```

### Final result

And so we have our result:

![](/img/all-trades-grid-03.png)

Looks good, doesn't it?

### Exercise 3.3: extending Ag Grid
:::info estimated time
30min
:::
Create a OrdersAgGrid extending AgGridZero and apply the same style on the `SIDE` field of the PositionsAgGrid in the OrdersAgGrid - i.e., SIDE will be green when ***BUY*** and red when ***SELL***.

### Adding filters to the Orders data grid

The way we have been using ag-grid so far is encapsulating a Genesis datasource to have access to Data Server resources. This makes it easier to retrieve data without worrying about the connection, handling update events and so on. This is called [connected data](/front-end/web-components/grids/ag-grid/ag-grid-connected/).

[Genesis datasource](/front-end/web-components/grids/ag-grid/ag-genesis-datasource/) offers some [attributes](/front-end/web-components/grids/ag-grid/ag-genesis-datasource/#attributes-and-props) to parametrise how to retrieve the data. Some commonly used attributes are:

- **`criteria: string`**: a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: Expr.dateIsBefore(TRADE_DATE,'20150518') or QUANTITY > 10000.

- **`orderBy: string`**: This option can be used to select a data server index (defined in tables-dictionary.kts), which is especially useful if you want the data to be sorted in a specific way. By default, data server rows will be returned in order of creation (from oldest database record to newest).

- **`resourceName: string`**: The target [Data Server](/server-modules/data-server/introduction/) or [Request Server](/server-modules/request-server/introduction/) name. Example: "ALL_TRADES" or "ALT_COUNTERPARTY_ID"

As you may have noticed, we've already used `resourceName` and `orderBy` when we used the ag-genesis-datasource for the first time. 

Now, let's see how we'd use `criteria` to add some filters to the data grid. In the example below, only orders whose side is BUY would be displayed:

```ts {4} title='order.template.ts'
<ag-genesis-datasource
    resourceName="ALL_ORDERS"
    orderBy="ORDER_ID"
    criteria="SIDE == 'BUY'"
>
</ag-genesis-datasource>
```

Having a static filter like that is not always very useful though. Let's make it more dynamic adding a button in the order screen to filter by side and make the criteria read the side to be filtered dynamically:

```ts {1,6} title='order.template.ts'
<zero-button @click=${x=> x.toggleSideFilter()}>Toggle SIDE filter</zero-button>

<ag-genesis-datasource
        resourceName="ALL_ORDERS"
        orderBy="ORDER_ID"
        criteria="SIDE == '${x=>x.sideFilter}'">
</ag-genesis-datasource>
```

```ts title='order.ts'
@attr public sideFilter = 'BUY';

public toggleSideFilter() {
    this.sideFilter = this.sideFilter == 'BUY' ? 'SELL' : 'BUY';
}
```

Make sure to try it now and click on the 'Toggle SIDE filter' button to see the filter being applied.

Ultimately, we can use something like the [ref directive](https://www.fast.design/docs/fast-element/using-directives/#the-ref-directive) to make our code completely override the criteria. So, let's add another button to reset the criteria to something else and use the `ref` in ag-genesis-datasource.

```ts {1,3} title='order.template.ts'
<zero-button @click=${x=> x.customFilter()}>No filters</zero-button>

<ag-genesis-datasource ${ref('ordersGrid')}
        resourceName="ALL_ORDERS"
        orderBy="ORDER_ID"
        criteria="SIDE == '${x=>x.sideFilter}'">
    </ag-genesis-datasource>
```

Add the ordersGrid property and customFilter method to the Order class:
```ts {1,3} title='order.ts'
@observable ordersGrid: any;

public customFilter() {
    this.ordersGrid.criteria = `SIDE == 'BUY' || SIDE == 'SELL'`;
  }
```

As you can see, there's a reference in the Order class to the ag-genesis-datasource element called `ordersGrid` and we can set its attributes, such as the ***criteria*** attribute, to any value we want.

### Data server client-side options

It's also possible to add those attributes, such as `criteria` and `orderBy` (with slightly different naming conventions), to the `Connect` object from Foundation Comms. See example below:

```ts {2}
// retrieving access type of currently logged-in user
const userReq = await this.connect.snapshot('ALL_USERS', {
    CRITERIA_MATCH: `USER_NAME == '${this.session.getItem('username')}'`,
});
```

To see a list of all attributes look at [Data server client-side options](/server-modules/data-server/advanced/#client-side-runtime-options).

:::info user session
As a side note, the code above also tells us how to retrieve the current logged-in user from the session, which is actually stored in the local storage of the browser. 

To find out more, inspect the Local Storage of your browser to see all the data that is being stored. In Chrome, press F12 to open DevTools, then go to `Application -> Storage -> Local Storage -> http://localhost:6060/`.
:::

### Exercise 3.4: using criteria
:::info estimated time
20min
:::
Add a new field `minimumQuantity` that the user can enter the minimum quantity of an order to be displayed in the grid. I.e., filter orders by a minimum quantity entered by the user.

