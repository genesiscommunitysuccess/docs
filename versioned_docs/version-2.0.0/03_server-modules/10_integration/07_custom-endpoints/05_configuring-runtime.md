---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/integration/custom-endpoints/introduction/) | [Basics](/server-modules/integration/custom-endpoints/basics/) |  [Advanced](/server-modules/integration/custom-endpoints/advanced/) | [Examples](/server-modules/integration/custom-endpoints/examples/) | [Configuring runtime](/server-modules/integration/custom-endpoints/configuring-runtime/) | [Testing](/server-modules/integration/custom-endpoints/testing/)

If you are going to use custom endpoints, it is essential that you configure the [Genesis Router](/server-modules/configuring-runtime/genesis-router/).

Here is an example configuration:

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
}
```
