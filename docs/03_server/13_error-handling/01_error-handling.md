---
title: 'Client-Server Error Handling'
sidebar_label: 'Error Handling'
id: error-handling
keywords: [error handling, error format, error, format, http, http status]
tags:
- error handling
- error format
- error
- format
- http
- http status
---

We follow common format to represent error or warning messages sent between server and client. The message format will be same for all HTTP and WebSocket messages we support

Message Format:

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

All error/warnings are represented as implementations of GenesisError interface which is defined as follows

```kotlin
interface GenesisError {
    val code: String
    val text: String
    val statusCode: HttpStatusCode
        get() = HttpStatusCode.InternalServerError
}
```

So by default all error/warning messages will be having the following properties along with any extra properties that are needed to represent error:

CODE: Represents error code, which can be of two types:
- [ErrorCode](../error-codes): This is the ENUM class which contains list of different error codes coming from server
- String: This provides flexibility to pass any code which is not part of ErrorCode enum

TEXT: Is of type String and contains more detail information about the error code that is being sent

STATUS_CODE: Is of type ENUM, represented by HttpStatusCode enum class, which corresponds to netty HttpResponseStatus and will be used to represent HTTP status of all error/warning messages

Similar to GenesisError, we also have common interface called GenesisNackReply to represent all the NACK messages as shown below:

```kotlin
interface GenesisNackReply {
    val warning: List<GenesisError>
    val error: List<GenesisError>
}
```

Interface GenesisNackReply with MESSAGE_TYPE and SOURCE_REF fields represent whole error/warning message sent over the channel to frontend

Different types of Nack messages

We have many type of Nack(error or warning) messages, of which most of them are either sent as EVENT_NACK or MSG_NACK.

Some Nack messages are listed here:

| Nack Message type        | Details                                                                                                       |
|--------------------------|---------------------------------------------------------------------------------------------------------------|
| EVENT_NACK               | Used as response for unsuccessful event                                                                       |
| MSG_NACK                 | Used when something unexpected happens and on everything that is not an event                                 |
| LOGOUT_NACK              | This type of Nack is used when there is issue with Logout Request                                             |
| LOGIN_AUTH_NACK          | This type of Nack is used when there is issue with Login Request                                              |
| LOGON_NACK               | This type of Nack is used when there is issue with data server subscription                                   |
| EVENT_LOGIN_DETAILS_NACK | This type of Nack is used when there is issue with provided login details i.e USER_NAME or SESSION_AUTH_TOKEN |
| CREATE_MFA_SECRET_NACK   | This type of Nack is used when there is issue with creation of MFA secret                                     |