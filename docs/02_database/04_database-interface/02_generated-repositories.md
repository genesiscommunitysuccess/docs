---
title: 'Generated repositories'
sidebar_label: 'Generated repositories'
id: generated-repositories
---

Generated Repositories
======================

##### NOTE

We are still working on this page

|  | [Generated Repositories](/database/how-to/interface/generated/) |
| --- | --- |
| [Supports tables](/database/concepts/data-structure/tables/) | ✔️ |
| [Supports views](/database/concepts/data-structure/views/) | ✔️ |
| Supports any data type | ❌ |
| Class to import | `[TableName]AsyncRepository`\
`[TableName]Rx3Repository` |
| Type-safe read and write | ✔️ |
| Type-safe write result | ❌ |
| Returns data as | [table](database/how-to/data-types/tables/) or [view](/database/how-to/data-types/views/) entities |
| Writes data as | [table](/database/how-to/data-types/tables/) or [view](database/how-to/data-types/views/) entities |
| References indexes as | Generated methods |
| Programming interface | [Async](/database/reference/apis/async/) or [RxJava](database/reference/apis/rxjava/) |
| Write (input) | Generated |
| Write (output) | [Legacy Write Result](/database/how-to/helper/write-result/legacy/) |
| Subscribe | [Record Update](/database/how-to/helper/subscription/record-update/) of entity |
| Bulk or Range Subscribe | [Bulk](/database/how-to/helper/subscription/bulk/) of entity |

| Available in [event handlers](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/event-handlers/) | ❌ | | Available in [custom request servers](https://docs.genesis.global/secure/creating-applications/defining-your-application/user-interface/request-servers/rs-advanced-technical-details/#custom-request-servers) | ❌ |

During the code generation phase, repository classes are generated for every table and view in the system. These repositories provide a type-safe way of accessing the database.

The main differences between the generated repositories and the [Entity Db](/database/how-to/interface/entity-db/) are:

1.  The entity db can handle any database entity, each repository can only handle a single entity.
2.  The generated repositories have specific methods for every index, whereas the entity db is fully generic.