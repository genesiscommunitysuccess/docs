---
id: 01_ssdt-day1
title: Day 1
sidebar_label: Day 1
sidebar_position: 2

---
This day covers:

- [System definitions​](#system-definitions)
- [Advanced event handlers](#advanced-event-handlers)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

In the system definitions file, there are several items to be used as default values or even change configurations to adapt the application. 

For instance, to change the database configuration to any one of the [technologies supported]((/database/database-technology/overview/)), you should change the items `DbLayer`, `DbHost`, and possibly `system/hosts`. The code bellow show us how we could do this.

```kotlin {6,8,13-16}
package genesis.cfg

systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        ...
        item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/?user=postgres&password=")
        ...
    }

    systems {
        system(name = "DEV") {
            hosts {
                host(LOCAL_HOST)
            }
            ...
        }
    }
}
```

Additionally, it is possible to create a global custom definition to be used like the code bellow.

```kotlin {3}
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```

The custom definition value will be available globally and can be accessed like this.

```kotlin
val permissionsField = SysDef.ADMIN_PERMISSION_ENTITY_FIELD
```

Further information regarding the system definitions such as items defined, HashiCorp Vault, and more can be found [here](/secure/creating-applications/configure-runtime/system-definitions/).


#### Exercise 1.1 System Definitions
<!--
Answer is pretty much here: https://www.notion.so/genesisglobal/What-makes-Genesis-low-code-ccfb29a874644b8da799a8f5469efb46#6d46b3a15ee94bf8940fa54a72624766
-->

:::info ESTIMATED TIME
20 mins
:::

Let´s start the hands-on doing the first exercise. We are going create a global custom definition to set the nullability for Trade table fields. Create a new item in the system definition and use it in the fields definition file.

:::tip changing genesis-system-definition configurations 
To do this exercise, clone the Developer Training [repository](https://github.com/genesiscommunitysuccess/devtraining-gama), go to the file **genesis-system-definition.kts** and do the changes. Then, go to the fields definition file and set the *nullable* using SysDef. 

After the changes don't forget to run *build*, *install-site-specific* and *deploy* tasks.
:::


## Advanced event handlers

The Genesis low-code platform has a real-time event-driven architecture.

Applications built on the system must respond immediately to different types of input: inputs from users, messages from other systems, market-data updates and internally calculated analytic signals. These inputs are events.

All the business logic for applications built on the platform is structured around these events. When an event occurs, the business logic immediately fires into action.

As a rough guide, many of the tables you have created need **Insert**, **Modify** and **Delete** events, so that you can specify the processing that these events require. 

The vast majority of applications include business workflow. Event Handlers are conventionally defined in the file _application-name_**-eventhandler.kts**. 

In the [Developer Training](/getting-started/developer-training/training-intro/) we defined the application Event Handler in a [Kotlin script file](/tutorials/training-resources/training-content-day1/#event-handler), as well as basic things like [enabling the application to write to the database](/tutorials/training-resources/training-content-day2/#exercise-22-extending-the-application).

However, there are more we can explore such as [Database API](#database-api), [Exception handling](#exception-handling), and [Custom reply message type](#custom-reply-message-type) described in the next sections.

### Database API

The [entityDb](/database/database-interface/entity-db/) enables you to interact with the database layer; you can use any generated type-safe entities for tables and views. The interface supports the same operations as the generated repositories, but will accept any entity. It supports read operations for views and tables and write operations for tables only.

The entityDb differs from the generated repositories in that it can handle any table and most view entities. The entityDb is available in the kotlin Event Handler. 

When referring to indices in the database operations, the database accepts _index classes_ or _entity class_ in combination with _index references_. Further details and conventions can be found [here](/database/database-interface/entity-db/#type-convention).

EntityDb offers Read and Write Operations. Using [Read Operations](/database/database-interface/entity-db/#read-operations) it is possible to get a simple lookup on the database through the method [get](/database/database-interface/entity-db/#get), or even create a [Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) or [Flowable](http://reactivex.io/RxJava/3.x/javadoc/io/reactivex/rxjava3/core/Flowable.html) of the whole table as the code below.

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can pass in Trade as a type parameter
val flow = db.getBulk<Trade>()
// we can pass in the TRADE object
val flow = db.getBulk(TRADE)
// or we can pass in an index reference
val flow = db.getBulk(Trade.ByTypeId)
```

</TabItem>
<TabItem value="java">

```java
// we can pass in Trade as a type parameter
final var flowable = db.getBulk(Trade.class);
// we can pass in the TRADE object
final var flowable = db.getBulk(TRADE.INSTACE);
// or we can pass in an index reference
final var flowable = db.getBulk(Trade.ById.Companion);
```
</TabItem>
</Tabs>

On the other hand, [Write Operations](/database/database-interface/entity-db/#write-operations) have versions that take a single entity and versions that take multiple entries. The return values for these operations are type-safe (see details below), provided all entries are of the same type. There are [Default and generated values](/database/database-interface/entity-db/#default-and-generated-values), as well as CRUD methods and variations: [Insert](/database/database-interface/entity-db/#insert), [Modify](/database/database-interface/entity-db/#modify), [Upsert](/database/database-interface/entity-db/#upsert), [Delete](/database/database-interface/entity-db/#delete), [Update](/database/database-interface/entity-db/#update) as the code below. 

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
db.updateBy(Trade.byId("xxxxx")) {
    price = 15.0
}

db.updateByRange(Trade.byOrderId("xxxx")) {
    orderStatus = OrderStatus.CANCELLED
}

db.updateByRange(Trade.byOrderId("xxxx"), Trade.byOrderId("yyyy") {
    orderStatus = OrderStatus.CANCELLED
}

db.updateAll<Trade> {
    orderStatus = OrderStatus.CANCELLED
}
```

</TabItem>
<TabItem value="java">

```java
db.updateBy(Trade.byId("xxx"), trade -> {
    trade.setPrice(15.0);
}).blockingGet();

db.updateByRange(Trade.byOrderId("xxxx"), trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();

db.updateByRange(Trade.byOrderId("xxxx"), Trade.byOrderId("yyyy"), trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();

db.updateAll(Trade.class, trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();
```

</TabItem>
</Tabs>

If the underlying database supports transactions, then the entityDb provides type-safe access to these. A read transaction will support the same read operations as the entity db, and a write transaction will support the same read and write operations. If a write transaction fails, all operations will be reverted. Subscribe operations are not supported within transactions. Currently, transactions are supported on **FoundationDb** and **Postgresql**. Using transaction on **Aerospike** will result in a failure. Further detaisl regarding transactions can be found [here](/database/database-interface/entity-db/#transactions).

Using entityDb it is also possible to subscribe operations starting a database listener that receives updates to tables or views. When subscribing to view updates, only updates to the root table will be published. Further details regarding subscribe operations can be found [here](/database/database-interface/entity-db/#subscribe-operations).

#### Exercise 1.2 entityDb ReadOperation getBulk
:::info ESTIMATED TIME
40 mins
:::

Create a new event called **TRADE_STANDARDIZATION** to perform a standardization in the Trade table, setting all negative *Trade.Quantity* records to zero. This method can use the ReadOperation [getBulk](/database/database-interface/entity-db/#getbulk) method to list all Trades and then use the [filter](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) method Kotlin Flow class offers.

:::tip
After selecting the Trade records you can use the *forEach* method to set the quantities to zero, and then use entityDb method [modifyAll](/database/database-interface/entity-db/#modify) to update everything.
:::

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

#### Exercise 1.3 Exception handling
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

#### Exercise 1.4 Event Handler Custom Message
:::info ESTIMATED TIME
30 mins
:::

Now let's change change the EVENT_TRADE_INSERT to use a custom reply message type. Create the classes `CustomTradeEventReply ` and `TradeEvent` with *price* and *quantity* required greater than zero. The Event Handler onValidate should ensure that *price* * *quantity* is always greater than 10.


