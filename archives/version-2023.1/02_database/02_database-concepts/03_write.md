---
title: 'Database concepts - Write'
sidebar_label: 'Write'
id: write
keywords: [database, concepts, write]
tags:
    - database
    - concepts
    - write
---


The following database operations are available:

- `insert` and `insertAll`
- `modify` and `modifyAll`
- `upsert` and `upsertAll`
- `delete` and `deleteAll`
- `recover` and `recoverAll`

:::note
**Index clash**

Where we refer to an index clash below, we mean that the record to be written has the same fields on a unique index as an existing record.
:::

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

The `delete` operation removes a record from the database. The operation will fail if the record is not found.

The following insert operations are supported:

-   `delete`
-   `deleteAll`

## Recover

The `recover` operation enables you to insert a document into the database using the record's preset timestamp and ID.

The following recover operations are supported:

- `recover`
- `recoverAll`

:::danger

This API must be used with caution. Integrity checks are skipped, so it can leave your Genesis application in a poor state if used incorrectly. Record IDs and timestamps are assumed to be unique.

:::
