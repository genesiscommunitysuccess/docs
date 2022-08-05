---
sidebar_position: 3
title: Indices
sidebar_label: Indices
id: indices

---

Indices are key components of any database. In the genesis platform in particular they are a requirement in table 
definition. Every table should at least have one index, the primary key. Further, they are key 
[when reading data](../../operations/read). Unique indices are required for `get` operations, an index is required
for `getRange` operations, and in `getBulk` operations, the index determines the order in which records are returned.

## Types of indices

The main distinction in index types is between unique and non-unique indices. 

- For a unique index, the database guarantees uniqueness; there will be at most one combination entry in a table. So, we can uniquely identify records by the unique indices. Every table will have a primary key, which is mandatory for a table definition. 
- For non-unique indices, the database does not guarantee uniqueness. Consequently, there is slightly less
overhead for a non-unique index. 

## Index versus index entry

Indices can be unique or non-unique. 

Consider a table `TRADE` with indices `TRADE_BY_ID` and `TRADE_BY_DATE`. 

The first index - `TRADE_BY_ID` - is unique;  the second one is non-unique.


The first would be to refer to an index in general. For example: