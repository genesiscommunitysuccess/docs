---
title: 'Write'
sidebar_label: 'Write'
id: write
---

Write Operations
================

Genesis supports the following database operations:

1.  `insert`
2.  `modify`
3.  `upsert`
4.  `delete`
5.  `recover`

All of these operations also have an `...All` version, e.g. `insertAll` that accepts multiple records.

Index clash[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#index-clash "Direct link to heading")
---------------------------------------------------------------------------------------------------------------------------------------------------

For the purpose of this document, an index clash means that the record to be written has the same fields on a unique index as an existing record.

Inserting[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#inserting "Direct link to heading")
-----------------------------------------------------------------------------------------------------------------------------------------------

This operation writes a new record to the database. As part of the insert, any generated fields, such as sequence or auto-increment fields, will be populated. This operation will fail if a record with the same unique indices already exists.

The following insert operations are supported:

-   `insert`
-   `insertAll`

Modifying[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#modifying "Direct link to heading")
-----------------------------------------------------------------------------------------------------------------------------------------------

This operation modifies an existing record. By default, the record will be looked up by the primary key, but developers can provide another key. The operation will fail if the record does not exist, or if the change will result in a key clash.

The following insert operations are supported:

-   `modify`
-   `modifyAll`

Upsert[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#upsert "Direct link to heading")
-----------------------------------------------------------------------------------------------------------------------------------------

The upsert operation modifies an existing record, or inserts it if it doesn't exist. It will fail if the operation would result in a index clash.

The following insert operations are supported:

-   `upsert`
-   `upsertAll`

Deleting[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#deleting "Direct link to heading")
---------------------------------------------------------------------------------------------------------------------------------------------

The delete operation removes a record from the database. The operation will fail if the record is not found.

The following insert operations are supported:

-   `delete`
-   `deleteAll`

Recover[​](https://docs.genesis.global/secure/reference/developer/api/database/concepts/operations/write/#recover "Direct link to heading")
-------------------------------------------------------------------------------------------------------------------------------------------

We shall provide details here as soon as we can. Thank you for your patience.