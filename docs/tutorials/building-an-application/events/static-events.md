---
id: static-events
title: Cron jobs (static events)
sidebar_label: Cron jobs (static events)
sidebar_position: 1

---
In this exercise you are going to create a cron rule that will trigger a batch job that will run once each day.

The batch job will generate a position csv for each counterparty and store it in **runtime/position-daily-report**. The file name will have the form COUNTERPARTY_ID-DATE.csv

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

The Genesis Evaluator is the process that runs cron jobs. In this exercise, you will see this being configured.

## 1. Configure the Evaluator

To start, make a copy of **genesis-processes.xml** and place it in **site-specific/cfg**. 

In the genesis-processes.xml file,  change the
tag for **GENESIS_EVALUTATOR** and set the **<start>** tag to true
  
We can write csv file like this:

<process name="GENESIS_EVALUATOR">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-evaluator</module>
    <primaryOnly>true</primaryOnly>
    <package>global.genesis.eventhandler,global.genesis.evaluator</package>
    <description>Dynamic/time rules engine</description>
</process>
...

...

Run **genesisInstall** to verify that it works as expected.

Run **mon** to see the process:

![](/img/dictionary-builder-screenshot.png)
## 2. Create an event handler

Create an event handler that will write the csv files to the runtime/position-daily-report folder. Call it EVENT_POSITION_REPORT.

Create message class and deploy jar

## 3. Update the process.xml file for the event handler

Go to the file 

Add jar to event handler process xml

![](/img/dictionary-builder-screenshot.png)

## 4. Create the csv writer

This event handler needs to call a csv writer.

Of course, you need to create the  csv writer itself.

Create static function that will take a rxDb, and write the csv files to the runtime/position-daily-report.

We can write csv file like this:

    GenesisJacksonMapper.defaultCsvMapper 
    
        .writerFor(FxTrade::class.java) 
    
        .writeValues(file) 
    
        .use { writer -> 
    
            writer.writeAll(listOf(trade)) 
    
        } 

5\. Insert the cron rule

Insert a CRON_RULE table entry in dbmon/csv as per the example above.