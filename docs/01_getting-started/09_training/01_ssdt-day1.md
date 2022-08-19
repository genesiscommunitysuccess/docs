---
id: 01_ssdt-day1
title: Day 1
sidebar_label: Day 1
sidebar_position: 2

---
This day covers:

- [System definitions​](#system-definitions)
- [Advanced event handlers](#advanced-event-handlers)


## System definitions​

The system definition file **genesis-system-definition.kts** is the basis of all configurations, scripts, data model, etc. This section explains all the different items that are contained in the file.

Here is an example of a **genesis-system-definition.kts** file for an application:

```kotlin
package genesis.cfg

systemDefinition {
    global {
        item(name = "MqLayer", value = "ZeroMQ")
        item(name = "DbLayer", value = "FDB")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")

        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")

        item(name = "DbHost", value = "localhost")
        item(name = "DbMode", value = "VANILLA")
        item(name = "GenesisNetProtocol", value = "V2")
        item(name = "ResourcePollerTimeout", value = "5")
        item(name = "ReqRepTimeout", value = "60")
        item(name = "MetadataChronicleMapAverageKeySizeBytes", value = "128")
        item(name = "MetadataChronicleMapAverageValueSizeBytes", value = "1024")
        item(name = "MetadataChronicleMapEntriesCount", value = "512")
        item(name = "DaemonServerPort", value = "4568")
        item(
            name = "JVM_OPTIONS",
            value = "-XX:MaxHeapFreeRatio=70 -XX:MinHeapFreeRatio=30 -XX:+UseG1GC -XX:+UseStringDeduplication -XX:OnOutOfMemoryError=\"handleOutOfMemoryError.sh %p\""
        )
    }

    systems {
        system(name = "DEV") {
            hosts {
                host(name = "genesis-serv")
            }

            item(name = "DbNamespace", value = "genesis")
            item(name = "ClusterPort", value = "6000")
            item(name = "Location", value = "LO")
            item(name = "LogFramework", value = "LOG4J2")
            item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        }
    }
}
```
### Global, System and Host levels

As you can see from the example, you can define items at global, system and host level.
* **Global**: These properties will be available to all systems. 
* **System**: These properties contain information about a particular system and can have a free text field. Each system is associated with a host or hosts. The content should specify the type of environment the system is running in. 
Local values can be specified in this block. **These values override the global values**.
* **Host**: In this section you can define properties of host or hosts (if running in a cluster environment). Host block can exist under the system section as shown in the above example.
  The host name defines what environment you are running in. By default, only one host will be used and change its value to current machine hostname.

### Items defined
**MqLayer**: This setting defines the type of Message queue technology. You can choose between `ZeroMQ` and `Aeron` message queues.

**DbLayer**: Default value is set to FDB. If you want to use PostgreSQL, MSSQL or Aerospike, then you need to change this value and then [change the value of the DbHost item](/server-modules/configuring-runtime/setting-the-database-technology/).
**DbHost**: Contains information about the hostname/JDBC connection string pointing to local database. For example:


```kotlin
item(name = “DbHost”, value = “jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432”)
```

See our pages on [database technology](/database/database-technology/overview/) for more information on how to configure a specific database.

**Database username and password encryption**
You can add an encrypted username and password for the database system.
Run the command `encryptUserPassWithKey`, which will ask you to supply the plain username, password and Genesis Key. Genesis Key is 32 characters long.
This will generate encrypted username and password, which can then be added into a system definition file. You can directly add the encrypted values or you can embed these fields into the local system environment variables and refer to them as follows:

```kotlin
item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
item(name = "DbPassword", value = System.getenv("DBPASSWORD"), encrypted = true)
item(name = "GenesisKey", value = System.getenv("GENESIS_KEY"))
```

**DictionarySource**: This setting defines where you want to store the dictionary schema. You can choose between DB dictionary source and FILE dictionary source using this setting. Accepted values `DB` and `FILE`. DB dictionary source is preferred, because if you are running a cluster, all nodes will refer to the same dictionary. FILE dictionary source has the problem of being only available on each node.

**AliasSource**: This setting defines where you want to store dictionary alias schema. The alias schema maps aliases to fields and to tables, and it is updated every time we change the data schema. You can choose between DB alias source and FILE alias source using this setting. Accepted values `DB` and `FILE`. DB alias source is preferred, because if you are running a cluster all nodes will refer to the same alias dictionary. FILE alias source has the problem of being only available on each node.

**MetricsEnabled**: Default value is false. For more information, go to the page on [Metrics](/operations/metrics/metrics/).

**ZeroMQProxyInboundPort** and **ZeroMQProxyOutboundPort** are required for the processes that use GENESIS_CLUSTER as a proxy for the update queue (eg.: DbMon, PurgeTables, etc...).

**DbMode**: This setting is only needed if you use the [Aerospike](/database/database-technology/aerospike/) database.

**ResourcePollerTimeout**: This setting controls how often the genesis daemon process keeps the processes and their metadata up to date.

**ReqRepTimeout**: This setting contains the default timeout for the request server resources in the system.

**MetadataChronicleMapAverageKeySizeBytes**, **MetadataChronicleMapAverageValueSizeBytes**, **MetadataChronicleMapEntriesCount**: These are the settings for chronicle map and are related to the way processes store their own metadata resources inside /runtime/proc_metadata

**DaemonServerPort**: This defines the port for daemon process, daemon process is the background process, which collects information about micro-services.

**JVM_OPTIONS**: This defines common JVM options to be applied to all processes defined in the environment.

**DbNamespace**: This item defines different things, depending on the databases in use and is applicable for [FoundationDB](/database/database-technology/foundationdb/) and [Aerospike](/database/database-technology/aerospike/) only.

**ClusterPort**: This setting specifies the port used by GENESIS_CLUSTER to establish cluster membership between cluster nodes.

**Location**: This item contains a 2-character value used to generate **standard ID** for a given entity. For example, if a Location item defined as "LO" and entity TRADE has a field called TRADE_ID defined with the sequence "TR",
then the generated ID will be `000000000001TRLO1` where "LO" represents Location string.

**LogFramework**: Contains name of the logging framework. Supported framework: LOG4J2

**LogFrameworkConfig**: Contains name of the log framework configuration file.

If you want to enable SSL for your process communication, this is done in the [service definition](/server-modules/configuring-runtime/service-definitions/#enable-ssl-for-processes).

### HashiCorp Vault support

:::important

This feature is supported from version 6.0

:::

Services can also load their configuration from HashiCorp vault. 
This can be done by adding a `vault` tag in the `global`, `system` or `host`
tags. 

The `vault` tag has three sub tags, `config`, `sslConfig` and `readSecrets`. Of
these three, `config` and `readSecrets` are required:

```kotlin
vault {
  config {  
    ...
  }

  sslConfig { 
    ...
  }

  readSecrets { 
    ...
  }
}
```

#### Config 

This part of the configuration tells the service where to read secrets from: 

```kotlin
config {
    address("http://localhost:8200")     // Defaults to "VAULT_ADDR" environment variable
    token("s.NSxyuF4ClXxd4YoSFvKwil0i")  // Defaults to "VAULT_TOKEN" environment variable
    openTimeout(5)                       // Defaults to "VAULT_OPEN_TIMEOUT" environment variable
    readTimeout(30)                      // Defaults to "VAULT_READ_TIMEOUT" environment variable 
}
```

#### sslConfig

This part of the configuration tells the service how to handle the ssl hand 
shake with the vault server. For details regarding the ssl config, please see
[here](https://github.com/BetterCloud/vault-java-driver#ssl-config).
Note that the `SslConfig` object will be passed as the receiver within 
the `sslConfig` tag.

#### readSecrets

This part of the configuration tells the service which secrets to load:

```kotlin
readSecrets {
  read("secret/path_to_secret")
}
```

Currently, a single call to `read` is supported. This takes a single parameter,
which is the path to the secrets.

Secrets are always provided as `String`

#### Linked properties support

:::important

This feature is supported from version 6.0

:::

When reading secrets from external systems, the keys to these secrets might 
not map directly to the required properties in Genesis. To help with this, the platform supports the linking of properties. 

The links can be applied as tags at `global`, 
`system` or `host` level. 

To create a link, use `link`, as per below, where we link `DbHost` to `secret.db.host`:

```kotlin
systemDefinition {
  global {
    link(name = "DbHost", source = "secret.db.host")
  }
  ...
}
```

Multiple levels of linking are supported. However, `genesisInstall` will fail if a circular link is detected, or if the `source` of a link is not found. 

### Exercise 1.1 System Definitions

:::info ESTIMATED TIME
20 mins
:::

Let´s start the hands-on doing the first exercise. We are going to change the database configurations to use any [technology supported](/database/database-technology/overview/).

:::tip changing genesis-system-definition configurations 
To do this exercise, clone the Developer Training [repository](https://github.com/genesiscommunitysuccess/devtraining-gama), go to the file **genesis-system-definition.kts** and change the global items `DbLayer` and `DbHost`. If you are running localhost, make sure you changed the system host accordingly.

After the changes don't forget to run *build*, *install-site-specific* and *deploy* tasks.
:::


## Advanced event handlers

The Genesis low-code platform has a real-time event-driven architecture.

Applications built on the system must respond immediately to different types of input: inputs from users, messages from other systems, market-data updates and internally calculated analytic signals. These inputs are events.

All the business logic for applications built on the platform is structured around these events. When an event occurs, the business logic immediately fires into action.

As a rough guide, many of the tables you have created need **Insert**, **Modify** and **Delete** events, so that you can specify the processing that these events require. 

The vast majority of applications include business workflow.

That could be a simple linear workflow, such as a deal being enriched and approved, or a margin call payment – or it could be a more complex set of steps.

Most applications built on the platform include the typical financial product **business entities**, such as orders, trades, bids, allocations and positions. These business entities have a lifecycle where they go through various **states**. The transition from one state to another is an event that needs to be handled. The paths through those states are workflows, and to assist the workflows, we use state machines.

Event Handlers are conventionally defined in the file _application-name_**-eventhandler.kts**. 

So, if your application is called **positions**, then the file would conventionally be named **positions-eventhandler.kts**.

You can write custom Event Handlers using our [APIs](/database/event-handler-api/event-handler-api/). These can be implemented using Kotlin or Java.

:::note
We recommend using **Kotlin** to implement Event Handlers.

- **Java** Event Handlers are implemented using [**RxJava3**](#rx3) [**Sync**](#sync) Event Handlers only. 
- Async Event Handlers cannot be used, as there is no implementation for Kotlin coroutines in Java.
:::

In the [Developer Training](#) we defined the application Event Handler in a [Kotlin script file](/tutorials/training-resources/training-content-day1/#event-handler), as well as basic things like [enabling the application to write to the database](/tutorials/training-resources/training-content-day2/#exercise-22-extending-the-application).

However, there are more we can explore such as [Types](#types), [Database API](#database-api), [Exception handling](#exception-handling), and [Custom reply message type](#custom-reply-message-type) described in the next sections.

### Database API

https://docs.genesis.global/secure/reference/developer/api/database/how-to/interface/entity-db

Read Operations
Write Operations
<!-- 
C:\Users\DanielBarros\Projects\clarity-server\clarity-script-config\src\main\resources\scripts\clarity-resetmanager-eventhandler.kts
-->

### Exception handling

In order to handle exceptions in Event Handlers, the traditional `try` and `catch` options are available and ready for usage. 

For instance, handling exceptions in *EVENT_TRADE_INSERT* can be something like this:
```kotlin
eventHandler {
    eventHandler<Trade>(name = "TRADE_INSERT") {
        onCommit { event ->
            try {
                entityDb.insert(event.details)
                ack()
            }
            catch (e: Exception) {
                LOG.error("Error: $e")
                nack(e)                
            }
        }
    }
}
```

#### Exercise 1.2 Exception handling
:::info ESTIMATED TIME
30 mins
:::

Add an Exception handling in *EVENT_COUNTERPARTY_INSERT*, logging and enriching the error message with the message as well as the cause and event name.

:::tip
Don't forget the returns, in this case `ack()` for success, and `nack(e)` for exceptions.
:::

### Custom reply message type

If you use a custom reply message type, you won’t be able to use the default `ack()` or `validationAck()` functions.  The custom message type needs to be returned from the method.

For a custom message type called `TradeEvent` defined as:

```kotlin
data class TradeEvent(
    val price: Double,
    val quantity: Int,
){
    init{
        require(price > 0) { "Price cannot be negative "}
        require(quantity > 0) { "Quantity cannot be negative "}
    }
}
```

... and  a custom message reply type called `CustomTradeEventReply` defined as:

```kotlin
sealed class CustomTradeEventReply : Outbound() {
    class TradeEventValidateAck : CustomTradeEventReply()
    data class TradeEventAck(val tradeId: String) : CustomTradeEventReply()
    data class TradeEventNack(val error: String) : CustomTradeEventReply()
}
```

... you could use the example Event Handler below:

```kotlin
    eventHandler<TradeEvent, CustomTradeEventReply>(name = "CUSTOM_TRADE_EVENT") {
        onException { event, throwable ->
            TradeEventNack(throwable.message!!)
        }
        onValidate {
            val tradeEvent = it.details
            require((tradeEvent.price * tradeEvent.quantity.toDouble()) < 1_000_000) { "Trade notional is too high" }
            TradeEventValidateAck()
        }
        onCommit { event ->
            val trade = event.details
            val result = entityDb.insert(trade)
            TradeEventAck(result.record.tradeId)
        }
    }
```

#### onException

The `onException` block can capture any exceptions thrown by the `onValidate` and `onCommit` blocks and returns the expected reply message type (as shown in the last example). This function is particularly useful if you are using a custom message type; by default, Event Handlers will attempt to translate exceptions automatically to an **EventNack** message, which might cause compatibility problems if you are using custom replies.

#### Exercise 1.3 Event Handler Custom Message
:::info ESTIMATED TIME
30 mins
:::

Now let's change change the EVENT_TRADE_INSERT to use a custom reply message type. Create the classes `CustomTradeEventReply ` and `TradeEvent` with *price* and *quantity* required greater than zero. The Event Handler onValidate should ensure that *price* * *quantity* is always greater than 10.


