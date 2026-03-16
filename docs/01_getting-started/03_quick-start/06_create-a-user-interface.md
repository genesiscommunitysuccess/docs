---
title: 'Create a user interface'
sidebar_label: 'Create a user interface'
id: create-a-user-interface
---

Now let's create a single page with a grid and a form for entering data.

Before you start, check if you have set a valid API_HOST in **client/web/package.json**.

The syntax for the API_HOST is:
- protocol (followed by a colon delimiter)
- secure websocketshost (followed by a colon delimiter)
- port (443 is the port assigned for secure HTTP traffic)
- /gwf/ (this is the standard path for Genesis platform)

for example: ws://localhost:443/gwf/



For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

You are going to update these files so that the application displays a single page and enables you to insert a new trade.


### Grid

We want to be able to insert a grid with data into our page. For this, open the file **home.template.ts** and define `tutorialColumnDefs`.

First, define `tutorialColumnDefs` after the `import` block using the snippet below:

```ts
export const tutorialColumnDefs: ColDef[] = [
  {field: 'TRADE_ID', headerName: 'TRADE_ID'},
  {field: 'SYMBOL', headerName: 'SYMBOL'},
  {field: 'QUANTITY', headerName: 'QUANTITY'},
  {field: 'PRICE', headerName: 'PRICE', valueFormatter: formatNumber(2)},
  {field: 'DIRECTION', headerName: 'DIRECTION'},
];
```

Next, create a `rapid-grid-pro` in `HomeTemplate const`.

```ts
export const HomeTemplate = html<Home>`
<rapid-card class="trade-card">
    <rapid-grid-pro ${ref('tradesGrid')} rowHeight="45" only-template-col-defs>
    ${when(x => x.connection.isConnected, html`
      <grid-pro-genesis-datasource resource-name="ALL_TRADES"></grid-pro-genesis-datasource>
      ${repeat(() => tutorialColumnDefs, html`
        <grid-pro-column :definition="${x => x}"></grid-pro-column>
      `)}
    `)}
    </rapid-grid-pro>
</rapid-card>
`;
```

Now open the file **home.ts**. Define a reference to `rapid-grid-pro`; in class `home`, add:

```ts
public tradesGrid!: GridPro;
```

and at the end of the `connectedCallback()` function, add:
```ts
this.tradesGrid.addEventListener('onGridReady', () => {
  this.tradesGrid.gridApi.addEventListener('firstDataRendered', () => {
    this.tradesGrid.gridApi.sizeColumnsToFit();
  });
});
```

This ensures that the grid takes the full width.

Now you need to add styles.

Open the file **home.styles.ts**, and add the code below.

```css
rapid-grid-pro {
  width: 100%;
  height: 50%;
}

.trade-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```


### Keeping the grid data fresh

When you commit changes back to the server (for example by inserting, modifying, or deleting a trade), the datasource can be configured to poll for fresh data when specific server events are acknowledged. In newer versions of the UI components, this is done via an optional `pollTriggerEvents` setting on the datasource configuration, which lists the event names that should trigger an extra poll.

For higher-level components such as entity management screens, the standard create, update, and delete events are automatically added as polling triggers, so the underlying grids are refreshed after each CRUD operation even if no polling interval is configured.


### Form
Here, you are going to create a form with four inputs, so a user can input details of a new trade.

First, define the variables that will hold the values that are entered.

In the file **home.ts**, add the following properties to the class: `Home`:

```ts
@observable public quantity: string;
@observable public price: string;
@observable public tradeSymbol: string;
@observable public tradeSide: string = 'BUY';
```

Now go to the file **home.template.ts**. Add the following code after `zero-ag-grid`.

```ts
<span>Add Trade</span>
<zero-text-field type="number" :value=${sync(x=> x.quantity)}>
  <span>Quantity</span>
</zero-text-field>
<zero-text-field type="number" :value=${sync(x=> x.price)}>
  <span>Price</span>
</zero-text-field>
<zero-text-field type="text" :value=${sync(x=> x.tradeSymbol)}>
  <span>Symbol</span>
</zero-text-field>
<span>Side</span>
<zero-select @change=${((x, c)=> x.tradeSideChange(c.event.target as Select))}>
  <zero-option>BUY</zero-option>
  <zero-option>SELL</zero-option>
</zero-select>
```

To handle the value in `zero-select`, create a function in the file **home.ts**.

```ts
public tradeSideChange(target: Select) {
  this.tradeSide = target.selectedOptions[0]?.value;
}
```

In the file **home.styles.ts**, add styles to see your changes:

```css
zero-text-field, zero-select {
  width: 250px;
}

span:first-of-type, zero-button {
  margin-top: 10px;
}
```



### Button
Now add a button.  The purpose of this is to insert the data from the form into the database (and the grid).

In the file **home.template.ts**, add the following code after `zero-select`.

```ts
<zero-button @click=${x=> x.insertTradeData()}>Add Trade</zero-button>
```

In the file **home.ts**, create a function to handle the connection to the server.

First, add just like before:

```ts
@observable public serverResponse;
```

Then, at the very end of the class, add:

```ts
public async insertTradeData() {
  this.serverResponse = await this.connection.commitEvent('EVENT_TRADE_INSERT', {
    DETAILS: {
      SYMBOL: this.tradeSymbol,
      QUANTITY: this.quantity,
      PRICE: this.price,
      DIRECTION: this.tradeSide,
    },
    IGNORE_WARNINGS: true,
    VALIDATE: false,
  });
  this.tradeSymbol = '';
  this.quantity = '';
  this.price = '';
  logger.debug('EVENT_TRADE_INSERT result -> ', this.serverResponse);
}
```

To check that the new trade was added successfully, go to the file **home.template.ts**; add the following code before the `Add trade` span:

```ts
${when(x => x.serverResponse, html`
<span>${x=> x.serverResponse.MESSAGE_TYPE == 'EVENT_ACK' ? 
  'Successfully added trade' : 'Something went wrong'}
</span>
`)}
```

At this point, the application is now able to display data from the server and make changes. You are ready to run the application.
