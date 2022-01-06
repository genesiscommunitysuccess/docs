---
sidebar_position: 30
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


|                                                                                              | [RxDb](../rxdb)                                          |
|----------------------------------------------------------------------------------------------|----------------------------------------------------------|
| [Supported tables](../../data-structure/tables)                                             | ❌                                                        |
| [Supported views](../../data-structure/views)                                               | ❌                                                        |
| Class to import                                                                              | `RxDb`                                                   |
| Type safe read and write                                                                     | ❌                                                        | 
| Type safe write result                                                                       | ❌                                                        | 
| Returns data as                                                                              | [DbRecord](../../data/dbrecord)                          |
| Writes data as                                                                               | [DbRecord](../../data/dbrecord)                          |
| References indexes as                                                                        | [DbRecord](../../data/dbrecord) and `String`             |
| Programming interface                                                                        | [RxJava](../../reference/rxjava)                     |
| Write (input)                                                                                | [Legacy Modify Details](../../helper/modify/legacy)      |
| Write (output)                                                                               | [Legacy Write result](../../helper/modify/legacy)        |
| Subscribe                                                                                    | [Legacy Record Update](../../helper/write-result/legacy) |
| Available in [event-handlers](../../../configure-key-modules/event-handlers/configure)       | ❌                                                        |
| Available in [custom request replies](../../../configure-key-modules/request-servers/custom) | ❌                                                        |

️