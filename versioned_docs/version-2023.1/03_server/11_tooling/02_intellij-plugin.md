---
title: 'Server tooling - Genesis IntelliJ Plugin'
sidebar_label: 'Genesis IntelliJ Plugin'
id: intellij-plugin
keywords: [server, tooling, code snippets, intellij, plugin, jetbrains, local]
tags:
  - server
  - tooling
  - code snippets
  - intellij
  - plugin
---

The Genesis Intellij Plugin enables you to run the full stack of a Genesis application locally within IntelliJ, so you can check and test your development work as you progress.

## Installation

1. The plugin is available from the [Jet Brains Marketplace](https://plugins.jetbrains.com/plugin/21131-genesis-platform-support). You can install it by searching for **Genesis Platform Support** from the plugin section of your [IntelliJ settings](https://www.jetbrains.com/help/idea/managing-plugins.html).

![Installing the plugin](/img/plugin-marketplace.png)

2. After installing the plugin, make sure you add it so that it is visible on the [Tool window bars and buttons](https://www.jetbrains.com/help/idea/tool-windows.html#bars_and_buttons).

:::info
That's the end of the installation process.
If you have come here from the Quick Start guide, [you can **go back now**](../../../getting-started/quick-start/hardware-and-software/#genesis-intellij-plugin).
:::

## How to use the Genesis IntelliJ Plugin

To run a development application locally using the plugin, you must have:

### Project requirements

- a Genesis project where your front-end and back end are being developed
- a Gradle project
- a mono repo (the client and server must be in the same repository)

### Local requirements

- a [Database Technology supported by Genesis](../../../database/database-technology/overview/) available and running

:::tip
You could use, for example, [PostgreSQL](../../../database/database-technology/sql/#postgresql) running a local instance or a [Docker container](https://hub.docker.com/_/postgres).

```terminal
docker ps --format '{{ .ID }}\t{{.Image}}\t{{ .Names }}'
docker pull postgres
docker run --name localPostgresDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres postgres -c 'max_connections=100'
```
:::

## The Tools window

### Setting the overrides

To run locally, you need to override the values set in your [system definition](/server/configuring-runtime/system-definitions/) configuration (which contain a url for the host).

With the Genesis IntelliJ Plugin, system definitions can be overriden via the plugin settings.
When editing plugin settings you do not need to redeploy, unlike editing **\*-system-definitions.kts** files.

![Open Settings](/img/plugin-settings.png)

![Genesis Settings](/img/plugin-settings-full.png)

:::tip
A local PostgreSQL installation with user and password both equal to `postgres` would have a **DbHost** like this:

```kotlin
jdbc:postgresql://localhost:5432/postgres?user=postgres&password=postgres
```

:::

### Setting up genesis.home

When first using the plugin with a project, you must create your genesis home folder; click on the **Install Genesis** button in the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a folder called **.genesis-home** in your local project's root directory, ready to run your application's processes.

This may take up to 20 minutes on the first run, because it performs a full build of your application.

### Remap

Before starting the Resource Daemon, run a `remap` to write the schema to the database. You can do this from the Genesis icon at the top of the Tool window.

![Genesis Install](/img/intellij-remap.png)

This opens a new Run window in IntelliJ and requires you to confirm the changes by typing **y** and pressing **Return**.

### Resource Daemon

The Resource Daemon provides health information about your processes; it enables you to start and stop your processes via the Process view.

To start the Resource daemon, press the **Start Resource Daemon** button.

Alternatively, if using the **startServer** button to start all your processes at once, the Resource Daemon will be started for you.

![Genesis Install](/img/plugin-resourcedaemon.png)

Once the resource daemon has started, you should see a list of your processes along with the status of each one.

### Starting processes

To start a process, click the **Start** button displayed for that process.

You can also start all your processes at once using the **startServer** button in the tool window.

![Start Server](/img/plugin-startserver.png)

![Application Processes](/img/plugin-processes.png)

:::tip
Starting all processes at once in large projects can take some time. By default, this opens a run window for each process.
To clean up the UI, use the **Services** window for better organisation (only available in IntelliJ Ultimate Edition).
:::

![Services Window](/img/plugin-services.png)

### Using the terminal

Every process and script that you can run via the UI can also be run via the IntelliJ terminal window.
Recognised commands are highlighted in green and can be run by pressing **Ctrl** + **Enter**.

![Start all processes from the terminal](/img/plugin-terminal-1.png)

When you run commands from the terminal you can include arguments, which is easier than editing the run configs to add them.

![Process with arguments](/img/plugin-terminal-2.png)

Although these commands are entered in the terminal, when they are executed they open up the relevant window in your IDE, the same as when running via the UI.

For ease of use, some commands that are not strictly processes or scripts have been added:

- `startServer` starts all your registered processes (as well as the Resource Daemon), as you would when running in a Unix based environment.
- `killServer` stops all running processes (this also includes the Resource Daemon).
- `startProcess` can be used for familiarity, but note that the process name itself is also a valid command e.g. `MY-APP-CONSOLIDATOR --coldStart`.
- `killProcess` stops an individual process.

Note: As with other plugin features, terminal commands are not available until indexing has been completed.

### Log files

When starting services, the log file is automatically attached to the run or debug window.

The window has two tabs:

- console output
- the log file for the process

The log file view defaults to show only warnings. You can change the level from the drop-down on the right of this screen. 

![Log Window](/img/plugin-logs.png)

### Log level

Currently, the plugin will not pick up `<loggingLevel>` entries in **processes.xml** files.
To set the log level for a process, use the [LogLevel script](/operations/commands/server-commands/#loglevel-script)

### Chronicle files

:::tip
On Windows, set `LSOF_AVAILABLE` to `false` in order
for the Chronicle queue files to be properly cleaned up.
:::

### Debug

It’s possible to debug ‘normal’ code using the **debug** option from the generated run configurations.

### Starting the UI

To start your Genesis UI, click the **Start UI** button on the tool bar. This builds your front-end codebase and starts the webpack webserver in development mode. 
Once this has started, it launches a browser tab showing your application's login screen.

![Debug Window](/img/intellij-ui.png)

:::info
Note that we are using [GENESIS_ROUTER](../../../server/configuring-runtime/genesis-router/) as our API_HOST; its default port is 9064. Therefore, your router port in the settings should be as below.

![Router Settings](/img/plugin-router.png)
:::

### Making a change

When changing files related to a certain process, there is no need to redeploy the entire application.
When you restart a process, the modules relating to the process will be rebuilt and re-deployed automatically.

For wider-reaching changes, such as changing dependencies, you need to redeploy the application.

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Redeploying the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue.

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

3. Once the redeployment has been completed, you are asked to start the Resource daemon again:

![Genesis Install](/img/plugin-resourcedaemon.png)

4. Once the Resource daemon has started, you can start the processes you wish to have running.

## Loading data into the application

Using the plugin, you can right-click on CSV files or folders containing CSV files and select the **Import CSV(s) to Genesis** option.
This takes the CSV files and uses the Genesis `SendIt` utility to load the data from those files into tables with matching names.

## Tasks view

Apart from the **Mon** view, there is the **Tasks** view, where it is possible to see, run and modify the configurations of Genesis services, scripts, and setup.

![Task view](/img/plugin-tasks.png)

### Running a Genesis script

The preferred way of running a script is via the IntelliJ terminal window; any script visible in the view can be run via the terminal and arguments can be applied easily.

![Running a script](/img/plugin-terminal-3.png)

Once a script has been run, the passed arguments will be saved in the run config for the script until new arguments are passed.
To run a script with the same arguments, just re-run the run config.

Alternatively, open the folder **Scripts**, find the one you want to run, right-click on it and select **Run**.

![Task view](/img/plugin-tasks-droptable.png)

The example above runs the [DropTable](../../../operations/commands/server-commands/#droptable) script. This has parameters, so make sure you configure them using the **"Modify Run Configuration..."** option, setting the *Args* property.

## Access to the docs

You obviously have access to the documentation, because you are reading it right now. But it is worth noting that there is a link from the **Tools** menu in IntelliJ that opens the documentation: 

![Genesis Install](/img/plugin-docs.png)
