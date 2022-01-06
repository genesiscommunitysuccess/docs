---
sidebar_position: 30
title: Write Operations
sidebar_label: Write
id: write

---

Genesis supports the following database operations: 
1. `insert`
2. `modify`
3. `upsert`
4. `delete`
5. `recover`

All of these operations also have a `...All` version, e.g. `insertAll` that accepts multiple records.

## Index Clash

For the purpose of this document, an index clash means that the record to be written has the same fields on a 
unique index as an existing record. 

## Inserting

This operation will write a new record to the database. As part of the insert, any generated fields, e.g. sequence or 
auto-increment fields will be populated. This operation will fail if a record with the same unique indices already 
exists. 

The following insert operations are supported:
1. `insert` 
2. `insertAll`

## Modifying

This operation will modify an existing record. By default, the record will be looked up by the primary key, but 
developers can provide another key. The operation will fail if the record does not exist, or if the change will result
in a key clash.

The following insert operations are supported:
1. `modify`
2. `modifyAll`

## Upsert

The upsert operation will modify an existing record, or insert it if it doesn't exist. It will fail if the operation
would result in a index clash.

The following insert operations are supported:
1. `upsert`
2. `upsertAll`

## Deleting

The delete operation will remove a record from the database. The operation will fail if the record is not found. 

The following insert operations are supported:
1. `delete`
2. `deleteAll`

## Recover