---
title: 'DB streaming out - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, integration, database streaming out, configuring runtime]
tags:
  - server
  - integration
  - database streaming out
  - configuring runtime
---

GenesisToDb must be configured in your **application-processes.xml** file. The following is an example of how to do this:

```xml
<processes>
    <process name="TRADING_APP_GENESIS_TO_DB">
        <config>application-genesistodb.xml</config>
        <description>trade App Genesis to RDMS adapter</description>
        <groupId>TRADE_APP</groupId>
        <primaryOnly>true</primaryOnly>
        <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
        <module>genesis-genesistodb</module>
        <options>-Xmx256m</options>
        <package>global.genesis.genesistodb</package>
        <start>true</start>
    </process>
</processes>
```

If you wish to read more about process configuration please see the dedicated page on [Processes](../../../../server/configuring-runtime/processes).
