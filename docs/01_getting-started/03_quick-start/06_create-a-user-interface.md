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

Next, create a zero-ag-grid in `HomeTemplate const`.

```ts
export const HomeTemplate = html<Home>`
<zero-card class="trade-card">
    <zero-ag-grid ${ref('tradesGrid')} rowHeight="45" only-template-col-defs>
    ${when(x => x.connection.isConnected, html`
      <ag-genesis-datasource resourceName="ALL_TRADES"></ag-genesis-datasource>
      ${repeat(() => tutorialColumnDefs, html`
        <ag-grid-column :definition="${x => x}" />
      `)}
    `)}
    </zero-ag-grid>
</zero-card>
`;
```

Now open the file **home.ts**. Define a reference to `zero-ag-grid`; in class `home`, add:

```ts
public tradesGrid!: AgGrid;
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
zero-ag-grid {
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
  <zero-option value='BUY'>BUY</zero-option>
  <zero-option value='SELL'>SELL</zero-option>
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
