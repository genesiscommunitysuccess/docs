---
title: 'Streamer Client'
sidebar_label: 'Streamer Client'
id: streamer-client
---

This page shows you how to create a Streamer Client. It also looks at the syntax of the two types of Streamer Client that are available:

* table or view entity
* GenesisSet

Also, you can see an example of a Streamer Client in practice in our [tutorial](/01_getting-started/05_tutorials/12_integrate-a-fix-gateway.md).

## Creating a Streamer Client
To create a Streamer Client:

1. Add the configuration for the Streamer Client process to the {applicationName}-processes.xml file:

```xml
<process name="TRADING_APP_STREAMER_CLIENT">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamerclient</module>
    <package>global.genesis.streamerclient.pal</package>
    <script>trading_app-streamer-client.kts</script>
	<language>pal</language>
</process>
```

For more information on above process tags, follow this [link](/03_server-modules/02_data-server/05_configuring-runtime.md)

2. Create a kotlin script file named {applicationName}-streamer-client.kts and add the following details:
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

This example takes a message from a Streamer and sends it to `QUOTE_EVENT_HANDLER` as a `QUOTE_UPDATE_EVENT`.

### Properties
You can set the following properties in a Streamer Client:

* `isReplayable`. This flag determines if the stream is replayable. Default value is `false`

* `eventHandlerBuffer`. This specifies how many messages to buffer for the Event Handler. If the Event Handler fails to respond after this number of messages is reached, the Streamer stops sending messages. Default value is 50

* `sentWarningRange`. This specifies a range that controls the status of the Streamer process.  If an Event Handler takes too long to respond, the process status will go to either warning or error.

* `receiveWarndingRange`. This specifies a range that controls the status of the Streamer process.  If an Event Handler takes too long to respond, the process status will go to either warning or error.

## Types of streamer client

There are two types of Streamer Client:

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

You can also define a selective Streamer Client. In the `onMessage` block, you can set the Streamer to request only specific messages.
This enables you to handle VDX quotes one way and MSFT quotes another, for example.
For an entity Streamer Client, the syntax is:

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
Where enables you to make the action conditional.
This operation has one parameter: the type of the Streamer Client. This can be:
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
Send directs and optionally formats the outgoing message.
It requires:
* a target process
* a message type
  The `onMessage` block must have at least one `send` block.

For example:
```kotlin
send(targetProcess = "QUOTE_HANDLER", messageType = "QUOTE_EVENT")
```

This will send the full content of the streamer message on to the target.

In addition, for entity streamers, you can format the message in the same way as you would define the output of a view, data server or request reply. Use `sendFormatted`:

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