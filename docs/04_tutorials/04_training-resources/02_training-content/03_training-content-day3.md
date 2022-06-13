---
id: training-content-day3
title: Day 3
sidebar_label: Day 3
sidebar_position: 3

---
In this day we are covering:

- [Views](#views)
- [Unit testing](#unit-testing)​
- [Calculated data and consolidators](#calculated-data-and-consolidators)
- [UI data grids](#ui-data-grids)

## Views

### Definition

Views are defined in the `-view-dictionary.kts` files as discussed 
[here](/creating-applications/defining-your-application/data-model/views/views-define/).

Views are the genesis equivalent of SQL select queries. Unlike [tables](/reference/developer/api/database/concepts/data-structure/tables/), views do not have any data of 
their own, but present a view based on one or more tables. A view always starts with a single table, the root table.
Other tables can be joined onto the root table to present composite data. 

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

```
dataServer {​
     query("ALL_TRADES", TRADE_VIEW)​
}​
```
Run **alpha-deploy:deployConfig** and test the view with Postman or Console.​

### Try yourself

Extend the **TRADE_VIEW** to connect TRADE to COUNTERPARTY and INSTRUMENT:
1. Add the INSTRUMENT_ID and COUNTERPARTY_ID into TRADE table​.
2. Add the respective joins​.
3. Then, instead of taking all fields from TRADE, use only: PRICE, QUANTITY, TIMESTAMP, DIRECTION, TRADE_ID​.
4. Test it

## Unit testing​

### Adding new fields​

Let´s define new fields to Trade table​. 

```
field("SIDE", type = STRING)​
field("TRADE_DATE", type = DATE)​
field("ENTERED_BY", type = STRING)​
field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))
```

And new fields to create the POSITION and INSTRUMENT_PRICE tables

```
field("POSITION_ID", type = STRING)​
field("NOTIONAL", type = DOUBLE)​
field("LAST_PRICE", type = DOUBLE)​
field("VALUE", type = DOUBLE)​
field("PNL", type = DOUBLE)​
```

When you finish, remember to run *genesis-generated-fields*.

### Upgrading Trade and adding Position table​

Add the new fields into TRADE table​.

And then create the POSITION and INSTRUMENT_PRICE tables​.

```kotlin
table(name = "POSITION", id = 11001) {
  sequence(POSITION_ID, "PS") //autogenerated sequence
  INSTRUMENT_ID
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
      COUNTERPARTY_ID
    }
    nonUnique {
      COUNTERPARTY_ID
    }
  }
}
```

```kotlin
table(name = "INSTRUMENT_PRICE", id = 11002) {
  INSTRUMENT_ID
  LAST_PRICE
  primaryKey {
    INSTRUMENT_ID
  }
}
```

When you finish, remember to  run *genesis-generated-dao​* and *genesisproduct-assemble*.​

:::tip
Because we previously generated the fields, autocompletion helps you to define more more quickly, and with fewer errors. Also note that Genesis provides several autogenerated primary keys: **sequence**, **uuid**, **autoincrement**.
:::

### Testing

Let's now create a unit test showing usage of the view repository generated by the code-generation mechanism.
The purpose of the test is to prove you can look up data with the repo and retrieve the joined-up structure. We can show that we can:
* look up by keys
* perform get bulk from the main table
First, you need to do the following:
1. Add a new test class to the *alpha-script-config* module called `EnhancedTradeViewTest.kt`
2. Add an empty txt file to the genesis home folder. This folder is needed for unit tests. 
3. Add TEST_DATA.csv to a data folder
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
Should look like below:

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
import org.joda.time.DateTime
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import javax.inject.Inject
class EnhancedTradeViewTest : AbstractDatabaseTest() {
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
            .setInstrumentId("1")   // INSTRUMENT_NAME = "FOO.L"
            .setPrice(12.0)
            .setQuantity(100)
            .setSide("BUY")
            .setTradeId(tradeId)
            .build()
}
```
### Test get single trade by ID
```kotlin
@Test
suspend fun `test get single trade by id`() {
    val now = DateTime.now()
    val trade = buildTrade("1L", now)
    rxEntityDb.insert(trade).blockingGet()
    val tradeView = enhancedTradeViewRepository.get(TradeView.ById("1"))
    if (tradeView != null) {
        assertEquals("Testing AG", tradeView.counterpartyName)
        assertEquals("FOO.L", tradeView.instrumentName)
        assertEquals(now, tradeView.tradeDate)
        assertEquals(12.0, tradeView.price)
        assertEquals(100L, tradeView.quantity)
        assertEquals("BUY", tradeView.side)
    }
}
```
### Test get single trade with getBulk
```kotlin
@Test
suspend fun `test with single trade - use getBulk`() {
    val now = DateTime.now()
    val trade = buildTrade("1L", now)
    rxEntityDb.insert(trade).blockingGet()
    val tradeViewList = enhancedTradeViewRepository.getBulk().toList()
    assertEquals(1, tradeViewList.size)
    val tradeView = tradeViewList.first()
    assertEquals("Testing AG", tradeView.counterpartyName)
    assertEquals("FOO.L", tradeView.instrumentName)
    assertEquals(now, tradeView.tradeDate)
    assertEquals(12.0, tradeView.price)
    assertEquals(100L, tradeView.quantity)
    assertEquals("BUY", tradeView.side)
}
```
### Test get multiple trades
```kotlin
@Test
suspend fun `test get multiple trades`() {
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
```


## Calculated data and Consolidators

### Calculated data

Derived fields are a useful way of providing calculated data, but note that you must only use fields that are in the view.

```
derivedField("CONSIDERATION", DOUBLE) {
    withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
        QUANTITY * PRICE
    }
}
```

Add this derivedField to your view now.​ The final view should be like this.
```
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

### Consolidators

#### Define the position-keeping logic in the consolidator


Now define a **alpha-consolidator.kts** file inside **alpha-script-config/src/main/resources/scripts**. This is where you define the consolidator logic.

The consolidator is going to increase or decrease the quantity for POSITION records, based on the TRADE table updates. It also needs to calculate the new notional.
```kotlin
import global.genesis.gen.config.tables.POSITION.NOTIONAL
import global.genesis.gen.config.tables.POSITION.QUANTITY
import global.genesis.gen.config.tables.POSITION.VALUE

consolidators {
    config {}
    consolidator("CONSOLIDATE_POSITIONS", TRADE_PRICE_VIEW, POSITION) {
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
            val marketPrice = when {
                quantity > 0 -> input.emsBidPrice ?: 0.0
                quantity < 0 -> input.emsAskPrice ?: 0.0
                else -> 0.0
            }
            output.notional = marketPrice * quantity
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

To complete the configuration of the consolidator, add a new entry to **alpha-processes.xml** with the consolidator2 process definition.

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

This file lists all the active services for the Positions application. You can see entries have been added automatically when the data server, request server and event handler were generated (by AppGen).

Add a new entry to **alpha-service-definitions.xml** with the consolidator2 details. Remember the ports numbers should be free and, ideally, sequential.


## UI data grids

To be done.