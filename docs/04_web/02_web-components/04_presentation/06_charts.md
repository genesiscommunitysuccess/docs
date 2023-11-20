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

A chart component is a graphical representation of a set of data, that can have multiple forms. Genesis charts are based on [g2plot](https://g2plot.antv.antgroup.com/)

## Attributes and props

When you declare an `<alpha-g2plot-chart>`, you can provide the following attributes :

| Name            | Type      | Description                                                                               |
|-----------------|-----------|-------------------------------------------------------------------------------------------|
| type            | `string`  | Sets the type of the chart. **Default: Bar** |
| config          | - | Sets the configuration for the chart. For more information about its field, [checkout here](https://g2plot.antv.antgroup.com/api/plot-api).                     |
| data            | - | Provides the data to be displayed in the chart                     |


## Chart datasource

When using charts, you are offered a component called `<chart-datasource>`. This component handles the communication and integration with the server. This component has two attributes:

| Name              | Description                               |
|-------------------|-------------------------------------------|
| resourceName      | Identifies the resource that provides the data; this can be a [Data Server](../../../../server/data-server/introduction/) or a [Request Server](../../../../server/request-server/introduction/)|
| server-fields     | Defines the fields of data to be charted; the first field provides data for the x-axis; the second field provides data for the y-axis; the third field provides the data series |

### Example

Below we have an example of a bar chart with its configuration:

- Chart configuration:
```javascript title="chart configuration"
chartConfiguration = {
        xField: 'groupBy',
        yField: 'value',
    };
```
- Below you see the declaration of a chart with a type: column with the component `chart-datasource`, retreiving information from the `ALL_STROCKS` query:

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
