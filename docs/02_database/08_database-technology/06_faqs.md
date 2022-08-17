---
title: 'FAQs'
sidebar_label: 'FAQs'
id: faqs
---

[Introduction](/database/database-technology/overview/) |
[FoundationDb](/database/database-technology/foundationdb/) | [SQL](/database/database-technology/sql/) | [Aerospike](/database/database-technology/aerospike/) |  [PostgreSQL](/database/database-technology/postgresql/) | [FAQs](/database/database-technology/faqs/) 

## Frequently asked questions


### My write operations are not hitting the database[​](database/database-technology/faqs/#my-write-operations-are-not-hitting-the-databasedirect-link-to-heading)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

When using the [RxJava](/database/types-of-api/rxjava/) api, it is paramount that you end the call chain with a `subscribe...` call. The underlying database operation will not commence until it is subscribed to.