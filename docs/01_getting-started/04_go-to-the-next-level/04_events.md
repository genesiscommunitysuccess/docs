---
title: 'User interaction using Data Server and Event Handlers'
sidebar_label: 'User interaction using Data Server and Event Handlers'
id: events
---

Now that we have our data model defined, we can continue with exposing the data and adding the capability to create entries.


## Data Server
The component that enables data to be read in real time is called the [Data Server](/server-modules/data-server/introduction/). All the queries that a Data Server executes are defined in **positions-app-tutorial-dataserver.kts**. A Data Server can query both tables and views, so let's add two queries:
- `ALL_POSITIONS` - that queries the `POSITION` table and returns the data stored in the table
- `ALL_TRADES` - that queries the `TRADE_VIEW` and returns the joined data stored in the `TRADE`, `INSTRUMENT` and `COUNTERPARTY` tables

```kotlin
dataServer {
    query("ALL_POSITIONS", POSITION)
    query("ALL_TRADES", TRADE_VIEW)
}
```

## Event Handler
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](/server-modules/event-handler/introduction/) in the file **positions-app-tutorial-eventhandler.kts**.


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

The [entityDb](/database/database-interface/entity-db/) enables you to interact with the database layer, it's part of the Genesis Database API and we'll get into more details soon. For now, understand that this is the common way to access data from code. Feel free to use the intellisense of your IDE to explore the methods available from entityDb.
:::

## Prepare the server and build
So far we have created an event handler and data server - just their definitions, but there's nothing on the runtime configuration yet. Each component, such as Eevent Handler and Data Server, must run on their own processes. To do that, we have to change the processes and the service definition files:

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
</processes>
```
Add the following content to the **positions-app-tutorial-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_DATASERVER" port="11000"/>
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_EVENT_HANDLER" port="11001"/>
</configuration>
```

Please see [here](/server-modules/configuring-runtime/processes/) for a detailed description of the processes configuration.
Finally, you can build the server.


In the Gradle menu on the right of IntelliJ, select **positions-app-tutorial**/**Tasks**/**build/assemble**.

![](/img/assemble-server.png)

:::info HTTP Endpoints
 It's important to note that most resources, such as Event Handlers and Data Servers, are exposed as [HTTP endpoints](/server-modules/integration/rest-endpoints/introduction/) automatically by the Genesis platform - without any additional code. This enables you to test those resources from HTTP clients, such as Postman. Alternatively, you can use Genesis Console, which gives you a simple way of testing components from a nice web UI.
:::

## Conclusion
Data Server and Event Handler are the main components to interact with the server. Now that they are defined, you can either give them a try [right away](/getting-started/go-to-the-next-level/see-it-work) or continue with adding Data Grid to show the data.
