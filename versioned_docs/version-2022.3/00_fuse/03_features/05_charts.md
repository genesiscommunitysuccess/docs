---
title: 'Charts'
id: charts
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

With Fuse, we can also implement charts in order to represent data more accurately.

With charts you can:
- display data utilizing any of the chart types we provide
- use standalone charts or connected/linked charts

## Examples

### Basic charts example

In order to implement a chart for our data, it needs 3 parameters at minimum. An entity, a value and a groupBy. The entity refers to the table of data we want the chart to reflect. The value refers to the specific value we want to see visually and the groupBy refers to the categorization of the elements represented. 

Line or Default

```kotlin
ui("Chart Element") {
    page("Chart Example") {
           // Entity,   value,          groupBy
        chart(TRADE, TRADE.price, TRADE.trade_status)
    }
}
```
![](/img/default-chart.PNG)

:::tip
The default type of a chart is `Line`
:::

### Types of charts available:

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
        chart(TRADE, TRADE.price, TRADE.instrument_id, ChartType.ROSE)
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
        chart(TRADE, TRADE.price, TRADE.instrument_id, ChartType.DUALAXES)
    }
}
```
![](/img/dual-chart.PNG)

</zero-card>

<br/>


### Meaning of GroupBy and Value

<!-- ```kotlin
ui("Chart Element") {
    page("Chart Example With Aggregation Table and attributes") {
        chart(TEST_AGGREGATION_TABLE, TEST_AGGREGATION_TABLE.price, TEST_AGGREGATION_TABLE.currency) {
            attributes(
                "height" to "500px",
                "width" to "1000px"
            )
        }
    }
}
``` -->

<!-- <Tabs>
    <TabItem value="area" label="Area" default >

    - Summary of Area graph use examples 
    - kotlin code 
    - images

    ```kotlin
    Area Graph
    ```
    </TabItem>
    <TabItem value="bar" label="Bar" >

    ```kotlin
    Bar Graph
    ```
    </TabItem>
    <TabItem value="line" label="Line" >

    ```kotlin
    Line Graph
    ```
    </TabItem>
    </Tabs>

    ### Charts

    <Tabs>
    <TabItem value="column " label="Column" default >

    ```kotlin
    Column Chart
    ```
    </TabItem>
    <TabItem value="dualaxes" label="DualAxes" >

    ```kotlin
    DualAxes Chart
    ```
    </TabItem>
    <TabItem value="pie" label="Pie" >

    ```kotlin
    Pie Chart
    ```
    </TabItem>
    <TabItem value="rose" label="Rose" >

    ```kotlin
    Rose Chart
    ```
    </TabItem>
    <TabItem value="donut" label="Donut" >

    ```kotlin
    Donut Chart
    ```
    </TabItem>
</Tabs> -->