---
title: 'Data pipeline - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, integration, data pipeline, configuring runtime]
tags:
  - server
  - integration
  - data pipeline
  - configuring runtime
---

## Configure processes.xml file
Data pipeline is a separate module that must be configured in your __application__**-processes.xml** file. Here is a sample configuration:

```xml
<processes>
    <process name="APPLICATION_DATAPIPELINE">
        <groupId>APPLICATION</groupId>
        <start>true</start>
        <options>-Xmx1024m</options>
        <module>genesis-pal-datapipeline</module>
        <package>global.genesis.datapipeline.pal</package>
        <script>trades-datapipeline.kts</script>
        <description>Optional description</description>
        <language>pal</language>
        <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
    </process>
</processes>
```

### Configure 

Ensure that you also update your __application__**-service-definitions.xml** file with your new pipeline.

```xml
<configuration>
    ...
    <service host="localhost" name="APPLICATION_DATAPIPELINE" port="11003"/>
    ...
</configuration>
```

:::note
It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your __application__**-system-definition.kts** file.
:::
