---
title: 'Tables'
sidebar_label: 'Tables'
id: tables
---

[Introduction](/database/data-structures/data-structures/)  | [Tables](/database/data-structures/tables/) |  [Indices](/database/data-structures/indices/) | [Views](/database/data-structures/views/) 


A [table](/database/fields-tables-views/tables/) is a data structure that organises data into rows and columns.
However, in Genesis, a table is quite different.

## Genesis Tables


A Genesis table is an abstraction of a table from a physical database. It is made up of [fields](/database/fields-tables-views/fields/), [indices](/database/data-structures/indices/) and [subtables](/database/fields-tables-views/tables/tables-advanced/#subtables)

This is great because any changes to the database doesn't change the Genesis table.
This means that we could change the database technology without having to change the table definition. A good way of thinking of it is that
the table is on a different layer compared to the database.

Tables are defined in the `-tables-dictionary.kts` files as discussed [here](/database/fields-tables-views/tables/tables-basics). Table
records can be represented as a [table entity](/database/data-types/table-entities/), or as a [DbRecord](/database/data-types/dbrecord/). 
They support read, wrote and subscribe operations.


### Requirements

For a table to be valid in Genesis, it must include the following:
- unique table name
- unique ID
- At least one field to be the primary key


