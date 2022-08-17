---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

### Create the unit tests

Create helper function to create Trade object which can be reused in tests

```kotlin
private fun setupTrade() = Trade {
    tradeId = 1
    counterpartyId = "1"
    instrumentId = "2"
}
```

Add 6 new unit tests to check the behaviour of the state machine :

Test to cancel a trade successfully:

```kotlin
    @Test
    fun `test cancel trade`(): Unit = runBlocking {
        val setupTrade = setupTrade()
        entityDb.insert(setupTrade)

        val message = Event(
            details = TradeCancel(1),
            messageType = "EVENT_TRADE_CANCELLED"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        result.assertedCast<EventReply.EventAck>()

        val trade = entityDb.get(Trade.ById(1))
        assertEquals(TradeStatus.CANCELLED, trade?.tradeStatus)
    }
```

Test to ensure you cannot cancel a trade that has already been cancelled: 

```kotlin
    @Test
    fun `test trying to cancel an already cancelled trade`(): Unit = runBlocking {
        val setupTrade = Trade {
            tradeId = 1
            counterpartyId = "1"
            instrumentId = "2"
            tradeStatus = TradeStatus.CANCELLED
        }
        entityDb.insert(setupTrade)

        val message = Event(
            details = TradeCancel(1),
            messageType = "EVENT_TRADE_CANCELLED"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        val eventNack = result.assertedCast<EventReply.EventNack>()
        assertThat(eventNack.error).containsExactly(
            StandardError(
                "INTERNAL_ERROR",
                "State CANCELLED not recognised"
            )
        )
    }
```

Test to check that we can allocate a trade successfully:

```kotlin
    @Test
    fun `test allocated trade`(): Unit = runBlocking {
        val setupTrade = setupTrade()
        entityDb.insert(setupTrade)

        val message = Event(
            details = TradeAllocated(1),
            messageType = "EVENT_TRADE_ALLOCATED"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        result.assertedCast<EventReply.EventAck>()
        val trade = entityDb.get(Trade.ById(1))
        assertEquals(TradeStatus.ALLOCATED, trade?.tradeStatus)
    }
```

Test to check that you cannot allocate a trade that has been cancelled:

```kotlin
    @Test
    fun `test trying to allocate a cancelled trade`(): Unit = runBlocking {
        val setupTrade = setupTrade()
        setupTrade.tradeStatus = TradeStatus.CANCELLED
        entityDb.insert(setupTrade)

        val message = Event(
            details = TradeAllocated(1),
            messageType = "EVENT_TRADE_ALLOCATED"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        val eventNack = result.assertedCast<EventReply.EventNack>()
        assertThat(eventNack.error).containsExactly(
            StandardError(
                "INTERNAL_ERROR",
                "Illegal transition: cannot transition from CANCELLED to ALLOCATED"
            )
        )
    }
```

Test to check that you can change the price of the trade when entered by TestUser, which executes `onCommit` logic from state machine:

```kotlin
    @Test
    fun `test trade by TestUser`(): Unit = runBlocking {
        val message = Event(
            details = Trade {
                tradeId = 1
                counterpartyId = "1"
                instrumentId = "2"
                price = 5.0
                enteredBy = "TestUser"
            },
            messageType = "EVENT_TRADE_INSERT"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        result.assertedCast<EventReply.EventAck>()

        val trade = entityDb.get(Trade.ById(1))
        assertEquals(10.0, trade?.price)
    }
```

Test to check that you can transition from completed to cancelled:

```kotlin
    @Test
    fun `test transition from allocated to cancelled status`(): Unit = runBlocking {
        val setupTrade = setupTrade()
        setupTrade.tradeStatus = TradeStatus.ALLOCATED
        entityDb.insert(setupTrade)

        val message = Event(
            details = TradeCancel(1),
            messageType = "EVENT_TRADE_CANCELLED"
        )

        val result: EventReply? = messageClient.suspendRequest(message)

        result.assertedCast<EventReply.EventAck>()

        val trade = entityDb.get(Trade.ById(1))
        assertEquals(TradeStatus.CANCELLED, trade?.tradeStatus)
    }
```

### Run the tests

Run all unit tests to confirm they pass.