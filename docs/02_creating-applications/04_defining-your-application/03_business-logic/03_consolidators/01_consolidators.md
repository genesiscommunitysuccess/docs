---
title: 'Introduction'
sidebar_label: 'Introduction'
sidebar_position: 1
id: consolidators
---

[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)

A consolidator exists to aggregate data or perform calculations whenever the underlying data is changed.

Typical use cases are:

- Calculate real-time positions based on intra-day price changes.
- Calculate snapshot report of number of trades per day
- Calculate snapshot numbers for a chart

Consolidators listen to updates on an underlying database object: either a view or a table. When there are changes to that object, the consolidator aggregates those changes and then outputs the aggregated data to a specified type: the output type.

There are two ways to use GPAL consolidators:

- as a service: in this case, the output type must always be a table entity. The consolidator service listens to table updates, and updates a target table. 
- as a consolidator object: the object can then be used in code in other parts of your application to perform on-demand consolidations and what-if analysis. The output is not saved in your application's database.

### Consolidator as a service

This is the standard method of using consolidators. The consolidator runs a service and automatically updates an output table. 


- Second, they support cold-start. A cold-start will firstly rerun the aggregation over existing
data, before continuing in normal mode. This can be useful to deal with changes in the consolidator definition, or if there has been a problem aggregating data.

:::important

In a multi-node environment, consolidator services should be set to primary only; otherwise, the changes will be applied
multiple times.

:::

### Consolidator objects

You can create consolidators as classes that can be used in code elsewhere in your application. This means they can be used in custom services, as well as in request servers and event handlers. They perform on-demand consolidations where the input can be read directly from the database, provided at runtime, or a combination. Effectively that gives you three types of consolidator object, which we shall consider after the following simple example:

For example:
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
#### Three types of consolidator object
You can consider the following types of consolidator object as different use cases.

- **input-output**. This type of consolidator object simply reads an input table and creates an output that can be used elsewhere in your application. For example, it could read a table of trades and create the sum of all trade values.
- **read input table**. This type of consolidator reads a table where data is input and then creates the effect of adding the new information to another table. For example, it could read updates to a table of orders and check the table of trades to find other trades that match that order (by order number or by counterparty, for example).
- **read output table**. This type of consolidator reads an output table and checks the effect on another table. For example, it could read the output from a trade table (a new trade), and compare to an order in the order table. It could then calculate the effect of the change in terms of how much is outstanding and fulfilled in the order.
