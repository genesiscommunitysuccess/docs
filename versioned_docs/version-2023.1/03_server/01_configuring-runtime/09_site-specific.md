---
title: 'Site specific'
sidebar_label: 'Site specific'
id: site-specific
keywords: [server, configuration, site specific]
tags:
- server
- configuration
- site specific
---

The Genesis low code platform enables you to override standard definitions found in the application.

You supply the standard definition name and your own definition. Your application will then only use your definition.
This is useful where you have used standard modules, such as Auth; you should never change these modules. Any files/definitions that are listed in the site-specific area automatically take their places.

:::danger
Please ensure that you do not change individual modules such as Auth. Definitions must be changed within site-specific.
:::

## Changing default configurations

In order to override the standard definitions of your application, you must first navigate to the site-specific directory found within your application. The route to this path would be something akin to **..\[application-name]\server\jvm\[application-name]-site-specific**

### Overriding system-definitions

You can override the standard definitions using the site-specific folder located at **[application-name]\server\jvm\[application-name]-site-specific\src\main\resources\cfg**.

Within this folder you will find the file `genesis-system-definitions.kts`. Within this file, you are able to change many of the default definitions used by your application. See the example below:

```kotlin
systemDefinition {
    global {
        item(name = "DEPLOYED_PRODUCT", value = "alpha")
        item(name = "MqLayer", value = "ZeroMQ")
        item(name = "DbLayer", value = "SQL")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")
        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")
        item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/postgres?user=postgres&password=postgres")
        item(name = "DbMode", value = "VANILLA")
        item(name = "GenesisNetProtocol", value = "V2")
        item(name = "ResourcePollerTimeout", value = "5")
        item(name = "ReqRepTimeout", value = "60")
        item(name = "MetadataChronicleMapAverageKeySizeBytes", value = "128")
        item(name = "MetadataChronicleMapAverageValueSizeBytes", value = "1024")
        item(name = "MetadataChronicleMapEntriesCount", value = "512")
        item(name = "DaemonServerPort", value = "4568")
        item(
            name = "JVM_OPTIONS",
            value = "-XX:MaxHeapFreeRatio=70 -XX:MinHeapFreeRatio=30 -XX:+UseG1GC -XX:+UseStringDeduplication -XX:OnOutOfMemoryError=\"handleOutOfMemoryError.sh %p\""
        )
    }
```

Once deployed to the server, the files from that folder are installed in the runtime folder under a sub-folder called **site-specific**. For example, the **genesis-system-definition.kts** can be edited to change the database host used by the application. An example of this can be seen in our developer training [tutorials](https://learn.genesis.global/docs/getting-started/developer-training/training-content-day1/).

### Username and Password

Within the site specific folder it is also possible to change user details.

In order to do that, find the USER.csv file (it is inside the **server/jvm/[application name]-site-specific/src/main/resources/data** folder); right-click USER.csv, and then click on Import CSV(s) to Genesis, as shown below.



