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


### Adding the new Order modal

Let's start with the simplest way to create a form, using the `zero-form` component:

```html {6} title='order.template.ts'
import type {Order} from './order';

export const OrderTemplate = html<Order>`
<div class="split-layout">
    <div class="top-layout">
      <zero-form class="order-entry-form" resourceName="EVENT_ORDER_INSERT"></zero-form>
    </div> 
</div>
`;
```

This component is able to retrieve the meta-data from the `EVENT_INSERT_ORDER` backend resource (an Event Handler) and automatically builds a simple form for you. In simple scenarios, it can be good enough.

Try to run it now and you'll notice that, even though the form is displayed, nothing happens when you click on Submit. We have to bind the submit button to a function, like this:
```html {3} title='order.template.ts'
<zero-form
  resourceName="EVENT_INSERT_ORDER"
  @submit=${(x, c) => x.insertOrder(c.event as CustomEvent)}
></zero-form>
```
:::tip what is the @ and ${(x, c)} ?
This is related to binding as we briefly explained in the previous day. If it's still unclear, make sure to check [Understanding bindings](https://www.fast.design/docs/fast-element/declaring-templates#understanding-bindings) and [Events](https://www.fast.design/docs/fast-element/declaring-templates#events)
:::

We define `insertOrder` function in order.ts

```typescript title='order.ts'
  import {Connect} from '@genesislcap/foundation-comms';
  
  @Connect connect: Connect;

  public async insertOrder(event) {
    const formData = event.detail;
    const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
      DETAILS: {
        COUNTERPARTY_ID: 'GENESIS',
        INSTRUMENT_ID: formData.INSTRUMENT_ID,
        QUANTITY: formData.QUANTITY,
        PRICE: formData.PRICE,
        SIDE: formData.SIDE,
        ORDER_DATETIME: Date.now(),
      },
    });
  }
```

INTRODUCE GENESIS COMMS and EXPLAIN CONNECT!

This approach is good for simple forms or prototyping, but we might realise that it is not enough for our use case, and we require much more customisation.

To enable that you will create each form element manually and take care of storing user inputted data.

You start by adding elements to the template

```html title='order.template.ts' 
<zero-text-field>Quantity</zero-text-field>
<zero-text-field type="number">Price</zero-text-field>
<span>Instrument</span>
<zero-select></zero-select>
<span>Side</span>
<zero-select></zero-select>
```

Then, define the variables that will hold the values that are entered.

In the file **order.ts**, add the following properties to the class: `Order`:

```ts title='order.ts'
@observable public quantity: string;
@observable public price: string;
@observable public instrument: string;
@observable public side: string = 'BUY';
```

Now we need to add event handlers that would respond to user changes and store the inputted data

We can do it in traditional way by adding `@change` [event handler](https://www.fast.design/docs/fast-element/declaring-templates#events) but we can also use the `sync` directive that would do that for us.
Let's add it to each form element:

```html title='order.template.ts' 
<zero-text-field :value=${sync(x=> x.quantity)}>Quantity</zero-text-field>
<zero-text-field :value=${sync(x=> x.price)}>Price</zero-text-field>
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)}></zero-select>
<span>Side</span>
<zero-select :value=${sync(x=> x.side)}></zero-select>
```

You probably realize that we don't have any options in our select component so let's fix that now.
We will start with side as it only has two static options BUY and SELL so we just need to add those two options inside select tag

```html title='order.template.ts' 
<zero-select :value=${sync(x=> x.side)}>
    <zero-option>BUY</zero-option>
    <zero-option>SELL</zero-option>
</zero-select>
```

For instrument, it's more complicated because list of options needs to be fetched from the API.

We will do that in [connectedCallback](https://www.fast.design/docs/fast-element/defining-elements#the-element-lifecycle) which happens when element is inserted into the DOM
First, declare `orderInstruments` that will be later used in the template.
To get the data from the API we inject
```typescript title='order.ts'
@observable orderInstruments: Array<{value: string, label: string}>;
@Connect connect: Connect;

public async connectedCallback() {
    super.connectedCallback();
    
    const orderInstrumentsRequest = await this.connect.request('INSTRUMENT');
    this.orderInstruments = orderInstrumentsRequest.REPLY?.map(instrument => ({value: instrument.INSTRUMENT_ID, label: instrument.NAME}));
}
```

Once we have the data with the list of instruments we can make use of it in the template file
To dynamically include list of options we use [repeat](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive) directive and iterate through the items

```typescript title='order.template.ts' 
<zero-select :value=${sync(x=> x.instrument)}>
  ${repeat(x => x.orderInstruments, html`
    <zero-option value=${x => x.INSTRUMENT_ID}>${x => x.NAME}</zero-option>
  `)}
</zero-select>
```

Now when we gathered all the data we're ready to send it over the wire:

We create a simple button with click event handler:
```html title='order.template.ts'
<zero-button @click=${x=> x.insertOrder()}>Add Order</zero-button>
```

Then we create a new API call to insert order
```typescript title='order.ts'
public async insertOrder() {
  const insertOrderRequest = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
    DETAILS: {
      COUNTERPARTY_ID: 'GENESIS',
      INSTRUMENT_ID: this.instrument,
      QUANTITY: this.quantity,
      PRICE: this.price,
      SIDE: this.orderSide,
      ORDER_DATETIME: Date.now(),
    },
    IGNORE_WARNINGS: true,
    VALIDATE: false,
  });
}
```

Now if everything went well you can go to your browser insert the data, click the button, and you should see new order showing up in the data grid you set up in [previous chapter](/getting-started/go-to-the-next-level/data-grid)

### Exercise 2.1: using Genesis Comms
:::info estimated time
30min
:::
Load some field with Genesis Comms, or do some error handling reading the response from the Event

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

### Custom column config

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

### Saving user preferences

You can add the `persist-column-state-key` to the zero-ag-grid to persist user changes to things such as sorting, column order, and visibility on their machine. With this, when the user reloads the browser, they get the same configuration.

```html {2}
<zero-ag-grid
    persist-column-state-key='order-grid-settings'
>
```


### Exercise 2.2: customizing the grid
:::info estimated time
30min
:::
Change the row height of the data grid to '20 px' and add a new column called 'See order' that opens a window.alert with the row data.

:::tip More Genesis ag-grid attributes
You can find all the additional attributes and props, including row height, of the Genesis ag-grid at [Genesis ag-grid documentation](/front-end/web-components/grids/ag-grid/ag-grid-intro/)
:::


### Adding the edit and cancel Order action

## Exercises
- Add a new action 'delete order'
- Display more data on 'Market data' and 'Symbol'
- Add a new field dropdown 'Order on behalf' listing all USERs, must select one or none

