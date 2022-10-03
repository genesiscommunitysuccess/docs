---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server/integration/custom-endpoints/introduction/) | [Basics](/server/integration/custom-endpoints/basics/) |  [Advanced](/server/integration/custom-endpoints/advanced/) | [Examples](/server/integration/custom-endpoints/examples/) | [Configuring runtime](/server/integration/custom-endpoints/configuring-runtime/) | [Testing](/server/integration/custom-endpoints/testing/)

### Configure Genesis Router

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

With the above configuration, you can access the endpoint at `http://{your_host}:9064/custom_endpoint`. For the file upload example shown [here](/server/integration/custom-endpoints/basics/#a-simple-example-of-a-custom-endpoint), the custom endpoint URL is `http://{your_host}:9064/file-handler/upload`.

### Configure processes.xml

You need to alter the GENESIS_ROUTER process configuration, which is defined in the **genesis-processes.xml** file located in the **~/run/genesis/cfg** folder.
- Add the name of the package, where the custom endpoint is defined in the [package](/server/configuring-runtime/processes/#package) tag. In the example below, this is `alpha.custom.endpoint`.
- Add the Jar file of the submodule containing the custom endpoint to the [classpath](/server/configuring-runtime/processes/#classpath) tag. In the example below, this is `alpha-file-processor-*.jar`.


```xml {6,10}
<process name="GENESIS_ROUTER">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>router</module>
        <package>global.genesis.router,global.genesis.console,alpha.custom.endpoint</package>
        <config>router-process-config.kts</config>
        <script>genesis-router.kts</script>
        <language>pal</language>
        <classpath>genesis-console-*.jar,alpha-file-processor-*.jar</classpath>
        <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

There is more information on how we define processes, in our page on [process.xml](/server/configuring-runtime/processes).
