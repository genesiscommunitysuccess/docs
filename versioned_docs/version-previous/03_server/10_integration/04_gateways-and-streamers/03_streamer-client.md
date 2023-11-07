---
title: 'FIX Gateways and Streamers - Streamer Client'
sidebar_label: 'Streamer Client'
id: streamer-client
keywords: [server, integration, gateways, streamers, streamer client]
tags:
  - server
  - integration
  - gateways
  - streamers
  - streamer client
---

This page shows you how to create a Streamer Client. It also looks at the syntax of the two types of Streamer Client that are available:

* table or view entity
* GenesisSet

## Creating a Streamer Client
To create a Streamer Client:

1. Add the configuration for the Streamer Client process to the _applicationName_-**processes.xml** file:

```xml
<process name="POSITION_APP_STREAMER_CLIENT">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamerclient</module>
    <package>global.genesis.streamerclient.pal</package>
    <script>position_app-streamer-client.kts</script>
	<language>pal</language>
</process>
```

For more information on the above process tags, see the page on [configuring runtime processes](03_server/02_data-server/05_configuring-runtime.md).

2. Create a Kotlin script file named **{app-name}-streamer-client.kts** under **jvm/{app-name}-script-config**. Add the following information:
    * A Streamer Client name
    * A Streamer data source process and stream name
    * One or more `onMessage` tags

The simplest streamer-client definition is:
```kotlin
streamerClients {
    streamerClient(clientName = "QUOTE_RESPONSE") {
        dataSource(processName = "POSITION_APP-STREAMER", sourceName = "ORDERS_OUT")
            onMessage {
                send("QUOTE_EVENT_HANDLER", "QUOTE_UPDATE_EVENT")
            }
    }
}
```

This example takes a message from a Streamer and sends it to `QUOTE_EVENT_HANDLER` as a `QUOTE_UPDATE_EVENT`.

### Properties
You can also specify the following optional parameters in a Streamer Client:

* `isReplayable`. This flag determines if the stream is replayable. Default value is `false`.

* `eventHandlerBuffer`. This specifies how many messages to buffer for the Event Handler. If the Event Handler fails to respond after this number of messages is reached, the Streamer stops sending messages. Default value is 50.

* `sentWarningRange`. This specifies a range that controls the status of the Streamer process.  If an Event Handler takes too long to respond, the process status will go to either warning or error.

* `receiveWarningRange`. This specifies a range that controls the status of the Streamer process.  If an Event Handler takes too long to respond, the process status will go to either warning or error.

## Types of Streamer Client

There are two types of Streamer Client:

* Table or View entity Streamer Client
```kotlin
// builds a type safe QUOTES streamer client
streamerClient(clientName = "{name}", source = QUOTES) { ... }
```
* GenesisSet streamer client
```kotlin
// builds a GenesisSet streamer client
streamerClient(clientName = "{name}") { ... }
```

You can also define a selective Streamer Client. In the `onMessage` block, you can set the Streamer to request only specific messages. The example below enables you to handle VDX quotes one way and MSFT quotes another:


```kotlin
streamerClient(clientName = "CLIENT", selectOn = QUOTES.SYMBOL) {
    onMessage(where = "VDX") { ... }
    onMessage(where = "MSFT") { ... }
}
```

For a GenesisSet Streamer Client, the syntax can be one of the following:

```kotlin
// use the Fields object:
streamerClient(clientName = "CLIENT", selectionField = Fields.SYMBOL) { ... }

// specify a field and type
streamerClient(clientName = "CLIENT", selectionField = "SYMBOL", type = INTEGER) { ... }

// if no type is specified it will default to STRING
streamerClient(clientName = "CLIENT", selectionField = "SYMBOL") { ... }
```

## The onMessage block
The `onMessage` tag defines what the Streamer Client does with your message. It has two operations:

* where
* send

**Where**

The `where` tag enables you to make the action conditional. This operation has one parameter, the type of Streamer Client. This can be:
* a table or view entity
* a GenesisSet
  The operation must return a Boolean.

Example:

```kotlin
where { quotes ->
    quotes.price > BigDecimal.ZERO
}
```
Another example:
```kotlin
where { quotes ->
    quote.getBigDecimal("QUOTE", BigDecimal.ZERO) > BigDecimal.ZERO
}
```

**Send**

The `send` tag allows directs and optionally formats the outgoing message.
It requires:
* a target process
* a message type
  The `onMessage` block must have at least one `send` block.

For example:
```kotlin
send(targetProcess = "QUOTE_HANDLER", messageType = "QUOTE_EVENT")
```

This will send the full content of the Streamer message on to the target.

In addition, for entity Streamers, you can format the message in the same way as you would define the output of a view, Data Server or request reply. Use `sendFormatted`:

```kotlin
sendFormatted("QUOTE_HANDLER", "QUOTE_EVENT") {
    QUOTES.SYMBOL
    QUOTES.PRICE
}
```
Finally, you can craft the message from scratch.

This example uses just the message as a parameter:

```kotlin
send("QUOTE_HANDLER", "QUOTE_EVENT") { quote ->
    genesisSet {
        "SYMBOL" with quote.symbol
        ...
    }
}
```
This example uses the message and a GenesisSet as parameters:

```kotlin
send("QUOTE_HANDLER", "QUOTE_EVENT") { quote, set ->
    set.setString("SYMBOL", quote.symbol)
}
```
When using this example, you need to specify both parameters, (quote -> or quote, set ->). The default parameter does not work in this case.

## Event caching and ChronicleMap
Each Streamer Client subscription creates a ChronicleMap instance with capacity for 2000 entries. This is used as the cache for events that have been received from the Streamer and sent to the Event Handler. The map uses the `TIMESTAMP` or a similar unique value as a key, and then a status (`SENT` or `COMPLETE`) as the value.

Once an event has been sent to the Event Handler, we mark the `TIMESTAMP` reference as `SENT`. When the Streamer Client receives a response, it is marked as `COMPLETE`.

Every two seconds, a job runs to update the PROCESS_REF database table with the data stored in the ChronicleMap instance (if there is any). The value stored in the database is either:

- the oldest `SENT` value (if available)
or
- if no `SENT` values are stored, the latest `COMPLETE` value 

The idea is that whenever it is necessary, we can always replay events from the Streamer, starting from the oldest `SENT`(there was no response for that event and we can't guarantee it was processed successfully). If no `SENT` values are available, then it is safe to replay from the latest `COMPLETE` event. As part of this job, we also remove entries from the ChronicleMap that have been marked as `COMPLETE`.

ChronicleMap instances need to be pre-allocated with a fixed set of parameters. So if the Streamer Client tries to store more than 2000 entries before the cleaning/flushing job runs (i.e. within two seconds), it exceeds the maximum capacity.

For AUTH_PERMS and its internal ChronicleMap instances, the platform exposes the number of entries parameter, because we recreate the ChronicleMap file on every process restart. 

However, the platform does not expose a parameter in the Streamer Client for changing the number of entries, because the cache files are persisted across Streamer Client restarts. 
