---
title: Set up authentication and authorisation
sidebar_label: Set up authentication and authorisation
sidebar_position: 1
id: set-up

---
## Authentication

Content to follow shortly.

## Authorisation

Authorisation is achieved by permissioning dynamically. This means you can control access to information in increasingly precise ways, for example:

* The whole entity
* Specific rows
* Specific columns

Effectively, you have three levels of control:

**High level**. User A can view table ALL_TRADES.

You could hide an entire grid from the UI, for example. So, one group could view reference data, but this would be hidden from the other groups. Or, you could hide an entire data server. For this, you use RIGHTS_CODE. This is like a switch – you can either see it or not, depending on whether the code is TRUE or FALSE.

**Entity level**

This is row or column-level access to information. Different users all view the same grid, but each one sees different data. This is, best explained with these simple examples:

* You can have user A, user B and User C all having the RIGHTS_CODE to view a specific grid, but each one sees different trades in that grid. This enables you to separate different trading desks, for example.
* Each user might only have access to trades for specific customers.
* By including these permissions in an event handler,  user A can only enter a trade on behalf of a specific set of clients and user B can only enter trades on behalf of a different set of clients.

Similarly, you can have different users seeing different columns in the same grid. This could be used for a support function, for example, where you don’t want the support team to see specific columns of sensitive data, such as who the client for a trade is. It can be specified by GPAL.

### Users, profiles and rights

We have rights codes, profiles and users.

A profile can have zero to many rights codes and zero to many users.

So, if you have, say three roles, Trader, Support, and Operations, you set up the rights codes for each of these three profiles and then allocate each user to the appropriate profile. A user can have more than one profile, so you could allocate a superuser to all three profiles; that superuser would have the rights of all three profiles.

You cannot allocate rights codes directly to a specific user. But there is nothing to stop you from creating a profile that has only one user.

This information is held on the following tables:

* PROFILE_RIGHT. For each profile, this lists the entities that the profile has the right to view
* PROFILE_USER. For each profile, this lists the users who have been allocated (and therefore, who have the rights in the relevant PROFILE_RIGHT table).
* RIGHT_SUMMARY. This is created automatically by the system in real time. It maps all users to their rights.

In this way, the rights are easily accessible at speed. AUTH MANAGER process manages this automatically. So if you add a new user or you update a profile with new rights, the RIGHT_SUMMARY is updated immediately and all the users in that profile receive the new right automatically.

If the profile that has write access to an entity, then it automatically includes read rights.

### Loading a list of users

If you need to load a list of users and profiles you can use **SendIt** to send the list to the database, but it does not update the RIGHT_SUMMARY table automatically. After loading the database, you need to run the script **consolidateRights** to update the RIGHT_SUMMARY table.

### Good practice, bad practice

With this route, you can allocate rights to profiles and users to rights – and  change them. There is no change to the code needed.  However, our advice is to be as granular as possible at the start, because it is more difficult to introduce that granularity at a later point.  If yo create a new right, you have to change the code.

### Entity level (row level)

GENESIS_AUTH_PERMS runs automatically on start-up and creates a memory-mapped file that acts as a big key-value pair – for example, User J has access to Counterparty 1, User J has access to Counterparty 2, User K has access to Counterparty 1, User K has access to Counterparty 4, etc. . If there is no appropriate entry in the file, the user won’t have access.

You must keep the process running, as it maintains itself automatically whenever any permissions change. If you a permission is changed on this way, then the change is automatically reflected on screen. If I have a grid on screen with 4 trades from Counterparty 1 and my permission to view that counterparty are withdrawn,  those 4 trades disappear from my screen immediately.

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioining is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

## General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the user table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in **$GENESIS_HOME/runtime/authCache**.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table may be created.

## Adding authorisation to the data server and request server

The code for permissioning specific queries must be inserted into your data servers and request servers.

The dynamic authorisation definition in GPAL dataserver/requestserver has 4 settings which can be used in any combination.

### Grouping

Auth definitions can now be grouped with “and” or “or” operators. This means you could have two simple permission maps, for example, one by counterparty and another one for forbidden symbols. This would require a user to have those two permissions at once in order to see the row. Alternatively, you could have two permission maps (one for buyer and one for seller). A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

#### AND grouping

This example shows an AND grouping:

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        TRADE.COUNTERPARTY_ID
    } and auth(mapName = "SYMBOL_RESTRICTED") {
        TRADE.SYMBOL
    }
}
```

#### OR grouping

This example shows OR grouping

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.BUYER_ID
    } or auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.SELLER_ID
    }
}
```

### Where clauses

You can define a where clause if you only want to show a row in specific cases. Authorisation definitions using a where clause first evaluate the where clause against the permission map. This functionality on its own is not that useful, as for a single auth permissions map the content of the where clause could be moved to the query where clause instead. However, it shines when using auth grouping, because you can filter rows based on individual user permissions.

This example shows different where clauses based on user role.

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.CLIENT_ID
        where { view ->
            !(BidState.DRAFT == view.bidState && !(BidBookState.OPEN == view.bidBookState ||(BidBookState.UPCOMING == view.bidBookState)) )
        }
    } or
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.BUYER_DEALER_ID
        where { view ->
            !((BidBookState.UPCOMING == view.bidBookState || BidBookState.OPEN == view.bidBookState) && DealerRole.PRINCIPAL == view.dealerRole)
        }
    }
}
```

### HideFields

You can also have different column visibility levels based on user authorisation and row content.

The example below hides the LAST_TRADED_PRICE column value for a particular instrument code.

```kotlin
query("ALL_TRADES_WITH_ENRICHED_AUTH", TRADE_VIEW) {
    permissioning {
        enrichedAuth(mapName = "TRADE_VISIBILITY", enrichedEntity = FAVOURITE_TRADES) {
            TRADE_VIEW.TRADE_ID
            FAVOURITE_TRADES.USER_NAME
        }
    }
    enrich(FAVOURITE_TRADES){
        join { userName, row ->
            FavouriteTrades.ByTradeIdAndUserName(
                userName = userName,
                tradeId = row.tradeId
            )
        }
        fields {
            derivedField("FAVOURITE", BOOLEAN) { row, userData ->
                userData != null
            }
        }
    }
    config {
        compression = true
    }
}
```