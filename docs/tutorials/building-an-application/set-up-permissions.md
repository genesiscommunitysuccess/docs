---
id: permissions
title: Set up user permissions
sidebar_label: Set up user permissions
sidebar_position: 9

---
At this stage, you have a working server with a Ref_data_app and a Trading_app. The Trading_app has a consolidator to calculate the positions, event handlers to control changes to the database and data server and request servers to publish the data to the front end.

Now you want to permission users so that everyone has access to the correct parts of the system.

## The objective

The objective is to use dynamic permissions and permission codes so that specific users have access to specific parts of the application – both functions and data..

We can display the configuration of both in our request server, data server and event handler.

## Set up generic permissions

First, enable the COUNTERPARTY table and COUNTERPARTY_ID field as part of the generic permissions system.

You can read more about it here: [https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model](https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model "https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model")

Starting with the server, make sure that you have two USER and USER_ATTRIBUTES records setup: JohnDoe and JaneDoe.

![](/img/jane-and-john-doe.png)

Add two new key values in **site-specific/cfg/genesis-system-definition.kts** as described in the docs above:

```kotlin
    item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")

    item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
```

Take note of **auth-permissions.auto.xml** in generated/cfg before running install.

## Install and remap

Run **genesisInstall** to check the changes you have made.

Run **remap**.

**Remap** prompts you to add a new table called USER_COUNTERPARTY_MAP and a new field has been added to USER_ATTRIBUTES.

After this, go to the USER_ATTRIBUTES table and use **DbMon** commands to set the ACCESS_TYPE field for JaneDoe to be ENTITY (instead of ALL).

table USER_ATTRIBUTES

qsearch USER_NAME==”JaneDoe”

set ACCESS_TYPE ENTITY

writeMode

update USER_ATTRIBUTES_BY_USER_NAME

The generic permissioning settings have now been set in place, and are stored in **auth-permissions.auto.xml** in **generated/cfg**. The next time GENESIS_AUTH_MANAGER and GENESIS_AUTH_PERMS are started they will consider the new configuration.

## Configure dynamic permissions

You can now configure dynamic permissions for trades and positions in our IDE. You need to make these changes to the code for the request server,  data server and event handler. For example, here we add permissioning to a query in the data server:

![](/img/dataserver.png)

You can add similar code to the queries in your request servers.

Event handlers are slightly different, because the input data class can be customised. The code would look like this:

```kotlin
query("ALL_TRADES", TRADE){
    permissioning {
       auth(mapName = “ENTITY_VISIBILITY”){ 
          TRADE.COUNTERPARTY_ID 
       }
    }
}
```

## Testing

You can write unit tests based on auth-perms (see EventHandlerPalTest in genesis-server repo inside genesis-pal-test, it contains an example of adding an auth cache override in the GenesisTestConfig and as part of the @Before setup)

For example:

* Unit test where user can complete action successfully due to permissions (e.g. JohnDoe)
* Unit test where user cannot complete action successfully due to permissions (e.g. JaneDoe)

Now moving to RIGHT_SUMMARY permission codes.

Permission codes enable you to establish yes/no type access to resources (request server, data server, event handler), but they don’t act dynamically and they won’t filter rows based on fine-grain criteria (like dynamic permissions would).

For the purpose of this script, we can keep things simple. In reality, you would use a GUI to create new rights, create new profiles and assign users to profiles. This would give rights to each user.

\[//\]: # (There is a plan to add a table at this point.)

In our trading app example we can set two types of rights:

* TRADER (enables the trader to write trades - but only for their own related counterparties)
* SUPPORT (enables support to have read-only access to everything)

In terms of definitions, you can add the codes as part of the permissioning block in the relevant event. For example, for the TRADE_INSERT event handler we could have:

```kotlin
permissions {

    permissionCodes = listOf("TRADER") 

}
```

This means only users with TRADER permission code will be able to use that event handler. You can add similar code to the request servers and data servers.

The permission mechanism is driven by the RIGHT_SUMMARY table, which contains an association between a user and a right-code. You can see an example of a test for permissions in EventHandlerPalTest in genesis-server repo inside genesis-pal-test, it contains an example of adding a RIGHT_SUMMARY record as part of the @Before setup.