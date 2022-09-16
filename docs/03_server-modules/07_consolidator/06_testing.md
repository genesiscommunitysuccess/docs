---
title: 'Consolidator - Testing'
sidebar_label: 'Testing'
id: testing
keywords: [consolidator]
tags:
    - consolidator
---

[Introduction](/server-modules/consolidator/introduction) | [Basics](/server-modules/consolidator/basics) |  [Advanced](/server-modules/consolidator/advanced) | [Examples](/server-modules/consolidator/examples) | [Configuring runtime](/server-modules/consolidator/configuring-runtime) | [Testing](/server-modules/consolidator/testing)

## Integration testing

The Genesis low-code platform provides the `AbstractGenesisTestSupport` abstract class that enables end-to-end testing of specific areas of your application. In this case, we want to ensure that we have a database, seeded with information, and that our Consolidator configuration is used to create our Consolidator. 

First, we need to add the required packages and genesis home. Then we need to set the "IS_SCRIPT" System Definition property to true (this is required as part of the Consolidator initialisation).

```kotlin
class ConsolidatorTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.pal.consolidator")
        genesisHome = "/GenesisHome/"
        scriptFileName = "position-consolidator.kts"
        initialDataFile = "seed-data.csv"
        parser = { it }
    }) {

    override fun systemDefinition(): Map<String, Any> = mapOf("IS_SCRIPT" to "true")
}
```

For more information about `AbstractGenesisTestSupport`, see the [Testing pages](/operations/testing/integration-testing/#abstractgenesistestsupport).

Once you have set up your configuration, you can start writing tests against our Consolidators.

## Writing tests

Let's write some tests for this Consolidator defined below, defined below

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
                sum { price * quantity} into TOTAL_NOTIONAL
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
                    counterpartyId = "1"
                }
            }
        }

        onCommit {
            output.counterpartyId = "ON_COMMIT_TEST"
        }
    }
}
```

Before we write test, add the below method and variable to test class:

```kotlin
private var lastTradeId = 0

private fun trade(
    orderId: String = "1",
    price: Double,
    quantity: Long,
) = ConsolidatorTrade {
    this.tradeId = "TR_${lastTradeId++}"
    this.orderId = orderId
    this.price = price
    this.quantity = quantity
}
```

### Consolidation test

```kotlin
    @Test
    fun `test consolidate only`() = runBlocking {

        val trade = trade(price = 10.0, quantity = 100)
        val trade2 = trade(price = 12.0, quantity = 100)
        entityDb.insert(trade)
        entityDb.insert(trade2)

        await untilAsserted {
            runBlocking {
                val record = entityDb.get(Order.ById("1"))
                assertEquals(22.0*100, record?.totalNotional)
            }
        }
    }
```

### `onCommit` test

```kotlin
    @Test
    fun `fields modified in onCommit block are written to database`() = runBlocking {
        val trade = trade(price = 10.0, quantity = 100)
        entityDb.insert(trade)

        await untilAsserted {
            runBlocking {
                val record = entityDb.get(Order.ById("1"))
                assertEquals("ON_COMMIT_TEST", record?.counterpartyId)
            }
        }
    }
```

### Nested consolidation test

To test this, add the consolidator below to the consolidator definition above:

```kotlin
    consolidator(ORDER, ORDER_SUMMARY) {
        select {
            ORDER_SUMMARY {
                sum { totalNotional } into TOTAL_NOTIONAL
                sum { totalQuantity } into TOTAL_QUANTITY
                sum { tradeCount } into TRADE_COUNT
            }
        }

        groupBy { OrderSummary.byGroupId("${orderDate.year}") }
    }
```

You will see that adding a trade would build ORDER and ORDER_SUMMARY tables.

```kotlin
@Test
fun `test nested consolidation`() = runBlocking {
        val trade = trade(price = 10.0, quantity = 100)
        val trade2 = trade(price = 12.0, quantity = 100)
        entityDb.insert(trade)
        entityDb.insert(trade2)
        await untilAsserted {
            runBlocking {
                val record = entityDb.get(OrderSummary.byGroupId("2022"))
                assertEquals(200, record?.totalQuantity)
                assertEquals(22.0 * 100, record?.totalNotional!!, 0.01)
            }
        }
    }
```
