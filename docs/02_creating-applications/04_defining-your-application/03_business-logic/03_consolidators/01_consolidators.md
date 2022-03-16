---
title: 'Introduction'
sidebar_label: 'Introduction'
sidebar_position: 1
id: consolidators
---

[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)

A consolidator exists to aggregate data or perform calculations whenever the underlying data is changed.

Typical use cases are:

- Calculate real-time positions based on intra-day price changes.
- Calculate snapshot report of number of trades per day
- Calculate snapshot numbers for a chart

This is what a consolidator does:

1. It listens to a specific table or view, for example, TRADES.
2. Every time there is an update on that table, it performs an aggregation or calculation that you specify.
3. It inputs the result to a different table in the database, for example, TRADE_STATS.

A consolidator does not do anything else. It is a self-contained box in the server. It reads from the database, it crunches data when triggered. It writes to the database. That’s it. It has no interaction with any other service on the server or the user interface.

So what you do with the results of the consolidator is your problem. If you need to publish the data it writes to the database, you'll need a [data server](/creating-applications/defining-your-application/user-interface/data-servers/data-servers/) or [request server](/creating-applications/defining-your-application/user-interface/request-servers/request-servers/).



