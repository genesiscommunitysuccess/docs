---
title: 'Type-safe Messages'
sidebar_label: 'Type-safe messages'
id: type-safe-messages
---
# Type-safe messages

The Genesis low-code platform uses type-safe messages to perform message serialiSation and deserialiSation. In addition to this, it automatically extracts relevant metadata information to expose this to the front end. These type-safe messages are most commonly used in custom request servers, GPAL Event Handlers and custom Event Handlers.

## Input messages

The input message type `I` is defined as a Kotlin data class, which specifies all the necessary information to parse the incoming message and to expose it as metadata. For example:

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

In this example, the `SetLogLevel` data class has a single constructor that also defines the data class properties. We can see that `processName` does not have a default value associated with it; therefore, it is implicitly mandatory in order to construct this message. As such, it will exposed as a *mandatory* metadata field. However, `logLevel`, `datadump` and `expiration` all have default values, and will therefore be exposed as optional metadata fields.

In terms of metadata field types, we are free to use our metadata field basic types (Boolean, Short, Int, Long, Double, String, BigDecimal or Joda DateTime), basic collection types (List, Set and Map), enumerated types (as you can see defined in `LogLevel` above) and other Kotlin data classes, as long as they are composed using the same elements. All these different types will be understood by the metadata system and exposed accordingly. Kotlin also has nullable and non-nullable types, and the metadata system will expose this information too.

Annotations such as `@Title` and `@Description` can be used to provide extra information to the front end. 

For example:

-	`@Title` could be used to provide a human-readable name for a metadata field to be displayed in a grid column.
-	`@Description` could be used to provide tooltip information when hovering over that column header. 

You can see all supported metadata annotations [here](/server-modules/inter-process-messages/metadata-annotations/).

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

## Output messages

The output message type `O` can be defined as a single Kotlin data class or as a Kotlin sealed class with multiple Kotlin data classes defined as subtypes. For multiple subtypes, the Genesis low-code platform is able to extract information for all the possible messages and expose it as metadata.

As an example, we shall look at `EventReply` and how Event Handlers work with output types in real life.

### Event Handler examples

The default output message type to use in Event Handlers is `EventReply`. This is a Kotlin sealed class which is most commonly represented by two subtypes: `EventAck` and `EventNack`. See their Kotlin definitions below:

```kotlin
data class EventAck(val generated: List<Map<String, Any>> = emptyList()) : EventReply()
data class EventNack(
    val warning: List<GenesisError> = emptyList(),
    val error: List<GenesisError> = emptyList()
) : EventReply()
```

Alternatively, you can create your own reply type using a normal Kotlin data class or a Kotlin sealed class. The example below defines `EventSetLogLevelReply`:

```kotlin
sealed class EventSetLogLevelReply : Outbound() {
    class EventSetLogLevelAck : EventSetLogLevelReply()
    data class EventSetLogLevelNack(val error: String) : EventSetLogLevelReply()
}
```

Custom reply types are powerful, as they allow a predetermined number of customised replies for a single `eventHandler` codeblock, with their type information exposed in the metadata system. However, they need to be handled carefully, as the internal error-handling mechanism for the Event Handler is only ready to handle `EventReply` messages. Therefore, non-captured exceptions and errors will be handled as such, and will break the type-safety guarantees of the reply. 

:::warning
IMPORTANT! The success message should always end in `Ack` in order for the internal `eventandler` logic to handle validation correctly.
:::