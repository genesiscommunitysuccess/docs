---
title: 'Configure runtime'
sidebar_label: 'Configure runtime'
sidebar_position: 6
id: cons-configuring-runtime
---

[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)


There are two important files that you need to update before you can use the Consolidator you have defined:

- your application's **processes.xml**
- your application's **service-definitions.xml**

Your Consolidator will not be correctly in the application's buils if you do not have a valid entry in both of these files.

## Adding the Consolidator to processes.xml

Before you can use the Consolidator you have created, you must add its details to the  **processes.xml** file for the application. This is located in the **.cfg** folder for the application. The file contains tags that define key characteristics of the Consolidator - for example, dependencies and logging level. 

Here is an example configuration (the tags are explained in the page on the [processes.xml file](/creating-applications/configure-runtime/processes-xml/)):
 

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

Your application's [**service-definitions.xml**](/creating-applications/configure-runtime/service-definitions/) file is where you specify the ports used by each process for communicating internally. You need to add an entry for your Consolidator, using an unused port number. For example:

```xml
 <service host="localhost" name="TRADING_APP_CONSOLIDATOR" port="11003"/>
```