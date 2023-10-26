---
title: 'Inter-process messages - type-safe messages'
sidebar_label: 'Type-safe messages'
id: type-safe-messages
keywords: [server, inter-process messages, type-safe messages]
tags:
  - server
  - inter-process messages
  - type-safe messages
---

The Genesis low-code platform uses type-safe messages to perform message serialisation and deserialisation. In addition to this, it automatically extracts relevant metadata to expose this to the front end. These type-safe messages are most commonly used in Request Servers, GPAL Event Handlers and Event Handlers that have been [implemented as a set of classes](../../../database/api-reference/event-handler-api/).

## Input messages

The input message type `I` is defined as a Kotlin data class, which specifies all the necessary information to parse the incoming message and to expose it as metadata. Take a look at this example, which we shall discuss below:

```kotlin
enum class LogLevel {
    TRACE, DEBUG, INFO, WARN, ERROR
}

data class SetLogLevel(
    @Title("Process name")
    val processName: String,
    @Description("Represents the target logging level")
    val logLevel: LogLevel? = null,
    val datadump: Boolean = false,
    val expiration: Int = 0
)
```

In this example, the `SetLogLevel` data class has a single constructor that also defines the data class properties. Also note:

- **Mandatory metadata field**. `processName` does not have a default value associated with it; therefore, a value is mandatory to construct this message. So, it will be exposed as a *mandatory* metadata field. 
- **optional metadata fields**. `logLevel`, `datadump` and `expiration` all have default values; they will therefore be exposed as optional metadata fields.

 You are free to use all the following types as long as they are composed using the same elements: 

- Genesis metadata field basic types (Boolean, Short, Int, Long, Double, String, BigDecimal or Joda DateTime)
- enumerated types (as you can see defined in `LogLevel` above)
- basic collection types (List, Set and Map)
- other Kotlin data classes 

All these different types will be understood by the metadata system and exposed accordingly. Kotlin also has nullable and non-nullable types, and the metadata system will expose this information too.

Annotations such as `@Title` and `@Description` can be used to provide extra information to the front end.

For example:

-	`@Title` could be used to provide a human-readable name for a metadata field to be displayed in a grid column.
-	`@Description` could be used to provide tooltip information when hovering over that column header. 

You can find more information on our page about [metadata annotations](../../../server/inter-process-messages/metadata-annotations/).

## Read-only values
Read-only values can be exposed inside a Kotlin companion object and can be as complex as any other metadata field definition. In the example below, the enhanced `SetLogLevel` class provides information about the default LogLevel:

```kotlin
data class SetLogLevel(
    @Title("Process name")
    val processName: String,
    @Description("Represents the target logging level")
    val logLevel: LogLevel? = null,
    val datadump: Boolean = false,
    val expiration: Int = 0
) {
    companion object ReadOnly {
        val defaultLogLevel: LogLevel = LogLevel.INFO
    }
}
```

## Deserialised fields

There is a significant disadvantage in using type-safe messages with support for default values; once the message has been deserialised, you don't know what the original payload contained.

Following the previous example with the `SetLogLevel` data class, it is possible to receive a message with just a `processName` value; you will still have default values for all the other fields due to the automatic defaulting mechanism. This might present a problem where you have business logic where those fields were part of the original payload. For example, if you receive a value for the field `expiration` set as 0, you might want to define different business logic than if the value was never sent in the first place - even though 0 is the same value as the default value.

In order to solve this problem, there is a class called `DeserializedFieldsSupport`. This class can be extended by any type-safe data class. It is available for both Event Handler definitions and Request Server definitions. The previous `SetLogLevel` data class would now look like this:

```kotlin
data class SetLogLevel(
    @Title("Process name")
    val processName: String,
    @Description("Represents the target logging level")
    val logLevel: LogLevel? = null,
    val datadump: Boolean = false,
    val expiration: Int = 0
) : DeserializedFieldsSupport() {
    companion object ReadOnly {
        val defaultLogLevel: LogLevel = LogLevel.INFO
    }
}
```

Any message extending this class will have access to a property called `deserializedFields` of type `Map<String, DeserializedField>`, which will provide enough information to reconstruct the values that were part of the original payload.

The `DeserializedField` sealed class definition looks like this:

```kotlin
sealed class DeserializedField {
    object Simple : DeserializedField()
    data class Array(val fields: List<DeserializedField>) : DeserializedField()
    data class Object(val fields: Map<String, DeserializedField>) : DeserializedField()
}
```

So, if we revisit a real-life example for `SetLogLevel` in which we only receive field values for `processName` and `datadump`, the content of `deserializedFields` will be a `Map` with the following key-values:
```
{
  "PROCESS_NAME" : DeserializedField.Simple
  "DATADUMP" : DeserializedField.Simple
}
```

If your message has nested arrays or objects, the `deserializedFields` property will also contain nested structures in the shape of `DeserializedField.Array` and `DeserializedField.Object` types.


## Output messages

The output message type `O` can be defined as a single Kotlin data class or sealed class with multiple Kotlin data classes defined as subtypes. For multiple subtypes, the Genesis low-code platform is able to extract information for all the possible messages and expose it as metadata.

As an example, we shall look at `EventReply` and how Event Handlers work with output types in real life.

### Event Handler examples

The default output message type to use in Event Handlers is `EventReply`. This is a Kotlin sealed class, which is most commonly represented by two subtypes: `EventAck` and `EventNack`. See their Kotlin definitions below:

```kotlin
data class EventAck(val generated: List<Map<String, Any>> = emptyList()) : EventReply()
data class EventNack(
    val warning: List<GenesisError> = emptyList(),
    val error: List<GenesisError> = emptyList()
) : EventReply()
```

Alternatively, you can create your own reply type using a normal Kotlin data class or sealed class. The example below defines `EventSetLogLevelReply`:

```kotlin
sealed class EventSetLogLevelReply : Outbound() {
    class EventSetLogLevelAck : EventSetLogLevelReply()
    data class EventSetLogLevelNack(val error: String) : EventSetLogLevelReply()
}
```

These custom reply types allow a predetermined number of customised replies for a single `eventHandler` codeblock, with their type information exposed in the metadata system. However, they need to be handled carefully, as the internal error-handling mechanism for the Event Handler is only able to handle `EventReply` messages. Therefore, non-captured exceptions and errors will break the type-safety guarantees of the reply. 

:::warning
IMPORTANT! The success message should always end in `Ack` in order for the internal `eventandler` logic to handle validation correctly.
:::
