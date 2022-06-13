---
id: training-content-day1
title: Day 1
sidebar_label: Day 1
sidebar_position: 1

---
In this day we are covering:

- [Quick review of the Platform​](#quick-review-of-the-platform)
- [Setting up Workstation and Environment](#setting-up-workstation-and-environment)
- [Developing your first application​​](#developing-your-first-application)
- [Testing the backend​​](#testing-the-backend)


## Quick review of the Platform

The Genesis low-code platform has a real-time event-driven architecture built with microservices​.


<b>Genesis Low-Code Platform</b>

![](/img/genesis-platform.png)

<b>Server Architecture</b>

![](/img/server-architecture.png)


## Setting up Workstation and Environment

So let's get started by setting up [Workstation](#workstation-setup) and [Environment](#environment-setup).

### Workstation setup

To develop Genesis applications, you need to access on-premise workstations through remote technologies like Citrix, VMware etc.

This page gives you the hardware and software requirements. It also give you instructions on accessing the Genesis repository and configuring the Genesis packages.


#### Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

#### Recommended software packages

| Package	| Minimum Version| 
|--------------|:-----:|
| IntelliJ	| 2021.1.3|
|Visual Studio Code	| 1.52.1|
|Java SDK| 11|
| Putty	| 0.74|
| Chrome | 88.0|
| Maven	| 3.6.3|
| Postman	| 8|
| Gradle  | 6.8|
| NodeJS  |16 LTS+|

You can use a range of IDEs (for example, Eclipse) with the Genesis low-code platform, but only IntelliJ enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

#### Requirements

* NodeJS (16 LTS+) - https://nodejs.org/en/
* npm 8 (installed with NodeJS)

#### .npmrc set-up

For access to Genesis packages, you need to configure the `@genesislcap` scope of `npm` to use our jfrog registry.
You will be provided with access details during your on-boarding.

1. Create an `.npmrc` file in your user home directory.
 2. Using your credentials, log in to the [Genesis repository website](http://genesisglobal.jfrog.io).
 3. Click on the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns. 
 5. Select `npm` for both **Package Type** and **Repository**.
 6. Next, type your password for jfrog in the `Type password to insert your credentials to the code snippets` field. (This is the same password you used to log in to the Genesis repository on jfrog.) Then press **Enter**. 

 ![](/img/set-me-up.png)

 7. Scroll down _inside_ the Set Me Up dialog. At the bottom of the page, you will find a code sample for .npmrc, which contains your scope information, including user name an encrypted password. Copy this and paste it into the file you created in the previous step. For reference, the snippet should look something like this (but **don't** copy the one below - because it contains dummy information!):

```shell
@<SCOPE>:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:_password=AAAbbbCCCdddEEEfffGGGhhhIIIjjj111222333444555666777=
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:username=john.doe
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:email=john.doe@company.com
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:always-auth=true
```

8. Replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

9. Save the file and open a terminal under the directory path of this `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If set-up was successful, you should see a response like this:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```


### Environment setup

Make sure you did the [Workstation setup](#workstation-setup) prior this.

You can install everything you need to run Windows Subsystem for Linux (WSL) by entering this command in an administrator PowerShell or Windows Command Prompt and then restarting your machine.
```
wsl --install
```
Requires Windows 10 version 2004 or higher. More details [here](https://docs.microsoft.com/en-us/windows/wsl/install).

Then download the [training distro](https://netorg209792-my.sharepoint.com/:u:/g/personal/genesis_files_genesis_global/EahiR5AJ7-BKvTzh3TBWmTgBFVCoW6jOG-4dh4vkZFtJtg?e=ehUShp). This distro contains everything you need to start, including: 
CentOS 7 base, Java SDK, genesis user, nginx, postgres.


Now create a local folder where you want to run the distro, e.g., "C:\wsl\distros\". Unzip the package downloaded there and from that folder run:
```
wsl --import TrainingCentOS . training-wsl.backup
```

Validate it running:
```
wsl -d TrainingCentOS
```
Start the required services:
```
nginx
su - postgres
/usr/pgsql-11/bin/postgres &
```

## Developing your first application​​

This will enable you to see the basics of the Genesis low-code platform by building a very simple application. It is designed simply to get from start to finish as quickly as possible. It is in five main steps:

1. [Create a new project](#1-create-a-new-project).
2. [Define the data model](#2-define-the-data-model).
3. [Add business logic](#3-add-business-logic).
4. [Prepare the server and build](#4-prepare-the-server-and-build).
5. [Deployment](#5-deployment)

Before you start, you need to have:

- An IDE (preferably IntelliJ)
- NodeJS (see our [recommended software packages](#requirements) for versioning information)
- Credentials for accessing Genesis Artifactory. If necessary, contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login)
- A gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```
- A local or cloud Linux environment for runtime, which has a user created with the name of the application, e.g. [setup and host on wsl](#environment-setup)

### What you will build

The very simple application you will build will look like this:

- a simple table with 5 fields
- two front-end components: one to display data and one to insert data

That’s it. Just enough to get you up and running. Obviously, there is much more you could do, but that can wait for another day.

With a lack of imagination we hope you will find trustworthy, we are going to call this example application **alpha**. You will see this reflected in the file names throughout.

### 1. Create a new project
The GenX CLI tool enables you to seed projects, in this case we just want to generate a blank full-stack application project.

For step-by-step instructions on how to install and use this tool, follow the guide on [GenX](/creating-applications/creating-a-new-project/recommended-full-stack-project-setup/using-genx/).

Once configured, install genx using the following command:

```shell
npm install -g @genesislcap/foundation-cli
```

Once installed, from the terminal, run:

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
? Genesis Server version 6.0.1
? Genesis Deploy plugin version 6.0.1
? Kotlin version 1.6.10
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```
At this point, the application will be configured. Assuming it is successful, you will see the following text:

```shell
i Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```

### 2. Define the data model
Now you are ready to define the fields and tables that make up your [data model](/creating-applications/defining-your-application/data-model/data-model-overview). This structures information in a simple way that can be viewed by users and processed by the application.

Open Intellij (or your chosen IDE). In the alpha project, you will see the **readme** file for the project. After importing and indexing, you should see the files and project structure ready.

:::caution
Before going to the next step, make sure the `gradle.properties` file from the server/jvm folder is properly set with the following entries:

```properties
genesis-home=<path-to-genesis-distribution>
wsl-distro=<name-of-the-wsl-distro>
wsl-user=<wsl-username>
```

| Entry  |  Description | 
|---|---|
|`genesis-home`|  This is a mandatory property that is a path on the WSL distribution. Example: `/home/alpha/run` |
|`wsl-distro`|  This is a mandatory property that is the name of the WSL distribution. Example: `CentOS7` |
|`wsl-user`|  This is an optional property. If omitted, the default WSL user will be used. Example: `alpha` |

Sample configuration:

```properties
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

:::

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
Finally, you can build the server.

In the Gradle menu on the right of IntelliJ, select **genesis-project-alpha**/**Tasks**/**Build/Assemble**.

![](/img/assemble-server.png)


### 5. Deployment

The Genesis deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.

This guide will show you how to configure the Genesis deploy plugin so you can easily set up a Genesis environment and deploy to it, covering WSL (Windows Subsystem for Linux) configuration.

#### Pre-requisites

If not already in place in your gradle project, add a sub-module called _application_**-deploy**
under _application_**/server/jvm/**

Ensure the **build.gradle.kts** in this sub-module has the following entry

```kotlin
plugins {
    id("global.genesis.deploy") version "6.0.0"
}
```

Ensure the `gradle.properties` file from server/jvm folder is properly configured as explained [here](#2-define-the-data-model)

#### Deploy tasks

The Genesis deploy plugin comes with several tasks. They are grouped under `genesisdeploy` and `genesissetup`.

##### Genesis set-up tasks

| Task  |  Description | 
|---|---|
|`install-genesis-distribution`|  This task copies and unzips the Genesis distribution specified as a dependency. |
|`setupEnvironment`|  This task executes `install-genesis-distribution` and then configures the installed distribution. |

Usage:

```shell
./gradlew setupEnvironment
```

##### Genesis deploy tasks

| Task  |  Description | 
|---|---|
|`deploy-genesisproduct-<project-name>.zip`|  This task deploys the current project to the Genesis environment specified for `genesis-home`. Note that `<project-name>` must be replaced with the actual project name. For example, if the project you work on is called `alpha`, then this task will be `deploy-genesisproduct-alpha.zip` |

Usage:

```shell
./gradlew deploy-alpha-project.zip
```

Note, this will take the last built distribution and does not run a project build as part of the task... **so do it
first**.


## Testing the backend

### Genesis Console
If you use Genesis Console, this gives you a simple way of testing components.

1. In your browser, go to http://genesislcap.com/console/console-next2/.
2. You should enter the IP address of your server, in this case localhost.
3. Log in with your user name and password. This starts Genesis Console, and you will see a list of tabs along the top of the screen.
4. Click on the **RESOURCES** tab.
5. Filter the **Resource type** to show only event handlers.

For example:

![](/img/test-console-eh-filter.png)

As well as the Event Handlers that you have defined yourself, you will also see other Event Handlers that have been generated automatically by the platform: anything that is a **GENESIS_CLUSTER** service, for example.

If you click on any Event Handler in the list, the fields relevant to the event are displayed to the right.

![](/img/test-console-eh-fields.png)

Now you need to pick the Event Handler you want to test. in this example, it is called EVENT_INSTRUMENT_INSERT.

1. Find the Event Handler in the list, then click on the arrow beside it. On the right, this displays the relevant input fields for the event. Some are mandatory, while others are optional - depending on how the event handler was set up.

![](/img/test-console-eh-insert-instrument.png)

2. Enter the details of the new instrument in the field. In our example, we are going to add the spot rate for trading the British Pound against the Euro. The code for this is GBPEUR=.
In the example below, we have added the INSTRUMENT_ID (mandatory), plus the ASSET_CLASS and NAME. Then we click on **COMMIT**:

![](/img/test-console-eh-insert-instrument-2.png)

If the Event Handler is working correctly, you will receive an **ACK**.

![](/img/test-console-eh-insert-instrument-ack.png)

#### Checking the insertion
You can go on to check the INSTRUMENT table to see if your insert is there.

1. Filter the list of services to show only request servers (these are the components that distribute the data).

2. Search for the relevant resource - in our case INSTRUMENT.

![](/img/test-console-eh-confirm-1.png)

3. Click on the arrow beside the relevant resource. You should now see the new instrument in the list displayed on the right.

![](/img/test-console-eh-confirm-2.png)

