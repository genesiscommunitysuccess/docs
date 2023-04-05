---
title: 'Custom endpoints - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, integration, custom endpoints, configuring runtime]
tags:
  - server
  - integration
  - custom endpoints
  - configuring runtime
---

### Configure processes.xml

Whenever you have a module that uses Genesis Router, it is **essential** that you edit the Genesis Router definition in your application's [processes.xml](../../../../server/configuring-runtime/processes/) file to include these modules. This file is located in the **~/run/genesis/cfg** folder.

The file needs to include two entries:

-  the [package](../../../../server/configuring-runtime/processes/#package) where the classes exist; in the example below, this is `alpha.custom.endpoint`
-  the [classpath](../../../../server/configuring-runtime/processes/#classpath) of the jar that contains the package; in the example below, this is `alpha-file-processor-*.jar`


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

There is more information on how we define processes, in our page on [process.xml](../../../../server/configuring-runtime/processes).

### Configure Genesis Router

If you are going to use custom endpoints, it is essential that you configure the [Genesis Router](../../../../server/configuring-runtime/genesis-router/).

Here is an example configuration:

```kts
router {
    webPort = 9064
    socketPort = 9065

    // rest of file cut for brevity     
}
```



