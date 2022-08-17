---
title: 'Index entities'
sidebar_label: 'Index entities'
id: index-entities
---

[Introduction](/database/data-types/data-types/) |
[Table entities](/database/data-types/table-entities/) | [Index entities](/database/data-types/index-entities/) | 
[Views entities](/database/data-types/views-entities/) | 
[DbRecord](/database/data-types/dbrecord/) | 
[DbEntity](/database/data-types/dbentity/) 

Index entities are nested in [table](/database/data-types/table-entities/) and [view entities](/database/data-types/views-entities/). The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional.

A unique index entity will only be created when all fields of a unique index are supplied. In all other cases, a non-unique index entity will be created.

Types[​](/database/data-types/index-entities/#typesdirect-link-to-heading)
---------------------------------------------------------------------------------------------------------------------------------------

There are two types of index entity:

1.  unique index entity
2.  non-unique index entity

|  | Unique | Non-Unique |
| --- | --- | --- |
| Can be used in a `get` | ✔️ | ❌ |
| Can be used in a `getBulk` | ✔️ | ✔️ |
| Can be used in a `getRange(index)` | ❌ | ✔️ |
| Can be used in a `getRange(from, to)` | ✔️ | ✔️ |

Usage[​](/database/data-types/index-entities/#usagedirect-link-to-heading)
---------------------------------------------------------------------------------------------------------------------------------------

-   Kotlin
-   Java

```
// TRADE_BY_ID is a unique index; a unique index entity is createdval byId = Trade.byId("TR_123")// TRADE_BY_DATE is a non-unique index; a non-unique index entity is createdval byDate = Trade.byDate(now())// TRADE_BY_TYPE_ID is a unique index; a unique index entity is createdval byTypeId = Trade.byTypeId("SWAP", "TR_123")// TRADE_BY_TYPE_ID is a unique index, not all fields are provided;// a non-unique index entity is createdval byType = Trade.byTypeId("SWAP")
```

Index entities can also be created directly from a table or views entity:

-   Kotlin
-   Java

```
// TRADE_BY_ID is a unique index; a unique index entity is createdval byId = trade.byId()// TRADE_BY_DATE is a non-unique index; a non-unique index entity is createdval byDate = trade.byDate()// TRADE_BY_TYPE_ID is a unique index; a unique index entity is createdval byTypeId = trade.byTypeId()
```

[
