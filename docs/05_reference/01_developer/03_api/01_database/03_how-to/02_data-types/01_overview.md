---
sidebar_position: 1
title: Entity Types
sidebar_label: Overview
id: overview

---

The genesis database has different ways of representing data. Depending on the [interface](../../interface/overview):

| [Data Structure](../../../concepts/data-structure/overview) | [Entity Db](../../interface/entity-db) <br/> [Generated Repos](../../interface/generated) | [RxDb](../../interface/rxdb) |
|-------------------------------------------------------------|-------------------------------------------------------------------------------------------|------------------------------|
| [Table](../../../concepts/data-structure/tables)            | [Table Entity](../tables)                                                                 | [DbRecord](../dbrecord)      |
| [View](../../../concepts/data-structure/views)              | [View Entity](../views)                                                                   | [DbRecord](../dbrecord)      |
| [Index Entry](../../../concepts/data-structure/indices)     | [Index Entity](../indices)                                                                | [DbRecord](../dbrecord)      |
| [Index Name](../../../concepts/data-structure/indices)      | [Index Entity](../indices)                                                                | `String`                     |


## Type Safe Entity Types

The table and view entities are the preferred way of accessing the database. The main benefits are: type-safety and 
compile time validation. 

## DbRecord

`DbRecord` is the most generic way to deal with the database, as any table can be represented in a single class. 
However, this is also its biggest drawback, due to the generic nature there is no compile-time validation, which means 
accessing or setting data incorrectly would lead to runtime failures rather than compile time failures.  
