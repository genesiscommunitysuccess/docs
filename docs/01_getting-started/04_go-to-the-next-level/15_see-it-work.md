---
title: 'See it work'
sidebar_label: 'See it work'
id: see-it-work
---

Now that the back end of our application is built, it's time to deploy it.

The Genesis deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.

### Pre-requisites

You should hava a sub-module called `positions-app-tutorial-deploy` under ../server/jvm.

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

### Deployment of the back end

Now we are going to install the Genesis Platform (i.e. Genesis distribution) on the server and then install the back end of our application on the same server. This is all done using the Genesis deploy plugin that comes with several tasks grouped under `genesisdeploy` and `genesissetup`.

#### Deploying to the server

:::caution
This is one time operation. If this is not the first time following this tutorial skip to the next paragraph.
:::

We will run `setupEnvironment` first (we only need to run it once) to set up the platform on the server. This task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :
```shell
./gradlew :jvm:positions-app-tutorial-deploy:setupEnvironment #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/setup-environment.png)

After this command is completed, we will have a basic genesis server running.

### Deploying the auth module
As our application requires authentication, we have to install the Genesis Auth module.

Usage:
```shell
./gradlew :jvm:positions-app-tutorial-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/install-auth.png)

### Deploying the site-specific
As our application will override the standard definitions using the site-specific folder, we have to run this task.

Usage:
```shell
./gradlew :jvm:positions-app-tutorial-deploy:install-positions-app-tutorial-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip #On the IntelliJ terminal
```

### Deploying the positions-app-tutorial product

Now we have to deploy our application, the positions-app-tutorial product.

Usage:
```shell
./gradlew :jvm:positions-app-tutorial-deploy:deploy-genesisproduct-positions-app-tutorial.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/deploy-alpha-product.png)

:::tip
This will take the last built distribution and does not run a project build as part of the task. Make sure you have already built the project before deploying it.
:::

### Adding a user to login

Next let´s create a user.

:::note
The following details will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

We shall run the task `loadInitialData`. This adds the data in a file called USER.csv to be imported into the USER table in your
database. The USER table, among other users and permissioning tables, is defined by the Genesis Auth module that we installed previously. 

To run the task we will call:

```shell
./gradlew :jvm:positions-app-tutorial-deploy:loadInitialData #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/load-initial-data.png)

Now we are going to use Genesis DbMon to run some queries on the database.


:::info DbMon
DbMon is the Genesis database client. It provides unified interface to the underlying database and hides the details about the database vendor.
:::

Run `DbMon` to check that the user has been created:

```shell
./gradlew :jvm:positions-app-tutorial-deploy:DbMon #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/using-DbMon.png)

Once you are inside the console, type `table USER` and then `search 1`. If imported correctly, the user JaneDee should be listed:
```
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
...
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
DbMon:USER>
```

### Running server commands
:::info can I run server commands from the command line rather than gradle tasks?
Yes. We've been running server commands through the gradle tasks. Alternatively, you can run server commands directly from a command line. 

Assuming you are using the provided 'TrainingCentOS' WSL distribution. Open PowerShell (or Windows Command Prompt), access your WSL instance 'TrainingCentOS' and switch to user 'genesis' to have access to the Genesis Platform commands:
```shell
wsl -d TrainingCentOS
su genesis
DbMon
```

Try it now!

:::

Now, let's run the Genesis command 'mon' to see if all processes are up and running on the server:

```shell
./gradlew :jvm:positions-app-tutorial-deploy:mon #On the IntelliJ terminal
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
664     POSITIONS_APP_TUTORIAL_DATASERVER              11000       RUNNING        58.10     1.50
703     POSITIONS_APP_TUTORIAL_EVENT_HANDLER           11001       RUNNING        71.30     2.20
```

### Testing the back end

There are multiple ways you can test the back end of your application. It's important to note that most resources, such as Event Handlers and Data Servers, are exposed as HTTP endpoints automatically by the Genesis platform - without any additional code. This enables you to test those resources from HTTP clients, such as Postman. Alternatively, you can use Genesis Console, which gives you a simple way of testing components from a nice web UI.

#### Genesis Console
1. In your browser, go to http://genesislcap.com/console/console-next2/.
2. Enter the IP address of your server, in this case localhost.
3. Log in with your user name and password as [defined previously](/getting-started/go-to-the-next-level/see-it-work/#adding-a-user-to-login). This starts Genesis Console, and you will see a list of tabs along the top of the screen.
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
You can go on to check the `TRADE` table to see if your insert is there.

1. Filter the list of services to show only Data Servers (these are the components that distribute the data).

2. Search for the relevant resource - in our case `TRADE`.

![](/img/test-console-eh-confirm-trade-alpha.png)

3. Click on the arrow beside the relevant resource. You should now see the new trade in the list displayed on the right.

![](/img/test-console-eh-confirm-trade-alpha-2.png)

Alternatively you can use `DbMon` similar to the way the `USER` table was queried