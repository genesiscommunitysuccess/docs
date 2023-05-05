---
title: 'Go to the next level - create a chart'
sidebar_label: 'Create a chart'
id: charts
keywords: [getting started, quick start, next level, charts]
tags:
    - getting started
    - quick start
    - next level
    - charts
---

## Section objectives
Now we will be focusing on the UI elements of the application. The goal of this section is to add a data chart to the UI.

## Adding a new chart

The `g2plot-chart` component is a wrapper for `@antv/g2plot`, which allows the following types: Line, Area, Bar, Bubble, Column, Pie, Dual Axes, Rose, Scatter.

You can quickly add charts to your application; go to the **home.template.ts** and add the following chart:

```typescript title='home.template.ts'
<zero-g2plot-chart type="pie" :config=${(x) => x.chartConfiguration}>
  <chart-datasource
    resourceName="ALL_POSITIONS"
    server-fields="INSTRUMENT_ID VALUE"
    isSnapshot
  ></chart-datasource>
</zero-g2plot-chart>
```

Now you need to define **chartConfigration** in the class `home` in **home.ts**. Go to the **home.ts** file and add the code below:

```typescript title='home.ts'
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
```

For further configuration examples please see: [here](https://g2plot.antv.antgroup.com/en/examples).

Your **home.template.ts** should be like this:

```typescript {24,25,46-54} title='home.template.ts'
<div class="row-split-layout">
    <div class="column-split-layout">
        <zero-grid-pro persist-column-state-key="position-grid-settings">
            <grid-pro-genesis-datasource
                resource-name="ALL_POSITIONS"
            ></grid-pro-genesis-datasource>
            ${repeat(
                () => positionColumnDefs,
                html`
                    <grid-pro-column :definition="${(x) => x}"></grid-pro-column>
                `
            )}
            <grid-pro-column :definition="${(x) => x.singlePositionActionColDef}"></grid-pro-column>
        </zero-grid-pro>
    </div>
    <div class="column-split-layout">
        <zero-grid-pro persist-column-state-key="position-grid-settings">
            <grid-pro-genesis-datasource
                resource-name="ALL_TRADES"
            ></grid-pro-genesis-datasource>
        </zero-grid-pro>
    </div>
</div>
<div class="row-split-layout">
	<div class="column-split-layout">
		<zero-text-field
			:value=${sync(x=> x.quantity)}>
			Quantity
		</zero-text-field>
		<zero-text-field
			:value=${sync(x=> x.price)}>
			Price
		</zero-text-field>
		<span>Instrument</span>
		<zero-select :value=${sync(x=> x.instrument)}>
			${repeat(x => x.tradeInstruments, html`
			<zero-option value=${x => x.value}>${x => x.label}</zero-option>
			`)}
		</zero-select>
		<span>Side</span>
		<zero-select :value=${sync(x=> x.side)}>
			<zero-option>BUY</zero-option>
			<zero-option>SELL</zero-option>
		</zero-select>
		<zero-button @click=${x=> x.insertTrade()}>Add Trade</zero-button>
	</div>
    <zero-g2plot-chart type="pie" :config=${(x) => x.chartConfiguration}>
        <chart-datasource
        resourceName="ALL_POSITIONS"
        server-fields="INSTRUMENT_ID VALUE"
        isSnapshot
        ></chart-datasource>
    </zero-g2plot-chart>
</div>
```

## Conclusion
You should have a data chart that looks something like this:

![](/img/charts.png)

If you have been following the entire tutorial, your page should look something like this:

![](/img/charts-whole-page.png)

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/client/web/src/routes/home) as a reference point for this chapter. Note that this repo is a complete application and might not reflect the changes made in this page.
