---
title: 'Site-specific'
sidebar_label: 'Site-specific'
id: site-specific
keywords: [site specific, override, configuration, server]
tags:
- site specific
- override
- configuration
- server
---

Site-specific is an area of the run directory where you can override the standard definitions found elsewhere in your application. By default, its location is:

<strong><em>application-name</em>\server\jvm\<em>application-name</em>-site-specific</strong>


## Changing system definitions
The [**genesis-system-definition.kts** file](../../../server/configuring-runtime/system-definitions/) is always found in the **site-specific** folder. 

Within that folder, it is located at:

 **\src\main\resources\cfg**

You can change the settings in the **genesis-system-definition.kts** file to make fundamental changes to your application. For example, if you want to change to a different database technology, you can change the `DbLayer` and `DbHost` settings.

Here is an example where we have changed the underlying technology to Postgres.

```kotlin {5,11}
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
}```

## Overriding scripts

If you want to override any scripts in your application such as **{app-name}-dataserver.kts**, **{app-name}-eventhandler.kts**, etc, you need to go to **site-specific/main/src/main/resources/scripts** folder and create the new script file with the same name as the script you want to override.

To see the changes, you need to deploy your application, and if you are using intellij plugin, you shall see these files under your **.genesis-home/site-specific**

This is essential where you use standard modules, such as Auth; you should never change these modules. 

:::danger
Never change the standard modules, such as Auth. You can copy their script files to **site-specific** and change them there.
:::

