---
title: 'Modules - Inside an Event Handler'
sidebar_label: 'Inside an Event Handler'
id: inside-an-event-handler
keywords: [getting started, basics, modules, event handler]
tags:
    - getting started
    - basics
    - modules
    - event handler
---

Applications must respond immediately to different types of input: inputs from users, messages from other systems, market-data updates and internally calculated analytic signals.  These inputs are events.

Your application needs to respond to each event with relevant actions. 

As a rough guide, many of the tables you have created need Insert, Modify and Delete events, so that you can specify the actions that these events require.

You specify the actions in a single Kotlin script file. If your application is called bravo, then the file would be called **bravo-eventhandler.kts**.

Here is a simple example of an Event Handler file. It defines a single eventHandler. Within the eventHandler, the onCommit codeblock inserts a counterparty into the database, using our internal API, the entityDb.


```kotlin
eventHandler {
    eventHandler<Counterparty> {
        onCommit { event ->
            val counterparty = event.details
            entityDb.insert(counterparty)
            ack()
        }
    }
}
```
Your application will certainly have many more eventHandler codeblocks inside the **eventhandler.kts** file. But, you have just seen the basics.



