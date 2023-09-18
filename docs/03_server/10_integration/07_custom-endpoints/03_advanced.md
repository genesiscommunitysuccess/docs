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

Any write call to the `db` will create audit entries for auditable tables, and will be executed in a transaction, if supported by the database layer.

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

## Endpoint Paths

The endpoint by default will take its root from the file name. For example, if the file is called **trade-web-handler.kts**, all endpoints are prefixed with **trade**. 

### Overriding the base path

You can specify a `basePath` in the `webHandlers` block:

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

You can add extra path segments using the `grouping` function in this way:

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

The `config` function can be used to configure endpoints, which are supported on different levels: 
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

### Multipart options

| Syntax        | Description                                          |
|---------------|------------------------------------------------------|
| `maxFileSize` | Defines the maximum file size                        |
| `useDisk`     | Defines that files should be written to disk         |
| `baseDir`     | Defines the base directory for files written to disk |
| `minSize`     | Defines the minimum size for files written to disk   |

## Custom type handling

Use `parseRequest` and `composeResponse` to define custom type handling. This is useful if the framework doesn't support the required content type, or if you need 
custom handling of the request or response. These blocks are available within the `config` block, at each level. 

To use these, you must provide two types: the input type, and the output type. Optionally, you can add a content type. 

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

Here, the input type is `String`, and the output type is `Trade`. The `parseRequest` block takes a lambda that takes the input type, and returns the output type. The output type is then passed to the `handleRequest` block as the `body`.
    
### Response composing

When composing a response, the output type tells the endpoint how to handle the final part of the response; this can be any type the endpoint supports. For example, if you want to produce an endpoint to produce a custom xml, you could do this: 

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

Another way to handle different status codes is to handle exceptions. The `exceptionHandler` block enables you to catch specific exceptions and provide a response, including a specific status code.

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

These can be optional or required. If a required parameter is missing, it will not be matched. If no matching endpoint is found, a `404 Not Found` will be returned.

Use the `by` syntax to define parameters. Note that these variables are only available within the `handleRequest` block. If they are accessed outside this block, an exception will be thrown.

### Query parameters

Here is a simple example of how to define a query parameter: 

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by queryParameter("name")

    handleRequest {
        "Hello $name"
    }
}
```

Here is an example of how to define an optional query parameter. Optional parameters are always nullable.

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by optionalQueryParameter("name")
    
    handleRequest {
        "Hello ${name ?: "Anonymous"}"
    }
}
```

### Path parameters

Path parameters are defined, as per the example below, and are always required:

```kotlin {2,5}
endpoint(RequestType.GET, "test/{name}") {
    val name by pathParameter("name")
    
    handleRequest {
        "Hello $name"
    }
}
```

### Header parameters

Header parameters are defined, as per the example below:

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by header("name")
    
    handleRequest {
        "Hello $name"
    }
}
```

An optional header parameter can be defined as per below. Optional parameters are always nullable.

```kotlin {2,5}
endpoint(RequestType.GET, "test") {
    val name by optionalHeader("name")

    handleRequest {
        "Hello $name"
    }
}
```

#### Required values

Headers can also have a set of required values. If the header is present, but the value does not
match, then the endpoint will not be matched. Please note that the required values will be 
published as part of the OpenAPI specification, unless they are declared a secret.

The below endpoint will only match is the `Test-Header` header is present with its value set to
`test`:

```kotlin {2}
endpoint(RequestType.GET, "test") {
    header("Test-Header", "test")
 
    handleRequest {
        "Hello World"
    }
}
```

#### Secret values

Secret headers are defined as: 

```kotlin {2}
endpoint(RequestType.GET, "test") {
    headerSecret("secret-header", "secret-value")
    
    handleRequest {
        "OK"
    }
}
```

## OpenAPI

By default, the framework will generate an basic OpenAPI specification for all endpoints. This 
includes the path, schemas of the request and response type, if supported. To enable this,
the `openapi` block can be used to provide additional information, like descriptions and examples.

We can provide the following information: 

* `description`
* `summary`
* `response` 
* `requestBody`
* `parameters`

### Description and summary

We can provide a description and summary for our endpoint:

```kotlin
endpoint(RequestType.GET, "test") {
    openapi {
        description = "A test endpoint"
        summary = "This endpoint is available for testing..."
    }
    // removed for brevity
}
```

### Response

A schema for the response type used in the endpoint will be generated automatically, this schema
includes support for sealed types. However, the schema can be customised if needed. Also examples
and descriptions can be provided. Furthermore, additional responses can be defined. 

```kotlin {2-13}
endpoint<TestData>(RequestType.GET, "test") {
    openapi {
        response {
            description = "A test response"
            example(TestData("Hello World", 1))
        }
        response(HttpStatusCode.NotAcceptable) {
            noBody()
        }
        response(HttpStatusCode.NotFound) {
            example("Something went missing")
        }
    }
    // removed for brevity
}
```

Here we define that the standard response will be of type `TestData`. We also provide an example, 
and a description. We also define that if the status code is `406 Not Acceptable`, then there will
be no body. Further, if the status code is `404 Not Found`, then the body will be a string.

### Request Body

As with responses, the request body schema will be generated automatically. However, this can be
also be customised. Similarly, a description and example can be provided. Providing an example 
for a request body will be very useful for testing the endpoint in the OpenAPI UI. As the 
request is ready to go with the example data, which the user can modify to suit their needs.

```kotlin {2-9}
endpoint<TestData, String>(RequestType.GET, "test") {
    openapi {
        requestBody {
            description = "A test request"
            example(TestData("test", 1))
        }
    }
    // removed for brevity
}
```

Here we take `TestData` as the request body, and return a `String`. We also provide a description
and example for the request body.

### Parameters

By default the framework will describe parameters in the OpenAPI spec. However, additional
information can be provided:

```kotlin
endpoint<String>(RequestType.GET, "users") {
    openapi {
        parameters {
            query("userGroup") {
                description = "The user group to filter by"
            }
        }
    }
    // removed for brevity
}
```
