---
title: 'Data Structures - Tables'
sidebar_label: 'Tables'
id: tables
keywords: [database, data structures, tables]
tags:
    - database
    - data structures
    - tables
---

A [table](/database/fields-tables-views/tables/) is a data structure that organises data into rows and columns.
However, in Genesis, a table is quite different.

## Genesis tables


A Genesis table is an _abstraction_ of a table from a physical database. It is made up of [fields](/database/fields-tables-views/fields/), [indices](/database/data-structures/indices/) and [subtables](/database/fields-tables-views/tables/tables-advanced/#subtables)

This is great, because it means that changes to the database don't change the Genesis table.

So, that means that you could change the database technology without having to change the table definition. A good way of thinking of this is that _the table is on a different layer_ compared to the database.

Tables are defined in the `-tables-dictionary.kts` files as discussed in our [data model documentation](/database/fields-tables-views/tables/tables-basics). Table
records can be represented as a [table entity](/database/data-types/table-entities/), or as a [DbRecord](/database/data-types/dbrecord/).
They support read, write and subscribe operations.


### Requirements

For a table to be valid in Genesis, it must include the following:
- unique table name
- unique ID
- At least one field to be the primary key


