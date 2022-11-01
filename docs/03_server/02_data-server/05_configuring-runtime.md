---
title: 'Data Server - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, data server, dataserver, introduction, configuring runtime]
tags:
  - server
  - data server
  - dataserver
  - introduction
  - configuring runtime
---


There are two important files in your application that contain configuration information: 
- _application-name_**-processes.xml**
- _application-name_**-service-definitions.xml

### Configuring in processes.xml

Here is an example configuration for a Data Server in an application's **processes.xml** file.

```xml
  <process name="POSITION_DATASERVER">
    <groupId>POSITION</groupId>
    <start>true</start>
    <options>-Xmx1024m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <script>position-dataserver.kts</script>
    <description>Displays real-time details</description>
    <language>pal</language>
  </process>
```

For more information about the tags that can be used to set the process configuration, follow this [link](/server/configuring-runtime/processes).

### Configuring in service-definitions.xml

Here is a simple example of a service configuration for a Data Server in an application's **service-definitions.xml**.

```xml
  <service host="localhost" name="POSITION_DATASERVER" port="11000"/>
```

For more information about the attributes that can be used to set the service definition configuration, follow this [link](/server/configuring-runtime/service-definitions).

Note - The name for both the service and process must be the same.
