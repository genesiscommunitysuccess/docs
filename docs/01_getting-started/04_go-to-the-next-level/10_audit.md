---
title: 'Track the data changes using Auditable Tables'
sidebar_label: 'Track the data changes using Auditable Tables'
id: audit
---

We want to be able to track the changes made to the various trades on the `TRADE` table, such that we are able to see the times and modifications made during the history of the trade. So, we are going to add basic auditing to the `TRADE` table to keep a record of the changing states of the trades.

This is useful for historical purposes if you need to at a later date be able to produce an accurate course of events.

## Section objectives
The goal of this section is:
- update our tables to be auditable
- update our state machine to use auditing
- update our event handlers to pass transactions to our state machine of type `AsyncMultiEntityReadWriteGenericSupport`.

### Adding audit to table dictionary
The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **positions-app-tutorial-tables-dictionary.kts**, by adding the `audit` parameter. It should resemble the following:

```kotlin {1}
table (name = "TRADE", id = 11000, audit = details(id = 11002, sequence = "TR")) {
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

The `id` parameter inside the details function indicates the `id` of the newly created audit table, and will need to be different from any other table id.

As we are using the GPAL Event Handlers, this is sufficient to enable auditing on this table. A new table is created with the name of the original table, plus the **_AUDIT** suffix. In this instance, that would be the **TRADE_AUDIT** table.

### Updating the state machine to use auditing

Next we need to extend the insert and modify methods in the **TradeStateMachine.kt** file. Specifically, we need to add a transaction parameter of type `AsyncMultiEntityReadWriteGenericSupport` and use `internalState.withTransaction(transaction)`. For example:

```kotlin {2,5,10,12,20,23}
    suspend fun insert(
        transaction: AsyncMultiEntityReadWriteGenericSupport,
        trade: Trade
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

Now we must update our `Trade` Event Handlers inside the **positions-app-tutorial-eventhandler.kts** file and pass in our `transaction` object as a parameter, in this case it's our `entityDb` object. It should resemble the example below:

```kotlin {4,11,18,27}
    eventHandler<Trade>(name = "TRADE_INSERT") {
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

Finally we can run `generateDao`, `assemble` and `deploy-genesisproduct-positions-app-tutorial`.

### Conclusion
With this, any changes made to `TRADE` are tracked to `TRADE_AUDIT`. To try it out, insert a new `TRADE` and see what's stored in the `TRADE_AUDIT` table via `DbMon`. Go to your terminal and run `DbMon`, `table TRADE_AUDIT` and `search 1`. For more information on testing, go to [Endpoints](/server-modules/integration/rest-endpoints/introduction/).
