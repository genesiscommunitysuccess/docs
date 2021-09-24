---
id: dynamic-events
title: Dynamic events
sidebar_label: Dynamic events
sidebar_position: 2

---
We have now set up the evaluator so that our application creates reports daily.

Now you are going to use the evaluator again to set up dynamic events. In this case, you want to send an email automatically of a certain limit has been breached.

You need to create your rule in a csv file with the correct format, as you saw with the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

CHECK FROM HERE
An example for CRON_RULE record looks very similar to a dynamic record. Something like this:

| CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | NAME | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 45 7 ? * MON,TUE,WED,THU,FRI * | It’s a rule | Europe/London | ENABLED | A rule | JohnDoe | TRADING_APP_EVENTHANDLER | EVENT_POSITION_REPORT |  |

The most important fields are:

RULE_STATUS can be ENABLED or DISABLED

CRON_EXPRESSION determines when the rule is evaluated.

PROCESS_NAME is the target process for the rule. If a rule is triggered it will send a message to that PROCESS_NAME process.

MESSAGE_TYPE is the message that needs to be sent to the PROCESS_NAME

RESULT_EXPRESSION is the values that will be sent as part of the transaction to the target PROCESS_NAME, we can leave RESULT_EXPRESSION empty as we are going to generate a report for all positions anyway.

Configure GENESIS_EVALUATOR in genesis-processes.xml. For this we should take a copy of genesis-processes.xml and place it in site-specific/cfg.

Run **genesisInstall** to verify it works as expected and GENESIS_EVALUATOR and the process appears in mon.

## 1. Set up the dynamic rule

To set up the dynamic rule, go to the DYNAMIC_RULE table and insert a row. Run `SendIt -t DYNAMIC_RULE”`

## 2. Update the event handler
The rule needs to call an event handler in the file **trading_app-eventhandler.kts**. Opne this file and insert this code block:

 ```java
eventHandler<PositionCancel> {
    onCommit { event ->
        val positionId = event.details.positionId
        entityDb.insert(
          Notify {
              topic = "PositionAlert"
              header = "Position Alert for $positionId"
              body = mapOf<String, Any?>(
                  "emailDistribution" to mapOf(
                  "to" to listOf("peter.kievits@genesis.global"),
                  "cc" to emptyList(),
                  "bcc" to emptyList(),
              ),
              "content" to "Position $positionId breached the limit"
          ).toJsonString(true)
         }
 )
 ack()
 }
 }
 ```



**THIS IS JUST STUFF**

Create an event handler that will write the csv files to the runtime/position-daily-report folder. We could call it EVENT_POSITION_REPORT.

Create message class and deploy jar

Add jar to event handler process xml

This event handler can call a csv writer. We need to create the csv writer as well; Create static function that will take a rxDb, and write the csv files to the runtime/position-daily-report. We can write csv file like this:

```kotlin
GenesisJacksonMapper.defaultCsvMapper 

    .writerFor(FxTrade::class.java) 

    .writeValues(file) 

    .use { writer -> 

        writer.writeAll(listOf(trade)) 

    } 
```

### Insert a CRON_RULE table entry

Insert a CRON_RULE table entry in dbmon/csv as per the example above.

```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION 

"0 45 7 ? * MON,TUE,WED,THU,FRI *","It’s a rule","Europe/London","ENABLED","A rule","JohnDoe","TRADING_APP_EVENT_HANDLER","EVENT_POSITION_REPORT", 
```

Run set primary to start the evaluator

Insert this record in database and restart the GENESIS_EVALUATOR for it to come into place.

Now you can see that when the limit is breached, you receive an email automatically:

![](/img/dynamic-email.png)

Well done!