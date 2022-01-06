---
sidebar_position: 0
title: Entity Types
sidebar_label: Overview
id: overview

---

The genesis database has different ways of representing data. Depending on the [API](../../apis/overview):

| [Data Structure](../../data-structure/overview) | [Entity Db](../../apis/entity-db) <br/> [Generated Repos](../../apis/generated) | [RxDb](../../apis/rxdb) |
|-------------------------------------------------|---------------------------------------------------------------------------------|-------------------------|
| [Table](../../data-structure/tables)            | [Table Entity](../tables)                                                       | [DbRecord](../dbrecord) |
| [View](../../data-structure/views)              | [View Entity](../views)                                                         | [DbRecord](../dbrecord) |
| [Index Entry](../../data-structure/indices)     | [Index Entity](../indices)                                                      | [DbRecord](../dbrecord) |
| [Index Name](../../data-structure/indices)      | [Index Entity](../indices)                                                      | `String`                |


## Type Safe Entity Types

The table and view entities are the preferred way of accessing the database. The main benefits are: type-safety and 
compile time validation. 

## DbRecord

`DbRecord` is the most generic way to deal with the database, as any table can be represented in a single class. 
However, this is also its biggest drawback, due to the generic nature there is no compile-time validation, which means 
accessing or setting data incorrectly would lead to runtime failures rather than compile time failures.  
