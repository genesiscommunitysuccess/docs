---
id: training-content-day4
title: Day 4
sidebar_label: Day 4
sidebar_position: 6

---
This day covers:

- [State management​](#state-management)
- [Adding logic to the Event Handler](#adding-logic-to-the-event-handler)
- [Auditing​](#auditing)





## State management​

State machines enable you to control workflow by defining the transitions from state to state. This example enables you to build a very simple state machine so that you can add new trades. You will create a new field called TRADE_STATUS, which can have three possible states: NEW, ALLOCATED, CANCELLED.

* NEW can go to ALLOCATED or CANCELLED.
* ALLOCATED and CANCELLED can’t go anywhere else.
* NEW is the only state you can use to insert new records.

![](/img/diagram-of-states.png)

Once we have added a new field to the data model, we will edit the Event Handler file to add controlled transitions from one state to another.

### 1. Data model

Make sure you added the TRADE_STATUS field to the TRADE table in the **alpha-tables-dictionary.kts** file.

```kotlin {4}
tables {
  table (name = "TRADE", id = 2000) {
    ...
    TRADE_STATUS

    primaryKey {
      TRADE_ID
    }

  }
  ...
}
```

If the TRADE_STATUS is missing, run `genesis-generated-fields` to generate the fields, AND​ `genesis-generated-dao​` to create the DAOs.

### 2. Create a new class for the state machine

Add a main folder in the Event Handler module **alpha-eventhandler** and create a state machine class called `TradeStateMachine` inside **alpha-eventhandler/src/main/kotlin/global/genesis**.

Add a state machine definition and assign a field to the `onCommit` block,

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

### 3. Add the module as a dependency
You need to add the module to the **build.gradle.kts** inside the **alpha-script-config** module. 

```
...
api(project(":alpha-eventhandler"))
...
```

### 4. Edit the Event Handler to add an integrated state machine

Let's edit the Event Handler to add an integrated state machine. First, in the **alpha-eventhandler.kts** file, declare a variable to be visible to all events by injecting the class `TradeStateMachine` that we have just created. 

```kotlin {2}
eventHandler {
    val stateMachine = inject<TradeStateMachine>()

    eventHandler<Trade>(name = "TRADE_INSERT", transactional = true) {
        ...
    }
    ...
}
```

Then, integrate the state machine in the `onCommit` block of the `TRADE_INSERT Event Handler.

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

Create two data classes that will be used in the cancel and allocated Event Handlers. These classes should be in **alpha-messages/src/main/kotlin/global/genesis/alpha/message/event**

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

Create a new Event Handler called TRADE_ALLOCATED to handle completion. Integrate the state machine in it.

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

Modify or add the TRADE_MODIFY Event Handler to use the state machine.

```kotlin {4}
eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
    onCommit { event ->
        val trade = event.details
        stateMachine.modify(trade)
        ack()
    }
}
```

Remove the TRADE_DELETE Event Handler if you included it before.

You want to manage the state of the trade, so remove the delete Event Handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

To test it, you can try to modify a TRADE and see the states changing accordingly. 

### Exercise 4.1: state machines
:::info ESTIMATED TIME
40 mins
:::
Modify the class TradeStateMachine to keep the `trade.price`. Remove the current rule when TradeStatus.NEW, and set the field trade.enteredBy to empty when TradeStatus.CANCELLED.

:::info UI CHANGES
Open the **home.ts** file and add the TRADE_STATUS field in the const *COLUMNS*. The Cancel button can be added using the *Permissions.delete*.

```kotlin {29-33,45}
...
//grid columns that will be showed
const COLUMNS = [
  {
    ...defaultColumnConfig,
    field: 'TRADE_ID',
    headerName: 'Id',
  },
  {
    ...defaultColumnConfig,
    field: 'QUANTITY',
    headerName: 'Quantity',
  },
  {
    ...defaultColumnConfig,
    field: 'PRICE',
    headerName: 'Price',
  },
  {
    ...defaultColumnConfig,
    field: 'SYMBOL',
    headerName: 'Symbol',
  },
  {
    ...defaultColumnConfig,
    field: 'DIRECTION',
    headerName: 'Direction',
  },
  {
    ...defaultColumnConfig,
    field: 'TRADE_STATUS',
    headerName: 'Status',
  },  
];

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
    ...
    constructor() {
      super();
      this.permissionsTrade = [Permissions.add, Permissions.delete]; //permissions will show the Grid buttons
    }
}

```

And add the `deleteEvent` to the **home.template.ts** file.

```html {10}
...
export const HomeTemplate = html<Home>`
<div class="split-layout">
    <div class="top-layout">
        <entity-management
          resourceName="ALL_TRADES"
          title = "Trades"
          entityLabel="Trades"
          createEvent = "EVENT_TRADE_INSERT"
          deleteEvent = "EVENT_TRADE_CANCELLED"
          :columns=${x => x.columns}
          :permissions=${x => x.permissionsTrade}
        ></entity-management>
    ...
    </div>
</div>
`;
```
:::

Remember to run `assemble` and `deploy-genesisproduct-alpha` tasks after the changes, and test it directly in the UI.


## Adding logic to the Event Handler

We are going to change the code in the Event Handler so that:

* it checks if the counterparty exists in the database (by checking COUNTERPARTY_ID field)
* it checks if the instrument exists in the database (by checking INSTRUMENT_ID field)
* it is able to modify records with the same verification on counterparty and instrument

### Add the validation code

Go to the **alpha-eventhandler.kts** file for the Event Handler. 

Add the verification by inserting a `verify` inside the `onValidate` block, before the `onCommit` block in TRADE_INSERT. We can see this below, with separate lines checking that the Counterparty ID and the Instrument ID exist in the database. The new block ends by sending an **ack()**.

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

### Exercise 4.2: adding onValidate to Event Handlers
:::info ESTIMATED TIME
20 mins
:::
Add the same verification `onValidate` as in TRADE_INSERT to the TRADE_MODIFY Event Handler.


Implement and test the back end with Console or Postman. To do that, see the [Day 2 example](/tutorials/training-resources/training-content-day2/#a-test-alternative-to-genesis-console). Basically, you should create a POST request using the URL *http://localhost/gwf/EVENT_TRADE_MODIFY*, as well as setting the header accordingly (header with SOURCE_REF and SESSION_AUTH_TOKEN). 

## Auditing​

We want to be able to track the changes made to the various trades on the TRADE table, such that we could see the times and modifications made in the history of the trade. So, we are going to add basic auditing to the TRADE table.

This can be useful if you need to provide an accurate audit of events at a later date.

### Adding basic auditing

#### Adding audit to table dictionary

The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **alpha-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

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

The id parameter indicates the id of the newly created audit table, and must be different from any other table id.

As we are using the GPAL Event Handlers, this is sufficient to enable auditing on the table. A new table is created by the name of the original table, with the **_AUDIT** suffix added. In this instance, it would be the **TRADE_AUDIT** table.

#### Updating the state machine to use auditing

Next you need to extend the insert, and modify methods in the **TradeStateMachine.kt** file. Specifically, each method must be have a second option so that the method signature uses the `AsyncMultiEntityReadWriteGenericSupport` parameter and the `internalState.withTransaction(transaction) { }` code block.  For example:

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

#### Update the Event Handlers to use auditing

Now you must update the **alpha-eventhandler.kts** in order to pass the `entityDb` object into the updated methods of the state machine. The object is passed as the **syncMultiEntityReadWriteGenericSupport** parameter. This should resemble the example below:

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

### Exercise 4.3: testing an audited table
:::info ESTIMATED TIME
20 mins
:::
Try to insert or modify a TRADE and see the auditing happening accordingly. You can use `DbMon` or Genesis Console to check the data in the TRADE_AUDIT table.
