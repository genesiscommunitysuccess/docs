---
id: training-content-day1
title: Day 1
sidebar_label: Day 1
sidebar_position: 3

---
In this day we are covering:

- [Quick review of the Platform​](#quick-review-of-the-platform)
- [Setting up Workstation and Environment](#setting-up-workstation-and-environment)
- [Developing your first application​​](#developing-your-first-application)
- [Testing the backend​​](#testing-the-backend)


## Quick review of the Platform

The only low-code platform designed to build and run mission-critical systems for the financial markets based on event-driven and microservices architecture. 

The Genesis low-code platform easily enables your application to handle events and distribute data in real time from the start by using its building blocks such as data servers, request servers and event handlers. These resources are powered by Genesis Platform Abstraction Language (**GPAL**), which plugs into IntelliJ allowing for code autocompletion, compilation and syntax highlighting as you code. 

<b>Genesis Low-Code Platform</b>

![](/img/genesis-platform.png)

At the heart of the server is the data persistence layer and the **data model**. You model your data by defining fields, then tables, then views.

Once you have a data model defined, you can start bringing your application to life by creating **events** in an event handler process, which have access to the data layer importing auto-generated data repositories, to handle the business logic with code written in languages such as Kotlin and/or Java. 

When it comes to displaying the data, you can configure a **data server** to distribute the data to the front end. The data server is a GPAL component that streams the data in real time to subscribers such as a data grid component in the front end. You can also bind a button in the UI to an event (action) defined in your event handler.

All of this managed by the Genesis low-code platform. You don't need to worry about inter-process communication or even how to connect the front end to the back end as the Platform handles a web socket connection between the browser and the data server for you. Simply defining something as simple as the example below will get you a data grid showing all trades in real time:

Back end
```kotlin
dataServer {
    query("ALL_TRADES", TRADE)
}
```

Front end
```html
<zero-ag-grid rowHeight="45">
    <ag-genesis-datasource resourceName="ALL_TRADES" orderBy="TRADE_DATETIME" />
</zero-ag-grid>
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
4. [Prepare the server and build](#4-prepare-the-server-and-build).
5. [Deployment](#5-deployment)

### What you will build

The very simple application you will build will look like this:

- a simple table with 5 fields
- two front-end components: one to display data and one to insert data

:::info
Once you finish this lesson, you will extend this initial simple application into a full Trades & Positions app!
:::

With a lack of imagination we hope you will find trustworthy, we are going to call this example application **alpha**. You will see this reflected in the file names throughout.

### 1. Create a new project
The GenX CLI tool enables you to seed projects, in this case we just want to generate a blank full-stack application project.

Once [installed](/tutorials/training-resources/environment-setup/), from the terminal, go to a folder where you want your project to reside, and run:

```shell
genx
```

In the `genx` script, there is a series of questions.

First, you are asked to provide your username and password - these are the credentials you use to access Genesis Artifactory.

Then you are asked to select from a short list of seed applications. Select `create application`:


```shell
? Genesis Username example.username
? Genesis Password **************
√ Logged into Genesis
? Please select an option: (Use arrow keys)
> create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
  create application - Generates a local application.
  configure application - Configure a local app.
```
Now you can proceed using the following responses:

```shell
? Create a app in current directory Yes
? App name alpha
```

In the next prompt, select `Quick Start Application` from the list.

```shell
? App seed Quick Start Application
? Overwrite existing files Yes
? Package scope (without the @) genesislcap
? Package name alpha
? Create design system Yes
```

At this point, the seed application is created and the genx dependencies are installed.

Then there are more questions, which you can respond to as follows:

```shell
? Package scope (without the @) genesislcap
? Package name alpha
? Create design system Yes
? Design system name alpha
? Base design system package (@latest will be used) @genesislcap/foundation-ui
? Set API Host Yes (ws://localhost/gwf)
? Genesis Server version 6.0.2
? Genesis Deploy plugin version 6.0.2
? Kotlin version 1.6.10
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```
At this point, the application will be configured. Assuming it is successful, you will see the following text:

```shell
i Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```

Here's a quick overview of the generated application's folder structure:

![](/img/create-application-folder-overview.png)

Above, we have expanded the `client` folder. This contains all the UI-related projects.

The `server` folder follows the same structure. This contains all the server-side projects.

:::note more about GenX
[GenX CLI reference](/creating-applications/creating-a-new-project/alternative_options_supported/web-project-setup/).
:::

### 2. Define the data model
Now you are ready to define the fields and tables that make up your [data model](/creating-applications/defining-your-application/data-model/data-model-overview). This structures information in a simple way that can be viewed by users and processed by the application.

Open Intellij (or your chosen IDE) and open the alpha project. After importing and indexing, you should see the files and project structure ready.

#### Add fields
You define your [fields](/creating-applications/defining-your-application/data-model/fields/fields/) in the file **alpha-fields-dictionary.kts**.



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

After you have saved this file, run [genesis-generated-fields](/reference/developer/genesis-dao/#dao-generation-commands).

From the Gradle menu on the right of Intellij, this is:

 **genesisproduct-alpha**/**alpha-dictionary-cache**/**Tasks**/**genesis-generated-fields**/**Tasks**/**generateFields**

![](/img/build-gradle-kts-fields.png)

:::note Why do I have to run this Gradle task?

You are editing a kts file that needs to be compiled and built to be used from other places. In this case, we want the fields to be available to the tables (and with intellisense support from the IDE).

As we go, you'll see we have different Gradle tasks depending on the artifact we want to build.
:::

#### Add a table
Now we have our fields, let's define a [table](/creating-applications/defining-your-application/data-model/tables/tables) in the file **alpha-tables-dictionary.kts**.

We are defining one single table, containing all our fields.

TRADE_ID is the primaryKey, which will be auto-generated.

```kotlin
tables {

    table (name = "TRADE", id = 2000) {
        sequence(TRADE_ID, "TR")
        QUANTITY
        PRICE
        SYMBOL
        DIRECTION

        primaryKey {
            TRADE_ID
        }
    }
    
}
```

After you have saved this file, run [genesis-generated-dao](/reference/developer/genesis-dao/#dao-generation-commands).

From the Gradle menu, this is:

**genesisproduct-alpha**/**alpha-dictionary-cache**/**Tasks**/**genesis-generated-dao**/**Tasks**/**generateDAO**

![](/img/build-gradle-kts-generated-dao.png)

After running it, you have the DAOs (i.e. data repos) automatically generated from the tables and available to be imported in your code.

### 3. Add business logic
We have a table; now we want to be able to see its content and create new entries.


#### Data Server
A [Data Server](/creating-applications/defining-your-application/user-interface/data-servers/data-servers) allows for reading of real-time data. You must define the Data Server in the file **alpha-dataserver.kts**.

```kotlin
dataServer {
    query("ALL_TRADES", TRADE)
}
```

#### Event Handler
Next, we want to be able to insert rows into our table. For this, you need to define an [Event Handler](/creating-applications/defining-your-application/business-logic/event-handlers/) in the file **alpha-eventhandler.kts**.

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

The entity db enables you to interact with the database layer, it's part of the Genesis Database API and we'll get into more details soon. For now, understand this is the common way to access data from code. Feel free to explore a bit more the methods available from entityDb using the intellisense of your IDE.
:::

### 4. Prepare the server and build
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
Add the following content to the **alpha-service-definitions.xml** file.

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
</configuration>
```

<!-- ADD THIS DO DAY 5 AS AN EXERCISE
#### Overriding default configurations
You can override the standard definitions using the site-specific folder located at ..\alpha\server\jvm\alpha-site-specific\src\main\resources\cfg\

Once deployed into the server, the files from that folder get installed in the runtime folder under a sub-folder called 'site-specific'. This is an area of the run directory, i.e. the Platform installation directory, where you can override the standard definitions found elsewhere in the application. You supply the standard definition name and your own definition. Your application will then only use your definition.

This is useful where you have used standard modules such as Auth, FIX or even the Genesis distribution itself; you should never change these modules. Any files/definitions that are listed in the site-specific area automatically take their places. In our case, the genesis-system-definition.kts must be edited to use postgres database engine instead of the default one (FDB) as follows: 

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
Finally, you can build the server.

In the Gradle menu on the right of IntelliJ, select **genesis-project-alpha**/**Tasks**/**Build/Assemble**.

![](/img/assemble-server.png)


### 5. Deployment

Now that the back end of our application is built, it's time to deploy it.

The Genesis deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.


#### Pre-requisites

You should hava a sub-module called alpha-deploy under ../server/jvm.

Ensure the **build.gradle.kts** in this sub-module has the following entry

```kotlin
plugins {
    id("global.genesis.deploy") version "6.0.2"
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

We will run `setupEnvironment` first (only need to run it once) to setup the Platform on the server. This task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :
```shell
./gradlew :jvm:alpha-deploy:setupEnvironment #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/setup-environment.png)

After this command is completed we will have a basic genesis server running.

### Deploying the auth module
As our application requires authentication, we have to install the Genesis auth module.

Usage:
```shell
./gradlew :jvm:alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/install-auth.png)

<!-- Adjusting WSL we could remove this-->
### Deploying the site-specific
As our application will override the standard definitions using the site-specific folder, we have to run this task.

Usage:
```shell
./gradlew :jvm:alpha-deploy:install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/install-site-specific.png)

<!-- END Adjusting WSL we could remove this-->

### Deploying the alpha product

Now we have to deploy our application, the alpha product.

Usage:
```shell
./gradlew :jvm:alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/deploy-alpha-product.png)

:::tip
This will take the last built distribution and does not run a project build as part of the task. Make sure you have done it like [described previously](/tutorials/training-resources/training-content-day1/#4-prepare-the-server-and-build).
:::


### Adding a user to login

Next let´s create a user.

:::note
The following details will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

We shall run the task `loadInitialData`. This adds the data in a file called USER.csv to be imported into the USER table in your
database. The USER table, among other users and permissioning tables, is defined by the Genesis Auth module installed previously. 

To run the task we will call:

```shell
./gradlew :jvm:alpha-deploy:loadInitialData #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/load-initial-data.png)

Now we are going to use Genesis DbMon to run some queries on the database.

Run `DbMon` to check that the user has been created:

```shell
./gradlew :jvm:alpha-deploy:DbMon #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/using-DbMon.png)

Once you are inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed.

:::info how to run server commands from the command line rather than gradle tasks?
We've been running server commands through the gradle tasks. Alternatively, you can run server commands directly from a command line. 
Open PowerShell (or Windows Command Prompt), access your WSL instance 'TrainingCentOS' and switch to user 'genesis' to have access to the Genesis Platform commands. Example:
```shell
wsl -d TrainingCentOS
su genesis
DbMon
```

During the training we cover some of the most important commands, but feel free to look at the [list of available commands](/managing-applications/operate/on-the-host/helpful-commands/).
:::

Now, let's run Genesis command 'mon' to see if all processes are up and running on the server:

```shell
./gradlew :jvm:alpha-deploy:mon #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/using-mon.png)

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

See [here](/creating-applications/creating-a-new-project/recommended-full-stack-project-setup/configure-deployment-plugin/) for extra details on how to configure the Genesis deploy plugin.



## Testing the backend


There are multiple ways you can test the back end of your application. It's important to note that most resources, such as event handlers and data servers, are exposed as HTTP endpoints automatically by the Genesis Platform - without any additional code. This allows you to test those resources from HTTP clients like Postman or, alternatively, we can use Genesis Console that also gives you a simple way of testing components from a nice web UI.

### Genesis Console
1. In your browser, go to http://genesislcap.com/console/console-next2/.
2. You should enter the IP address of your server, in this case localhost.
3. Log in with your user name and password as [defined previously](/tutorials/training-resources/training-content-day1/#adding-a-user-to-login). This starts Genesis Console, and you will see a list of tabs along the top of the screen.
4. Click on the **RESOURCES** tab.
5. Filter the **Resource type** to show only event handlers.

For example:

![](/img/test-console-eh-filter-alpha.png)

As well as the Event Handlers that you have defined yourself, you will also see other Event Handlers that have been generated automatically by the platform: anything that is a **GENESIS_CLUSTER** service, for example.

If you click on any Event Handler in the list, the fields relevant to the event are displayed to the right.

![](/img/test-console-eh-fields-alpha.png)

Now you need to pick the Event Handler you want to test. So, let's look up EVENT_TRADE_INSERT.

1. Find the Event Handler in the list, then click on the arrow beside it. On the right, this displays the relevant input fields for the event. Some are mandatory, while others are optional - depending on how the event handler was set up.

![](/img/test-console-eh-insert-trade-alpha.png)

2. Enter the details of the new trade in the fields then click on **COMMIT**:

![](/img/test-console-eh-insert-trade-alpha-2.png)

If the Event Handler is working correctly, you will receive an **ACK**.

![](/img/test-console-eh-insert-instrument-ack.png)

#### Checking the insertion
You can go on to check the TRADE table to see if your insert is there.

1. Filter the list of services to show only data servers (these are the components that distribute the data).

2. Search for the relevant resource - in our case TRADE.

![](/img/test-console-eh-confirm-trade-alpha.png)

3. Click on the arrow beside the relevant resource. You should now see the new trade in the list displayed on the right.

![](/img/test-console-eh-confirm-trade-alpha-2.png)

