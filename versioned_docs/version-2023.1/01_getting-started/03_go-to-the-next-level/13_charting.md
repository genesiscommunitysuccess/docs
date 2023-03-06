---
title: 'Go to the next level - Create a chart'
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
The goal of this section is to add a data chart to the UI.

## Declare a chart in the UI

g2plot-chart component is a wrapper for `@antv/g2plot`, that allows you the following types: Line, Area, Bar, Bubble, Column, Pie, Dual Axes, Rose, Scatter.

You can quickly add charts to your application by adding them to `template` within your route.

Example:

```typescript title='home.template.ts'
<zero-g2plot-chart type="pie" :config=${x => x.chartConfiguration} :data=${x => x.chartData}></zero-g2plot-chart>
```

As you can see, we bind `chartConfiguration`, `chartData` from our component definition to the `:config` and `:data` properties on the chart component.

Sample configuration and data for pie chart:

```typescript title='home.ts'
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
```

For further configuration examples please see: [here](https://g2plot.antv.vision/en/examples/gallery).

## Fetching the data
Now you will define how to fetch the data from the server.

To achieve this we can use `chart-datasource`.

Use the snippet below, where:

- We start by initialising the datasource component with the requested `resourceName` (`ALL_POSITIONS`) and the fields that we want the data for (`INSTRUMENT_ID` and `VALUE`).
- And finally we request a snapshot of the data.

```typescript title="home.template.ts"
<zero-g2plot-chart type="pie" :config=${(x) => x.chartConfiguration}>
  <chart-datasource
    resourceName="ALL_POSITIONS"
    server-fields="INSTRUMENT_ID VALUE"
    isSnapshot
  ></chart-datasource>
</zero-g2plot-chart>
```

## Conclusion
You should have a data chart that resembles something like this:

![](/img/charts.png)

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/client/web/src/routes/home) as a reference point for this chapter.
