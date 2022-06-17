---
id: training-content-day2
title: Day 2
sidebar_label: Day 2
sidebar_position: 2

---
In this day we are covering:

- [Intro to UI](#intro-to-ui)
- [Create a user interface](#create-a-user-interface)
- [Extend the data model](#extend-the-data-model)

## Intro to UI

Genesis provides a modern future-proofed web stack on top of [Microsoft FAST](https://www.fast.design/docs/introduction/), which is a lightweight abstraction that enables you to easily ​build performant, memory-efficient, standards-compliant ​Web Components.

### Web components

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are at the very heart of our strategy, based on native browsers and a standards-based ​component model. 

Web Components are custom html elements that completely encapsulate their logic to create self-contained reusable components, that do not clash or interfere with the rest of application. They are future-proof and interoperable with traditional web frameworks.

We currently offer over 40 web components that are ready to go, but that number is growing and we can also work with our clients to create bespoke web components for their specific needs. Frameworks like React, Angular, Vue and so on, have traditionally offered component models to developers, however Web Components are literally, the standard component model of the web, written into the HTML specification. Applications themselves can be fully encapsulated web components too, for example YouTube is a web component, made up of many smaller web components.

### Genesis packages​

Our components are distributed as npm packages, such as:

`@genesislcap/foundation-ui` 
When you generate a design system using CLI it will automatically extend a base design system that we have provided. ​This highly configurable design system is called Genesis Foundation UI. It is made up of a set of web components and accompanying design tokens. The visual design can be impacted in myriad ways using the tokens, CSS, element templates and shadow DOM options as necessary for your application.

`@genesislcap/foundation-zero` 
The zero design system variant​.

`@genesislcap/foundation-utils​` 
Useful components to be used mostly in your templates.

`@genesislcap/foundation-comms` 
Core foundation UI communication system with the server.

:::tip
Key takeaways

**foundation-ui** will give you the standard components like buttons and data grids, which can be easily integrated with the back end using component attributes such as 'resourceName' that displays and updates data in real-time from a data server resource.

**foundation-comms** will give you, for example, Connection components that you can use to connect to the server and do things like subscribing to data streams, commit events or request data.

There are many more packages, but that's what we need for now to develop our application.
:::


## Create a user interface

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

Now you need to add [styles](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/customisation/app-specific/#styles).

Open the file [**home.styles.ts**](/creating-applications/defining-your-application/user-interface/front-end-basics/front-end-basics/#starting-materials), and add the code below.

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

In the file **home.styles.ts**, add [styles](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/customisation/app-specific/#styles) to see your changes:

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

At this point, the application is now able to display and receive data.

### Running the application locally 

Now you are ready to run the application you have created for the front end.

From the workspace **alpha/client** folder, run:
```
$ npm run bootstrap
```

Next, spin up the dev server:

```
$ npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

### CONGRATULATIONS
You have completed your first application with the Genesis Platform! Take some time to enjoy it!

:::note
Great things come from great people.
:::


## Extending our initial application

We want to build a real-time positions application, where trades can be entered, and will be aggregated to maintain positions.

![](/img/day2-training-extended-datamodel.png)

### Try yourself

Let's extend the Data model and create a CRUD, adding the tables **counterparty** and **instrument** as per the definition below. Use all the previous knowledge you've got.

![](/img/day2_new-tables.png)

:::tip
Fields are kept separately from tables, so that they, and their meta-data, can be re-used across multiple tables and show linkage.​
:::

As a reminder, these are the steps needed to complete this task:
- Edit fields and tables to our tables and *​fields-dictionary.kts* files. When you finish, remember to ​run *genesis-generated-fields* AND​ *genesis-generated-dao​*
- Add data server queries to *dataserver.kts* file
- Create CRUD events, using event handlers for ​both entities​. When you finish, remember to ​run *deploy*​
- Build, deploy and test. Test it with Postman or Console, inserting a new counterparty and instrument. Then use them to insert a new Trade as well.​

:::note
As an alternative to Genesis Console, take this opportunity to test your work with an HTTP client such as Postman or Insomnia.
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)

#### Logging on 
Whichever client you are using, you need to log in before you can send test requests to the server. This involves two things:
- providing a SOURCE_REF - this can be any string that identifies all your activity while you are logged in
- retrieving a SESSION_AUTH_TOKEN, which you can copy and use to authorise all your test requests

For example, to login using Postman:
1. Create a new query in Postman.
2. In front of the url, set the call to **POST**.
3. For the url, you need to supply your server instance, then **:9064** (which sends you to the application's Router), and then **event-login-auth**. For example:
**http://localhost:9064/event-login-auth**
4. Set the Body to JSON and insert the message below (substituting your correct user name and password) in the main body. 

```
{
    "MESSAGE_TYPE": "EVENT_LOGIN_AUTH",
    "SERVICE_NAME": "AUTH_MANAGER",
    "DETAILS": {
        "USER_NAME": "JaneDee",
        "PASSWORD": "beONneON*74"
    }
}
```
5. Click to view the header, then insert SOURCE_REF in the header. For this field, you can use any string that will identify you (in effect). In the example below, we have set SOURCE_REF to *BAUDOIN1* (for no particular reason).
&nbsp
&nbsp
![](/img/test-login-result-alpha.png)

6. When you have done this, click on the **Send** button.

This returns a set of details on the bottom side of the Postman window, where you can copy the SESSION_AUTH_TOKEN, which you will need for your test requests.

Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call.

In the example below, we are using Postman as the client API. We are going to test the EVENT_COUNTERPARTY_INSERT Event Handler by adding a new counterparty.

##### url and Body
In front of the url, set the call to **POST**.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **gwf** uses a proxy to access the server
- the name of the event handler


Set the body to **JSON**. In the body, you need to insert the details of the fields for the new counterparty, as seen below:

![](/img/test-eh-url-body-alpha.png)

##### Header
In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

When you have all these elements in place, click on **Send** to make the call. If the event is a success, you will receive an **ACK** message.

![](/img/test-eh-header-alpha.png)

##### Checking the insertion
Now you can check that the new counterparty you inserted is in the correct table of the database. The resource you need to check is the Request Server called ALL_COUNTERPARTIES.

In front of the url, set the call to **POST**.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **gwf** uses a proxy to access the server
- the name of the request server

Set the body to **JSON**. There is no need for any information in the body. Simply insert a pair of curly brackets **{}**. 

![](/img/test-eh-check-insertion-alpha.png)

In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

When you have this in place, click on **Send** to make the call. You can see that the fields for the instruments have been returned on the right of the screen.

![](/img/test-eh-insert-success-alpha.png)

:::




