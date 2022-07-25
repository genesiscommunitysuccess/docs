---
id: training-content-day4
title: Day 4
sidebar_label: Day 4
sidebar_position: 6

---
In this day we are covering:

- [State management​](#state-management​)
- [Adding logic to the event handler](#adding-logic-to-the-event-handler)
- [Auditing​](#auditing​)

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
    ...
    field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))
}
```

Add the TRADE_STATUS field to the TRADE table in the **alpha-tables-dictionary.kts** file.

```kotlin {12}
tables {
  table (name = "TRADE", id = 11000) {
    ...
    TRADE_STATUS

    primaryKey {
      TRADE_ID
    }

  }
}
```

Run *genesis-generated-fields* to generate the fields, AND​ *genesis-generated-dao​* to create the DAOs.

### 2. Create a new class for the state machine

Add a main folder in the event handler module *alpha-eventhandler* and create a state machine class called *TradeStateMachine* inside **alpha-eventhandler/src/main/kotlin/global/genesis**.

Add a state machine definition and assign a field in the **onCommit** block,

```kotlin
package global.genesis

import com.google.inject.Inject
import global.genesis.commons.annotation.Module
import global.genesis.db.rx.entity.multi.AsyncEntityDb
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

            transition(TradeStatus.NEW, TradeEffect.Cancelled)
            transition(TradeStatus.CANCELLED, TradeEffect.Cancelled)
        }

        state(TradeStatus.CANCELLED) {
            isMutable = false
        }
    }

    suspend fun insert(trade: Trade): Transition<Trade, TradeStatus, TradeEffect> = internalState.create(trade)

    suspend fun modify(tradeId: String, modify: suspend (Trade) -> Unit): Transition<Trade, TradeStatus, TradeEffect>? =
        internalState.update(Trade.ById(tradeId)) { trade, _ -> modify(trade) }

    suspend fun modify(trade: Trade): Transition<Trade, TradeStatus, TradeEffect>? = internalState.update(trade)
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
...
```

### 4. Edit the event handler to add an integrated state machine

Let's edit the event handler to add an integrated state machine. First, in the **alpha-eventhandler.kts** file declare a variable to be visible to all events injecting the class `TradeStateMachine` we just created. 

```kotlin {2}
eventHandler {
    val stateMachine = inject<TradeStateMachine>()

    eventHandler<Trade>(name = "TRADE_INSERT", transactional = true) {
        ...
    }
    ...
}
```

Then, integrate the state machine in the TRADE_INSERT event *onCommit*.

```kotlin {2,5}
eventHandler<Trade>(name = "TRADE_INSERT") {
    onCommit { event ->
        val trade = event.details
        trade.enteredBy = event.userName
        stateMachine.insert(trade)
        ack()
    }
}
```

Create two data classes that will be used in the cancel and allocated event handlers. These classes should be in **alpha-messages/src/main/kotlin/global/genesis/alpha/message/event**

* TradeAllocated
* TradeCancelled

Both classes have a single single field: **tradeId**.

TradeAllocated:

```kotlin
package global.genesis.alpha.message.event

data class TradeAllocated(val tradeId: String)
```

TradeCancelled:

```kotlin
package global.genesis.alpha.message.event

data class TradeCancelled(val tradeId: String)
```

Create a new event handler called TRADE_CANCELLED to handle cancellations. Then integrate the state machine in it.

```kotlin
eventHandler<TradeCancelled>(name = "TRADE_CANCELLED", transactional = true) {
    onCommit { event ->
        val message = event.details
        stateMachine.modify(message.tradeId) { trade ->
            trade.tradeStatus = TradeStatus.CANCELLED
        }
        ack()
    }
}
```

Create a new event handler called TRADE_ALLOCATED to handle completion. Integrate the state machine in it.

```kotlin
eventHandler<TradeAllocated>(name = "TRADE_ALLOCATED", transactional = true) {
    onCommit { event ->
        val message = event.details
        stateMachine.modify(message.tradeId) { trade ->
            trade.tradeStatus = TradeStatus.ALLOCATED
        }
        ack()
    }
}
```

Modify or add the TRADE_MODIFY event handler to use the state machine.

```kotlin {4}
eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
    onCommit { event ->
        val trade = event.details
        stateMachine.modify(trade)
        ack()
    }
}
```

Remove the TRADE_DELETE event handler if you included it before.

You want to manage the state of the trade, so remove the delete event handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

To test it, you can try to modify a TRADE and see the states changing accordingly. 

### Exercise 4.1: state machines
:::info ESTIMATED TIME
20 mins
:::
Modify the class TradeStateMachine to keep the trade.price removing the current rule when TradeStatus.NEW, and set the field trade.enteredBy to empty when TradeStatus.CANCELLED.

Remember to run *assemble* and *deploy-genesisproduct-alpha* tasks after the changes, and test it directly in the UI.


## Adding logic to the event handler

We are going to change the code in the event handler so that:

* it checks if the counterparty exists in the database (by checking COUNTERPARTY_ID field)
* it checks if the instrument exists in the database (by checking INSTRUMENT_ID field)
* it's also able to modify records with the same verification on counterparty and instrument

### Add the validation code

Go to the **alpha-eventhandler.kts** file for the event handler. 

Add the verification by inserting an **verify** inside the **onValidate** block, before the **onCommit** block in TRADE_INSERT. We can see this below, with separate lines checking the Counterparty ID and the Instrument ID exist in the database. The new block ends by sending an **ack()**.

```kotlin {2-9}
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
        stateMachine.insert(trade)
        ack()
    }
}
```

### Exercise 4.2: adding onValidate to event handlers
:::info ESTIMATED TIME
20 mins
:::
Add the same verification `onValidate` as in TRADE_INSERT to the TRADE_MODIFY event handler.


Implement and test the back end with Console or Postman. To do that see the Day 2 example [here](/tutorials/training-resources/training-content-day2/#a-test-alternative-to-genesis-console). Basically, you should create a POST request using the URL *http://localhost/gwf/EVENT_TRADE_MODIFY*, as well as setting the header accordingly (header with SOURCE_REF and SESSION_AUTH_TOKEN). 

Regarding the UI, the Cancel button can be added using the genesislcap/foundation-ui components as the sample below.

**home.template.ts**
```html {14}
...
export const HomeTemplate = html<Home>`
<div class="split-layout">
    <div class="top-layout">
        <zero-card class="trade-card">
            <span class="card-title">Trades</span>
            <zero-ag-grid ${ref('tradesGrid')} rowHeight="45" only-template-col-defs>
                ${when(x => x.connection.isConnected, html`
                  <ag-genesis-datasource resourceName="ALL_TRADES"></ag-genesis-datasource>
                  ${repeat(() => tradeColumnDefs, html`
                    <ag-grid-column :definition="${x => x}" />
                  `)}
                `)}
                <ag-grid-column :definition=${x => x.singleTradeActionCancelColDef}></ag-grid-column>
            </zero-ag-grid>
        </zero-card>
    </div>
    ...
</div>
`;
```
**home.ts**
```kotlin
...
export class Home extends FASTElement {
    ...
    public singleTradeActionCancelColDef: ColDef = {
        headerName: 'Action',
        minWidth: 110,
        maxWidth: 110,
        cellRenderer: 'action', // AgRendererTypes.action
        cellRendererParams: {
        actionClick: async (rowData) => {
            this.tradeData = rowData;
            const tradeCancelEvent = await this.connection.commitEvent('EVENT_TRADE_CANCELLED', {
            DETAILS: {
                TRADE_ID: this.tradeData.TRADE_ID,
            },
            IGNORE_WARNINGS: true,
            VALIDATE: false,
            });

            logger.debug('EVENT_TRADE_CANCELLED result -> ', tradeCancelEvent);
        },
        actionName: 'Cancel',
        appearance: 'secondary-orange',
        },
        pinned: 'right',
    };
    ...
}
```

## Auditing​

We want to be able to track the changes made to the various trades on the TRADE table, such that we could see the times and modifications made in the history of the trade. So, we are going to add basic auditing to the TRADE table in order to keep a record of the changing states of the trades.

This can be useful for historical purposes, if you need to at a later date be able to produce an accurate course of events.

### Adding Basic Auditing

#### Adding audit to table dictionary

The first step to add basic auditing is to change the relevant table dictionary. In this instance we will be making changes to the **alpha-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

```kotlin {1}
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

As we are using the GPAL event handlers, this is sufficient to enable auditing on this table. A new table is created by the name of the original table, with the **_AUDIT** suffix added to the end. In this instance that would be the **TRADE_AUDIT** table.

#### Updating the state machine to use auditing

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

Run the *dao*, *build* and *deploy* tasks.

### Exercise 4.3: testing an audited table
:::info ESTIMATED TIME
20 mins
:::
Try to insert or modify a TRADE and see the auditing happening accordingly. You can use DbMon or Genesis Console to check the data in table TRADE_AUDIT.
