---
title: 'Quick start - Build and deploy'
sidebar_label: 'Build and deploy'
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

You can specify which database to use in your application by editing **genesis-system-definition.kts**, which is located in **genesis-product\alpha-site-specific\src\main\resources\cfg\\**. Choose the appropriate environment you are using.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs defaultValue="Intellij Plugin" values={[{ label: 'Intellij Plugin', value: 'Intellij Plugin', },{ label: 'Docker', value: 'Docker' }, { label: 'WSL', value: 'WSL'}]}>
<TabItem value="Intellij Plugin">

```kotlin {4,10} title="genesis-system-definition.kts"
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

</TabItem>
<TabItem value="Docker">

```kotlin {4,10} title="genesis-system-definition.kts"
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
</TabItem>
<TabItem value="WSL">

```kotlin {4,10} title="genesis-system-definition.kts"
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "FDB")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")
        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")
        item(name = "DbHost", value = "localhost")
        item(name = "DbMode", value = "VANILLA")
        ...
    }
}
```
</TabItem>
</Tabs>

:::tip
Further information can be found in the [**genesis-system-definitions.kts** file](../../../server/configuring-runtime/system-definitions/).
:::

## Connect the front end to the server

We have two different approaches to connect to the server, depending on your runtime environment.

In this tutorial, you need to verify the default `API_HOST` in the **package.json** in **client/web/**.

<Tabs defaultValue="Intellij Plugin" values={[{ label: 'Intellij Plugin', value: 'Intellij Plugin', }, { label: 'Docker', value: 'Docker'}, { label: 'WSL', value: 'WSL'}]}>
<TabItem value="Intellij Plugin">

```kotlin {8} title="client/web/package.json"
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

</TabItem>
<TabItem value = "Docker">

```kotlin {8} title="client/web/package.json"
{
  "name": "@genesislcap/alpha-web-client",
  "description": "Developer Training Web Client",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "config": {
    "API_HOST": "ws://localhost/gwf/",
    "DEFAULT_USER": "JaneDee",
    "DEFAULT_PASSWORD": "beONneON*74",
    "PORT": 6060
  },
```
</TabItem>
<TabItem value = "WSL">

```kotlin {8} title="client/web/package.json"
{
  "name": "@genesislcap/alpha-web-client",
  "description": "Developer Training Web Client",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "config": {
    "API_HOST": "ws://localhost/gwf/",
    "DEFAULT_USER": "JaneDee",
    "DEFAULT_PASSWORD": "beONneON*74",
    "PORT": 6060
  },
```
</TabItem>
</Tabs>

## Build and deploy

Finally, you can build and deploy the server.

### Build

In the Gradle menu on the right of IntelliJ, select:

**genesisproduct-alpha**

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```

### Deploy

As soon as the Build is done, you need to deploy the application. Here are the two ways to deploy using different runtime environments.

<Tabs defaultValue="Intellij Plugin" values={[{ label: 'Intellij Plugin', value: 'Intellij Plugin', },{ label: 'Docker', value: 'Docker'} ,{ label: 'WSL', value: 'WSL'}]}>
<TabItem value="Intellij Plugin">

<h3>Start up plugin</h3>

After the Gradle tasks, when first using the plugin with a project, you must create your genesis home folder; click on the **Install Genesis** button on the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a hidden folder called **.genesis-home** in your project root, ready to run your application's processes. 

:::note
On the first run, this could take up to 20 minutes, because it performs a full build of your application.
:::

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. If you are prompted for this, click **ok** to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

</TabItem>
<TabItem value="Docker">

You do not need to do anything at this point. You can now proceed to the [run the application](../../quick-start/run-the-application-docker/)

</TabItem>
<TabItem value="WSL">

The Genesis platform provides several tasks that help to set up the Genesis environment so that you can deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.

<h4>Pre-requisites</h4>

:::caution Adding the WSL configuration in the gradle.properties file
Please add the last three highlighted lines in your  **gradle.properties** file from the **server/jvm** folder. The final file should be like this:

```properties {8-10} title="gradle.properties"
kotlin.code.style=official
org.gradle.jvmargs=-Xmx6g -Xss512k -XX:+HeapDumpOnOutOfMemoryError -XX:+UseG1GC -XX:+UseStringDeduplication -XX:ReservedCodeCacheSize=512m -Dkotlin.daemon.jvm.options=-Xmx2g -Dfile.encoding=UTF-8
bundleGeneratedClasses=true
genesisVersion=6.4.2
authVersion=6.4.0
deployPluginVersion=6.4.2
genesisArtifactoryPath=https://genesisglobal.jfrog.io/genesisglobal/libs-release-client
genesis-home=/home/genesis/run
wsl-distro=TrainingCentOS
wsl-user=genesis
```

| Entry  |  Description | 
|---|---|
|`genesis-home`|  This is a mandatory property that is a path on the WSL distribution. |
|`wsl-distro`|  This is a mandatory property that is the name of the WSL distribution. |
|`wsl-user`|  This is an optional property. If omitted, the default WSL user will be used. |

:::

<h4>Deployment of the back end</h4>

Now we are going to install the Genesis Platform (i.e. Genesis distribution) on the server and then install the back end of our application on the same server. This is all done using the Genesis deploy plugin that comes with several tasks grouped under `genesisdeploy` and `genesissetup`.

<h5>Deploying to the server</h5>

We will run `setupEnvironment` first (we only need to run it once) to set up the platform on the server. This task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution. So, basically, it installs the Genesis Platform on your local server.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**setupEnvironment**.

![](/img/setup-environment.png)

```shell title='Running setupEnvironment from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:setupEnvironment
```

After this command is completed, we will have a basic genesis server running.

<h5>Deploying the auth module</h5>
As our application requires [authentication](/server/access-control/introduction/), we have to install the Genesis Auth module.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**install-auth-distribution.zip**.

![](/img/install-auth.png)

```shell title='Running install-auth-distribution.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:install-auth-distribution.zip
```

<!-- Adjusting WSL we could remove this-->
<h5>Deploying the site-specific</h5>
As our application will override the standard definitions using the site-specific folder, we have to run this task.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip**.

![](/img/install-site-specific.png) 

```shell title='Running install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip
```

<!-- END Adjusting WSL we could remove this-->

<h5>Deploying the alpha product</h5>

Now we have to deploy our application, the alpha product.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesisdeploy**/**deploy-genesisproduct-alpha.zip**.

![](/img/deploy-alpha-product.png)

```shell title='Running deploy-genesisproduct-alpha.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:deploy-genesisproduct-alpha.zip 
```
</TabItem>
</Tabs>

Congratulations! You now you have a running database and a built application. Next step [run the application](../run-the-application-docker/)