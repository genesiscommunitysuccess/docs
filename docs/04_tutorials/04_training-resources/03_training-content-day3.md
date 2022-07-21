---
id: training-content-day3
title: Day 3
sidebar_label: Day 3
sidebar_position: 5

---
In this day we are covering:

- [Views](#views)
- [Automated testing](#automated-testing)​
- [Calculated data](#calculated-data) and [Consolidators](#consolidators)
- [UI configuring](#ui-configuring)

## Views

Views are the genesis equivalent of SQL select queries. Unlike [tables](/reference/developer/api/database/concepts/data-structure/tables/), views do not have any data of 
their own, but present a view based on one or more tables. A view always starts with a single table, the root table.
Other tables can be joined onto the root table to present composite data. 

### Definition

Views are defined in the `-view-dictionary.kts` files inside the folder *server\jvm\ -config\src\main\resources\cfg* as discussed 
[here](/creating-applications/defining-your-application/data-model/views/views-define/).

### Read-only

Due to their composite nature, views are inherently read-only. You cannot modify a record in a view. The only way
to change the data is to change the underlying table(s). 

### Root table

A view always has a root table, this is the most important table in the view. It is the starting point of the join
operations and the view will derive its indices from the root table.

### Types of view

Depending on the view definition, a different type of view will be created.

#### Cardinality

A view's cardinality tells us how many view records will be returned for every record in the root table. 

- If a view can 
return a maximum of 1 record for each record in the root table, the view has single cardinality. 
- If a view can 
return multiple records for each record in the root table, the view has multi cardinality. 

The cardinality depends on the joins; a view with no joins, or only one-to-one joins, will be single 
cardinality, all others will be multi cardinality

|                                        | Single Cardinality <br/>  View | Multi Cardinality<br/> View |
|----------------------------------------|--------------------------------|-----------------------------|
| Unique index in root table             | Unique index                   | Non-unique index            |
| Non-unique index in root table         | Non-unique index               | Non-unique index            |
| Supports database read operations      | ✔️                             | ✔️                          |
| Supports database subscribe operations | ✔️                             | ❌                           |
| Supports backwards joins               | ✔️                             | ❌                           |

#### Parameterised views

For some views, the joins are defined as input parameters, rather than on a field in another table or a constant. When 
that happens a view is considered to be parameterised. Parameterised views can not be accessed without these parameters.
Parameterised views can be both single and multi cardinality.

### Indices on views

Views do not have their own indices, however, these are derived from the root table. A view will always share the 
primary key of the root table. It will also share any index from which at least the first field is included in the 
view. Subsequent fields are only included in the view's index until the first missing field. Unique indices from the 
root table will only be unique if all fields are included.

### Entities

During code generation, [view](/creating-applications/defining-your-application/data-model/views/views-define/) and [index entities](/reference/developer/api/database/how-to/data-types/indices/) will be generated from the definitions in your application's **view-dictionary.kts** file. The name of each entity will be the same as the definition, but it is converted from snake case to camel case; for example, VIEW_NAME becomes ViewName.

The generated entities are kotlin data classes and can be built using the primary constructor. Just before the object is built, it is validated to make sure all required fields have been set.

### Usage

When you set up a data model, it implies relationships between tables. For example, a TRADE has a COUNTERPARTY_ID and an INSTRUMENT_ID. That means it has a relationship with the COUNTERPARTY and INSTRUMENTS tables.

Views enable you join related tables to create a single holistic view.

They are a lot more powerful than this in practice; they underpin many Genesis components that read data from the database in real time or in static form.

The example below creates a view called `TRADE_VIEW`, which joins the `TRADE` table to the `INSTRUMENT` table. Edit *–view-dictionary.kts* file and add the view on the TRADE table​

```kotlin
views {

  view("TRADE_VIEW", TRADE) {

    joins {
      joining(INSTRUMENT) {
        on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
      }
    }

    fields {
      TRADE.allFields()

      INSTRUMENT.NAME withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"
    }
  }
}
```
Run **alpha-config:assemble** to make the view ready for use, then add it to the data server:​

Now go to the Data Server definition (inside the **-script-config** module). Replace the `ALL_TRADES` query in the Data Server with the new `TRADE_VIEW`.

```kotlin
dataServer {​
     query("ALL_TRADES", TRADE_VIEW)​
}​
```

:::tip
In the example above, you are exposing a view through a data server query. It's also possible to inject a View into a request server or even in your event handler code, making it easier to access complex data from multiple tables in your Kotlin or Java code. Look at package global.genesis.gen.view.repository.*. 


:::

Run **alpha-deploy:deployConfig** and test the view with Postman or Console.​

### Try yourself

Extend the **TRADE_VIEW** to connect TRADE to COUNTERPARTY and INSTRUMENT:
1. Add the INSTRUMENT_ID and COUNTERPARTY_ID into TRADE table​.
2. Add the respective joins​.
3. Then, instead of taking all fields from TRADE, use only: PRICE, QUANTITY, TIMESTAMP, DIRECTION, TRADE_ID​.
4. Test it

## Extending our application further
Moving on, for our app to be able to keep positions based on the trades, we need to extend our data model as the next step.

### Adding new fields​

Let´s add new fields to Trade table​. 

```kotlin
field("SIDE", type = STRING)​
field("TRADE_DATE", type = DATE)​
field("ENTERED_BY", type = STRING)​
field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))
```

```kotlin
table (name = "TRADE", id = 2000) {
    ...
    SIDE
    TRADE_DATE
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

And new fields to create the POSITION and INSTRUMENT_PRICE tables

```kotlin
field("POSITION_ID", type = STRING)​
field("NOTIONAL", type = DOUBLE)​
field("LAST_PRICE", type = DOUBLE)​
field("VALUE", type = DOUBLE)​
field("PNL", type = DOUBLE)​
```

When you finish, remember to run *genesis-generated-fields*.

### Extending Trade and adding Position table​

Add the new fields into the TRADE table​.

And then create the POSITION and INSTRUMENT_PRICE tables​.

```kotlin
table(name = "POSITION", id = 2003) {
    sequence(POSITION_ID, "PS") //autogenerated sequence
    INSTRUMENT_ID not null
    COUNTERPARTY_ID
    QUANTITY
    NOTIONAL
    VALUE
    PNL

    primaryKey {
        POSITION_ID
    }
    indices {
        unique {
            INSTRUMENT_ID
        }
        nonUnique {
            COUNTERPARTY_ID
        }
    }
}
```

```kotlin
table(name = "INSTRUMENT_PRICE", id = 2004) {
    INSTRUMENT_ID
    LAST_PRICE
    primaryKey {
        INSTRUMENT_ID
    }
}
```

When you finish, remember to  run *genesis-generated-dao​* and *genesisproduct-assemble*.​

:::tip
As we previously generated the fields, autocompletion helps you to define the tables more quickly, and with fewer errors. Also note that Genesis provides several autogenerated primary keys: **sequence**, **uuid**, **autoincrement**.
:::

### Automated Testing

So far we have been testing our work manually, using Genesis Console or some HTTP client.
Now the time has come to start writing some automated tests for our application.

Before doing tests, install the [FoundationDB](https://www.foundationdb.org/) locally to allow a proper database mocking.

Let's create a automated test that inserts and retrieves some data using Genesis' automated test support components, in summary:
* load data from a CSV file 
* retrieve data using [Genesis Database API](/reference/developer/api/database/overview/)


So, first, let's do the following:
1. Add the test implementation dependencies in the file **alpha\server\jvm\alpha-config\build.gradle.kts**
```kotlin
dependencies {
    ...
    testImplementation("global.genesis:genesis-dbtest")
    testImplementation(project(path = ":alpha-dictionary-cache", configuration = "codeGen"))
}

description = "alpha-config"
```
2. Add a new test class to the *alpha-config* module (**alpha\server\jvm\alpha-config\src\test\kotlin**) called `TradeViewTest.kt`
3. Add an empty txt file *donotdelete.txt* to the genesis home folder (**alpha\server\jvm\alpha-config\src\test\resources\GenesisHome**). This folder is needed for automated tests. 
4. Add TEST_DATA.csv to a data folder (**alpha\server\jvm\alpha-config\src\test\resources\data**)
```csv
#INSTRUMENT
INSTRUMENT_ID,NAME
1,FOO.L
2,BAR.L
#COUNTERPARTY
COUNTERPARTY_ID,COUNTERPARTY_LEI,NAME,
1,335800A8HK6JBITVPA30,Test Ltd,
2,655FG0324Q4LUVJJMS11,Testing AG,
```
The directory tree should like below:

![](/img/dir-tree-alpha.png)

The test class should look like below:

### Test class setup
```kotlin
package global.genesis
import global.genesis.db.util.AbstractDatabaseTest
import global.genesis.db.util.TestUtil
import global.genesis.dictionary.GenesisDictionary
import global.genesis.gen.dao.Trade
import global.genesis.gen.view.entity.TradeView
import global.genesis.gen.view.repository.TradeViewAsyncRepository
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import org.joda.time.DateTime
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import javax.inject.Inject

class TradeViewTest : AbstractDatabaseTest() {
    @Inject
    lateinit var enhancedTradeViewRepository: TradeViewAsyncRepository
    override fun createMockDictionary(): GenesisDictionary = prodDictionary()

    @Before
    fun setup() {
        TestUtil.loadData(resolvePath("data/TEST_DATA.csv"), rxDb)
    }
    private fun buildTrade(tradeId: String, now: DateTime = DateTime.now()) =
        Trade.builder()
            .setTradeDate(now)
            .setCounterpartyId("2") // COUNTERPARTY_NAME = "Testing AG"
            .setInstrumentId("2")   // INSTRUMENT_NAME = "BAR.L"
            .setPrice(12.0)
            .setQuantity(100)
            .setSide("BUY")
            .setTradeId(tradeId)
            .build()

    @Test
    fun test_get_single_trade_by_id() = runBlocking {
        val now = DateTime.now()
        val trade = buildTrade("1L", now)
        rxEntityDb.insert(trade).blockingGet()
        val tradeView = enhancedTradeViewRepository.get(TradeView.ById("1"))
        if (tradeView != null) {
            assertEquals("Testing AG", tradeView.counterpartyName)
            assertEquals("FOO.L", tradeView.instrumentName)
            assertEquals(now, tradeView.tradeDate)
            assertEquals(12.0, tradeView.price)
            assertEquals((100).toInt(), tradeView.quantity)
            assertEquals("BUY", tradeView.side)
        }
    }

    @Test
    fun test_with_single_trade__use_getBulk() = runBlocking {
        val now = DateTime.now()
        val trade = buildTrade("1L", now)
        rxEntityDb.insert(trade).blockingGet()
        val tradeViewList = enhancedTradeViewRepository.getBulk().toList()
        assertEquals(1, tradeViewList.size)
        val tradeView = tradeViewList.first()
        assertEquals("Testing AG", tradeView.counterpartyName)
        assertEquals("BAR.L", tradeView.instrumentName)
        assertEquals(now, tradeView.tradeDate)
        assertEquals(12.0, tradeView.price)
        assertEquals((100).toInt(), tradeView.quantity)
        assertEquals("BUY", tradeView.side)
    }

    @Test
    fun test_get_multiple_trades() = runBlocking {
        rxEntityDb.insertAll(
            buildTrade("1T"),
            buildTrade("2T"),
            buildTrade("3T"),
            buildTrade("4T"),
            buildTrade("5T"),
        ).blockingGet()
        val count = enhancedTradeViewRepository.getBulk().count()
        assertEquals(5, count)
    }
}
```


## Calculated data

Derived fields are a useful way of providing calculated data, but note that you must only use fields that are in the view.

```kotlin
derivedField("CONSIDERATION", DOUBLE) {
    withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
        QUANTITY * PRICE
    }
}
```

Add this derivedField to your view now.​ The final view should be like this.
```kotlin
view("TRADE_VIEW", TRADE) {
    joins {
        joining(COUNTERPARTY) {
            on(TRADE.COUNTERPARTY_ID to COUNTERPARTY { COUNTERPARTY_ID })
        }
        joining(INSTRUMENT) {
            on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
        }
    }

    fields {
        TRADE.allFields()

        COUNTERPARTY.NAME withPrefix COUNTERPARTY
        INSTRUMENT.NAME withPrefix INSTRUMENT
        INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"

        derivedField("CONSIDERATION", DOUBLE) {
            withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
                QUANTITY * PRICE
            }
        }
    }
}
```

#### Try yourself

Let's add a new derived field in the TRADE_VIEW now. The derived field should display ASSET_CLASS from the INSTRUMENT join, and if this field is null or empty the view should display "UNKNOWN".

:::tip
After changing the files remember to run *assemble* and *deploy*
:::


## Consolidators

Consolidators perform data aggregation and calculations that can either be real-time, when used as a service, or on-demand, when used as objects. 

Consolidators follow a SQL-like syntax: 

```kotlin
consolidator(TRADE, ORDER) {
    select {
        ORDER {
            sum { price * quantity } into TOTAL_NOTIONAL
            count() into TRADE_COUNT
        }
    }
    groupBy { Order.ById(orderId) } 
}
```

In the above example, we aggregate data from the TRADE table into the ORDER table. We group by orderId and we count the number of trades and sum the notional. For further details, please see [here](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/consolidators/consolidators/).

Some features provided by Consolidators: 

- Type safety
- Declarative syntax
- comprehensive built-in logging

In our case, Consolidators are a good fit for consolidating a position table from trades. 

#### Define the position-keeping logic in the consolidator

Before defining the consolidator, we should insert some data in the *INSTRUMENT_PRICE* table using the command `SendIt`:

```csv
INSTRUMENT_ID,LAST_PRICE
1,10
```

As well as set the instrument_id field as not nullable in the TRADE and POSITION tables, as the consolidations will use it.

```kotlin
tables {
    table (name = "TRADE" ...) {
        ...
        INSTRUMENT_ID not null
        ...
    }

    table(name = "POSITION" ...) {
        ...
        INSTRUMENT_ID not null
        ...        
    }
    ...
}
```
When you finish, remember to run *genesis-generated-dao​* and *genesisproduct-assemble*.​

So, let's define a **alpha-consolidator.kts** file inside **alpha-script-config/src/main/resources/scripts**. This is where you define the consolidator logic.

The consolidator is going to increase or decrease the quantity for POSITION records, based on the TRADE table updates. It also needs to calculate the new notional.

```kotlin
import global.genesis.gen.config.tables.POSITION.NOTIONAL
import global.genesis.gen.config.tables.POSITION.QUANTITY
import global.genesis.gen.config.tables.POSITION.VALUE
import global.genesis.gen.dao.Position

consolidators {
    config {}
    consolidator("CONSOLIDATE_POSITIONS", TRADE_VIEW, POSITION) {
        config {
            logLevel = DEBUG
            logFunctions = true
        }
        select {
            sum {
                when(side) {
                    "BUY" -> when(tradeStatus) {
                        TradeStatus.NEW -> quantity
                        TradeStatus.ALLOCATED -> quantity
                        TradeStatus.CANCELLED -> 0
                    }
                    "SELL" -> when(tradeStatus) {
                        TradeStatus.NEW -> -quantity
                        TradeStatus.ALLOCATED -> -quantity
                        TradeStatus.CANCELLED -> 0
                    }
                    else -> null
                }
            } into QUANTITY
            sum {
                val quantity = when(side) {
                    "BUY" -> quantity
                    "SELL" -> -quantity
                    else -> 0
                }
                quantity * price
            } into VALUE
        }
        onCommit {
            val quantity = output.quantity ?: 0
            output.notional = input.price * quantity
            output.pnl = output.value - output.notional
        }
        groupBy {
            instrumentId
        } into {
            lookup {
                Position.ByInstrumentId(groupId)
            }
            build {
                Position {
                    instrumentId = groupId
                    counterpartyId = "2"
                    quantity = 0
                    value = 0.0
                    pnl = 0.0
                    notional = 0.0
                }
            }
        }
    }
}
```
#### Update the system files

##### Update the processes.xml file

As consolidators run on their own process, we need to add a new entry to **alpha-processes.xml** with the consolidator process definition.

```xml
<process name="ALPHA_CONSOLIDATOR">
    <groupId>ALPHA</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-consolidator</module>
    <package>global.genesis.pal.consolidator</package>
    <script>alpha-consolidator.kts</script>
    <description>Consolidates trades to calculate positions</description>
    <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
    <language>pal</language>
</process>
```
##### Update the service-definitions.xml file

This file lists all the active services for the Positions application. You can see entries have been added automatically when the data server, request server and event handler were generated.

Add a new entry to **alpha-service-definitions.xml** with the consolidator details. Remember the ports numbers should be free and, ideally, sequential.

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_CONSOLIDATOR" port="11002"/>
</configuration>
```

Run **assemble** and **deploy-genesisproduct-alpha** tasks to verify that the new process works as expected.

## UI configuring 

### Try yourself - add a new data grid
Add a data grid in the UI to display the Positions. Then insert some trades and check whether the Position grid is being updated accordingly, i.e., automatically updated by the Consolidator process.

:::tip
Remember to add a data server query around the POSITION table and use the ag-genesis-datasource component in the UI.
:::

<!-- Apart from building a front-end, as we did [before](/tutorials/training-resources/training-content-day2/#intro-to-ui) the application user interface can be configured in various aspects such as data distribution, using Request Servers for static (reference) data, and Data Servers for streaming real-time data. -->

<!-- 
### Request Servers

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI.

Request Servers will reply with a single response. Once the response is received, the transaction is over (unlike a [Data Server](/creating-applications/defining-your-application/user-interface/data-servers/data-servers/), which stays connected to the client and pushes updates).

Request Servers have other features distinct from a Data Server, such as allowing one-to-many joins, and even completely custom request servers for serving up non-linear data (e.g. sets of disjointed data to serve up to a report).

Here is the definition of a simple Request Server file.

```kotlin
  requestReply("TRADE", TRADE_VIEW) {
    permissioning {
      permissionCodes = listOf("TRADER", "SUPPORT")
      auth(mapName = "ENTITY_VISIBILITY") {
        TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
```

Request Servers are conventionally configured in the file _application-name_**-reqrep.kts**. This file should be in the _application-name_-script-config module.

So, if this case the application is called **alpha**, the file would be named **alpha-reqrep.kts** and will be kept in the path *server/jvm/alpha-script-config/src/main/resources/scripts*.

You should also check the Request Server component in your application's system-processes and service-definition files, as described in the [Configuring runtime](/creating-applications/defining-your-application/user-interface/request-servers/rs-configure-runtime/) page.

Let's make things really simple.
- A Request Server is a component that supplies static data to the front end of your application.
- You define your application's Request Reply in a kotlin script file.
- In this file, you define specific `requestReply` codeblocks, each of which is designed to supply different sets of data; this could be a table or view, or just a subset of the fields in a table or view.
- A `requestReply` can include a number of other subtleties, such as `where` clauses or ranges, so that you can create code that matches your precise requirements.
- If you use AppGen to build from your dictionary, then a basic kts file will be built automatically for you, covering all the tables and views in your data model. You can edit this file to add sophistication to the component.
- Otherwise, you can build your kts by defining each `requestReply` codeblock from scratch. 

#### Multiple Request Servers

Almost certainly, your application will need to have more than one `requestReply`. So, let us state the obvious and show you a file with two `requestReply` codeblocks. Again, each is the simplest kind you could possibly have.

```kotlin
requestReplies {
    requestReply(COUNTERPARTY)

    requestReply(INSTRUMENT_DETAILS)
}
```

#### Specifying fields on request and reply


With all those basic `requestReply` codeblocks we have seen so far, all the fields in the table are returned.

We can add some precision using `request` and `reply` blocks within a `requestReply` statement.

When defining a `request` block, you must define at least one primary key or index. In the example below, the fields `ALTERNATE_TYPE` AND `INSTRUMENT_CODE` together form the primary key.


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

#### Specifying derived fields

You can define derived fields to be included on the reply, where the input for the derived field is the reply entity. 

Derived fields cannot be used within a `where` block.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {
        derivedFields {
            derivedField("IS_USD", BOOLEAN) {
                tradedCurrency == "USD"
            }
        }
    }
}
```

#### Using an index

The example below uses an [index](/creating-applications/defining-your-application/user-interface/request-servers/rs-technical-details/#using-an-index) as the request definition. This provides additional indexing at the request level.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {
        request(INSTRUMENT_DETAILS.BY_ALTERNATE_TYPE_ALTERNATE_CODE)
    }
}
```

#### Where block

The `where` block enables you to specify the conditions for which data should be returned. The `where` block can take two optional parameters:
* instrumentDetails - this represents a row from the table or view
* parameters - this a GenesisSet that holds the parameters that are passed on the request; the parameters can be accessed by using the GenesisSet getters to access named parameters

In this contrived example below, the `where` block filters rows whose instrumentCode is not equal to "ALLL3" and the request parameter "ALTERNATE_TYPE" is either "RIC" or "BLOOMBERG". 
The row parameter represents the rows returned from the table or view defined at the top of the `requestReply` definition, in this case INSTRUMENT_DETAILS.

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        where { row, parameters ->
            "ALLL3" == row.instrumentCode &&                         
             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```

Note - You cannot use derived fields within a `where` block.

#### Try yourself

Let's add a new derivated field in the **alpha** application called *GOOD_USD_TRADE* where the currency should be USD and price greater than 10.

:::tip
After changing the files remember to run *assemble* and *deploy*
:::

-->