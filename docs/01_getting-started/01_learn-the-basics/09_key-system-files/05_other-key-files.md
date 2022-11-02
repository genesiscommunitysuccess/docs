---
title: 'Genesis Router'
sidebar_label: 'Genesis Router'
id: other-key-files
---

Let us now mention another important system file, Genesis Router. The Genesis Router module controls the routing of the messages between the backend and the frontend of your application. You can configure this in the file **genesis-router.kts**.

The file is divided into three areas:

- In the first area, you must set the ports for the tcp/ip socket and the http/websocket. You can also set things such as a timeout for pulling the resource in the server, or switching on and configuring the internal netty logging.

- In the second area, you can specify the routes for the messages from the specific modules or microservices.

- In the third area, you can specify the resources that are available to the frontend. If you don't specify at least one, all the resources in the server will be available.

Here is an example configuration file for Genesis Router:

```xml
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


Further information can be found on our [Genesis Router](/server/configuring-runtime/genesis-router/) page.
