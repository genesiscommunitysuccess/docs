---
title: 'Charts'
id: charts
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Introduction

With Fuse, we can also implement charts, in order to condense our data into easy-to-understand formats and effectively communicate important points.

With charts we can:
- display data utilizing any of the chart types we provide
- use standalone charts or linked charts

![](/img/all-charts.PNG)


### Chart types

In order to implement a chart, there are a minimum of 3 parameters required.
> `entity` refers to the model/ table of data we want the chart to reflect. 

> `value` is the field we’re displaying on the chart. This field should always be numeric.

> `groupBy` otherwise known as (category axis), is the field used for grouping. 


See examples below for more details:

<Tabs>
<TabItem value="bar" label="Default / Bar" default >

:::important
Chart type parameter is optional. If not specified, it will default to `BAR`.
:::
    
:::tip
Bar charts can help you compare data between different groups or to track changes over time. They are most useful when there are big changes or to show how one group compares against other groups. 
:::
<zero-card style={{backgroundColor: "#101628"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Default / Bar Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(
            entity = TRADE, 
            value = TRADE.price, 
            groupBy = TRADE.trade_status
        )
    }
}
```
![](/img/bar-chart.PNG)
<!-- ![](/img/default-chart.PNG) -->

</zero-card>
</TabItem>

<TabItem value="pie" label="Pie" default >

:::important
Note the additional parameter specifying the chart type. If we want to use a specific chart, we must use the type parameter. 
:::

:::tip
A pie chart typically represents numbers in percentages, used to visualize a part to whole relationship or a composition. 
:::
<zero-card style={{backgroundColor: "#101628"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Pie Chart</b></h4>

```kotlin
chart(
    entity = TRADE, 
    value = TRADE.quantity,
    groupBy = TRADE.instrument_id, 
    type = ChartType.PIE
)
```
![](/img/pie-chart-ins.PNG)

</zero-card>
</TabItem>

<TabItem value="line" label="Line" >

:::tip
Line charts are best suited for trend-based visualizations of data over a period of time. With line charts, the emphasis is on the continuation or the flow of the values (a trend).
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Line Chart</b></h4>

```kotlin
chart(
    entity = TRADE, 
    value = TRADE.quantity,
    groupBy = TRADE.instrument_id, 
    type = ChartType.LINE
)
```
![](/img/line-chart.PNG)

</zero-card>

 </TabItem>
 
<TabItem value="area " label="Area" >

:::tip
Area charts will fill up the area below the line, so the best use for this type of chart is for presenting accumulative value changes over time.
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Area Chart</b></h4>

```kotlin
chart(
    entity = TRADE, 
    value = TRADE.quantity, 
    groupBy = TRADE.instrument_id, 
    type = ChartType.AREA
)
```
![](/img/area-chart.PNG)

</zero-card>

 </TabItem>

<TabItem value="column" label="Column" >

:::tip
With column charts you could compare values for different categories or compare value changes over a period of time for a single category. For column charts, the numerical axis must start at zero. Our eyes are very sensitive to the height of columns, and we can draw inaccurate conclusions when those bars are truncated.
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Column Chart</b></h4>


```kotlin
chart(
    entity = TRADE, 
    value = TRADE.price, 
    groupBy = TRADE.instrument_id, 
    type = ChartType.COLUMN
)
```
![](/img/column-chart.PNG)

</zero-card>

</TabItem>

<TabItem value="rose" label="Rose" >

:::tip
A rose chart shows the circular distribution of directional data.
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Rose Chart</b></h4>

```kotlin
chart(
    entity = TRADE, 
    value = TRADE.quantity,
    groupBy = TRADE.instrument_id, 
    type = ChartType.ROSE
)
```

![](/img/rose-chart-q.PNG)

</zero-card>
</TabItem>

<TabItem value="donut" label="Donut" >

:::tip
The donut chart can help you compare individual categories or dimensions to the larger whole, just like a pie chart, but with a couple of advantages. Donut charts can make it easier for users to compare individual dimensions.
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Donut Chart</b></h4>


```kotlin
chart(
    entity = TRADE, 
    value = TRADE.price, 
    groupBy = TRADE.instrument_id, 
    type = ChartType.DONUT
)
```

![](/img/donut-chart-ins.PNG)

</zero-card>
</TabItem>

<TabItem value="dualaxes" label="DualAxes" >

:::tip
This chart is used to present the relationship between two variables. More specifically, it is useful for demonstrating the relationship between two or more measures with different amplitude and scale.
:::
<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>DualAxes Chart</b></h4>

```kotlin
chart(
    entity = TRADE,
    value = TRADE.quantity, 
    groupBy = TRADE.instrument_id, 
    type = ChartType.DUALAXES
)
```
![](/img/dual-chart-2.PNG)

</zero-card>

</TabItem>
</Tabs> 

### Linked charts

So far we have seen what charts look like when we feed them our data. But what if we wanted to filter the data represented, based on a specific component? Similar to [Linked Ui Components](/fuse/features/linked-ui-components/), we can update our charts based on the status of another component. See example below for more detail:

<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Linked Chart</b></h4>

```kotlin
verticalLayout {
    val instrumentGrid by entityManager(
        entity = INSTRUMENT,
        title = "Instruments",
        operations = listOf(ADD),
    )

    chart(
        entity = TRADE,
        value = TRADE.quantity,
        groupBy = TRADE.instrument_id,
        type = ChartType.PIE,
    ) {
        filter {
            instrumentId eq instrumentGrid.entity.instrumentId
        }
    }
}
```
![](/img/linked-chart.PNG)

</zero-card>


 

  
 
 
  
