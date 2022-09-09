---
title: 'Prepare the server & build'
sidebar_label: 'Prepare the server & build'
id: prepare-the-server-and-build
---

The application has two files that contain vital configuration information:

- **alpha-processes.xml**
- **alpha-service-definitions.xml**

At present, they are empty. You need to insert the details of the Data Server and Event Handler that you have just created.

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

You can find more info on the **-processes.xml** file [here](/server-modules/configuring-runtime/processes/).

You can then add the following content to the **alpha-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```
You can find more info on the **-service-defintions.xml** file [here](/server-modules/configuring-runtime/service-definitions/).

If you are going to use the **Docker** solution you also need to change the highlighted items of **genesis-system-definition.kts**

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
