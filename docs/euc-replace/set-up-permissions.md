---
id: j-permiss
title: Set up permissions
sidebar_label: Set up permissions

---
Pre-requisites to do the steps.

Ref_data_app exists (with all its tables) and the schema can be imported into trading_app.

Trading_app exists and it contains the schema for TRADE table + event handlers, dataservers and req-reps.

## The objective

The objective is to use dynamic permissions and permission codes so that specific users have access to specific parts of the application – bot functions and data.. We can display the configuration of both in our req/rep, dataserver and eventhandler.

We can enable COUNTERPARTY table and COUNTERPARTY_ID field as part of the generic permissions system. You can read more about it here : [https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model](https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model "https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/1178271745/4.1.0+Release+Key+Features+Breaking+changes#Auth-generic-permissions-model")

Starting with the server, ensure we have two USER and USER_ATTRIBUTES records setup. One can be JohnDoe and another one can be JaneDoe (I have already set them up in dev-trading1 and can be found in \~/testData folder).

Set two new key values in site-specific/cfg/genesis-system-definition.kts as described in the docs above:

item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")

item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")

Take note of auth-permissions.auto.xml in generated/cfg before running install

Run **genesisInstall**

Run remap. 

Remap will prompt you to add a new table called USER_COUNTERPARTY_MAP and a new field has been added to USER_ATTRIBUTES.

After this we can set the ACCESS_TYPE field for JaneDoe to be ENTITY instead of ALL. This field is part of the USER_ATTRIBUTES table. We can do this using DbMon commands:

table USER_ATTRIBUTES

qsearch USER_NAME==”JaneDoe”

set ACCESS_TYPE ENTITY

writeMode

update USER_ATTRIBUTES_BY_USER_NAME

The auth-permissions.auto.xml in generated/cfg will be different now as the generic permissioning settings have been set in place. This means that next time GENESIS_AUTH_MANAGER and GENESIS_AUTH_PERMS are started they will consider the new configuration.

## Configure dynamic permissions

You can now configure dynamic permissions for trades and positions in our IDE: req-rep, dataserver and eventhandler. For example:

query("ALL_TRADES", TRADE){

permissioning {

    auth(mapName = “ENTITY_VISIBILITY”){ 
    
       TRADE.COUNTERPARTY_ID 
    
    } 

}

}

The same applies to request servers.

Event handlers are slightly different, because the input data class can be customised. The code would look like this:

        permissions { 
    
            auth("ENTITY_VISIBILITY ") { 
    
                field { counterpartyId } 
    
            } 
    
        } 

Testing

We can write unit tests based on auth-perms (see EventHandlerPalTest in genesis-server repo inside genesis-pal-test, it contains an example of adding an auth cache override in the GenesisTestConfig and as part of the @Before setup) For example:

Unit test where user can complete action successfully due to permissions (e.g. JohnDoe)

Unit test where user cannot complete action successfully due to permissions (e.g. JaneDoe)

Now moving to RIGHT_SUMMARY permission codes.

Permission codes allow you to establish yes/no type access to resources (req-reps, dataserver, event handler), but they don’t act dynamically and they won’t filter rows based on fine grain criteria (like dynamic permissions would).

For the purpose of this script we can keep things simple. In reality you would use a GUI to create new rights, create new profiles and assign users to profiles. This would give rights to each user (will have a diagram to add here).

In our trading app example we can have two types of rights: TRADER (write trades but only related to their counterparties) and SUPPORT (read-only everything)

In terms of definitions, you can add the codes as part of the permissioning block. For example, for the TRADE_INSERT event handler we could have:

permissions {

            permissionCodes = listOf("TRADER") 

}

This means only users with TRADER permission code will be able to use that event handler. You can apply the same concept to req/reps and dataservers.

The permission mechanism is driven by the RIGHT_SUMMARY table, which contains an association between a user and a right-code. You can see an example of a test for permissions in EventHandlerPalTest in genesis-server repo inside genesis-pal-test, it contains an example of adding a RIGHT_SUMMARY record as part of the @Before setup.