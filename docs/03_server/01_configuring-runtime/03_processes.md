---
title: 'Server configuration - processes'
sidebar_label: 'Processes'
id: processes
keywords: [server, configuration, processes]
tags:
  - server
  - configuration
  - processes
---

Your application must have a **-processes.xml** file. This contains the configuration of each module in the application (Data Server, Request Server, Event Handler, etc). It is created automatically when you start a new Genesis project using  [GenX CLI tool](../../../getting-started/quick-start/create-a-new-project/), but you might well want to update it - and you certainly want to take a good look at it.

Every process (module) in your application needs to have an entry in this **-processes.xml** file. If you add a new process, then you must add its details to this file. Otherwise, it will simply not be part of the built application.

## The generated file
When you run the command `genesisInstall`, the platform takes your **processes.xml** file and adds details from internal Genesis files (for example, **auth-processes.xml**) to create a new **processes.xml** file in the **generated** folder.

It is the version in the **generated** folder that the platform uses to control its actions (such as executing a **startServer**, or a  **killProcess** command). So, if you make any changes to your **process.xml**, make sure you run `genesisInstall` afterwards.

Below is an example of a generated **processes.xml** file for an application that has:

* a Data Server
* a Request Server
* an Event Handler
* a Consolidator
* a Streamer and Streamer Client

You can see that this file has separate code blocks for each of the application's processes. Each code block has tags that define the characteristics of the process.

```xml
<processes>
  <process name="POSITION_APP_DATASERVER">
    <groupId>POSITION_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <script>position_app-dataserver.kts</script>
    <description>Displays real-time details</description>
    <language>pal</language>
    <classpath>quickfixj-core-*.jar</classpath>
  </process>
  <process name="POSITION_APP_REQUEST_SERVER">
    <groupId>POSITION_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-requestserver</module>
    <package>global.genesis.requestreply.pal</package>
    <script>position_app-reqrep.kts</script>
    <description>Server one-shot requests for details</description>
    <language>pal</language>
  </process>
  <process name="POSITION_APP_EVENT_HANDLER">
    <groupId>POSITION_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>position_app-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>position_app-messages*,position_app-eventhandler*</classpath>
    <language>pal</language>
  </process>
  <process name="POSITION_APP_CONSOLIDATOR">
      <groupId>POSITION_APP</groupId>
      <start>true</start>
      <options>-Xmx256m -DRedirectStreamsToLog=true  -DXSD_VALIDATE=false</options>
      <module>consolidator2</module>
      <package>global.genesis.consolidator2</package>
      <config>position_app-consolidator2.xml</config>
      <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
      <dependency>POSITION_APP_EVENT_HANDLER</dependency>
  </process>
  <process name="POSITION_APP_STREAMER_CLIENT">
      <start>true</start>
      <options>-Xmx128m -DXSD_VALIDATE=false</options>
      <module>genesis-pal-streamerclient</module>
      <package>global.genesis.streamerclient.pal</package>
      <script>position_app-streamer-client.kts</script>
  </process>
  <process name="POSITION_APP_STREAMER">
      <start>true</start>
      <options>-Xmx128m -DXSD_VALIDATE=false</options>
      <module>genesis-pal-streamer</module>
      <package>global.genesis.streamer.pal</package>
      <script>position_app-streamer.kts</script>
      <configOverridesFile>/home/genesis/appstreamer.properties</configOverridesFile>
  </process>
</processes>
```

## Tags

For each process, the tags define key information. Let's look at the tags that are available.

| Tag             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      | Optional | Default          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|------------------|
| dependency      | Defines a comma-separated list of processes that the current process is dependent on. In the above example, the **POSITION_APP_CONSOLIDATOR** process will only start once the **POSITION_APP_EVENT_HANDLER** process is running.                                                                                                                                                                                                                | Yes      | None             |
| loggingLevel    | Defines the default log level for the process, which is based on [slf4j](http://www.slf4j.org/) levels. It also accepts DATADUMP_ON/DATADUMP_OFF to declare that you would like to log all the received/sent network messages.                                                                                                                                                                                                                   | Yes      | None             |
| classpath       | Defines additional jar files that are needed by the microservices. The filenames must be provided in a comma-separated list; all files in the list must be located in a **lib** or **bin** folder for the relevant Genesis microservice (module). You can use wild cards in your specification. This can be seen in the **classpath** for the **POSITION_APP_DATASERVER** and **POSITION_APP_EVENT_HANDLER** configuration in the example above. | Yes      | None             |
| start           | Defines whether the process needs to be started when the startServer command is executed, and whether to show this process in the mon command display.                                                                                                                                                                                                                                                                                           | Yes      | `true`           |
| options         | Defines any JVM arguments that you want to apply when running the process.                                                                                                                                                                                                                                                                                                                                                                       | Yes      | None             |
| package         | Defines the package the process should refer to. All Genesis source code is contained in packages. So, in the example above, the configuration for the **POSITION_APP_STREAMER** process points to the source code in the package **global.genesis.streamer.pal**. Multiple package scans need to be comma-separated.                                                                                                                            | No       | None             |
| module          | Defines where in the package (see above) the process should look for its binaries - base jar files. In the above example, the configuration of the **POSITION_APP_EVENT_HANDLER** has a `module` tag that points to **genesis-pal-eventhandler**.  This finds every jar file with the text **genesis-pal-eventhandler** and gets all the relevant classpath dependencies.                                                                        | No       | None             |
| config          | If the process has [a **process-config.kts** file](../../../server/configuring-runtime/cache/), you must specify it using this tag.                                                                                                                                                                                                                                                                                                              | No       | None             |
| language        | Defines what language the script is using. The default value is groovy. Accepted values are `pal`, `groovy`, `R`.                                                                                                                                                                                                                                                                                                                                | No       | None             |
| scheduleRestart | Controls what the platform does if the process dies unexpectedly. This must be a boolean value; if set to `true`; the process will be restarted automatically.                                                                                                                                                                                                                                                                                   | Yes      | `false`          |
| groupId         | If you have created groups of processes, use this tag to specify which **groupID** the process belongs to. See below for more details.                                                                                                                                                                                                                                                                                                           | Yes      | *application name* |
| description     | Provides a simple description of the process.                                                                                                                                                                                                                                                                                                                                                                                                    | No       | None             |
| primaryOnly     | Specifies that the process can only run on the primary node in a cluster. It requires a boolean value: `true` or `false`.                                                                                                                                                                                                                                                                                                                        | Yes      | `false`          |
| arguments       | Some processes always need arguments on start-up. Use this tag to specify a file with the relevant arguments. This file overrides any relevant settings on the system-definitions file.                                                                                                                                                                                                                                                          | Yes      | None             |


### Process groups
Groups give you a convenient way of starting multiple processes on the server with a single click. The commands **startGroup** and **killGroup** use the `groupId` to start or kill groups of processes. 

By default, all your main processes (such as Event Handler, Data Server and Request Server) are given a `groupID` that matches your application name. That means that they all belong to the same group by default.

All authorisation processes are grouped into a single group with the `groupID` AUTH.

To create a new group, simply change the `groupID` of the processes that you want to be in the group. For example, if you want to group your Data Server and Request Server in a group called DATA, just change the `groupID` for those processes to DATA.
