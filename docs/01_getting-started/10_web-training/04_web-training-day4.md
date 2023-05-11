---
title: Web Developer training - Day four
id: web-training-day4
sidebar_label: Day four
sidebar_position: 6
keywords: [styling, design systems, micro front ends, web developer training, day four]
tags:
    - styling
    - design systems
    - micro front ends
    - web developer training
    - day four
---

This day covers:

- [Styling](#styling)
- [Dynamic layout](#dynamic-layout)
- [Chart](#chart)
- [Design systems](#design-systems)
- [Micro Front-ends](#micro-front-ends)


## Styling

You might want to customise look and feel using layout and styles. For instance, we can style an [grid-pro](#grid-pro) or even a [layout](#layout) that supports responsive web design.

### grid-pro

We've seen how to create custom grids, now let's see another way to further style it.

Styling an grid-pro can be started by creating a stylesheet document that will have some style definitions for the grid. Create a stylesheet file called **orders-grid.styles.ts** and provide the following code:

```ts {4-6} title='orders-grid.styles.ts'
import {css, ElementStyles} from '@microsoft/fast-element';

export const ordersGridStyles: ElementStyles = css`
    .notes-column {
        color: blue;
    }
`
```

Configure your column to have the specific class name:

```ts title="orderColumnDefs.ts"
{field: 'NOTES', headerName: 'Notes', sort: 'desc', cellClass: 'notes-column', flex: 2},
```

In **order.template.ts**, in the grid tag, include utility that will inject your stylesheet to the component:

```ts {1,7} title ='order.template.ts'
import {ordersGridStyles} from "./orders-grid.styles";

...

<zero-grid-pro>
    ...    
    <slotted-styles :styles=${() => ordersGridStyles}></slotted-styles>
    ...
</zero-grid-pro>
`
```

If you need to provide different class names for specific conditions, you can provide a function to the `cellClass` column config, as shown in the example below:

```ts title="orderColumnDefs.ts"
{field: 'DIRECTION', headerName: 'Order Side', cellClass: (params) => params.value === 'BUY' ? 'buy-direction' : 'sell-direction', sort: 'desc', flex: 2},
```

Remember to add the new styles to your stylesheet file.

```ts title="orders-grid.styles.ts"
import {css, ElementStyles} from '@microsoft/fast-element';

export const ordersGridStyles: ElementStyles = css`
.notes-column {
  color: blue;
}

.buy-direction {
  color: green;
}

.sell-direction {
  color: red;
}
`
```

### Layout

By default, all elements on screen will use `display:block`, but we can easily customise it using our custom component that supports responsive web design.

```html
<foundation-flex-layout class="flex-row flex-sm-column spacing-2x">
    <!--content-->
</foundation-flex-layout>
```

For further styling your components, it would make sense to start working with [Design Systems](#design-systems), which is our next topic.


### Exercise 4.1 Styling a Grid-Pro
:::info ESTIMATED TIME
20 mins
:::
Style the `quantity` field of the orders grid in such a way that if the value is bigger than 100 it will be in green, otherwise red.

:::tip
Here you can use specific conditions providing a function to the `cellClass` column config.
:::

## Dynamic Layout

The aim of this section is to implement the `foundation-layout` component which allows the user to drag, drop, resize, maximise, and restore windows.

### Refactor the Order.ts

In order to prevent the components to get excessivly large, we need to refactor the **orders.ts**.

#### Orders grid

We'll start with the most straightforward component. Create a directory called **orders-grid** in **orders** folder and add these two files to it.

```typescript title='orders-grid.ts'
import { customElement, FASTElement, observable, attr } from '@microsoft/fast-element';
import { ordersGridTemplate } from './orders-grid.template';
import { Connect } from '@genesislcap/foundation-comms';

@customElement({
  name: 'orders-grid',
  template: ordersGridTemplate
})

export class OrdersGrid extends FASTElement {

    @Connect connect: Connect;
    @observable public instrument: string;
    @observable public lastPrice: number;
    @observable public quantity: number;
    @observable public price: number;
    @observable public direction: string;
    @observable public notes: string;
    @observable public serverResponse;
    @observable public instrumentClass: string;
    @observable public quantityClass: string;
    @observable public priceClass: string;
    @attr public Order_ID = Date.now();
    @attr public minimumQuantity: number;
    @attr public sideFilter = 'BUY';


    public singleOrderActionColDef = {
        headerName: 'Action',
        minWidth: 150,
        maxWidth: 150,
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

        public cancelOrderActionColDef = {
            headerName: 'Cancel',
            minWidth: 150,
            maxWidth: 150,
            cellRenderer: 'action',
            cellRendererParams: {
              actionClick: async (rowData) => {
                this.serverResponse = await this.connect.commitEvent('EVENT_ORDER_CANCEL', {
                  DETAILS: {
                    ORDER_ID: rowData.ORDER_ID,
                    INSTRUMENT_ID: rowData.INSTRUMENT_ID,
                    QUANTITY: rowData.QUANTITY,
                    PRICE: rowData.PRICE,
                    DIRECTION: rowData.direction,
                    NOTES: rowData.NOTES,
                  },
                });
            console.log(this.serverResponse);

            if (this.serverResponse.MESSAGE_TYPE == 'EVENT_NACK') {
              const errorMsg = this.serverResponse.ERROR[0].TEXT;
              alert(errorMsg);
            } else {
              alert('Order canceled successfully.');
            }
          },
          actionName: 'Cancel Order',
          appearance: 'primary-gradient',
        },
        pinned: 'right',
    };

}
```

#### Insert trade form

And now we refactor out the form. This is slightly different because we need an associated styles file too. Create a **insert-orders-form** directory and add these three files

```typescript title='insert-orders-form.ts'
import { Connect } from '@genesislcap/foundation-comms';
import {customElement, FASTElement, observable, attr } from '@microsoft/fast-element';
import { insertOrdersFormStyles } from './insert-orders-form.styles';
import { insertOrdersFormTemplate } from './insert-orders-form.template';

@customElement({
  name: 'insert-orders-form',
  template: insertOrdersFormTemplate,
  styles: insertOrdersFormStyles,
})



export class InsertOrdersForm extends FASTElement {
    @Connect connect: Connect;
    @observable public instrument: string;
    @observable public lastPrice: number;
    @observable public quantity: number;
    @observable public price: number;
    @observable public direction: string;
    @observable public notes: string;
    @observable public allInstruments: Array<{value: string, label: string}>; //add this property
    @observable public directionOptions: Array<{value: string, label: string}>; //add this property
    @observable public serverResponse;
    @observable public instrumentClass: string;
    @observable public quantityClass: string;
    @observable public priceClass: string;

    @attr public Order_ID = Date.now();
    @attr public minimumQuantity: number;
    @attr public sideFilter = 'BUY';

    public async getMarketData() {
          const msg = await this.connect.request('INSTRUMENT_MARKET_DATA', {
            REQUEST: {
              INSTRUMENT_ID: this.instrument,
            }});
          console.log(msg);

          this.lastPrice = msg.REPLY[0].LAST_PRICE;
        }

    @observable tradeInstruments: Array<{ value: string; label: string }>;

    public async connectedCallback() { //add this method to Order class
        super.connectedCallback(); //FASTElement implementation

        const msg = await this.connect.snapshot('ALL_INSTRUMENTS'); //get a snapshot of data from ALL_INSTRUMENTS data server
        console.log(msg); //add this to look into the data returned and understand its structure
        this.allInstruments = msg.ROW?.map(instrument => ({
          value: instrument.INSTRUMENT_ID, label: instrument.INSTRUMENT_NAME}));
        const metadata = await this.connect.getMetadata('ALL_ORDERS');
        console.log(metadata);
        const directionField = metadata.FIELD?.find(field => field.NAME == 'DIRECTION');
        this.directionOptions = Array.from(directionField.VALID_VALUES).map(v => ({value: v, label: v}));
    }

    public async insertOrder() {

        this.Order_ID = Date.now();
        this.instrumentClass = "";
        this.quantityClass = "";
        this.priceClass = "";

        this.serverResponse = await this.connect.commitEvent('EVENT_ORDER_INSERT', {
            DETAILS: {
                ORDER_ID: this.Order_ID,
                INSTRUMENT_ID: this.instrument,
                QUANTITY: this.quantity,
                PRICE: this.price,
                DIRECTION: this.direction,
                NOTES: this.notes,
            },
        });
        console.log("serverResponse: ", this.serverResponse);

        if (this.serverResponse.MESSAGE_TYPE == 'EVENT_NACK') {
            const error = this.serverResponse.ERROR[0];
            alert(error.TEXT);
            switch (error.FIELD) {
                case "INSTRUMENT_ID":
                  this.instrumentClass = 'required-yes';
                  break;

                case "QUANTITY":
                  this.quantityClass = 'required-yes';
                  break;

                case "PRICE":
                  this.priceClass = 'required-yes';
                  break;

                default:
                  console.log("FIELD not found: ", error.FIELD);
            }
        }
    }
}
```

```typescript title='insert-orders-form.template.ts'
import { sync } from '@genesislcap/foundation-utils';
import { html, repeat, when } from '@microsoft/fast-element';
import { InsertOrdersForm } from './insert-orders-form';

export const insertOrdersFormTemplate = html<InsertOrdersForm>`
<template>
    <div class = "column-split-layout">
        <zero-anchor disabled appearance="accent">Order_ID - ${x => x.Order_ID}</zero-anchor>
        <span class='${x => x.instrumentClass}'>Instrument</span>
        <zero-select :value=${sync(x=> x.instrument)} @change=${x => x.getMarketData()} position="below">
          <zero-option :selected=${sync(x => x.instrument==undefined)}>-- Select --</zero-option>
          ${repeat(x => x.allInstruments, html`
            <zero-option value=${x => x.value}>${x => x.label}</zero-option>
          `)}
        </zero-select>
        <span>Last price: ${x => x.lastPrice}</span>
        <zero-text-field required :value=${sync(x=> x.quantity)} :class='${x => x.quantityClass}'>Quantity</zero-text-field>
        <zero-text-field :value=${sync(x=> x.price)} class='${x => x.priceClass}'>Price</zero-text-field>
        <span>Total: ${x => x.quantity * x.price}</span>
        <span>Direction</span>
        <zero-select :value=${sync(x=> x.direction)}>
          ${repeat(x => x.directionOptions, html`
            <zero-option value=${x => x.value}>${x => x.label}</zero-option>
          `)}
        </zero-select>
        <zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>
        <zero-button @click=${x=> x.insertOrder()}>Add Order</zero-button>
        ${when(x => x.serverResponse, html`
            <zero-banner id="js-banner">
              <div slot="content">
                ${x=> x.serverResponse.MESSAGE_TYPE == 'EVENT_ACK' ? 'Successfully added order' : 'Something went wrong'} </div>
              </zero-banner>
            `)}
    </div>
</template>
`
```
and finally

```typescript title='insert-orders-form.styles.ts'
import {css, ElementStyles} from "@microsoft/fast-element";
import { mixinScreen } from '../../../styles';

export const insertOrdersFormStyles = css`
  :host {
    ${mixinScreen('flex')}
    justify-content: top;
    flex-direction: column;
    display: block;
  }

  .required-yes {
    color: red;
  }

  .column-split-layout {
    margin-up: 5%;
    display: flex;
    flex-direction: column;
    border-style: solid;
    vertical-align: center;

  }

  span, zero-select {
  display: block;
  }

`;

```

### Add the layout to the order template

Now we have refactored our 2 components, it is easy to add the dynamic layout. Change the **order.template.ts** to:

```typescript title='order.template.ts'
import {html, repeat, when, ref } from '@microsoft/fast-element';
import type {Order } from './order';
import { sync } from '@genesislcap/foundation-utils';
import { OrderStyles } from './order.styles';
import { positionGridStyles } from "./positionsGrid.styles";
import { orderColumnDefs } from './orderColumnDefs';
import { ordersGridStyles } from "./orders-grid.styles";
import { InsertOrdersForm } from './insert-orders-form/insert-orders-form';
import { OrdersGrid } from './orders-grid/orders-grid';

InsertOrdersForm;
OrdersGrid;

export const OrderTemplate = html<Order>`
  <zero-layout>
    <zero-layout-region type="horizontal">
      <zero-layout-region type="vertical">
        <zero-layout-item title="Orders Grid">
            <orders-grid></orders-grid>
        </zero-layout-item>
      </zero-layout-region>
      <zero-layout-region type="vertical">
        <zero-layout-item title="Orders Form">
            <insert-orders-form></insert-orders-form>>
        </zero-layout-item>
      </zero-layout-region>
    </zero-layout-region>
  </zero-layout>
`
```

### Understanding the layout

As you noticed, the `<zero-layout>` has 2 main components that control the layout of the page.

- `<zero-layout-region>`: It divides the layout of the page equally depending on the its type. If `type` = horizontal then the layout will be splitted horizontally and if `type` = vertical then the layout will be splitted vertically. The layout is splitted equally depending on the number of items you insert between the `<zero-layout-region></zero-layout-region>` to the application.
- `zero-layout-item`: It stores the content of each region of the page.

### Exercise 4.2 insert a new grid

:::info ESTIMATED TIME
20 mins
:::

Insert the `ALL_INSTRUMENTS` grid to the orders page. Place it on the top right of the page.

:::tip
You can directly insert the new grid onto the order.template.ts, but it is recommended to create e new component called positions-grid and follow he previous steps. That wat you maintain your order.template.ts as clear as possible.
:::

Now we are going to look at some of the dynamic interactions that are available via the layout's JavaScript API. In this example, we are going to:

- set up the component to autosave the layout as the user interacts with it
- add a button to reset the layout

To see what else you can do with the JavaScript API, see the main documentation linked in the [API documentation here](../../04_web/10_dynamic-layout/docs/api/foundation-layout.foundationlayout.md/#methods).

### Autosaving layout

It is easy to get the layout to autosave as the user changes it. Add a key under the `auto-save-key` attribute and the layout will take care of the rest. Ensure that the key you use is unique, so it doesn't clash with any other saved layouts.

Add this attribute to your `order.template.ts`:

```html {1} title='order.template.ts'
<zero-layout auto-save-key="training-layout-key">
	<zero-layout-region type="horizontal">
		<!-- other layout contents -->
	</zero-layout-region>
</zero-layout>
```

Now when you're on the page, if you make a change to the layout (resize, drag, reorder, add/remove items) then the layout will be saved in local storage. 

Try for yourself! drag an item around and refresh the page and see it reload your layout.

:::note
The layout-saving functionality is only responsible for the *layout* itself - it will not save the state of the items inside it. Components are responsible for saving their own state if required - such as the grids [we set up earlier in the tutorial](#saving-user-preferences).
:::

### Resetting the layout

The user's layout is now saved, now we need to create a reset button.Now we are going to create this button.

The first thing we want to do is to update the `Order` component with a reference to the layout.

```ts title='order.template.ts'
import { ... , ref } from '@microsoft/fast-element';
```

```html {1} title='order.template.ts'
<zero-layout auto-save-key="tutorial-app-layout-key" ${ref('layout')}>
	<zero-layout-region type="horizontal">
		<!-- other layout contents -->
	</zero-layout-region>
</zero-layout>
```

```typescript {6,17} title='order.ts'
import {customElement, FASTElement, observable, attr } from '@microsoft/fast-element';
import {OrderTemplate as template} from './order.template';
import {OrderStyles as styles} from './order.styles';
import {Connect} from '@genesislcap/foundation-comms';
import {logger} from '../../utils';
import { FoundationLayout } from '@genesislcap/foundation-layout';

const name = 'order-route';

@customElement({
  name,
  template,
  styles,
})

export class Order extends FASTElement {
  layout: FoundationLayout;
```

#### Updating the header

Next, we want to add a button to the header sidebar to reset the layout. In this seed, the header is defined in a file called **default.ts**.

```html {7-17} title='default.ts'
    <div class="container">
      <foundation-header 
        show-luminance-toggle-button
        show-misc-toggle-button
        show-notification-button>
		<!-- other header contents -->
		<div slot="menu-contents">
			<zero-button
				appearance="neutral-grey"
				@click=${(x, _) => {
					const { resetLayout } = x.lastChild;
					resetLayout();
				}}
			>
				Reset Layout
			</zero-button>
		</div>
		<!-- other header contents -->
	</foundation-header>
	<div class="content">
		<slot></slot>
	</div>
</div>
```

When you load the app, you can now click the hamburger menu in the top-left corner and see the reset button. Clicking it will execute the `resetLayout()` function in the **order.ts** file; but we still need to set up the actual functionality.

:::info
If you've changed the structure of your application from the default, you might not be able to access `Home` via `x.lastChild` like we did in the click handler. You may need to experiment with getting a reference to the `Home` yourself, use events, or the `Foundation Store`.
:::

#### Reload the default

Finally we can now make `resetLayout()` load the default layout. The easiest way to get the default layout configuration is using the developer tools on your web browser. Open the developer tools in your browser and find the layout component (remember [from earlier](#registration-prefix) that we are looking for `<zero-layout>` in this case).

:::caution
If you've changed the layout from the default while testing your application, you need to reset it manually back to the default. 

1. In the developer tools, find the local storage and delete the `foundation-layout-autosave` value.
2. Refresh the page.
:::

Now we need access to this component in the web console. In most browsers you can do this by right-clicking on `<zero-layout>` in the element inspector and selecting an option that is similar to "store in a global variable". 

![](/img/zero-layout-select.png)


This will save the layout in a variable such as `temp1`. 

![](/img/temp1-global-variable.png)

Then, to get to get the layout run this command in the web console:

```javascript title='web console'
JSON.stringify(temp1.getLayout()) // temp0, or whatever your browser saved the layout in
```

:::tip
You can follow this process to create a range of pre-defined layouts for the user in addition to being able to restore the default layout. Or you can, for example, use the `.getLayout()` and `.loadLayout()` APIs to allow the user to save their own layouts.
:::

Now create a file under **order** directory called **predefined-layouts.ts**; copy the generated string and paste it into a file in the project.

```typescript title='predefined-layouts.ts'
export const ORDERS_DEFAULT_LAYOUT = ... /* Set this equal to the string from the web console */
```

The final step is to wire all of this functionality together so that the button loads the layout that we have just saved.

```typescript {6,22,27-29} title='home.ts'
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { HomeTemplate as template } from './home.template';
import { HomeStyles as styles } from './home.styles';
import { Connect } from '@genesislcap/foundation-comms';
import { FoundationLayout } from '@genesislcap/foundation-layout';
import { ORDERS_DEFAULT_LAYOUT } from './predefined-layouts';

const name = 'order-route';

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
  layout: FoundationLayout;

  connectedCallback(): void {
    
    ...
    
    this.resetLayout = this.resetLayout.bind(this);
    
    ...
  }

  resetLayout() {
    this.layout.loadLayout(JSON.parse(ORDERS_DEFAULT_LAYOUT));
  }
}
```

:::warning Warning
You need to override the existing connectedCallback() method.
:::

Now when you open the header sidebar and click the reset button, you should see the layout return to its default settings.

## Chart

Charts is one of the must-have components in any dashboard. Because of that, Genesis created a easy way to add a series of charts into your application. Let's create our brand new chart.

### Adding a new chart

The `g2plot-chart` component is a wrapper for `@antv/g2plot`, which allows the following types: Line, Area, Bar, Bubble, Column, Pie, Dual Axes, Rose, Scatter.

You can quickly add charts to your application. First we need to create a new component as we did in the previous exercise. Create a folder named **orders-chart** and add these two files

```typescript title='orders-chart.template.ts'
import { html } from '@microsoft/fast-element';
import { OrdersChart } from './orders-chart';

export const ordersChartTemplate = html<OrdersChart>`
  <template>
    <zero-g2plot-chart type="pie" :config=${(x) => x.chartConfiguration}>
        <chart-datasource
        resourceName="ALL_ORDERS"
        server-fields="INSTRUMENT_ID QUANTITY"
        isSnapshot
        ></chart-datasource>
    </zero-g2plot-chart>
  </template>
`;
```

```typescript title='orders-chart.ts'
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { ordersChartTemplate } from './orders-chart.template';

@customElement({
  name: 'orders-chart',
  template: ordersChartTemplate,
})
export class OrdersChart extends FASTElement {
  @observable chartConfiguration = {
    width: 800,
    angleField: 'value',
    colorField: 'groupBy',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
      style: {
        fill: 'white',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };
}
```

For further configuration examples please see: [here](https://g2plot.antv.antgroup.com/en/examples).

Your **orders.template.ts** should be like this:

```typescript {3-6,8-11,29-31} title='orders.template.ts'import {html, repeat, when, ref} from '@microsoft/fast-element';
import type {Order} from './order';
import { OrderStyles} from './order.styles';
import { InsertOrdersForm } from './insert-orders-form/insert-orders-form';
import { OrdersGrid } from './orders-grid/orders-grid';
import { InstrumentsGrid } from './instruments-grid/instruments-grid';
import { OrdersChart } from './orders-chart/orders-chart';

InsertOrdersForm;
OrdersGrid;
InstrumentsGrid;
OrdersChart;


export const OrderTemplate = html<Order>`
  <zero-layout>
    <zero-layout-region type="horizontal">
      <zero-layout-region type="vertical">
        <zero-layout-item title="Orders Grid">
            <orders-grid></orders-grid>
        </zero-layout-item>
        <zero-layout-item title="Orders Grid">
            <instruments-grid></instruments-grid>
        </zero-layout-item>
      </zero-layout-region>
      <zero-layout-region type="vertical">
        <zero-layout-item title="Orders Form">
            <insert-orders-form></insert-orders-form>>
        </zero-layout-item>
        <zero-layout-item title="Orders Chart">
            <orders-chart></orders-chart>
        </zero-layout-item>
      </zero-layout-region>
    </zero-layout-region>
  </zero-layout>
`
```

Now you show play aound with the properties of the chart, so you get used to it.

## Design systems

A design system is a collection of resources for interactive media that promotes brand alignment of [UX assets](../../../web/design-systems/introduction/#ux-assets), [Design tokens](../../../web/design-systems/introduction/#design-tokens), [Component library](../../../web/design-systems/introduction/#component-library), and [Documentation](../../../web/design-systems/introduction/#documentation-site).

The Genesis [design system](../../../web/design-systems/introduction/) implementation provides the elements listed above, as well as a few additional features, such as:
- set of reusable UI components
- configuration files which allow you to control colours, typography, sizing and various other aspects
- building blocks for creating your own custom components on top of the design system

When you generate a design system using the Genesis scaffolding CLI tool [GenX](../../../getting-started/quick-start/create-a-new-project/) it will automatically extend a base design system that we have provided. This highly configurable design system is called Genesis Foundation UI. Our design system starts in [Axure](https://www.axure.com/) and has been lab-tested to meet the needs of financial markets.

Design system are highly configurable and can be shared across multiple applications. When performing customisations, you can control the scope as follows:

* [Customisation (general)](#customisation-general) - applied to the design system itself, affecting all applications that use the system. 
* [Customisation (app-specific)](#customisation-app-specific) - this is only applied to a single application. Other applications using the same system are not affected.

### Customisation (general)

The starting point for making [general customisations](../../../web/design-systems/customisation-general/) is the `src/_config` folder:

```bash
alpha-design-system
├── dist
├── node_modules
├── src
│   ├── _config
│   │   ├── styles
│   │   │   ├── colors.ts
│   │   │   └── index.ts
│   │   ├── tokens
│   │   │   ├── custom.ts
│   │   │   ├── default.ts
│   │   │   └── index.ts
│   │   ├── values
│   │   │   ├── color.ts
│   │   │   ├── index.ts
│   │   │   ├── misc.ts
│   │   │   ├── sizing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
```

It contains configuration files that set default values for various design tokens, as well as a few other settings. You can achieve major visual changes simply by modifying token defaults. There are several categories of token available:

* [Colour](../../../web/design-systems/tokens/colour/): base colours, dark/light mode, colour variants for interactive states (hover etc.)
* [Typography](../../../web/design-systems/tokens/typography/): default font family, font size and line height hierarchy
* [Sizing](../../../web/design-systems/tokens/sizing/): component sizing, spacing and border style
* [Miscellaneous](../../../web/design-systems/tokens/miscellaneous/): other configuration options, such as the naming prefix (e.g. `alpha`)

:::tip
To help you visualise how modifying tokens impacts the component look and feel, we offer a [live configuration preview](../../../web/design-systems/preview/).
:::

To go beyond adjusting token values, you can override the default component implementation. You can choose only to  override certain aspects of a component (such as template, styles or [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) options) or provide a completely custom implementation. By default, components in your design simply re-export components from the underlying foundation design system as is (exact code can vary):

```ts
import {foundationButton} from '@genesislcap/foundation-ui';

export const alphaButton = () => foundationButton();
```

Instead of re-exporting the default, you can provide your own custom implementation:

```ts
import {css, FoundationElement, FoundationElementDefinition, html} from '@genesislcap/foundation-ui';

export const styles = css`
/* CSS  */
`;

export const template = html<AlphaButton>`
/* Template */
`;

interface ButtonDefinition extends FoundationElementDefinition {
  /* Any properties */
}

export class Button extends FoundationElement {
  /* Any custom logic */
}

export const alphaButton = Button.compose<ButtonDefinition>({
  baseName: 'button',
  template,
  styles
});
```

### Customisation (app-specific)

In the [Customisation (app-specific)](../../../web/design-systems/customisation-app-specific/) you can also choose to customise either [all the components](#customising-all-components) or only [individual ones](#customising-individual-components).

#### Customising all components

When you register a design system in an application, there are several configuration options that affect all the components provided by that design system.

You can override the default prefix set in the `_config` folder for a specific application as follows:

```ts
import { alphaButton, provideDesignSystem } from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .withPrefix('custom')
    .register(alphaButton())
```

The element can then be used in HTML using the `custom` prefix:

```html
<custom-button>Button</custom-button>
```

You can also override the default [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) (typically `open`, as that is both recommended and the default). You can choose to close all shadow roots by default using `withShadowRootMode()`:

```ts
provideDesignSystem()
    .withShadowRootMode('closed')
    .register(/* ... */)
```

As a best practice, one should try to avoid registering the same component more than once. If your architecture makes this difficult or impossible, you can provide a custom callback to handle disambiguating the duplicate elements. Further details can be found [here](../../../web/design-systems/customisation-app-specific/#name-disambiguation).

#### Customising individual components

The APIs described above impact all components, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any design system configuration.

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({ prefix: 'custom' })
    );
```

To use a custom template for a component, provide a `template` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            template: html`
                <p>A completely new template</p>
            `
        })
    )
```

Styles for a component can be configured as well, by providing a `styles` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: css`
                /* completely replace the original styles */
            `
        })
    )
```

You can also use this technique to extend the existing styles; call the style function to import the originals and compose those with new styles. Here's what that would look like:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: (ctx, def) => css`
                ${buttonStyles(ctx, def)}
                /* add your style augmentations here */
            `
        })
    )
```
Shadow options can be configured as well, including both [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) and [focus delegation](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus):

```ts
provideDesignSystem()
    .register(
        alphaButton({
            shadowOptions: {
                mode: 'closed',
                delegatesFocus: true
            }
        })
    );
```

For more information on shadow options, see [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).

:::tip key take-away
You can register your own design system to make your app(s) look and feel cohesive across the organization, following your company design guidelines.

Other developers will simply reuse the same design system.
:::


### Exercise 4.3 Overriding some components using Design System
<!--
this is pretty much here: https://github.com/genesislcap/clarity-web/blob/develop/packages/apps/clarity/src/components/components.ts
  ====> provideZeroDS
-->
:::info ESTIMATED TIME
40 mins
:::
We've been using components from Genesis Zero Design System, such as ***zero-select***, ***zero-text-field***, ***zero-button*** and so on. 

Override the Zero design system, registering a new style for the ***zero-button*** so that its background colour is green.

Additionally, register your own design system called **ui-training** and a new component `<ui-training-text-field>` whose font colour is blue. Use this component in the order screen.

:::tip
Remember, we have already provided you a folder with the main components (**client\web\src\ui-training-design-system**), so you need to select the required ones and customize them.

To register your own design system name, you have to edit the file **client\web\src\ui-training-design-system\provide-design-system.ts** and then change the attribute `provideDesignSystem.prefix`. Thus, the components will get the defined prefix to declare (e.g. *ui-training*-text-field, *ui-training*-button, and so on).

Lastly, to keep the best practices and avoid conflicts, always open the system provider tag prior using the design system components like the example below.
```html {1,4}
<ui-training-design-system-provider>
  <ui-training-text-field required :value=${sync(x=> x.quantity)}>Quantity</ui-training-text-field>
  <ui-training-text-field :value=${sync(x=> x.price)}>Price</ui-training-text-field>
</ui-training-design-system-provider>
```
:::


## Micro Front-ends

The [Micro-front-end](../../../web/micro-front-ends/introduction/) architecture is a design approach in which a front-end app is decomposed into individual, semi-independent **micro applications** working loosely together. There are re-usable micro-front-ends that can be used by Genesis-powered applications, such as [Foundation Header](../../../web/micro-front-ends/foundation-header/) (covered in [Day 1](#)), [Entity Management](../../../web/micro-front-ends/foundation-entity-management/) (pretty much covered in the [Developer Training](#)), [User Management](#user-management), and [Front-end reporting](#front-end-reporting).

Let's take a look at the User Management and Reporting Micro Front-ends.

:::info list of all available Micro Front-ends
[All micro Front-ends](../../../web/micro-front-ends/introduction/)
:::

### User Management

The [User Management](../../../web/micro-front-ends/foundation-entity-management#User-management) micro front-end is used to manage the users on the front end. Two core components are used to manage the entities `grid-pro` and `form`.

:::info
User Management is a concrete use case of the [Entity Management](../../../web/micro-front-ends/foundation-entity-management/) micro front-end, which is provided as part of `foundation-ui`.
:::

To enable this micro front-end in your application, follow the steps below:

- Add `@genesislcap/foundation-entity-management` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again.

```javascript {4} title="./client/web/package.json"
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

- Import and declare the class in the page of the class where you wish to use the user manager. Then add User Management to the template html where required:

```javascript
// Import
import { Users } from '@genesislcap/foundation-entity-management';

// Declare class
Users;

// Example html with the user management
// You can customise this with additional fields, see further in this documentation
export const AdminTemplate: ViewTemplate = html`
    <user-management></user-management>
`;
```

You can customise the functionality of User Management through the properties you set in the html. The primary way to configure the User Management functionality is via the columns that are displayed on the grid.

```javascript
// Default usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// as well as the additional entity and status columns
<user-management></user-management>
```

The default columns are contained in the [UserColumnConfig](../../../web/micro-front-ends/foundation-entity-management/docs/api/foundation-entity-management.userscolumnconfig/) variable. The `Entity` and `Status` columns are always added to the grid.

To configure the columns yourself, set the `columns` attribute when you define the User Management in the html. You can mix in your custom column config with the default user columns config using the javascript `spread` operator.
```javascript
// Custom usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// the custom "userColumns"
// as well as the additional entity and status columns
<user-management :columns=${() => [...UsersColumnConfig, ...userColumns]}>
</user-management>
```

Further information about User Management API Ref (such as `Permissions` or `persist-column-state-key`) can be found [here](../../../web/micro-front-ends/foundation-entity-management/docs/api/).


### Exercise 4.4 Add the User Management into the application
:::info ESTIMATED TIME
30 mins
:::

Add the User Management into the application. To do that create a new route and add the User Management micro front-end.


### Front-end reporting

The [Front-end reporting](../../../web/micro-front-ends/front-end-reporting/foundation-reporting) component enables your users to create report specifications, run them, or save them for later use. From the GUI, users can:

- select columns from existing data sources
- save the report with a name and retrieve it for future use
- apply ad hoc filtering to a report
- export the report results to .csv  format

#### Server configuration

This component requires a server side module to be installed and running. Please access the [reporting distribution 6.5.0](https://genesisglobal.jfrog.io/ui/native/libs-release-local/global/genesis/reporting-distribution/6.5.0/reporting-distribution-6.5.0-bin.zip) and export the files into your **.genesi-home** directory.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on.

Now import the **REPORTING_DATASOURCES.csv** into genesis.

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)

go to your resource deamon and start all processes.

#### Front-end configuration
 
To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-reporting` as a dependency in your *package.json* file.

```javascript
{
  ...
  "dependencies": {
    ...
    "@genesislcap/foundation-reporting": "14.15.2",
  },
  ...
}
```

- Import the module and in case you haven't done the [exercise 2.1](../web-training-day1/#exercise-14-adding-new-routes) configure the route in your routes **config.ts** file.

**Synchronous example**

```javascript
// Import
import {Reporting} from '@genesislcap/foundation-reporting';

// Routes configure
public configure() {
  ...
  this.routes.map(
    ...
    {path: 'report', element: Reporting, title: 'Report', name: 'report'},
    ...
  );
}
```

**Asynchronous example**

```javascript
// Routes async configure
public async configure() {
  ...
  this.routes.map(
    ...
    {path: 'reporting', element: (await import('@genesislcap/foundation-reporting')).Reporting, title: 'Reporting', name: 'reporting'},
    ...
  );
}
```

### Exercise 4.5 Creating a new ALL_POSITIONS Report
:::info ESTIMATED TIME
25 mins
:::
Create a new report using the ALL_ORDERS query in the Data Server.


<!-- 

## Angular integration

Genesis Foundation integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.

### Setting up the Angular project

First, you'll need to make sure that you have [Node.js](https://nodejs.org/) installed. 

With Node.js installed, you can run the following command to install the Angular CLI:

```shell
npm install -g @angular/cli
```

With the CLI installed, you have access to the `ng` command-line interface. This can be used to create a new Angular project. For example, to create a new Angular App named "alpha-angular", you would use the following command:

```shell
ng new alpha-angular
```

Follow the prompts, answering each question in turn. At the end, you should have a basic runnable Angular application.

### Configuring packages

Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @genesislcap/alpha-design-system lodash-es
```

### Using the components

With all the basic pieces in place, let's run our app in dev mode with `ng serve --open`. The Angular CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:


import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

This code uses the Genesis Foundation Design System to register `<alpha-card>`, `<alpha-button>` and `<alpha-text-field>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your `app/app.component.html` file with the following markup:

```html
<alpha-card>
  <h2>{{title}}</h2>
  <alpha-text-field [(ngModel)]='exampleTextField' name='exampleTextField' ngDefaultControl placeholder="Enter Some Text"></alpha-text-field>
  <alpha-button appearance="accent" (click)="onClick()">Click Me</alpha-button>
</alpha-card>
```

Replace the code in your `app/app.component.ts` file contents with this:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'alpha-angular';
  
  exampleTextField = '';

  onClick() {
    console.log(this.exampleTextField);
  }
}
```

To allow an NgModule to contain Non-Angular element names, add the following code in your `app/app.module.ts` file:

```ts 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
}) 
```

To add a splash of style, replace the `app/app.component.css` file contents with this:

```css
alpha-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

alpha-text-field {
  margin-bottom: 12px;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

alpha-card > alpha-button {
  align-self: flex-end;
}
```

:::note

Third-party controls require a ControlValueAccessor for writing a value and listening to changes on input elements. Add ngDefaultControl attribute to your component to have two-way binding working with FormControlDirective, FormControlName, or NgModel directives:

:::

```html
<alpha-text-field placeholder="name" id="name" formControlName="name" ngDefaultControl></alpha-text-field>
```

Congratulations! You're now set up to use Genesis Foundation and Angular!

### Exercise 4.5 Adding a Grid Pro to list Counterparties in our Angular solution
this is pretty much here: https://docs.genesis.global/secure/tutorials/training-resources/training-content-day3/#ui-configuring


:::info ESTIMATED TIME
30 mins
:::

It's your time! Let's use Grid Pro with connected data in the Angular app. The grid should display the data from `ALL_ORDERS`, very similar to what we did in [Adding a simple Orders data grid](../../../getting-started/web-training/web-training-day2/#adding-a-simple-orders-data-grid), but now in Angular.

-->
