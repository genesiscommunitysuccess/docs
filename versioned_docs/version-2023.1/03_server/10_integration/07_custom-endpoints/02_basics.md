---
title: 'Custom endpoints - basics'
sidebar_label: 'Basics'
id: basics
keywords: [ server, integration, custom endpoints, basics ]
tags:
  - server
  - integration
  - custom endpoints
  - basics
---

To create custom endpoints, you need to define a gpal file of `web-handler.kts`.

Once a `web-handler.kts` is available within your `{product}/script` directory, it is immediately available as an endpoint
in the router.

## Simple endpoint example

Here is a simple custom endpoint that provides all trades in the database:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

This endpoint, if defined in **trade-web-handler.kts**, is available at **trade/all-trades**; for more information on [paths, see below](#paths).

## Producing output

By default, the `handleRequest` function infers the output of the endpoint based on the return value of the block.

So, when you are only producing output and not receiving any input, you do not need type parameters.

The output value is returned as JSON using the standard serialisation mechanism. This is sufficient for most cases, but options are available to customise the output.

### Content type

Calling `produces` with a content type will overwrite this default behaviour. The following content types are supported
out of the box:

| Content type               | Name in code                           | Data   |
|----------------------------|:---------------------------------------|--------|
| `application/json`         | `ContentType.APPLICATION_JSON`         | JSON   |
| `application/octet-stream` | `ContentType.APPLICATION_OCTET_STREAM` | Binary |
| `text/csv`                 | `ContentType.TEXT_CSV`                 | CSV    |
| `text/yaml`                | `ContentType.TEXT_YAML`                | YAML   |
| `text/xml`                 | `ContentType.TEXT_XML`                 | XML    |

Multiple content types can be set in the `produces` call; the client can specify which one is returned by setting the
`Accept` header. If no `Accept` header is specified, then the first content type will be returned. 

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        produces(ContentType.TEXT_CSV)
        handleRequest {
            db.getBulk(TRADE)
        }
    }

    endpoint(GET, "all-trades-multi") {
        produces(ContentType.TEXT_CSV, ContentType.APPLICATION_JSON)
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

### Return types

By default; the returned value will be serialized using the default serializer, however, this is overruled if the
return type is in the table below. In this case the value will be returned as per the table, regardless of the 
`Accpet` header. However, if the `produces` function is used, then the `Accept` header will be respected. 

| Return type    | Behaviour                                         | Default Content-Type       |
|----------------|---------------------------------------------------|:---------------------------|
| `Unit`         | No response will be returned                      | n/a                        |
| `String`       | The string will be returned as the response       | n/a                        |
| `ByteArray`    | The byte array will be returned as the response   | n/a                        |
| `File`, `Path` | The file will be streamed as the response         | `application/octet-stream` |
| `InputStream`  | The input stream will be streamed as the response | `application/octet-stream` |

## Receiving input

Endpoints can also receive input, this would be when the http request includes a body. The body can be parsed
and will be available in the `body` property of the `handleRequest` block. When endpoints receive input, it becomes
necessary to provide type parameters for both the request body and the response type:

```kotlin
webHandlers {
    endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade") {
        handleRequest {
            db.insert(body)
        }
    }
}
```

### Content type

As with producing output, the content type of the request body can be specified using the `accepts` function. An 
endpoint is able to accept multiple content type. If no content type is specified, then the endpoint will default to 
accept `application/json`. 

These content types are supported out of the box:

| Content type               | Name in code                           | Data   |
|----------------------------|:---------------------------------------|--------|
| `application/json`         | `ContentType.APPLICATION_JSON`         | JSON   |
| `text/csv`                 | `ContentType.TEXT_CSV`                 | CSV    |
| `text/yaml`                | `ContentType.TEXT_YAML`                | YAML   |
| `text/xml`                 | `ContentType.TEXT_XML`                 | XML    |


```kotlin
webHandlers {
    endpoint<Trade, InsertResult<Trade>>(POST, "insert-trade") {
        accepts(ContentType.APPLICATION_JSON, ContentType.TEXT_XML)
        handleRequest {
            db.insert(body)
        }
    }
}
```

### File uploads

To support file uploads, the `multipartEndpoint` function can be used. This function will parse the request body
as a multipart request and make the files available in the `fileUploads` property of the `handleRequest` block.

```kotlin
webHandlers {
    val tmp = Files.createTempDirectory("test")
    multipartEndpoint("test") {
        handleRequest {
            body.fileUploads.forEach {
                it.copyTo(tmp.resolve(it.fileName))
            }
        }
    }
}
```

## Permissioning and Authorization

Endpoints support a permissioning model very similar to event handlers and request servers. The `permission` function
has different options for: 
* requiring specific permission codes
* entity level authorization on the input - similar to event handlers
* entity level filtering on the output - similiar to request servers

Furthermore, endpoints can be made available to unauthenticated users in the config block.

### Permission codes

In this example, the `all-trades` endpoint is available to users with the `TRADER` permission code:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        permissioning {
            permissionCodes("TRADER")
        }
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```

### Entity level authorization - input 

In this example, the `insert-trade` endpoint is available to all users, however, users can only insert trades in 
currencies for which they have permission:

```kotlin 
endpoint<Trade, InsertResult<Trade>>(POST, "auth") {
    permissioning {
        requestAuth("CCY") {
            field { currencyId }
        }
    }
    handleRequest {
        db.insert(body)
    }
}
```

### Entity level filtering - output

In this example, the `all-trades` endpoint is available to all users, however, users can only see trades for those 
currency for which they have access:

```kotlin
webHandlers {
    endpoint(GET, "all-trades") {
        permissioning {
            responseAuth("CCY", flow<Trade>()) {
                field { currencyId }
            }
        }
        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```
