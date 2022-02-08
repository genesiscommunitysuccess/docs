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

## Types of Indices

The main distinction in index types is between unique and non-unique indices. The difference is that the database 
guarantees that for every unique index, there will be at most one combination entry in a table, so that we can 
uniquely identify records by the unique indices. Every table will a primary key, which is a requirement for each table
definition. For non-unique indices, the database does not guarantee uniqueness, this means that there is slightly less
overhead for a non-unique index. 

## Index versus index entry

There are two ways of referring to indices. The first would be to refer to an index in general. For example imagine 
a table `TRADE` with indices `TRADE_BY_ID` and `TRADE_BY_DATE`, the first one is unique the second one is non-unique.
