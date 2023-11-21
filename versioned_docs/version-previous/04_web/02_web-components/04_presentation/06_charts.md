---
title: 'Web Components - Charts'
sidebar_label: 'Chart'
id: chart
keywords: [web, web components, chart]
tags:
    - web
    - web components
    - chart
---

A chart component is a graphical representation of a set of data. A range of different chart types can be used. Genesis charts are based on [g2plot](https://g2plot.antv.antgroup.com/en/).

## Attributes and properties

When you declare an `<alpha-g2plot-chart>`, you can provide the following attributes:

| Name            | Type      | Description                                                                               |
|-----------------|-----------|-------------------------------------------------------------------------------------------|
| type            | `string`  | Sets the type of the chart. You can use any of the [g2plot charts](https://g2plot.antv.antgroup.com/en/examples) **Default: Bar** .|
| config          | - | Sets the configuration for the chart; to see the settings that control the behaviour of the chart, go to [the g2plot documentation](https://g2plot.antv.antgroup.com/en/api/plot-api) and select the chart you require from the menu on the left. Note that not all the g2plot charts listed there are available for use in the Genesis platform.                     |
| data            | - | Where you are not using the `<chart-datasource>` component (see below), use this attribute to provide the array of data to be displayed in the chart.                   |


## Chart datasource

When using charts, you are offered a component called `<chart-datasource>`. This component handles the communication and integration with the server. This component has two attributes:

| Name              | Description                               |
|-------------------|-------------------------------------------|
| resourceName      | Identifies the resource that provides the data; this can be a [Data Server](../../../../server/data-server/introduction/) `query` or a [Request Server](../../../../server/request-server/introduction/) `requestReply`|
| server-fields     | Defines the fields of data to be charted; the first value is associated with the x-axis; the second value is associated with the y-axis; the third value is associated with the data series |

### Example

Below we have a simple example of a configuration for a chart. 

- Chart configuration:
```javascript title="chart configuration"
chartConfiguration = {
        xField: 'groupBy',
        yField: 'value',
    };
```
- Below is the declaration of a chart that uses the above configuration. The chart type is `column`. It uses the `chart-datasource` component to retrieve two fields from the `ALL_STOCKS` resource: SYMBOL (x axis) and TRADING_VOLUME (y axis).

```javascript title="chart declaration"
<zero-g2plot-chart type="column" :config=${(x) => x.chartConfiguration}>
    <chart-datasource
        resourceName = "ALL_STOCKS"
        server-fields = "SYMBOL TRADING_VOLUME"
    ></chart-datasource>
</zero-g2plot-chart>
```

## Use cases

- Display data
- Show patterns and relationships

## Additional resources

- [g2plot](https://g2plot.antv.antgroup.com/en/)
