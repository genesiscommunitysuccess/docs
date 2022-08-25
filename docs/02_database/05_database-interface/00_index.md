---
title: 'Database interface'
sidebar_label: 'Database interface'
id: database-interface
---

[Introduction](/database/database-interface/database-interface/)  | [EntityDb](/database/database-interface/entity-db/) |  [Generated repositories](/database/database-interface/generated-repositories/) | [RxDb](/database/database-interface/rxdb/) 

Genesis supports different ways of interacting with the database. Regardless of the interface used, the operations remain the same. The preferred way of accessing the database is via the [EntityDb](/database/database-interface/entity-db/).

|  | [EntityDb](/database/database-interface/entity-db/)                                                     | [Generated Repositories](/database/database-interface/generated-repositories/) | [RxDb](/database/database-interface/rxdb/) |
| --- |---------------------------------------------------------------------------------------------------------| --- | --- |
| [Supports tables](/database/fields-tables-views/tables/) | ✔️ | ✔️ | ❌ |
| [Supports views](/database/fields-tables-views/views/) | ✔️ | ✔️ | ❌ |
| Supports any data type | ✔️ | ❌ | ✔️ |
| Class to import | `AsyncEntityDb` \ `RxEntityDb` | `[TableName]AsyncRepository` \ `[TableName]Rx3Repository` | `RxDb` |
| Type safe read and write | ✔️ | ✔️ | ❌ |
| Type safe write result | ✔️ | ❌ | ❌ |
| Returns data as | [table](/database/data-types/table-entities//) or [view](/database/data-types/views-entities/) entities | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities//) entities | [DbRecord](/database/data-types/dbrecord/) |
| Writes data as | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities  | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities | [DbRecord](/database/data-types/dbrecord/) |
| References indexes as | [index entities](/database/data-types/index-entities/) | Generated methods | [DbRecord](/database/data-types/dbrecord/) and `String` |
| Programming interface | [Async](/database/types-of-api/async/) or [RxJava](/database/types-of-api/rxjava/) | [Async](/database/types-of-api/async/) or [RxJava](/database/types-of-api/rxjava/) | [RxJava](/database/types-of-api/rxjava/) |
| Write (input) | [Modify Details](/database/helper-classes/modify-details/#entity-modify-details) | Generated | [Modify Details](/database/helper-classes/modify-details/#modify-details) |
| Write (output) | [Write Result](/database/helper-classes/write-result/#entity-write-result) | [Write Result](/database/helper-classes/write-result/#write-result) | [Write result](/database/helper-classes/write-result/#write-result) |
| Subscribe | [Record Update](/database/helper-classes/subscription/record-update/) of entity | [Record Update](/database/helper-classes/subscription/record-update/) of entity | [Record Update](/database/helper-classes/subscription/record-update/) of `DbRecord` |
| Bulk or Range Subscribe | [Bulk](/database/helper-classes/subscription/bulk/) of entity | [Bulk](/database/helper-classes/subscription/bulk/) of entity | [Bulk](/database/helper-classes/subscription/bulk/) of `DbRecord` |
| Available in [Event Handlers](/getting-started/learn-the-basics/modules/inside-an-event-handler/) | ✔️ | ❌ | ❌ |
| Available in [custom Request Servers](/getting-started/learn-the-basics/modules/inside-a-request-server/) | ✔️ | ❌ | ❌ |