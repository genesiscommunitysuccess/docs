---
sidebar_position: 3
title: Indices
sidebar_label: Indices
id: indices

---

Indices are key components of any database. In your application, every table should at least have one index, the primary key. Indices are key [when reading data](../../operations/read). 

- Unique indices are required for `get` operations
- A unique or non-unique index is required for `getRange` operations
- In `getBulk` operations, the index determines the order in which records are returned.

## Types of index

The main distinction in index types is between unique and non-unique indices. 

- For a unique index, the database guarantees uniqueness; there will be at most one combination entry in a table. So, we can uniquely identify records by the unique indices. Every table will have a primary key, which is mandatory for a table definition. 
- For non-unique indices, the database does not guarantee uniqueness. Consequently, there is slightly less overhead for a non-unique index. 

