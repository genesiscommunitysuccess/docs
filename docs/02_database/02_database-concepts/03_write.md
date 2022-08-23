---
title: 'Write'
sidebar_label: 'Write'
id: write
---

[Read](/database/database-concepts/read/) | [Subscribe](/database/database-concepts/subscribe/) | [Write](/database/database-concepts/write/) 

Genesis supports the following database operations:

- `insert`
- `modify`
- `upsert`
- `delete`
- `recover`

All these operations also have an `...All` version (e.g. `insertAll` that accepts multiple records).

## Index clash

Where we refer to an index clash below, we mean that the record to be written has the same fields on a unique index as an existing record.

## Inserting

This operation writes a new record to the database. As part of the insert, any generated fields, such as sequence or auto-increment fields, will be populated. 

This operation will fail if a record with the same unique indices already exists.

The following insert operations are supported:

-   `insert`
-   `insertAll`

## Modifying

This operation modifies an existing record. By default, the record will be looked up by the primary key, but you can provide another key. 

The operation will fail if the record does not exist, or if the change results in a key clash.

The following insert operations are supported:

-   `modify`
-   `modifyAll`

## Upsert

The upsert operation modifies an existing record. If the record does not exist, the data provided is inserted as a new record. 

The operation will fail if it results in an index clash.

The following insert operations are supported:

-   `upsert`
-   `upsertAll`

## Deleting

The delete operation removes a record from the database. The operation will fail if the record is not found.

The following insert operations are supported:

-   `delete`
-   `deleteAll`

## Recover

We shall provide details here as soon as we can. Thank you for your patience.