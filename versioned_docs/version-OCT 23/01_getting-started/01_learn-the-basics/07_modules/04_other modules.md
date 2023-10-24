---
title: 'Other server modules'
sidebar_label: 'Other server modules'
id: other-modules
keywords: [getting started, modules, consolidator, evaluator]
tags:
    - getting started
    - modules
    - consolidator
    - evaluator
---

## Application modules
You should also know about two important modules that can be part of your application:

- [Consolidation Manager](../../../03_server/07_consolidator/01_introduction.md) enables you to aggregate data and perform other calculations so that you can show information such as the total value of a number of trades.
- [Evaluator](../../../03_server/08_evaluator/01_introduction.md) enables you to connect Event Handlers to two different kinds of event: dynamic and static (cron rules). This means you can set up jobs to go run at specific times (such as EOD reports) or in response to defined triggers (such as broken limits).

## Integration modules
In many cases you need your application to integrate to other systems, either within your organisation or with a third party. The Genesis low-code platform has a range of practical modules that take the hard work out of the task. These include:

- [Data Pipeline](../../../../server/integration/data-pipeline/introduction/), which enables you to define pipelines that map data from an external source (database, file) to tables in your application. 
- [FIX connections](../../../../server/integration/gateways-and-streamers/introduction/), which enables you to stream data in from and out to FIX connections
- [Refinitiv](../../../../server/integration/market-data-adaptors/refinitiv/) and other pre-built adaptors enable your application to ingest market data
- [Apache Camel](../../../../server/integration/apache-camel/introduction/), which provides a wide range of components for integrating with external systems

## Core modules
The platform has core modules that handle inter-process communications and control access to the whole application, as well as to specific information and features defined by you.

- [Auth Manager](../../../../server/access-control/authentication-overview/) 
- [Perms](../../../../server/access-control/authorisation-overview/#generic-permissions)
- [Cluster](../../../../operations/clustering/overview/)
- [Genesis Router](../../../../server/configuring-runtime/genesis-router/)  

