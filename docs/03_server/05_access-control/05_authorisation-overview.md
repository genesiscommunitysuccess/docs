---
title: 'Access control - authorisation overview'
sidebar_label: 'Authorisation overview'
id: authorisation-overview
keywords: [server, access control, authorisation, overview]
tags:
  - server
  - access control
  - authorisation
  - overview
---


## Authorisation
Authorisation is the process by which you apply specific permissions to resources. Only users who pass the permission criteria for the resource have access.

The server of a Genesis application provides three main types of resource entry point for clients to instigate events or to query data.

- Data Servers
- Event Handlers
- Request Servers

All these services can be permissioned using a permissioning GPAL syntax block in the GPAL configuration associated with the service.

**Permissioning block snippet**
```kotlin
// this example would be enclosed within a resource (eg DataServer Query) specific block
permissioning {
    
    // 'permission Code' list, users must have the permission to access the enclosing resource
    permissionCodes = listOf("TRADER", "SUPPORT")
    
    // Permission at the row and/or column level for a grid or table of data
    auth("TRADE_VISIBILITY") {
        TRADE_VIEW.TRADE_ID
    }
}
```

### Global and specific permissioning
Here's what you need to know:

- A permissioning block can exist inside a resource (`requestReply`, `query` or `eventHandler`) definition. In this case, it applies only to that resource definition. This is specific permissioning.
- Alternatively, you can specify a permissioning block outside any resource in the file. This is global permissioning. If you do this, the permissioning applies by default to all the resources in the file. **However, any permissioning block inside a specific resource overrides this default**.
- The permissioning block at the global level can only contain `permissionCodes`, as the `auth` block is based on each individual resource definition.
- Every request that comes into a Genesis server will include the username of an authenticated user. Non-authenticated users will not have access to or visibility of the Genesis services.

In the example below, the block applies to a specific `requestReply` within a Request Server:

```kotlin
requestReplies {
    requestReply("MARKET_INSTRUMENTS", INSTRUMENT_DETAILS) {
        permissioning {
            permissionCodes = listOf("TRADER")
        }
    }
}
```

In the example below, the global permissioning applies by default to the first three `requestReply` blocks in the Request Server. However, the fourth `requestReply` block has a specific permissioning block requiring the user to be in the list SUPER.

```kotlin
requestReplies {
    permissioning {
        permissionCodes = listOf("TRADER")
    }
    requestReply("ALLOCATION CODES", ALLOCATION CODES)

    requestReply("ALL_COUNTERPARTIES", ALL_COUNTERPARTIES)

    requestReply("ALL_BROKERS", ALL_BROKERS)

    requestReply("ALL_TRADES", INSTRUMENT_DETAILS) {
        permissioning {
            permissionCodes = listOf("SUPER")
        }
    }
}
```

### Permissioning sub-blocks

There are two main sub-blocks to the permissioning block that can be applied to suit your needs:
- `PermissionCodes` list
- `auth` sub-block

#### PermissionCodes list
Here is a simple example:

```kotlin
permissionCodes = listOf("TRADER", "SUPPORT")
```

Where a `PermissionCodes`list is defined, the user must have one of the listed permission codes to access the GPAL enclosed resource.
If the user does not belong to one of the listed permission codes, the subsequent auth block will essentially be ignored.

To enable a user to have access to a specific `permissionCode`:

- the `permissionCode` must be defined in the `RIGHT` table
- the code must be linked to an entry in the `PROFILE_RIGHT` table
- the code must be linked to a `PROFILE` that is associated with the USER from `PROFILE_USER`

The `AUTH_MANAGER` process will populate the `RIGHT_SUMMARY` table based on the table configurations above. This table ultimately drives the available permission codes for all users in the system.

These tables are part of the Genesis Auth module.

#### Auth sub-block
Here is an example:


```kotlin
        auth(mapName = "ENTITY_VISIBILITY") {
            POSITION.COUNTERPARTY_ID
        }
```

Where an `auth` sub-block is defined, you can provide further fine-grained control of what data, at the row level, is returned to a specific user. If it is not defined, then all data is returned for the enclosing resource, assuming `permissionCodes` are not restricting access.

The reference `POSITION.COUNTERPARTY_ID` in the auth snippet above refers to the COUNTERPARTY_ID field from the POSITION object that is supplied as a parameter to the resource request. This value is used as a key into a specific AuthCache, identified by entity name. In this example, that is "ENTITY_VISIBILITY"

Each AuthCache will map Entity Id (in our example, COUNTERPARTY_ID from the POSITION object) to a Set of users.

The `mapName` parameter refers to a specific permission entity defined on the server via the [auth-permission.xml](/server/access-control/authorisation/#defining-a-permission-rule) file. For example:

```xml
 <dynamicPermissions>
  <!-- other tags removed for brevity -->
   <entity name="ENTITY_VISIBILITY"
              tableName="USER_COUNTERPARTY_MAP"
              maxEntries="20000"
              idField="USER_NAME">
    <!-- further structure with groovy expression to define programmatic control and define an AuthMap -->
    </entity>
  <!-- additional entities would go here-->
</dynamicPermissions>
```

## Generic permissions

Generic permissions is a term used to name the optional permissions configuration that is available for a Genesis application; this is included as part of the Genesis Auth Module.

To fully activate Generic permissions, you need to add the following values to your [system definition file](/server/configuring-runtime/system-definitions/) before you run `genesisInstall`.
These values specify which table column will be used to associate users to entities for fine-grained row permissions.


```kotlin
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```


Note these **important** details:

- These values will add the specified field to the `USER_ATTRIBUTES` table as a required field and create a new table called `USER_COUNTERPARTY_MAP` (in the case of our example), which will be suitably populated by the AUTH_MANAGER process on a real-time basis.

- The `USER_COUNTERPARTY_MAP` table is referenced in the `ENTITY_VISIBILITY` entity in the **auth-permission.templt.xml** file. This file is a Genesis [mustache](https://en.wikipedia.org/wiki/Mustache_(template_system))
  template that is processed when `genesisInstall` is run, using entries from system-definition.

- When new users are created in the Genesis GUI Admin screens, a required field, COUNTERPARTY, is presented to the operating user. This limits users to belonging to a single counterparty.


A user can define additional **permissions.xml** files. For example, you could define something like **order-management-permissions.xml**, with an order management system auth implementation, and it will be read by `AUTH_PERMS` process on startup.

There are two kinds of permission entity defined by Generic Permissions in the **auth-permission.templt.xml** file:

- **USER_VISIBILITY** - an AuthCache that determines which user is visible to which user; this is driven by which users are associated for the entity. Using our example, if two users are both in the same counterparty, then they should be viewable to each other.

- **ENTITY_VISIBILITY** - an AuthCache that determines if a user has access to particular entity; in our example, if the user is permissioned for a particular counterparty, then it will be able to see the associated row data for that counterparty.