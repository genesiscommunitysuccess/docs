---
title: Processes
sidebar_label: Processes
id: processes-xml
sidebar_position: 2

---
Each application must have a **-processes.xml** file. This contains the configuration of each microservice (data server, request server and event-handler etc). It is generated automatically when you [create a new Genesis project using maven](/creating-applications/creating-a-new-project/server-project-setup/).

If you add new processes, you need to add their details to the _application_**-processes.xml** file

When you run the command `genesisInstall`, the details of this file are aggregated along with details from internal Genesis files (for example, **auth-processes.xml**) into a single newly-generated **processes.xml** file in the **generated** folder.

Very important commands like **startServer**, **killServer**, **startProcess** and **killProcess** all refer to the generated file to check which processes they need to act on.


Here is an example of a generated processes.xml file for an application that has:

* a data server
* a request server
* an event handler
* a consolidator
* a streamer and streamer-client

You can see that this file has separate code blocks for each of the application's processes. Each code block has tags that define the characteristics of the process.

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
  <process name="TRADING_APP_STREAMER">
      <start>true</start>
      <options>-Xmx128m -DXSD_VALIDATE=false</options>
      <module>genesis-pal-streamer</module>
      <package>global.genesis.streamer.pal</package>
      <script>trading_app-streamer.kts</script>
  </process>
</processes>
```

## Tags

For each process, the tags define key information. Let's look at the tags that are available.


### dependency

This tag defines the processes that the current process is dependent on. In the above example, the **TRADING_APP_CONSOLIDATOR** process will only start once the **TRADING_APP_EVENT_HANDLER** process is running. 

When you are defining the process in your application's **process.xml**, this tag is optional.

### loggingLevel

This tag defines the default log level for the process, which is based on [slf4j](http://www.slf4j.org/) levels. It also accepts DATADUMP_ON/DATADUMP_OFF to explicitly declare that you would like to log all the received/sent network messages.

When you are defining the process in your application's **process.xml**, this tag is optional.

### classpath 

This tag defines additional jar files that might be needed by the microservices. The jar files declared in this section have to be comma-separated and need to exist within a "lib" folder for any of the genesis products in the environment.

You can use wild cards in your specification. This can be seen in the **classpath** for the **TRADING_APP_DATASERVER** configuration in the example above.

When you are defining the process in your application's **process.xml**, this tag is optional.
### start

This tag defines whether the process needs to be started when startServer command is executed and whether to show this process in the mon command display. Default value is true

### options

This tag defines JVM arguments.

When you are defining the process in your application's **process.xml**, this tag is optional.

### package

This tag defines which package the process should refer to. All Genesis source code is contained in packages. So, in the example above, the configuration for the **TRADING_APP_STREAMER** process points to the source code in the package **global.genesis.streamer.pal**.

### module
This tag defines where in the package (see above) the process should look for its binaries - base jar files. In the above example, the configuration of the **TRADING_APP_EVENT_HANDLER** has a **module** tag that points to **genesis-pal-eventhandler**.  This finds every jar file with the text **genesis-pal-eventhandler** and gets all the relevant classpath dependencies.

When you are defining the process in your application's **process.xml**, this tag is mandatory.

### config

This tag defines which config file the process should refer to.

When you are defining the process in your application's **process.xml**, this tag is mandatory for some services.

### script

This tag defines which script file the process should refer to. 

When you are defining the process in its **process.xml**, if the process uses scripts, then you have to specify the script file using this tag. In the example above, the **TRADING_APP_REQEST_SERVER** has a script tag identifying **trading_app-reqrep.kts**, which is where the configuration of the request server exists. If you are not using scripts for the process, then this tag is not needed.

### language

This tag defines what language the script is using. The default value is Groovy. Accepted values are \[pal, groovy, R\].

When you are defining the process in your application's **process.xml**, this tag is mandatory if you have specified a script file.


### scheduleRestart

This tag requires a boolean value. It controls what the platform does if the process dies unexpectedly. If set to **true**; the process will be restarted automatically. The default value is **false**.

When you are defining the process in your application's **process.xml**, this tag is optional.

### groupId

Use this tag if you want to make the process part of a pre-defined group. You must specify the **groupID** of the group you have created. For example, the genesis process belongs to the GENESIS group. For any new application, the value for groupId will be *application name*. The commands **startGroup** and **killGroup** use the **groupId** to start or kill groups of processes.

When you are defining the process in your application's **process.xml**, this tag is optional.

### description
This tag provides a simple description of the process. 

When you are defining the process in your application's **process.xml**, this tag is optional.

### primaryOnly
This tag specifies that the process can only run on the primary node in a cluster. It requires a boolean value: **true** or **false**. The default value is false.

When you are defining the process in your application's **process.xml**, this tag is optional.

### arguments
This tag helps in hard-coding the process arguments for starting the processes,  since some processes always need arguments on startup.

When you are defining the process in your application's **process.xml**, this tag is optional.
