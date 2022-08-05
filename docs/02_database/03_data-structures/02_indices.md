---
title: 'Indices'
sidebar_label: 'Indices'
id: indices
---





Indices are key components of any database. In the Genesis low-code platform in particular they are mandatory when you define a  table. Every table should have at least one index, the primary key. This is vital for controlling how data is [read](/database/database-concepts/read/) by an application.

- Unique indices are required for `get` operations
- an index is required for `getRange` operations
- in `getBulk` operations, the index determines the order in which records are returned.

## Types of index

The main distinction in index types is between unique and non-unique indices.

- For a unique index, the database guarantees uniqueness; there will be at most one combination entry in a table. So, we can uniquely identify records by the unique indices. Every table will have a primary key, which is mandatory for a table definition.
- For non-unique indices, the database does not guarantee uniqueness. Consequently, there is slightly less overhead for a non-unique index.

