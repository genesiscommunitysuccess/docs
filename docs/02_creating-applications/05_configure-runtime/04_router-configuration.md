---
title: Genesis Router
sidebar_label: Genesis Router
sidebar_position: 4
id: genesis-router

---

Genesis Router is responsible for communication between front-end and back-end. This is configured in a file called **genesis-router.kts**.

Here is an example:

```kts
router {
    webPort = 9064
    socketPort = 9065

    httpServerCodec {
        maxInitialLineLength = 4096
        maxHeaderSize = 8192
        maxChunkSize = 8192
        validateHeaders = true
        initialBufferSize = 128
    }
    httpObjectAggregator {
        maxContentLength = 262144
        closeOnExpectationFailed = false
    }

    routes {
        route(messageType = "ALL_ORDERS", process = "OEMS_DATASERVER")
        route(messageType = "ALL_TRADES", process = "OEMS_DATASERVER")
        route(messageType = "ALL_ORDER_AUDITS", process = "OEMS_DATASERVER")
    }

    allowList {
        entry("ALL_ORDERS")
        entry("ALL_TRADES")
        entry("ALL_ORDER_AUDITS")
    }
}
```

### Router configuration 

`socketPort`: This port is used for http/websockets. You must declare a port, and it cannot be below 1024.

`webPort`: This port is used for tcp/ip socket. You must declare a port, and it cannot be below 1024.

`dataserverPollingTimeout`: This setting contains the timeout for polling the data-server resources in the system in seconds. Default value is 60 seconds.

`authDisabled`: This setting if set to true, disables all authentication and is used for development mode. Default value is false.

`nettyLoggingEnabled`: This setting if set to true, enables internal netty logging. Default value false.

**Netty configuration**:

`httpServerCodecDefinition`: A combination of HttpRequestDecoder and HttpResponseEncoder, which enables easier server-side HTTP implementation.
For more information, follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpServerCodec.html).

Different decoder options
  * `maxInitialLineLength`: default value: 4096
  * `maxHeaderSize`: default value 8192
  * `maxChunkSize`: default value 8192
  * `validateHeaders`: default value true
  * `initialBufferSize`: default value 128

`httpObjectAggregatorDefinition`: A ChannelHandler that aggregates an HttpMessage and its following HttpContents into a single FullHttpRequest or FullHttpResponse (depending on if it used to handle requests or responses) with no following HttpContents.
For more information follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpObjectAggregator.html)

  * `maxContentLength`: the maximum length of the aggregated content in bytes. Default value 262144
  * `closeOnExpectationFailed`: If a 100-continue response is detected but the content length is too large then true means close the connection. Otherwise, the connection will remain open and data will be consumed and discarded until the next request is received. Default value false

**Message Routes**: 

`routes`: You can redirect some microservice messages to particular processes by declaring new `route` blocks within this one.

`route`: Is the defined route taking both a `messageType` and a specific `process`.

**Allowed Resources**:

`allowList`:  You can limit the resources exposed by the genesis router. Without at least one `entry` block every resource wil be available. It is important to note that the following message types will always be allowed by default, regardless of the allowList definition:
EVENT_LOGIN_AUTH, EVENT_LOGOUT, MORE_ROWS, MORE_COLUMNS, DATA_LOGOFF, DATA_GET

`entry:` Is the additional accepted `messageType`.