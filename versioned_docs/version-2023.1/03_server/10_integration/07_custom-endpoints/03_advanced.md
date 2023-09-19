---
title: 'Custom endpoints - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, integration, custom endpoints, advanced]
tags:
  - server
  - integration
  - custom endpoints
  - advanced
---

## Request context

Within the context of `handleRequest`, the following properties are in scope:

| Property   | Description                                  | Available      |
|------------|----------------------------------------------|:---------------|
| `db`       | The database instance                        | Always         |
| `body`     | The body of the request                      | Always         |
| `userName` | The user name of the user making the request | When logged in |
| `request`  | The request object                           | Always         |

Any write call to the `db` creates audit entries for auditable tables, and is executed in a transaction, if supported by the database layer.

Additionally, the `triggerEvent` function is available to trigger events from the endpoint:

```kotlin {4}
endpoint<Trade, Trade>(POST, "insert-trade") {
    handleRequest {
        val trade = db.insert(body).record
        triggerEvent("NOTIFY_TRADE_CREATED", trade)
        trade
    }
}
```

## Endpoint paths

By default, the endpoint takes its root from the file name. For example, if the file is called **myapp-web-handler.kts**, all endpoints are prefixed with **myapp**. 

### Overriding the base path

You can override the base path by specifying a `basePath` in the `webHandlers` block:

```kotlin {1}
webHandlers("my-base-path") {
    endpoint(GET, "all-trades") {
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

In the example above, the path would be:

* **my-base-path/all-trades**

### Adding additional path levels

You can add extra path segments using the `grouping` function. Here is an example:

```kotlin {2}
webHandlers("tables") {
    grouping("trade") {
        endpoint(GET, "all-trades") {
            db.getBulk(TRADE)
        }
        endpoint(GET, "big-trades") {
            db.getBulk(TRADE)
                .filter { it.quantity > 1_000 }
        }
    }
}
```

In the example above, the paths would be:

* **tables/trade/all-trades**
* **tables/trade/big-trades**

## Config

Use the `config` function to configure endpoints, which are supported on different levels:

- `webHandlers` level
- `grouping` level
- `endpoint` levels

`config` calls in nested blocks override those in parent blocks.  

### Example 

This is an example of a `config` block:

```kotlin
config {
    requiresAuth = false
    maxRecords = 10_000
    logLevel = DEBUG

    json {
        prettyPrint = true
        propertyCase = PropertyCase.CAMEL_CASE
    }

    multiPart {
        maxFileSize = 10_000_000
        useDisk = true
        baseDir = "runtime/router/fileuploadtemp"
        minSize = 100_000
    }
}
```


### Available config options

`config` is available within the `webHandler` block, the `grouping` block, the `endpoint` block, and the
`multipartEndpoint` block.

| Syntax                                               | Description                                                                |
|------------------------------------------------------|----------------------------------------------------------------------------|
| `requiresAuth`                                       | Defines that the endpoint requires authentication                          |
| `maxRecord`                                          | Defines the maximum number of records returned                             |
| `logLevel`                                           | Defines the log level                                                      |
| `json { ... }`                                       | Defines the JSON configuration                                             |
| `multiPart { ... }`                                  | Defines the multipart configuration                                        |
| `register(requestParsers)`                           | Registers request parsers                                                  |
| `register(responseComposers)`                        | Registers response composers                                               |
| `parseRequest<INPUT, TYPE> { ... }`                  | Defines a request parser from INPUT to TYPE                                |
| `parseRequest<INPUT, TYPE>(contentType) { ... }`     | Defines a request parser for a specific content type                       |
| `composeResponse<TYPE, OUTPUT> { ... }`              | Defines a response composer for TYPE to OUTPUT                             |
| `composeResponse<TYPE, OUTPUT>(contentType) { ... }` | Defines a response composer for TYPE to OUTPUT for a specific content type |

### JSON options

| Syntax         | Description                                                           |
|----------------|-----------------------------------------------------------------------|
| `prettyPrint`  | Defines that JSON should be pretty printed                            |
| `propertyCase` | Defines the case of JSON properties, either camel case, or snake case |

### multipart options

| Syntax        | Description                                          |
|---------------|------------------------------------------------------|
| `maxFileSize` | Defines the maximum file size                        |
| `useDisk`     | Defines that files should be written to disk         |
| `baseDir`     | Defines the base directory for files written to disk |
| `minSize`     | Defines the minimum size for files written to disk   |

## Custom Type handling

Use`parseRequest` and `composeResponse` to define custom type handling. This is useful if the framework doesn't support the required content type, or if you need custom handling of the request or response. These blocks are available within the `config` block, at each level. 

To use these, you must provide:

- the input type
- the output type
- optionally, a content type

### Request parsing

When parsing a request, the input type tells the endpoint how to handle the initial parsing of the request. For example, if you want to handle the input as a `String`, you can do this:

```kotlin {3-10}
endpoint<Trade, Trade>(RequestType.PUT, "test") {
    config {
        parseRequest<String, Trade> {
            Trade {
                tradeId = input
                tradeType = "SWAP"
                currencyId = "USD"
                tradeDate = DateTime.now()
            }
        }
    }

    handleRequest {
        body
    }
}
```

In the example above, the input type is `String`, and the output type is `Trade`. The `parseRequest` block takes a lambda that takes the input type, and returns the output type. The output type is then passed to the `handleRequest` block as the `body`.
    
### Response composing

When composing a response, the output type tells the endpoint how to handle the final part of the response; it can be any type that the endpoint supports. For example, if you want to produce an endpoint to produce a custom xml: 

```kotlin {3-12}
endpoint<String, String>(RequestType.GET, "test") {
    config {
        composeResponse<Trade, String>(ContentType.APPLICATION_XML) {
            """
                <trade>
                    <tradeId>${response.tradeId}</tradeId>
                    <tradeType>${response.tradeType}</tradeType>
                    <currencyId>${response.currencyId}</currencyId>
                    <tradeDate>${response.tradeDate}</tradeDate>
                </trade>
            """.trimIndent()
        }
    }
    
    produces(ContentType.APPLICATION_XML)
    
    handleRequest {
        db.get(Trade.ById(body))
    }
}
```

## Http status codes

By default, all endpoints return a `200 OK` status code. 

### Default status code

You can override the default response status by setting the status explicitly:

```kotlin {2}
webHandlers {
    endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade", status = HttpStatusCode.Created) {
        handleRequest {
            db.insert(body)
        }
    }
}
```

### `HttpResponseCode` annotation

Use the `HttpResponseCode` annotation to set the status code for a specific class. This can be especially useful with kotlin sealed classes, where different subclasses return different status codes.

In the example below, if our endpoint returns `SealedResponse`, we will return a `200 OK` status code for `AllGood`, and a `404 Not Found` status code for `Missing`:

```kotlin {2,5}
sealed class SealedResponse {
    @HttpResponseCode(HttpStatusCode.Ok)
    data class AllGood(val motivation: String) : SealedResponse()

    @HttpResponseCode(HttpStatusCode.NotFound)
    data class Missing(val sadMessage: String) : SealedResponse()
}
```

### Exception handling

Another way to handle different status codes is to handle exceptions. The `exceptionHandler` block enables you to catch a specified exception and provide a response, including a specific status code.

In this example, we return status code `406 Not Acceptable` for `IllegalArgumentException`:

```kotlin {2,9-13}
webHandlers {
    endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade", status = HttpStatusCode.Created) {
        handleRequest {
            require(trade.date >= DateTime.now()) {
                "Trade date cannot be in the past"
            }
            db.insert(body)
        }
        exceptionHandler {
            exceptionHandler<IllegalArgumentException>(HttpStatusCode.NotAcceptable) {
                exception.message ?: "Error handling trade"
            }
        }
    }
}
```

## Request parameters

In addition to the body, endpoints can also take request parameters. These are defined in the `endpoint` block, and are available in the `handleRequest` block.

The framework supports the following parameter types:
* query parameter
* path parameter
* header parameter

These parameters can either be optional or required. If a required parameter is missing, it will not be matched. If no matching endpoint is found, a `404 Not Found` will be returned.

Use the `by` syntax to define a parameter. However, these variables are only available within the `handleRequest` block. If they are accessed outside this block, an exception will be thrown.

### Query parameters

Here is an example of defining a query parameter: 

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by queryParameter("name")

    handleRequest {
        "Hello $name"
    }
}
```

Here is an example of defining an optional query parameter. Optional parameters are always nullable.

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by optionalQueryParameter("name")
    
    handleRequest {
        "Hello ${name ?: "Anonymous"}"
    }
}
```

### Path parameters

Path parameters are always required. Here is an example of defining a path parameter: 

```kotlin {2,5}
endpoint(RequestType.GET, "test/{name}") {
    val name by pathParameter("name")
    
    handleRequest {
        "Hello $name"
    }
}
```

### Header parameters

Here is an example of defining a header parameter:

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by header("name")
    
    handleRequest {
        "Hello $name"
    }
}
```

Here is an example of defining an optional header parameter. Optional parameters are always nullable.

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by optionalHeader("name")

    handleRequest {
        "Hello $name"
    }
}
```

#### Required values

Headers can also have a set of required values. If the header is present, but the value does not match, then the endpoint will not be matched. 

In the example below, the endpoint will only match if the `Test-Header` header is present with its value set to `test`:

```kotlin {2}
endpoint(RequestType.GET, "test") {
    header("Test-Header", "test")
 
    handleRequest {
        "Hello World"
    }
}
```

#### Secret values

Here is an example of defining a secret header: 

```kotlin {2}
endpoint(RequestType.GET, "test") {
    headerSecret("secret-header", "secret-value")
    
    handleRequest {
        "OK"
    }
}
```
