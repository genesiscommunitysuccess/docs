---
title: 'Inter-process messages - type-safe messages'
sidebar_label: 'Type-safe messages'
id: type-safe-messages
keywords: [server, inter-process messages, type-safe messages, json schema, error code, error, http status, status, response status, error handling, error format, format, http]
tags:
  - server
  - inter-process messages
  - type-safe messages
  - json schema
  - error handling
  - error format
  - error
  - format
  - http
  - http status
  - error code
  - status
  - response status
---

The Genesis low-code platform uses type-safe messages to perform message serialisation and deserialisation. In addition, it automatically extracts relevant metadata to expose this to the front end in the shape of a [Json Schema](https://json-schema.org/) definition that is compliant with the 2019-09 specification. These messages will be validated automatically in the back end, based on their definition. 

These type-safe messages are most commonly used in Request Servers, GPAL Event Handlers and Event Handlers that have been [implemented as a set of classes](../../../server/api-reference/event-handler-api/).

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
- **Optional metadata fields**. `logLevel`, `datadump` and `expiration` all have default values; they will therefore be exposed as optional metadata fields.

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

Following the previous example with the `SetLogLevel` data class, it is possible to receive a message with just a `processName` value; you will still have default values for all the other fields because of the automatic defaults. This causes problems where you have business logic where those fields were part of the original payload. 

For example, if you receive a value for the field `expiration` set as 0, you might want to define different business logic than if the value was never sent in the first place - even though 0 is the same value as the default value.

In order to solve this problem, there is a class called `DeserializedFieldsSupport`. This class can be extended by any type-safe data class. It is available for both Event Handler definitions and Request Server definitions. The `SetLogLevel` data class in the previous example would now look like this:

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

Any message extending this class will have access to a property called `deserializedFields` of type `Map<String, DeserializedField>` This property provides enough information to reconstruct the values that were part of the original payload.

The `DeserializedField` sealed class definition looks like this:

```kotlin
sealed class DeserializedField {
    object Simple : DeserializedField()
    data class Array(val fields: List<DeserializedField>) : DeserializedField()
    data class Object(val fields: Map<String, DeserializedField>) : DeserializedField()
}
```

So, if we revisit a real-life example for `SetLogLevel` in which we only receive field values for `processName` and `datadump`, the content of `deserializedFields` will be a `Map` with the following key values:
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

The default output message type to use in Event Handlers is `EventReply`. This is a Kotlin sealed class, which is most commonly represented by two subtypes: `EventAck` and `EventNack`. The Kotlin definitions of these are:

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

These custom reply types allow a predetermined number of customised replies for a single `eventHandler` codeblock, with their type information exposed in the metadata system. They need to be handled carefully, as the internal error-handling mechanism for the Event Handler is only able to handle `EventReply` messages. Therefore, non-captured exceptions and errors will break the type-safety guarantees of the reply. 

:::warning
IMPORTANT! The success message should always end in `Ack` in order for the internal `eventHandler` logic to handle validation correctly.
:::

### Error messages

There is a common format for error or warning messages sent between server and client. The message format is the same for all the HTTP and WebSocket messages we support:

```kotlin
MESSAGE_TYPE = ...
SOURCE_REF = ...
ERROR = [
  {
    CODE (String) = -- predefined error code, 
    TEXT (String) = -- human readable message,
    STATUS_CODE (ENUM: HttpStatusCode) = -- http status code
    // Optional: Additional custom fields
  }
]
WARNING = [
  {
    CODE = -- predefined error code,
    TEXT = -- human readable message,
    STATUS_CODE (ENUM: HttpStatusCode) = -- http status code
    // Optional: Additional custom fields
  }
]
```

All error/warnings are represented as implementations of the GenesisError interface. This is defined as follows:

```kotlin
interface GenesisError {
    val code: String
    val text: String
    val statusCode: HttpStatusCode
        get() = HttpStatusCode.InternalServerError
}
```

So by default, all error/warning messages have the following properties, along with any extra properties that are needed to represent error:

CODE is the error code, which can be of two types:
- [ErrorCode](../error-codes) is the ENUM class that contains a list of different error codes coming from the server
- String is used to pass any code that is not part of ErrorCode enum

TEXT is of type String and contains more detailed information about the error code that is being sent

STATUS_CODE is of type ENUM, represented by HttpStatusCode enum class, which corresponds to netty `HttpResponseStatus` and will be used to represent HTTP status of all error/warning messages

There is also the common interface `GenesisNackReply`, for NACK messages:

```kotlin
interface GenesisNackReply {
    val warning: List<GenesisError>
    val error: List<GenesisError>
}
```

Interface `GenesisNackReply` with MESSAGE_TYPE and SOURCE_REF fields represent whole error/warning message sent to the API client

#### Types of Nack message

These are the main types of Nack(error or warning) message. Most of them are sent either as EVENT_NACK or MSG_NACK:

| Nack message type        | Details                                                                                                       |
|--------------------------|---------------------------------------------------------------------------------------------------------------|
| EVENT_NACK               | used as response for unsuccessful event                                                                       |
| MSG_NACK                 | used when something unexpected happens and on anything that is not an event                                 |
| LOGOUT_NACK              | used when there is an issue with Logout Request                                             |
| LOGIN_AUTH_NACK          | used when there is an issue with Login Request                                              |
| LOGON_NACK               | used when there is an issue with Data Server subscription                                   |
| EVENT_LOGIN_DETAILS_NACK | used when there is an issue with provided login details: USER_NAME or SESSION_AUTH_TOKEN |
| CREATE_MFA_SECRET_NACK   | used when there is an issue with creation of MFA secret                                     |

#### Error codes

Below is the list of standard error codes, along with their Http Status code. The framework implementation is standardised to provide error code `CODE` as Enum represented by `ErrorCode` class, but it also provides flexibility to provide any error code

##### ErrorCode class definition

```kotlin
enum class ErrorCode(private val readableString: String, val statusCode: HttpStatusCode)
```

##### List of error codes:

| Error Code                           | Http Status Code          |
|--------------------------------------|---------------------------|
| GENERIC_ERROR                        | 500 Internal Server Error |
| MISSING_FIELD                        | 400 Bad Request           |  
| VALIDATION_ERROR                     | 400 Bad Request           |
| INVALID_MESSAGE                      | 400 Bad Request           |
| NOT_SUPPORTED_ENUM_VALUE             | 400 Bad Request           |
| NOT_AUTHORISED                       | 403 Forbidden             | 
| DUPLICATE_KEY                        | 500 Internal Server Error |  
| INVALID_MESSAGE_TYPE                 | 400 Bad Request           |
| INVALID_DATASOURCE                   | 400 Bad Request           |
| INVALID_PARAMETER                    | 400 Bad Request           |
| LOGIN_ERROR                          | 401 Unauthorized          |    
| MULTIPLE_TABLES                      | 500 Internal Server Error |
| MISSING_KEY                          | 400 Bad Request           |    
| UNKNOWN_TABLE                        | 400 Bad Request           |  
| UNKNOWN_FIELD                        | 400 Bad Request           |  
| UNKNOWN                              | 500 Internal Server Error |        
| NO_MESSAGE_TYPE                      | 400 Bad Request           |
| NO_SOURCE_REF                        | 400 Bad Request           |  
| NO_USER_NAME                         | 400 Bad Request           |   
| UNAVAILABLE                          | 503 Service Unavailable   |    
| UNKNOWN_MESSAGE_TYPE                 | 400 Bad Request           |
| FEATURE_NOT_PROVIDED                 | 400 Bad Request           |
| FEATURE_NOT_FOUND                    | 404 Not Found             |
| JSON_SCHEMA_NOT_FOUND                | 404 Not Found             |
| REJECT_RULE_DOES_NOT_EXIST           | 400 Bad Request           |
| ERROR_CHECKING_EXISTING_RULE         | 400 Bad Request           |
| NO_DS_NAME                           | 400 Bad Request           |     
| INVALID_DS_NAME                      | 404 Not Found             |
| INVALID_INDEX                        | 400 Bad Request           |  
| REJECT_RULE_MISSING                  | 404 Not Found             |
| ERROR_MODIFYING_RULE                 | 500 Internal Server Error |
| INVALID_CRITERIA                     | 400 Bad Request           |
| MAX_LOGON_LIMIT                      | 429 Too Many Requests     |
| RECORD_NOT_FOUND                     | 404 Not Found             |
| SERVICE_NOT_FOUND                    | 404 Not Found             |
| DATABASE_FAILURE                     | 500 Internal Server Error |
| DATABASE_ERROR                       | 500 Internal Server Error | 
| OPERATION_TIMEOUT                    | 408 Request Timeout       |
| DEPENDENT_RECORD_FOUND               | 500 Internal Server Error |
| REQUIRES_APPROVAL                    | 403 Forbidden             |
| APPROVAL_MESSAGE_MISSING             | 400 Bad Request           |
| INTERNAL_ERROR                       | 500 Internal Server Error | 
| GATEWAY_ERROR                        | 400 Bad Request           |  
| REQUEST_FAILED                       | 400 Bad Request           | 
| UNABLE_TO_UPDATE_APPROVAL            | 500 Internal Server Error |
| APPROVAL_SAME_USER_CANNOT_ACCEPT     | 400 Bad Request           |
| APPROVAL_RECORD_NOT_FOUND            | 404 Not Found             |
| REJECTED_BY_SERVICE                  | 500 Internal Server Error |
| APPROVAL_DIFF_USER_CANNOT_CANCEL     | 400 Bad Request           |
| APPROVAL_WRONG_STATUS_CANNOT_CANCEL  | 400 Bad Request           |
| APPROVAL_WRONG_STATUS_CANNOT_ACCEPT  | 400 Bad Request           |
| APPROVAL_SAME_USER_CANNOT_REJECT     | 400 Bad Request           |
| APPROVAL_WRONG_STATUS_CANNOT_REJECT  | 400 Bad Request           |
| MISSING_HOSTNAME                     | 400 Bad Request           |
| NUMBER_OF_RECORDS_DOES_NOT_MATCH     | 400 Bad Request           |

##### Http status code

We use standard HTTP status codes to represent response status. This is a well-known standard that is easy to understand. It is Internally represented by the `HttpStatusCode` enum class, which corresponds to netty [HttpResponseStatus](https://netty.io/4.0/api/io/netty/handler/codec/http/HttpResponseStatus.html)

**Http Status Code for error message**
Because we send back multiple errors in a single message, we need to consider what the status code is for the message itself. We will do that by adjusting message status code based on the errors’ status codes.

1. If the message contains a single error or the message contains multiple errors with all the same status code, then the message’s status code will be set to the same.
2. If the message contains multiple errors with different status codes, then following approach is used to determine the response status code
    - For multiple 5xx errors : response status code would be set to 500
    - For multiple 4xx errors : response status code would be set to status code of first error
    - If there are mix of 5xx and 4xx errors : response status code would be set to 500

**Http Status Code for warning message**

1. If we have mix of error and warning messages: response status would be status code of error message and above logic is used to find error status code
2. If we have only warning messages:  response status would be set to 400
