---
title: 'Server tooling - Intellij plugin'
sidebar_label: 'Intellij plugin'
id: intellij-plugin
keywords: [server, tooling, code snippets, intellij, plugin, jetbrains, local]
tags:
  - server
  - tooling
  - code snippets
---

## Prerequisites

 - Genesis Project using server version 6.5.0 or later
 - Gradle project
 - Mono repo (having client and server in the same repository)
 - A database

## Installation

The plugin is available from the [jet brains marketplace](https://plugins.jetbrains.com/plugin/21131-genesis-platform-support). You can install it by searching for **Genesis Platform Support** from the plugin section of your IntelliJ settings.

## The Tools window

### Settings

The first thing to set up is the Genesis system definition overrides. These are needed to provide settings that override values set in your [system definition](/server/configuring-runtime/system-definitions/) configuration.

![Genesis Settings](/img/intellij-settings.png)

### Initial install

When first using the plugin with a project, you must create your genesis home folder; click on the **Install Genesis** button on the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a hidden folder called **.genesis-home** in your project root, ready to run your application's processes.

This may take up to 20 minutes on the first run, because it performs a full build of your application.

### Remap

Before starting the Resource daemon, run a `remap` to write the schema to the database. You can do this from the Genesis icon at the top of the Tool window.

![Genesis Install](/img/intellij-remap.png)

This opens a new Run window in IntelliJ and requires you to confirm the changes by typing **y** and pressing **Return**. 

### Resource daemon

The Resource daemon provides health information about your processes; when running, you will be able to start and stop your processes via the Process view. 

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

To start your Genesis UI, click the Start UI button on the tool bar. This builds your front-end codebase and starts the webpack webserver in development mode. 
Once started, this launches a browser tab showing your application's login screen.

![Debug Window](/img/intellij-ui.png)

### Making a change

If you make a change to the code, you can then build and run again:

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue. 


![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

3. Once the build is successful, you’ll be asked to start the Resource daemon again:

![Genesis Install](/img/intellij-daemon.png)

4. Once the Resource daemon starts, you can start the processes you wish to have running.

## Loading data into the application

Using the plugin, you can right-click on CSV files or folders containing CSV files and select the **Import CSV(s) to Genesis** option.
This takes the csv files and uses the Genesis `SendIt` utility to load the data from the CSV files into tables with matching names.

## Docs navigation

Developers can navigate to **docs.genesis** straight from IntelliJ:

![Genesis Install](/img/intellij-docs.png)

