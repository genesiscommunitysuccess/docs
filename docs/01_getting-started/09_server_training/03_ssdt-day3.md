---
id: 03_ssdt-day3
title: Day three
sidebar_label: Day three
sidebar_position: 4

---
This day covers:

- [Advanced data servers​](#advanced-request-servers)
- [Advanced request servers](#advanced-request-servers)
- [ExcelToGenesis](#exceltogenesis)


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

We saw basic concepts and common usages of Data Servers in the [Developer Training](/getting-started/developer-training/training-intro/) such as [specifying fields](/server-modules/data-server/basics/#specifying-fields), [derived fields](/server-modules/data-server/basics/#derived-fields), and [where clauses](/server-modules/data-server/basics/#where-clauses). Now we are exploring Data Servers advanced concepts like [client enriched data](#client-enriched-data), [ranged data server queries](#ranged-data-server-queries), [client side runtime options](#client-side-runtime-options), and [criteria matching](#criteria-matching).

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

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI. As Data Servers, using Request Servers you can also [specify derived fields](/server-modules/request-server/basics/#specifying-derived-fields), [use an index](/server-modules/request-server/basics/#using-an-index), and add [where blocks](/server-modules/request-server/basics/#where-block).

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

Now we are exploring Request Servers advanced concepts like [Pre-processing the request](#pre-processing-the-request), [Limit the number of rows returned](#limit-the-number-of-rows-returned), [Timeout](#timeout), [Ranges](#ranges), and [Custom Request Servers](#custom-request-servers).

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

## ExcelToGenesis

All across the financial sector, you can find operational functions sitting in Excel workbooks. And this sometimes includes functions that are mission-critical. 

[ExcelToGenesis](/server-modules/integration/excel-to-genesis/excel-reference/#exceltogenesis) converts the Excel spreadsheet into the Genesis data model, which can then be used to generate a working server.

There are three mandatory [options](/server-modules/integration/excel-to-genesis/excel-reference/#options) to use ExcelToGenesis: -f the name of the worksheet you are going to convert; -n the name of the project (application) you want to create.; -t the start of the table id sequence (see note after the sample below).

```shell
ExcelToGenesis -f euc\\ demo\\ cash\\ mgmt.xlsx -n cash -t 10000
```

Each table is automatically given a unique numeric ID. Supply the opening sequence number, for example, 10000. Numeric IDs are useful because they enable you to change the name of a table without losing the data. By default, the conversion process will convert each separate worksheet into a table.

The conversion script turns Excel functions in the named workbook into Kotlin code. The most common [Excel functions](/server-modules/integration/excel-to-genesis/excel-functions/) are all covered. Moreover, the conversion creates a folder called `/home/core/run/_name_.cfg` where name is the application name specified in the script. This contains the default definitions to fields, tables, and views (i.e. `_name_-fields-dictionary.kts`, `_name_-tables-dictionary.kts`, `_name_-view-dictionary.kts`), and the data from each worksheet is extracted to a separate csv file.

#### Exercise 3.3 Using ExcelToGenesis

:::info ESTIMATED TIME
45 mins
:::

Let's do a quick exercise. We start with an Excel workbook. We finish with a simple but effective server that you can add a front end to.

First, create an Excel file (mgmt.xlsx) with one tab called 'Cash Mgmt Dashboard' and load the following data into it.

```csv
"ACCT_CODE","ACCOUNT_NAME","ACCOUNT_NUMBER","ACCOUNT_CURRENCY","AVAILABLE_BALANCE_DATE","PREVIOUS_CLOSE_BALANCE","EXPECTED_MARGIN_INFLOWS","EXPECTED_MARGIN_OUTFLOWS","NET_AVAILABLE_BALANCE","TBILLS_HOLDINGS","CURRENT_FUNDING_POSN","FUND_HOLDINGS_LEVEL","PERCENT_OF_FUNDS_ALL","SUGGESTED_ACTION","DEPOSIT_AMOUNT_ON_MAY_IN_PERCENT_HAIR_CUT_AND_MAX_PERCENT_ON_FUNDS","MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT","POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT","EXPECTED_BALANCE_AFTER_REDEMPTION_PER_DEPOSIT_CASH_ONLY_NO_TBILLS","EXPECTED_CASH_BALANCE_PERCENT"
"22HS002","HARRISON GEM DEBT TOTAL RET","400515-73293786","USD","2018-06-06T00:00",,"6324131.264","-710000.0","1.5792632929E8","0.0","0.0","0.0","0.0","DEPOSIT","1.26341063432E8","1.3646971152574575E8","0.0",,"0.0"
"24HS015","HARRISON GEM BOND","400515-73293684","USD","2018-06-06T00:00",,"940000.0","-1524265.8","1.4552071188E8","4.490730003118515E7","0.0","0.0","0.0","DEPOSIT","1.1641656950400001E8","3.827067500084964E8","4.490730003118515E7","3.0628408176E7","0.0079230701035628"
"21HS001","HARRISON GEM LOC DBT OLAY","400515-73294157","USD","2018-06-06T00:00",,"5870000.0","-3560000.0","1.5986032965E8","1.1378883589836652E9","0.0","1.860230439E7","0.006464116805936957","DEPOSIT","1.2788826372000001E8","2.662978900060171E8","1.3840962628601706E8","3.553206592999999E7","0.012347041512300127"
"31HS091","HARRISON GLOBAL HIGH YIELD BOND US FIXE","400515-73423766","USD","2018-06-06T00:00","2.818183719E7","0.0","-885648.28","9234858.05","0.0","0.0","2.256239879E7","0.023281613162053506","DEPOSIT","7387886.440000001","7.33792984052206E7","0.0","2732619.8899999987","0.0028197267404966907"
"21HS118","HARRISON GEM LOCAL CCY RATES","400515-74216790","USD","2018-06-06T00:00","8.7873232E7","0.0","-220000.0","6811542.99","1.9983200001186796E7","0.0","0.0","0.0","DEPOSIT","5449234.392000001","2.228452513942915E7","1.6835290747429147E7","1582308.5979999993","0.007029476743250574"
"30HS123","HARRISON-GB CORP BD (US SL)-AMEU","400515-74429794","USD","2018-06-06T00:00","3223323.0","0.0","0.0","7307726.11","0.0","0.0","85660.62000000011","6.451190070137826E-5","DEPOSIT","5846180.888","1.3136917620546082E8","0.0","1461545.4519999996","0.0011007050272339245"
"30HS056","HARRISON HIGH INCOME-EMD","400515-73294790","USD","2018-06-06T00:00","1.468687899E7","0.0","-320000.0","1.477901352E7","0.0","0.0","0.0","0.0","DEPOSIT","1.1823210816E7","4.3218194548963524E7","0.0","3275802.704","0.007503887450193767"
"21HS184","HARRISON GEM LOC DEBT EX-ASIA","400515-76690541","USD","2018-06-06T00:00","1.007845887E7","0.0","0.0","1.008958349E7","0.0","0.0","0.0","0.0","DEPOSIT","1023728.0723177514","1266863.4894932173","0.0","9065855.41768225","0.7084580886529274"
"37HS191","HARRISON GLB CORP FX T BD 2020","400515-77050130","USD","2018-06-06T00:00","62024.18","0.0","0.0","-176715.13","0.0","0.0","0.0","0.0","DEPOSIT","false","2.9759165768984433E7","0.0","-176715.13","-5.878793110603057E-4"
```
Then, follow the steps below.

- Do some up-front checks and edits to head off any obvious issues.
- Run the convertor. This creates your data model in Genesis format and creates data files in csv format.
- Check the fields, tables and views in the data model. Then make any necessary adjustments.
- Load another csv sample data to the database.
- Run a quick sequence of Genesis scripts to produce the files that contain the business logic and expose the endpoints.

That’s it. If you follow those steps, you'll have a working server, ready to be connected to a front end.

:::tip
The command to run the convertor is pretty much the one we presented here.
```shell
ExcelToGenesis -f euc\\ demo\\ cash\\ mgmt.xlsx -n cash -t 10000
```
:::

<!--
Answer is pretty much here: https://docs.genesis.global/secure/tutorials/excel-to-genesis/overview/
-->
