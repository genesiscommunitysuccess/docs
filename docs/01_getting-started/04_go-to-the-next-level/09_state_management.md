---
title: 'State Management'
sidebar_label: 'State Management'
id: state-management
---

[State machines](/server-modules/state-machine/introduction/) enable you to control workflow by defining the transitions from state to state. This example enables you to build a very simple state machine so that you can add new trades. We shall use the `TRADE_STATUS` field, which can have three possible states: `NEW`, `ALLOCATED`, or `CANCELLED`.

Based on below state machine:
* TradeStatus `NEW` can change to `ALLOCATED` or `CANCELLED`.
* TradeStatus `ALLOCATED` can change to `CANCELLED`.
* TradeStatus `CANCELLED` can’t go anywhere else.
* `NEW` is the only state you can use to insert new records.

![](/img/diagram-of-states.png)

### Data model

Make sure that you added the `TRADE_STATUS` field to the `TRADE` table in the **positions-app-tutorial-tables-dictionary.kts** file.

```kotlin {4}
tables {
    table (name = "TRADE", id = 11000) {

        ...
        TRADE_STATUS
        ...

        primaryKey {
            TRADE_ID
        }
    }
}
```

If `TRADE_STATUS` is missing, add it in, run **generateFields** to generate the fields and then **generateDao** to create the DAOs.

### Create the State Machine logic and data classes

Fist we need to define our state machine class for type `Trade`. To do this, create a file called `TradeStateMachine.kt` under **positions-app-tutorial-eventhandler/src/main/kotlin/global/genesis**.

Add a state machine definition and assign a field in the `onCommit` block:

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
            // Trade fields can be changed when status is NEW
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
            // Trade fields cannot be changed when status is ALLOCATED
            isMutable = false

            transition(TradeStatus.CANCELLED, TradeEffect.Cancelled)
        }

        state(TradeStatus.CANCELLED) {
            // Trade fields cannot be changed when status is CANCELLED
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

Next, we want to create two data classes that will be used in the cancel and allocated Event Handlers. Create two data classes called `TradeAllocated.kt` and `TradeCancelled.kt` under **positions-app-tutorial-messages/src/main/kotlin/global/genesis/message/event/**.

Both data classes have a single field: `tradeId` of type `String`.

TradeAllocated:

```kotlin
data class TradeAllocated(val tradeId: String)
```

TradeCancelled:

```kotlin
data class TradeCancelled(val tradeId: String)
```

### Updating the dependencies for positions-app-tutorial-script-config

In order to use the following `TradeStateMachine` and data classes (`TradeAllocated` and `TradeCancelled`) we just defined, we need to add the **positions-app-tutorial-eventhandler** and **positions-app-tutorial-messages** modules as dependencies inside the **positions-app-tutorial-script-config** modules `build.gradle` file.

```kotlin
api(project(":positions-app-tutorial-eventhandler"))
api(project(":positions-app-tutorial-messages"))
```

Finally, refresh your gradle project.

### Edit the Event Handler to add an integrated state machine

Let's edit the Event Handler to add an integrated state machine. First, in the **positions-app-tutorial-eventhandler.kts** file, declare a variable to be visible to all events by injecting the class `TradeStateMachine` that we have just created. 

```kotlin {2}
eventHandler {
    val stateMachine = inject<TradeStateMachine>()

    eventHandler<Trade>(name = "TRADE_INSERT", transactional = true) {
        ...
    }
}
```

Then, replace the `entryDb.insert(event.details)` with the highlighted lines below in the `TRADE_INSERT` `onCommit` block.

```kotlin {3,4,5}
eventHandler<Trade>(name = "TRADE_INSERT", transactional = true) {
    onCommit { event ->
        val trade = event.details
        trade.enteredBy = event.userName
        stateMachine.insert(trade)
        ack()
    }
}
```

:::info
You may have noticed we are passing a `transactional = ture` parameter into our event handler. This ensures any exception or nack returned will result in a complete rollback of all parts of the onCommit and onValidate (the transaction also covers read commands) blocks. You can read more on transactions [here](/server-modules/event-handler/basics/#transactional-event-handlers-acid)
:::

### Add Event Handlers for the rest of the states

Create a new Event Handler called `TRADE_CANCELLED` to handle cancellations. Then integrate the state machine in it.

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

Create a new Event Handler called `TRADE_ALLOCATED` to handle completion. Integrate the state machine in it.

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

Create a new Event Handler called `TRADE_MODIFY` to handle modifications. Integrate the state machine in it.

```kotlin {4}
eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
    onCommit { event ->
        val trade = event.details
        stateMachine.modify(trade)
        ack()
    }
}
```

You **positions-app-tutorial-eventhandler.kts** file at the end should look this:

```kotlin
import global.genesis.TradeStateMachine
import global.genesis.message.event.TradeAllocated
import global.genesis.message.event.TradeCancelled

eventHandler {
    val stateMachine = inject<TradeStateMachine>()

    eventHandler<Trade>(name = "TRADE_INSERT", transactional = true) {
        onCommit { event ->
            val trade = event.details
            trade.enteredBy = event.userName
            stateMachine.insert(trade)
            ack()
        }
    }

    eventHandler<TradeCancelled>(name = "TRADE_CANCELLED", transactional = true) {
        onCommit { event ->
            val message = event.details
            stateMachine.modify(message.tradeId) { trade ->
                trade.tradeStatus = TradeStatus.CANCELLED
            }
            ack()
        }
    }

    eventHandler<TradeAllocated>(name = "TRADE_ALLOCATED", transactional = true) {
        onCommit { event ->
            val message = event.details
            stateMachine.modify(message.tradeId) { trade ->
                trade.tradeStatus = TradeStatus.ALLOCATED
            }
            ack()
        }
    }

    eventHandler<Trade>(name = "TRADE_MODIFY", transactional = true) {
        onCommit { event ->
            val trade = event.details
            stateMachine.modify(trade)
            ack()
        }
    }
}
```

You want to manage the state of the trade, so we don't want a delete Event Handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

To test it, you can try to modify a `TRADE` (assuming you already have at least one trade in the database) and see the state change accordingly. 

### Conclusion
With this, we finish showing how an application can add state management. As usual, you can either [give it a try](/getting-started/go-to-the-next-level/see-it-work) or go the next section.
