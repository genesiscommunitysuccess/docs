---
title: 'Views'
sidebar_label: 'Views'
id: views
---



Views are defined in the `-view-dictionary.kts` files as discussed 
[here](/database/fields-tables-views/views/).

Views are the genesis equivalent of SQL select queries. Unlike [tables](/database/data-types/table-entities/), views do not have any data of 
their own, but present a view based on one or more tables. A view always starts with a single table, the root table.
Other tables can be joined onto the root table to present composite data. 

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

For some views, the joins are defined as input parameters, rather than on a field in another table or a constant. When 
that happens a view is considered to be parameterised. Parameterised views can not be accessed without these parameters.
Parameterised views can be both single and multi cardinality.

## Indices on views

Views do not have their own indices, however, these are derived from the root table. A view will always share the 
primary key of the root table. It will also share any index from which at least the first field is included in the 
view. Subsequent fields are only included in the view's index until the first missing field. Unique indices from the 
root table will only be unique if all fields are included.

## Entities

During code generation, [view](/database/data-types/views-entities/) and [index](/database/data-types/index-entities/) entities will be generated from the definitions in your application's **view-dictionary.kts** file. The name of each entity will be the same as the definition, but it is converted from snake case to camel case; for example, VIEW_NAME becomes ViewName.

The generated entities are kotlin data classes and can be built using the primary constructor. Just before the object is built, it is validated to make sure all required fields have been set.
 