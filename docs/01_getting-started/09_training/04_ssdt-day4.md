---
id: 04_ssdt-day4
title: Day 4
sidebar_label: Day 4
sidebar_position: 5

---
This day covers:

- [DictionaryBuilder](#)
- [Streamer​](#streamer)
- [Streamer client](#streamer-client)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## DictionaryBuilder

https://docs.genesis.global/secure/tutorials/building-an-application/reference-app/#1-generate-the-dictionary-files

## Streamer​

Streamer and Streamer-Client components are avaible to allow the application to route messages. Streamer, representing the Server part, listens to a table or view, and streams data out to streamer clients. In almost all cases, the table or view must be an audit table. It covers both inbound and outbound messages.

### Creating a Streamer

To create a Streamer:

1. Add the process configuration for the Streamer to the _applicationName_**-processes.xml** file. For example:

```xml
<process name="ALPHA_STREAMER">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamer</module>
    <package>global.genesis.streamer.pal</package>
    <script>alpha-streamer.kts</script>
	<language>pal</language>
</process>
```

2. Next, add the service definition to the {applicationName}-service-definitions.xml file:

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_STREAMER" port="11004"/>
</configuration>
```

3. Create a kotlin script file named {applicationName}-streamer.kts inside **{applicationName}-config/src/main/resources/scripts** folder. Add the following information:
    * A stream name
    * A GPAL index reference for a unique index with a single LONG field, this could refer to a table index or a view index.

The simplest Streamer definition is:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP)  
}
```

This example creates a stream called `ORDER_OUT`, based on the `ORDERS_OUT` table (or view). The data will be streamed, ordered by timestamp.

### Parameters
You can also specify the following optional parameters in a stream block:

`batchSize` - default value 100

`logoffTimeout` - default value 5000

`maxLogons` - default value 1

### Transforming the stream
You can define the following blocks to transform the stream:
* where
* fields
* toGenesisSet

**Where**

Using where, the stream can be filtered. It is available in two versions: one that has the streamed row as a parameter, and one that also has the logon message.

Here, we only stream orders with a quantity greater than 1,000.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut ->
            ordersOut.quantity > 1_000
        }
    }
}
```

In this example, we only stream orders with a quantity greater than 1,000 and where the logon message has provided a secret key.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut, logonMessage ->
            ordersOut.quanity > 1_000 && logonMessage.getString("KEY") == "SECRET"
        }
    }
}
```

**Fields**
The fields tag enables you to transform the output in a similar way to views, data server and req rep definitions. For example, here we output three fields:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        fields {
            ORDERS_OUT.CLIENT_ID
            ORDERS_OUT.QUANTITY withPrefix "ORDER"
            ORDERS_OUT.CLIENT_ID withAlias "CLIENT"
        }
    }
}
```

**toGenesisSet**
This enables you to create a custom GenesisSet from the entity:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        toGenesisSet { ordersOut ->
            genesisSet {
                "ORDER_QUANTITY" with ordersOut.quantity
                "ORDER" with ordersOut.orderId
            }
        }
    }
}
```

## Streamer client

Streamer Client receives data from a streamer server. When data is received, it transforms into the relevant format. It covers both inbound and outbound messages.

Let's see how to create a Streamer Client. It also looks at the syntax of the two types of Streamer Client that are available:

* table or view entity
* GenesisSet

### Creating a Streamer Client
To create a Streamer Client:

1. Add the configuration for the Streamer Client process to the {applicationName}-processes.xml file:

```xml
<process name="ALPHA_STREAMER_CLIENT">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamerclient</module>
    <package>global.genesis.streamerclient.pal</package>
    <script>alpha-streamer-client.kts</script>
	<language>pal</language>
</process>
```

2. Next, add the service definition to the {applicationName}-service-definitions.xml file:

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_STREAMER_CLIENT" port="11005"/>
</configuration>
```

2. Create a kotlin script file named {applicationName}-streamer-client.kts inside **{applicationName}-config/src/main/resources/scripts** folder, and add the following details:
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

In the `onMessage` block, you can set the Streamer to request only specific messages. It has two operations: 
**where** enables you to make the action conditional.
```kotlin
where { quotes ->
    quotes.price > BigDecimal.ZERO
}
```
**send** directs and optionally formats the outgoing message.
 ```kotlin
send(targetProcess = "QUOTE_HANDLER", messageType = "QUOTE_EVENT")
```

There are two types of Streamer Client: *Table or View entity streamer client* ADN * GenesisSet streamer client*. You can also set in a Streamer Client, such as `isReplayable`,  `eventHandlerBuffer`, `sentWarningRange`, and `receiveWarndingRange`. Further information can be found [here](/server-modules/integration/gateways-and-streamers/streamer-client/#properties).

In addition, for entity streamers, you can format the message in the same way as you would define the output of a view, data server or request reply. Use `sendFormatted`:

```kotlin
sendFormatted("QUOTE_HANDLER", "QUOTE_EVENT") {
    QUOTES.SYMBOL
    QUOTES.PRICE
}
```

#### Exercise 4.1 Creating a Streamer solution to control TRADE_AUDIT table

:::info ESTIMATED TIME
45 mins
:::

We are double-checking if a record in the *TRADE* table has been audited. To do it, create a boolean field in the *TRADE* table called **BEEN_AUDITED**, and create a Streamer solution (Server and Client) to update **BEEN_AUDITED** as soon as the record start the auditing process. You will also have to create an event in the EVENT_HANDLER to called by the streamer client to update **BEEN_AUDITED** to true. 

Remember that TRADE table has an auditing process that keeps tracking changes in 
*TRADE_AUDIT* table.

:::tip
Don't forget to change the fields file, as well as run the task to generateFields.

Create a streamer called TRADE_AUDIT_OUT, based on the *TRADE_AUDIT* table. The streamer client should call the new EVENT to update the *TRADE* field **BEEN_AUDITED**.
:::


