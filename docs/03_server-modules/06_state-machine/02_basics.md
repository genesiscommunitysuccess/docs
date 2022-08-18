---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---


You define your state machine as a specific type of Event Handler. 

Within your application's **eventhandler.kts**, you must define the conditions for each possible change of state. Remember, if you don't the conditions for changing from state to another, then it will not be possible for the application to make that transition.

Here is an example of an event - in this case, a modification to a draft trade. The three key requirements for the event are:

- **excludedFields**, those that are not checked.
- **onEvent**, where system action is specified.
- **onValidate**, where you specify any validation requirements - in this case, checking for a valid price and quantity.

```kotlin
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
    // ... rest of the code
}

```

You can click to view the [whole file for this example state machine](/server-modules/state-machine/examples/) and see how each of the events is handled.

You can also see a state machine being created in practice in our [tutorial](/getting-started/go-to-the-next-level/state-management/).





