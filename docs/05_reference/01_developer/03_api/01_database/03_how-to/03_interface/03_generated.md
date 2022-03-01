---
sidebar_position: 3
title: Generated Repositories
sidebar_label: Generated Repositories
id: generated

---

:::note

We are still working on this page

:::

|                                                                                                                                | [Generated Repositories](../generated)                                             |
|--------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [Supports tables](../../../concepts/data-structure/tables)                                                                     | ✔️                                                                                 |
| [Supports views](../../../concepts/data-structure/views)                                                                       | ✔️                                                                                 |
| Supports any data type                                                                                                         | ❌                                                                                  |
| Class to import                                                                                                                | `[TableName]AsyncRepository` <br/> `[TableName]Rx3Repository`                      |
| Type safe read and write                                                                                                       | ✔️                                                                                 | 
| Type safe write result                                                                                                         | ❌                                                                                  | 
| Returns data as                                                                                                                | [table](../../data-types/tables) or [view](../../data-types/views) entities        |
| Writes data as                                                                                                                 | [table](../../data-types/tables) or [view](../../data-types/views) entities        |
| References indexes as                                                                                                          | Generated methods                                                                  |
| Programming interface                                                                                                          | [Async](../../../reference/apis/async) or [RxJava](../../../reference/apis/rxjava) |
| Write (input)                                                                                                                  | Generated                                                                          |
| Write (output)                                                                                                                 | [Legacy Write Result](../../helper/write-result/legacy)                            |
| Subscribe                                                                                                                      | [Record Update](../../helper/subscription/record-update) of entity                 |
| Bulk or Range Subscribe                                                                                                        | [Bulk](../../helper/subscription/bulk) of entity                                   |
| Available in [event-handlers](/creating-applications/defining-your-application/business-logic/event-handlers/)       | ❌                                                                                  |
| Available in [custom request servers](/creating-applications/defining-your-application/user-interface/web-ui-reference/request-servers/rs-advanced-technical-details/#custom-request-servers) | ❌                                                                                  |

During the code generation phase repository classes are generated for every table and view in the system. These 
repositories provide a type-safe way of accessing the database. 

The main differences between the generated repositories and the [Entity Db](../entity-db):

1. the entity db can handle any database entity, each repository can only handle a single entity
2. the generated repositories have specific methods for every index, whereas the entity db is fully generic

