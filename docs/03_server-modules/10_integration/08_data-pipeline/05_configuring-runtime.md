---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/integration/data-pipeline/introduction/)  | [Basics](/server-modules/integration/data-pipeline/basics) | [Advanced](/server-modules/integration/data-pipeline/advanced) | [Examples](/server-modules/integration/data-pipeline/examples) | [Configuring runtime](/server-modules/integration/data-pipeline/configuring-runtime) | [Testing](/server-modules/integration/data-pipeline/testing)

## Configure processes.xml file
Data pipeline is a separate module that must be configured in your __application__**-processes.xml** file. Here is a sample configuration:

```xml
<processes>
    <process name="DATAPIPELINE_SANDBOX">
        <groupId>DATAPIPELINE</groupId>
        <start>true</start>
        <options>-Xmx1024m</options>
        <module>genesis-pal-datapipeline</module>
        <package>global.genesis.datapipeline.pal</package>
        <script>trades-datapipeline.kts</script>
        <description>Trades execution</description>
        <language>pal</language>
        <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
    </process>
</processes>
```

## System definitions
It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your __application__**-system-definition.kts** file.
