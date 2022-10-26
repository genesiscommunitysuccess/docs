---
title: 'Indices'
sidebar_label: 'Indices'
id: indices
---



Indices are key components of any database. In the Genesis low-code platform, they are mandatory when you define a  table. Every table should have at least one index, the primary key. This is vital for controlling how data is [read](/database/database-concepts/read/) by an application.

- Unique indices are required for `get` operations
- an index is required for `getRange` operations
- in `getBulk` operations, the index determines the order in which records are returned.

## Types of index
These fall into three categories:

- unique index
- non-unique index
- partial index

|                                       | Unique | Non-Unique | Partial |
|---------------------------------------|--------|------------|---------|
| Can be used in a `get`                | true   | false      | false   |
| Can be used in a `getBulk`            | true   | true       | true    |
| Can be used in a `getRange(index)`    | false  | true       | true    |
| Can be used in a `getRange(from, to)` | true   | true       | true    |

### Unique index

Unique indices, including primary keys, can **not** have two records with the same value. An example would be an index on the
TRADE_ID field in the TRADE table. This guarantees that every TRADE_ID in the database is unique, and allows the TRADE table to be queried by TRADE_ID.

### Non-unique index

Non-unique are useful when data needs to be queried, but where uniqueness is not important or not an option. For example, the
TRADE table could have a non-unique index on the ORDER_ID field. This index would allow the TRADE table to be queried
by ORDER_ID.

### Partial indices

Look-ups can also be done on a partial index. A partial index can be used on indices that have more than one field. In
these cases, a look-up can be done only on some of the fields in the index. The partial index behaves as a
non-unique index, even if the index itself is unique.

Fields should always be provided in order. For example, if an index has three fields, then the valid partial indices would
be on field 1 and on field 1 and 2. There is no valid partial index on field 1 and 3.

For example, the TRADE table has an index on EXCHANGE_ID and SYMBOL. Sometimes, we might want to query on both
fields, but on other times, on EXCHANGE_ID only.

