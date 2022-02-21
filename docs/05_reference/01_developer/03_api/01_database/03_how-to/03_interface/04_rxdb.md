---
sidebar_position: 4
title: RxDb
sidebar_label: RxDb
id: rxdb

---

:::warning

Using `RxDb` instead of [entityDb](../entity-db) or [generated repositories](../generated) will circumvent
compile-time validation of database interactions. This means that errors might not appear until
runtime or might lead to unexpected results.

:::

:::note

We are still working on this page

:::

|                                                                                                 | [RxDb](../rxdb)                                                        |
|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| [Supports tables](../../../concepts/data-structure/tables)                                      | ❌                                                                      |
| [Supports views](../../../concepts/data-structure/views)                                        | ❌                                                                      |
| Supports any data type                                                                          | ✔️                                                                     |
| Class to import                                                                                 | `RxDb`                                                                 |
| Type safe read and write                                                                        | ❌                                                                      | 
| Type safe write result                                                                          | ❌                                                                      | 
| Returns data as                                                                                 | [DbRecord](../../data-types/dbrecord)                                  |
| Writes data as                                                                                  | [DbRecord](../../data-types/dbrecord)                                  |
| References indexes as                                                                           | [DbRecord](../../data-types/dbrecord) and `String`                     |
| Programming interface                                                                           | [RxJava](../../../reference/apis/rxjava)                               |
| Write (input)                                                                                   | [Legacy Modify Details](../../helper/modify/legacy)                    |
| Write (output)                                                                                  | [Legacy Write result](../../helper/write-result/legacy)                |
| Subscribe                                                                                       | [Record Update](../../helper/subscription/record-update) of `DbRecord` |
| Bulk or Range Subscribe                                                                         | [Bulk](../../helper/subscription/bulk) of `DbRecord`                   |
| Available in [event-handlers](/creating-applications/defining-your-application/business-logic/event-handlers/configure/)       | ❌                                                                      |
| Available in [custom request replies](/creating-applications/defining-your-application/user-interface/request-servers/custom/) | ❌                                                                      |

