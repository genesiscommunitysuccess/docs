---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

## Integration testing

As state machine is another layer on event handler, so the test configuration is same as event handlers
The Genesis Platform provides the `AbstractGenesisTestSupport` abstract class that enables end-to-end testing of specific areas of your application. In this case, we want to ensure that we have a database, seeded with information, and that our Event Handler configuration is used to create our Event Handler. We also need to add the required packages, genesis home and separately set the "IS_SCRIPT" System Definition property to true (This is required as part of the Event Handler initialisation).

```kotlin
class EventHandlerTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.eventhandler.pal")
        genesisHome = "/GenesisHome/"
        parser = { it }
        scriptFileName = "your-application-eventhandler.kts"
        initialDataFile = "seed-data.csv"
    }
) {
    override fun systemDefinition(): Map<String, Any> = mapOf("IS_SCRIPT" to "true")
}
```

For more information about `AbstractGenesisTestSupport`, see the [Testing pages](/operations/testing/integration-testing/#abstractgenesistestsupport).

Once you have set up your configuration, you can start writing tests against State machine.

## Writing tests

Let's write some tests for this [example](/server-modules/state-machine/examples/) of State Machine

Add these helper functions for test

```kotlin
    private inline fun <T : Any> T.assertProperty(block: T.() -> Boolean) = assert(block()) {
        toPrettyJsonString(true)
    }

    private fun EventReply.EventAck.extractTradeId(): String {
        val generated = generated.first()
        assert(generated.isNotEmpty())
        assert("TRADE_ID" in generated)
        return generated["TRADE_ID"] as String
    }

    private fun makeTrade(newTradePrice: Double, tradeQuantity: Int) =
        Trade {
            tradeId = "test_id"
            quantity = tradeQuantity
            tradePrice = newTradePrice
            currencyId = "USD"
            enteredBy = null
            enteredTime = null
            modifiedBy = null
            modifiedTime = null
        }
```


```kotlin
    @Test
    fun `test trade insert`() = runBlocking {
        val start = DateTime.now()
        val reply = sendEvent(
            makeTrade(1.25, 12),
            messageType = "EVENT_TRADE_INSERT",
                userName = "harry"
            )

        val ack = reply.assertedCast<EventReply.EventAck>()
        val trade = entityDb.get(Trade.ById(ack.extractTradeId()))!!

        trade.assertProperty { enteredBy == "harry" }
        trade.assertProperty { enteredTime!! > start }
        trade.assertProperty { tradePrice == 1.25 }
        trade.assertProperty { quantity == 12 }
        trade.assertProperty { tradeStatus == TradeStatus.DRAFT }
    }

    @Test
    fun `test trade insert - failure`() = runBlocking {
        val reply = sendEvent(
            makeTrade(1.25, -1),
            messageType = "EVENT_TRADE_INSERT",
            userName = "harry"
        )

        val nack = reply.assertedCast<EventReply.EventNack>()
        val error = nack.error.first().text

        assertEquals("Expected Trade.QUANTITY to be greater than or equal to 0; actual value -1", error)
    }

    @Test
    fun `test trade modify`() = runBlocking {
        val reply = sendEvent(
            makeTrade(1.25, 12),
            messageType = "EVENT_TRADE_INSERT",
            userName = "harry"
        )

        val ack = reply.assertedCast<EventReply.EventAck>()

        val tradeId = ack.extractTradeId()
        var trade = entityDb.get(Trade.ById(tradeId))!!

        trade.quantity = 15

        sendEvent(
            trade,
            messageType = "EVENT_TRADE_MODIFY",
            userName = "john"
        ).assertedCast<EventReply.EventAck>()

        trade = entityDb.get(Trade.ById(tradeId))!!

        trade.assertProperty { enteredBy == "harry" }
        trade.assertProperty { modifiedBy == "john" }
        trade.assertProperty { quantity == 15 }
        trade.assertProperty { tradeStatus == TradeStatus.DRAFT }
    }

    @Test
    fun `test trade modify - failure`() = runBlocking {
        val reply = sendEvent(
            makeTrade(1.25, 12),
            messageType = "EVENT_TRADE_INSERT",
            userName = "harry"
        )

        val ack = reply.assertedCast<EventReply.EventAck>()

        val reply2 = reply.messageType

        val tradeId = ack.extractTradeId()
        val trade = entityDb.get(Trade.ById(tradeId))!!

        trade.tradePrice = null

        val nack = sendEvent(
            trade,
            messageType = "EVENT_TRADE_MODIFY",
            userName = "john"
        ).assertedCast<EventReply.EventNack>()

        val error = nack.error.first().text
        assertEquals("Expected Trade.TRADE_PRICE to have a value", error)
    }

    @Test
    fun `test trade cancel`() = runBlocking {
        val reply = sendEvent(
            makeTrade(1.25, 12),
            messageType = "EVENT_TRADE_INSERT",
            userName = "harry"
        )

        val ack = reply.assertedCast<EventReply.EventAck>()

        val tradeId = ack.extractTradeId()
        val index = Trade.ById(tradeId)

        sendEvent(
            index,
            messageType = "EVENT_TRADE_CANCELLED",
            userName = "john"
        ).assertedCast<EventReply.EventAck>()

        val trade = entityDb.get(index)!!

        trade.assertProperty { enteredBy == "harry" }
        trade.assertProperty { modifiedBy == "john" }
        trade.assertProperty { tradeStatus == TradeStatus.CANCELLED }
    }

    @Test
    fun `test trade modify - fail cancelled`() = runBlocking {
        val reply = sendEvent(
            makeTrade(1.25, 12),
            messageType = "EVENT_TRADE_INSERT",
            userName = "harry"
        )

        val ack = reply.assertedCast<EventReply.EventAck>()

        val tradeId = ack.extractTradeId()
        val index = Trade.ById(tradeId)

        sendEvent(
            index,
            messageType = "EVENT_TRADE_CANCELLED",
            userName = "john"
        ).assertedCast<EventReply.EventAck>()

        val trade = entityDb.get(index)!!
        trade.quantity = 100

        val nack = sendEvent(
            trade,
            messageType = "EVENT_TRADE_MODIFY",
            userName = "john"
        ).assertedCast<EventReply.EventNack>()

        val error = nack.error.first().text
        assert(error == "Trade CANCELLED is immutable") { error }
    }
```