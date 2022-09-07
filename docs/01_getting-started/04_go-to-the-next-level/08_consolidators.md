---
title: 'Data Aggregation using Consolidator'
sidebar_label: 'Data Aggregation using Consolidator'
id: consolidators
---

Following from the calculated data using [derived fields](/getting-started/go-to-the-next-level/calculated-data/), the Genesis low-code platform provides a more advanced feature to aggregate data or perform calculations whenever the underlying data is changed. That feature is called [Consolidator](/server-modules/consolidator/introduction/).

In our case, Consolidators are a good fit for consolidating a position table from trades.


### Define the position-keeping logic in the Consolidator

We will use the query `ALL_POSITIONS` that was [previously defined](/getting-started/go-to-the-next-level/events/#data-server) to show all the positions calculated by the consolidator.

So, let's define a **positions-app-tutorial-consolidator.kts** file inside **positions-app-tutorial-script-config/src/main/resources/scripts**. This is where you define the consolidator logic.

The consolidator is going to increase or decrease the quantity for `POSITION` records, based on the `TRADE` table updates. It also needs to calculate the new notional.

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

### Update the system files

Now that the Consolidator logic is in place we have to make sure it's running.

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
<configuration>
    ...
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_CONSOLIDATOR" port="11002"/>
</configuration>
```

Run the `assemble` and `positions-app-tutorial-config:assemble` tasks to verify that the new process works as expected.


### Conclusion
This shows a quick example of a Consolidator. As usual, you can either [give it a try](/getting-started/go-to-the-next-level/see-it-work) or go the next section.
