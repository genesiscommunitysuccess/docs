---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server/consolidator/introduction) | [Basics](/server/consolidator/basics) |  [Advanced](/server/consolidator/advanced) | [Examples](/server/consolidator/examples) | [Configuring runtime](/server/consolidator/configuring-runtime) | [Testing](/server/consolidator/testing)

A Consolidator exists to aggregate data or perform calculations whenever the underlying data is changed.

Typical use cases are:

- Calculate real-time positions based on intra-day price changes.
- Calculate snapshot report of number of trades per day
- Calculate snapshot numbers for a chart

Consolidators listen to updates on an underlying database object: either a view or a table. When there are changes to that object, the Consolidator aggregates those changes and then outputs the aggregated data to a specified type: the output type.

There are two ways to use GPAL Consolidators:

- as a service: in this case, the output type must always be a table entity. The Consolidator service listens to table updates, and updates a target table. 
- on demand (as a Consolidator object): the object can be used in code in other parts of your application to perform on-demand consolidations and what-if analysis. The output is not saved in your application's database.

## Consolidator as a service

````mermaid
graph TD
    A[INPUT - Table/View] --> |Notifies of data updates| B[ CONSOLIDATOR Service]
    B -->|Stores Consolidated data| C[OUTPUT - Table]
````

This is the standard method of using Consolidators. The Consolidator runs as a process (service) that you can monitor using the `mon` command. An individual Consolidator in your **consolidator.kts** file listens to a specific table and automatically updates an output table. 



## Consolidator on-demand (objects)

Consolidators objects are classes that can be used in code elsewhere in your application. They can be used in custom services, as well as in Request Servers and Event Handlers. 

These Consolidators perform on-demand consolidations where the input can be one of the following:

- it can be read directly from the database
- it can be provided at runtime
- it can be a combination of both of these. 

Effectively, that gives you three types of Consolidator object, which we shall introduce after the following simple example:

```kotlin
// consolidate database records:
val order: Order? = tradeConsolidator.get(Trade.ById("A"))
val orders: List<Order> = tradeConsolidator.getRange(Trade.ByOrderId("A"), 1).toList()
// consolidate runtime instances:
val order: Order? = tradeConsolidator.consolidate(trade)
val orders: List<Order> = tradeConsolidator.consolidate(trade1, trade2, trade3)
// what-if analysis, combine both database records and runtime instances:
val result = tradeConsolidator.whatIf(Trade.ByOrderId("2"), trade1, trade2)
```
### Three types of Consolidator object
You can consider the following types of Consolidator object as different use cases.

- **input-output**. This type of Consolidator is not limited to tables. It takes any input and produces any output; the output it creates can be used elsewhere in your application. For example, it could read a table of trades and create the sum of all trade values.
````mermaid
graph TD
    B[Input] --> C[Consolidator on Demand]
    C --> D[Output]
  
````
- **read input table**. This type of Consolidator reads a table where data is changed and then creates an output; the output can be anything. For example, it could read updates to a table of orders and check the table of trades to find other trades that match that order (by order number or by counterparty, for example).
````mermaid
graph TD
G --> I
subgraph ide1 [ ]
H[Input Data] --> I[Consolidator On Demand]
I -->J[Output]
end
subgraph ide2 [ ]
G[Input Table - from DB]
end
````
- **read output table**. This type of Consolidator can read any type of input, but the output must be a table. For example, it could read the output from a trade table (a new trade), and compare to an order in the order table. It could then calculate the effect of the change in terms of how much is outstanding and fulfilled in the order.
````mermaid
graph TD
M[Input Data] -->  N[Consolidator On Demand]
L[Input Data] --> N[Consolidator On Demand]
N -->O[Output Table]
````

Consolidators are conventionally defined in the file **_application_-consolidator.kts**. 

If your application is called *Tiresias*, your configuration file is **tiresias-consolidator.kts**.
