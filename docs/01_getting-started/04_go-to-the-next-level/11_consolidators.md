---
title: 'Data Aggregation using Consolidator'
sidebar_label: 'Data Aggregation using Consolidator'
id: consolidators
---

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

Before defining the consolidator, we should insert some data in the *INSTRUMENT_PRICE* table using the command [`SendIt`](/operations/commands/server-commands/#sendit-script). To do that, let's run server commands directly from a command line using PowerShell (or Windows Command Prompt) to access your WSL instance, through user 'genesis' to have access to the Genesis Platform commands as we did before.
<!-- TODO: link to 'training-content-day1' (?) -->

From the command line opened, in the */tmp* folder, save this csv as INSTRUMENT_PRICE.csv using your favorite editor (i.e. [vim](https://www.vim.org/) or [nano](https://www.nano-editor.org/)):
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