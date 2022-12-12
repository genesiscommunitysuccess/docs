---
title: 'Quick Start - Prepare the server & build'
sidebar_label: 'Prepare the server & build'
id: prepare-the-server-and-build
keywords: [getting started, quick start, server, build]
tags:
    - getting started
    - quick start
    - server
    - build
---

The application has three files that contain vital configuration information:

- **alpha-processes.xml**
- **alpha-service-definitions.xml**
- **genesis-system-definitions.kts**

## Process and service definition

At present, these files are empty. You need to insert the details of the Data Server and Event Handler that you have just created.

Add the following content to the **alpha-processes.xml** file.


```xml
<processes>
    <process name="ALPHA_DATASERVER">
        <groupId>ALPHA</groupId>
        <start>true</start>
        <options>-Xmx1024m -DXSD_VALIDATE=false</options>
        <module>genesis-pal-dataserver</module>
        <package>global.genesis.dataserver.pal</package>
        <script>alpha-dataserver.kts</script>
        <description>Displays real-time details</description>
        <language>pal</language>
        <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
    </process>
    <process name="ALPHA_EVENT_HANDLER">
        <groupId>ALPHA</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-eventhandler</module>
        <package>global.genesis.eventhandler.pal</package>
        <script>alpha-eventhandler.kts</script>
        <description>Handles events</description>
        <classpath>alpha-messages*,alpha-eventhandler*</classpath>
        <language>pal</language>
    </process>
</processes>
```

You can find more info on the **-processes.xml** file [here](../../../server/configuring-runtime/processes/).

You can then add the following content to the **alpha-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```

You can find more info on the **-service-defintions.xml** file [here](../../../server/configuring-runtime/service-definitions/).

## Database layer

You can specify which database to use in your application by editing **genesis-system-definition.kts**, which is located in **genesis-product\alpha-site-specific\src\main\resources\cfg\**.

You can find more information on the **genesis-system-defintions.kts** file [here](../../../server/configuring-runtime/system-definitions/).

### Using WSL/Linux? Don't change the database layer.
You can ignore the next section! In fact, you must not make the changes on that section. (But please note, we highly recommend using Docker.)

### Using Docker? Change the database
If you are going to run your application using [**Docker**](../../../getting-started/quick-start/run-the-application-docker/), you need to use the Postgres database. Add the highlighted items `DbLayer` and `DbHost` exactly as they are specified below to **genesis-system-definition.kts**:

```kotlin {4,10}
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")
        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")
        item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/?user=postgres&password=postgres")
        item(name = "DbMode", value = "VANILLA")
        ...
    }
    
}

```

Finally, you can build the server.

In the Gradle menu on the right of IntelliJ, select **genesis-project-alpha**/**Tasks**/**Build/Assemble**.

![](/img/assemble-server.png)

You can procede to the next step whilst loading.

After loading is completed you have a functional server.

Congratulations! you have completed the prepare and build.
