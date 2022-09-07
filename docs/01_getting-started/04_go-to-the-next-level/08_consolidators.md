---
title: 'Data Aggregation using Consolidator'
sidebar_label: 'Data Aggregation using Consolidator'
id: consolidators
---

Following from the calculated data using [derived fields](/getting-started/go-to-the-next-level/calculated-data/), the Genesis low-code platform provides a more advanced feature to aggregate data or perform calculations whenever the underlying data is changed. That feature is called [Consolidator](/server-modules/consolidator/introduction/).

In our case, Consolidators are a good fit for consolidating a position table from trades.


### Define the position-keeping logic in the Consolidator

We will use the query `ALL_POSITIONS` that was [previously defined](/getting-started/go-to-the-next-level/events/#data-server) to show all the positions calculated by the Consolidator.

Make sure that the `INSTRUMENT_ID` field is not nullable in the `TRADE` and `POSITION` tables, as the consolidations will use it.

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

Add the query `ALL_POSITIONS` to the **positions-app-tutorial-dataserver.kts** file. 

```kotlin {3}
dataServer {
    ...
    query("ALL_POSITIONS", POSITION)
}
```
This query will be used to show all the positions calculated by the consolidator.

So, let's define a **positions-app-tutorial-consolidator.kts** file inside **positions-app-tutorial-script-config/src/main/resources/scripts**. This is where you define the consolidator logic.

The Consolidator is going to increase or decrease the quantity for `POSITION` records, based on the `TRADE` table updates. It also needs to calculate the new notional.

```kotlin
import global.genesis.gen.config.tables.POSITION
import global.genesis.gen.config.tables.POSITION.QUANTITY
import global.genesis.gen.config.tables.POSITION.VALUE
import global.genesis.gen.config.view.TRADE_VIEW
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

:::tip
If you don't have intelisense when editing the consolidator file check the contents of **positions-app-tutorial-script-config/build.gradle.kts**. Under **dependencies** it should contain `api("global.genesis:genesis-pal-consolidator")`. If that entry is not present add it to the list of dependencies. Once done the file should look like:
```kotlin
dependencies {
    ...
    api("global.genesis:genesis-pal-consolidator")
    ..
}
```

Reload the project from the Gradle tab on the right side of the screen.

:::


### Update the system files

Now that the Consolidator logic is in place we need to update the system files.

#### Update the processes.xml file

As the Consolidator runs on its own process, we need to add a new entry to **positions-app-tutorial-processes.xml** with the Consolidator process definition.

```xml
<process name="POSITIONS_APP_TUTORIAL_CONSOLIDATOR">
    <groupId>POSITIONS_APP_TUTORIAL</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-consolidator</module>
    <package>global.genesis.pal.consolidator</package>
    <script>positions-app-tutorial-consolidator.kts</script>
    <description>Consolidates trades to calculate positions</description>
    <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
    <language>pal</language>
</process>
```
#### Update the service-definitions.xml file

This file lists all the active services for the Positions application. You can see entries have been added automatically when the Data Server and Event Handler were generated.

Add a new entry to **positions-app-tutorial-service-definitions.xml** with the Consolidator details. Remember the port numbers should be free and, ideally, sequential.

```xml
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_CONSOLIDATOR" port="11002"/>
```

When you finish, remember to run `generateDao` (if you made changes to the table), `assemble` and `deploy-genesisproduct-positions-app-tutorial`.

### Conclusion
This shows a quick example of a Consolidator. If you want to see it in action, go to [Endpoints](/server-modules/integration/rest-endpoints/introduction/) for information on testing your the back end.
