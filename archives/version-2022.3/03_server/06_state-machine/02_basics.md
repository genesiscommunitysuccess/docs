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

You define your state machine as a specific type of Event Handler. 

Within your application's **eventhandler.kts**, you must define the conditions for each possible change of state. Remember, if you don't define the conditions for changing from state to another, then it will not be possible for the application to make that transition.

Before you start to define your State Machine, you need to define an ENUM field to hold the state. There are two ways to define the State Machine:


- **Method 1**. Provide the field of the table that holds the state. This defaults the events under the state machine to be transactional (if the database layer supports it). For example:
```kotlin
// tableField: the field of table which holds the state and will always be transaction if the database layer supports it.
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS) {
        
    }
}
```

- **Method 2**. Provide the field of table that holds the state, and explicitly choose whether you want to make the events transactional or not by providing a boolean value.
```kotlin
eventHandler {
    stateMachine(tableField = TRADE.TRADE_STATUS, transactional = true) {
        
    }
}
````

A State Machine enables you to add constraints to insert trade, modify trade and transition trade from one state to another

With state machine you can perform all operations you do with Event Handlers along with adding some constraints on workflows as shown below with examples:

## insertEvent

With this event you can insert trade using this method. The name of the event would be EVENT_{entity_name}_INSERT so in this example it EVENT_TRADE_INSERT

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

**initialStates** : This covers the insertion of a new trade, when the status is set to DRAFT. 
**excludedFields** : It deliberately ignores the fields ENTERED_BY, ENTERED_TIME, MODIFIED_BY and MODIFIED_TIME. 
**onEvent** : It provides event information, which can be used to get information like event user, event time, etc.

## modifyEvent

Using the modifyEvent method you can modify trade. The name of the event is written EVENT_{entity_name}_MODIFY so in this example it would be EVENT_TRADE_MODIFY

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

**mutableStates** : Which specifies the trade can be modified when TRADE_STATUS is DRAFT or OPEN
**excludedFields** : Use it to ignore some fields
**onEvent** : It provides event information which can be used to get information like event user, event time etc.

## transitionEvent

With this you can specify possible transitions of TRADE_STATUS field. Events are created based on transitionEvent. In above example the following events are created EVENT_TRADE_OPEN, EVENT_TRADE_CLOSED, EVENT_TRADE_CANCELLED

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

**fromStates** : With this method you can specify what is the possible transition of Trade status. In above example possible transitions are: DRAFT to OPEN, DRAFT to CLOSED, DRAFT to CANCELLED
**onEvent** : It provides event information, which can be used to get information like event user, event time, etc.

You can click to view the [whole file for this example state machine](../../../server/state-machine/examples/) and see how each of the events is handled.
