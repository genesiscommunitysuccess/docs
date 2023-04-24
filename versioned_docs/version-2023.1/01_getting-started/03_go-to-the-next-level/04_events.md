---
title: 'Go to the next level - user interaction using Data Servers, Request Servers and Event Handlers'
sidebar_label: 'User interaction'
id: events
keywords: [getting started, quick start, next level, user interaction, events]
tags:
    - getting started
    - quick start
    - next level
    - introduction
    - user interaction
    - events
---

Now that we have our data model defined, we can start adding the capabilities to read and create entries.

## Section objectives
The goal of this section is to define and build:
- an Event Handler for creating trades 
- a Data Server for reading positions and trades


## Data Server
The component that enables data to be read in real time is called the [Data Server](../../../server/data-server/introduction/). All the queries that a Data Server executes are defined in **alpha-dataserver.kts**. A Data Server can query both tables and views, so let's add two queries:

- `ALL_POSITIONS` - this queries the `POSITION` table and returns the data stored in the table
- `ALL_TRADES` - this queries the `TRADE_VIEW` and returns the joined data stored in the `TRADE`, `INSTRUMENT` and `COUNTERPARTY` tables

```kotlin title="alpha-dataserver.kts"
dataServer {
    query("ALL_POSITIONS", POSITION)
    query("ALL_TRADES", TRADE_VIEW)
}
```

## Event Handler
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](../../../server/event-handler/introduction/) in the file **alpha-eventhandler.kts**.


```kotlin title="alpha-eventhandler.kts"
eventHandler {

    eventHandler<Trade>(name = "TRADE_INSERT") {
        onCommit { event ->
            entityDb.insert(event.details)
            ack()
        }
    }
}
```
:::info What is entityDb?

The [entityDb](../../../database/database-interface/entity-db/) enables you to interact with the database layer. It's part of the Genesis database API and we'll get into more details soon. For now, understand that this is the common way to access data from code. Feel free to use the intellisense of your IDE to explore the methods available from entityDb.
:::

## Request Server

Predominantly used for serving the UI, Request Servers retrieve a snapshot of data from your tables/views on demand.

We will be using the following Request Server when we build the front end. Add the following simple code to the file **alpha-reqrep.kts** and we will mention this in a later section.

```kotlin
requestReplies {
    requestReply(INSTRUMENT)
}
```

## Prepare the server and build
So far we have created an Event Handler and Data Server - just their definitions, but there's nothing on the runtime configuration yet. Each component, such as Event Handler and Data Server, must run on their own processes. To do that, we have to change the processes and the service definition files:

- **alpha-processes.xml**
- **alpha-service-definitions.xml**

At present, they are empty. You need to insert the details of the Data Server and Event Handler that you have just created.

Add the following content to the **alpha-processes.xml** file.

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
    <process name="ALPHA_REQUEST_SERVER">
        <groupId>ALPHA</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-requestserver</module>
        <package>global.genesis.requestreply.pal</package>
        <script>alpha-reqrep.kts</script>
        <description>Server one-shot requests for details</description>
        <language>pal</language>
    </process>
</processes>
```
Add the following content to the **alpha-service-definitions.xml** file.

```xml title="alpha-service-definitions.xml"
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
    <service host="localhost" name="ALPHA_REQUEST_SERVER" port="11002"/>
</configuration>
```

See [here](../../../server/configuring-runtime/processes/) for a detailed description of the processes configuration. Finally, you can build the server.

From the Gradle menu on the right of Intellij, this is: **alpha-tutorial**/**Tasks**/**build/assemble**.

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```
:::info HTTP Endpoints
 It's important to note that most resources, such as Event Handlers and Data Servers, are exposed as [HTTP endpoints](../../../server/integration/rest-endpoints/introduction/) automatically by the Genesis platform - without any additional code. This enables you to test those resources from HTTP clients, such as Postman. Alternatively, you can use Genesis Console, which gives you a simple way of testing components from a nice web UI.
:::

Now you are ready to deploy your application again.

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

Remember to start the resource deamon and start all processes again.

## Conclusion
Data Server and Event Handler are the main components to interact with the server. Now that we have built our back end, we have something to interact with. Once you have deployed it, if you want to test what you've done so far, go to [Endpoints](../../../server/integration/rest-endpoints/introduction/).

For a reference point for these components checkout the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/server/jvm/positions-app-tutorial-script-config/src/main/resources/scripts). 

Otherwise, you can continue to the [next section](../../../getting-started/go-to-the-next-level/data-grid/) and deploy and test the whole application at later time.
