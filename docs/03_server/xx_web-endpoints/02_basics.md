---
title: 'Web Endpoints - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, endpoint, end point, router, basics]
tags:
  - server
  - endpoint
  - introduction
---

# Web Endpoint

You define web endpoints in a gpal file of type `web-handler.kts`

This is an example of a web handler file `trade-web-handler.kts`:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

This endpoint will provide the content of `TRADE` table in JSON format on `trade/all-trades` at the router.

To make this endpoint available, you should only need to provide the `web-handler.kts` in a `{product}/scripts` folder,
where product is the name of your project. The file will be detected automatically by the router on start up.

## Receiving input

Endpoints can also receive input, this would be when the http request includes a body. The body can be parsed
and will be available in the `body` property of the `handleRequest` block. When endpoints receive input, it becomes
necessary to provide type parameters for both the request body and the response type:

```kotlin
endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade") {
    handleRequest {
        db.insert(body)
    }
}
```

As with the response; the body will be handled as JSON, unless you specify another content type.

## Type handling

To produce CSV instead of JSON, you can that the endpoint produces a different content type, `text/csv` in
this case:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        produces(ContentType.TEXT_CSV)
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

We can also specify multiple content type; for example, this endpoint will produce CSV or JSON, depending on the
`Accept` header on the request:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        produces(ContentType.TEXT_CSV, ContentType.APPLICATION_JSON)
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

We can also specify the content type an endpoint accepts, with the `accepts` function:

```kotlin
endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade") {
    accepts(ContentType.APPLICATION_JSON)
    handleRequest {
        db.insert(body)
    }
}
```

As with the `produces` function, multiple content types can be specified:

```kotlin
endpoint<List<Trade>, List<InsertResult<Trade>>>(POST, "insert-trade") {
    accepts(ContentType.APPLICATION_JSON, ContentType.TEXT_CSV)
    handleRequest {
        db.insertAll(body)
    }
}
```

This endpoint will accept either JSON or CSV, and will parse the body accordingly.

By default, only JSON and CSV are supported; however, it is possible to add support for other content types, for more
details, see the config section below.

### Handling requests

Within the context of `handleRequest`, the following properties are in scope:

| Property   | Description                                  | Available      |
|------------|----------------------------------------------|:---------------|
| `db`       | The database instance                        | Always         |
| `body`     | The body of the request                      | Always         |
| `userName` | The user name of the user making the request | When logged in |
| `request`  | The request object                           | Always         |

Additionally, the `triggerEvent` function is available to trigger events from the endpoint:

```kotlin
endpoint<Trade, Trade>(POST, "insert-trade") {
    handleRequest {
        val trade = db.insert(body).record
        triggerEvent("NOTIFY_TRADE_CREATED", trade)
        trade
    }
}
```

### Grouping endpoints

Multiple endpoints can be defined in the same file, and you can also overwrite the prefix of the path by
providing it to the `webHandlers` call, e.g. `webHandlers("table/trade") { ... }`, in which case the endpoint
would be available on `table/trade/all-trades`.

Also, you can group endpoints in a `grouping`, for example:

```kotlin
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

This endpoint receives a trade and inserts it into the database, and then returns the trade as it exists in the
database, include any generated fields. `grouping` blocks have a `config { ... }` block that can be used to
specify group level configuration

## Authorisation

Endpoints support an authorisation model similar to the one used by GPAL event handlers, data servers and request
servers.
As in those services, there is a `permissioning` block that can be used to restrict access to the endpoint, and
permission codes can be used to restrict access to specific users. However, unlike those services, authorisation
restrictions can be applied to both the incoming and outgoing messages. Instead of `auth` we have `requestAuth`
and `responseAuth`.

### Permission codes

Permission codes are used to restrict access to users with specific roles. For example, we could restrict access
to the `insert-trade` endpoint to users with the `TRADER` permission code like this:

```kotlin
endpoint<Trade, Trade>(POST, "insert-trade") {
    accepts(ContentType.APPLICATION_JSON)
    produces(ContentType.APPLICATION_JSON)

    permissioning {
        permissionCodes("TRADER")
    }

    handleRequest {
        db.insert(body).record
    }
}
```

### customPermission checks

In addition to standard permission code, it is possible to define custom checks. For this we have the folloing
properties in context:

| Property   | Description                                  | 
|------------|----------------------------------------------|
| `db`       | The database instance                        |
| `body`     | The body of the request                      |
| `userName` | The user name of the user making the request |
| `request`  | The request object                           |

Additionally, any query parameter, header, and path parameter is also accessible. This can be used to
provide custom checks, for example:

```kotlin   
endpoint(RequestType.GET, "test") {
    val secret by header("secret")

    permissioning {
        customPermissions {
            secret == "secret-api-key"
        }
    }

    handleRequest {
        db.getBulk(SECRETS)
    }
}
```

### Row level permissions - incoming

To apply row level permissions on the incoming message, use `requestAuth`:

```kotlin
endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade") {
    accepts(ContentType.APPLICATION_JSON)
    produces(ContentType.APPLICATION_JSON)

    permissioning {
        requestAuth("CCY_MAP") {
            field { currencyId }
        }
    }

    handleRequest {
        db.insert(body)
    }
}
```

### Row level permissions - outgoing

Similarly, to apply row level permissions on the outgoing message, use `responseAuth`. The row level permissions are
different from other GPAL services, as with endpoints, we able to return individual entities rather as well as
`Collection<>` and `Flow<>`. To support this, we have to specify how to apply the authorisation. This is done using an
additional parameter to `responseAuth`. In this case are we are returning a `Flow<Trade>`, we use `flow<Trade>()`:

```kotlin
endpoint(GET, "all-trades") {
    produces(ContentType.APPLICATION_JSON)

    permissioning {
        responseAuth("CCY", flow<Trade>()) {
            field { currencyId }
        }
    }

    handleRequest {
        db.getBulk(TRADE)
    }
}
```

Please see (permissioning url) for details. Please note that compared to event handlers, data servers and request
servers, endpoints support authentication on both the incoming and outgoing message. To support this, endpoints have
`requestAuth` and `responseAuth` rather than `auth`. Like standard GPAL, you can combine multiple auth blocks
with `and` and `or`. However, you can only combine `requestAuth` with other `requestAuth` and `responseAuth` with
other `responseAuth`.

We could also add the currency restriction to our `all-trades` endpoint like this:

In this example, we also had to specify how to apply the authorisation. As we want to check for permissions on
each `Trade` returned by the flow, we have to use the `flow<Trade>()` function. This tells the endpoint how to
handle permission per entity rather than on the whole flow. If we were returning a list, we would have to
use `list<Trade>()` instead.

In addition to JSON, endpoint provide out of the box support for CSV as well, for example we could expand the
example above to optionally produce CSV like this:

```kotlin
endpoint(GET, "all-trades") {
    produces(ContentType.APPLICATION_JSON, ContentType.TEXT_CSV)

    permissioning {
        responseAuth("CCY", flow<Trade>()) {
            field { currencyId }
        }
    }

    handleRequest {
        db.getBulk(TRADE)
    }
}
```

## Type handling

As per above, the endpoints will be able to handle most types in JSON and CSV formats. For JSON, endpoints support
properties in SNAKE_CASE and camelCase, which can be configured in the config block, explained below. The endpoints
will handle most types in JSON; including Flow or Collection types. String and Byte Arrays are passed on to client
unaltered and `Unit` would denote an empty response.

## Configuration

Within the `config` block, you can provide endpoint configuration. These blocks are provided on multiple levels, within
the `webHandler`, `grouping` and `endpoint` blocks. Configuration is inherited from the parent, and can be overridden.

The config block support the following top level settings:

| Value             | Default | Type                   | Meaning                                                          |
|-------------------|---------|:-----------------------|------------------------------------------------------------------|
| `requiredAuth`    | `true`  | `true`/`false`         | only authenticated users can access this endpoint if set to true |
| `maxRecords`      | 2000    | `Int`                  | maximum numbers of records an endpoint can return                |
| `logLevel`        | `TRACE` | `TRACE`,`DEBUG`,`INFO` | default log level in endpoint - for debugging purposes           |
| `json`            |         | see below              | JSON configuration                                               |
| `multiPart`       |         | see below              | Multi-part configuration                                         |
| `register`        |         | see below              | Register custom request parsers or response composers            |
| `parseRequest`    |         | see below              | Register inline request parser                                   |
| `composeResponse` |         | see below              | Register inline response composer                                |

### JSON Configuration

The `json` configuration block supports the following settings:

| Value          | Default      | Type                     | Meaning                                |
|----------------|--------------|:-------------------------|----------------------------------------|
| `propertyCase` | `SNAKE_CASE` | `SNAKE_CASE`,`camelCase` | the case format of JSON properties     |
| `prettyPrint`  | `true`       | `Boolean`                | set to `true` to pretty print the JSON |

### Multi-Part Configuration

The `multiPart` configuration block supports the following settings:

| Value         | Default                         | Type      | Meaning                                    |   
|---------------|---------------------------------|:----------|--------------------------------------------|
| `maxFileSize` | `0x40000000` (1 MB)             | `Int`     | maximum size of a multi-part request       | 
| `useDisk`     | `true`                          | `Boolean` | will cache request above `minSize` to disk |
| `minSize`     | `0x4000` (16 KB)                | `Long`    | file cache threshold                       |
| `baseDir`     | `runtime/router/fileuploadtemp` | `String`  | file cache location                        |

### Register Custom Request Parsers or Response Composers

Supported request parsers and response composers can be registered using the `register` method.

#### Request Parsers

Request parsers are used to parse the request body into a type. The following request parsers are supported out of the
box:

| Type      | Content Type(s)       | Description                                                              |
|-----------|-----------------------|--------------------------------------------------------------------------|
| json      | `application/json`    | Parses the request body as JSON into the specified type.                 |
| csv       | `text/csv`            | Parses the request body as CSV into the specified type.                  |
| multipart | `multipart/form-data` | Parses the request body as multi-part form data into the specified type. |    
| String    | any                   | Parses the request body as a String.                                     |
| ByteArray | any                   | Parses the request body as a ByteArray.                                  |
| Unit      | any                   | Parses the request body as a Unit.                                       |

If you want to parse any other type of request body, you can register a custom request parser. This can be done
by calling the `parseRequest` function. This functions takes two type parameters, the first is the type to parse
from, and the second is the type to parse to. This can be used to chain parsers together.

Optionally, a `contentType` can be specified to limit the parser to a specific content type. If no content type
then any content type will be accepted.

As part of the context, the `input` is provided, which is the request body as the first type parameter. Also, the
Content-Type header is provided as `contentType`.

```kotlin
config {
    requestParser<String, MyType> {
        val (name, quantity) = input.split(",")
        MyType(name = name, quantity = quantity.toInt())
    }

    requestParser<String, MyType>("text/my-type") {
        val (name, quantity) = input.split(",")
        MyType(name = name, quantity = quantity.toInt())
    }
}
```

#### Response Composers

Response composers are used to take a response produced by a request handler and return a response that the network
layer can handle. The following response composers are supported:

| Type         | Content Type(s)    | Description                                                 |
|--------------|--------------------|-------------------------------------------------------------|
| json         | `application/json` | Composes the response body as JSON from the specified type. |
| csv          | `text/csv`         | Composes the response body as CSV from the specified type.  |    
| String       | any                | Composes the response body as a String.                     |
| ByteArray    | any                | Composes the response body as a ByteArray.                  |
| Unit         | any                | Composes the response body as a Unit.                       |
| InputStream  | any                | Composes the response body as an InputStream.               |
| File         | any                | Composes the response body as a File.                       |
| Path         | any                | Composes the response body as a Path.                       |
| FileDownload | any                | Composes the response body as a FileDownload.               |

Please note that the `InputStream`, `File` and `Path` composers will process the response in chunks, this will allow
the response to be streamed to the client. This is useful for large responses.

If you want to compose any other type of response body, you can register a custom response composer. This can be done
by calling the `composeResponse` function. This functions takes two type parameters, the first is the type to compose
from and the second is the type to compose to.

Optionally, a `contentType` can be specified to limit the composer to a specific content type. If no content type
then any content type will be accepted.

As part of the context, the `response` is provided, which is the response body as the first type parameter. Also, the
Accept header is provided as `accept`.

```kotlin
config {
    responseComposer<MyType, String> {
        "${response.name},${response.quantity}"
    }

    responseComposer<MyType, String>("text/my-type") {
        "${response.name},${response.quantity}"
    }
}
```

## Query Parameters, Headers and Path Parameters

In addition to request body, there are other ways to get input for endpoints, namely, query parameters, path
parameters and headers. These can be defined within the endpoint, before the `handleRequest` call. At that
point, query parameters and headers can be made optional or not. These inputs are then a requirement for the
endpoint, unless they are optional. Path parameters can never be optional.

Once declared, the values are only available within the `handleRequest` block, and within the `customPermission` block,
that is, while a request is being processed. Accessing the values outside of these blocks will result in an exception.

### Query Parameters

This is an example of how to use a query parameter

```kotlin
endpoint(GET, "hello") {
    val name by queryParameter("name")

    handleRequest {
        "Hello $name"
    }
}
```

As you can see, we declare a query parameter called `name` and within `handleRequest`, we can retrieve the
value from the `request` object.

In this example, a call to `test?name=John` would respond with `Hello John`, and a call to `test`
would be rejected.

We could also make the parameter option by using `optionalQueryParameter`:

```kotlin
endpoint(GET, "hello") {
    val name by optionalQueryParameter("name")

    handleRequest {
        "Hello ${name ?: "Anonymous"}"
    }
}
```

Here, we use `optionalQueryParameter` instead of `queryParameter`, as such it's value is nullable.

In this example, a call to `test?name=John` would respond with `Hello John`, and a call to `test`
would respond with `Hello Anonymous`.

Multiple query parameters can also be grouped into a data class like this:

```kotlin
data class NameAndNumber(val name: String, val number: Int)

endpoint(GET, "test") {
    val nameAndNumber by queryParameters<NameAndNumber>()

    handleRequest {
        val (name, number) = nameAndNumber
        "Hello $name: $number"
    }
}
```

In this example, a call to `test?NAME=Peter&NUMBER=3` would respond with `Hello Peter: 3`. Parameters can
be made optional by providing default values in the constructor.

### Headers

Headers work in much the same way as query parameters:

```kotlin
endpoint(GET, "test") {
    val name by header("Name")

    handleRequest {
        "Hello $name"
    }
}
```

With the header `Name` set to `John` a call to `test` would respond with `Hello John`, a call without the header
would be rejected. Similar to the query parameter, there is also an `optionalHeader`.

Headers can also be used to filter requests, for example this endpoint, will only accept request with a header
`Test-Header` set to `test`

```kotlin
endpoint(GET, "test") {
    header("Test-Header", "test")

    handleRequest {
        "Hello World"
    }
}
```

There is also syntax support for secret headers. An incorrect header value will be treated as an authorisation failure.

```kotlin
endpoint(GET, "test") {
    secretHeader("Secret-Header", API_TOKEN_KEY)

    handleRequest {
        "Hello World"
    }
}
```

Here for example we check our secret header against a system definition value for our API token key.

### Path Parameters

Path parameters support pattern matching on the endpoint path:

```kotlin
endpoint(GET, "trade/by-id/{id}") {
    val id by pathParameter("id")

    handleRequest {
        db.get(Trade.ById(id))
    }
}
```

## Syntax guide

### Top level methods

| Syntax                                                    | Description                                               |
|-----------------------------------------------------------|-----------------------------------------------------------|
| `endpoint(method, path) { ... }`                          | Defines an endpoint, return type is inferred              |
| `endpoint<RequestType, ReturnType>(method, path) { ... }` | Defines an endpoint, request and return type is specified |~~
| `multipartEndpoint(method, path) { ... }`                 | Endpoint that receives a multipart request                |
| `grouping(path) { ... }`                                  | Defines a group of endpoints                              |

### Within an endpoint or multipartEndpoint block

| Syntax                         | Description                                     |
|--------------------------------|-------------------------------------------------|
| `handleRequest { ... }`        | Defines the request handler                     |
| `produces(contentType)`        | Defines the response content type               |
| `accepts(contentType)`         | Defines the request content type                |
| `header(name)`                 | Defines a required header                       |
| `header(name, value)`          | Defines a required header with a specific value |
| `secretHeader(name, key)`      | Defines a required secret header                |
| `optionalHeader(name)`         | Defines an optional header                      |
| `queryParameter(name)`         | Defines a required query parameter              |
| `optionalQueryParameter(name)` | Defines an optional query parameter             |
| `queryParameters<T>()`         | Defines a required query parameter group        |
| `pathParameter(name)`          | Defines a path parameter                        |
| `permissions { ... }`          | Defines the permissions for the endpoint        |

### Within a handleRequest block

| Syntax     | Description                         |
|------------|-------------------------------------|
| `request`  | The request object                  |
| `body`     | The request body                    |
| `userName` | The user name, or null if anonymous |
| `db`       | The database                        |

### Within a config block

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

#### Within a json block

| Syntax         | Description                                                           |
|----------------|-----------------------------------------------------------------------|
| `prettyPrint`  | Defines that JSON should be pretty printed                            |
| `propertyCase` | Defines the case of JSON properties, either camel case, or snake case |

#### Within a multiPart block

| Syntax        | Description                                          |
|---------------|------------------------------------------------------|
| `maxFileSize` | Defines the maximum file size                        |
| `useDisk`     | Defines that files should be written to disk         |
| `baseDir`     | Defines the base directory for files written to disk |
| `minSize`     | Defines the minimum size for files written to disk   |

#### Complete example 
    
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
    
    parseRequest<String, Trade>(ContentType.APPLICATION_JSON) {
        input.jsonToObject()
    }
    
    composeResponse<Trade, String>(ContentType.APPLICATION_JSON) {
        response.toJsonString()
    }
}
```

### Within a permissions block

| Syntax                                          | Description                                                                             |
|-------------------------------------------------|-----------------------------------------------------------------------------------------|
| `permissionCode(codes)`                         | Defines a permission code                                                               |
| `requestAuth(authMap) { ... }`                  | Defines a request authentication permission                                             |
| `responseAuth(authMap) { ... }`                 | Defines a response authentication permission                                            |
| `responseAuth(authMap, responseMapper) { ... }` | Defines a response authentication permission                                            |
| `customPermission { ... }`                      | Defines a custom permission                                                             |
| `and`                                           | Combines multiple `requestAuth` or `responseAuth` blocks, both conditions have to match |
| `or`                                            | Combines multiple `requestAuth` or `responseAuth` blocks, either condition has to match |

#### Within a requestAuth block

| Syntax           | Description                                                                    |    
|------------------|--------------------------------------------------------------------------------|
| `authMap`        | The authorisation map to use                                                   | 
| `fields { ... }` | Defines the fields that are required for the request authentication permission |
| `field { ... }`  | Defines a required field for the request authentication permission             |
| `where { ... }`  | Defines the where clause for the request authentication permission             |

#### Within a responseAuth block

| Syntax           | Description                                                                    |    
|------------------|--------------------------------------------------------------------------------|
| `authMap`        | The authorisation map to use                                                   | 
| `fields { ... }` | Defines the fields that are required for the request authentication permission |
| `field { ... }`  | Defines a required field for the request authentication permission             |
| `where { ... }`  | Defines the where clause for the request authentication permission             |
| `responseMapper` | Helper to apply row level permission on collection-like return values          |

#### Within a customPermission block

| Syntax           | Description                                                                    |
|------------------|--------------------------------------------------------------------------------|
| `db`             | The database to use                                                            |
| `request`        | The request object                                                             |
| `body`           | The request body                                                               |
| `userName`       | The user name, or null if anonymous                                            |

