---
title: 'Indices'
sidebar_label: 'Indices'
id: indices
---

[Introduction](/database/data-structures/data-structures/)  | [Tables](/database/data-structures/tables/) |  [Indices](/database/data-structures/indices/) | [Views](/database/data-structures/views/) 

Indices are key components of any database. In the Genesis low-code platform in particular they are mandatory when you define a  table. Every table should have at least one index, the primary key. This is vital for controlling how data is [read](/database/database-concepts/read/) by an application.

- Unique indices are required for `get` operations
- an index is required for `getRange` operations
- in `getBulk` operations, the index determines the order in which records are returned.

## Types of index
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

