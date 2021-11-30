---
title: 'Technical components'
sidebar_label: 'Technical components'
sidebar_position: 30
id: technical-components
---

These technical components * blah*

| Name| Description|
|------------------------------------|--------------------|
| Event Handler | Executes business logic in response to system events     |
| Data Server | Real-time data distribution |
| Request Server |  Snapshot data requests         |
| Consolidator | Real-time data aggregation and calculation            | 
| Evaluator | Rule evaluation (time or condition-based)           |
| R Component | R language integration for querying data         | 
| Apache Camel | Bidirectional integration across a range of connected systems          | 
| Streamer | Streaming to and from internal and external services            | 
| Streamer Client | Streaming to and from internal and external services          |
| Genesis Notify | Symphony, Email & Teams integration         | 
| Oracle | Connect to database, infrastructure & applications          | 
| ITRS Geneos | Real-time monitoring & system management          | 
| DbToGenesis | RDB integration - data streaming from RDB into Genesis DB          | 
| GenesisToDb | RDB integration - data streaming from Genesis DB to RDB          |

| Type                               | Meaning                           | Example        |
|------------------------------------|-----------------------------------|----------------|
| `E`                                | A table or view entity            | `Trade`        |
| `T`                                | A table entity                    | `Trade`        |
| `V`                                | A view entity                     | `TradeView`    |
| `EntityIndex<E>`                   | An index of E                     | `Trade.ById`   |
| `UniqueEntityIndex<E>`             | A unique index of E               | `Trade.ById`   |
| `NonUniqueEntityIndex<E>`          | A non unique index of E           | `Trade.ByDate` |
| `EntityIndexReference<E>`          | An index reference of E           | `Trade.ById`   |
| `UniqueEntityIndexReference<E>`    | A unique index reference of E     | `Trade.ById`   |
| `NonUniqueEntityIndexReference<E>` | A non unique index reference of E | `Trade.ByDate` |
| `F<E>`                             | The full table /view name for E   | `TRADE`        |
| `Class<E>`                         | The class reference for E         | `Trade.class`  |
| `KClass<E>`                        | The kotlin class reference for E  | `Trade::class` |