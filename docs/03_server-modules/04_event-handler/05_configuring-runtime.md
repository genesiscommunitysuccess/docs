---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/event-handler/introduction)  | [Basics](/server-modules/event-handler/basics) | [Advanced](/server-modules/event-handler/advanced) | [Examples](/server-modules/event-handler/examples) | [Configuring runtime](/server-modules/event-handler/configuring-runtime) | [Testing](/server-modules/event-handler/testing) | [Java event handlers](/server-modules/event-handler/java-event-handlers) | [Testing java event handlers](/server-modules/event-handler/testing-java-event-handlers)

There are two important files in your application that contain configuration information: 
-  _application-name_**-processes.xml**
- _application-name_**-service-definitions.xml**



### Configuring in processes.xml

Here is an example of an Event Handler configuration in an application's **processes.xml** file:

```xml
  <process name="POSITION_EVENT_HANDLER">
    <groupId>POSITION</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>position-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>position-messages*,position-eventhandler*</classpath>
    <language>pal</language>
  </process>
```

For more information on the tags that can be set within the configuration for your application, go to our page on [processes.xml](//server-modules/configuring-runtime/processes/).

### Configuring in service-definitions.xml

Here is an example of an Event Handler's service configuration:

```xml
  <service host="localhost" name="POSITION_EVENT_HANDLER" port="11002"/>
```

For more information on the attributes that can be set here, go to our page on [service definitions](/server-modules/configuring-runtime/service-definitions/).

