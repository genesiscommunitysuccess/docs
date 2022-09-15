---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server/integration/custom-endpoints/introduction/) | [Basics](/server/integration/custom-endpoints/basics/) |  [Advanced](/server/integration/custom-endpoints/advanced/) | [Examples](/server/integration/custom-endpoints/examples/) | [Configuring runtime](/server/integration/custom-endpoints/configuring-runtime/) | [Testing](/server/integration/custom-endpoints/testing/)

If you are going to use custom endpoints, it is essential that you configure the [Genesis Router](/server/configuring-runtime/genesis-router/).

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
