---
title: 'Tables - advanced'
sidebar_label: 'Tables - advanced'
id: tables-advanced
keywords: [database, tables, advanced]
tags:
    - database
    - tables
    - advanced
---


## Subtables

A subtable provides a unique point of view on the data schema, which goes further than a simple join relationship. It gives extra functionality to a main table.

For example, a financial instrument can be modelled as an INSTRUMENT table, but this table on its own isn’t enough to represent all the possible symbologies for an instrument. So, we could add a subtable called ALT_INSTRUMENT_ID, in which the relationship is one-to-many from INSTRUMENT to ALT_INSTRUMENT_ID.

ALT_INSTRUMENT_ID is likely to inherit key fields from the INSTRUMENT table, and it simply acts as a lookup table for INSTRUMENT records.

This requirement occurs for different tables (e.g. COUNTERPARTY → ALT_COUNTERPARTY_ID, GENESIS_PROCESS → GENESIS_PROCESS_MONITOR, etc).

Subtables are defined within the body of the table definition. 

The example below shows the `GENESIS_PROCESS` monitoring table.

After the fields and the primary key have been defined, you can see the subtable `GENESIS_PROCESS_MONITOR`.

Within this subtable, the fields that are used to generate the join operation are defined first. These fields are inherited automatically. Then the additional fields and keys are defined.


```kotlin
table(name = "GENESIS_PROCESS", id = 12) {
    PROCESS_NAME
    PROCESS_STATUS
    PROCESS_STATUS_MESSAGE
    PROCESS_STATE_TEXT
    PROCESS_RESOURCES
    PROCESS_HOSTNAME
    PROCESS_CPU_USAGE
    PROCESS_MEM_USAGE
    PROCESS_SECURE
    PROCESS_PORT
    LOG_LEVEL
    DATADUMP
    START_TIME
    RESOURCE_TYPES
    primaryKey {
        PROCESS_NAME
        PROCESS_HOSTNAME
    }
    subTables {
        fields(PROCESS_HOSTNAME, PROCESS_NAME)
            .joiningNewTable(name = "GENESIS_PROCESS_MONITOR", id = 20) {
                MONITOR_NAME
                MONITOR_MESSAGE
                MONITOR_STATE

            primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
                    PROCESS_HOSTNAME
                    PROCESS_NAME
                    MONITOR_NAME
                }
            }
    }
}
```

## Auditing​

We want to be able to track the changes made to the various trades on the TRADE table, such that we could see the times and modifications made in the history of the trade. So, we are going to add basic auditing to the TRADE table in order to keep a record of the changing states of the trades.

This can be useful for historical purposes, if you need to at a later date be able to produce an accurate course of events.

### Adding audit to table dictionary

The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **alpha-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

```kotlin {1}
table (name = "TRADE", id = 2000, audit = details(id = 2100, sequence = "TR")) {
    sequence(TRADE_ID, "TR")
    COUNTERPARTY_ID 
    INSTRUMENT_ID not null
    QUANTITY
    PRICE not null
    SYMBOL
    DIRECTION
    TRADE_DATE
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

The id parameter indicates the id of the newly created audit table, and will need to be different from any other table id.

As we are using the GPAL event handlers, this is sufficient to enable auditing on this table. A new table is created by the name of the original table, with the **_AUDIT** suffix added to the end. In this instance that would be the **TRADE_AUDIT** table.

### Updating the state machine to use auditing

Next you need to extend the insert, and modify methods in the **TradeStateMachine.kt** file. Specifically, each method must be have a second option so that the method signature uses the **AsyncMultiEntityReadWriteGenericSupport** parameter and the `internalState.withTransaction(transaction) { }` code block.  For example:

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

Now you must update the **alpha-eventhandler.kts** in order to pass the `entityDb` object into the updated methods of the state machine, as the **syncMultiEntityReadWriteGenericSupport** parameter. This should resemble the example below:

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

### Conclusion
With this, any changes made to `TRADE` are tracked to `TRADE_AUDIT`. To try it out, insert a new `TRADE` and see what's stored in the `TRADE_AUDIT` table via `DbMon`. Go to your terminal and run `DbMon`, `table TRADE_AUDIT` and `search 1`. For more information on testing, go to [Endpoints](docs/03_server/10_integration/01_rest-endpoints/01_introduction.md).

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/server/jvm) as a reference point for this. 



