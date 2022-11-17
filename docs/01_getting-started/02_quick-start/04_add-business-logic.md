---
title: 'Quick Start - Add business logic'
sidebar_label: 'Add business logic'
id: add-business-logic
keywords: [getting started, quick start, dataserver, event handler, business logic]
tags:
    - getting started
    - quick start
    - dataserver
    - event handler
    - business logic
---

<<<<<<< Updated upstream
So far, we have a table; now we want to be able to see its content and create new entries.


## Data Server
=======
We have a table; now we want to be able to see its content and create new entries.


### Data Server
>>>>>>> Stashed changes
A [Data Server](/server/data-server/introduction/) allows for reading of real-time data. You must define the Data Server in the file **alpha-dataserver.kts**.

```kotlin
dataServer {
    query("ALL_TRADES", TRADE)
}
```

<<<<<<< Updated upstream
## Event Handler
=======
### Event Handler
>>>>>>> Stashed changes
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](/server/event-handler/introduction/) in the file **alpha-eventhandler.kts**.

```kotlin
eventHandler {

    eventHandler<Trade>(name = "TRADE_INSERT") {
        onCommit { event ->
            entityDb.insert(event.details)
            ack()
        }
    }

}
```
