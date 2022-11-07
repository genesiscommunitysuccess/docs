---
title: 'Database Technology - Overview'
sidebar_label: 'Overview'
id: overview
keywords: [database, technology, overview]
tags:
    - database
    - technology
    - overview
---

Your Genesis application data model can be configured without any concern about the database technology used to store the model and the data.

Genesis supports the following database technologies for the data storage:

| Database | [FoundationDb](/database/database-technology/foundationdb/) | [Postgresql](/database/database-technology/sql/#postgresql) | [Aerospike](/database/database-technology/aerospike/) | [MSSQL](/database/database-technology/sql/#ms-sql) | [Oracle](/database/database-technology/sql/#oracle) |
| --- | --- | --- | --- |---------------------------------------------------|-----------------------------------------------------|
| Technology | NOSQL | SQL | NOSQL | SQL                                               | SQL                                                 |
| Supports transactions | ✔️ | ✔️ | ❌ | ✔️                                                | ✔️                                                  |
| Returns sorted data | ✔️ | ✔️ | ❌ | ✔️                                                | ✔️                                                  |
| Unlimited operation size | ❌ | ✔️ | ✔️ | ✔️                                                | ✔️                                                  |

