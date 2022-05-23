---
id: static-events
title: Cron jobs (static events)
sidebar_label: Cron jobs (static events)
sidebar_position: 1

---
In this exercise you are going to create a cron rule that will trigger a batch job that will run once each day.

The batch job will generate a position report as a csv for each counterparty. This wil be stored in **runtime/position-daily-report**. The file name of each report written will have the form COUNTERPARTY_ID-DATE.csv.


## The rule

Our cron rule takes the following form:

| CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | NAME | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 45 7 ? * MON,TUE,WED,THU,FRI * | It’s a rule | Europe/London | ENABLED | A rule | JohnDoe | TRADING_APP_EVENTHANDLER | EVENT_POSITION_REPORT |  |

Let's look at the most important fields:

* **RULE_STATUS** can be **ENABLED** or **DISABLED**.
* **CRON_EXPRESSION** determines when the rule is evaluated.
* **PROCESS_NAME** is the target process for the rule. When the rule is triggered, it will send a message to the process specified here.
* **MESSAGE_TYPE** is the message that needs to be sent to the specified **PROCESS_NAME**.
* **RESULT_EXPRESSION** is the values that will be sent as part of the transaction to the target PROCESS_NAME, we can leave RESULT_EXPRESSION empty as we are going to generate a report for all positions anyway.



## 1. Configure the Evaluator

The Genesis Evaluator is the process that runs cron jobs. 
To start, make a copy of **genesis-processes.xml** and place it in **site-specific/cfg**.

In the genesis-processes.xml file,  change the
tag for **GENESIS_EVALUTATOR** and set the  `<start>` tag to true

```xml
<process name="GENESIS_EVALUATOR">
<start>true</start>
<groupId>GENESIS</groupId>
<options>-Xmx512m -DXSD_VALIDATE=false</options>
<module>genesis-evaluator</module>
<primaryOnly>true</primaryOnly>
<package>global.genesis.eventhandler,global.genesis_evaluator</package>
<description>Dynamic/time rules engine</description>
</process_>
```

Run **genesisInstall** to verify that the new process works as expected.

Run **mon**.
You can see that the process is missing.
So, run **startProcess GENESIS_EVALUATOR**.

You can see that the process is present, but on Standby.
![](/img/standbysmall.png)

This is because the evaluator process is set to run only on the primary node. Our application only has one node, but we still have to identofy it as the Primary node.

Run **setPrimary**.

## 2. Create a new class.
When the eveluator is running, create a PostionReport class to trigger the new event.

```javapackage global.genesis.trading_app.message.event
class PositionReport()
```

## 3. Create an event handler

Create an event handler that will write the csv files to the runtime/position-daily-report folder. Call it EVENT_POSITION_REPORT.

Open the file trading_app-eventhandler.kts. Add an event handler to generate the csv file:

```java
import global.genesis.commons.standards.GenesisPaths
import global.genesis.jackson.core.GenesisJacksonMapper
import java.io.File
import java.time.LocalDate
/**
 *
 * System : trading_app
 * Sub-System : trading_app Configuration
 * Version : 1.0
 * Copyright : (c) GENESIS
 * Date : 2021-09-07
 *
 * Function : Provide Event Handler configuration for trading_app.
 *
 * Modification History
 *
 */
eventHandler {
 //... other event handlers removed for clarity
 eventHandler<PositionReport> {
 onCommit {
 val mapper = GenesisJacksonMapper.csvWriter<Trade>()
 val today = LocalDate.now().toString()
 val positionReportFolder = File(GenesisPaths.runtime()).resolve("position-da
 if (!positionReportFolder.exists()) positionReportFolder.mkdirs()
 entityDb.getBulk(TRADE)
 .filter { it.counterpartyId != null }
```





## 4. Update the process.xml file for the event handler

Update the **processes.xml** file for the Positions application and change the tag for TRADING_APP_EVENT_HANDLER:
```xml
<process name="TRADING_APP_EVENT_HANDLER">
<groupId>TRADING_APP</groupId>
<start>true</start>
<options>-Xmx256m -DRedirectStreamsToLog=true</options>
<module>genesis-pal-eventhandler</module>
<package>global.genesis.eventhandler.pal</package>
<script>trading_app-eventhandler.kts</script>
<description>Handles events</description>
<classpath>trading_app-messages*</classpath>
<language>pal</language>
</process>
```

## 5.Load the cron rule on to the database
Load the cron rule csv into the database. 
Run `SendIt`.

csv:
```
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSA
"0 * * ? * *","It’s a rule","Europe/London","ENABLED","A
rule","JohnDoe","TRADING_APP_EVENT_HANDLER","EVENT_POSITION_REPORT"
```

That's it.