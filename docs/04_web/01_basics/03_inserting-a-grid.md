---
title: 'Web Basics - Inserting a grid'
sidebar_label: 'Inserting a grid'
id: inserting-a-grid
keywords: [web, basics, inserting a grid]
tags:
    - web
    - basics
    - inserting a grid
---

In this example, we shall add a grid to our new page. This grid will display data from a Data Server resource on the server. In this case, the resource is called ALL_TRADES. The logic would be the same for any other.

More specifically, we will be adding:

- a simple wrapper div for styling/sizing purposes
- a `zero-grid-pro` grid component
- a `grid-pro-genesis-datasource` component, which makes the actual connection to the server resource and provides data to the grid

 

:::info
For static data, the lightweight [DataGrid](/web/web-components/grids/data-grid/) is recommended instead. 
:::

## The wrapper class

Keeping this one simple, just add a `div` with class `wrapper` to our template:  **src/routes/test-page/test-page.template.ts**.

```javascript
  <div class="wrapper">
    <!-- The grid will go in here. -->
  </div>
```

And to make it full size, add this code to the file **src/routes/test-page/test-page.styles.ts**:

```css
  .wrapper {
    height: 100%;
    width: 100%;
  }
```

## Adding the grid component
Now, we need to add the grid component inside the wrapper div. In this example, we have left a comment to show where the data source will be added:

```javascript
  <div class="wrapper">
    <zero-grid-pro>
      <!-- The datasource will go in here. -->
    </zero-grid-pro>
  </div>
```

## Adding the data source
Now we can see the same code snippet when the data source (ALL_TRADES) has been added:
 

```javascript
  <div class="wrapper">
    <zero-grid-pro>
      <grid-pro-genesis-datasource resourceName="ALL_TRADES" />
    </zero-grid-pro>
  </div>
```

With these few lines of code, we already have a fully functional grid:
![](/img/all-trades-grid-01.png)

## Configuring the datasource and customising the grid  

Let's say we want the incoming data from the server ordered by a specific column, and we also want a custom height for our rows.  

We just need to set a few properties on our grid and datasource components. In this case, we add a `rowHeight` to our grid and specify `orderBy` in our connection to the resource:

```javascript
  <div class="wrapper">
    <zero-grid-pro rowHeight="45">
      <grid-pro-genesis-datasource resourceName="ALL_TRADES" orderBy="TRADE_DATETIME" />
    </zero-grid-pro>
  </div>
```

## Custom column definitions
Here are some more ways to customise the grid:

- show only a subset of the columns 
- provide custom headers and value formatters
- enable flashing on updates

We can achieve this by providing our own custom column definitions.

In this case, we have defined custom definitions for ten fields. For each of these, we have specified  a value for `headerName` and we have set `enableCellChangeFlash: true`.

Then, in the export, we have added the line `${repeat(() => tradeColumnDefs, html` `, which takes in all the definitions.

```javascript
import {html, repeat} from '@microsoft/fast-element';
import {formatDateLong, formatNumber} from '../../utils/formatting';
import type {TestPage} from './test-page';

export const tradeColumnDefs = [
  {field: 'INSTRUMENT_NAME', headerName: 'Instrument', enableCellChangeFlash: true, flex: 3},
  {field: 'SIDE', headerName: 'Side', cellClass: 'status-cell', enableCellChangeFlash: true, flex: 1},
  {field: 'QUANTITY', headerName: 'Quantity', valueFormatter: formatNumber(0), type: 'rightAligned', enableCellChangeFlash: true, flex: 1},
  {field: 'CURRENCY', headerName: 'Ccy', enableCellChangeFlash: true, flex: 1},
  {field: 'PRICE', headerName: 'Price', valueFormatter: formatNumber(2), type: 'rightAligned', enableCellChangeFlash: true, flex: 2},
  {field: 'CONSIDERATION', headerName: 'Consideration', valueFormatter: formatNumber(2), type: 'rightAligned', enableCellChangeFlash: true, flex: 2},
  {field: 'TRADE_DATETIME', headerName: 'Date', valueFormatter: rowData => formatDateLong(rowData.data.TRADE_DATETIME), sort: 'desc', enableCellChangeFlash: true, flex: 2},
  {field: 'COUNTERPARTY_NAME', headerName: 'Counterparty', enableCellChangeFlash: true, flex: 2},
  {field: 'TRADE_STATUS', headerName: 'Trade State', cellClass: 'status-cell', enableCellChangeFlash: true, flex: 2},
  {field: 'ENTERED_BY', headerName: 'Entered By', enableCellChangeFlash: true, flex: 2},
];

export const TestPageTemplate = html<TestPage>`
  <div class="wrapper">
    <zero-grid-pro rowHeight="45" only-template-col-defs enabledRowFlashing >
      <grid-pro-genesis-datasource resourceName="ALL_TRADES" orderBy="TRADE_DATETIME" />
      ${repeat(() => tradeColumnDefs, html`
        <grid-pro-column :definition="${x => x}" />
      `)}
    </zero-grid-pro>
  </div>
`;
```

Here is the result:

![](/img/all-trades-grid-02.png)


## Going further

If you want to get more complex, you can create your own grid component; you do this the same way you created the `TestPage` component. In the example below, the component is called `positions-grid-pro`. 

Note we are extending the `ZeroGridPro`, not the `fast-element`.


```javascript
import {ZeroGridPro, zeroGridProTemplate} from '@genesislcap/foundation-zero-grid-pro';
import {customElement} from '@microsoft/fast-element';
import {positionsGridStyles} from './grid-pro.styles';

@customElement({
  name: 'positions-grid-pro',
  template: zeroGridProTemplate,
  styles: positionsGridStyles,
})
export class PositionsAgGrid extends ZeroGridPro {
}
```

Now you need to provide custom styles for the custom component:

```javascript

import {css, ElementStyles} from '@microsoft/fast-element';
import {BUY_SIDE, SELL_SIDE, NEW_TRADE_STATUS, CANCELLED_TRADE_STATUS} from './colors';

export const positionsGridStyles: ElementStyles = css`
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

## Final result

And so we have our result:

![](/img/all-trades-grid-03.png)

:::info
You can read more about our grid components and configuration options them under the [Web UI reference](/web/web-components/grids/grid-pro/grid-pro-intro/) for grids.
:::
