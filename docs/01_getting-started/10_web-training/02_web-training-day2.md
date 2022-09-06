---
id: web-training-day2
title: Day 2
sidebar_label: Day 2
sidebar_position: 4

---
# Day 2 agenda
Complex forms, data entry components, introduction to Genesis Foundation Comms lib.

## Orders screen
Let's continue the development of our web app creating an order screen. We're going to work on these files:
-	***order.template.ts***
-	***order.ts***
-	***order.styles.ts***

You should have created these files in the last exercise of the previous day of the training with the navigation bar pointing to them as well.

Now, let's replace the dummy content of these files with the actual implementation we want.

### Requirements

The goal of our app is to list all the orders with some filters and actions to insert a new order, edit an existing order and cancel an order.

#### Fields
| Field          | Type             | Editable | Notes
|---------------|------------------------------|------------------------------|------------------------------|
| Instrument          | Select or Search (autocomplete field) | Yes | Load data from ALL_INTRUMENTS Data Server
| Market data          | Display price of the selected symbol | No | Load data from INSTRUMENT_MARKET_DATA ReqRep
| Quantity          | Integer      | Yes | Must be positive
| Price          | Double      | Yes | Must be positive
| Total          | Double      | No | Display Quantity * Price
| Side          | Dropdown      | Yes | Display types from ENUM SIDE
| Notes          | String      | Yes | Free text up to 50 chars

#### Actions
Insert, edit and cancel.


### Adding the new Order modal

Let's start with the simplest way to create a form, using the `zero-form` component:

```ts {6} title='order.template.ts'
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
:::tip what is the @submit=${(x, c)} ?
This is related to binding as we briefly explained in the previous day. If it's still unclear, make sure to check [Understanding bindings](https://www.fast.design/docs/fast-element/declaring-templates#understanding-bindings) and [Events](https://www.fast.design/docs/fast-element/declaring-templates#events)
:::

We define `insertOrder` function in order.ts

```typescript {1,3,7} title='order.ts'
  import {Connect} from '@genesislcap/foundation-comms';
  
  @Connect connect: Connect;

  public async insertOrder(event) {
    const formData = event.detail;
    const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
      DETAILS: {
        INSTRUMENT_ID: formData.INSTRUMENT_ID,
        QUANTITY: formData.QUANTITY,
        PRICE: formData.PRICE,
        SIDE: formData.SIDE,
        NOTES: formData.NOTES,
      },
    });
  }
```

### Introducing Genesis Foundation Comms lib
As you can see in the `insertOrder` code, we are importing `Connect` from `@genesislcap/foundation-comms`, which is Genesis core communication system with the server.
:::info full flexibility
You can use the foundation-comms in any modern web app, based on FAST or not. This gives you full flexibility on how to interact with the server without, necessarily, relying on the UI components provided.

Alternatively, you could use any HTTP client to access the server resources as they are exposed as HTTP endpoints as well. However, we strongly encourage the use of Foundation Comms as it handles things like the web socket connection, authentication and authorization, data subscription and so on.
:::

One of the key objects provided by the Foundation Comms is the `Connect` object whose main methods are:
- `connect`: 
connects to the server through a web socket (when WS is available or http as fallback). You must pass the server host URL. In most apps, such as the one we're building in this training, the connection is already handled by the MainApplication component on initilization relying on the [config](/getting-started/web-training/web-training-day1/#config) provided by the app.

- `commitEvent`: 
use it to call event handlers on the server. You must pass the name of the event and an object with the input data required by the event. This data must be in JSON format with key **DETAILS**. See the example above of the `insertOrder` function.

- `getMetadata`: it retrieves the metadata of a resource, that can be an event handler, data server query or a request server. When we used the **zero-form** component previously, for example, it used internally getMetadata passing the event handler name to get all the input fields of the event.

- `request`: use it to call a [request server](/server-modules/request-server/introduction/) resource. You must pass the request server resource name.

- `snapshot` and `stream`: use them to get a snapshot of data or to stream data in real time from a resource (usually, a data server query).

Those are the most common features from Foundation Comms you will use. We're going to use most of them and give more practical examples througout the training. However, please note that there are more components provided by Foundation Comms such as Auth, Session, User, Analytics. Feel free to import these components and explore their methods to get a sense of what's provided.

### Creating a custom form

Using `zero-form` is good for simple forms or prototyping, but we might realise that it is not enough for our use case, and we require much more customisation.

To enable that you will create each form element manually and take care of storing user inputted data.

You start by adding elements to the template:

```ts title='order.template.ts' 
export const OrderTemplate = html<Order>`
<zero-select>Instrument</zero-select>
<label>Last price</label>
<zero-text-field type="number">Quantity</zero-text-field>
<zero-text-field type="number">Price</zero-text-field>
<label>Total</label>
<zero-select>Side</zero-select>
<zero-text-area>Notes</zero-text-area>
`;
```

:::info form style
We're just showing the relevant code for the functionality we're building. Feel free to surround the elements with `div` or use any other resource to make your form look good.
:::

Then, define the variables that will hold the values that are entered.

In the file **order.ts**, add the following properties to the class: `Order`:

```ts title='order.ts'
@observable public instrument: string;
@observable public lastPrice: number;
@observable public quantity: number;
@observable public price: number;
@observable public side: string;
@observable public notes: string;
```

Now we need to add event handlers that would respond to user changes and store the inputted data.

We can do it in the traditional way by adding `@change` [event handler](https://www.fast.design/docs/fast-element/declaring-templates#events) or we can use the `sync` directive from Genesis Foundation Utls that would do that for us.

Let's add it to each form element:

```ts title='order.template.ts'
import { sync } from '@genesislcap/foundation-utils';

export const OrderTemplate = html<Order>`
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)}></zero-select>

<span>Last price: ${x => x.lastPrice}</span>
<zero-text-field :value=${sync(x=> x.quantity)}>Quantity</zero-text-field>
<zero-text-field :value=${sync(x=> x.price)}>Price</zero-text-field>
<span>Total: ${x => x.quantity * x.price}</span>
<span>Side</span>
<zero-select :value=${sync(x=> x.side)}>Side</zero-select>
<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
`;
```

Note that we have also added the calculation of the ***total*** field that doesn't require a property in the Order class. It's just an information on the screen that should not be sent to the server.

You probably realized we don't have any options in our select components, so let's fix that now.

#### Loading data from the server into the select fields
Let's start with **instrument** field. We want to load the data once Order the component is initialized so, then, the ***select*** field can just iterate through the list of instruments loaded from the server. 

Order is a Web Component and, as such, it supports a series of [lifecycle events](https://www.fast.design/docs/fast-element/defining-elements/#the-element-lifecycle) that you can tap into to execute custom code at specific points in time. To make the Order component load data on initilization, we can override one of the lifecycle events called `connectedCallback` that runs when the element is inserted into the DOM.

```typescript {6} title='order.ts'
@observable public allInstruments: Array<{value: string, label: string}>; //add this property

public async connectedCallback() { //add this method to Order class
    super.connectedCallback(); //FASTElement implementation

    const msg = await this.connect.snapshot('ALL_INSTRUMENTS'); //get a snapshot of data from ALL_INTRUMENTS data server
    console.log(msg); //add this to look into the data returned and understand its structure
    this.allInstruments = msg.ROW?.map(instrument => ({
      value: instrument.INSTRUMENT_ID, label: instrument.NAME}));
  }
```
:::tip async and await
If you're not entirely familiar with [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), it is a modern JavaScript function to enable asynchronous behavior and the await keyword is permitted within it. They enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.

Also, check this pratical resource on [Async Await](https://www.typescriptlang.org/pt/play#example/async-await).
:::

As you can see, we used `connect.snapshot` to retrieve the data from a data server resource called `ALL_INSTRUMENTS`. If you wanted to stream data in real time, you could use the `connect.stream` method instead. Remember to always use these methods to get data from data server resources.

Once we have the list of instruments from the server we can make use of it in the template file.

To dynamically include list of options we use [repeat](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive) directive and iterate through the items.

```ts title='order.template.ts'
<zero-select :value=${sync(x=> x.instrument)}>
  ${repeat(x => x.allInstruments, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
```

You should see the instrument field populated now with the instruments from the server.

Now let's get the **side** field sorted. We could just add two static options BUY and SELL like this:

```html title='order.template.ts' 
<zero-select :value=${sync(x=> x.side)}>
    <zero-option>BUY</zero-option>
    <zero-option>SELL</zero-option>
</zero-select>
```

However, any changes on the backend would require a change in the options. Wouldn't it be much better if we could just retrieve all ***side*** options from the server? We already know how to get data from a data server resource, now let's use the `getMetadata` method from ***Connect*** to get some metadata of a field, ***side field*** in our case.

```ts {10,11,12,13} title='order.ts' 
public async connectedCallback() {
    super.connectedCallback(); //FASTElement implementation

    const msg = await this.connect.snapshot('ALL_INSTRUMENTS');
    console.log(msg);
    this.allInstruments = msg.ROW?.map(instrument => ({
      value: instrument.INSTRUMENT_ID, label: instrument.NAME}));
    console.log(this.allInstruments);

    const metadata = await this.connect.getMetadata('ALL_ORDERS');
    console.log(metadata);
    const sideField = metadata.FIELD?.find(field => field.NAME == 'SIDE');
    this.sideOptions = Array.from(sideField.VALID_VALUES).map(v => ({value: v, label: v}));
  }

```

Next, let's just use the ***repeat*** directive again to iterate through the ***sideOptions***:

```typescript title='order.template.ts' 
<zero-select :value=${sync(x=> x.side)}>
  ${repeat(x => x.sideOptions, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
```

Reload your screen and should see the select fields being populated now!

:::caution ERROR HANDLING
For learning purposes, we are not doing proper error handling in our code.

Things like checking null or empty data from the server, arrays out of bounds etc.

When working on production code, make sure to add those validations.
:::

#### Loading Market Data
We're still missing the ***lastPrice*** field that, based on the instrument selected, must display the corresponding ***lastPrice***.

We have a request server resource (a.k.a reqRep) available on the server called `INSTRUMENT_MARKET_DATA`. It takes the INSTRUMENT_ID as input and returns the last price of the given instrument.

We already know how to get data from data servers, now let's see how to get data from a reqRep. 

Add this method to the Order class:

```ts {2} title='order.ts'
public async getMarketData() {
    const msg = await this.connect.request('INSTRUMENT_MARKET_DATA', {
      REQUEST: {
        INSTRUMENT_ID: this.instrument,
      }});
    console.log(msg);

    this.lastPrice = msg.REPLY[0].LAST_PRICE;
  }
```

And change the template to make the ***instrument field*** like this:
```ts {2} title='order.template.ts'
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)} @change=${x => x.getMarketData()}>
  <zero-option :selected=${sync(x => x.instrument==undefined)}>-- Select --</zero-option>
  ${repeat(x => x.allInstruments, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
```

Note that we used the `@change` binding to call `getMarketData()` when the value selected changed.

:::tip
We've used console.log to display the data returned from the server so we can get a better understanding of the data structure returned by each kind of resource (data servers, request replies, metadata etc).

Remember that you can also use POSTMAN or any HTTP client to retrieve and analyze the data as we saw in the Developer Training.
:::
### Exercise 2.1: using Foundation Comms
:::info estimated time
30min
:::
Let's revisit our Marketdata component. Make it retrieve all instruments from the server and display all instrument names and their corresponding last prices.

Server resources to be used: ALL_INSTRUMENTS and INSTRUMENT_MARKET_DATA.


### Sending the data

Now when we gathered all the data we're ready to send it over the wire:

Let's add a simple button with click event handler:
```html title='order.template.ts'
<zero-button @click=${x=> x.insertOrder()}>Add Order</zero-button>
```

Then let's amend our insertOrder function to work with the custom form now:
```typescript title='order.ts'
public async insertOrder() {
      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
        DETAILS: {
          INSTRUMENT_ID: this.instrument,
          QUANTITY: this.quantity,
          PRICE: this.price,
          SIDE: this.side,
          NOTES: this.notes,
        },
      });
      console.log(insertOrderEvent);
    }
```

Reload your screen and try to insert a new order. For now, just check your browser console and see if you find the result of the `insertOrder()` call.

Let's improve our screen a little bit and add a simple success or error message based on the result from the `EVENT_ORDER_INSERT` event to showcase how to handle the response from the server.

```ts {14,15,16,17,18,19} title='order.ts'
public async insertOrder() {
      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
        DETAILS: {
          INSTRUMENT_ID: this.instrument,
          QUANTITY: this.quantity,
          PRICE: this.price,
          SIDE: this.side,
          NOTES: this.notes,
        },
      });
      console.log(insertOrderEvent);

      if (insertOrderEvent.MESSAGE_TYPE == 'EVENT_NACK') {
        const errorMsg = insertOrderEvent.ERROR[0].TEXT;
        alert(errorMsg);
      } else {
        alert("Order inserted successfully.")
      }
    }
```

### Adding a simple Orders data grid
In the template file, let's add the Genesis [data source](/front-end/web-components/grids/ag-grid/ag-genesis-datasource/) pointing to the `ALL_ORDERS` resource and wrap it in [ag-grid](/front-end/web-components/grids/ag-grid/ag-grid-intro/).

Add this code to the end of html template code:
```html title="order.template.ts"
<zero-ag-grid>
    <ag-genesis-datasource
        resourceName="ALL_ORDERS"
        orderBy="ORDER_ID">
    </ag-genesis-datasource>
</zero-ag-grid>
```

This will result in a grid displaying all the columns available in the for the `ALL_ORDERS` resource.

Take a moment to play around, insert new orders and see the orders in the grid.

### Exercise 2.2: customizing order entry further
:::info estimated time
30min
:::
Implement these changes in the order entry form:
- there's a field ORDER_ID in the ORDER table which is generated automatically by the server. However, if a value is given, it will use the given value instead. Generate a random value on the frontend and pass the value to the EVENT_ORDER_INSERT event.
- Fields instrument, quantity and price are mandatory on the server. Whenever a null or empty value is passed, make sure to capture the error response from the server and paint the missing field label in red.

### Exercise 2.3: revamp the Trade screen
:::info estimated time
60min
:::
Remember the Trade screen from the Developer Training? Rebuilt it now using a custom form like we did with the Order screen instead of using the entity-management micro frontend. Make sure to populate the dropdown fields and handle the server response as well.
