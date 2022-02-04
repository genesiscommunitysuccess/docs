---
sidebar_position: 10
title: Read Operations
sidebar_label: Read
id: read

---

Genesis supports a number of different read operations. Although the specifics vary between the different 
[APIs](docs/platform-reference/database/how-to/apis/overview), the underlying principles remain the same. This document will explain these,
without going into specific calls. 

## Fields

When reading records, optionally the developer can specify a list of fields to be returned. This can be useful when
reading tables with a large number of columns.

## Reading a Single Record

There are three operations to request individual records from the database: 

1. `get`
2. `getAll`
3. `getAllAsList`

### get

To request a single record from the database, a unique index must be specified. If a matching record is found then 
it is returned, else the operation will return no results.

### getAll

`getAll` bundles multiple `get` operations into a single request. Each request should have a unique index identifier 
and a unique reference for the request. The result will be a map, where the unique reference is the key, and the 
value is the record, or `null` if not found.

### getAllAsList

This operation is similar to `getAll`, however, this only requires a unique index identifier. The results are returned 
as a list, in the same order they are requested in. When a record is not found a null value will be in its place in the 
list.

## Reading a whole table

There are two operations to request a whole table from the database:

1. `getBulk`
2. `getBulkFromEnd`

These operations will read a whole table from the database. The records will be returned in sorted order if the 
database supports it. By default, the records are ordered by the primary key, unless the developer provides another 
index. 

## Reading a table range

The database can return ranges that can be describes as:

1. a range described by a non-unique index identifier.
2. a range between two index identifiers

For each of these types of ranges, genesis supports the following operations

1. `getRange(index)`
3. `getRangeFromEnd`



As with `getBulk`, these records will be sorted, only if the database supports it.