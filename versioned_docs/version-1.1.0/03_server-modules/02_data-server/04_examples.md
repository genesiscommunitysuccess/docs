---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server-modules/data-server/introduction) | [Basics](/server-modules/data-server/basics) |  [Advanced](/server-modules/data-server/advanced) | [More examples](/server-modules/data-server/examples) | [Configuring runtime](/server-modules/data-server/configuring-runtime) | [Testing](/server-modules/data-server/testing)

## Enriching query

Enriching data using the calling users context is a great way to build rich experiences. Below, we have the positions table and the favourite trades table. We are able to derive a field on our query by bringing the user's favourite trades into the context.

Note the casing of `FAVOURITE_TRADE` and `FavouriteTrade`. The all-caps version denotes the table definition, whereas the camel-case version denotes the generated data access object (DAO).

```kotlin
query(POSITION) {
    enrich(FAVOURITE_TRADE) {
        join { userName, row -> FavouriteTrade.byUserName(userName) }
        fields {
            derivedField("IS_FAVOURITE", BOOLEAN) { row, favourite ->
                row.code == favourite?.code
            }
        }
    }
}
```

To be able to use the `byUserName` function over the FavouriteTrade DAO, you must add an index over the USER_NAME (a platform-level field).

```kotlin
table(name = "POSITION", id = 1600) {
    sequence(POSITION_ID, "PS")
    CODE
    CREATED_AT
    PRICE

    primaryKey {
        POSITION_ID
    }
}
table(name = "FAVOURITE_TRADE", id = 1601) {
    sequence(FAVOURITE_ID, "FA")
    CODE
    USER_NAME

    primaryKey {
        FAVOURITE_ID
    }
    indices {
        unique {
            USER_NAME
        }
    }
}
```
