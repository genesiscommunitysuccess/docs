---
title: 'Data Structures - Views'
sidebar_label: 'Views'
id: views
keywords: [database, data structures, views]
tags:
    - database
    - data structures
    - views
---



Views are defined in the `-view-dictionary.kts` files as discussed 
[here](../../../database/fields-tables-views/views/).

In Genesis, a view is one table joined to one or more other tables. The first table is the root table. Other tables can be joined on to the root table to present composite data. 

Views are the Genesis equivalent of SQL select queries. Unlike [tables](../../../database/data-types/table-entities/), views do not have any data of their own, but present a view based on the data in one or more tables. 

## Read-only

Due to their composite nature, views are inherently read-only. You cannot modify a record in a view. The only way
to change the data is to change the underlying table(s). 

## Root table

A view always has a root table, this is the most important table in the view. It is the starting point of the join
operations and the view will derive its indices from the root table.

## Types of view

Depending on the view definition, a different type of view will be created.

## Cardinality

A view's cardinality tells us how many view records will be returned for every record in the root table. 

- If a view can return a maximum of 1 record for each record in the root table, the view has single cardinality. 
- If a view can return multiple records for each record in the root table, the view has multi cardinality. 

The cardinality depends on the joins; a view with no joins, or only one-to-one joins, will be single 
cardinality, all others will be multi cardinality

|                                        | Single Cardinality <br/>  View | Multi Cardinality<br/> View |
|----------------------------------------|--------------------------------|-----------------------------|
| Unique index in root table             | Unique index                   | Non-unique index            |
| Non-unique index in root table         | Non-unique index               | Non-unique index            |
| Supports database read operations      | ✔️                             | ✔️                          |
| Supports database subscribe operations | ✔️                             | ❌                           |
| Supports backwards joins               | ✔️                             | ❌                           |

## Parameterised views

A parameterised view is one where the join is defined as an input parameter - rather than on a field in another table or a constant. 
There are two important characteristics of a parameterised view:
- It can not be accessed without an input parameter.
- It can have either single or multi cardinality.

## Indices on views

This is what you need to know:

- Views do not have their own indices; these are derived from the root table. 
- A view will always share the primary key of the root table.
- A view will share any index from which at least the first field is included in the view. 
- Subsequent fields are only included in the view's index until the first missing field. 
- Unique indices from the root table will only be unique if all fields are included.

## Entities

During code generation, [view](../../../database/data-types/views-entities/) and [index](../../../database/data-types/index-entities/) entities are generated from the definitions in your application's **view-dictionary.kts** file. 

The name of each entity generated is the same as the definition, but it is converted from snake case to camel case; for example, VIEW_NAME becomes ViewName.

The generated entities are Kotlin data classes and can be built using the primary constructor. Just before the object is built, it is validated to make sure all required fields have been set.
 