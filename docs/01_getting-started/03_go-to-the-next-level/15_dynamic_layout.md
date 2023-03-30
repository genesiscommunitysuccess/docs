---
title: 'Go to the next level - add a dynamic layout'
sidebar_label: 'Dynamic layout'
id: layout
keywords: [getting started, quick start, next level, layout]
tags:
    - getting started
    - quick start
    - next level
    - dynamic
    - layout
    - golden
---

# Dynamic Layout

The aim of this section is to implement the `foundation-layout` component which allows the user to drag, drop, resize, maximise, and restore windows.

## Declarative API

By the end of this section your app will look like the following:

![](/img/tutorial-layout.png)

### Refactor `home.ts`

Before we add the dynamic layout this is a good time to refactor the four components inside
**home.ts** we've built into their own components. This will help stop the components getting
excessively large.

:::info
Refactoring out the components is also required here due to a limitation with the
[cloneNode() API](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode) and how it
interacts with FAST bindings and event listeners. A clean way to solve this issue is to
wrap up your layout contents into individual components as we are about to do.

If your components were interacting with each other via the parent component then it is
recommended to change them to interact via the `foundation-store` utility.
:::

### Trades grid

We'll start with the most straightforward component. Create a directory in the home route
and add these two files into it.

```typescript title='trades-grid.ts'
import { customElement, FASTElement } from '@microsoft/fast-element';
import { tradesGridTemplate } from './trades-grid.template';

@customElement({
  name: 'trades-grid',
  template: tradesGridTemplate,
})
export class TradesGrid extends FASTElement {}
```

```typescript title='trades-grid.template.ts'
import { html } from '@microsoft/fast-element';
import { TradesGrid } from './trades-grid';

export const tradesGridTemplate = html<TradesGrid>`
  <template>
    <zero-grid-pro>
      <grid-pro-genesis-datasource
        resource-name="ALL_TRADES"
        order-by="INSTRUMENT_ID"
      ></grid-pro-genesis-datasource>
    </zero-grid-pro>
  </template>
`;
```

Notice the template definition is from the old **home.template.ts**.

### Positions grid

Now we need to do the same for the positions grid.

```typescript title='positions-grid.ts'
import { customElement, FASTElement } from '@microsoft/fast-element';
import { positionsGridTemplate } from './position-grid.template';

@customElement({
  name: 'position-grid',
  template: positionsGridTemplate,
})
export class PositionGrid extends FASTElement {
  public singlePositionActionColDef = {
    headerName: 'Action',
    minWidth: 120,
    maxWidth: 120,
    cellRenderer: 'action',
    cellRendererParams: {
      actionClick: async (rowData) => {
        console.log(rowData);
      },
      actionName: 'Add Trade',
      appearance: 'primary-gradient',
    },
    pinned: 'right',
  };
}
```

```typescript title='positions-grid.template.ts'
import { html, repeat } from '@microsoft/fast-element';
import { positionColumnDefs } from '../positionColumnDefs';
import { PositionGrid } from './position-grid';

export const positionsGridTemplate = html<PositionGrid>`
  <template>
    <zero-grid-pro persist-column-state-key="position-grid-settings">
      <grid-pro-genesis-datasource
        resource-name="ALL_POSITIONS"
        order-by="INSTRUMENT_ID"
      ></grid-pro-genesis-datasource>
      ${repeat(
        () => positionColumnDefs,
        html`
          <grid-pro-column :definition="${(x) => x}"></grid-pro-column>
        `
      )}
      <grid-pro-column :definition="${(x) => x.singlePositionActionColDef}"></grid-pro-column>
    </zero-grid-pro>
  </template>
`;
```

### Chart

Do the same for the chart:

```typescript title='example-chart.ts'
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { exampleChartTemplate } from './example-chart.template';

@customElement({
  name: 'example-chart',
  template: exampleChartTemplate,
})
export class ExampleChart extends FASTElement {
  @observable chartConfiguration = {
    width: 600,
    angleField: 'value',
    colorField: 'type',
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

  @observable chartData = [
    { type: 'Exam 1', value: 27 },
    { type: 'Exam 2', value: 25 },
    { type: 'Exam 3', value: 18 },
    { type: 'Exam 4', value: 15 },
    { type: 'Exam 5', value: 10 },
    { type: 'Exam 6', value: 13 },
  ];
}
```

```typescript title='example-chart.template.ts'
import { html } from '@microsoft/fast-element';
import { ExampleChart } from './example-chart';

export const exampleChartTemplate = html<ExampleChart>`
  <template>
    <zero-g2plot-chart
      type="pie"
      :config=${(x) => x.chartConfiguration}
      :data=${(x) => x.chartData}
    ></zero-g2plot-chart>
  </template>
`;
```

### Insert trade form

Finally we refactor out the form. This is slightly different because we need an associated styles file too.

```typescript title='insert-trades-form.ts'
import { Connect } from '@genesislcap/foundation-comms';
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { insertTradesFormStyles } from './insert-trades-form.styles';
import { insertTradesFormTemplate } from './insert-trades-form.template';

@customElement({
  name: 'insert-trades-form',
  template: insertTradesFormTemplate,
  styles: insertTradesFormStyles,
})
export class InsertTradesForm extends FASTElement {
  @Connect connect: Connect;

  @observable public quantity: string;
  @observable public price: string;
  @observable public instrument: string;
  @observable public side: string = 'BUY';

  @observable tradeInstruments: Array<{ value: string; label: string }>;

  public async connectedCallback() {
    super.connectedCallback();

    const tradeInstrumentsRequest = await this.connect.request('INSTRUMENT');
    this.tradeInstruments = tradeInstrumentsRequest.REPLY?.map((instrument) => ({
      value: instrument.INSTRUMENT_ID,
      label: instrument.INSTRUMENT_ID,
    }));
    this.instrument = this.tradeInstruments[0].value;
  }

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
}
```

```typescript title='insert-trades-form.template.ts'
import { sync } from '@genesislcap/foundation-utils';
import { html, repeat } from '@microsoft/fast-element';
import { InsertTradesForm } from './insert-trades-form';

export const insertTradesFormTemplate = html<InsertTradesForm>`
  <template>
    <div class="column-split-layout">
      <zero-text-field :value=${sync((x) => x.quantity)}>Quantity</zero-text-field>
      <zero-text-field :value=${sync((x) => x.price)} type="number">Price</zero-text-field>
      <span>Instrument</span>
      <zero-select :value=${sync((x) => x.instrument)}>
        ${repeat(
          (x) => x.tradeInstruments,
          html`
            <zero-option value=${(x) => x.value}>${(x) => x.label}</zero-option>
          `
        )}
      </zero-select>
      <span>Side</span>
      <zero-select :value=${sync((x) => x.side)}>
        <zero-option>BUY</zero-option>
        <zero-option>SELL</zero-option>
      </zero-select>
      <zero-button @click=${(x) => x.insertTrade()}>Add Trade</zero-button>
    </div>
  </template>
`;
```

```typescript title='insert-trades-form.styles.ts'
import { css } from "@microsoft/fast-element";
import { mixinScreen } from '../../../styles';

export const insertTradesFormStyles = css`
  :host {
    ${mixinScreen('flex')}
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .column-split-layout {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }

  .row-split-layout {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 50%;
  }
`;
```

### Add the layout to the home template

Now we have refactored out the four components, it is a trivial matter to add the dynamic layout. Change the **home.template.ts** to:

```typescript title='home.template.ts'
import { html } from '@microsoft/fast-element';
import { ExampleChart } from './example-chart/example-chart';
import type { Home } from './home';
import { InsertTradesForm } from './insert-trades-form/insert-trades-form';
import { PositionGrid } from './position-grid/position-grid';
import { TradesGrid } from './trades-grid/trades-grid';

// Need to call custom element constructors to register them as custom elements
ExampleChart;
InsertTradesForm;
PositionGrid;
TradesGrid;

export const HomeTemplate = html<Home>`
  <zero-layout>
    <zero-layout-region type="horizontal">
      <zero-layout-region type="vertical">
        <zero-layout-item title="Position Grid">
          <position-grid></position-grid>
        </zero-layout-item>
        <zero-layout-item title="Trades Grid">
          <trades-grid></trades-grid>
        </zero-layout-item>
      </zero-layout-region>
      <zero-layout-region type="vertical">
        <zero-layout-item title="Trades Form">
          <insert-trades-form></insert-trades-form>
        </zero-layout-item>
        <zero-layout-item title="Chart">
          <example-chart></example-chart>
        </zero-layout-item>
      </zero-layout-region>
    </zero-layout-region>
  </zero-layout>
`;
```

You should now have a page looking similar to the one show [here](#declarative-api).

### Registration prefix

The components `<foundation-layout>`, `<foundation-layout-region>`, and `<foundation-layout-item>` are all registered with the design system you're using in the app, which requires you to prefix the components in the html with the prefix of the design system.

This is why in the [previous example](#add-the-layout-to-the-home-template) the components are `<zero-layout>`, `<zero-layout-region>`, and `<zero-layout-item>` - because this seed is using the `zero` design system.

## JavaScript API

Now we are going to look at some of the dynamic interactions which are available via the layout's JavaScript API. In this example we are going to setup the component to autosave the layout as the user interacts with it, and add a button to reset the layout. To see what else you can do with the JavaScript API, see the main documentation linked in the [conclusion](#conclusion) section, and the [API documentation here](../../04_web/10_dynamic-layout/docs/api/foundation-layout.foundationlayout.md/#methods).

### Autosaving layout

It is trivial to get the layout to autosave as the user changes it. Add a key under the `auto-save-key` attribute and the layout will take care of the rest. Ensure that the key you use is unique so it doesn't clash with any other saved layouts.

```html {1} title='home.template.ts'
<zero-layout auto-save-key="tutorial-app-layout-key">
	<zero-layout-region type="horizontal">
		<!-- other layout contents -->
	</zero-layout-region>
</zero-layout>
```

Now when you're on the page, if you make a change to the layout (resize, drag, reorder, add/remove items) then the layout will be saved in local storage. Try for yourself - drag an item around and refresh the page and see it reload your layout.

:::warning Warning
The layout saving functionality is only responsible for the *layout* itself - it will not save the state of the items inside of it. Components are responsible for saving their own state if required - such as the grids [we set up earlier in the tutorial](#saving-user-preferences).
:::

### Resetting the layout

The user's layout is now saved, but what happens if they want to reset it back to the default settings? In this section we are going to add a button to the header sidebar to implement that functionality.

The first thing we want to do is to update the `Home` component with a reference to the layout.

```html {1} title='home.template.ts'
<zero-layout auto-save-key="tutorial-app-layout-key" ${ref('layout')}>
	<zero-layout-region type="horizontal">
		<!-- other layout contents -->
	</zero-layout-region>
</zero-layout>
```

```typescript {4,14,16} title='home.ts'
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { HomeTemplate as template } from './home.template';
import { HomeStyles as styles } from './home.styles';
import { FoundationLayout } from '@genesislcap/foundation-layout';

const name = 'home-route';

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
  layout: FoundationLayout;

  resetLayout() { /* TODO */ }
}
```

### Updating the header

Next, we want to add a button to the header sidebar to reset the layout. In this seed the header is defined in a file called `default.ts`.

```html {4-14} title='default.ts'
<div class="container">
	<foundation-header templateOption extrasOption notificationOption>
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

When you load the app you can now click the hamburger menu in the top left hand corner and see the reset button. Clicking it will execute the `resetLayout()` function in the `home.ts` file, but we still need to setup the actual functionality.

:::info
If you've changed the structure of your application from the default you might not be able to access `Home` via `x.lastChild` like we did in the click handler. You may need to experiment with getting a reference to the `Home` yourself, use events, or the `Foundation Store`.
:::

### Reload the default

Finally we can now make `resetLayout()` load the default layout. The easiest way to get the default layout configuration is using the developer tools on your web browser. Open the developer tools in your browser and find the layout component (remember [from earlier](#registration-prefix) that we are looking for `<zero-layout>` in this case).

:::caution
If you've changed the layout from the default while testing your application you'll want to manually reset it back to the default. In the developer tools find the local storage and delete the `foundation-layout-autosave` value, and refresh the page.
:::

Now we need access to this component in the web console. In most browsers you can do this by right clicking on `<zero-layout>` in the element inspector and selecting an option which is similar to "use in console". This will save the layout in a variable such as `temp0`. Then to get to get the layout run this command in the web console:

```javascript title='web console'
JSON.stringify(temp0.getLayout()) // temp0, or whatever your browser saved the layout in
```

:::tip
You can follow this process to create a range of pre-defined layouts for the user in addition to being able to restore the default layout. Or you can, for example, use the `.getLayout()` and `.loadLayout()` APIs to let the user save their own layouts.
:::

Now copy that generated string and paste it into a file in the project, and export it.

```typescript title='predefined-layouts.ts'
export const HOME_DEFAULT_LAYOUT = ... /* Set this equal to the string from the web console */
```

And then the final step is to wire all of this functionality together so the button loads the layout we just saved.

```typescript {5,22-25,27-29} title='home.ts'
import { customElement, FASTElement, observable } from '@microsoft/fast-element';
import { HomeTemplate as template } from './home.template';
import { HomeStyles as styles } from './home.styles';
import { FoundationLayout } from '@genesislcap/foundation-layout';
import { HOME_DEFAULT_LAYOUT } from './predefined-layouts';

const name = 'home-route';

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
  layout: FoundationLayout;

	/**
	 * We need to bind "this" to the callback function
	 * and ensure we call super's connectedCallback() first
	 * in any custom connectedCallback().
	 */
  connectedCallback(): void {
    super.connectedCallback();
    this.resetLayout = this.resetLayout.bind(this);
  }

  resetLayout() {
    this.layout.loadLayout(JSON.parse(HOME_DEFAULT_LAYOUT));
  }
}
```

Now when you open the header sidebar and click the reset button, you should see the layout return to its default settings.

:::tip
Loading a layout with `.loadLayout()` doesn't also autosave the layout, so if you click the button and then refresh the page then the custom layout will be reloaded. To save the layout the user will need to perform an interaction such as dragging a divider. This functionality has the advantage that the user can navigate away from the layout to reload their custom layout if they accidentally loaded a layout.
:::

## Conclusion

If you followed this tutorial all the way through you should now have a dynamic layout that the user can resize, drag items into tabs etc. Additionally, their layout changes will be saved and can be reset with a button in the header sidebar.

The dynamic layout component offers even more functionality that what we have discussed here. To see what else you can do with the layout, such as tab views, events, and dynamic element registrations [see here](../../04_web/10_dynamic-layout/10_foundation-layout.md).
