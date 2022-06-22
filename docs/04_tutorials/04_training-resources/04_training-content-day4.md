---
id: training-content-day4
title: Day 4
sidebar_label: Day 4
sidebar_position: 4

---
In this day we are covering:

- [Adding logic to the event handler](#adding-logic-to-the-event-handler)
- [State management​](#state-management​)
- [Auditing​](#auditing​)
- [Schedulers​](#schedulers​)

## Adding logic to the event handler

We are going to change the code in the event handler so that:

* it checks if the counterparty exists in the database (by checking COUNTERPARTY_ID field)
* it checks if the instrument exists in the database (by checking INSTRUMENT_ID field)
* it's also able to modify or delete records with the same verification on counterparty and instrument

### Add the validation code

Go to the **alpha-eventhandler.kts** file for the event handler. 

Add the verification by inserting an **verify** inside the **onValidate** block, before the **onCommit** block in TRADE_INSERT. We can see this below, with separate lines checking the Counterparty ID and the Instrument ID exist in the database. The new block ends by sending an **ack()**.

```
eventHandler<Trade>(name = "TRADE_INSERT") {
    onValidate { event ->
        val message = event.details
        verify {
            entityDb hasEntry Counterparty.ById(message.counterpartyId.toString())
            entityDb hasEntry Instrument.byId(message.instrumentId.toString())
        }
        ack()
    }
    onCommit { event ->
        val trade = event.details
        entityDb.insert(trade)
        ack()
    }
}
```

#### Try yourself
Now add separate eventHandler blocks to handle modify and delete. Don't forget to add the same verification as in TRADE_INSERT.

:::tip
Example on how to add additional blocks in the eventHandler:
```kotlin
eventHandler {
    eventHandler<Trade>(name = "TRADE_INSERT") {
        onCommit { event ->
            entityDb.insert(event.details)
            ack()
        }
    }

    eventHandler<Trade>(name = "TRADE_MODIFY") {
        onCommit { event ->
            entityDb.modify(event.details)
            ack()
        }
    }
    
    eventHandler<Counterparty>(name = "TRADE_DELETE") {
        onCommit { event ->
            entityDb.delete(event.details)
            ack()
        }
    }
}
```
:::

Implement and test the back end with Console or Postman. To do that see the Day 2 example [here](/tutorials/training-resources/training-content-day2/#a-test-alternative-to-genesis-console). Basically, you should create a POST request using the URL *http://localhost/gwf/EVENT_TRADE_MODIFY* or *http://localhost/gwf/EVENT_TRADE_DELETE*, as well as setting the header accordingly (header with SOURCE_REF and SESSION_AUTH_TOKEN). 

Regarding the UI, the Delete or Modify buttons can be added using the genesislcap/foundation-ui components as the sample below.

**home.template.ts**
```html
...
export const HomeTemplate = html<Home>`
<zero-card class="trade-card">
    <zero-ag-grid ${ref('tradesGrid')} rowHeight="45" only-template-col-defs>
    ...
        <ag-grid-column :definition=${x => x.singleTradeActionDeleteColDef}></ag-grid-column>
    </zero-ag-grid>
    ...
</zero-card>
```
**home.ts**
```kotlin
...
export class Home extends FASTElement {
    ...
    public singleTradeActionDeleteColDef: ColDef = {
        headerName: 'Action',
        minWidth: 110,
        maxWidth: 110,
        cellRenderer: 'action', // AgRendererTypes.action
        cellRendererParams: {
        actionClick: async (rowData) => {
            this.tradeData = rowData;
            const tradeCancelEvent = await this.connection.commitEvent('EVENT_TRADE_DELETE', {
            DETAILS: {
                TRADE_ID: this.tradeData.TRADE_ID,
            },
            IGNORE_WARNINGS: true,
            VALIDATE: false,
            });

            logger.debug('EVENT_TRADE_DELETE result -> ', tradeCancelEvent);
        },
        actionName: 'Delete',
        appearance: 'secondary-orange',
        },
        pinned: 'right',
    };
    ...
}
```

## State management​

State machines enable you to control workflow by defining the transitions from state to state. This example enables you to build a very simple state machine so that you can add new trades. You will create a new field called TRADE_STATUS, which can have three possible states: NEW, ALLOCATED, CANCELLED.

* NEW can go to ALLOCATED or CANCELLED.
* ALLOCATED and CANCELLED can’t go anywhere else.
* NEW is the only state you can use to insert new records.

![](/img/diagram-of-states.png)

Once we have added add a new field to the data model, we will edit the event handler file to add controlled transitions from one state to another.

### 1. Add the new field to the data model

Add the TRADE_STATUS field to the **alpha-fields-dictionary.kts** file.

```kotlin {16}
fields {
  field(name = "COUNTERPARTY", type = STRING)
  field(name = "COUNTERPARTY_LEI", type = STRING)
  field(name = "COUNTERPARTY_NAME", type = STRING)
  field(name = "ENTERED_BY", type = STRING)
  field(name = "FIELD_3", type = LONG)
  field(name = "INSTRUMENT_SYMBOL", type = STRING)
  field(name = "PRICE", type = DOUBLE)
  field(name = "QUANTITY", type = LONG)
  field(name = "REFERENCE_PX", type = STRING)
  field(name = "REFERENCE_QTY", type = DOUBLE)
  field(name = "SIDE", type = STRING)
  field(name = "SYMBOL", type = LONG)
  field(name = "TRADE_DATETIME", type = DATETIME)
  field(name = "TRADE_ID", type = LONG)
  field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))
}
```

Add the TRADE_STATUS field to the TRADE table in the **alpha-tables-dictionary.kts** file.

```kotlin {12}
tables {
  table (name = "TRADE", id = 11000) {
    // Source: Trade
    TRADE_ID            // A
    INSTRUMENT_ID not null       // B
    COUNTERPARTY_ID not null     // C
    QUANTITY            // F
    SIDE                // G
    PRICE               // H
    TRADE_DATETIME      // K
    ENTERED_BY          // L
    TRADE_STATUS

    primaryKey {
      TRADE_ID
    }

  }
}
```

Run *genesis-generated-fields* to generate the fields, AND​ *genesis-generated-dao​* to create the DAOs.

### 2. Create a new class for the state machine

Add a main folder in the event handler module *alpha-eventhandler* and create a state machine class called *TradeStateMachine*.

Add a state machine definition and assign a field in the **onCommit** block,

```kotlin
package global.genesis

import com.google.inject.Inject
import global.genesis.commons.annotation.Module
import global.genesis.db.rx.entity.multi.AsyncEntityDb
import global.genesis.db.rx.entity.multi.AsyncMultiEntityReadWriteGenericSupport
import global.genesis.db.statemachine.StateMachine
import global.genesis.db.statemachine.Transition
import global.genesis.gen.dao.Trade
import global.genesis.gen.dao.enums.TradeStatus

@Module
class TradeStateMachine @Inject constructor(
    db: AsyncEntityDb
) {
    private val internalState: StateMachine<Trade, TradeStatus, TradeEffect> = db.stateMachineBuilder {
        readState { tradeStatus }

        state(TradeStatus.NEW) {
            isMutable = true

            initialState(TradeEffect.New) {
                onValidate { trade ->
                    if (trade.isTradeIdInitialised && trade.tradeId.isNotEmpty()) {
                        verify {
                            db hasNoEntry Trade.ById(trade.tradeId)
                        }
                    }
                }
            }

            onCommit { trade ->
                if (trade.enteredBy == "TestUser") {
                    trade.price = 10.0
                }
            }

            transition(TradeStatus.ALLOCATED, TradeEffect.Allocated)
            transition(TradeStatus.CANCELLED, TradeEffect.Cancelled)
        }

        state(TradeStatus.ALLOCATED) {
            isMutable = false

            transition(TradeStatus.NEW, TradeEffect.New)
            transition(TradeStatus.CANCELLED, TradeEffect.Cancelled)
        }

        state(TradeStatus.CANCELLED) {
            isMutable = false
        }
    }

    suspend fun insert(trade: Trade): Transition<Trade, TradeStatus, TradeEffect> = internalState.create(trade)

    suspend fun insert(
        transaction: AsyncMultiEntityReadWriteGenericSupport,
        trade: Trade,
    ): Transition<Trade, TradeStatus, TradeEffect> =
        internalState.withTransaction(transaction) {
            create(trade)
        }

    suspend fun modify(tradeId: String, modify: suspend (Trade) -> Unit): Transition<Trade, TradeStatus, TradeEffect>? =
        internalState.update(Trade.ById(tradeId)) { trade, _ -> modify(trade) }

    suspend fun modify(trade: Trade): Transition<Trade, TradeStatus, TradeEffect>? = internalState.update(trade)

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
}

sealed class TradeEffect {
    object New : TradeEffect()
    object Allocated : TradeEffect()
    object Cancelled : TradeEffect()
}
```

### 3. Add the module as a dependency in the *build.gradle.kts* inside **alpha-script-config** module. 

```
...
api(project(":alpha-eventhandler"))
api("global.genesis:genesis-pal-eventhandler")
...
```

### 4. Edit the event handler to add an integrated state machine

Integrate the state machine in the TRADE_INSERT event.

```kotlin {2,15}
eventHandler<Trade>(name = "TRADE_INSERT") {
    onValidate { event ->
        val message = event.details
        verify {
            entityDb hasEntry Counterparty.ById(message.counterpartyId.toString())
            entityDb hasEntry Instrument.byId(message.instrumentId.toString())
        }
        ack()
    }
    onCommit { event ->
        val trade = event.details
        trade.enteredBy = event.userName
        stateMachine.insert(entityDb, trade)
        ack()
    }
}
```

Create two data classes that will be used in the cancel and allocated event handlers:

* TradeCancelled
* TradeAllocated

Both classes have a single single field: **tradeId**.

TradeAllocated:

```kotlin
package global.genesis.alpha.message.event

data class TradeAllocated(val tradeId: String)
```

TradeCancelled:

```kotlin
package global.genesis.alpha.message.event

data class TradeCancel(val tradeId: String)
```

Create a new event handler called TRADE_CANCELLED to handle cancellations. Then integrate the state machine in it.

```kotlin
eventHandler<TradeCancel>(transactional = true) {
    onCommit { event ->
        val message = event.details
        stateMachine.modify(entityDb, message.tradeId) { trade ->
            trade.tradeStatus = TradeStatus.CANCELLED
        }
        ack()
    }
}
```

Create a new event handler called TRADE_ALLOCATED to handle completion. Integrate the state machine in it.

```kotlin
eventHandler<TradeAllocated>(transactional = true) {
    onCommit { event ->
        val message = event.details
        stateMachine.modify(entityDb, message.tradeId) { trade ->
            trade.tradeStatus = TradeStatus.ALLOCATED
        }
        ack()
    }
}
```

Modify the TRADE_MODIFY event handler to use the state machine.

```kotlin {5}
eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
    onCommit { event ->
        val trade = event.details
        stateMachine.modify(entityDb, trade)
        ack()
    }
}
```

Remove the TRADE_DELETE event handler.

You want to manage the state of the trade, so remove the delete event handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

To test it, you can try to modify a TRADE and see the states changing accordingly. 

### Try yourself
Modify the class TradeStateMachine to keep the trade.price removing the current rule when TradeStatus.NEW, and set the field trade.enteredBy to empty when TradeStatus.CANCELLED.

Remember to run *assemble* and *deploy-genesisproduct-alpha* tasks after the changes, and test it directly in the UI.

## Auditing​

We want to be able to track the changes made to the various trades on the TRADE table, such that we could see the times and modifications made in the history of the trade. So, we are going to add basic auditing to the TRADE table in order to keep a record of the changing states of the trades.

This can be useful for historical purposes, if you need to at a later date be able to produce an accurate course of events.

### Adding Basic Auditing

#### Adding audit to table dictionary

The first step to add basic auditing is to change the relevant table dictionary. In this instance we will be making changes to the **alpha-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

```kotlin {2}
table (name = "TRADE", id = 2000, audit = details(id = 2100, sequence = "TR")) {
    sequence(TRADE_ID, "TR")
    COUNTERPARTY_ID
    INSTRUMENT_ID
    QUANTITY
    PRICE
    SYMBOL
    DIRECTION
    SIDE
    TRADE_DATE
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

The id parameter indicates the id of the newly created audit table, and will need to be different from any other table id.

If you are using the GPAL event handlers, this is sufficient to enable auditing on this table. A new table is created by the name of the original table, with the **_AUDIT** suffix added to the end. In this instance that would be the **TRADE_AUDIT** table.

#### Updating the state machine to use auditing

Next you need to change the insert, and modify methods in the **TradeStateMachine.kts** file. Specifically, each method must be edited so that the method signature uses the **AsyncMultiEntityReadWriteGenericSupport** parameter and the `internalState.withTransaction(transaction) { }` code block.  For example:

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

#### Update the event handlers to use auditing

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

To test it, you can try to insert or modify a TRADE and see the auditing happening accordingly.

