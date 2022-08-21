---
id: 03_ssdt-day3
title: Day 3
sidebar_label: Day 3
sidebar_position: 4

---
This day covers:

- [Advanced data servers​](#advanced-request-servers)
- [Advanced request servers](#advanced-request-servers)


## Advanced data servers

A Data Server allows for reading of real-time data. Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the updates to all of its subscribers. The Data Server configuration is refreshingly light, because all the hard work is done by the table or views. A Data Server file consists of a number of queries that handle each event in the required way. You can define any number of queries. 

Data Servers are conventionally defined in the file application-name-dataserver.kts So, if your application is called positions, then the file would conventionally be named positions-dataserver.kts. Note, you will also need to declare your Data Server within the [runtime configuration](/server-modules/data-server/configuring-runtime/).

The simplest possible definition for Data Servers is a kotlin script file contains all the queries you create. These are wrapped in a single `dataServer` statement like the code below.

```kotlin
dataServer {
    query(INSTRUMENT_DETAILS)

    query(COUNTERPARTY)
}
```

We saw basic concepts and common usages of Data Servers in the [Developer Training](#) such as [specifying fields](/server-modules/data-server/basics/#specifying-fields), [derived fields](/server-modules/data-server/basics/#derived-fields), and [where clauses](/server-modules/data-server/basics/#where-clauses). Now we are exploring Data Servers advanced concepts like [client enriched data](#client-enriched-data), [ranged data server queries](#ranged-data-server-queries), [client side runtime options](#client-side-runtime-options), and [criteria matching](#criteria-matching).

### Client enriched data

In some scenarios, you might want to associate the results of Data Server queries with the user who initiated the queries. You can achieve this using the ```enrich``` feature, which enables an additional table or view join (including backwards joins). With this feature, you can provide user-specific values for each row, or even perform cell-level permissioning (for example, to hide cell values), depending on entitlements.

The `join` operation receives two parameters: 
- `userName` is the current user name subscribed to the query
- `row` is the pre-built query row

`hideFields` enables you to define a list of fields that will be hidden if certain conditions apply. Three parameters are provided: 
- `userName` the current user name subscribed to the query
- `row` the pre-built query `row`
- `userData` the table or view lookup result; this will be null if the lookup fails to find a record

The `fields` section defines what fields should be visible as part of the query. use this if you want to use a subset of fields from the enriched table or view, or if you want to declare your own derived fields.

The example below should help you to understand the functionality. Comments are included in the code to ease understanding.

```kotlin
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

Ranged Data Servers only cache a defined range within a table or view. This makes the Data Server more responsive and reduces resource requirements.

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

The `numKeyFields` property specifies the number of fields to use from an index. The fields are always selected in the order they are specified in the index.

### Client side runtime options

When a client initiates a subscription to a Data Server by sending a **DATA_LOGON** message, there are several options that can be specified such as: MAX_ROWS, MOVING_VIEW, CRITERIA_MATCH, FIELDS, ORDER_BY, REVERSE. 

None of these options is mandatory; you don't have to specify any to initiate a subscription. The features of the options are explained in details [here](/server-modules/data-server/advanced/#client-side-runtime-options).

### Criteria matching

Used to perform filters on the server, you can send a Groovy expression as part of your Data Server request for client-side filtering. Criteria matching supports Groovy expressions and some common expressions. All expressions must return a boolean value (`true` or `false`). You can mix and match both common expressions and custom groovy expressions using the && (logical AND) and || (logical OR) boolean operators. 

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

#### Exercise 3.1 Enriching ALL_TRADES Data Server query

:::info ESTIMATED TIME
30 mins
:::

We are enriching ALL_TRADES Data Server query to improve the users experience. We are deriving a field on our query by bringing the user's favourite trades into the context.

To do that, create a table *FAVOURITE_TRADE* with the fields TRADE_ID and USER_NAME, as well as an index over the USER_NAME to be able to use the `byUserName` function over the FavouriteTrade DAO. Finally, create a derived field called "IS_FAVOURITE" to show whether the Trade is favourite or not.

:::tip
Inside the enrich block, after the join, the derived field definition should look like this
```kotlin
derivedField("IS_FAVOURITE", BOOLEAN) { row, favourite ->
    row.tradeId == favourite?.tradeId
}
```
:::

<!--
Answer is pretty much here: http://localhost:8080/server-modules/data-server/examples/#enriching-query
-->


## Advanced request servers

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI.

:::caution Request Servers are different from Data Servers
Request Servers will reply with a single response. Once the response is received, the transaction is over (unlike a [Data Server](/server-modules/data-server/basics), which stays connected to the client and pushes updates).
:::

Request Servers have other features distinct from a Data Server, such as allowing one-to-many joins, and even completely custom request servers for serving up non-linear data (e.g. sets of disjointed data to serve up to a report).

```kotlin
requestReplies {
  requestReply("TRADE", TRADE_VIEW) {
    permissioning {
      permissionCodes = listOf("TRADER", "SUPPORT")
      auth(mapName = "ENTITY_VISIBILITY") {
        TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
}
```

Request Servers are conventionally configured in the file _application-name_**-reqrep.kts**. This file should be in the _application-name_-script-config module. So, if your application is called **positions**, the file would be named **positions-reqrep.kts**.

You should also check the Request Server component in your application's system-processes and service-definition files, as described in the [Configuring runtime](/server-modules/request-server/configuring-runtime) page.

We can add some precision using `request` and `reply` blocks within a `requestReply` statement. When defining a `request` block, you must define at least one primary key or index. In the example below, the fields `ALTERNATE_TYPE` AND `INSTRUMENT_CODE` together form the primary key.


```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {
        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```
Note the following:
- When you do not define a `request` block, the primary key for the table or view is used as the default request field.
- When you do not define a `reply block`, all the fields will be returned.

As Data Servers, using Request Servers you can also [specify derived fields](/server-modules/request-server/basics/#specifying-derived-fields), [use an index](/server-modules/request-server/basics/#using-an-index), and add [where blocks](/server-modules/request-server/basics/#where-block). Now we are exploring Request Servers advanced concepts like [Pre-processing the request](#pre-processing-the-request), [Limit the number of rows returned](#limit-the-number-of-rows-returned), [Timeout](#timeout), [Ranges](#ranges), and [Custom Request Servers](#custom-request-servers).

### Pre-processing the request

Request Server scripts can optionally transform a request parameter’s value using `withTransformation`. This takes two inputs:
* the request parameter’s value (which is nullable)
* the full request message

In the example below, `withTransformation` is used twice.

* If the ALTERNATE_TYPE parameter value is null, then the Request Server will use "UNKNOWN" by default.
* If the ALTERNATE_TYPE parameter has the value "RIC", then the transformation block will use the value of INSTRUMENT_CODE from the request. Otherwise, it will assign it the value "NOT_RIC" before making the database lookup. 

```kotlin {5,8}
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE withTransformation { type, _ ->
                type?.toUpperCase() ?: "UNKNOWN"
            }
            INSTRUMENT_CODE withTransformation { type, set ->
                val value = if (set.fields["ALTERNATE_TYPE"].toString().toUpperCase() == "RIC") {
                    type
                } else {
                    "NOT_RIC"
                }
                value
            } withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

### Limit the number of rows returned

You can limit the number of rows returned using the property `rowReturnLimit`. In this example, we limit it to 2.

```kotlin {4}
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {

        rowReturnLimit = 2

        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

### Timeout

You can specify a timeout (in seconds) for a Request Server using the property `timeout`. In this example, we set a timeout of 10 seconds.

```kotlin {4}
requestReplies {
    requestReply("QUICK_INSTRUMENT", INSTRUMENT_DETAILS) {

        timeout = 10

        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

### Ranges

You can specify ranges from the client of the requestReply server by postfixing the request parameter names with _FROM and _TO. The example below shows a client building a GenesisSet request based upon the requestReplies defined from previous example. This example stipulates a price range between 1,000 and 10,000. Leaving out FROM will define a top-end range, leaving out TO will define a bottom-end range. 


```kotlin
    // client building request  
    val request = genesisSet {
    
        "DETAILS" with genesisSet {
            "LAST_TRADED_PRICE_FROM" to 1_000
            "LAST_TRADED_PRICE_TO" to 10_000
        }
    }

    sendRequest(request) // details of sending request hidden for brevity
```
Note that ranges that are not based on indexes perform more slowly than those that are.


### Custom Request Servers

By defining your own Request Servers, you have maximum flexibility. You can specify any class for the input and output, similar to Event Handlers. For the request, optional fields should have a default value in the primary constructor. You cannot use native Kotlin classes. You should wrap these in custom input and output classes.

It is recommended to locate your classes within the messages module of your application. Here, we place all the custom message types for our application. You will need to ensure that the script-config module has a dependency on the messages module.

```xml
<dependency>
    <groupId>your.group</groupId>
    <artifactId>your-artifact</artifactId>
    <version>${project.version}</version>
    <scope>provided</scope>
</dependency>
```

The `requestReply` code blocks in can be as simple or complex as your requirements. They are useful, for example, if you want to request data from a number of different tables and views that are not related. By nesting and joining all the relevant data in your `requestReply` statement, you create your own metadata for the Request Server, so it can then be used anywhere in the module.

In this example, we define two data classes; Hello and World. We use these to create a Hello World request:

```kotlin
data class Hello(val name: String)
data class World(val message: String)

requestReply<Hello, World>("HELLO_WORLD") {
    replySingle { hello: Hello ->
        World("Hello ${hello.name}")
    }
}
```

We can also check who made the request by accessing the `userName` property:

```kotlin
requestReply<Hello, World>("HELLO_WORLD_CHECK") {
    replySingle { hello: Hello ->
        when (userName) {
            hello.name -> World("Hello ${hello.name}")
            else -> World("You're not ${hello.name}!")
        }
    }
}
```

Futher details and examples can be found [here](/server-modules/request-server/advanced/#custom-request-servers).

#### Exercise 3.2 ALL_COUNTERPARTIES in Request Server

:::info ESTIMATED TIME
30 mins
:::

We can presume the Counterparty table does not change so much, so we would not have to be connected to the client to get recent updates. Therefore, it is worth moving ALL_COUNTERPARTIES from Data Servers to Request Servers.

I order to apply the knowledge you got recently, limit the number of rows returned to 20 and set a timeout of 10 seconds.