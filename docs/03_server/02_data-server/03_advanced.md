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

## Index-based Data Server queries

Index-based Data Server queries only read a defined range within a table or view, and only this data is monitored for updates (not the whole table or view). This makes the Data Server more responsive and reduces resource requirements. It uses the database range search operation [getRange](../../../database/database-interface/entity-db/#getrange).

You can use the following options when you create index-based queries:

### Advanced `where`

This provides a set of data equal to specified index. 
Advanced `where` accepts index and the provided index is used to get similar records from database. The Data Server query returns all the trade data whose quantity is equal to 42. You can optionally refresh keys using the `refresh` keyword, which sets a periodic refresh of keys, as shown in examples below:

```kotlin
query("TRADE_RANGE_BY_QUANTITY", TRADE) {
    where(Trade.ByQuantity(42), 1)
}

query("TRADE_RANGE_USD_REFRESH", TRADE) {
    where(Trade.ByCurrencyId("USD"), 1) {
        refresh {
            every(15.minutes)
        }
    }
}
```

The example below shows how advanced `where` queries differ from basic where queries.

The scenario is this: you want to get trade records where the `currencyId` is `USD`. You can write a Data Server query in two ways, which affects how much data is cached:

- Method 1 uses basic `where`. It initially reads all the table/view data (which could be very large) and then applies the `where` clause to confine the range to USD, so it can take a long time to get the Data Server query up and running.
- Method 2 uses advanced `where`. It uses a database range search operation [getRange](../../../database/database-interface/entity-db/#getrange), so it is able to read just the data we need from database using indices. This means the data that we need to process is much smaller - much more efficient.
  The `where` clause is applied at database level, the data returned by the database operation already contains the correct rows.

```kotlin
// Method 1:
query("TRADE_USD", TRADE) {
    where {
        it.currencyId == "USD"
    }
}

// Method 2:
query("TRADE_RANGED_USD", TRADE) {
    where(Trade.ByCurrencyId("USD"), 1)
}
```

### Ranged Data Server queries

Use the `ranged` keyword to create a query that provides a range of data. You need to provide the index and the number of key fields:

- The `index` property must be a unique [index](../../../database/data-types/index-entities/#types). However, you can have what is effectively a non-unique index by adding a field that is not unique (such as QUANTITY) and a field that is unique (such as TRADE_ID) to create a compound unique index:

```
unique {
 QUANTITY
 TRADE_ID
}
```

:::info
To create the default query index, a Data Server always uses the internal RECORD_ID value of the database records. This is equivalent to indexing records by their creation date. Data Servers do not use table indices. To query records efficiently, you need to recreate indices at the Data Server level.
:::

- Use the `numKeyFields` property to specify the number of fields to use from an index. The fields are always selected in the order they are specified in the index.
- Use `from` to specify the start of the data range. This is mandatory.
- Use `to` to specify the end of the data range. This is optional, but highly recommended. When `to` is not specified, the `from` clause works in a same way as advanced `where`, specified above. For these cases, we recommend using advanced `where` for better readability.
- Optionally, you can use the `refresh` keyword to refresh the keys. This sets a periodic refresh of keys, as shown in examples below, (which include comments to ease understanding):

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
    where(Trade.ByCurrencyId("USD"), 1)
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

## Incoming DATA_LOGON messages

To initiate a stream from a Data Server, the front end sends a DATA_LOGON message (which is generated automatically by the platform).

To control the flow of data and allow for filtering  and ordering, the following options can be included in the DATA_LOGON message.

| Option         | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | --------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MAX_ROWS       | 250       | Maximum number of rows to be returned as part of the initial message, and as part of any additional [MORE_ROWS](../../../server/integration/rest-endpoints/basics/#more_rows) requests; see below for more information                                                                                                                                                                        |
| MAX_VIEW       | 1000      | Maximum number of rows to track as part of a front-end view; see below for more information                                                                                                                                                                                                                                                                                                   |
| MOVING_VIEW    | **true**  | Defines the behaviour of the front-end view when it receives new rows in real time. If `MOVING_VIEW` is set to `true`, and `MAX_VIEW` is reached, any new rows arriving from the query will start replacing the oldest rows in the view. This guarantees that only the most recent rows are shown by default                                                                                  |
| CRITERIA_MATCH |           | The front end can send a common rxpression or a Groovy expression to perform filtering on the query server; these remain active for the life of the subscription. For example: `Expr.dateIsBefore(TRADE_DATE,'20150518')` or `QUANTITY > 10000`                                                                                                                                               |
| FIELDS         |           | This parameter enables the front end to select a subset of fields from the query. Example: `TRADE_ID QUANTITY PRICE INSTRUMENT_ID`. If this option is not specified, all fields are returned                                                                                                                                                                                          |
| ORDER_BY       |           | This option can be used to select a [Data Server index](../../../database/data-types/index-entities/) in the Data Server query that is being queried (the index must be defined in the query itself); this is useful if you want the data to be sorted in a specific way. By default, Data Server rows will be returned in the order they were created (from oldest database record to newest) |
| REVERSE        | **false** | This option changes the [Data Server index](../../../database/data-types/index-entities/) iteration. For example, if you are using the default index, the query will return rows from newest database records to oldest                                                                                                                                                                       |

Here is an example message:

```
{
    "DETAILS": {
        "CRITERIA_MATCH": "QUANTITY > 200",
        "MOVING_VIEW": true,
        "FIELDS": "TRADE_ID QUANTITY PRICE INSTRUMENT_ID",
        "MAX_ROWS": 10
    }
}
```

## Using Postman to send messages to the endpoint
Once the application has been built, your Data Server queries are all endpoints. They are accessible from any API client that knows how to log in. So you can use a client such as Postman to request data. To do this, you need to be able to provide the relevant options that appear in the the equivalent **DATA_LOGON** message.

For example, here we use Postman to test a query called ALL_TRADES in the server:

1. Set your request to **Post**.
2. Configure the URL according to your request. In this example we are using the ALL_TRADES query.
3. In the **Body** section, select **RAW** and **JSON** and insert a **DATA_LOGON** message (like the one above, for example) in the **DETAILS** field.
4. Click to **Send** the request.

Note that, whenever you use an API client to send a request to the server, you first need to send a login message. See more information in our page on [testing](../../../operations/testing/component-testing/#using-an-api-client).


## How MORE_ROWS and MAX_VIEWS behave
### MAX_ROWS
MAX_ROWS determines how many rows will be sent when the front end requests data. It also determines how many rows are sent when the front end makes a [MORE_ROWS request](../../../server/integration/rest-endpoints/basics/#more_rows). 

The rows are queried based on the REVERSE setting (which only applies to non-real-time updates). So it is important to note the following behaviour. 

For example, when a DATA_LOGON is received with MAX_ROWS set to 500, and REVERSE set to false:

- **If no real-time updates occur on the server** the initial DATA_LOGON returns all 500 rows in reverse order. If the front end makes another request for MAX_ROWS, it receives another 500 rows in reverse order. From here, the front end can make further MORE_ROWS requests until the MAX_VIEW setting is reached. 

- **If real-time updates occur on the server** these are sent to the front end regardless of order, and they will count towards the MAX_VIEW.

### MAX_VIEW and MOVING_VIEW
What happens when you reach MAX_VIEW depends on the MOVING_VIEW setting. 

- If MOVING_VIEW is set to true, the Data Server will start discarding the oldest rows (in terms of timestamp) and sending newer rows. So if you already have 2000 rows in your view and a new row is inserted, the oldest row in your view will be deleted (the Data Server sends a delete message) and the new row will be sent (the Data Server sends an insert message for that row). 

- If MOVING_VIEW is set to false, the Data Server will not send any updates for any new rows whatsoever. Only the rows that are currently in your view will receive updates. In either case, you can only have a total of MAX_VIEW rows in your grid.

This allows for easier implementation of infinite scrolling, whilst providing latest and greatest database updates. The front end must send a **DATA_LOGON** and then continue calling MORE_ROWS to fill the grid as the user scrolls.

### Limiting the number of rows
Where the front end wants to limit the number of rows returned by the query, and only wants updates for those specific rows, there are two options. Our scenarios here assume that the front end wants receive only five lines:

- The DATA_LOGON will have MAX_ROWS = 5, MAX_VIEW = 5, and MOVING_VIEW = false. This ensures that the server only returns those those rows and only sends updates for those rows - updates to other rows are ignored. 
- If the front end has requested a limited number of lines for the purposes of pagination, the DATA_LOGON will have MAX_ROWS = 5 and VIEW_NUMBER = 1. The first five rows are sent in a pagination mode. A subsequent MORE_ROWS update with VIEW_NUMBER = 2 will delete all the current five rows in the grid and return the next page of rows (i.e. another 5). The server only sends updates for the rows on display, and will respect REVERSE settings.  
On successful DATA_LOGON and on any subsequent MORE_ROWS messages, the server sends a field called ROWS_COUNT, which contains an estimated number of rows in the server. You can divide this number by your MAX_ROWS setting to know how many pages can be queried on the server.

:::info
Let's summarise all that.
- Normal DATA_LOGONs without MAX_ROWS = MAX_VIEW and MOVING_VIEW false always send new updates to the front end automatically once they occur in the server, regardless of the value of REVERSE. 
- Where the front end only wants to receive a subset of rows, or is using pagination, **DATA_LOGON** will have MAX_ROWS = MAX_VIEW and MOVING_VIEW = false.
:::

## Criteria matching

The incoming data **DATA_LOGON** message can also include filtering to control the rows returned. The incoming filtering is specified in the CRITERIA_MATCH option.

The filters can be specified using common expressions, Groovy expressions, or even a mix of the two. See more detail in our page in the [Web section of our documentation](../../../web/basics/data-server-resources/).


