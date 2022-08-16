---
title: 'Create a Low-Code application'
sidebar_label: 'Create a Low-Code application'
id: create-low-code-application
---

This short guide will enable you to build a very simple application using Genesis platform DSL (domain specific language).

The exercise is in the following steps:

1. [Create a new project](#1-create-a-new-project).
2. [Prepare the user interface](#2-prepare-the-user-interface).
3. [Prepare the server](#3-prepare-the-server).
4. [Start the server](#4-start-the-server).
5. [Create the application](#5-create-the-application).

## Prerequisites

Before you start, you need to have:

- An IDE (preferably IntelliJ)
- NodeJS version 16 or later (see our [recommended software packages](/low-code/prerequisites/hardware-and-software/) for versioning information)
- Credentials for accessing Genesis Artifactory. If necessary, contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login)
- A gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```

- [.npmrc file configured to access Genesis packages](/low-code/prerequisites/hardware-and-software/#npmrc-set-up)
- A local or cloud Linux environment for runtime, which has a user created with the name of the application, e.g. [setup and host on WSL](/low-code/prerequisites/do-you-need-wsl/#setting-up)
- Foundation DB must be running on this environment

## What you will build

The very simple application will look like this:

- a simple table
- two front-end components: one to display data and one to insert data

We are going to call this example application **alpha**. You will see this reflected in the file names throughout.

## 1. Create a new project

The GenX CLI tool enables you to seed projects, in this case we want to generate a blank DSL application project.

Install it using the following command:

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@2.0.1-alpha-91bcdf7.0+91bcdf7
```

Once installed, from the terminal, run:

```shell
foundation-cli
```

Provide Artifactory credentials if needed. We persist an authentication token, so you don't have to enter your username/password each time.
Once your session expires, we ask for the password again.

```shell
? Genesis Username example.username
? Genesis Password **************
√ Logged into Genesis
```

Select `create Low-Code application`:

```shell
? Please select an option: (Use arrow keys)
> create Low-Code application - Creates a Low-Code application.
  create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
  create application - Generates a local application.
  configure application - Configure a local app.
```

Now you can proceed using the following responses:

```shell
? Create a app in current directory Yes
? App name alpha
```

After you will be asked whether you want to overwrite existing files.

```shell
? Overwrite existing files (y/N)
```

At this point, the seed application is created and dependencies are installed.

```shell
? Overwrite existing files Yes
✔ Create path alpha
✔ Create directory alpha
✔ Creating from seed 'Low-code Application Seed'
ℹ Installing dependencies.
✔ Install success.
```

We can now configure the application starting with NPM module settings:

```shell
? NPM package scope (genesislcap)
? NPM package name (alpha)
```

Next, you will be asked whether you want to configure an API host. By default web frontend will attempt to connect to your local server. If you want to connect to a remote server instead, choose Yes and specify WebSocket URL.

```shell
? (Optional) Override the default API Host URL (N/y)
```

Continue with the remaining questions:

```shell
? Genesis Server version
? Auth Server version
? GPL version
? Kotlin version
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```

At this point, the application will be configured. Assuming it is successful, you will see the following text:

```shell
✔ Configuring Seed
✔ Writing environment variables
ℹ Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```

Open Intellij (or your chosen IDE). In the alpha project, you will see the **readme** file for the project. After importing and indexing, your local environment is ready to build the application

## 2. Prepare the user interface

### Running the front end

Let's install front-end dependencies:

```sh
./gradlew :npmBootstrap
```

Next, let's start code generation service. It will run in the background while we are building our application.

```sh
./gradlew :generateIR -t
```

In another terminal window, let's start a local Web server:

```sh
./gradlew :npmStart
```

Once you see a message similar to `INFO: Accepting connections at http://localhost:3000` open the displayed URL and you should see the following:

![](/img/gpl-seed-start.png)

### Application title

Let's open **src/main/kotlin/global/genesis/alpha/Application.kt** and customise the auto-generated application title:

```kotlin
ui("Alpha Trading Dashboard") {
    page("Home") {
        heading("Hello World")
    }
}
```

It is useful to have the code generation terminal visible - you will see when your changes have been processed:

```shell
BUILD SUCCESSFUL in 754ms
6 actionable tasks: 6 up-to-date

Waiting for changes to input files of tasks... (ctrl-d to exit)
<=============> 100% EXECUTING [54m]
> IDLE

```

You should now see the updated application title:

![](/img/gpl-seed-title.png)

## 3. Prepare the server

Now we will generate the server configuration by running the below task:

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

This task generates both the server and UI configuration. We will use it again later when we create our application.

## 4. Start the server

Before you start this, make sure that:

- you have a user with name of the application (alpha)
- Foundation DB is running (if it is not, run `systemctl start foundationdb` from Centos07

If that's OK, you can deploy the server.

### Deploying to the server

First, we need to configure our genesis home, distribution and user. We will do that by adding the following fields to the **gradle.properties** file.

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

We will run `setupEnvironment` - this task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :

```shell
./gradlew :alpha-deploy:setupEnvironment #On the IntelliJ terminal
```

After this command is completed we will have a basic genesis server running

### Deploying the auth module

Usage:

```shell
./gradlew :alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

### Building the alpha product

Build the alpha product

Usage:

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploying the alpha product

Now we have to deploy the alpha product

Usage:

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

### Adding a user to login

Next let´s create a user.

:::tip
The following details will be your login details:

- Username: JaneDee
- Password: beONneON\*74 (This is encrypted in the USER.csv file.)
  :::

We shall run the task `loadInitialData`. This adds the data in USER.csv to the USER table in your
database. To do that we will call

```shell
./gradlew :alpha-deploy:loadInitialData #On the IntelliJ terminal
```

Now run `DbMon` to check that the user has been created:

```shell
./gradlew :alpha-deploy:DbMon #On the IntelliJ terminal
```

Once you are inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed.

After running

```shell
./gradlew :alpha-deploy:mon #On the IntelliJ terminal
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

See [here](https://docs.genesis.global/secure/creating-applications/creating-a-new-project/recommended-full-stack-project-setup/configure-deployment-plugin/) for extra details on how to configure the Genesis deploy plugin.

### Connecting the back end and front end

With this next step, we will configure an nginx working as a reverse proxy.

In your CentOS terminal, enter:

```shell
docker login genesisglobal-docker-internal.jfrog.io
...

You need to enter your artifactory credentials at this point

The enter
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

You can run this command from within WSL or from your workstation. If you run it from the CentOS shell, you can use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

## 5. Create the application

### Authentication

Currently, all our pages are public. We can protect pages with sensitive data by enabling the login service:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        heading("Hello World")
    }
}
```

You should now see a login screen:

![](/img/gpl-seed-login.png)

Note: If the login button is not clickable, Web client was not able to connect to the Genesis API Host. You can confirm whether it's trying to connect to correct URL in browser console:

![](/img/gpl-seed-host.png)

### Add model

Now you are ready to define the fields and tables that make up your [data model](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/data-model-overview/). This structures information in a simple way that can be viewed by users and processed by the application.

Let's create a new package **model** in **src/main/kotlin/global/genesis/alpha** and add a file called **Trade.kt** with the following contents:

```kotlin
import global.genesis.gpl.api.schema.Persist
import global.genesis.gpl.api.schema.Table

@Persist
object TRADE : Table(11_000) {
    val tradeId by varchar().nonNullable().generated()
    val instrumentId by varchar().nonNullable()
    val side by enum(Side.BUY)
    val price by double().nonNullable()
    val quantity by integer().nonNullable()
    val tradeDateTime by now().immutable()
    val enteredBy by username().immutable()
    val modifyTime by now()
    val tradeStatus by enum(TradeStatus.NEW)

    override val primaryKey by primaryKey(tradeId)
}

enum class Side { BUY, SELL }
enum class TradeStatus { NEW, ALLOCATED, CANCELLED }
```

:::tip

Once the project is open, there are two easy ways to find this file quickly in Intellij:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::

### Grid

Next, let's add a grid to display the trades. We do this by passing **TRADE** model to `entityManager`:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        entityManager(TRADE)
    }
}
```

Adding an `entityManager` results in having additional server resources generated to supply the grid with data.

To update the server we run the following tasks:

### Generate server configuration

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build the alpha product

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy the alpha product

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

You will then see a grid on the UI.

![](/img/gpl-seed-grid.png)

### Form

Grid title matches model name by default - let's customise it and set to `Trades` instead.

Finally, let's allow users to submit new trades - this is done by enabling `EntityOperations.ADD` operation:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        entityManager(
            entity = TRADE, 
            title = "Trades", 
            operations = listOf(EntityOperations.ADD),
        )
    }
}
```

We again repeat the steps to update the server:

### Generate server configuration

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build the alpha product

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy the alpha product

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

If you click the **Add** button, you will see a form displayed in a modal:

![](/img/gpl-seed-form.png)

## Conclusion

That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

There's obviously a lot more to building enterprise-ready applications. We suggest you read through [Defining your application](https://docs.genesis.global/secure/creating-applications/defining-your-application/intro/) for details of all the Genesis components and their features.
