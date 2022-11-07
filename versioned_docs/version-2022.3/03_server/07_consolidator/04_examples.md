---
title: 'Consolidator - Examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, consolidator, examples]
tags:
  - server
  - consolidator
  - examples
---

[Introduction](/server/consolidator/introduction) | [Basics](/server/consolidator/basics) |  [Advanced](/server/consolidator/advanced) | [Examples](/server/consolidator/examples) | [Configuring runtime](/server/consolidator/configuring-runtime) | [Testing](/server/consolidator/testing)

Here is an example Consolidator file that defines two Consolidators:

* CON_ORDER_FROM_TRADES.
  This Consolidator builds the ORDER table using the CONSOLIDATOR_TRADE table. It uses max, min, sum and count functions and groups by field ```ORDER.ORDER_ID``` to build a new row for the output table ORDER.

* CON_ORDER_SUMMARY_FROM_ORDER.  This Consolidator builds the ORDER_SUMMARY table using the ORDER table and groups by the field ```ORDER.ORDER_DATE``` from the ```ORDER``` table. You can give multiple `groupBy` conditions based on your requirement.
  In this second Consolidator,  we store all the consolidations grouped by ORDER_DATE year and ORDER_DATE year and month in database, (which are defined right at the end of the Consolidator). This avoids duplication of consolidator code if you need to group the same consolidation based on different `groupBy` conditions.

```kotlin
consolidators {

    consolidator("CON_ORDER_FROM_TRADES", CONSOLIDATOR_TRADE, ORDER) {
        config {
            tableTransient = true
        }
    
        select {
            ORDER {
                max { price } into MAX_PRICE
                min { price } into MIN_PRICE
                sum { price * quantity } into TOTAL_NOTIONAL
                sum { quantity } into TOTAL_QUANTITY
                count() into TRADE_COUNT
            }
        }
    
        groupBy { Order.ById(orderId) } into {
            val start = DateTime(2022, 1, 1, 0, 0)
            build {
                val id = groupId.orderId.toInt()
                Order {
                    orderId = groupId.orderId
                    orderDate = start.plusMonths(id % 12)
                    filledQuantity = 0
                }
            }
        }
    }
    
    consolidator("CON_ORDER_SUMMARY_FROM_ORDER", ORDER, ORDER_SUMMARY) {
        select {
            ORDER_SUMMARY {
                sum { totalNotional } into TOTAL_NOTIONAL
                sum { totalQuantity } into TOTAL_QUANTITY
                sum { tradeCount } into TRADE_COUNT
            }
        }
    
        groupBy { OrderSummary.byGroupId("${orderDate.year}") }
        groupBy { OrderSummary.byGroupId("${orderDate.year}-${orderDate.monthOfYear}") }
    }
}
```

The example below comes from the Consolidator exercise in our [tutorial](/getting-started/go-to-the-next-level/calculated-data/). It has a single consolidator, called `CONSOLIDATE_POSITIONS`.

To give you some basic pointers to the content, the main code blocks in this Consolidator are:

- The `config` block contains consolidator level configuration
- The `select` block to specify some calculations and assign to output fields
- The `onCommit` block to amend the output row
- The `groupBy` block groups by `INSTRUMENT_ID`

```kotlin
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
```

### Table definitions used in above examples:

```kotlin
  table("ORDER", 1001) {
    ORDER_ID
    ORDER_DATE not null
    ORDER_STATE
    QUANTITY
    FILLED_QUANTITY not null
    ENTERED_BY
    ASSIGNED_TO
    SYMBOL
    AVERAGE_PRICE
    LIMIT_PRICE
    TRADE_COUNT
    TOTAL_QUANTITY
    TOTAL_NOTIONAL
    MAX_PRICE
    MIN_PRICE
    SIDE
    ORDER_TYPE
    COUNTERPARTY_ID

    primaryKey {
      ORDER_ID
    }
  }

  table("ORDER_SUMMARY", 1003) {
    GROUP_ID
    TOTAL_QUANTITY
    TOTAL_NOTIONAL
    TRADE_COUNT

    primaryKey {
      GROUP_ID
    }
  }

  table("CONSOLIDATOR_TRADE", 1004) {
    TRADE_ID
    ORDER_ID
    TRADE_DATE
    QUANTITY
    TRADE_STATUS
    PRICE

    primaryKey {
      TRADE_ID
    }

    indices {
      nonUnique {
        ORDER_ID
      }
    }
  }
```
