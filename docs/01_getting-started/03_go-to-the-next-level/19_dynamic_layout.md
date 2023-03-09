---
title: 'Go to the next level - Add a dynamic layout'
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

### Layout to `home.template.ts`

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

## JavaScript API

## Conclusion

To see what else you can do with the layout, such as tab views, events, and autosaved layouts [see here](../../04_web/10_dynamic-layout/10_foundation-layout.md).
