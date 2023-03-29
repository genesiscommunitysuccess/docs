---
title: 'Data Server - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, data server, dataserver, advanced]
tags:
  - server
  - data server
  - dataserver
  - advanced
---


## Client-enriched data

In some scenarios, you might want to associate the results of Data Server queries with the user who initiated the queries. You can achieve this using the ```enrich``` feature, which enables an additional table or view join (including backwards joins). With this feature, you can provide user-specific values for each row, or even perform cell-level permissioning (for example, to hide cell values), depending on entitlements.

The `join` operation receives two parameters: 
- `userName` is the current user name subscribed to the query
- `row` is the pre-built query row

`hideFields` enables you to define a list of fields that will be hidden if certain conditions apply. Three parameters are provided: 
- `userName` the current user name subscribed to the query
- `row` the pre-built query `row`
- `userData` the table or view lookup result; this will be null if the lookup fails to find a record

The `fields` section defines what fields should be visible as part of the query. Use this if you want to use a subset of fields from the enriched table or view, or if you want to declare your own derived fields.

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
            // If a user belongs to the buyer counterparty, "DIRECTION" will be "BUY"
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

## Ranged Data Server queries

Ranged Data Server queries only read a defined range within a table or view, and only this data is monitored for updates (not the whole table or view). This makes the Data Server more responsive and reduces resource requirements. It uses the database range search operation [getRange](../../../database/database-interface/entity-db/#getrange).

The following conditions apply to a ranged Data Server query:
- You can specify the start index and end index using these keywords:
   `from` specifies the start of the data range. It is mandatory when you use `from-to` condition.
   `to` specifies the end of the data range. It is optional. When `to` is not specified, the `from` clause works in a same way as `where` clause specified below
- You can specify a particular index value using this keyword:
   `where` gives the range of data on a specified index field value, which must be provided.
- You can optionally refresh keys using the `refresh` keyword, which sets a periodic refresh of keys, as shown in examples below

The example below shows how using the `where` clause in ranged queries differs from normal queries.
The scenario is this: you want to get trade records where the `currencyId` is `USD`. You can write a Data Server query in two ways, which affects how much data is cached:

- Method 1 is not a ranged query. It initially reads all the table/view data (which could be very large) and then applies the `where` clause to confine the range to USD, so it can take a long time to get the Data Server query up and running.
- Method 2 is a ranged query. It uses a database range search operation [getRange](../../../database/database-interface/entity-db/#getrange), so it is able to read just the data we need from database using indices. This means the data that we need to process is much smaller - much more efficient.
No real `where` clause is applied, the data returned by the database operation already contains the correct rows.

```kotlin
// Method 1:
query("TRADE_USD", TRADE) {
    where {
        it.currencyId == "USD"
    }
}

// Method 2:
query("TRADE_RANGED_USD", TRADE) {
    ranged(Trade.ByCurrencyId, 1) {
            where {
                Trade.ByCurrencyId("USD")
            }
        }
}
```

The examples below include comments to ease understanding.



```kotlin
query("TRADE_RANGED_LAST_2_HOURS", TRADE) {
    // the ranged key word makes this a ranged query
    //    the index and the number of key fields needs to be specified
    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {
        // optionally refresh keys periodically, for example, when we are doing a
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
        to {
            Trade.ByTradeDateTime(now().plusHours(1), "")
        }
    }
}
```

Examples:

```kotlin
// all dollar trades:
query("TRADE_RANGED_TRADE_RANGE_USD", TRADE) {
    ranged(Trade.ByCurrencyId, 1) {
        where {
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

The `numKeyFields` property specifies the number of fields to use from an index. The fields
are always selected in the order they are specified in the index.

The `index` property can have unique and non-unique [indexes](../../../database/data-types/index-entities/#types)

Examples when: `numKeyFields > 1`

The range configuration returns a set of sorted records based on the index definition and the number of fields involved (specified by `numKeyFields`)
Let's see a couple of examples of ranged queries with their respective results in CSV format. The table definition with associated data sorted by its primary key fields is shown below:

```kotlin
table(name = "GENESIS_PROCESS_MONITOR", id = 20) {
    MONITOR_NAME
    PROCESS_HOSTNAME
    PROCESS_NAME

    primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
        PROCESS_HOSTNAME
        PROCESS_NAME
        MONITOR_NAME
    }
}
```

```csv
PROCESS_HOSTNAME,PROCESS_NAME,MONITOR_NAME
localhost,process_a,monitor_a
localhost,process_a,monitor_b
localhost,process_b,monitor_a
localhost,process_b,monitor_b
remote_host,process_a,monitor_a
remote_host,process_a,monitor_b
remote_host,process_b,monitor_a
remote_host,process_b,monitor_b
```

Example 1:
Ranged query:
```kotlin
query("GENESIS_PROCESS_MONITOR_NUM_KEY_FIELDS_2", GENESIS_PROCESS_MONITOR) {
   ranged(GenesisProcessMonitor.ByHostname, 2) {
      from {
         GenesisProcessMonitor.ByHostname(
            processHostname = "localhost",
            processName = "process_a",
            monitorName = "monitor_a" // monitorName values are ignored since numKeyFields is 2
         )
      }
      to {
         GenesisProcessMonitor.ByHostname(
            processHostname = "localhost",
            processName = "process_b",
            monitorName = "monitor_a" // monitorName values are ignored since numKeyFields is 2
         )
      }
   }
}
```
Result:
```csv
PROCESS_HOSTNAME,PROCESS_NAME,MONITOR_NAME
localhost,process_a,monitor_a
localhost,process_a,monitor_b
localhost,process_b,monitor_a
localhost,process_b,monitor_b
```

Example 2:
Ranged query:
```kotlin
    query("GENESIS_PROCESS_MONITOR_NUM_KEY_FIELDS_3", GENESIS_PROCESS_MONITOR) {
        ranged(GenesisProcessMonitor.ByHostname, 3) {
            from {
                GenesisProcessMonitor.ByHostname(
                    processHostname = "localhost",
                    processName = "process_a",
                    monitorName = "monitor_a"
                )
            }
            to {
                GenesisProcessMonitor.ByHostname(
                    processHostname = "remote_host",
                    processName = "process_a",
                    monitorName = "monitor_a"
                )
            }
        }
    }
```
Result:
```csv
PROCESS_HOSTNAME,PROCESS_NAME,MONITOR_NAME
localhost,process_a,monitor_a
localhost,process_a,monitor_b
localhost,process_b,monitor_a
localhost,process_b,monitor_b
remote_host,process_a,monitor_a
```

## Client-side (runtime) options

When a client initiates a subscription to a Data Server by sending a **DATA_LOGON** message, there are several options that can be specified. None of these options is mandatory; you don't have to specify any to initiate a subscription. 
The features of the options are explained below.


| Option         | Default   | Description                                                  |
| -------------- | --------- | ------------------------------------------------------------ |
| MAX_ROWS       | 250       | Maximum number of rows to be returned as part of the initial message, and as part of any additional **MORE_ROWS** messages |
| MAX_VIEW       | 1000      | Maximum number of rows to track as part of a client "view   |
| MOVING_VIEW    | **true**  | Defines the behaviour of the client view when new rows are received in real time. If `MOVING_VIEW` is set to `true`, and `MAX_VIEW` is reached, any new rows arriving to the query will start replacing the oldest rows in the view. This guarantees that only the most recent rows are shown by default |
| CRITERIA_MATCH |           | Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: `Expr.dateIsBefore(TRADE_DATE,'20150518')` or `QUANTITY > 10000` |
| FIELDS         |           | This optional parameter enables you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: `TRADE_ID QUANTITY PRICE INSTRUMENT_ID`. By default, all fields are returned if this option is not specified |
| ORDER_BY       |           | This option can be used to select a [Data Server index](../../../database/data-types/index-entities/) (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, Data Server rows will be returned in order of creation (from oldest database record to newest) |
| REVERSE        | **false** | This option changes the [Data Server index](../../../database/data-types/index-entities/) iteration. For example, if you are using the default index, the query will return rows from newest database records to oldest |

## Criteria matching

Used to perform filters on the server, you can send a Groovy expression as part of your Data Server request for client-side filtering. Criteria matching supports Groovy expressions and some common expressions. All expressions must return a boolean value (`true` or `false`).
You can mix and match both common expressions and custom groovy expressions using the && (logical AND) and || (logical OR) boolean operators. These are explained in more detail below.

## Common expressions

The platform provides common expressions that are especially helpful for `Date` and `DateTime` client-side filtering. Common expressions are called using the `Expr` binding and take one or two parameters:

- The first parameter is always a query field. In the case of date/datetime, this can either represent the epoch time in milliseconds or a `String` value representing the actual `Date` and `DateTime` in the supported formats.
- The second parameter (if applicable) is a predefined `String` value

## String operations

### containsIgnoreCase(String, String)
This returns `true` when our field contains the string. Casing is ignored.

For example:
`Expr.containsIgnoreCase(EXCHANGE_NAME, 'oves')`

### containsWordsStartingWithIgnoreCase(String, String)
This returns `true` when our field starts with the string. Casing is ignored.

## Date operations

The allowed String formats are:
- DateTime with milliseconds precision: _yyyyMMdd-HH:mm:ss.SSS_
- DateTime with seconds precision: _yyyyMMdd-HH:mm:ss_
- DateTime with minutes precision: _yyyyMMdd-HH:mm_
- DateTime as Date: _yyyyMMdd_

### dateIsBefore(date as DateTime|String|Long, String)
This returns `true` when the date in the given field is before the date specified.

For example:
`Expr.dateIsBefore(TRADE_DATE,'20150518')`

### dateIsAfter(date as DateTime|String|Long, String)
This returns true when the date in the given field is after the date specified.

For example:
`Expr.dateIsAfter(TRADE_DATE,'20150518')`

### dateIsGreaterEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is greater or equal to the date specified.

For example:
`Expr.dateIsGreaterEqual(TRADE_DATE,'20150518')`

### dateIsLessEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is less or equal to the date specified.

For example:
`Expr.dateIsLessEqual(TRADE_DATE,'20150518')`

### dateIsEqual(date as DateTime|String|Long, String)
This returns `true` when the date in the given field is equal to the date specified

For example:
`Expr.dateIsEqual(TRADE_DATE,'20150518')`

### dateIsToday(date as DateTime|String|Long)
This returns `true` when the data in the given field is equal to today's date (using system local time).

For example:
`Expr.dateIsToday(TRADE_DATE)`

## DateTime operations

### dateTimeIsBefore(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is before the datetime specified.

For example:
`Expr.dateTimeIsBefore(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsAfter(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is after the datetime specified.

For example:
`Expr.dateTimeIsAfter(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsGreaterEqual(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is greater or equal to the datetime specified.

For example:
`Expr.dateTimeIsGreaterEqual(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsLessEqual(datetime as DateTime|String|Long, String)


This returns `true` when the datetime in the given field is less or equal to the datetime specified.

For example:
`Expr.dateTimeIsLessEqual(TRADE_DATETIME,'20150518-10:50:24')`

## Groovy expressions

Groovy expressions provide the most flexibility for client-side filtering. This approach allows you to use complex boolean logic to filter over your fields using Java syntax.

Note - You can not filter over derived fields.

Below are a few examples of valid Groovy expressions.

```
// Quantity is more than 10000
QUANTITY > 10000

// Quantity is more than or equal to 10000
QUANTITY >= 10000

// Quantity is less than 10000
QUANTITY < 10000

// Quantity is less than or equal to 10000
QUANTITY <= 10000

// Quantity is equal to 10000
QUANTITY == 10000

// Quantity is not equal 10000
QUANTITY != 10000
```

You can also join multiple expressions together. These expressions can even be the common expressions mentioned above.

```
// Quantity is more than 100 AND less than 500
QUANTITY > 100 && QUANTITY < 500

// Quantity is less than 100 OR more than or equal to 500
QUANTITY < 100 || QUANTITY >= 500

// Date is today AND QUANTITY is more than 100
Expr.dateIsToday(TRADE_DATE) && QUANTITY > 100
```

Note - When using logical OR in your filter, you will lose the ability to use indexing for searches.

Should you wish to use more advanced boolean logic, you can pass brackets to ensure each part of your filter is checked in line with your business needs.

The following complex example defines:
- If the date is today, the QUANTITY must be over 100
- If the date is 1st of April 2022, the QUANTITY must be between 250 and 350

```
(Expr.dateIsToday(TRADE_DATE) && QUANTITY > 100) || (Expr.dateIsEqual(TRADE_DATE, "20220401") && (QUANTITY > 250 || QUANTITY < 350))
```

In Java's operator precedence, logical AND is evaluated before logical OR. For this reason, we must add `QUANTITY > 250 || QUANTITY < 350` within brackets.
