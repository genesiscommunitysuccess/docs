#### `permissioning`

The `permissioning` block is used to implement [access control](/develop/server-capabilities/access-control/) measures on the sata being returned to a user.

:::tip
With the exception of the inner `auth` block which relies on inbound data, the `permissioning` block and it's contents can also be placed in the outer block and apply to all `query`/`requestServer`/`eventHandler` blocks named in the file.
:::

##### `permissionCodes`

`permissionCodes` takes a list of permission codes. The client user accessing the query must have access to **at least one** of the permission codes in the list to be able to access any query data.

```kotlin
    permissioning {
      permissionCodes = listOf("TradeView", "TradeUpdate")
    }
```

##### `customPermissions`

The `customPermissions` block takes boolean logic. If this function returns true, the user will be able to access the resource; otherwise, the request will be rejected.  
It is useful, for example, in the case you have an external API to check against. In this example an `entitlementUtils` object wraps an external API we can call to check the user's name has access.

```kotlin
  customPermissions { message ->
    entitlementUtils.userIsEntitled(message.userName)
  }
```

The `customPermissions` block also has access to `entityDb` so that you can query any data in the database. You can add complex logic in here as needed, and have access to the full inbound message.

```kotlin
  customPermissions { message ->
    val userAttributes = entityDb.get(UserAttributes.byUserName(message.userName))
    userAttributes?.accessType == AccessType.ALL
  }
```

Where utilizing `customPermissions` you should also consider configuring a [`customLoginAck`](/develop/server-capabilities/access-control/authentication/#customloginack) so that the front end of the application can also permission it's components in a similar way.


##### `auth`

`auth` is used to restrict rows (queries) or events with a particular entity based on a user's entity access, also known as row-level permissions.

```kotlin
permissioning {
  auth(mapName = "ENTITY_VISIBILITY") {
    authKey {
      key(data.counterpartyId)
    }
  }
```

Details on [restricting query entity access here](/develop/server-capabilities/access-control/authorization/#entity-access)

Auth definitions can be grouped with “and” or “or” operators.
- You could have two simple permission maps, for example: one by counterparty and another one for forbidden symbols. If the user wants to see a specific row, they need to have both permissions at once.
- You could have two permission maps: one for buyer and one for seller. A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

This example shows an AND grouping:

```kotlin
permissioning {
  auth(mapName = "ENTITY_VISIBILITY") {
    authKey {
      key(data.counterpartyId)
    }
  } and auth(mapName = "SYMBOL_RESTRICTED") {
    authKey {
      key(data.symbol)
    }
  }
}
```

This example shows OR grouping:

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        authKey {
            key(data.buyerId)
        }
    } or auth(mapName = "ENTITY_VISIBILITY") {
        authKey {
            key(data.sellerId)
        }
    }
}
```

##### `userHasRight`

`userHasRight` is a helpful function which can be called within the auth block, or anywhere else in client facing server components which have a user accessing them, to determine if a user has a given right.

```kotlin
if (!userHasRight(userName, "TradeViewFull")) { ... }
```

