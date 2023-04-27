---
title: 'Quick start - run, build and deploy'
sidebar_label: 'Run, build and deploy'
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

Add the following content to the **server/jvm/alpha-config/src/main/resources/cfg/alpha-processes.xml** file:


```xml title="alpha-processes.xml"
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

You can then add the following content to the **server/jvm/alpha-config/src/main/resources/cfg/alpha-service-definitions.xml** file.

```xml title="alpha-service-definitions.xml"
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```

Further information can be found in the [**-service-definitions.xml** file](../../../server/configuring-runtime/service-definitions/).

## Database layer

You can specify which database to use in your application by editing **genesis-system-definition.kts**, which is located in **genesis-product\alpha-site-specific\src\main\resources\cfg\\**.

Further information can be found in the [**genesis-system-definitions.kts** file](../../../server/configuring-runtime/system-definitions/).

### Run with docker

Since we are using a docker container, add the highlighted items `DbLayer` and `DbHost` exactly as they are specified below to **genesis-system-definition.kts**:

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

### Build and compose Docker images

Now, you need to start the database. Make sure your docker management software (in our case Rancher desktop) is up and running and do the following:

```powershell
docker pull postgres
docker run --name localPostgresDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres postgres -c 'max_connections=10000'
```

To confirm your docker has been created, please run:
```powershell
docker ps | findstr "localPostgresDb"
```

## Connect the front end to the server
Since you created your project from a seed, you need to change the default API_HOST in the **package.json** in **client/web/** to `ws://localhost:9064`.

```kotlin {7-12} title="client/web/package.json"
{
  "name": "@genesislcap/alpha-web-client",
  "description": "Developer Training Web Client",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "config": {
    "API_HOST": "ws://localhost:9064",
    "DEFAULT_USER": "JaneDee",
    "DEFAULT_PASSWORD": "beONneON*74",
    "PORT": 6060
  },
```

## Build and deploy

Finally, you can build and deploy the server.

### Build

In the Gradle menu on the right of IntelliJ, select:

**genesisproduct-alpha**

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```

**genesisproduct-alpha**/**alpha-config**

![](/img/alpha-config-gradle.png)

```shell title='Running alpha-config assemble from the command line'
./gradlew :genesisproduct-alpha:alpha-config:assemble
./gradlew :genesisproduct-alpha:alpha-config:deployCfgToGenesisHome

```

**genesisproduct-alpha**/**alpha-script-config**

![](/img/alpha-script-config-gradle.png)

```shell title='Running alpha-script-config assemble from the command line'
./gradlew :genesisproduct-alpha:alpha-script-config:assemble
./gradlew :genesisproduct-alpha:alpha-script-config:deployScriptsToGenesisHome

```

### Start up plugin

After the Gradle tasks, when first using the plugin with a project, you must create your genesis home folder; click on the **Install Genesis** button on the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a hidden folder called **.genesis-home** in your project root, ready to run your application's processes. 

:::note
On the first run, this could take up to 20 minutes, because it performs a full build of your application.
:::

### Deploy

As soon as the Build is done, you need to deploy the application:

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. If you are prompted for this, click **ok** to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)


Congratulations! You now you have a running database and a built application. Next step [run the application](../run-the-application-docker/)