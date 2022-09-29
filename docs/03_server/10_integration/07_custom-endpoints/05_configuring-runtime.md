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

With above configuration you can access endpoint at `http://{your_host}:9064/custom_endpoint`. For the file upload example shown [here](/server/integration/custom-endpoints/basics/#a-simple-example-of-a-custom-endpoint) the custom endpoint URL is `http://{your_host}:9064/file-handler/upload`

### Configure processes.xml

As specified below you need to alter GENESIS_ROUTER process configuration defined in genesis-processes.xml file located at ~/run/genesis/cfg folder
- Add name of the package where custom-endpoint is defined in [package](/server/configuring-runtime/processes/#package) tag, in below example its `alpha.custom.endpoint`
- Add Jar file of submodule containing custom-endpoint to [classpath](/server/configuring-runtime/processes/#classpath) tag, in below example its `alpha-file-processor-*.jar`


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

For more information on how we define processes click [here](/server/configuring-runtime/processes)
