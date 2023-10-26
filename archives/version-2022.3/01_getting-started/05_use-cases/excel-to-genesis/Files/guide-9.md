---
id: guide-9
sidebar_label: 'The processes file'
sidebar_position: 90
title: 'The processes file'
---


This file shows the three microservices (processes) that have been defined in the application's process file (_application-name_-**processes.xml**). Each `process` tag defines its own characteristics. This file has been generated automatically by `genx`.


```xml
<processes>
  <process name="CASH_DATASERVER">
    <groupId>CASH</groupId>
    <start>true</start>
    <options>-Xmx128m</options>
    <module>pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <config>cash-dataserver.kts</config>
    <description>Displays real-time details</description>
  </process>
  <process name="CASH_REQUEST_SERVER">
    <groupId>CASH</groupId>
    <start>true</start>
    <options>-Xmx128m</options>
    <module>pal-requestserver</module>
    <package>global.genesis.requestreply.pal</package>
    <config>cash-reqrep.kts</config>
    <description>Server one-shot requests for details</description>
  </process>
  <process name="CASH_EVENT_HANDLER">
    <groupId>CASH</groupId>
    <start>true</start>
    <options>-Xmx128m -DRedirectStreamsToLog=true</options>
    <module>genesis-eventhandler</module>
    <package>global.genesis.eventhandler</package>
    <script>cash-eventhandler.kts</script>
    <description>Handlers events</description>
    <language>pal</language>
  </process>
</processes>
```