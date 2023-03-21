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

You define web endpoints in a gpal file of type `web-handler.kts`

This is an example of a web handler file `trade-web-handler.kts`:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        produces(ContentType.APPLICATION_JSON)

        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

This endpoint will provide the content of `TRADE` table in JSON format on `trade/all-trades` at the router. As you 
can see, the database is available as `db`, and the `handleRequest` call makes sure that all asynchronous calls
are handled appropriately. 

To make this endpoint available, you should only need to provide the `web-handler.kts` in a `{product}/scripts` folder, where
product is the name of your project. The file will be detected automatically by the router on start up. 

Multiple endpoints can be defined in the same file, and you can also overwrite the prefix of the path by 
providing it to the `webHandlers` call, e.g. `webHandlers("table/trade") { ... }`, in which case the endpoint 
would be available on `table/trade/all-trades`.

Also, you can group endpoints in a `grouping`, for example: 

```kotlin
webHandlers("tables") {
    grouping("trade") {
        endpoint(GET, "all-trades") {
            // ...
        }
        endpoint(GET, "big-trades") {
            // ...
        }
    }
}
```

Endpoints can also receive input. When endpoints receive data, it becomes necessary to provide type parameters for
both the request and the response:

```kotlin
endpoint<Trade, Trade>(POST, "insert-trade") {
    accepts(ContentType.APPLICATION_JSON)
    produces(ContentType.APPLICATION_JSON)

    handleRequest {
        db.insert(body).record
    }
}
```

This endpoint receives a trade and inserts it into the database, and then returns the trade as it exists in the
database, include any generated fields.

Endpoints also support the genesis authentication and authorization model. For example, we could modify the above
to restrict it to users with the 'TRADER' permission code like this:

```kotlin
endpoint<Trade, Trade>(POST, "trader") {
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

By adding a `permissioning`, we can define which rights and entities users can access. If our application also
restricted access to trades based on currency, we could modify the above to this:

```kotlin
endpoint<Trade, InsertResult<Trade>>(POST, "auth") {
    accepts(ContentType.APPLICATION_JSON)
    produces(ContentType.APPLICATION_JSON)

    permissioning {
        permissionCodes("TRADER")
        requestAuth("CCY_MAP") {
            field { currencyId }
        }
    }

    handleRequest {
        db.insert(body)
    }
}
```

Please see (permissioning url) for details. Please note that compared to event handlers, data servers and request
servers, endpoints support authentication on both the incoming and outgoing message. To support this, endpoints have
`requestAuth` and `responseAuth` rather than `auth`. Like standard GPAL, you can combine multiple auth blocks 
with `and` and `or`. However, you can only combine `requestAuth` with other `requestAuth` and `responseAuth` with
other `responseAuth`.

We could also add the currency restriction to our `all-trades` endpoint like this: 

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

We support the following settings: 

| Value          | Default      | Type                      | Meaning                                                          |
|----------------|--------------|:--------------------------|------------------------------------------------------------------|
| `requiredAuth` | `true`       | `true`/`false`            | only authenticated users can access this endpoint if set to true |
| `jsonMode`     | `SNAKE_CASE` | `SNAKE_CASE`/`CAMEL_CASE` | whether to render JSON properties as SNAKE_CASE, or camelCase    |
| `maxRecords`   | 2.000        | `Int`                     | maximum numbers of records an endpoint can return                |
| `logLevel`     | `TRACE`      | `TRACE`,`DEBUG`,`INFO`    | default log level in endpoint - for debugging purposes           |

Configuration is supported at both the `webHandler`, `grouping` and `endpoint` level, with each level taking it's
parents configuration, before alterations are made. 

## Query Parameters, Headers and Path Parameters

In addition to request body, there are other ways to get input for endpoints, namely, query parameters, path 
parameters and headers. These can be defined within the endpoint, before the `handleRequest` call. At that 
point, query parameters and headers can be made optional or not. If these are not optional, requests will only 
be accepted if they have the required query parameters and headers.

```kotlin
endpoint(GET, "hello") {
    val name = queryParameter("name")

    handleRequest {
        "Hello ${name()}"
    }
}
```

As you can see, here we define the parameter first; to access the value in `handleRequest`, we add brackets `()`
to retrieve its value.

In this example, a call to `test?name=John` would respond with `Hello John`, and a call to `test` 
would be rejected.

We could also make the parameter option by using `optionalQueryParameter`:

```kotlin
endpoint(GET, "hello") {
    val name = optionalQueryParameter("name")

    handleRequest {
        "Hello ${name() ?: "Anonymous"}"
    }
}
```

In this example, a call to `test?name=John` would respond with `Hello John`, and a call to `test`
would respond with `Hello Anonymous`.

Multiple query parameters can also be grouped into a data class like this:

```kotlin
data class NameAndNumber(val name: String, val number: Int)

endpoint(GET, "test") {
    val nameAndNumber = queryParameters<NameAndNumber>()

    handleRequest {
        val data = nameAndNumber()
        "Hello ${data.name}: ${data.number}"
    }
}
```

In this example, a call to `test?NAME=Peter&NUMBER=3` would respond with `Hello Peter: 3`. Parameters can 
be made optional by providing default values in the constructor. 

### Headers

Headers work in much the same way as query parameters:

```kotlin
endpoint(GET, "test") {
    val name = header("Name")

    handleRequest {
        "Hello ${name()}"
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

## Path Parameters

Path parameters support pattern matching on the endpoint path:

```kotlin
endpoint(GET, "trade/by-id/{id}") {
    val id = pathParameter("id")

    handleRequest {
        db.get(Trade.ById(id()))
    }
}
```

