---
title: 'Quick start - prepare the server and build'
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

Add the following content to the **alpha-processes.xml** file:


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

Further information can be found in our page on the [**-processes.xml** file](../../../server/configuring-runtime/processes/).

You can then add the following content to the **alpha-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```

Further information can be found in the [**-service-definitions.xml** file](../../../server/configuring-runtime/service-definitions/).

## Database layer

You can specify which database to use in your application by editing **genesis-system-definition.kts**, which is located in **genesis-product\alpha-site-specific\src\main\resources\cfg\\**.

Further information can be found in the [**genesis-system-definitions.kts** file](../../../server/configuring-runtime/system-definitions/).

### Run docker

Since we are using a docker container, we need to use the Postgres database. Add the highlighted items `DbLayer` and `DbHost` exactly as they are specified below to **genesis-system-definition.kts**:

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

:::tip
Do not forget to configure your [genesis plugin](../../../server/tooling/intellij-plugin/).
:::

Finally, you can build the server. In the Gradle menu on the right of IntelliJ, select:

1. **genesisproduct-alpha**/**alpha-config**

![](/img/alpha-config-gradle.png)

```shell title='Running alpha-config assemble from the command line'
./gradlew :genesisproduct-alpha:alpha-config:assemble
./gradlew :genesisproduct-alpha:alpha-config:deployCfgToGenesisHome

```

2. **genesisproduct-alpha**/**alpha-script-config**

![](/img/alpha-script-config-gradle.png)

```shell title='Running alpha-script-config assemble from the command line'
./gradlew :genesisproduct-alpha:alpha-script-config:assemble
./gradlew :genesisproduct-alpha:alpha-script-config:deployScriptsToGenesisHome

```

3. **Deploy aplication**

![](/img/deploy.png)


After these 3 steps, you have a functional server.

Congratulations! You have completed the prepare and build.

:::note
This may take up to a few minutes to complete.
:::