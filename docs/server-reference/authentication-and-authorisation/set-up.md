---
title: 'Set up authentication and authorisation'
sidebar_label: 'Set up authentication and authorisation'
sidebar_position: 1
id: set-up
---

## Authentication

You need to be sure that only permitted individuals are able to gain access to your application.

:::danger WIP
more on authentication needed here.
:::

## Authorisation

:::danger WIP
(add the text on three levels.)
:::

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioining is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

## General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the user table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in $GENESIS_HOME/runtime/authCache.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table may be created.

Authorisation definition in the data server and request server

The dynamic authorisation definition in GPAL dataserver/requestserver has 4 settings which can be used in any combination. 

Grouping

Auth definitions can now be grouped with “and” or “or” operators. This means you could have two simple permission maps, for example, one by counterparty and another one for forbidden symbols. This would require a user to have those two permissions at once in order to see the row. Alternatively, you could have two permission maps (one for buyer and one for seller). A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

AND grouping

This example shows an AND grouping:

          permissioning {
                auth(mapName = "ENTITY_VISIBILITY") {
                    TRADE.COUNTERPARTY_ID
                } and auth(mapName = "SYMBOL_RESTRICTED") {
                    TRADE.SYMBOL
                }
            }

OR grouping

This example shows OR grouping

     permissioning {
                auth(mapName = "ENTITY_VISIBILITY") {
                    BID_OFFER.BUYER_ID
                } or auth(mapName = "ENTITY_VISIBILITY") {
                    BID_OFFER.SELLER_ID
                }
            }

Where clauses

You can define a where clause if you only want to show a row in specific cases. Authorisation definitions using a where clause first evaluate the where clause against the permission map. This functionality on its own is not that useful, as for a single auth permissions map the content of the where clause could be moved to the query where clause instead. However, it shines when using auth grouping, because you can filter rows based on individual user permissions.

This example shows different where clauses based on user role.

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

HideFields

You can also have different column visibility levels based on user authorisation and row content. 

The example below hides the LAST_TRADED_PRICE column value for a particular instrument code.

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