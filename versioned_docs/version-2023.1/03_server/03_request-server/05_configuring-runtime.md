---
title: 'Request Server - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, request server, configuring runtime]
tags:
  - server
  - request server
  - configuring runtime
---



There are two important files in your application that contain configuration information: 
- _application-name_**-processes.xml**
- _application-name_**-service-definitions.xml**



## Configuring in processes.xml
Here is an example of a Request Server configuration in an application's **processes.xml** file:


```xml
  <process name="POSITION_REQUEST_SERVER">
    <groupId>POSITION</groupId>
    <start>true</start>
    <options>-Xmx256m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-requestserver</module>
    <package>global.genesis.requestreply.pal</package>
    <script>position-reqrep.kts</script>
    <description>Server one-shot requests for details</description>
    <language>pal</language>
  </process>
```

For more information of what can be configured by each tag in the configuration, follow this [link](../../../server/configuring-runtime/processes).

## Configuring service-definitions.xml

Here is a simple example of a service configuration for a Request Server in an application's **service-definitions.xml**.

```xml
  <service host="localhost" name="POSITION_REQUEST_SERVER" port="11001"/>
```

For more information about the attributes that can be used to set the service definition configuration, follow this [link](../../../server/configuring-runtime/service-definitions).

Note - The name for both the service and process must be the same.
