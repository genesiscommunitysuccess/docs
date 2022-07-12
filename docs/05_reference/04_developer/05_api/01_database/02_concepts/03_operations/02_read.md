---
sidebar_position: 2
title: Read Operations
sidebar_label: Read
id: read

---

Genesis supports a number of different read operations. Although the specifics vary between the different 
[interfaces](../../../how-to/interface/overview), the underlying principles remain the same. This document will explain these,
without going into specific calls. 

## Fields

When reading records, you can optionally specify a list of fields to be returned. This is useful when
reading tables with a large number of columns.

## Reading a single record

There are three operations that request individual records from the database: 

- `get`
- `getAll`
- `getAllAsList`

### get

To request a single record from the database, a unique index must be specified. If a matching record is found, then 
it is returned. Otherwise, the operation will return no results.

### getAll

`getAll` bundles multiple `get` operations into a single request. Each request should have a unique index identifier 
and a unique reference for the request. The result will be a map, where the unique reference is the key, and the 
value is the record, or `null` if not found.

### getAllAsList

The `getAllAsList` operation is similar to `getAll`. However, this only requires a unique index identifier. The results are returned 
as a list, in the same order they are requested in. When a record is not found, a null value will be in its place in the 
list.

## Reading a whole table

There are two operations that request a whole table from the database:

- `getBulk`
- `getBulkFromEnd`

These operations read a whole table from the database. The records will be returned in sorted order if the 
database supports it. By default, the records are ordered by the primary key, unless the developer provides another 
index. 

## Reading a table range

The database can return ranges that can be described as:

- a range described by a non-unique index identifier.
- a range between two index identifiers

For each of these types of range, Genesis supports the following operations

- `getRange(index)`
- `getRangeFromEnd`



As with `getBulk`, these records will be sorted, if the database supports it.