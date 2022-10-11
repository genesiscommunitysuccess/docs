---
title: 'Create a form to input data'
sidebar_label: 'Create a form to input data'
id: forms
---

## Section objectives
The goal of this section is to add a form that enables us to insert trades in to our database.

## Interacting with the Event Handler
To interact with the Event Handler that you created [previously](/getting-started/go-to-the-next-level/events#event-handler), you will now create a form that will collect the data from the user.

Start with the Form component, which will generate all the inputs based on the API:

```html title='home.template.ts'
<zero-form
  resourceName="EVENT_TRADE_INSERT"
></zero-form>
```

To respond to the user clicking on the **Submit** button, you need to call the `EVENT_TRADE_INSERT` event:
```html {3} title='home.template.ts'
<zero-form
  resourceName="EVENT_TRADE_INSERT"
  @submit=${(x, c) => x.insertTrade(c.event as CustomEvent)}
></zero-form>
```

Define the `insertTrade` function in the file **home.ts**:

```typescript title='home.ts'
  import {Connect} from '@genesislcap/foundation-comms';
```

```typescript title='home.ts'
  @Connect connect: Connect;

  public async insertTrade(event) {
    const formData = event.detail.payload;
    const insertTradeEvent = await this.connect.commitEvent('EVENT_TRADE_INSERT', {
      DETAILS: {
        COUNTERPARTY_ID: 'GENESIS',
        INSTRUMENT_ID: formData.INSTRUMENT_ID,
        QUANTITY: formData.QUANTITY,
        PRICE: formData.PRICE,
        SIDE: formData.SIDE,
        TRADE_DATETIME: Date.now(),
      },
    });
  }
```

After refreshing your application, a form should be displayed. The form might sit on top of the grid or by itself, depending on whether you appended to or replaced the already existing xml in **home.template.ts**.

![](/img/trade-insert-form.png)

## Adding customisation
What we have done so far is good for simple forms or prototyping, but what if we need much more customisation?
Let's replace the form and code elements above with a more configurable solution.

To do this, you must create each form element manually and take care of storing the data input by the user.

Start by adding the elements to the template. Instead of the `<zero-form>` above, replace it with the following.

```html title='home.template.ts' 
<zero-text-field>Quantity</zero-text-field>
<zero-text-field type="number">Price</zero-text-field>
<span>Instrument</span>
<zero-select></zero-select>
<span>Side</span>
<zero-select></zero-select>
```

Then, define the variables that will hold the values that the user enters:

In the file **home.ts**, add the following properties to the class: `Home`:

```ts title='home.ts'
@observable public quantity: string;
@observable public price: string;
@observable public instrument: string;
@observable public side: string = 'BUY';
```

Now we need to interact with the Event Handlers that respond to user changes and store the data that is input:

We can do it in the traditional way by adding `@change` [event handler](https://www.fast.design/docs/fast-element/declaring-templates#events) - but we can also use the `sync` directive, which does that for us.

Let's add it to each form element:

```ts title='home.template.ts'
import {sync} from '@genesislcap/foundation-utils';
```

```html {2,7,13,18} title='home.template.ts' 
<zero-text-field 
  :value=${sync(x=> x.quantity)}
>
  Quantity
</zero-text-field>
<zero-text-field 
  :value=${sync(x=> x.price)}
>
  Price
</zero-text-field>
<span>Instrument</span>
<zero-select 
  :value=${sync(x=> x.instrument)}
>
</zero-select>
<span>Side</span>
<zero-select 
  :value=${sync(x=> x.side)}
>
</zero-select>
```

You can now refresh your application; it should look something like this:

![](/img/position-form.png)

:::note
The data in your grids may vary from the data in the example. You may also only see one grid or none at all, depending on whether you replaced or appended the xml before this.
:::

## Adding selection options
You probably realise that we don't have any options in our select components, so let's fix that now.

To enter a new trade, we want the user to be able to select:
- side (buy or sell)
- the instrument to be traded

We will start with side, as it only has two static options: BUY and SELL. We just need to add those two options inside the select tag:

```html title='home.template.ts' 
<zero-select :value=${sync(x=> x.side)}>
    <zero-option>BUY</zero-option>
    <zero-option>SELL</zero-option>
</zero-select>
```

To enable the user to select the instrument, we can use `options-datasource`, which will fetch and add a list of options to select component from the API.

To get the data from the server, we need to define resourceName and fields we want to get. In this case we need to inject:

```typescript title='home.template.ts' 
<zero-select :value=${sync(x=> x.instrument)}>
  <options-datasource resourceName="ALL_INSTRUMENTS" fields="INSTRUMENT_ID"></options-datasource>
</zero-select>
```

## Enabling the user to insert
Now we have the data that can be selected, we need the user to be able to submit the trade:

Create a simple button with a click event handler:
```html title='home.template.ts'
<zero-button @click=${x=> x.insertTrade()}>Add Trade</zero-button>
```

Then create a new API call to insert the trade:
```typescript title='home.ts'
public async insertTrade() {
  const insertTradeRequest = await this.connect.commitEvent('EVENT_TRADE_INSERT', {
    DETAILS: {
      COUNTERPARTY_ID: 'GENESIS',
      INSTRUMENT_ID: this.instrument,
      QUANTITY: this.quantity,
      PRICE: this.price,
      SIDE: this.side,
      TRADE_DATETIME: Date.now(),
    },
    IGNORE_WARNINGS: true,
    VALIDATE: false,
  });
}
```
 Let's add another data grid at the bottom of the page to show the trade view `ALL_TRADES`:

```html title='home.template.ts'
  <zero-ag-grid>
      <ag-genesis-datasource
          resourceName="ALL_TRADES"
          orderBy="INSTRUMENT_ID">
      </ag-genesis-datasource>
  </zero-ag-grid>
```
Now if everything has worked, you can go to your browser, insert the data for a new trade, and click the button. You will see the new trade showing up in the data grid of the trade view `ALL_TRADES` at the bottom of the page.
