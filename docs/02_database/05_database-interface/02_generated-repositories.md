---
title: 'Generated repositories'
sidebar_label: 'Generated repositories'
id: generated-repositories
---


[Introduction](/database/database-interface/)  | [EntityDb](/database/database-interface/entity-db/) |  [Generated repositories](/database/database-interface/generated-repositories/) | [RxDb](/database/database-interface/rxdb/) 

##### NOTE

We are still working on this page

|  | [Generated Repositories](/database/database-interface/generated-repositories/) |
| --- | --- |
| [Supports tables](/database/data-types/table-entities/) | ✔️ |
| [Supports views](/database/data-types/views-entities/) | ✔️ |
| Supports any data type | ❌ |
| Class to import | `[TableName]AsyncRepository`\
`[TableName]Rx3Repository` |
| Type-safe read and write | ✔️ |
| Type-safe write result | ❌ |
| Returns data as | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities |
| Writes data as | [table](/database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities |
| References indexes as | Generated methods |
| Programming interface | [Async](/database/types-of-api/asynch/) or [RxJava](/database/types-of-api/rxjava/) |
| Write (input) | Generated |
| Write (output) | [Legacy Write Result](/database/helper-classes/write-results/legacy/) |
| Subscribe | [Generic Record Update](/database/helper-classes/subscription/record-update/) of entity |
| Bulk or Range Subscribe | [Bulk](/database/helper-classes/subscription/bulk/) of entity |

| Available in [Event Handlers](/getting-started/learn-the-basics/modules/inside-an-event-handler/) | ❌ | | Available in [custom Request Servers](/server-modules/request-server/advanced/#custom-request-servers) | ❌ |

During the code generation phase, repository classes are generated for every table and view in the system. These repositories provide a type-safe way of accessing the database.

The main differences between the generated repositories and the [Entity Db](/database/database-interface/entity-db/) are:

1.  The entity db can handle any database entity, each repository can only handle a single entity.
2.  The generated repositories have specific methods for every index, whereas the entity db is fully generic.