---
sidebar_label: 'Define your state machine'
title: 'Define your state machine'
sidebar_position: 1
id: define
---

One of the key things you need to define in your data model is the various states that your financial entities (such as orders or trades) can go through - for example, *new*, *amended*, *completed* or *cancelled*.

Separately from this, you need to define state machines that control how the entity transititions from one state to another. For example, you could define a transition from *new* to *amended*. This would specify the fields that need to have valid values to progress - such as a trade price of more than zero.

Effectively, you are defining how the system validates the transition from one state to another.

And if you don't specify a transition, it won't be possible. For example, you almost certainly will not want to define a transition from *amended* to *new*. You might, however, want to specify a transition from *cancelled* to *amended* with very specific validation.

You define your state machine as a specific type of event handler. It must define a number of different events, and specify what should happen at each event to ensure that the state of the entity (trade or order) can be changed.

Here is an example of an event - in this case, a modification to a draft trade. The three key requirements for the event are:

* **excludedFields**, those that are not checked.
* **onEvent**, where system action is specified. 
* **onValidate**, where we specify any validation requirements - in this case, checking for a valid price and quantity.

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

You can click to view the [whole file for this example state machine](/creating-applications/defining-your-application/business-logic/state-machines/examples/) and see how each of the events is handled.

You can also see a state machine being created in practice in our [tutorial](/tutorials/building-an-application/add-state-machine/).





