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

Charts component is a wrapper for `@antv/g2plot`, that allows you the following types: Line, Area, Bar, Column, Pie, Dual Axes, Rose.

You can quickly add charts to your application by adding them to `template` within your route.

Example:

```typescript title='home.template.ts'
<zero-charts type="pie" :config=${x => x.chartsConfiguration} :data=${x => x.chartsData}></zero-charts>
```

As you can see, we bind `chartsConfiguration`, `chartsData` from our component definition to the `:config` and `:data` properties on the chart component.

Sample configuration and data for pie chart:

```typescript title='home.ts'
@observable chartsConfiguration = {
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

@observable chartsData = [
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

To achieve this we can use `charts-datasource`.

Use the snippet below, where:

- We start by initialising the datasource component with the requested `resourceName` (`ALL-POSITIONS`) and the fields that we want the data for (`INSTRUMENT NAME` and `VALUE`).
- Then we specify a `charts-fields` to which we want to assign the data from the API. In this case:
    - type = INSTRUMENT_NAME 
    - value = VALUE
- And finally we request a snapshot of the data.

```typescript title="home.template.ts"
<zero-charts type="pie" :config=${(x) => x.chartsConfiguration}>
  <charts-datasource
    resourceName="ALL_POSITIONS"
    server-fields="INSTRUMENT_NAME VALUE"
    charts-fields="type value"
    isSnapshot
  ></charts-datasource>
</zero-charts>
```

## Conclusion
You should have a data chart that resembles something like this:

![](/img/charts.png)

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/client/web/src/routes/home) as a reference point for this chapter.