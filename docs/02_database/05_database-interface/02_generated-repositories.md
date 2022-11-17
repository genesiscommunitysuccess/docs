---
title: 'Database interface - Generated repositories'
sidebar_label: 'Generated repositories'
id: generated-repositories
keywords: [database, database interface, generated, repositories]
tags:
    - database
    - database interface
    - generated
    - repositories
---



During the code generation phase, repository classes are generated for every table and view in the system. These repositories provide a type-safe way of accessing the database.

The main differences between the generated repositories and the [Entity Db](/database/database-interface/entity-db/) are:

- The entity db can handle any database entity, each repository can only handle a single entity.
- The generated repositories have specific methods for every index of table/view, whereas the entity db is fully generic.

|  | [Generated Repositories](/database/database-interface/generated-repositories/) |
| --- |--------------------------------------------------------------------------------------------------------|
| [Supports tables](/database/data-types/table-entities/) | ✔️                                                                                                     |
| [Supports views](/database/data-types/views-entities/) | ✔️                                                                                                     |
| Supports any data type | ❌                                                                                                      |
| Class to import | `[TableName]AsyncRepository` \ `[TableName]Rx3Repository`                                              |
| Type-safe read and write | ✔️                                                                                                     |
| Type-safe write result | ❌                                                                                                      |
| Returns data as | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities |
| Writes data as | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities |
| References indexes as | Generated methods                                                                                      |
| Programming interface | [Async](/database/types-of-api/async/) or [RxJava](/database/types-of-api/rxjava/)                    |
| Write (input) | Generated                                                                                              |
| Write (output) | [Write Result](/database/helper-classes/write-result/#write-result)                                  |
| Subscribe | [Record Update](/database/helper-classes/subscription/record-update/#write-result) of entity                |
| Bulk or Range Subscribe | [Bulk](/database/helper-classes/subscription/bulk/) of entity                                          |
| Available in [Event Handlers](/server/event-handler/introduction/) | ❌                                                                                                      |
| Available in [custom Request Servers](/server/request-server/advanced/#custom-request-servers) | ❌                                                                                                      |

With generated repositories, there are two flavours of the entity db:

* one has a [RxJava API](/database/types-of-api/rxjava/) signatures, for use from Java

* the other flavour has an [Async API](/database/types-of-api/async/) signature, for use by Kotlin

If you have a table called **POSITION**, then two repositories called **PositionRx3Repository** and **PositionAsyncRepository** will be generated as part of [generateDao](/database/fields-tables-views/genesisDao/) task.

You can perform CRUD operations on Table/View by its primary key and indices.
