---
title: 'Configure runtime'
sidebar_label: 'Configure runtime'
sidebar_position: 6
id: cons-configuring-runtime
---

[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)


## Adding the consolidator to processes.xml

Before you can use the consolidator you have created, you must add its details to the  **processes.xml** file for the application. This is located in the **.cfg** folder for the application. The file contains tags that define key characteristics of the consolidator - for example, dependencies and logging level. 

Here is an example configuration (the tags are explained in the page on the [processes.xml file](/creating-applications/configure-runtime/processes-xml/)):
 

```xml
<process name="TRADING_APP_CONSOLIDATOR">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true  -DXSD_VALIDATE=false</options>
    <module>consolidator2</module>
    <package>global.genesis.consolidator2</package>
    <config>trading_app-consolidator2.xml</config>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <dependency>TRADING_APP_EVENT_HANDLER</dependency>
</process>
```

