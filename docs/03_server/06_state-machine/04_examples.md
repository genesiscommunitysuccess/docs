---
title: 'State Machine - Examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, state machine, examples]
tags:
  - server
  - state machine
  - examples
---

The following example of a state machine defines five events that control the transition of trades from one state to another.

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

