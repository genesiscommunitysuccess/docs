---
title: 'State Machine - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, state machine, basics]
tags:
  - server
  - state machine
  - basics
---

You define your State Machine as a specific type of Event Handler. 

Within your application's **eventhandler.kts**, you must define the conditions for each possible change of state. Remember, if you don't the conditions for changing from one state to another, then it will not be possible for the application to make that transition.

You can initialise the State Machine in two ways as shown below:

- Firstly you need an ENUM field that holds the state

- One way of initialising is to provide the field of the table that holds the state, and it will always be transaction if the database layer supports it.
```kotlin
// tableField: the field of table which holds the state and will always be transaction if the database layer supports it.
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS) {
        
    }
}
```

- Another way to initialise is to provide the field of table which holds the state and choose whether you want to make the event Transactional or not by providing boolean value.
```kotlin
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS, transactional = true) {
        
    }
}
````

A State Machine enables you to add constraints to functions such as insert trade, modify trade and transition trade from one state to another.

With a State Machine, you can perform all the same operations that you are able to perform with Event Handlers, but there are some restrictions on workflows. Here are some examples:

## insertEvent

This event enables you to insert a trade. The name of the event must be EVENT_{entity_name}_INSERT. So, in this example it is `EVENT_TRADE_INSERT`.

```kotlin
eventHandler {
    stateMachine(TRADE.TRADE_STATUS) {
        insertEvent {
            initialStates(TradeStatus.DRAFT)

            excludedFields {
                ENTERED_BY
                ENTERED_TIME
                MODIFIED_BY
                MODIFIED_TIME
            }

            onEvent { event ->
                event.withDetails {
                    enteredBy = event.userName
                    enteredTime = now()
                }
            }

            onValidate { trade ->
                verifyOnly { trade hasField TRADE.PRICE }
                verifyOnly { trade hasField TRADE.QUANTITY greaterThan 0 }
            }
        }
    }
}
```

Let's look at the codeblocks inside `insertEvent`:

- **initialStates** : this covers the insertion of a new trade, when the status is set to DRAFT. 
- **excludedFields** : this deliberately ignores the fields `ENTERED_BY`, `ENTERED_TIME`, `MODIFIED_BY` and `MODIFIED_TIME`. 
- **onEvent** : this provides event information, which can be used to get information such as event user, event time, etc.

## modifyEvent

This event enables you to modify a trade. The name of the event must be EVENT_{entity_name}_MODIFY. So, in this example it is `EVENT_TRADE_MODIFY`.

```kotlin
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS) {
        modifyEvent {
            mutableStates(TradeStatus.DRAFT, TradeStatus.OPEN)

            excludedFields {
                ENTERED_BY
                ENTERED_TIME
                MODIFIED_BY
                MODIFIED_TIME
            }

            onEvent { event, trade ->
                trade.modifiedBy = event.userName
                trade.modifiedTime = now()
            }

            onValidate { trade ->
                verifyOnly { trade hasField TRADE.PRICE }
                verifyOnly { trade hasField TRADE.QUANTITY greaterThanOrEqual 0 }
            }
        }
    }
}
```

Let's look at the codeblocks inside `modifyEvent`:

- **mutableStates** : this specifies the trade can be modified when TRADE_STATUS is DRAFT or OPEN
- **excludedFields** : this can be used to ignore some fields
- **onEvent** : this provides event information that can be used to get information such as event user, event time etc.

## transitionEvent

This enables you to specify events that define the possible transitions of the `TRADE_STATUS` field. The events are created using `transitionEvent`. In the example below, we specify three transitions (events): 

- `EVENT_TRADE_OPEN`
- `EVENT_TRADE_CLOSED`
- `EVENT_TRADE_CANCELLED`

```kotlin
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS) {
        transitionEvent(TradeStatus.OPEN) {
            fromStates(TradeStatus.DRAFT)

            onEvent { event, trade ->
                trade.modifiedBy = event.userName
                trade.modifiedTime = now()
            }
        }

        transitionEvent(TradeStatus.CLOSED) {
            fromStates(TradeStatus.DRAFT)

            onEvent { event, trade ->
                trade.modifiedBy = event.userName
                trade.modifiedTime = now()
            }
        }

        transitionEvent(TradeStatus.CANCELLED) {
            fromStates(TradeStatus.DRAFT)

            onEvent { event, trade ->
                trade.modifiedBy = event.userName
                trade.modifiedTime = now()
            }
        }
    }
}
```

Let's look at the codeblocks inside `transitionEvent`:

- **fromStates** : this enables you to specify the transitions (from and to). In the above example, the transitions are: DRAFT to OPEN, DRAFT to CLOSED, DRAFT to CANCELLED. No other transitions are possible.
- **onEvent** : this provides event information, which can be used to get information such as event user, event time, etc.

You can click to view the [whole file for this example state machine](/server/state-machine/examples/) and see how each of the events is handled.
