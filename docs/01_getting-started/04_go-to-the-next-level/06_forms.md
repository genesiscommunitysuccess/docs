---
title: 'Create a form to input data'
sidebar_label: 'Create a form to input data'
id: forms
---

For event handler you created in [here](/getting-started/go-to-the-next-level/events#event-handler) you will create a form that will collect the data from the user.

We will start with using form component that will generate all the inputs based on the API:

```html title='home.template.ts'
<zero-form
  resourceName="EVENT_INSERT_TRADE"
></zero-form>
```

To respond to user clicking Submit button we need to add event handler:
```html {3} title='home.template.ts'
<zero-form
  resourceName="EVENT_INSERT_TRADE"
  @submit=${(x, c) => x.insertTrade(c.event as CustomEvent)}
></zero-form>
```

We define `insertTrade` function in home.ts

```typescript title='home.ts'
  import {Connect} from '@genesislcap/foundation-comms';
  
  @Connect connect: Connect;

  public async insertTrade(event) {
    const formData = event.detail;
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

This approach is good for simple forms or prototyping, but we might realise that it is not enough for our use case, and we require much more customisation.

To enable that you will create each form element manually and take care of storing user inputted data.

You start by adding elements to the template

```html title='home.template.ts' 
<zero-text-field>Quantity</zero-text-field>
<zero-text-field type="number">Price</zero-text-field>
<span>Instrument</span>
<zero-select></zero-select>
<span>Side</span>
<zero-select></zero-select>
```

Then, define the variables that will hold the values that are entered.

In the file **home.ts**, add the following properties to the class: `Home`:

```ts title='home.ts'
@observable public quantity: string;
@observable public price: string;
@observable public instrument: string;
@observable public side: string = 'BUY';
```

Now we need to add event handlers that would respond to user changes and store the inputted data

We can do it in traditional way by adding `@change` [event handler](https://www.fast.design/docs/fast-element/declaring-templates#events) but we can also use the `sync` directive that would do that for us.
Let's add it to each form element:

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

You probably realize that we don't have any options in our select component so let's fix that now.
We will start with side as it only has two static options BUY and SELL so we just need to add those two options inside select tag

```html title='home.template.ts' 
<zero-select :value=${sync(x=> x.side)}>
    <zero-option>BUY</zero-option>
    <zero-option>SELL</zero-option>
</zero-select>
```

For instrument, it's more complicated because list of options needs to be fetched from the API.

We will do that in [connectedCallback](https://www.fast.design/docs/fast-element/defining-elements#the-element-lifecycle) which happens when element is inserted into the DOM
First, declare `tradeInstruments` that will be later used in the template.
To get the data from the API we inject
```typescript title='home.ts'
@observable tradeInstruments: Array<{value: string, label: string}>;
@Connect connect: Connect;

public async connectedCallback() {
    super.connectedCallback();
    
    const tradeInstrumentsRequest = await this.connect.request('INSTRUMENT');
    this.tradeInstruments = tradeInstrumentsRequest.REPLY?.map(instrument => ({value: instrument.INSTRUMENT_ID, label: instrument.NAME}));
}
```

Once we have the data with the list of instruments we can make use of it in the template file
To dynamically include list of options we use [repeat](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive) directive and iterate through the items

```typescript title='home.template.ts' 
<zero-select :value=${sync(x=> x.instrument)}>
  ${repeat(x => x.tradeInstruments, html`
    <zero-option value=${x => x.INSTRUMENT_ID}>${x => x.NAME}</zero-option>
  `)}
</zero-select>
```

Now when we gathered all the data we're ready to send it over the wire:

We create a simple button with click event handler:
```html title='home.template.ts'
<zero-button @click=${x=> x.insertTrade()}>Add Trade</zero-button>
```

Then we create a new API call to insert trade
```typescript title='home.ts'
public async insertTrade() {
  const insertTradeRequest = await this.connect.commitEvent('EVENT_TRADE_INSERT', {
    DETAILS: {
      COUNTERPARTY_ID: 'GENESIS',
      INSTRUMENT_ID: this.instrument,
      QUANTITY: this.quantity,
      PRICE: this.price,
      SIDE: this.tradeSide,
      TRADE_DATETIME: Date.now(),
    },
    IGNORE_WARNINGS: true,
    VALIDATE: false,
  });
}
```

Now if everything went well you can go to your browser insert the data, click the button, and you should see new trade showing up in the data grid you set up in [previous chapter](/getting-started/go-to-the-next-level/data-grid)
