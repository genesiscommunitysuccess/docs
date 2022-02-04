---
title: 'Consolidators'
sidebar_label: 'Consolidators'
sidebar_position: 1
id: configure
---

A Consolidator exists to aggregate data or perform calculations whenever the underlying data is changed.

Typical use cases are:

- Calculate real-time positions based on intra-day price changes.
- Calculate snapshot report of number of trades per day
- Calculate snapshot numbers for a chart

This is what a consolidator does:

1. It listens to a specific table or view, for example, TRADES.
2. Every time there is an update on that table, it performs an aggregation or calculation that you specify.
3. It inputs the result to a different table in the database, for example, TRADE_STATS.

A consolidator does not do anything else. It is a self-contained box in the server. It reads from the database, it crunches data when triggered. It writes to the database. That’s it. It has no interaction with any other service on the server or the user interface.

So what you do with the results of the Consolidator is your problem. If you need to publish the data it writes to the database, you'll need a [data server](/platform-reference/configure-key-modules/data-servers/configure/) or [request server](/platform-reference/configure-key-modules/request-servers/configure/).

There is one important operational consideration if you have a consolidator in your application. If you stop the process, you need to use the `--coldStart` parameter when you restart. In short, you need to do a [cold start](/platform-reference/configure-key-modules/consolidators/coldstart/).

### Adding the consolidator to processes.xml

If you are going to use the Consolidator process, you must ensure that it is included in the  **processes.xml** file for the application. This is located in the .cfg folder for the application. The file contains tags that define key characteristics of the Consolidator - for example, dependencies and logging level. Here is an example configuration (the tags are explained in the page on the [processes.xml file](/platform-reference/essential-information/processes-xml)):
 

```xml
<process name="TRADING_APP_CONSOLIDATOR">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true  -DXSD_VALIDATE=false</options>
    <module>consolidator2</module>
    <package>global.genesis.consolidator2</package>
    <config>trading_app-consolidator2.xml</config>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <dependency>TRADING_APP_EVENT_HANDLER</dependency>
</process>
```