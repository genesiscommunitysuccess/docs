---
title: Reference
sidebar_label: Reference
sidebar_position: 20
id: examples
---

## The simplest possible definition

A data server consists of one or more queries. Each query listens to a specified table or view, and publishes that data whenever it changes. In this simple example, there is one query, which publishes changes to the table INSTRUMENT_DETAILS.


```kotlin
dataServer {
    query(INSTRUMENT_DETAILS)
}
```

And here is a simple example that has two queries:


```kotlin
dataServer {
    query(INSTRUMENT_DETAILS)

    query(COUNTERPARTY)
}
```

### Specifying fields
By default, all table or view fields in a query definition will be exposed. If you don't want them all to be available, you must define the fields that are required.
You can also define additional derived fields in a dataserver, to supplement all the fields supplied by the table or view. The input for the derived field is the dataserver query row and all fields are available for use.
In the example below, we specify nine fields where one of them is a derived field:

```kotlin
dataServer {
    query(INSTRUMENT_DETAILS) {
        fields {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
            derivedField("IS_USD", BOOLEAN) {
                tradedCurrency == "USD"
            }
        }
    }
}
```

## Configuration settings

Before you define any queries, you can make configuration settings for the data server. These control the overall behaviour of the data server. Use the `config` statement.
Here is an example of some configuration settings: 

```kotlin
dataServer {
    config {
        lmdbAllocateSize = 512.MEGA_BYTE() // top level only setting
        // Items below can be overriden in individual query definitions
        compression = true 
        chunkLargeMessages = true
        defaultStringSize = 40
        batchingPeriod = 500
        linearScan = true
        excludedEmitters = listOf("PurgeTables")
        enableTypeAwareCriteriaEvaluator = true
    }
    query("SIMPLE_QUERY", SIMPLE_TABLE) {
        config {
            // Items below only available in query level config
            defaultCriteria = "SIMPLE_PRICE > 0"
            backwardsJoins = false
            disableAuthUpdates = false
        }
    }
}
```
Below, we shall examine the settings that are available for your `config` statement.

### Global settings

Global settings can be applied at two levels:

- Top level
- Query level

The following global setting applies at the top level only.


#### lmdbAllocateSize
This sets the size of the memory-mapped file where the in-memory cache stores the data server query rows. This configuration setting can only be applied at the top level. It affects the whole data server. 

By default, the size is defined in bytes. To use MB or GB, use the `MEGA_BYTE` or `GIGA_BYTE` functions. You can see these in the example below. The default is 2 GB.

```kotlin
lmdbAllocateSize = 2.GIGA_BYTE()
// or
lmdbAllocateSize = 512.MEGA_BYTE()
```

The following seetings apply at top-level and query-level.

#### compression
If this is set to `true`, it will compress the query row data before writing it to the in-memory cache. Defaults to `false`.

#### chunkLargeMessages
If this is set to true, it will split large updates into smaller ones. Defaults to `false`.

#### defaultStringSize
This is the size to be used for string storage in the data server in-memory cache. Higher values lead to higher memory use and lower values lead to truncation. Defaults to `40`.

#### batchingPeriod
This is the delay in milliseconds to wait before sending new data to data-server clients. Defaults to `500ms`.

#### linearScan
This enables linear scan behaviour in the query definition. If false, it will reject criteria expressions that don't hit defined indexes. Defaults to `true`.

#### excludedEmitters
This enables update filtering for a list of process names. Any database updates that originate from one of these processes will be ignored. Defaults to an empty list.

#### enableTypeAwareCriteriaEvaluator
This enables the type-aware criteria evaluator at the data-server level. Defaults to `false`. [Click here to read more](
    /platform-reference/configure-key-modules/data-servers/examples/#enabletypeawarecriteriaevaluator)

### Query settings
The following settings only apply at query-level. 

#### defaultCriteria
This represents the default criteria for the query. Defaults to `null`.

#### disableAuthUpdates
This disables real-time auth updates in order to improve the overall data responsiveness and performance of the server. Defaults to `false`.

#### backJoins
Seen in older versions of the platform, this has been replaced by the setting below. It is functionally the same.

#### backwardsJoins
This enables backwards joins on a view query. Backwards joins ensure real-time updates on the fields that have been joined. These need to be configured at the join level of the query in order to work correctly. Defaults to `true`.

#### enableTypeAwareCriteriaEvaluator

The type-aware criteria evaluator can automatically convert criteria comparisons that don't match the original type of the data server field; these can still be useful to end users. 

For example, you might want a front-end client to perform a criteria search on a `TRADE_DATE` field like this: `TRADE_DATE > '2015-03-01' && TRADE_DATE < '2015-03-02'`. 
This search  can be  translated automatically to the right field types internally (even though `TRADE_DATE` is a field of type `DateTime`). The Genesis index search mechanism can also identify the appropriate search intervals in order to provide an optimised experience. 
The type-aware evaluator can transform strings to integers, and any other sensible and possible conversion (e.g `TRADE_ID == '1'`). As a side note, this type-aware evaluator is also available in `DbMon` for operations like `search` and `qsearch`.

By contrast, the traditional criteria evaluator needs the field types to match the query fields in the data server. So the same comparison using the default criteria evaluator for `TRADE_DATE` would be something like: `TRADE_DATE > new DateTime(1425168000000) && TRADE_DATE < new DateTime(1425254400000)`. This approach is less intuitive and won't work with our automatic index selection mechanism. In this case, you should use our [common date expressions](/platform-reference/configure-key-modules/data-servers/examples/#common-datedatetime-criteria-expressions) to handle date searches.


## Backwards joins

Each query in a data server creates what is effectively an open connection between each requesting user and the data server. After the initial send of all the data, the data server only sends modifications, deletes and inserts in real time.

By default, the primary table and all joined tables and views with a backward join flag are monitored. Any changes to these are sent automatically.

Queries that do not have `backwardsJoins = false` will use any backwards joins in any view included in the query. The monitoring of these backward joins can come at a cost, as it can cause significant extra processing. Do not use backwards joins unless there is a need for the data in question to be updated in real time. Counterparty data, if changed, can wait until overnight, for example. The rule of thumb is that you should only use backwards joins where the underlying data is being updated intraday.


## Where clauses

If you include a `where` clause in a query, the request is only processed if the criteria specified in the clause are met. For example, If you have an application that deals with derivatives that have parent and child trades, you can use a `where` clause to confine the query to parent trades only.

Also, you can use these clauses to focus on a specific set of fields or a single field. You can then use Java syntax, such as `contains`*, or string/numeric operations.

Finally, note that `where` clauses can also be used for permissioning. If you want only users with a specific ID to have access to this data, you could permission them here.

In the example below, we have a data server query based on the existing `ENHANCED_TRADE_VIEW`, which filters trades so that only those whose value is larger than 1 million are permissioned.

```kotlin
dataServer {

    query("ALL_TRADES_LARGE_POSITION", ENHANCED_TRADE_VIEW) {
        permissioning {
            permissionCodes = listOf("TRADER", "SUPPORT")
            auth(mapName = "ENTITY_VISIBILITY") {
                ENHANCED_TRADE_VIEW.COUNTERPARTY_ID
            }
        }
        where { trade -> 
            (trade.quantity * trade.price) > 1000000 
        }
    }
}
```


## Indices

Here is an an example of a simple index:

```kotlin
dataServer {
    query("SIMPLE_QUERY", SIMPLE_TABLE) {
        indices {
            unique("SIMPLE_QUERY_BY_QUANTITY") {
                QUANTITY
                SIMPLE_ID
            }
        }
    }
}
```

### Index definition
The `indices` (optional) block defines additional indexing at the query level. When an index is used, it will order all query rows by the fields specified, in ascending order. This definition is identical to the one defined in data modelling for dictionary tables.

There are two scenarios in which an index can be used:
* Optimising query criteria search. If a data server client specifies criteria such as `QUANTITY > 1000 && QUANTITY < 5000`, the data server will automatically select the best matching index. In our example, it would be `SIMPLE_QUERY_BY_QUANTITY`. This means we don't need to scan all the query rows stored in the data server memory-mapped file cache; instead, we perform a very efficient indexed search.
* Index specifed in the data server client. If an `ORDER_BY` value is received as part of the `DATA_LOGON` process, the data server will use a specific index to query the data. The data will be returned to the client in ascending order, based on the index field definition. See more at [Client side (runtime) options](#client-side-runtime-options).

*Important*: Index definitions are currently limited to *unique* indices. As quantity does not have a unique constraint in the example definition shown above, we need to add SIMPLE_ID to the index definition to ensure we maintain uniqueness.



## Advanced features

### Client-enriched data

In some scenarios, you might want to associate the results of data server queries with the user who initiated the queries. You can achieve this using the ```enrich``` feature, which enables an additional table or view join (including backwards joins). With this feature, you can provide user-specific values for each row, or even perform cell-level permissioning (for example, to hide cell values), depending on entitlements.

The `join` operation receives two parameters: 
- `userName` is the current user name subscribed to the query
- `row` is the pre-built query `row`
With these two values, you can build the necessary table or view index class to perform the database lookup.
Another parameter gives you extra flexibility.b`hideFields` enables you to define a list of fields that will be hidden if certain conditions apply. Three parameters are provided: 
- `userName` the current user name subscribed to the query
- `row` the pre-built query `row`
- `userData` the table or view lookup result; this will be null if the lookup fails to find a record


The `fields` section defines what fields should be visible as part of the query. use this if you want to use a subset of fields from the enriched table or view, or if you want to declare your own derived fields.

The example below should help you to understand the functionality. Comments are included in the code to ease understanding.


```kotlin
// Example using "hideFields" and creating derived fields based on user counterparty association
query("ALL_BUYER_SELLER_TRADES", BUYER_SELLER_TRADE_VIEW){
    permissioning {
        permissionCodes = listOf("ViewTrades")
        auth("ENTITY_VISIBILITY"){
            BUYER_SELLER_TRADE_VIEW.BUYER_COUNTERPARTY_ID
        } or
        auth("ENTITY_VISIBILITY"){
            BUYER_SELLER_TRADE_VIEW.SELLER_COUNTERPARTY_ID
        }
    }
    enrich(USER_COUNTERPARTY_MAP) {
        join { userName, row ->
            UserCounterpartyMap.ByUserName(userName)
        }
        // Hide buyer counterparty id to users associated to counterparty seller if "isHiddenToSeller" is true.
        hideFields { userName, row, userData ->
            if(userData?.counterpartyId == queryRow.sellerConterPartyId && queryRow.isHiddenToSeller == true){
                listOf(BUYER_SELLER_TRADE_VIEW.BUYER_COUNTERPARTY_ID)
            } else{
                emptyList()
            }
        }
        fields {
            // If a user belows to the buyer counterparty, "COUNTERPARTY" value will be the seller name
            // in the reverse scenario it will be the buyer name
            derivedField("COUNTERPARTY", STRING) { row, userData ->
                when {
                    userData?.counterpartyId == row.buyerId -> row.sellerName
                    userData?.counterpartyId == row.sellerId -> row.buyerName
                    else -> ""
                }
            }
            // If a user belows to the buyer counterparty, "DIRECTION" will be "BUY"
            // in the reverse scenario it will be "SELL"
            derivedField("DIRECTION", STRING) { row, userData ->
                when {
                    userData?.counterpartyId == row.buyerId -> "BUY"
                    userData?.counterpartyId == row.sellerId -> "SELL"
                    else -> ""
                }
            }
        }
    }
}

// Example: selecting fields from enriched view
query("ALL_COUNTERPARTIES" , COUNTERPARTY_VIEW) {
    // Lookup user counterparty favourite view and provide user enrich field to display if a counterparty has been marked as favourite by the user.
    enrich(USER_COUNTERPARTY_FAVOURITE) {
        join { userName, row ->
            UserCounterpartyFavourite.ByUserNameCounterparty(username, row.counterpartyId)
        }
        // We only care about selecting the IS_FAVOURITE field from the USER_COUNTERPARTY_FAVOURITE view
        fields {
            USER_COUNTERPARTY_FAVOURITE.IS_FAVOURITE
        }
    }
}

// Example: using "enrichedAuth" to combine fields from enrichment with authorisation mechanism
query("ALL_FAVOURITE_COUNTERPARTIES", COUNTERPARTY_VIEW) {
    permissioning {
        enrichedAuth("COUNTERPARTY_FAVOURITE_VISIBILITY", USER_COUNTERPARTY_FAVOURITE) {
            COUNTERPARTY_VIEW.COUNTERPARTY_ID
            USER_COUNTERPARTY_FAVOURITE.IS_FAVOURITE
        }
    }
    enrich(USER_COUNTERPARTY_FAVOURITE) {
        join { userName, row ->
            UserCounterpartyFavourite.ByUserNameCounterparty(username, row.counterpartyId)
        }
    }
}

```

### Ranged data server queries

Ranged data servers only cache a defined range within a table or view. This makes the data server more responsive and reduces resource requirements.

The example below includes comments to ease understanding:

```kotlin
query("TRADE_RANGED_LAST_2_HOURS", TRADE) {
    // the ranged key word makes this a ranged query
    //    the index and the number of key fields needs to be specified
    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {
        // optionally refresh keys periodically, for example when we are doing a
        // range on dates
        refresh {
            // either every
            every(2.hours)
            // or at specific time
            at(8.pm)
        }
        // required, starting key
        from {
            Trade.ByTradeDateTime(now().minusHours(2), "")
        }
        // optionally end key
        to {
            Trade.ByTradeDateTime(now().plusHours(1), "")
        }
    }
}
```

Examples

```kotlin
// all dollar trades:
query("TRADE_RANGED_TRADE_RANGE_USD", TRADE) {
    ranged(Trade.ByCurrencyId, 1) {
        from {
            Trade.ByCurrencyId("USD")
        }
    }
}

// all trades with quantity between 100 and 1,000
query("TRADE_RANGED_TRADE_RANGE_QTY", TRADE) {
    ranged(Trade.ByQuantity, 1) {
        from {
            Trade.ByQuantity(100)
        }
        to {
            Trade.ByQuantity(1000)
        }
    }
}

query("TRADE_RANGED_LAST_2_HOURS", TRADE) {
    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {
        refresh {
            every(15.minutes)
        }
        from {
            Trade.ByTradeDateTime(now().minusHours(2), "")
        }
        to {
            Trade.ByTradeDateTime(now().plusHours(1), "")
        }
    }
}
```

With refresh queries, rows that move out of the filter range will be removed from the cache, while rows that move into the filter will be added.

When using `numKeyFields` that is less than the number of fields in the index, dummy values need to be passed into the index constructor.

## Client-side (runtime) options

When a client initiates a subscription to a data server by sending a **DATA_LOGON** message, there are several options that can be specified. All the options are **optional**; you don't have to specify any to initiate a subscription. 
The features of the options are explained below.


| Option         | Default   | Description                                                  |
| -------------- | --------- | ------------------------------------------------------------ |
| MAX_ROWS       | 250       | Maximum number of rows to be returned as part of the initial message, and as part of any additional **MORE_ROWS** messages |
| MAX_VIEW       | 1000      | Maximum number of rows to track as part of a client "view   |
| MOVING_VIEW    | **true**  | Defines the behaviour of the client view when new rows are received in real time. If `MOVING_VIEW` is set to `true`, and `MAX_VIEW` is reached, any new rows arriving to the query will start replacing the oldest rows in the view. This guarantees that only the most recent rows are shown by default |
| CRITERIA_MATCH |           | Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: `Expr.dateIsBefore(TRADE_DATE,'20150518')` or `QUANTITY > 10000` |
| FIELDS         |           | This optional parameter enables you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: `TRADE_ID QUANTITY PRICE INSTRUMENT_ID`. By default, all fields are returned if this option is not specified |
| ORDER_BY       |           | This option can be used to select a data server index (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, data server rows will be returned in order of creation (from oldest database record to newest) |
| REVERSE        | **false** | This option changes the data server index iteration. For example, if you are using the default index, the query will return rows from newest database records to oldest |

## Common Date/DateTime criteria expressions

The data server criteria support some common expressions all called using the `Expr` special binding. All these return a boolean value (`true` or `false`) and are especially helpful for `Date` and `DateTime` client-side filtering. 
- The first parameter is always a query field, which can either represent the epoch time in milliseconds or a `String` value representing the actual `Date` and `DateTime` in the supported formats. 
- The second parameter (if applicable) is a predefined `String` value, also represented using the supported formats.

The allowed String formats are:


- DateTime with milliseconds precision: _yyyyMMdd-HH:mm:ss.SSS_


- DateTime with seconds precision: _yyyyMMdd-HH:mm:ss_


- DateTime with minutes precision: _yyyyMMdd-HH:mm_


- DateTime as Date: _yyyyMMdd_

### Date operations

#### dateIsBefore(date as DateTime|String|Long, String)
This returns true when the date in the given field is before the date specified.

For example:
`Expr.dateIsBefore(TRADE_DATE,'20150518')`

#### dateIsAfter(date as DateTime|String|Long, String)
This returns true when the date in the given field is after the date specified.

For example:
`Expr.dateIsAfter(TRADE_DATE,'20150518')`

#### dateIsGreaterEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is greater or equal to the date specified.

For example:

`Expr.dateIsGreaterEqual(TRADE_DATE,'20150518')`

#### dateIsLessEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is less or equal to the date specified.

For example:

`Expr.dateIsLessEqual(TRADE_DATE,'20150518')`

#### dateIsEqual(date as DateTime|String|Long, String)
This returns `true` when the date in the given field is equal to the date specified

For example:
`Expr.dateIsEqual(TRADE_DATE,'20150518')`

#### dateIsToday(date as DateTime|String|Long)
This returns `true` when the data in the given field is equal to today's date (using system local time).

For example:
`Expr.dateIsToday(TRADE_DATE)`

### DateTime operations

#### dateTimeIsBefore(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is before the datetime specified.

For example:

`Expr.dateTimeIsBefore(TRADE_DATETIME,'20150518-10:50:24')`

#### dateTimeIsAfter(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is after the datetime specified.

For example:

`Expr.dateTimeIsAfter(TRADE_DATETIME,'20150518-10:50:24')`

#### dateTimeIsGreaterEqual(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is greater or equal to the datetime specified.

For example:


`Expr.dateTimeIsGreaterEqual(TRADE_DATETIME,'20150518-10:50:24')`

#### dateTimeIsLessEqual(datetime as DateTime|String|Long, String)


This returns `true` when the datetime in the given field is less or equal to the datetime specified.

For example:


`Expr.dateTimeIsLessEqual(TRADE_DATETIME,'20150518-10:50:24')`

