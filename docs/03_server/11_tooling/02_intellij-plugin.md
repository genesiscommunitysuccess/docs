---
title: 'Server Tooling - Intellij Plugin'
sidebar_label: 'Intellij Plugin'
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

The plugin is available from the [jet brains marketplace](https://plugins.jetbrains.com/plugin/21131-genesis-platform-support) and can be installed by searching for "Genesis Platform Support" from the plugin section of your IntelliJ settings.

## The Tools Window

### Settings

The first thing to set up is the genesis system definition overrides, this will be needed to these settings will override values set in your [system definition](/server/configuring-runtime/system-definitions/) configuration

![Genesis Settings](/img/intellij-settings.png)

### Initial Install

When first using the plugin with a project you will need to create your genesis home folder, by clicking the “Install Genesis” button on the tool window.

![Genesis Install](/img/intellij-install.png)

This will generate a hidden folder called .genesis-home in your project root, ready to run your applications processes.

This may take up to 20 minutes on the first run due to needing to perform a full build of your application.

### Remap

Before starting the resource daemon you’ll need to run a remap to write the schema to the database, this can be done from the genesis icon at the top of the tool window.

![Genesis Install](/img/intellij-remap.png)

This will open a new run window in IntelliJ and will require you to confirm the changes by typing ‘y’ and pressing return. 

### Resource Daemon

Resource daemon will provide health information about your processes and when running you will be able to start and stop your processes via the process view. 

To start the resource daemon press the “Start Resource Daemon” button 

![Genesis Install](/img/intellij-daemon.png)

Once the resource daemon has started you should see a list of your processes along with their statuses.

### Starting processes

To start a processes click the start button on the processes row

![Application Processes](/img/intellij-processes.png)

**Log Files**

When starting services, the log file will be automatically attached to the run or debug window.
The window has two tabs one for the console output and the second one will show you the content of the process's log file.
Note the log file view will defaul to only showing warnings, the level can by changed from the dropdown to the right hand side of this screen. 

![Debug Window](/img/intellij-debug.png)

**Debug**

It’s possible to debug ‘normal’ code by using the debug option from the generated run configurations.

### Starting the UI

To start your genesis UI press the Start UI button on the tool bar, this will build your frontend codebase and start the webpack webserver in development mode. 
Once started this should launch a browser tab open at your applicaitons login screen.

![Debug Window](/img/intellij-ui.png)

### Making a change

To build and run code following making a change you can follow these steps.

First, click the “Deploy Genesis” button in the tool bar.

![Deploy](/img/intellij-deploy1.png)

Rebuilding the application requires the genesis processes to be stopped, you’ll be prompted for this, press ok to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This will start the build processes and logs will be shown below

![Deploy logs](/img/intellij-deploy3.png)

Once the build is successful you’ll be asked to start the resource daemon again

![Genesis Install](/img/intellij-daemon.png)

Once resource daemon starts up you can start the processes you wish to have running

## Loading data in to your genesis application

Using the plugin you're able to right click on CSV files or folders containing CSV files and select the "Import CSV(s) to Genesis" option.
This will take the csv files and using the Genesis SentIt utility attempt to load the data from the CSV files in to tables with matching names.

## Docs navigation

Developers can navigate to docs.genesis straight from IntelliJ:

![Genesis Install](/img/intellij-docs.png)

