---
title: Streamer Client
sidebar_label: Streamer Client
sidebar_position: 4
id: streamer-client
---

### Create streamer-client
To create a streamer client you will need the following:

1. Add streamer-client process configuration in {applicationName}-processes.xml file

```xml
<process name="TRADING_APP-STREAMER">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamer</module>
    <package>global.genesis.streamer</package>
    <config>trading_app-streamer-client.kts</config>
</process>
```

2. Create kotlin script file named {applicationName}-streamer-client.kts and add following
    * A streamer client name
    * A streamer data source process and stream name
    * One or more `onMessage` tags

The simplest streamer-client definition is:
```kotlin
streamerClients {
    streamerClient(clientName = "QUOTE_RESPONSE") {
        dataSource(processName = "TRADING_APP-STREAMER", sourceName = "ORDERS_OUT")
            onMessage {
                send("QUOTE_EVENT_HANDLER", "QUOTE_UPDATE_EVENT")
            }
    }
}
```

This will take a message from a streamer and send the message to QUOTE_EVENT_HANDLER as a QUOTE_UPDATE_EVENT.

There are also the following properties on a streamer client:

`isReplayable` - Flag that determines if the stream is replayable. Default value is `false`
`eventHandlerBuffer` - How many messages to buffer for the event handler. Stops sending events to if the event handler failed to respond after [eventHandlerBuffer] number of events. Default value is 50
`sentWarningRange` and `receiveWarndingRange` - These properties deal with the streamer process status; if an event handler takes too long to respond the process status will go to either warning or error. 

### Types of streamer clients

There are two types of streamer clients:

* Table or View entity streamer client
```kotlin
// builds a type safe QUOTES streamer client
streamerClient(clientName = "{name}", source = QUOTES) { ... }
```
* GenesisSet streamer client
```kotlin
// builds a GenesisSet streamer client
streamerClient(clientName = "{name}") { ... }
```

Furthermore, you can define a selective streamer client, this will allow `onMessage` blocks to only request specific messages, for example, we could handle VDX quotes one way and MSFT quotes another. For an entity streamer client the syntax is:

```kotlin
streamerClient(clientName = "CLIENT", selectOn = QUOTES.SYMBOL) {
    onMessage(where = "VDX") { ... }
    onMessage(where = "MSFT") { ... }
}
```

For a GenesisSet streamer client the syntax could be one of:

```kotlin
// use the Fields object:
streamerClient(clientName = "CLIENT", selectionField = Fields.SYMBOL) { ... }

// specify a field and type
streamerClient(clientName = "CLIENT", selectionField = "SYMBOL", type = INTEGER) { ... }

// if no type is specified it will default to STRING
streamerClient(clientName = "CLIENT", selectionField = "SYMBOL") { ... }
```

### The `onMessage` block
The onMessage tag defines what the streamer client does with your message, and has two operations:
* where
* send

**Where**
Where allows you to specify a predicate on the message, it has one parameter, the type of the streamer client, either a table or view entity or a GenesisSet and should return a Boolean:

```kotlin
where { quotes ->
    quotes.price > BigDecimal.ZERO
}
```

or:
```kotlin
where { quotes ->
    quote.getBigDecimal("QUOTE", BigDecimal.ZERO) > BigDecimal.ZERO
}
```

**Send**
Send directs and optionally formats the outgoing message. 
It requires:
    1. a target process
    2. a message type
The `onMessage` block will require at least one send block

For example:
```kotlin
send(targetProcess = "QUOTE_HANDLER", messageType = "QUOTE_EVENT")
```

This will send the full content of the streamer message on to the target.

In addition, for entity streamers, you can format the message in the same way as you would define view, data server and request reply output, using sendFormatted:

```kotlin
sendFormatted("QUOTE_HANDLER", "QUOTE_EVENT") {
    QUOTES.SYMBOL
    QUOTES.PRICE
}
```
Finally, you can craft the message from scratch, using just the message as a parameter

```kotlin
send("QUOTE_HANDLER", "QUOTE_EVENT") { quote ->
    genesisSet {
        "SYMBOL" with quote.symbol
        ...
    }
}
```
or the message and a GenesisSet as parameter

```kotlin
send("QUOTE_HANDLER", "QUOTE_EVENT") { quote, set ->
    set.setString("SYMBOL", quote.symbol)
}
```
When  using this syntax, you will have to specify the parameters, (quote -> or quote, set -> in this case), the default parameter it does’t work in this instance