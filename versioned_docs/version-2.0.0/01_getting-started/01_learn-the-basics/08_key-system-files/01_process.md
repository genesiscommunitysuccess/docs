---
title: 'process.xml'
sidebar_label: 'process.xml'
id: process
---

Your application must have a **-processes.xml** file. If your application is called bravo, then the file will be called **bravo-processes.xml**.

The purpose of this file is to specify the main characteristics of each of the services (or modules) in your application. If you don't define a module here, it will effectively not be part of the application, however good or bads you make it.

So, if you add a new module, you must add its details to your application's **processes.xml** file.

Characteristics that are defined for each module include:
- the name of the script file
- the language used by the script file
- the classpath - any additional jar files that the module needs in order to run
- the logging level for the module

It is important to know that whenever you run the command `genesisInstall`, an enriched version of this file is put in your application's **generated** folder. It is this version of the file that the system refers to whenever it starts or runs. So, if you change your version of the file, you need to run `genesisInstall` to make sure that your changes are put into effect.

Here is an example of a generated **processes.xml** file for an application that has:

- a data server
- a request server
- an event handler
- a consolidator

```kotlin
<processes>
  <process name="TRADING_APP_DATASERVER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <script>trading_app-dataserver.kts</script>
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
    <language>pal</language>
  </process>
  <process name="TRADING_APP_EVENT_HANDLER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>trading_app-eventhandler.kts</script>
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
  
</processes>

```