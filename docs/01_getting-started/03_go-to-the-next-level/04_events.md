---
title: 'User interaction using Data Servers, Request Servers and Event Handlers'
sidebar_label: 'User interaction'
id: events
---

Now that we have our data model defined, we can start adding the capabilities to read and create entries.

## Section objectives
The goal of this section is to define and build:
- an Event Handler for creating trades 
- a Data Server for reading positions and trades


## Data Server
The component that enables data to be read in real time is called the [Data Server](/server/data-server/introduction/). All the queries that a Data Server executes are defined in **positions-app-tutorial-dataserver.kts**. A Data Server can query both tables and views, so let's add two queries:

- `ALL_POSITIONS` - this queries the `POSITION` table and returns the data stored in the table
- `ALL_TRADES` - this queries the `TRADE_VIEW` and returns the joined data stored in the `TRADE`, `INSTRUMENT` and `COUNTERPARTY` tables

```kotlin
dataServer {
    query("ALL_POSITIONS", POSITION)
    query("ALL_TRADES", TRADE_VIEW)
}
```

## Event Handler
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](/server/event-handler/introduction/) in the file **positions-app-tutorial-eventhandler.kts**.


```kotlin
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

The [entityDb](/database/database-interface/entity-db/) enables you to interact with the database layer. It's part of the Genesis database API and we'll get into more details soon. For now, understand that this is the common way to access data from code. Feel free to use the intellisense of your IDE to explore the methods available from entityDb.
:::

## Request Server

Predominantly used for serving the UI, Request Servers retrieve a snapshot of data from your tables/views on demand.

We will be using the following Request Server when we build the front end. Add the following simple code to the file **positions-app-tutorial-reqrep.kts** and we will mention this in a later section.

```kotlin
requestReplies {
    requestReply(INSTRUMENT)
}
```

## Prepare the server and build
So far we have created an Event Handler and Data Server - just their definitions, but there's nothing on the runtime configuration yet. Each component, such as Event Handler and Data Server, must run on their own processes. To do that, we have to change the processes and the service definition files:

- **positions-app-tutorial-processes.xml**
- **positions-app-tutorial-service-definitions.xml**

At present, they are empty. You need to insert the details of the Data Server and Event Handler that you have just created.

Add the following content to the **positions-app-tutorial-processes.xml** file.

```xml
<processes>
    <process name="POSITIONS_APP_TUTORIAL_DATASERVER">
        <groupId>POSITIONS_APP_TUTORIAL</groupId>
        <start>true</start>
        <options>-Xmx1024m -DXSD_VALIDATE=false</options>
        <module>genesis-pal-dataserver</module>
        <package>global.genesis.dataserver.pal</package>
        <script>positions-app-tutorial-dataserver.kts</script>
        <description>Displays real-time details</description>
        <language>pal</language>
        <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
    </process>
    <process name="POSITIONS_APP_TUTORIAL_EVENT_HANDLER">
        <groupId>POSITIONS_APP_TUTORIAL</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-eventhandler</module>
        <package>global.genesis.eventhandler.pal</package>
        <script>positions-app-tutorial-eventhandler.kts</script>
        <description>Handles events</description>
        <classpath>positions-app-tutorial-messages*,positions-app-tutorial-eventhandler*</classpath>
        <language>pal</language>
    </process>
    <process name="POSITIONS_APP_TUTORIAL_REQUEST_SERVER">
        <groupId>POSITIONS_APP_TUTORIAL</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-requestserver</module>
        <package>global.genesis.requestreply.pal</package>
        <script>positions-app-tutorial-reqrep.kts</script>
        <description>Server one-shot requests for details</description>
        <language>pal</language>
    </process>
</processes>
```
Add the following content to the **positions-app-tutorial-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_DATASERVER" port="11000"/>
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_EVENT_HANDLER" port="11001"/>
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_REQUEST_SERVER" port="11002"/>
</configuration>
```

See [here](/server/configuring-runtime/processes/) for a detailed description of the processes configuration. Finally, you can build the server.

From the Gradle menu on the right of Intellij, this is: **genesisproduct-positions-app-tutorial**/**Tasks**/**build/assemble**.

![](/img/assemble-server-positions.png)

:::info HTTP Endpoints
 It's important to note that most resources, such as Event Handlers and Data Servers, are exposed as [HTTP endpoints](/server/integration/rest-endpoints/introduction/) automatically by the Genesis platform - without any additional code. This enables you to test those resources from HTTP clients, such as Postman. Alternatively, you can use Genesis Console, which gives you a simple way of testing components from a nice web UI.
:::

## Conclusion
Data Server and Event Handler are the main components to interact with the server. Now that we have built our back end, we have something to interact with. Once you have deployed it, if you want to test what you've done so far, go to [Endpoints](/server/integration/rest-endpoints/introduction/).

Otherwise, you can continue to the [next section](/getting-started/go-to-the-next-level/data-grid/) and deploy and test the whole application at later time.
