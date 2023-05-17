---
title: 'Server tooling - Intellij plugin'
sidebar_label: 'Intellij plugin'
id: intellij-plugin
keywords: [server, tooling, code snippets, intellij, plugin, jetbrains, local]
tags:
  - server
  - tooling
  - code snippets
  - intellij
  - plugin  
---

The Genesis Intellij plugin enables you to run the full stack of a Genesis application locally within IntelliJ, so you can check and test your development work as you develop.


## Installation

1. The plugin is available from the [jet brains marketplace](https://plugins.jetbrains.com/plugin/21131-genesis-platform-support). You can install it by searching for **Genesis Platform Support** from the plugin section of your [IntelliJ settings](https://www.jetbrains.com/help/idea/managing-plugins.html).

2. After installing the plugin, make sure you add it so that it is visible on the [Tool window bars and buttons](https://www.jetbrains.com/help/idea/tool-windows.html#bars_and_buttons).

![Genesis Platform Support on Tool window](/img/genesis-plugin-intellij-toolwindow.png)

:::info
That's the end of the installation process.
If you have come here from the Quick Start guide, [you can **go back now**](../../../getting-started/quick-start/hardware-and-software/#genesis-intellij-plugin).
:::

## Running a Genesis application locally

To run a development application locally using the plugin, you must have:

**Project requirements**
- a Genesis project where your front end and back end are being developed
- a Gradle project
- a mono repo (the client and server must be in the same repository)

**Local requirements**
- a [Database Technology supported by Genesis](../../../database/database-technology/overview/) available and running

:::tip
You could use, for instance, [PostgreSQL](../../../database/database-technology/sql/#postgresql) running a local instance or a [Docker container](https://hub.docker.com/_/postgres).

```terminal
docker ps --format '{{ .ID }}\t{{.Image}}\t{{ .Names }}'
docker pull postgres
docker run --name localPostgresDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres postgres -c 'max_connections=10000'
```
:::

## The Tools window

### Setting the overrides

To run locally, you need to override the values set in your [system definition](/server/configuring-runtime/system-definitions/) configuration (which contain a url for the host).

![Genesis Settings](/img/intellij-settings.png)

:::tip
A local PostgreSQL installation with user and password both equal to `postgres` would have a **DbHost** like this:
```kotlin
jdbc:postgresql://localhost:5432/postgres?user=postgres&password=postgres
```
:::

### Setting up genesis.home

When first using the plugin with a project, you must create your genesis home folder; click on the **Install Genesis** button on the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a hidden folder called **.genesis-home** in your project root, ready to run your application's processes.

This may take up to 20 minutes on the first run, because it performs a full build of your application.

### Remap

Before starting the Resource daemon, run a `remap` to write the schema to the database. You can do this from the Genesis icon at the top of the Tool window.

![Genesis Install](/img/intellij-remap.png)

This opens a new Run window in IntelliJ and requires you to confirm the changes by typing **y** and pressing **Return**. 

### Resource daemon

The Resource daemon provides health information about your processes; it enables you to start and stop your processes via the Process view. 

To start the Resource daemon, press the **Start Resource Daemon** button. 

![Genesis Install](/img/intellij-daemon.png)

Once the resource daemon has started, you should see a list of your processes along with the status of each one.

### Starting processes

To start a process, click the **Start** button displayed for that process.

![Application Processes](/img/intellij-processes.png)

**Log Files**

When starting services, the log file will be automatically attached to the run or debug window.

The window has two tabs:

- console output
- the log file for the process

The log file view defaults to show only warnings. You can change the level from the dropdown on the right of this screen. 

![Debug Window](/img/intellij-debug.png)

**Debug**

It’s possible to debug ‘normal’ code using the **debug** option from the generated run configurations.

### Starting the UI

To start your Genesis UI, click the **Start UI** button on the tool bar. This builds your front-end codebase and starts the webpack webserver in development mode. 
Once started, this launches a browser tab showing your application's login screen.

![Debug Window](/img/intellij-ui.png)

:::info
Please note we are using [GENESIS_ROUTER](../../../server/configuring-runtime/genesis-router/) as our API_HOST and its default port is 9064. Therefore, your API_HOST parameter in **client/web/package.json** should be set as below.

```json {4}
{
  ...
  "config": {
    "API_HOST": "ws://localhost:9064",
    ...
  }
  ...
}
```
:::


### Making a change

If you make a change to the code, you can then build and run again:

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Redeploying the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue. 


![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

3. Once the redeployment has been completed, you are asked to start the Resource daemon again:

![Genesis Install](/img/intellij-daemon.png)

4. Once the Resource daemon starts, you can start the processes you wish to have running.

## Loading data into the application

Using the plugin, you can right-click on CSV files or folders containing CSV files and select the **Import CSV(s) to Genesis** option.
This takes the CSV files and uses the Genesis `SendIt` utility to load the data from those files into tables with matching names.

## Tasks view

Apart from the **Mon** view, there is the **Tasks** view, where it is possible to see, run and modify the configurations of Genesis services, scripts, and setup.

![Task view](/img/genesis-plugin-task-view.png)

### Running a Genesis script

To run a Genesis script, open the folder **Scripts**, find the one you want to run, right-click on it and select **Run**.

![Task view](/img/genesis-plugin-task-view-droptable.png)

The example above runs the [DropTable](../../../operations/commands/server-commands/#droptable) script. This has parameters, so make sure you configure them using the **"Modify Run Configuration..."** option setting the *Args* property.

## Access to the docs

You obviously have access to the documentation, because you are reading it right now. But it is worth noting that there is a link from the **Tools** menu in IntelliJ that opens the documentation: 

![Genesis Install](/img/intellij-docs.png)

