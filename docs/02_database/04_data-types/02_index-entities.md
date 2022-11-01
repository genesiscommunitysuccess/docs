---
title: 'Data types - Index entities'
sidebar_label: 'Index entities'
id: index-entities
keywords: [database, data types, index entities]
tags:
    - database
    - data types
    - index entities
---



Index entities are nested in [table](/database/data-types/table-entities/) and [view entities](/database/data-types/views-entities/). The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional.

A unique index entity will only be created when all fields of a unique index are supplied. In all other cases, a non-unique index entity will be created.

## Types

There are two types of index entity:

- unique index entity
- non-unique index entity

|  | Unique | Non-unique |
| --- | --- | --- |
| Can be used in a `get` | ✔️ | ❌ |
| Can be used in a `getBulk` | ✔️ | ✔️ |
| Can be used in a `getRange(index)` | ❌ | ✔️ |
| Can be used in a `getRange(from, to)` | ✔️ | ✔️ |

## Usage

```kotlin
// TRADE_BY_ID is a unique index; a unique index entity is created
val byId = Trade.byId("TR_123")
// TRADE_BY_DATE is a non-unique index; a non-unique index entity is created
val byDate = Trade.byDate(now())
// TRADE_BY_TYPE_ID is a unique index; a unique index entity is created
val byTypeId = Trade.byTypeId("SWAP", "TR_123")
// TRADE_BY_TYPE_ID is a unique index, not all fields are provided;
// a non-unique index entity is created
val byType = Trade.byTypeId("SWAP")
```

Index entities can also be created directly from a table or view entity:

```kotlin
// TRADE_BY_ID is a unique index; a unique index entity is created
val byId = trade.byId()
// TRADE_BY_DATE is a non-unique index; a non-unique index entity is created
val byDate = trade.byDate()
// TRADE_BY_TYPE_ID is a unique index; a unique index entity is created
val byTypeId = trade.byTypeId()
```
