---
title: 'Index entities'
sidebar_label: 'Index entities'
id: index-entities
---

Index entities
==============

Index entities are nested in [table](https://docs.genesis.global/secure/reference/developer/api/database/how-to/data-types/tables/) and [view entities](https://docs.genesis.global/secure/reference/developer/api/database/how-to/data-types/views/). The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional.

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

Index entities can also be created directly from table or view entity:

-   Kotlin
-   Java

```
// TRADE_BY_ID is a unique index; a unique index entity is createdval byId = trade.byId()// TRADE_BY_DATE is a non-unique index; a non-unique index entity is createdval byDate = trade.byDate()// TRADE_BY_TYPE_ID is a unique index; a unique index entity is createdval byTypeId = trade.byTypeId()
```

[
