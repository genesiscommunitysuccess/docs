---
id: dynamic-events
title: Dynamic events
sidebar_label: Dynamic events 
sidebar_position: 2

---
The genesis-evaluator is a genesis generic microservice that you can configure using events and database records. This enables you to setup automatic rules. Rules can be dynamic (based on database updates) or cron based. 

You can create and store rules in the database either manually or using events from the front end. 

An example for CRON_RULE record looks very similar to a dynamic record. Something like this: 

CRON_EXPRESSION 

DESCRIPTION 

TIME_ZONE 

RULE_STATUS 

NAME 

USER_NAME 

0 45 7 ? * MON,TUE,WED,THU,FRI * 

It’s a rule 

Europe/London 

ENABLED 

A rule 

JohnDoe 

PROCESS_NAME 

MESSAGE_TYPE 

RESULT_EXPRESSION 

TRADING_APP_EVENTHANDLER 

EVENT_POSITION_REPORT 

The most important fields are: 

RULE_STATUS can be ENABLED or DISABLED 

CRON_EXPRESSION determines when the rule is evaluated. 

PROCESS_NAME is the target process for the rule. If a rule is triggered it will send a message to that PROCESS_NAME process. 

MESSAGE_TYPE is the message that needs to be sent to the PROCESS_NAME 

RESULT_EXPRESSION is the values that will be sent as part of the transaction to the target PROCESS_NAME, we can leave RESULT_EXPRESSION empty as we are going to generate a report for all positions anyway. 

The goal of this script is to create a cron rule to trigger a batch job using a cron expression. Once a day, we want to generate a position csv for each counterparty and store it in runtime/position-daily-report. The file name should be COUNTERPARTY_ID-DATE.csv 

Configure GENESIS_EVALUATOR in genesis-processes.xml. For this we should take a copy of genesis-processes.xml and place it in site-specific/cfg. There should be an example there of GENESIS_EVALUATOR we can enable. 

Run **genesisInstall** to verify it works as expected and GENESIS_EVALUATOR and the process appears in mon. 

Create an event handler that will write the csv files to the runtime/position-daily-report folder. We could call it EVENT_POSITION_REPORT. 

Create message class and deploy jar 

Add jar to event handler process xml 

This event handler can call a csv writer. We need to create the csv writer as well; Create static function that will take a rxDb, and write the csv files to the runtime/position-daily-report. We can write csv file like this:  

GenesisJacksonMapper.defaultCsvMapper 

    .writerFor(FxTrade::class.java) 

    .writeValues(file) 

    .use { writer -> 

        writer.writeAll(listOf(trade)) 

    } 

### Insert a CRON_RULE table entry

Insert a CRON_RULE table entry in dbmon/csv as per the example above. 

CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION 

"0 45 7 ? * MON,TUE,WED,THU,FRI *","It’s a rule","Europe/London","ENABLED","A rule","JohnDoe","TRADING_APP_EVENT_HANDLER","EVENT_POSITION_REPORT", 

Run set primary to start the evaluator 

Insert this record in database and restart the GENESIS_EVALUATOR for it to come into place. 

That’s all. It might be a bit hard to show it working and we don’t want to generate positions every 10 seconds, but this illustrates how to setup jobs that trigger events.