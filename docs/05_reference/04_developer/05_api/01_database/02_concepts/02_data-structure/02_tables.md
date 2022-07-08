---
sidebar_position: 2
title: Tables
sidebar_label: Tables
id: tables

---

Tables are defined in the `-tables-dictionary.kts` files as discussed [here](/creating-applications/defining-your-application/data-model/tables/tables-define/). Table 
records can be represented as a [table entity](../../../how-to/data-types/tables/), or as a [`DbRecord`](../../../how-to/data-types/dbrecord)

## Fields 

Fields will be nullable unless:
1. They are part of a unique index
2. They are overwritten as not null
3. They have a default value
4. They are generated (`sequence`/`autoIncrement`)

When writing a record to the database, non-nullable fields should be provided, unless they fall under points 3 or 4. 

## Indices

In genesis a table should always have a primary key; additional indices are optional. In genesis indices have two 
purposes: 

1. for unique indices only, guarantee uniqueness of the index
2. provide a way to query data

### Index Types 
These fall into three categories:

1. unique index 
2. non-unique index
3. partial index

|                                       | Unique | Non-Unique | Partial |
|---------------------------------------|--------|------------|---------|
| Can be used in a `get`                | true   | false      | false   |
| Can be used in a `getBulk`            | true   | true       | true    |
| Can be used in a `getRange(index)`    | false  | true       | true    |
| Can be used in a `getRange(from, to)` | true   | true       | true    |

### Unique index 

Unique indices, including primary keys, can have no two records with the same value. An example would be an index on the 
TRADE_ID field in the TRADE table. This will guarantee that every TRADE_ID in the database is unique, and allow the
TRADE table to be queried by TRADE_ID. 

### Non-Unique index

Non-Unique are useful when data needs to be queried, but uniqueness is not important or not an option. For example the 
TRADE table could have a non-unique index on the ORDER_ID field. This index would allow the TRADE table to be queried 
by ORDER_ID.

### Partial indices

Lookups can also be done on a partial index. A partial index can be used on indices that have more than one field. In 
those cases, a lookup can be done on only some fields in the index. In that case the partial index behaves as a 
non-unique index, even if the index is unique.

Fields should always be provided in order. For example, if an index has 3 fields, then the valid partial indices would 
be on field 1 and on field 1 and 2. There is no valid partial index on field 1 and 3. 

For example the TRADE table might have an index on EXCHANGE_ID and SYMBOL. We might want to some times query on both 
fields, but sometimes on EXCHANGE_ID only.
