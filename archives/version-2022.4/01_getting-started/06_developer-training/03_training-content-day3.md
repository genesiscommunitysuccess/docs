---
id: training-content-day3
title: Day three
sidebar_label: Day three
sidebar_position: 5
---

<details>
  <summary>Day two recap</summary>
  <div>
    <div>Here are the main takeaways from <a href="/getting-started/developer-training/training-content-day2/">Day two</a>.</div>
    <li>We provided an introduction to UI, describing <a href="/getting-started/developer-training/training-content-day2/#web-components">Web Components</a> and <a href="/getting-started/developer-training/training-content-day2/#micro-front-ends">Micro front-ends</a>.</li>
    <li>The <a href="/getting-started/developer-training/training-content-day2/#genesis-packages">Genesis UI packages</a>​ were presented</li>
    <li>We created a user interface using the Micro front-end <a href="/getting-started/developer-training/training-content-day2/#entitymanagement">EntityManagement</a>.</li>
    <li>We <a href="/getting-started/developer-training/training-content-day2/#extending-our-initial-application">extended the application</a> by adding new tables and CRUD events.</li>
  </div>
</details>

This day covers:

- [Views](#views)
- [Automated testing](#automated-testing)​
- [Calculated data](#calculated-data) and [Consolidators](#consolidators)
- [UI configuring](#ui-configuring)

## Views

When you set up a data model, it implies relationships between tables. For example, a TRADE has a COUNTERPARTY_ID and an INSTRUMENT_ID. That means it has a relationship with the COUNTERPARTY and INSTRUMENTS tables.

Views enable you join related tables to create a single holistic view.

In short, Views are the genesis equivalent of SQL select queries. Unlike [tables](../../../database/data-structures/tables/), views do not have any data of their own, they are read-only, but present a view based on one or more tables. 

A view always starts with a single table, the root table. Other tables can be joined onto the root table to present composite data. 

Views are very powerful and in this training we're going to cover just the basics. When you have a chance, try to look at the [documentation](../../../database/fields-tables-views/views/).

### Entities

During code generation, [view](../../../database/data-structures/views/) and [index entities](../../../database/data-structures/indices/) will be generated from the definitions in your application's **view-dictionary.kts** file. The name of each entity will be the same as the definition, but it is converted from snake case to camel case; for example, VIEW_NAME becomes ViewName.

The generated entities are kotlin data classes and can be built using the primary constructor (so you can also import Views in your Java/Kotlin code as well). Just before the object is built, it is validated to make sure all required fields have been set.

### Usage

Create an **alpha-view-dictionary.kts** file inside the folder **server\jvm\alpha-config\src\main\resources\cfg**.

The example below creates a view called `TRADE_VIEW`, which joins the `TRADE` table to the `INSTRUMENT` table. Edit the **alpha–view-dictionary.kts** file and add a view on the TRADE table:

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

      INSTRUMENT.INSTRUMENT_NAME
      INSTRUMENT.MARKET_ID withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"
    }
  }
}
```

:::info `withPrefix` and `withAlias`
`withPrefix` adds a prefix to the standard field name. For example, `INSTRUMENT.MARKET_ID withPrefix SYMBOL` becomes `SYMBOL_MARKET_ID`.

`withAlias` gives the field an alternative name for the view.

More info [here](../../../database/fields-tables-views/views/views-basics/#overriding-a-field-name).
:::

Now go to the Data Server definition (open **alpha-dataserver.kts**). Replace the `ALL_TRADES` query in the Data Server with the new `TRADE_VIEW`.

```kotlin
dataServer {​
     query("ALL_TRADES", TRADE_VIEW)​
     ...
}​
```

:::tip
In the example above, you are exposing a view through a Data Server query. It's also possible to inject a view into a Request Server or even your Event Handler code. This makes it easier to access complex data from multiple tables in your Kotlin or Java code. Look at **package global.genesis.gen.view.repository**. 


:::

Run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process), and test the view with Postman or Console.​

### Exercise 3.1: using views
:::info ESTIMATED TIME
30 mins
:::

Extend the **TRADE_VIEW** to connect TRADE to COUNTERPARTY:
1. Add the respective join (as we did with `INSTRUMENT`).​
2. Add the field `COUNTERPARTY.COUNTERPARTY_NAME`.
3. Test it.

## Extending our application further
Moving on, for our app to be able to keep positions based on the trades, we now need to extend our data model.

### Adding new fields​

Let´s add new fields to the Trade table​. 

```kotlin
field("TRADE_DATE", type = DATE)​
field("ENTERED_BY", type = STRING)​
field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))
```

```kotlin
table (name = "TRADE", id = 2000) {
    ...
    TRADE_DATE
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

And new fields to create the POSITION and INSTRUMENT_PRICE tables:

```kotlin
field("POSITION_ID", type = STRING)​
field("NOTIONAL", type = DOUBLE)​
field("LAST_PRICE", type = DOUBLE)​
field("VALUE", type = DOUBLE)​
field("PNL", type = DOUBLE)​
```

When you finish, remember to run [genesis-generated-fields](../../../getting-started/developer-training/training-content-day1/#generatefields).

### Extending the Trade table and adding a Position table

1. Add the new fields into the TRADE table.

2. Then create the POSITION and INSTRUMENT_PRICE tables.

```kotlin
table(name = "POSITION", id = 2003) {
    sequence(POSITION_ID, "PS") //autogenerated sequence
    INSTRUMENT_ID not null
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

When you finish, remember to run [genesis-generated-dao​](../../../getting-started/developer-training/training-content-day1/#generatedao) and [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process).​

:::tip
As we previously generated the fields, autocompletion helps you to define the tables more quickly, and with fewer errors. Also note that Genesis provides several autogenerated primary keys: **sequence**, **uuid**, **autoIncrement**.
:::

## Automated testing

So far we have been testing our work manually, using Genesis Console or some HTTP client. Now the time has come to start writing some automated tests for our application. We are going to test our [TradeView](../../../getting-started/developer-training/training-content-day3/#usage) and the Trade insert method we [created](../../../getting-started/developer-training/training-content-day1/#event-handler).

### Configuration

To test our classes we need to mock the database, as there are integrations and configurations managed by Genesis behind the scenes. To avoid any additional installation locally we will use [H2 in-memory database](https://www.h2database.com/), changing the **server/jvm/build.gradle.kts** configuration for the tests tasks like the code below. You already have the configuration needed if you cloned the Developer Training starting repo from [here](https://github.com/genesiscommunitysuccess/devtraining-seed).

```kotlin {6-10} title='server/jvm/build.gradle.kts'
...
subprojects  {
	...
	tasks {
		...
		test {
            systemProperty("DbLayer", "SQL")
            systemProperty("DbHost", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
            systemProperty("DbQuotedIdentifiers", "true")
        }  
	}
	...
}
...
```

### Adding Testing: AlphaTradeViewTest

Let's create an automated test that inserts and retrieves some data using the platform's automated test support components. We are extending the class [AbstractDatabaseTest](../../../operations/testing/integration-testing/#abstractdatabasetest) to allow a proper integration testing, as well as using the [TradeView](../../../getting-started/developer-training/training-content-day3/#usage) we created to assert results. In summary, the new test will:
* load the necessary data inputs from a CSV file 
* retrieve data using [Genesis Database API](/database/)

So, first, let's do the following:
1. Add a new test class to the **alpha-config** module (**alpha\server\jvm\alpha-config\src\test\kotlin\global\genesis**) called `AlphaTradeViewTest.kt`
2. Add TEST_DATA.csv to a data folder (**alpha\server\jvm\alpha-config\src\test\resources\data**)

```csv
#INSTRUMENT
INSTRUMENT_ID,INSTRUMENT_NAME
1,FOO.L
2,BAR.L
#COUNTERPARTY
COUNTERPARTY_ID,COUNTERPARTY_LEI,COUNTERPARTY_NAME,
1,335800A8HK6JBITVPA30,Test Ltd,
2,655FG0324Q4LUVJJMS11,Testing AG,
```
The directory tree should like this:

![](/img/dir-tree-alpha-v2.png)

The test class should look like below:

```kotlin title='AlphaTradeViewTest.kt'
package global.genesis
import global.genesis.db.util.AbstractDatabaseTest
import global.genesis.db.util.TestUtil
import global.genesis.dictionary.GenesisDictionary
import global.genesis.gen.dao.Trade
import global.genesis.gen.dao.enums.Direction
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

class AlphaTradeViewTest : AbstractDatabaseTest() {
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
            .setDirection(Direction.BUY)
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
            assertEquals(12.0, tradeView.price, 0.0)
            assertEquals((100).toInt(), tradeView.quantity)
            assertEquals(Direction.BUY, tradeView.direction)
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
        assertEquals(12.0, tradeView.price, 0.0)
        assertEquals((100).toInt(), tradeView.quantity)
        assertEquals(Direction.BUY, tradeView.direction)
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

You can run the test from IntelliJ by right-clicking on the test class and selecting `Run AlphaTradeViewTest` or from the command line.

```shell title='Running AlphaTradeViewTest from the command line'
./gradlew :genesisproduct-alpha:alpha-config:test --tests "global.genesis.AlphaTradeViewTest"
```

### Adding Testing: AlphaEventHandlerTest

Now we will add a new automated test for checking the Trade insert method we [created](../../../getting-started/developer-training/training-content-day1/#event-handler). We are extending the class [AbstractGenesisTestSupport](../../../operations/testing/integration-testing/#abstractgenesistestsupport) to allow a proper integration testing. In summary, the new test will:
* load the necessary data inputs from a CSV file 
* use the network API [Genesis MessageClient](../../../database/api-reference/network-api/#genesismessageclient) to call the Event Handler methods.
* retrieve data using [Genesis Database API](/database/)

So, first, let's do the following:
1. Add a new test class to the **alpha-script-config** module (**alpha\server\jvm\alpha-script-config\src\test\kotlin\global\genesis**) called `AlphaEventHandlerTest.kt`.
2. Add TEST_DATA.csv to a data folder (**alpha\server\jvm\alpha-script-config\src\test\resources\data**)

```csv
#INSTRUMENT
INSTRUMENT_ID,INSTRUMENT_NAME
1,FOO.L
2,BAR.L
#COUNTERPARTY
COUNTERPARTY_ID,COUNTERPARTY_LEI,COUNTERPARTY_NAME
1,335800A8HK6JBITVPA30,Test Ltd
2,655FG0324Q4LUVJJMS11,Testing AG
#TRADE
TRADE_ID,COUNTERPARTY_ID,INSTRUMENT_ID,QUANTITY,PRICE,SYMBOL,DIRECTION,TRADE_DATE,ENTERED_BY,TRADE_STATUS
00000000001TRSP0,1,1,10,641.927,BRL,BUY,1636987969135,JaneDee,NEW
00000000002TRSP0,1,1,3,642.927,BRL,SELL,1636987969135,JaneDee,NEW
00000000003TRSP0,2,2,10,643.927,BRL,BUY,1636987969135,JaneDee,NEW
00000000004TRSP0,2,2,7,644.927,BRL,SELL,1636987969135,JaneDee,NEW
00000000005TRSP0,2,2,70,0.0,BRL,SELL,1636987969135,JaneDee,NEW
```
The directory tree should like this:

![](/img/dir-tree-alpha-script-config.png)

The test class should look like below:

```kotlin title='AlphaEventHandlerTest.kt'
package global.genesis

import global.genesis.commons.model.GenesisSet
import global.genesis.db.DbRecord
import global.genesis.gen.dao.Trade
import global.genesis.gen.dao.enums.Direction
import global.genesis.gen.dao.enums.TradeStatus
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import global.genesis.testsupport.AbstractGenesisTestSupport
import global.genesis.testsupport.GenesisTestConfig
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import org.joda.time.DateTime
import org.junit.Before
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class AlphaEventHandlerTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        packageName = "global.genesis.eventhandler.pal"
        genesisHome = "/GenesisHome/"
        scriptFileName = "alpha-eventhandler.kts"
        parser = { it }
        initialDataFile = "data/TEST_DATA.csv"
        addAuthCacheOverride("ENTITY_VISIBILITY")
    }
) {
    override fun systemDefinition(): Map<String, Any> = mapOf("IS_SCRIPT" to "true")

    @Before
    fun setUp() {
        authorise("ENTITY_VISIBILITY", "1", "JaneDee")

        val trader = DbRecord.dbRecord("RIGHT_SUMMARY") {
            "USER_NAME" with "JaneDee"
            "RIGHT_CODE" with "INSERT_TRADE"
        }
        rxDb.insert(trader).blockingGet()
    }

    @Test
    fun `test insert trade`(): Unit = runBlocking {
        val message = Event(
            details = Trade {
                counterpartyId = "1"
                instrumentId = "2"
                direction = Direction.BUY
                price = 1.123
                quantity = 1000
                enteredBy = "JohnDoe"
                tradeDate = DateTime.now()
            },
            messageType = "EVENT_TRADE_INSERT",
            userName = "JaneDee"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        result.assertedCast<EventReply.EventAck>()
        val trades = entityDb.getBulk<Trade>().toList()
        val trade = trades[5]
        assertNotNull(trade)
        assertEquals(6, trades.size)
        assertEquals("1", trade.counterpartyId)
        assertEquals("2", trade.instrumentId)
        assertEquals(TradeStatus.NEW, trade.tradeStatus)
        assertEquals(Direction.BUY, trade.direction)
        assertEquals(1.123, trade.price)
        assertEquals(1000, trade.quantity)
    }
}
```

You can run the test from IntelliJ by right-clicking on the test class and selecting `Run AlphaEventHandlerTest` or from the command line.

```shell title='Running AlphaTradeViewTest from the command line'
./gradlew :genesisproduct-alpha:alpha-script-config:test --tests "global.genesis.AlphaEventHandlerTest"
```

#### Find out more about testing

You can find out more about testing by double-checking our [Component testing](../../../operations/testing/component-testing/), [Integration testing](/operations/testing/integration-testing/), and [Unit testing](../../../operations/testing/unit-testing/) pages. 

Additionally, you can see more testing examples by looking at the complete source code of this training available on [GitHub](https://github.com/genesiscommunitysuccess/devtraining-alpha). 

## Calculated data

Derived fields are a useful way of providing calculated data, but note that you must only use fields that are in the view.

```kotlin
derivedField("CONSIDERATION", DOUBLE) {
    withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
        QUANTITY * PRICE
    }
}
```

Add this `derivedField` to your view now. The final view should look like this.
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

        COUNTERPARTY.COUNTERPARTY_NAME
        INSTRUMENT.INSTRUMENT_NAME
        INSTRUMENT.MARKET_ID withPrefix INSTRUMENT
        INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"

        derivedField("CONSIDERATION", DOUBLE) {
            withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
                QUANTITY * PRICE
            }
        }
    }
}

```

### Exercise 3.2: derived fields
:::info ESTIMATED TIME
20 mins
:::

Let's add a new derived field in the TRADE_VIEW now. The derived field should display ASSET_CLASS from the INSTRUMENT join. If this field is null or empty, the view should display "UNKNOWN".

:::tip
After changing the files, remember to run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process).
:::


## Consolidators

Consolidators perform data aggregation and calculations that can either be:

- real-time - when used as a service
- on-demand - when used as objects 

Consolidators follow an SQL-like syntax: 

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

In the above example, we aggregate data from the TRADE table into the ORDER table. We group by orderId and we count the number of trades and sum the notional. For further details, see [here](../../../server/consolidator/introduction/).

Some features provided by Consolidators: 

- Type safety
- Declarative syntax
- comprehensive built-in logging

In our case, Consolidators are a good fit for consolidating a position table from trades. 

#### Define the position-keeping logic in the consolidator

Before defining the Consolidator, we should insert some data in the `INSTRUMENT_PRICE` table using the command [`SendIt`](../../../operations/commands/server-commands/#sendit-script). To do that, let's run server commands directly from a command line using PowerShell (or Windows Command Prompt) as we did [before](../../../getting-started/developer-training/training-content-day1/#running-server-commands).

:::tip
To insert new data properly, we need to create 2 additional files called [COUNTERPARTY.csv](https://raw.githubusercontent.com/genesiscommunitysuccess/devtraining-alpha/main/server/jvm/alpha-site-specific/src/main/resources/data/COUNTERPARTY.csv) and [INSTRUMENT.csv](https://raw.githubusercontent.com/genesiscommunitysuccess/devtraining-alpha/main/server/jvm/alpha-site-specific/src/main/resources/data/INSTRUMENT.csv) and send it to genesis. this will populate the other two tables you will need.
:::


From the command line opened, in the */tmp* folder, save this csv as INSTRUMENT_PRICE.csv using your favourite editor (i.e. [vim](https://www.vim.org/) or [nano](https://www.nano-editor.org/)):
```csv
INSTRUMENT_ID,LAST_PRICE
1,10
```

Then go to the folder where the csv is located and run:
```shell
SendIt -t INSTRUMENT_PRICE -f INSTRUMENT_PRICE.csv
```

Make sure you settled the INSTRUMENT_ID field as not nullable in the TRADE and POSITION tables, as the consolidations will use it.

```kotlin {4,10}
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

Add the query ALL_POSITIONS in the **alpha-dataserver.kts** file.

```kotlin {3}
dataServer {
    ...
    query("ALL_POSITIONS", POSITION)
}
```

When you finish, remember to run [genesis-generated-dao​](../../../getting-started/developer-training/training-content-day1/#generatedao) and [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process).​

So, let's define a **alpha-consolidator.kts** file inside **alpha-script-config/src/main/resources/scripts**. This is where you define the consolidator logic.

The Consolidator is going to increase or decrease the quantity for POSITION records, based on the TRADE table updates. It also needs to calculate the new notional.

```kotlin
import global.genesis.gen.config.tables.POSITION.NOTIONAL
import global.genesis.gen.config.tables.POSITION.QUANTITY
import global.genesis.gen.config.tables.POSITION.VALUE
import global.genesis.gen.dao.Position
import global.genesis.gen.dao.enums.Direction

consolidators {
    config {}
    consolidator("CONSOLIDATE_POSITIONS", TRADE_VIEW, POSITION) {
        config {
            logLevel = DEBUG
            logFunctions = true
        }
        select {
            sum {
                when(direction) {
                    Direction.BUY -> when(tradeStatus) {
                        TradeStatus.NEW -> quantity
                        TradeStatus.ALLOCATED -> quantity
                        TradeStatus.CANCELLED -> 0
                    }
                    Direction.SELL -> when(tradeStatus) {
                        TradeStatus.NEW -> -quantity
                        TradeStatus.ALLOCATED -> -quantity
                        TradeStatus.CANCELLED -> 0
                    }
                    else -> null
                }
            } into QUANTITY
            sum {
                val quantity = when(direction) {
                    Direction.BUY -> quantity
                    Direction.SELL -> -quantity
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

As Consolidators run on their own process, we need to add a new entry to **alpha-processes.xml** with the definition of the Consolidator process.

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

Add a new entry to **alpha-service-definitions.xml** with the consolidator details. Remember the port numbers should be free and, ideally, sequential.

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_CONSOLIDATOR" port="11002"/>
</configuration>
```

Run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process) to verify that the new process works as expected.

## UI configuring 

Let's add a grid in the UI to display the Positions. We could use [Entity Management](../../../getting-started/developer-training/training-content-day2/#entitymanagement) again, but here we will use Grid Pro in `@genesislcap/foundation-zero-grid-pro` [Genesis package](../../../getting-started/developer-training/training-content-day2/#genesis-packages) presented in [Day 2](../../../getting-started/developer-training/training-content-day2/), as this approach offers more flexibility to customise the HTML and CSS.

First, open the file **home.styles.ts** and add the code below.

```ts
.split-layout {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
}

.top-layout {
height: 90%;
display: flex;
flex-direction: row;
}

.positions-card {
flex: 1;
margin: calc(var(--design-unit) * 3px);
}

.card-title {
padding: calc(var(--design-unit) * 3px);
background-color: #22272a;
font-size: 13px;
font-weight: bold;
}
```

Open the file **home.ts** and import *Grid Pro* and *Connect*. Then, add them as attributes to the Home class.

```ts {2,3,8,10}
...
import {ZeroGridPro} from '@genesislcap/foundation-zero-grid-pro';
import {Connect} from '@genesislcap/foundation-comms';
...
export class Home extends FASTElement {
    @observable columns: any = COLUMNS;

    public positionsGrid!: ZeroGridPro;

    @Connect connection: Connect;

    constructor() {
      super();
    }
}
```

Finally, go to the file **home.template.ts** and import the required components. Then, add a constant holding the Position columns, and some `<div>`s to format the final HTML.

```html {1,2,4-11,14,15,23-37}
import {html, repeat, when, ref} from '@microsoft/fast-element';
import type {Home} from './home';

export const positionsColumnDefs: any[] = [
    {field: 'POSITION_ID', headerName: 'Id'},
    {field: 'INSTRUMENT_ID', headerName: 'Instrument'},
    {field: 'QUANTITY', headerName: 'Quantity'},
    {field: 'NOTIONAL', headerName: 'Notional'},
    {field: 'VALUE', headerName: 'Value'},
    {field: 'PNL', headerName: 'Pnl'},
];

export const HomeTemplate = html<Home>`
<div class="split-layout">
    <div class="top-layout">
        <entity-management
          resourceName="ALL_TRADES"
          title = "Trades"
          entityLabel="Trades"
          createEvent = "EVENT_TRADE_INSERT"
          :columns=${x => x.columns}
        ></entity-management>
    </div>
    <div class="top-layout">
        <zero-card class="positions-card">
            <span class="card-title">Positions</span>
            <zero-grid-pro ${ref('positionsGrid')} rowHeight="45" only-template-col-defs>
                ${when(x => x.connection.isConnected, html`
                  <grid-pro-genesis-datasource resourceName="ALL_POSITIONS"></grid-pro-genesis-datasource>
                  ${repeat(() => positionsColumnDefs, html`
                    <grid-pro-column :definition="${x => x}" />
                  `)}
                `)}
            </zero-grid-pro>
        </zero-card>
    </div>
</div>
`;
```

### Exercise 3.3: data grids
:::info ESTIMATED TIME
15 mins
:::
Change the Position constant to delete the POSITION_ID, as this field does not have to be in the grid. Change some CSS parameters to improve your application's look and feel.

:::tip
Don't forget to reload the client side to see the upgrades.
:::

<!-- Apart from building a front end, as we did [before](../../../tutorials/training-resources/training-content-day2/#intro-to-ui) the application user interface can be configured in various aspects such as data distribution, using Request Servers for static (reference) data, and Data Servers for streaming real-time data. -->

<!-- 
### Request Servers

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI.

Request Servers will reply with a single response. Once the response is received, the transaction is over (unlike a [Data Server](../../../creating-applications/defining-your-application/user-interface/data-servers/data-servers/), which stays connected to the client and pushes updates).

Request Servers have other features distinct from a Data Server, such as allowing one-to-many joins, and even completely custom Request Servers for serving up non-linear data (e.g. sets of disjointed data to serve up to a report).

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

You should also check the Request Server component in your application's system-processes and service-definition files, as described in the [Configuring runtime](../../../creating-applications/defining-your-application/user-interface/request-servers/rs-configure-runtime/) page.

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

The example below uses an [index](../../../creating-applications/defining-your-application/user-interface/request-servers/rs-technical-details/#using-an-index) as the request definition. This provides additional indexing at the request level.

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

Let's add a new derived field in the **alpha** application called *GOOD_USD_TRADE* where the currency should be USD and price greater than 10.

:::tip
After changing the files remember to run *assemble* and *deploy*
:::

-->
