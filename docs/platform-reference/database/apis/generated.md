---
sidebar_position: 20
title: Generated Repositories
sidebar_label: Generated Repositories
id: generated

---

:::note

We are still working on this page

:::


|                                                                                              | [Generated Repositories](../generated)                                          |
|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| [Supported tables](../../data-structure/tables)                                             | ✔️                                                                              |
| [Supported views](../../data-structure/views)                                               | ✔️                                                                              |
| Supports any data type                                                                       | ✔️                                                                              | 
| Class to import                                                                              | `[TableName]AsyncRepository` / `[TableName]Rx3Repository`                       |
| Type safe read and write                                                                     | ✔️                                                                              | 
| Type safe write result                                                                       | ❌                                                                               | 
| Returns data as                                                                              | [table](../../entity-types/tables) or [view](../../entity-types/views) entities |
| Writes data as                                                                               | [table](../../entity-types/tables) or [view](../../entity-types/views) entities |
| References indexes as                                                                        | Generated methods                                                               |
| Programming interface                                                                        | [Async](../../reference/async) or [RxJava](../../reference/rxjava)      |
| Write (input)                                                                                | [Legacy Modify Details](../../helper/modify/legacy)                             |
| Write (output)                                                                               | Generated methods                                                               |
| Subscribe                                                                                    | [Generic Record Update](../../helper/write-result/generic)                      |
| Available in [event-handlers](../../../configure-key-modules/event-handlers/configure)       | ❌                                                                               |
| Available in [custom request replies](../../../configure-key-modules/request-servers/custom) | ❌                                                                               |

️
