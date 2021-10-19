---
title: Overview
sidebar_label: Overview
sidebar_position: 1
id: overview
---

## Authorisation
Authorisation is the process by which you offer specific permissions to resources for authenticated users. 
The Genesis Server presents three main types of resource entry points for clients to instigate events or query data.

- DataServers  
- EventHandlers  
- ReqReqServer

All these services can be optionally permissioned using a permissioning GPAL syntax block in the GPAL configuration associated with the service. 

**Permissioning block snippet**
```kotlin
// would be enclosed within a resource (eg DataServer Query) specific block
permissioning {
    
    // 'permission Code' list, users must have the permission to access the enclosing resource
    permissionCodes = listOf("TRADER", "SUPPORT")
    
    // Permission at the row and/or column level for a grid or table of data
    auth("TRADE_VISIBILITY") {
        TRADE_VIEW.TRADE_ID
    }
}
```

For every request that comes into a Genesis server it will include the username of an authenticated user. 
Non-authenticated users will not have access or visibility to the genesis services.

There are two main optional sub-blocks to the Permissioning block.

1. **PermissionCodes list**
```kotlin
permissionCodes = listOf("TRADER", "SUPPORT")
```

  Where this is defined the user will need to have one of the listed permission codes to access the GPAL enclosed resource. 
  If the user does not belong to one of the listed permission code, the subsequent auth block will essentially be ignored.

  To enable a User to have access to a specific PermissionCode

  - the permission code needs to be defined in the RIGHT table,
  - linked to an entry in the PROFILE_RIGHT table,
  - and to a PROFILE that is associated with the USER from PROFILE_USER
  - The Auth Manager process will populate the RIGHT_SUMMARY table based upon the table configuration. This table ultimately drives  tha available permission codes for all users in the system. 
  
  These tables are part of the Genesis Auth Module.

:::note

  Synonyms: PermissionCodes, Permission, Right, Rights, RightCodes, RightSummary

  Synonyms: Profile, Role, Group
:::
2. **Auth sub-block**
 
```kotlin
        auth(mapName = "ENTITY_VISIBILITY") {
            POSITION.COUNTERPARTY_ID
        }
```

Where this is defined, it allows for further fined grained of what data, at the row is returned to a specific user. 
If it is not defined then all data is returned for the enclosing resource, assuming permissionCodes are not restricting.

- The mapName refers to a specific Permission "entity" defined on the server via the [auth-permission.xml](/platform-reference/authentication-and-authorisation/authorisation#defining-a-permission-rule) file.

  **eg auth-permission.xml entity entry snippet**
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
- The reference ```POSITION.COUNTERPARTY_ID``` in the previous auth snippet refers to the COUNTERPARTY_ID field from the POSITION object that is supplied as a parameter to the resource request. 
This value is used as a key into a specific AuthCache, identified by entity name, in this example "ENTITY_VISIBILITY"

- Each AuthCache will map Entity Id (in our example COUNTERPARTY_ID from the POSITION objet)  to Set of users.

## Generic Permissions

'Generic Permissions' is a term used to name the optional permissions' configuration that is available for a Genesis application 
that is included as part of the Genesis Auth Module.

To fully activate 'Generic Permissions' you need to provide these values in your system definition before you run genesisInstall.
These values specify which table column will be used to associate users to entities for fine-grained row permissions.


```kotlin
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```

:::note detail
This will add the specified field to the USER_ATTRIBUTES table as a required field and create a new table called, in the case of our example, USER_COUNTERPARTY_MAP,
that will be suitably populated by the AUTH_MANAGER process on a realtime basis. 

The USER_COUNTERPARTY_MAP table is referenced in ENTITY_VISIBILITY entity in ```auth-permission.templt.xml``` file. (which is a genesis [mustache](https://en.wikipedia.org/wiki/Mustache_(template_system))
template which is processed at genesisInstall time, using entries from system-definition).

When new users are created in the Genesis Gui Admin screens, a required field COUNTERPARTY will be presented to the operating user. This limits users to belonging to a single counterparty.
:::

You can define additional -permissions.xml files. For example, you could define something like oems-permissions.xml with 
an order management system auth implementation, and it will be read by AUTH_PERMS process on startup.

There are two kinds of permission entities defined by Generic Permissions in ```auth-permission.templt.xml``` file.

- **USER_VISIBILITY** - An AuthCache which determines which user is visible to which user, this is driven by which users associated for the entity. Using our example, if two users are both in the same counterparty then they should be viewable to each other.

- **ENTITY_VISIBILITY** - An AuthCache which determine if a user has access to particular entity, in our example, if the user permissioned for a particular counterparty, then it will be able to see the associated row data for that counterparty.



:::note
Synonym: Dynamic Permission, Permission Entity, Entity, AuthMap, AuthCache
:::