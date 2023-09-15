---
title: Web Developer training - Day two
id: web-training-day2
sidebar_label: Day two
sidebar_position: 4
keywords: [complex forms, data entry components, introduction to Genesis Foundation Comms lib, web developer training, day two]
tags:
    - complex forms
    - data entry components
    - introduction to Genesis Foundation Comms lib
    - web developer training
    - day two
---

This day covers:

- [Complex forms and data-entry components through Orders screen](#orders-screen) 
- [Introduction to Genesis Foundation Comms lib](#introducing-genesis-foundation-comms-lib)

## Orders screen
Let's continue the development of our web app creating an order screen. We're going to work on these files:
-	***order.template.ts***
-	***order.ts***
-	***order.styles.ts***

You should have created these files in the last exercise of the previous day of the training, with the navigation bar pointing to them as well.

Now, let's replace the dummy content of these files with the actual implementation we want.

### Requirements

The goal of our app is to list all the orders, enabling the user to apply some filters. The user must also be able to insert a new order, edit an existing order and cancel an order.

#### Fields
| Field          | Type             | Editable | Notes
|---------------|------------------------------|------------------------------|------------------------------|
| Instrument          | Select or Search (autocomplete field) | Yes | Load data from ALL_INSTRUMENTS Data Server
| Market data          | Display price of the selected symbol | No | Load data from INSTRUMENT_MARKET_DATA ReqRep
| Quantity          | Integer      | Yes | Must be positive
| Price          | Double      | Yes | Must be positive
| Total          | Double      | No | Display Quantity * Price
| Direction          | Dropdown      | Yes | Display types from ENUM DIRECTION
| Notes          | String      | Yes | Free text up to 50 chars

#### Actions
Insert, edit and cancel.

### Adding the new Order modal

Let's start with the simplest way to create a form, using the `foundation-form` component:

```ts {5-12} title='order.template.ts'
import {html} from '@microsoft/fast-element';
import type {Order} from './order';

export const OrderTemplate = html<Order>`
  <foundation-form 
  class="order-entry-form" 
  resourceName="EVENT_ORDER_INSERT">
  </foundation-form>
`;
```

This component is able to retrieve the meta-data from the `EVENT_ORDER_INSERT` back-end resource (an Event Handler), and it automatically builds a simple form for you. This is good enough for simple scenarios.

Try to run it now and you'll notice that, even though the form is displayed, nothing happens when you click on **Submit**. We have to bind the submit button to a function, like this:
```html {4} title='order.template.ts'
  <foundation-form
    class="order-entry-form"
    resourceName="EVENT_ORDER_INSERT"
    @submit=${(x, c) => x.insertOrder(c.event as CustomEvent)}>
  </foundation-form>
```
:::tip what is the @submit=${(x, c)} ?
This is related to binding - as we briefly explained in the previous day. If it's still unclear, make sure to check [Understanding bindings](https://www.fast.design/docs/fast-element/declaring-templates#understanding-bindings) and [Events](https://www.fast.design/docs/fast-element/declaring-templates#events)
:::

We define the `insertOrder` function in the file **order.ts**:

```typescript {2,3,7,13-25} title='order.ts'
  ...
  import {Connect} from '@genesislcap/foundation-comms';
  import {logger} from '../../utils';
  
  ...
  export class Order extends FASTElement {
    @Connect connect: Connect;

    constructor() {
      super();
    }

    public async insertOrder(event) {
      const formData = event.detail.payload;
      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
        DETAILS: {
          INSTRUMENT_ID: formData.INSTRUMENT_ID,
          QUANTITY: formData.QUANTITY,
          PRICE: formData.PRICE,
          DIRECTION: formData.DIRECTION,
          NOTES: formData.NOTES,
        },
      });
      logger.debug('EVENT_ORDER_INSERT result -> ', insertOrderEvent);
    }
  }

```

### Introducing Genesis Foundation Comms lib
As you can see in the `insertOrder` code, we are importing `Connect` from `@genesislcap/foundation-comms`, which is the Genesis core communication system with the server.

:::info full flexibility
You can use the foundation-comms in any modern web app, based on FAST or not. This gives you full flexibility on how to interact with the server, without the need to rely on the UI components provided.

Alternatively, you could use any HTTP client to access the server resources, because they are exposed as HTTP endpoints as well. However, we strongly encourage the use of Foundation Comms, as it handles things like the web socket connection, authentication and authorization, data subscription and so on.
:::

One of the key objects provided by the Foundation Comms is the `Connect` object whose main methods are:
- `connect`: 
connects to the server through a web socket (when WS is available or http as fallback). You must pass the server host URL. In most apps, such as the one we're building in this training, the connection is already handled by the MainApplication component on initialisation, relying on the [config](../../../getting-started/web-training/web-training-day1/#config) provided by the app.

- `commitEvent`: 
use this to call event handlers on the server. You must pass the name of the event and an object with the input data required by the event. This data must be in JSON format with key **DETAILS**. See the example above of the `insertOrder` function.

- `getMetadata`: this retrieves the metadata of a resource, which can be an Event Handler, Data Server query or a Request Server. When we used the **foundation-form** component previously, for example, it used internally getMetadata passing the name of the Event Handler resource to get all the input fields of the event.

- `request`: use this to call a [request server](../../../server/request-server/introduction/) resource. You must pass the Request Server resource name.

- `snapshot` and `stream`: use these to get a snapshot of data or to stream data in real time from a resource (usually, a Data Server query).

Those are the most common Foundation Comms features that you will use. We're going to give practical examples throughout the training. However, please note that there are more components provided by Foundation Comms, such as Auth, Session, User, Analytics. Feel free to import these components and explore their methods to get a sense of what's provided.

### Creating a custom form

Using `foundation-form` is good for simple forms or prototyping, but we might realise that it is not enough for our use case, and we require much more customisation.

To do this, you will create each form element manually and take care of storing the data input by the user.

Start by adding elements to the template:

```ts title='order.template.ts' 
export const OrderTemplate = html<Order>`
<div class="row-split-layout">
    <div class="column-split-layout">
      <span>Instrument</span>
      <zero-select>Instrument</zero-select>
      <label>Last price</label>
      <zero-text-field type="number">Quantity</zero-text-field>
      <zero-text-field type="number">Price</zero-text-field>
      <label>Total</label>
      <zero-select>Direction</zero-select>
      <zero-text-area>Notes</zero-text-area>
    </div>
</div>
`;
```
Add the following code to your **order.styles.ts** file, so that you get a nice look on your forms:

```ts title="order.styles.ts"
import {css} from "@microsoft/fast-element";
import { mixinScreen } from '../../styles';

export const OrderStyles = css`
  :host {
    ${mixinScreen('flex')}
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .column-split-layout {
    text-align: center;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }

  .row-split-layout {
    justify-content: center;
    display: block;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 50%;
  }

  zero-select, zero-text-area, span{
      display: block;
  }
`
```

:::info form style
We're just showing the relevant code for the functionality we're building, with an example of customisation. Feel free to surround the elements with `div` or use any other resource to make your form look better. For that, you will only need some CSS styling knowledge.
:::

Then, define the variables that will hold the values that are entered.

In the file **order.ts**, add the following properties to the class: `Order`:

```ts {1,4-9} title='order.ts'
import {customElement, FASTElement, observable} from '@microsoft/fast-element';
...

@observable public instrument: string;
@observable public lastPrice: number;
@observable public quantity: number;
@observable public price: number;
@observable public direction: string;
@observable public notes: string;

...
```

Now we need to add event handlers that respond to user changes and store the data that has.

We can do it in the traditional way by adding `@change` [event handler](https://www.fast.design/docs/fast-element/declaring-templates#events) or we can use the `sync` directive from Genesis Foundation Utls that would do that for us.

Let's add it to each form element:

```ts {3,6-17} title='order.template.ts'
import {html} from '@microsoft/fast-element';
import type {Order} from './order';
import { sync } from '@genesislcap/foundation-utils';

export const OrderTemplate = html<Order>`
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)}></zero-select>

<span>Last price: ${x => x.lastPrice}</span>
<zero-text-field :value=${sync(x=> x.quantity)}>Quantity</zero-text-field>
<zero-text-field :value=${sync(x=> x.price)}>Price</zero-text-field>
<span>Total: ${x => x.quantity * x.price}</span>
<span>Direction</span>
<zero-select :value=${sync(x=> x.direction)}>Direction</zero-select>
<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
`;
```

Note that we have also added the calculation of the ***total*** field, which doesn't require a property in the Order class; this is useful information to display on screen, but it does not need to be sent to the server.

You have probably realised we don't have any options in our select components, so let's fix that now.

#### Loading data from the server into the select fields
Let's start with **instrument** field. We want to load the data once the Order component is initialised; then the **select** field can just iterate through the list of instruments loaded from the server. 

Order is a Web Component and, as such, it supports a series of [lifecycle events](https://www.fast.design/docs/fast-element/defining-elements/#the-element-lifecycle) that you can tap into to execute custom code at specific times. To make the Order component load data on initialisation, we can override one of the lifecycle events called `connectedCallback`, which runs when the element is inserted into the DOM.

```typescript {5,11-18} title='order.ts'
...
export class Order extends FASTElement {
  @Connect connect: Connect;
  ...
  @observable public allInstruments: Array<{value: string, label: string}>; //add this property

  constructor() {
    super();
  }

public async connectedCallback() { //add this method to Order class
    super.connectedCallback(); //FASTElement implementation

    const msg = await this.connect.snapshot('ALL_INSTRUMENTS'); //get a snapshot of data from ALL_INSTRUMENTS data server
    console.log(msg); //add this to look into the data returned and understand its structure
    this.allInstruments = msg.ROW?.map(instrument => ({
      value: instrument.INSTRUMENT_ID, label: instrument.INSTRUMENT_NAME}));
  }
  ...
}
```
:::tip async and await
If you're not entirely familiar with [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), this is a modern JavaScript function that enables asynchronous behaviour; the `await` keyword is permitted within it. They enable asynchronous, promise-based behaviour to be written in a cleaner style, avoiding the need to explicitly configure promise chains.

Also, check this practical resource on [Async Await](https://www.typescriptlang.org/pt/play#example/async-await).
:::

As you can see, we have used `connect.snapshot` to retrieve the data from a Data Server resource called `ALL_INSTRUMENTS`. If you wanted to stream data in real time, you could use the `connect.stream` method instead. Remember, you can always use these methods to get data from Data Server resources.

Once we have the list of instruments from the server, we can make use of it in the template file.

To dynamically include a list of options, we use the [repeat](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive) directive and iterate through the items.

```ts {1,5-9} title='order.template.ts'
import {html, repeat} from '@microsoft/fast-element';
...
export const OrderTemplate = html<Order>`
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)}>
  ${repeat(x => x.allInstruments, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
...
<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
`;
```

You should see the instrument field populated now with the instruments from the server.

Now let's get the **direction** field sorted. We could just add two static options: BUY and SELL:

```html {5-8} title='order.template.ts' 
...
export const OrderTemplate = html<Order>`
...
<span>Direction</span>
<zero-select :value=${sync(x=> x.direction)}>
    <zero-option>BUY</zero-option>
    <zero-option>SELL</zero-option>
</zero-select>
<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
`;
```

However, any changes on the back end would require a change in the options. Wouldn't it be much better if we could just retrieve all **direction** options from the server? We already know how to get data from a data server resource, now let's use the `getMetadata` method from **Connect** to get the metadata of a field, **direction field** in our case.

```ts {3,14-17} title='order.ts' 
...
  @observable public allInstruments: Array<{value: string, label: string}>; //add this property
  @observable public directionOptions: Array<{value: string, label: string}>; //add this property
...
public async connectedCallback() {
    super.connectedCallback(); //FASTElement implementation

    const msg = await this.connect.snapshot('ALL_INSTRUMENTS');
    console.log(msg);
    this.allInstruments = msg.ROW?.map(instrument => ({
      value: instrument.INSTRUMENT_ID, label: instrument.NAME}));
    console.log(this.allInstruments);

    const metadata = await this.connect.getMetadata('ALL_ORDERS');
    console.log(metadata);
    const directionField = metadata.FIELD?.find(field => field.NAME == 'DIRECTION');
    this.directionOptions = Array.from(directionField.VALID_VALUES).map(v => ({value: v, label: v}));
  }
...
```

Next, let's use the **repeat** directive again to iterate through the ***directionOptions***:

```typescript {5-10} title='order.template.ts' 
...
export const OrderTemplate = html<Order>`
...
<span>Direction</span>
<zero-select :value=${sync(x=> x.direction)}>
  ${repeat(x => x.directionOptions, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
`;
```

Reload your screen and should see the select fields being populated now!

:::caution ERROR HANDLING
For learning purposes, we are not doing proper error handling in our code.

Things like checking null or empty data from the server, arrays out of bounds etc.

When working on production code, make sure you add this validation throughout.
:::

#### Loading market data
We're still missing the ***lastPrice*** field that, based on the instrument selected, must display the corresponding ***lastPrice***.

We have a Request Server resource (a.k.a reqRep) called `INSTRUMENT_MARKET_DATA` available on the server. It takes the INSTRUMENT_ID as input and returns the last price of the given instrument.

We already know how to get data from Data Servers, now let's see how to get data from a reqRep. 

Add this method to the Order class:

```ts {4-12} title='order.ts'
...
export class Order extends FASTElement {
  ...
  public async getMarketData() {
      const msg = await this.connect.request('INSTRUMENT_MARKET_DATA', {
        REQUEST: {
          INSTRUMENT_ID: this.instrument,
        }});
      console.log(msg);

      this.lastPrice = msg.REPLY[0].LAST_PRICE;
    }
}
```

And change the template to make the **instrument field** like this:
```ts {4-9} title='order.template.ts'
...
export const OrderTemplate = html<Order>`
<span>Instrument</span>
<zero-select :value=${sync(x=> x.instrument)} @change=${x => x.getMarketData()}>
  <zero-option :selected=${sync(x => x.instrument==undefined)}>-- Select --</zero-option>
  ${repeat(x => x.allInstruments, html`
    <zero-option value=${x => x.value}>${x => x.label}</zero-option>
  `)}
</zero-select>
...
`;
```

Note that we used the `@change` binding to call `getMarketData()` when the selected value changed.

:::tip
We've used console.log to display the data returned from the server so we can get a better understanding of the data structure returned by each kind of resource (Data Servers, Request Servers, metadata etc).

Remember that you can also use POSTMAN or any HTTP client to retrieve and analyse the data, as we saw in the Developer Training.
:::
### Exercise 2.1: using Foundation Comms
:::info estimated time
30min
:::
Let's revisit our Marketdata component. Make it retrieve all instruments from the server and display all instrument names and their corresponding last prices.

Server resources to be used: ALL_INSTRUMENTS and INSTRUMENT_MARKET_DATA.


### Sending the data

Now that we have gathered all the data, we're ready to send it over the wire:

Let's add a simple button with a click event handler:
```html {6} title='order.template.ts'
...
export const OrderTemplate = html<Order>`
  ...
  ...
    <zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
    <zero-button @click=${x=> x.insertOrder()}>Add Order</zero-button>
</div>
`;
  
```

Then let's amend our insertOrder function to work with the custom form:
```typescript {4-15} title='order.ts'
...
export class Order extends FASTElement {
  ...
public async insertOrder() {
      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
        DETAILS: {
          INSTRUMENT_ID: this.instrument,
          QUANTITY: this.quantity,
          PRICE: this.price,
          DIRECTION: this.direction,
          NOTES: this.notes,
        },
      });
      console.log(insertOrderEvent);
    }
  ...
}
```

Reload your screen and try to insert a new order. For now, just check your browser console and see if you find the result of the `insertOrder()` call.

Let's improve our screen a little bit and add a simple success or error message based on the result from the `EVENT_ORDER_INSERT` event to showcase how to handle the response from the server.

```ts {16-21} title='order.ts'
...
export class Order extends FASTElement {
  ...
  public async insertOrder() {
        const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
          DETAILS: {
            INSTRUMENT_ID: this.instrument,
            QUANTITY: this.quantity,
            PRICE: this.price,
            DIRECTION: this.direction,
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
  ...
}
```

### Adding a simple Orders data grid
In the template file, let's add the Genesis [data source](../../../web/web-components/grids/grid-pro/grid-pro-genesis-datasource/) pointing to the `ALL_ORDERS` resource and wrap it in [grid-pro](../../../web/web-components/grids/grid-pro/grid-pro-intro/).

Add this code to the end of html template code:
```html {4-11} title="order.template.ts"
...
export const OrderTemplate = html<Order>`
  ...
  <div class="row-split-layout">
      <zero-grid-pro>
          <grid-pro-genesis-datasource
              resource-name="ALL_ORDERS"
              order-by="ORDER_ID">
          </grid-pro-genesis-datasource>
      </zero-grid-pro>
  </div>
  ...
`;
```

This will result in a grid displaying all the columns available in the `ALL_ORDERS` resource.

Take a moment to play around, insert new orders and see the orders in the grid.

### Exercise 2.2: customising order entry further
:::info estimated time
30min
:::
Implement these changes in the order entry form:
- There's a field ORDER_ID in the ORDER table, which is generated automatically by the server. However, if a value is given, it will use the given value instead. Generate a random value on the front end and pass the value to the EVENT_ORDER_INSERT event.
- Fields instrument, quantity and price are mandatory on the server. Whenever a null or empty value is passed, make sure you capture the error response from the server and paint the missing field label in red.
:::tip
To generate the ORDER_ID value, you can use `Date.now()`
:::

### Exercise 2.3: revamp the Trade screen
:::info estimated time
60min
:::
Remember the Trade screen from the Developer Training? We used the entity-management micro front-end to create this. No rebuild it using a custom form, just as we did with the Order screen. Make sure to populate the dropdown fields and handle the server response as well.
