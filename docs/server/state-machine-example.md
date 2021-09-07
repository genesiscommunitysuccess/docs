---
sidebar_label: 'State machine example'
---

# State machine example

The following example of a state machine defines five events that control the transition of trades from one state to another.

## insertEvent
The first event is an **insertEvent**. This covers the insertion of a new trade, where the status is set to DRAFT.  For **excludedFields**, it deliberately ignores the fields ENTERED_BY, ENTERED_TIME, MODIFIED_BY and MODIFIED_TIME. With **onEvent**, it requires the name of the user who created the event before the the trade can be accepted as a draft trade. The current time is used as the **enteredTime**. With **onValidate**, it checks that the TRADE.PRICE and TRADE.QUANTITY fields have valid values.

## modifyEvent
The second event is a **modifyEvent**, where the user who is modifying the trade and the modification time are captured in  **onEvent**, and there are checks for a valid quantity and price in  **onValidate**.

## transitionEvent
The third, fourth and fifth events are of the type **transitionEvent**, which controls the transitions between the states. The first defines the transition from DRAFT to 
OPEN. The second defines the transition from DRAFT to 
CLOSED. The third defines the transition from DRAFT to 
CANCELLED.  no other transitions have been defined, so it is not possible, for example, to transition from CLOSED to CANCELLED.

```eventHandler {
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

