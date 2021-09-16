---
id: basic-auditing
title: Adding basic auditing to tables
sidebar_label: Basic auditing
sidebar_position: 8

---

Now we are going to add basic auditing to the TRADE table in order to keep a record of the changing states of the trades.

At this stage, you have:

* a Reference Data application. This has tables, so you can import the schema to the Trading application
* a Trading application. This contains the schema for the TRADE table, plus handlers, a state machine, data servers and request servers.

## The objective

We want to be able to track the changes made to the various trades on the TRADE table, such that we could see the times and modifications made in the history of the trade.

## Adding Basic Auditing

### Adding audit to table dictionary

The first step to add basic auditing, is to change the relevant table dictionary. In this instance we will be making changes to the **trading_app-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition, so that it resembles the following:

```kotlin {2}
tables {
  table (name = "TRADE", id = 11000, audit = details(id = 11003, sequence = "TR")) {
    // Source: Trade
    TRADE_ID            // A
    INSTRUMENT_ID not null       // B
    COUNTERPARTY_ID not null     // C
    COUNTERPARTY        // D
    INSTRUMENT_SYMBOL   // E
    QUANTITY            // F
    SIDE                // G
    PRICE               // H
    TRADE_DATE          // J
    TRADE_DATETIME      // K
    ENTERED_BY          // L

    primaryKey {
      TRADE_ID
    }

  }
}
```

If you are using the GPAL event handlers, this will be sufficient to enable auditing on this table. A new table is created by the name of the original table, with the **_AUDIT** suffix added to the end. In this instance that would be the **TRADE_AUDIT** table.

### Updating the state machine to use auditing

Next we will change the insert, and modify methods in the TradeStateMachine.kt file, to use the AsyncMultiEntityReadWriteGenericSupport parameter and the internalState.withTransaction block.

```kotlin {2,5,10,12,20,23}
    suspend fun insert(
        transaction: AsyncMultiEntityReadWriteGenericSupport,
        trade: Trade,
    ): Transition<Trade, TradeStatus, TradeEffect> =
        internalState.withTransaction(transaction) {
            create(trade)
        }

    suspend fun modify(
        transaction: AsyncMultiEntityReadWriteGenericSupport,
        tradeId: Long, modify: suspend (Trade) -> Unit
    ): Transition<Trade, TradeStatus, TradeEffect>? =
        internalState.withTransaction(transaction) {
            update(Trade.ById(tradeId)) {
                trade, _ -> modify(trade)
            }
        }

    suspend fun modify(
        transaction: AsyncMultiEntityReadWriteGenericSupport,
        trade: Trade
    ): Transition<Trade, TradeStatus, TradeEffect>? =
        internalState.withTransaction(transaction) {
            update(trade)
        }
```

### Update the event handlers to use auditing

Now we will have to update the trading_app-eventhandler.kts in order to pass the `entityDb` object into the methods updated in the state machine, as the syncMultiEntityReadWriteGenericSupport parameter. This should resemble the example below:

```kotlin {12,19,26,35}
    eventHandler<Trade>(name = "TRADE_INSERT") {
        onValidate { event ->
            val message = event.details
            verify {
                entityDb hasEntry Counterparty.ById(message.counterpartyId)
                entityDb hasEntry Instrument.ById(message.instrumentId)
            }
            ack()
        }
        onCommit { event ->
            val trade = event.details
            stateMachine.insert(entityDb, trade)
            ack()
        }
    }
    eventHandler<Trade>(name = "TRADE_MODIFY") {
        onCommit { event ->
            val trade = event.details
            stateMachine.modify(entityDb, trade)
            ack()
        }
    }
    eventHandler<TradeCancel>(name = "TRADE_CANCELLED") {
        onCommit { event ->
            val message = event.details
            stateMachine.modify(entityDb, message.tradeId) { trade ->
                trade.tradeStatus = TradeStatus.CANCELLED
            }
            ack()
        }
    }
    eventHandler<TradeAllocated>(name = "TRADE_ALLOCATED") {
        onCommit { event ->
            val message = event.details
            stateMachine.modify(entityDb, message.tradeId) { trade ->
                trade.tradeStatus = TradeStatus.ALLOCATED
            }
            ack()
        }
    }
```
## Testing

### Unit Testing

Now we will add a unit test to the TradingEventHandlerTest.kt in order to verify the behaviour of the auditing implementation.

The following test will create a trade, and then modify it, allocate it, and finally cancel it. The test will then check both that there are only 4 TestAudit entities, and there is one corresponding with each of the state transitions. 

```kotlin
    @Test
    fun `test audit table`(): Unit = runBlocking {
        val insertMessage = Event(
            details = Trade {
                tradeId = 1
                counterpartyId = "1"
                instrumentId = "2"
                enteredBy = "TestUser"
            },
            messageType = "EVENT_TRADE_INSERT"
        )
        val modifyMessage = Event(
            details = Trade {
                tradeId = 1
                counterpartyId = "1"
                instrumentId = "2"
                price = 5.0
                enteredBy = "TestUser"
            },
            messageType = "EVENT_TRADE_MODIFY"
        )
        val allocateMessage = Event(
            details = TradeAllocated(1),
            messageType = "EVENT_TRADE_ALLOCATED"
        )
        val cancelMessage = Event(
            details = TradeCancel(1),
            messageType = "EVENT_TRADE_CANCELLED"
        )

        val insertResult: EventReply? = messageClient.suspendRequest(insertMessage)
        insertResult.assertedCast<EventReply.EventAck>()

        val modifyResult: EventReply? = messageClient.suspendRequest(modifyMessage)
        modifyResult.assertedCast<EventReply.EventAck>()

        val allocateResult: EventReply? = messageClient.suspendRequest(allocateMessage)
        allocateResult.assertedCast<EventReply.EventAck>()

        val cancelResult: EventReply? = messageClient.suspendRequest(cancelMessage)
        cancelResult.assertedCast<EventReply.EventAck>()

        val tradeAudit: List<TradeAudit> = entityDb.getBulk(TRADE_AUDIT).toList()
        Assert.assertEquals(4, tradeAudit.size)
        assertThat(tradeAudit).extracting<String> {it.auditEventType}
            .containsExactlyInAnyOrder("EVENT_TRADE_INSERT", "EVENT_TRADE_ALLOCATED", "EVENT_TRADE_MODIFY", "EVENT_TRADE_CANCELLED")
    }
```

### Run the test

Run the test to ensure that it passes.

