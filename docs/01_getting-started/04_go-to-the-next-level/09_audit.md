---
title: 'Track the data changes using Auditable Tables'
sidebar_label: 'Track the data changes using Auditable Tables'
id: audit
---

We want to be able to track the changes made to the various trades on the `TRADE` table, such that we could see the times and modifications made during the history of the trade. So, we are going to add basic auditing to the `TRADE` table to keep a record of the changing states of the trades.

This can be useful for historical purposes, if you need to at a later date be able to produce an accurate course of events.

### Adding audit to table dictionary
The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **positions-app-tutorial-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

```kotlin {1}
table (name = "TRADE", id = 11000, audit = details(id = 11003, sequence = "TR")) {
    sequence(TRADE_ID, "TR")
    INSTRUMENT_ID not null
    COUNTERPARTY_ID not null
    QUANTITY not null
    SIDE not null
    PRICE not null
    TRADE_DATETIME
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

The `id` parameter indicates the id of the newly created audit table, and will need to be different from any other table id.

As we are using the GPAL Event Handlers, this is sufficient to enable auditing on this table. A new table is created with the name of the original table, plus the **_AUDIT** suffix. In this instance, that would be the **TRADE_AUDIT** table.

### Updating the state machine to use auditing

Next you need to extend the insert, and modify methods in the **TradeStateMachine.kt** file. Specifically, each method must be have a second option, so that the method signature uses the **AsyncMultiEntityReadWriteGenericSupport** parameter and the `internalState.withTransaction(transaction) { }` code block.  For example:

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
        tradeId: String, modify: suspend (Trade) -> Unit
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

### Update the Event Handlers to use auditing

Now you must update the **positions-app-tutorial-eventhandler.kts** in order to pass the `entityDb` object into the updated methods of the state machine, as the **syncMultiEntityReadWriteGenericSupport** parameter. This should resemble the example below:

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
    eventHandler<TradeCancelled>(name = "TRADE_CANCELLED") {
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

Run the `dao`, `build` and `deploy` tasks.

### Conclusion
With this, any changes made to `TRADE` are tracked to `TRADE_AUDIT`. To try it out, insert a new `TRADE` and see what's stored in the `TRADE_AUDIT` table.
