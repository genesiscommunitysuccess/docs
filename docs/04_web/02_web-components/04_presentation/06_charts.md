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

A chart component is a graphical representation of a certain amount of data, that can have multiple forms. Genesis charts are base on [g2plot](https://g2plot.antv.antgroup.com/)

## Attributes and props

When you declare an `<alpha-g2plot-chart>`, you can provide the following attributes :

| Name            | Type      | Description                                                                               |
|-----------------|-----------|-------------------------------------------------------------------------------------------|
| type            | `string`  | Chooses the type of the chart. **Default: Bar** |
| config          | - | Sets the configuration for the chart. For more information about its field, [checkout here](https://g2plot.antv.antgroup.com/api/plot-api).                     |
| data            | - | Sets the data manually to be displayed in the chart                     |


## Chart datasource

When using charts, you are offered a component called `<chart-datasource>`. This component handles the communication and integration with the server. This component has two available attrbiutes:

| Name              | Description                               |
|-------------------|-------------------------------------------|
| resourceName      | Sets the resource that can be a [dataserver](../../../../server/data-server/introduction/) or a [request server](../../../../server/request-server/introduction/)|
| server-fields     | This attribute defines the selection of fields from the server, and it abides to by the following convention: first field - Used for the x-axis; second field - Employed for the y-axis and lastly the third field - Designated as the series field. |

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
