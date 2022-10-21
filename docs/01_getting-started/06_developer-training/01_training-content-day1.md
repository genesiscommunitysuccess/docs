---
id: training-content-day1
title: Day one
sidebar_label: Day one
sidebar_position: 3
---

This day covers:

- [Quick review of the platform​](#quick-review-of-the-platform)
- [Setting up Workstation and Environment](#setting-up-workstation-and-environment)
- [Developing your first application​​](#developing-your-first-application)
- [Testing the back end​​](#testing-the-backend)


## Quick review of the platform

The Genesis low-code platform is the only low-code platform designed to build and run mission-critical systems for the financial markets, based on event-driven and microservice architecture. 

The platform enables your application to handle events and distribute data in real time from the start by using its building blocks, such as Data Servers, Request Servers and Event Handlers. These resources are powered by Genesis Platform Abstraction Language (**GPAL**), which plugs into IntelliJ, allowing for code autocompletion, compilation and syntax highlighting as you code. 

<b>Genesis Low-Code Platform</b>

![](/img/genesis-platform.png)

At the heart of the server is the data persistence layer and the **data model**. You model your data by defining fields, then tables, then views.

Once you have a data model defined, you can start bringing your application to life by creating **events** in an Event Handler process, which have access to the data layer importing auto-generated data repositories, to handle the business logic with code written in languages such as Kotlin and/or Java. 

When it comes to displaying the data, you can configure a **Data Server** to distribute the data to the front end. The Data Server is a GPAL component that streams the data in real time to subscribers, such as a data grid component in the front end. You can also bind a button in the UI to an event (action) defined in your Event Handler.

All of this is managed by the Genesis low-code platform. You don't need to worry about inter-process communication or even how to connect the front end to the back end, as the Platform handles a web socket connection between the browser and the data server for you. Even defining something as simple as the example below will get you a data grid showing all trades in real time:

Back end
```kotlin
dataServer {
    query("ALL_TRADES", TRADE)
}
```

Front end
```html
<zero-grid-pro rowHeight="45">
    <grid-pro-genesis-datasource resourceName="ALL_TRADES" orderBy="TRADE_DATETIME" />
</zero-grid-pro>
```

Now let's take a closer look at the server architecture.

<b>Server Architecture</b>

![](/img/server-architecture.png)

Surrounding the core, operational tools enable you to run and monitor the application, while cluster services enable you to run across multiple nodes. Auth and permissions enable you control access and build sophisticated and granular access to data and functions. 

You will get familiar with all these concepts in the next lessons.

## Developing your first application​​

This will enable you to see the basics of the Genesis low-code platform by starting with a very simple application. It is designed simply to get from start to finish as quickly as possible. It is in five main steps:

1. [Create a new project](#1-create-a-new-project).
2. [Define the data model](#2-define-the-data-model).
3. [Add business logic](#3-add-business-logic).
4. [Prepare the server](#4-prepare-the-server).
5. [Build process](#5-build-process).
6. [Deployment](#6-deployment).

### What you will build

The very simple application you will build will look like this:

- a simple table with 5 fields
- two front-end components: one to display data and one to insert data

:::info
Once you finish this lesson, you will extend this initial simple application into a full Trades & Positions app!
:::

With a lack of imagination we hope you will find trustworthy, we are going to call this example application **alpha**. You will see this reflected in the file names throughout.

### 1. Create a new project

To create a new project you can use the GenX CLI tool, which enables you to seed projects. Further details can be found [here](/getting-started/quick-start/create-a-new-project/).

In this case, we just want to extend a blank full-stack application project, so we are using the training seed [available](https://github.com/genesiscommunitysuccess/devtraining-seed). So, clone this repository locally using the command below. 

```shell title='Cloning the devtraining-seed'
git clone https://github.com/genesiscommunitysuccess/devtraining-seed.git
```

Here's a quick overview of the repository you just cloned:

![](/img/create-application-folder-overview.png)

Above, we have expanded the `client` folder. This contains all the UI-related projects.

The `server` folder follows the same structure. This contains all the server-side projects.

### 2. Define the data model
Now you are ready to define the fields and tables that make up your [data model](/database/fields-tables-views/fields-tables-views/). This structures information in a simple way that can be viewed by users and processed by the application.

Open IntelliJ (or your chosen IDE) and open the alpha project (the devtraining-seed you cloned). After importing and indexing, you should see the files and project structure ready.

#### Add fields
You define your [fields](/database/fields-tables-views/fields/) in the file **alpha-fields-dictionary.kts**.


:::tip

Once the project is open, there are two easy ways to find this file quickly in Intellij:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::


For our simple example, we will add five fields:

```kotlin
fields {

    field("TRADE_ID", type = STRING)
    field("QUANTITY", type = INT)
    field("PRICE", type = DOUBLE)
    field("SYMBOL", type = STRING)
    field("DIRECTION", type = ENUM("BUY", "SELL", default = "BUY"))

}
```

After you have saved this file, run [genesis-generated-fields](/database/fields-tables-views/genesisDao/).

##### generateFields

From the Gradle menu on the right of Intellij, this is:

 **genesisproduct-alpha**/**alpha-dictionary-cache**/**genesis-generated-fields**/**Tasks**/**genesis**/**generateFields**

![](/img/build-gradle-kts-fields.png)

Alternatively, if you can't run it from your IDE, you can run the Gradle tasks from the command line. Make sure to open your terminal and cd into **../server/jvm** to run them.

```shell title='Running generateFields from the command line'
./gradlew :genesisproduct-alpha:alpha-dictionary-cache:genesis-generated-fields:generateFields
```

:::note Why do I have to run this Gradle task?

You are editing a kts file that needs to be compiled and built to be used from other places. In this case, we want the fields to be available to the tables (and with intellisense support from the IDE).

As we go, you'll see we have different Gradle tasks, depending on the artifact we want to build.
:::

#### Add a table
Now we have our fields, let's define a [table](/database/fields-tables-views/tables/) in the file **alpha-tables-dictionary.kts**.

We are defining one single table, containing all our fields.

TRADE_ID is the primaryKey, which will be auto-generated.

```kotlin
tables {

    table (name = "TRADE", id = 2000) {
        sequence(TRADE_ID, "TR")
        QUANTITY
        PRICE not null
        SYMBOL
        DIRECTION

        primaryKey {
            TRADE_ID
        }
    }
    
}
```

After you have saved this file, run [genesis-generated-dao](/database/fields-tables-views/genesisDao/).

##### generateDao

From the Gradle menu, this is:

**genesisproduct-alpha**/**alpha-dictionary-cache**/**genesis-generated-dao**/**Tasks**/**genesis**/**generateDao**

![](/img/build-gradle-kts-generated-dao.png)


```shell title='Running generateDAO from the command line'
./gradlew :genesisproduct-alpha:alpha-dictionary-cache:genesis-generated-dao:generateDao
```

After running it, you have the DAOs (i.e. data repos) automatically generated from the tables and available to be imported in your code.

### 3. Add business logic
We have a table; now we want to be able to see its content and create new entries.


#### Data Server
A [Data Server](/server/data-server/introduction/) enables data to be read in real time. You must define the Data Server in the file **alpha-dataserver.kts**.

```kotlin
dataServer {
    query("ALL_TRADES", TRADE)
}
```

#### Event Handler
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](/server/event-handler/introduction/) in the file **alpha-eventhandler.kts**.

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

### 4. Prepare the server
So far we have created an event handler and data server - just their definitions, but there's nothing on the runtime configuration yet. Each microservice, such as Event Handler and Data Server, must run on their own processes. To do that, we have to change the processes and the service definition files:

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
Add the following content to the **alpha-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```

Please see [here](/server/configuring-runtime/processes/) for a detailed description of the processes configuration.
<!-- ADD THIS DO DAY 5 AS AN EXERCISE
#### Overriding default configurations
You can override the standard definitions using the site-specific folder located at ..\alpha\server\jvm\alpha-site-specific\src\main\resources\cfg\

Once deployed into the server, the files from that folder get installed in the runtime folder under a sub-folder called 'site-specific'. This is an area of the run directory, i.e. the Platform installation directory, where you can override the standard definitions found elsewhere in the application. You supply the standard definition name and your own definition. Your application will then only use your definition.

This is useful where you have used standard modules such as Auth, FIX or even the Genesis distribution itself; you should never change these modules. Any files or definitions that are listed in the site-specific area automatically take their places. In our case, the genesis-system-definition.kts must be edited to use postgres database engine instead of the default one (FDB) as follows: 

```kotlin
...
item(name = "DbLayer", value = "SQL")
...
item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/?user=postgres&password=docker")

```
:::tip
If you had to add application specific definitions, like an API_KEY for example, you'd have to edit ..\server\jvm\alpha-config\src\main\resources\cfg\alpha-system-definition.kts
:::
-->

### 5. Build process

Finally, you can build the server.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**Tasks**/**build/assemble**.

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```

### 6. Deployment

Now that the back end of our application is built, it's time to deploy it.

The Genesis deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.


#### Pre-requisites

You should hava a sub-module called alpha-deploy under ../server/jvm.

Ensure the **build.gradle.kts** in this sub-module has the following entry

```kotlin
plugins {
    id("global.genesis.deploy") version "6.2.3"
}
```

:::caution edit gradle.properties
Ensure the `gradle.properties` file from the server/jvm folder is properly set with the following entries:

```properties
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

#### Deployment of the back end

Now we are going to install the Genesis Platform (i.e. Genesis distribution) on the server and then install the back end of our application on the same server. This is all done using the Genesis deploy plugin that comes with several tasks grouped under `genesisdeploy` and `genesissetup`.

##### Deploying to the server

We will run `setupEnvironment` first (we only need to run it once) to set up the platform on the server. This task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution. So, basically, it installs the Genesis Platform on your local server.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**setupEnvironment**.

![](/img/setup-environment.png)

```shell title='Running setupEnvironment from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:setupEnvironment
```

After this command is completed, we will have a basic genesis server running.

### Deploying the auth module
As our application requires [authentication](/server/access-control/introduction/), we have to install the Genesis Auth module.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**install-auth-distribution.zip**.

![](/img/install-auth.png)

```shell title='Running install-auth-distribution.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:install-auth-distribution.zip
```

<!-- Adjusting WSL we could remove this-->
### Deploying the site-specific
As our application will override the standard definitions using the site-specific folder, we have to run this task.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip**.

![](/img/install-site-specific.png) 

```shell title='Running install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip
```

<!-- END Adjusting WSL we could remove this-->

### Deploying the alpha product

Now we have to deploy our application, the alpha product.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesisdeploy**/**deploy-genesisproduct-alpha.zip**.

![](/img/deploy-alpha-product.png)

```shell title='Running deploy-genesisproduct-alpha.zip from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:deploy-genesisproduct-alpha.zip 
```

:::tip
This will take the last built distribution and does not run a project build as part of the task. Make sure you have done it exactly as [described previously](/getting-started/developer-training/training-content-day1/#4-prepare-the-server-and-build).
:::


### Adding a user to login

Next let's create a user.

:::note
The following details will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

We shall run the task `loadInitialData`. This adds the data in a file called USER.csv to be imported into the USER table in your
database. The USER table, among other users and permissioning tables, is defined by the Genesis Auth module that we installed previously. 

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesissetup**/**loadInitialData**.

![](/img/load-initial-data.png)

```shell title='Running loadInitialData from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:loadInitialData
```

Now we are going to use Genesis DbMon to run some queries on the database. 

DbMon is a Genesis tool, database-engine agnostic, used to access the data stored in the DbLayer configured in the application. In our case, it's FoundationDB. But, if it was another database engine like PostgreSQL for example, you would still be able to use DbMon.

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesisscripts**/**DbMon**.

![](/img/using-DbMon.png)

```shell title='Running DbMon from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:DbMon
```

You should see something like this after a few seconds:
```shell
==================================
Genesis Database Monitor
Enter 'help' for a list of commands
==================================
```

:::caution DbMon seems to be frozen?
It's probably not frozen, as once you run DbMon it's expecting you to enter a subsequent command. We call it a ***DbMon command***. So, go ahead and try typing the commands listed below.
:::

Once you are inside DbMon console, type `table USER` and then `search 1`. If imported correctly, the user JaneDee should be listed.

If you are curious, type `help` and it will list all available DbMon commands.

#### Running server commands
:::info can I run server commands from the command line rather than gradle tasks?
Yes. We've been running server commands through the gradle tasks. Alternatively, you can run server commands directly from a command line. 

Open PowerShell (or Windows Command Prompt), access your WSL instance 'TrainingCentOS' and switch to user 'genesis' to have access to the Genesis Platform commands:
```shell
wsl -d TrainingCentOS
su genesis
DbMon
```

Try it now!

:::

Now, let's run the Genesis command `mon` to see if all processes are up and running on the server:

In the Gradle menu on the right of IntelliJ, select **genesisproduct-alpha**/**alpha-deploy**/**Tasks**/**genesisscripts**/**mon**.

![](/img/using-mon.png)

```shell title='Running mon from the command line'
./gradlew :genesisproduct-alpha:alpha-deploy:mon
```

we should see something like this

```shell
PID     Process Name                  Port        Status         CPU       Memory    Message
===============================================================================================
426     GENESIS_AUTH_CONSOLIDATOR     8005        STANDBY        36.30     1.30
350     GENESIS_AUTH_DATASERVER       8002        RUNNING        56.70     1.70
334     GENESIS_AUTH_MANAGER          8001        RUNNING        61.50     1.70
368     GENESIS_AUTH_PERMS            8003        RUNNING        65.70     1.90
403     GENESIS_AUTH_REQUEST_SERVER   8004        RUNNING        56.80     1.60
490     GENESIS_CLUSTER               9000        RUNNING        84.30     2.50
570     GENESIS_ROUTER                9017        RUNNING        54.70     2.00
534     GENESIS_WEBMON                9011        RUNNING        51.30     2.50
===============================================================================================
664     ALPHA_DATASERVER              11000       RUNNING        58.10     1.50
703     ALPHA_EVENT_HANDLER           11001       RUNNING        71.30     2.20
```

:::note server commands
Try to run `mon` from the command line as well!
:::

See [here](/getting-started/prerequisites/gradle-deploy-plugin/) for extra details on how to configure the Genesis deploy plugin.



## Testing the back end


There are multiple ways you can test the back end of your application. It's important to note that most resources, such as Event Handlers and Data Servers, are exposed as HTTP endpoints automatically by the Genesis platform - without any additional code. This enables you to test those resources from HTTP clients, such as Postman. Alternatively, you can use Genesis Console, which gives you a simple way of testing components from a nice web UI.

### Genesis Console
1. In your browser, go to http://genesislcap.com/console/console-next2/?host=localhost:8080.
2. Enter the IP address of your server, in this case localhost. We should also add the port, as our web server running on the WSL instance is listening on 8080, so the value to be entered here is `localhost:8080`
3. Log in with your user name and password as [defined previously](/getting-started/developer-training/training-content-day1/#adding-a-user-to-login). This starts Genesis Console, and you will see a list of tabs along the top of the screen.
4. Click on the **RESOURCES** tab.
5. Filter the **Resource type** to show only event handlers.

For example:

![](/img/test-console-eh-filter-alpha.png)

As well as the Event Handlers that you have defined yourself, you will also see other Event Handlers that have been generated automatically by the platform: anything that is a **GENESIS_CLUSTER** service, for example.

If you click on any Event Handler in the list, the fields relevant to the event are displayed to the right.

![](/img/test-console-eh-fields-alpha.png)

Now you need to pick the Event Handler you want to test. So, let's look up EVENT_TRADE_INSERT.

1. Find the Event Handler in the list, then click on the arrow beside it. On the right, this displays the relevant input fields for the event. Some are mandatory, while others are optional - depending on how the Event Handler was set up.

![](/img/test-console-eh-insert-trade-alpha.png)

2. Enter the details of the new trade in the fields then click on **COMMIT**:

![](/img/test-console-eh-insert-trade-alpha-2.png)

If the Event Handler is working correctly, you will receive an **ACK**.

![](/img/test-console-eh-insert-instrument-ack.png)

#### Checking the insertion
You can go on to check the TRADE table to see if your insert is there.

1. Filter the list of services to show only Data Servers (these are the components that distribute the data).

2. Search for the relevant resource - in our case TRADE.

![](/img/test-console-eh-confirm-trade-alpha.png)

3. Click on the arrow beside the relevant resource. You should now see the new trade in the list displayed on the right.

![](/img/test-console-eh-confirm-trade-alpha-2.png)

### Exercise 1.1: Data Servers
:::info ESTIMATED TIME
30 mins
:::

Look at the [Data Server documentation](/server/data-server/introduction/) and see if you are able to modify our Data Server [defined previously](/getting-started/developer-training/training-content-day1/#data-server):
- add a new query called "ALL_PRICES" on the TRADE table
- make ALL_PRICES display only SYMBOL and PRICE fields
- add a `where` clause so it displays only trades whose PRICE are higher than 0.0

Remember to insert a few trades using Genesis Console to test it.

### Exercise 1.2: Event Handlers
:::info ESTIMATED TIME
20 mins
:::

Look at the [Event Handler documentation](/server/event-handler/basics/#returning-a-nack) and see if you are able to modify our Event Handler [defined previously](/getting-started/developer-training/training-content-day1/#event-handler):
- return `nack("Quantity must be positive")` if the quantity is lower than 0.

Test it with Genesis Console.
