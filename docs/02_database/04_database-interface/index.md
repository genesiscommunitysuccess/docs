---
title: 'Database interface'
sidebar_label: 'Database interface'
id: database-interface
---

Genesis supports different ways of interacting with the database. Regardless of the interface used, the [operations](/database/database-concepts/) remain the same. The preferred way of accessing the database is via the [EntityDb](/database/database-interface/entity-db/).

|  | [EntityDb](/database/database-interface/entity-db/) | [Generated Repositories](https://internal-web/secure/reference/developer/api/database/how-to/interface/generated/) | [RxDb](https://internal-web/secure/reference/developer/api/database/how-to/interface/rxdb/) |
| --- | --- | --- | --- |
| [Supports tables](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/tables/) | ✔️ | ✔️ | ❌ |
| [Supports views](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/views/) | ✔️ | ✔️ | ❌ |
| Supports any data type | ✔️ | ❌ | ✔️ |
| Class to import | `AsyncEntityDb`\
`RxEntityDb` | `[TableName]AsyncRepository`\
`[TableName]Rx3Repository` | `RxDb` |
| Type safe read and write | ✔️ | ✔️ | ❌ |
| Type safe write result | ✔️ | ❌ | ❌ |
| Returns data as | [table](https://internal-web/secure/reference/developer/api/database/how-to/data-types/tables/) or [view](https://internal-web/secure/reference/developer/api/database/how-to/data-types/views/) entities | [table](https://internal-web/secure/reference/developer/api/database/how-to/data-types/tables/) or [view](https://internal-web/secure/reference/developer/api/database/how-to/data-types/views/) entities | [DbRecord](https://internal-web/secure/reference/developer/api/database/how-to/data-types/dbrecord/) |
| Writes data as | [table](https://internal-web/secure/reference/developer/api/database/how-to/data-types/tables/) or [view](https://internal-web/secure/reference/developer/api/database/how-to/data-types/views/) entities | [table](https://internal-web/secure/reference/developer/api/database/how-to/data-types/tables/) or [view](https://internal-web/secure/reference/developer/api/database/how-to/data-types/views/) entities | [DbRecord](https://internal-web/secure/reference/developer/api/database/how-to/data-types/dbrecord/) |
| References indexes as | [index entities](https://internal-web/secure/reference/developer/api/database/how-to/data-types/indices/) | Generated methods | [DbRecord](https://internal-web/secure/reference/developer/api/database/how-to/data-types/dbrecord/) and `String` |
| Programming interface | [Async](https://internal-web/secure/reference/developer/api/database/reference/apis/async/) or [RxJava](https://internal-web/secure/reference/developer/api/database/reference/apis/rxjava/) | [Async](https://internal-web/secure/reference/developer/api/database/reference/apis/async/) or [RxJava](https://internal-web/secure/reference/developer/api/database/reference/apis/rxjava/) | [RxJava](https://internal-web/secure/reference/developer/api/database/reference/apis/rxjava/) |
| Write (input) | [Generic Modify Details](https://internal-web/secure/reference/developer/api/database/how-to/helper/modify/generic/) | Generated | [Legacy Modify Details](https://internal-web/secure/reference/developer/api/database/how-to/helper/modify/legacy/) |
| Write (output) | [Generic Write Result](https://internal-web/secure/reference/developer/api/database/how-to/helper/write-result/generic/) | [Legacy Write Result](https://internal-web/secure/reference/developer/api/database/how-to/helper/write-result/legacy/) | [Legacy Write result](https://internal-web/secure/reference/developer/api/database/how-to/helper/write-result/legacy/) |
| Subscribe | [Record Update](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/record-update/) of entity | [Record Update](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/record-update/) of entity | [Record Update](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/record-update/) of `DbRecord` |
| Bulk or Range Subscribe | [Bulk](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/bulk/) of entity | [Bulk](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/bulk/) of entity | [Bulk](https://internal-web/secure/reference/developer/api/database/how-to/helper/subscription/bulk/) of `DbRecord` |

| Available in [event handlers](https://internal-web/secure/creating-applications/defining-your-application/business-logic/event-handlers/) | ✔️ | ❌ | ❌ | | Available in [custom request servers](https://internal-web/secure/creating-applications/defining-your-application/user-interface/request-servers/rs-advanced-technical-details/#custom-request-servers) | ✔️ | ❌ | ❌ |