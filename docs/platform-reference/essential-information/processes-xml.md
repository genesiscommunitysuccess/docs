---
title: Processes
sidebar_label: Processes
id: processes-xml
sidebar_position: 2

---
Each application must have a *-processes.xml* file. This contains the configuration of each microservice (data server, request server and event-handler etc). Very important commands like startServer, killServer, startProcess and killProcess all refer to the processes.xml file

When you run the command `genesisInstall`, details of all *-processes.xml* files will be aggregated in a single newly-generated processes.xml file in the *generated* folder

Here is an example of a generated processes.xml file for an application that has:

* a data server
* a request server
* an event handler
* a consolidator
* a streamer and streamer-client


```xml
<processes>
  <process name="TRADING_APP_DATASERVER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <script>trading_app-dataserver.kts</script>
    <description>Displays real-time details</description>
    <language>pal</language>
    <classpath>quickfixj-core-*.jar</classpath>
  </process>
  <process name="TRADING_APP_REQUEST_SERVER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-requestserver</module>
    <package>global.genesis.requestreply.pal</package>
    <script>trading_app-reqrep.kts</script>
    <description>Server one-shot requests for details</description>
    <language>pal</language>
  </process>
  <process name="TRADING_APP_EVENT_HANDLER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>trading_app-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>trading_app-messages*,trading_app-eventhandler*</classpath>
    <language>pal</language>
  </process>
  <process name="TRADING_APP_CONSOLIDATOR">
      <groupId>TRADING_APP</groupId>
      <start>true</start>
      <options>-Xmx256m -DRedirectStreamsToLog=true  -DXSD_VALIDATE=false</options>
      <module>consolidator2</module>
      <package>global.genesis.consolidator2</package>
      <config>trading_app-consolidator2.xml</config>
      <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
      <dependency>TRADING_APP_EVENT_HANDLER</dependency>
  </process>
  <process name="TRADING_APP_STREAMER_CLIENT">
      <start>true</start>
      <options>-Xmx128m -DXSD_VALIDATE=false</options>
      <module>genesis-pal-streamerclient</module>
      <package>global.genesis.streamerclient.pal</package>
      <script>trading_app-streamer-client.kts</script>
  </process>
  <process name="TRADING_APP-STREAMER">
      <start>true</start>
      <options>-Xmx128m -DXSD_VALIDATE=false</options>
      <module>genesis-pal-streamer</module>
      <package>global.genesis.streamer.pal</package>
      <script>trading_app-streamer.kts</script>
  </process>
</processes>
```

### Tags

Each tag is explained below.

The `dependency` tag defines the processes that the current process is dependent on. In the above example, the "TRADING_APP_CONSOLIDATOR" process will start when all its dependencies have been started.

The `loggingLevel` tag defines the default log level for the process, which is based on slf4j levels. It also accepts DATADUMP_ON/DATADUMP_OFF to explicitly declare that you would like to log all the received/sent network messages.

The `classpath` tag defines additional jar files that might be needed by the microservices. The jar files declared in this section have to be comma separated and need to exist within a "lib" folder for any of the genesis products in the environment.
You can use wildcards as well like above example for TRADING_APP_DATASERVER

The `start` tag defines whether the process needs to be started when startServer command is executed and whether to show this process in the mon command display. Default value is true

The `options` tag defines JVM arguments

The `package` tag defines which package the process should refer to from framework

The `module` tag defines which module the process should refer to from framework. It refers to a base jar file. In the above example module genesis-pal-eventhandler means look for any jar file with the text genesis-pal-eventhandler and get all the classpath dependencies available for it

The `config` tag defines which config file the process should refer

The `script` tag defines which script file the process should refer

The `language` tag defines what language the script is using. Default value is Groovy. Accepted values are \[pal, groovy, R\]

The `scheduleRestart` tag accepts boolean value if set to true; this indicates that the process must be restarted automatically it dies unexpectedly. Default value is false

The `groupId` tag defines which group the project belongs to. Example: genesis and auth processes belong to GENESIS and AUTH groupId respectively. For any new application, the value for groupId will be **application name**. Commands startGroup and killGroup will use groupId to start/kill groups of processes

The `description` tag describes the process

The `primaryOnly` tag accepts boolean value. Defines which processes are set to run on primary nodes only in a cluster ex: GENESIS_AUTH_CONSOLIDATOR. Default value is false

The `arguments` tag: This helps in hard-coding the process arguments while starting the processes,  since some processes always need arguments on startup