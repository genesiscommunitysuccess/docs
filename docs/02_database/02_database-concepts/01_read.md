---
title: 'Read'
sidebar_label: 'Read'
id: read
---

[Read](/database/database-concepts/read/) | [Subscribe](/database/database-concepts/subscribe/) | [Write](/database/database-concepts/write/) 

Genesis supports a number of different read operations. Although the specifics vary between the different [interfaces](/database/types-of-api/types-of-api/), the underlying principles remain the same. This page explains these principles, without going into specific calls.

Fields[​](/database/database-concepts/read/#fieldsdirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------

When reading records, you can optionally specify a list of fields to be returned. This is useful when reading tables with a large number of columns.

Reading a single record[​](/database/database-concepts/read/#reading-a-single-recorddirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

There are three operations that request individual records from the database:

-   `get`
-   `getAll`
-   `getAllAsList`

### get[​](/database/database-concepts/read/#getdirect-link-to-heading)

To request a single record from the database, a unique index must be specified. If a matching record is found, then it is returned. Otherwise, the operation will return no results.

### getAll[​](/database/database-concepts/read/#getalldirect-link-to-heading)

`getAll` bundles multiple `get` operations into a single request. Each request must have a unique index identifier and a unique reference for the request. 

The result will be a map, where the unique reference is the key, and the value is the record, or `null` if not found.

### getAllAsList[​](/database/database-concepts/read/#getallaslistdirect-link-to-heading)

The `getAllAsList` operation is similar to `getAll`. However, this only requires one unique index identifier. The results are returned as a list, in the same order they are requested. When a record is not found, a null value will be in its place in the list.

Reading a whole table[​](/database/database-concepts/read/#reading-a-whole-tabledirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

There are two operations that request a whole table from the database:

-   `getBulk`
-   `getBulkFromEnd`

When the whole table is returned, the records will be returned in sorted order (if the database supports it). By default, the records are ordered by the primary key, unless you provide another index.

Reading a table range[​](/database/database-concepts/read/#reading-a-table-rangedirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

The database can return ranges that can be described as:

-   a range described by a non-unique index identifier
-   a range between two index identifiers

For each of these, Genesis supports the following operations

-   `getRange(index)`
-   `getRangeFromEnd`

As with `getBulk`, the records will be sorted, if the database supports it.