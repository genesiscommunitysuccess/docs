---
title: 'Charts'
id: charts
---

## Introduction

With Fuse, we can also implement charts in order to represent data more accurately.

With charts we can:
- display data utilizing any of the chart types we provide
- use standalone charts or linked charts

![](/img/all-charts.PNG)

## Types of charts

### Standalone charts

In order to implement a chart for our data, it needs 3 parameters at minimum. An `entity`, a `value` and a `groupBy`. The entity refers to the table of data we want the chart to reflect. The `value` refers to the values being measured or compared and the `groupBy` otherwise known as (category axis) displays the names of the chart's categories. See examples below for more details:


<zero-card style={{backgroundColor: "#101628"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Line / Default Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
           // Entity,   value,          groupBy
        chart(TRADE, TRADE.price, TRADE.trade_status)
    }
}
```
![](/img/default-chart.PNG)

</zero-card>
<br/>

:::tip
The default type of a chart is `Line`. Therefore, if we do not enter a specific parameter specifying the type of chart we want, it will default to `Line` as the image above.
:::

> The examples below have an additional parameter that allows us to specify the chart type.


<zero-card style={{backgroundColor: "#101628"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Pie Chart</b></h4>

```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.PIE)
    }
}
```
![](/img/pie-chart-ins.PNG)

</zero-card>

<br/>

<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Bar Chart</b></h4>

```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.COLUMN)
    }
}
```
![](/img/bar-chart.PNG)

</zero-card>

<br/>



<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Area Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.AREA)
    }
}
```
![](/img/area-chart.PNG)

</zero-card>

<br/>



<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Column Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.price, TRADE.instrument_id, ChartType.COLUMN)
    }
}
```
![](/img/column-chart.PNG)

</zero-card>

<br/>



<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Rose Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.ROSE)
    }
}
```

![](/img/rose-chart-q.PNG)

</zero-card>

<br/>


<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Donut Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.price, TRADE.instrument_id, ChartType.DONUT)
    }
}
```

![](/img/donut-chart-ins.PNG)

</zero-card>

<br/>



<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>DualAxes Chart</b></h4>


```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.DUALAXES)
    }
}
```
![](/img/dual-chart-2.PNG)

</zero-card>

<br/>

### Linked charts

So far we have seen what charts look like when we feed them our data. But what if we wanted to filter the data represented, based on a specific component? Similar to [Linked Ui Components](/fuse/features/linked-ui-components/), we can update our charts based on the status of another component. See example below for more detail:

<zero-card style={{backgroundColor: "#101628", padding: "4px"}}>
<h4 style={{color: "white", paddingTop: "10px", paddingLeft: "10px" }}><b>Linked Chart</b></h4>

```kotlin
ui("Chart Element") {
    page("Chart Example") {
        chart(TRADE, TRADE.quantity, TRADE.instrument_id, ChartType.PIE, ) {
            filter {
                intrumentId eq instrumentId
            }
        }
    }
}
```
![](/img/linked-chart.PNG)

</zero-card>
