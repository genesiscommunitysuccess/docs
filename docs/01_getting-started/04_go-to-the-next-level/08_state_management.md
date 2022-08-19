---
title: 'State Management'
sidebar_label: 'State Management'
id: state-management
---

[State machines](/server-modules/state-machine/introduction/) enable you to control workflow by defining the transitions from state to state. This example enables you to build a very simple state machine so that you can add new trades. We will use the `TRADE_STATUS` field, which can have three possible states: `NEW`, `ALLOCATED`, `CANCELLED`.

* `NEW` can go to `ALLOCATED` or `CANCELLED`.
* `ALLOCATED` and `CANCELLED` can’t go anywhere else.
* `NEW` is the only state you can use to insert new records.

![](/img/diagram-of-states.png)

### Data model

Make sure you added the `TRADE_STATUS` field to the `TRADE` table in the **positions-app-tutorial-tables-dictionary.kts** file.

```kotlin {4}
tables {
  table (name = "TRADE", id = 11000) {
    ...
    TRADE_STATUS

    primaryKey {
      TRADE_ID
    }

  }
  ...
}
```

If the `TRADE_STATUS` is missing, run **genesis-generated-fields** to generate the fields, and **genesis-generated-dao** to create the DAOs.

### Create a new class for the state machine

Add a `main/kotlin` folder in the event handler module *positions-app-tutorial-eventhandler* and create a state machine class called `TradeStateMachine` inside **positions-app-tutorial-eventhandler/src/main/kotlin/global/genesis**.

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

### Add the module as a dependency in the *build.gradle.kts* inside **positions-app-tutorial-script-config** module. 

```
...
api(project(":positions-app-tutorial-eventhandler"))
...
```

### Edit the event handler to add an integrated state machine

Let's edit the event handler to add an integrated state machine. First, in the **positions-app-tutorial-eventhandler.kts** file, declare a variable to be visible to all events by injecting the class `TradeStateMachine` that we have just created. 

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

Create two data classes that will be used in the cancel and allocated Event Handlers. These classes should be in **positions-app-tutorial-messages/src/main/kotlin/global/genesis/positions-app-tutorial/message/event**

* TradeAllocated
* TradeCancelled

Both classes have a single single field: **tradeId** of type `String`.

TradeAllocated:

```kotlin
data class TradeAllocated(val tradeId: String)
```

TradeCancelled:

```kotlin
data class TradeCancelled(val tradeId: String)
```

### Add the messages module as a dependency in the *build.gradle.kts* inside **positions-app-tutorial-script-config** module. 

```
...
api(project(":positions-app-tutorial-messages"))
...
```

### Add Event Handlers for the rest of the states

Create a new event handler called `TRADE_CANCELLED` to handle cancellations. Then integrate the state machine in it.

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

Create a new event handler called `TRADE_ALLOCATED` to handle completion. Integrate the state machine in it.

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

Modify or add the `TRADE_MODIFY` Event Handler to use the state machine.

```kotlin {4}
eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
    onCommit { event ->
        val trade = event.details
        stateMachine.modify(trade)
        ack()
    }
}
```

You want to manage the state of the trade, so remove the delete Event Handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

To test it, you can try to modify a `TRADE` and see the states changing accordingly. 

### Conclusion
With this we finish showing how an application can add state management if such feature is required. As usual you can [give it a try](/getting-started/go-to-the-next-level/see-it-work) or go the next section.