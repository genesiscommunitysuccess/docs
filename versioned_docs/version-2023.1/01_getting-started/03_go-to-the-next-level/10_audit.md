---
title: 'Go to the next level - track the data changes using auditable tables'
sidebar_label: 'Using Auditable Tables'
id: audit
keywords: [getting started, quick start, next level, audit]
tags:
    - getting started
    - quick start
    - next level
    - audit
---

We want to be able to track the changes made to the various trades on the `TRADE` table, such that we are able to see the times and modifications made during the history of the trade. So, we are going to add basic auditing to the `TRADE` table to keep a record of the changing states of the trades.

This is useful, if at a later date, you need to be able to produce an accurate course of events.

## Section objectives
The goal of this section is:
- update our tables to be auditable
- update our state machine to use auditing
- update our Event Handlers to pass transactions to our state machine of type `AsyncMultiEntityReadWriteGenericSupport`.

### Adding audit to table dictionary
The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **alpha-tables-dictionary.kts**, by adding the `audit` parameter. It should resemble the following:

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

The `id` parameter inside the details function indicates the `id` of the newly created audit table, and it must be different from any other table id.

As we are using the GPAL Event Handlers, this is sufficient to enable auditing on this table. A new table is created with the name of the original table, plus the **_AUDIT** suffix. In this instance, that is the **TRADE_AUDIT** table.

### Updating the state machine to use auditing

Next we need to extend the insert and modify methods in the **TradeStateMachine.kt** file. Specifically, we need to add a transaction parameter of type `AsyncMultiEntityReadWriteGenericSupport` and use `internalState.withTransaction(transaction)`. For example:

```kotlin {1,3,7,12,14,22,25}
import global.genesis.db.rx.entity.multi.AsyncMultiEntityReadWriteGenericSupport

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

Now we must update our `Trade` Event Handlers inside the **alpha-eventhandler.kts** file and pass in our `transaction` object as a parameter; in this case it's our `entityDb` object. It should resemble the example below:

```kotlin {4,11,18,27}
    eventHandler<Trade>(name = "TRADE_INSERT") {
        schemaValidation = false
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

Import BuildAndDeploy from '/snippet/_build_and_deploy.md'

<BuildAndDeploy />

:::note
Do not forget to run remap again, because we need to create the `_AUDIT` tables in our database.
:::

### Conclusion
With this, any changes made to `TRADE` are tracked to `TRADE_AUDIT`. To try it out, insert a new `TRADE` and see what's stored in the `TRADE_AUDIT` table via `DbMon`. Go to your terminal and run `DbMon`, `table TRADE_AUDIT` and `search 1`. For more information on testing, go to [Endpoints](../../../server/integration/rest-endpoints/introduction/).

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/server/jvm) as a reference point for this chapter. Note that this repo is a complete application and may not reflect the changes made in this page.
