---
title: 'Consolidator - Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
keywords: [consolidator]
tags:
    - consolidator
---

[Introduction](/server-modules/consolidator/introduction) | [Basics](/server-modules/consolidator/basics) |  [Advanced](/server-modules/consolidator/advanced) | [Examples](/server-modules/consolidator/examples) | [Configuring runtime](/server-modules/consolidator/configuring-runtime) | [Testing](/server-modules/consolidator/testing)

For your Consolidator to run, it must be defined as a process and included as a service definition. Make sure you update the following files in your application:

- **processes.xml**
- **service-definitions.xml**



## Adding the Consolidator to processes.xml

Your application's **processes.xml** file is located in the **.cfg** folder for the application. The file contains tags that define key characteristics of the Consolidator - for example, dependencies and logging level. 

Here is an example configuration (the tags are explained in the page on the [processes.xml file](/server-modules/configuring-runtime/processes/)):
 

```kotlin
<process name="POSITION_CONSOLIDATOR">
        <groupId>POSITION</groupId>
        <description>Consolidates trades to calculate positions</description>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false -XX:MaxHeapFreeRatio=70 -XX:MinHeapFreeRatio=30 -XX:+UseG1GC -XX:+UseStringDeduplication -XX:OnOutOfMemoryError="handleOutOfMemoryError.sh %p"</options>
        <module>genesis-pal-consolidator</module>
        <package>global.genesis.pal.consolidator</package>
        <primaryOnly>false</primaryOnly>
        <script>position-consolidator.kts</script>
        <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
        <language>pal</language>
    </process>
</process>
```
:::important

In a multi-node environment, Consolidator services should be set to primary only; otherwise, the changes will be applied
multiple times.

:::

## Adding the Consolidator to the service-definitions.xml

Your application's [service-definitions.xml](/server-modules/configuring-runtime/service-definitions) file is where you specify the ports used by each process for communicating internally. You need to add an entry for your Consolidator, using an unused port number. For example:

```xml
 <service host="localhost" name="POSITION_CONSOLIDATOR" port="11003"/>
```
