---
sidebar_position: 20
title: Generated Repositories
sidebar_label: Generated Repositories
id: generated

---

:::note

We are still working on this page

:::

|                                                                                                 | [Generated Repositories](../generated)                                             |
|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [Supports tables](../../../concepts/data-structure/tables)                                      | ✔️                                                                                 |
| [Supports views](../../../concepts/data-structure/views)                                        | ✔️                                                                                 |
| Supports any data type                                                                          | ❌                                                                                  |
| Class to import                                                                                 | `[TableName]AsyncRepository` <br/> `[TableName]Rx3Repository`                      |
| Type safe read and write                                                                        | ✔️                                                                                 | 
| Type safe write result                                                                          | ❌                                                                                  | 
| Returns data as                                                                                 | [table](../../data-types/tables) or [view](../../data-types/views) entities        |
| Writes data as                                                                                  | [table](../../data-types/tables) or [view](../../data-types/views) entities        |
| References indexes as                                                                           | Generated methods                                                                  |
| Programming interface                                                                           | [Async](../../../reference/apis/async) or [RxJava](../../../reference/apis/rxjava) |
| Write (input)                                                                                   | Generated                                                                          |
| Write (output)                                                                                  | [Legacy Write Result](../../helper/write-result/legacy)                            |
| Subscribe                                                                                       | [Record Update](../../helper/subscription/record-update) of entity                 |
| Bulk or Range Subscribe                                                                         | [Bulk](../../helper/subscription/bulk) of entity                                   |
| Available in [event-handlers](../../../../configure-key-modules/event-handlers/configure)       | ❌                                                                                  |
| Available in [custom request replies](../../../../configure-key-modules/request-servers/custom) | ❌                                                                                  |
