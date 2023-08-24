---
title: 'ErrorCode'
sidebar_label: 'Error Code'
id: error-codes
keywords: [error code, error, http status, status, response status]
tags:
- error code
- error
- http status
- status
- response status
---

# Error Codes

Below is the list of standard error codes we use along with their Http Status code, framework implementation is standardized to provide `CODE` as Enum represented by `ErrorCode` class but it also provides flexibility to provide any error code

### ErrorCode class definition

```kotlin
enum class ErrorCode(private val readableString: String, val statusCode: HttpStatusCode)
```

### List of error codes:

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

### Http Status Code

We use standard HTTP status codes to represent response status, which makes it easier to understand as it is an existing and well-known standard.
Internally represented by HttpStatusCode enum class, which corresponds to netty [HttpResponseStatus](https://netty.io/4.0/api/io/netty/handler/codec/http/HttpResponseStatus.html)

**Http Status Code for error message**
Due to the fact that we send back multiple errors in a single message we need to consider what the status code would be for the message itself. We will do that by adjusting message status code based on the errors’ status codes.

1. If the message contains a single error or the message contains multiple errors with all the same status code, then the message’s status code will be set to the same.
2. If the message contains multiple errors with different status codes, then following approach is used to determine the response status code
    - For multiple 5xx errors : response status code would be set to 500
    - For multiple 4xx errors : response status code would be set to status code of first error
    - If there are mix of 5xx and 4xx errors : response status code would be set to 500

**Http Status Code for warning message**

1. If we have mix of error and warning messages: response status would be status code of error message and above logic is used to find error status code
2. If we have only warning messages:  response status would be set to 400