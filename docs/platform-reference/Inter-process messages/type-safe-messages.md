---
title: Type safe messages
sidebar_label: Type safe messages
id: type-safe-messages
sidebar_position: 2
---
# Type-safe messages

The genesis platform provisions the use of type safe messages both to perform message serialization and deserialization, and also to automatically extract relevant metadata information to be exposed to the frontend. These type-safe messages are most commonly used in custom request replies, GPAL event handlers and custom event handlers.

Type safe messages are generally divided in two sections: input messages and output messages.

## Input messages

The input message type `I` is defined as a Kotlin data class and which will determine all the necessary information to parse the incoming message and also to expose as metadata. E.g:

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

In this example, the `SetLogLevel` data class has a single constructor which also defines the data class properties. We can see that `processName` does not have a default value associated with it, therefore it is implicity mandatory and necessary to construct this message. As such, it will exposed as a *mandatory* metadata field. On the other `logLevel`, `datadump` and `expiration` have default values and therefore will be exposed as optional metadata fields.

In terms of metadata fields types, we are free to use our metadata field basic types (Boolean, Short, Int, Long, Double, String, BigDecimal or Joda DateTime), basic collection types (List, Set and Map), enumerated types (i.e. see defined `LogLevel` above) and other Kotlin data classes as long as they are composed using the same elements. All of these different types will be understood by the metadata system and exposed accordingly. Kotlin also has nullable and non-nullable types, and the metadata system will expose this information too.

Additionally, certain annotations like `@Title` and `@Description`, can be used to provide extra information to the frontend. For example, `@Title` could be used to provide a “human readable name” of a metadata field to be displayed in a grid column, and `@Description` could be used to provide tooltip information when hovering over that column header. Please see all supported metadata annotations [here](metadata-annotations.md).

Read only values can be exposed inside a Kotlin companion object and can be as complex as any other metadata field definition. See example enhanced `SetLogLevel` class below which provides information about the default LogLevel:

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

The output message type `O` can be defined as a single Kotlin data class or as a Kotlin sealed class with multiple Kotlin data classes defined as subtypes. In case of using multiple subtypes, the genesis platform is able to extract information for all the possible messages and expose it as metadata.

As an example, we will have a look at `EventReply` and how event handlers work with output types works in real life.

### Event handler examples

The default output message type to use in event handlers is `EventReply`. `EventReply` is a Kotlin sealed class which is most commonly represented by these two subtypes: `EventAck` and `EventNack`. See their Kotlin definitions below:

```kotlin
data class EventAck(val generated: List<Map<String, Any>> = emptyList()) : EventReply()
data class EventNack(
    val warning: List<GenesisError> = emptyList(),
    val error: List<GenesisError> = emptyList()
) : EventReply()
```

Alternatively, you can create your own reply type by using a normal Kotlin data class or a Kotlin sealed class. See example below for `EventSetLogLevelReply`:
```kotlin
sealed class EventSetLogLevelReply : Outbound() {
    class EventSetLogLevelAck : EventSetLogLevelReply()
    data class EventSetLogLevelNack(val error: String) : EventSetLogLevelReply()
}
```

Custom reply types are powerful, as they allow a predetermined number of customised replies for an eventhandler with their type information exposed in the metadata system. However, they need to be handled carefully, as the internal event handler error handling mechanism is only ready to handle `EventReply` messages, therefore non-captured exceptions and errors will be handled as such and will break the type-safety guarantees of the reply. 

:::warning
IMPORTANT! The success message should always end in `Ack` in order for the internal event handler logic to handle validation correctly.
:::