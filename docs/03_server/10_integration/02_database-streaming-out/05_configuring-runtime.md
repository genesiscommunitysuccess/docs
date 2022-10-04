---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server/integration/database-streaming-out/introduction)  | [Basics](/server/integration/database-streaming-out/basics) | [Advanced](/server/integration/database-streaming-out/advanced) | [Examples](/server/integration/database-streaming-out/examples) | [Configuring runtime](/server/integration/database-streaming-out/configuring-runtime) | [Testing](/server/integration/database-streaming-out/testing)

GenesisToDb must be configured in your **application-processes.xml** file. The following is an example of how to do this:

```xml
<processes>
    <process name="POSITION_APP_GENESIS_TO_DB">
        <config>application-genesistodb.xml</config>
        <description>position App Genesis to RDMS adapter</description>
        <groupId>POSITION_APP</groupId>
        <primaryOnly>true</primaryOnly>
        <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
        <module>genesis-genesistodb</module>
        <options>-Xmx256m</options>
        <package>global.genesis.genesistodb</package>
        <start>true</start>
    </process>
</processes>
```

If you wish to read more about process configuration please see the dedicated page on [Processes](/server/configuring-runtime/processes).
