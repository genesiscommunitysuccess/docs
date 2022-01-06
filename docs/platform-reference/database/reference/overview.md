---
sidebar_position: 0
title: Overview
sidebar_label: Database Reference
id: overview

---


## Different types of APIs

The Genesis database comes in two flavours:  

|                              | [Async API](../async), for kotlin             | [RxJava API](../rxjava), for java |
|------------------------------|-----------------------------------------------|-----------------------------------|
| Return type for 0..1 records | [nullable suspend](../async#nullable-suspend) | [Maybe](../rxjava#maybe)          |
| Return type for 1 record     | [suspend](../async#suspend)                   | [Single](../rxjava#single)        |
| Return type for 0..∞ records | [Flow](../async#flow)                         | [Flowable](../rxjava#flowable)    |
| Preferred for                | kotlin                                        | java                              |
| Works in                     | kotlin                                        | kotlin and java                   |

## Caching 

Genesisn 