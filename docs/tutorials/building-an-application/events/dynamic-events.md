---
id: dynamic-events
title: Dynamic events
sidebar_label: Dynamic events
sidebar_position: 2

---
We have now set up the evaluator so that our application creates reports daily.

Now you are going to use the evaluator again to set up dynamic events. In this case, you want to send an email automatically of a certain limit has been breached.

You need to create your rule in a csv file with the correct format, as you saw with the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

You'll need to be able to test the rule, so also create a file called POSITION.csv with the following data:


```
POSITION_ID,INSTRUMENT_ID,COUNTERPARTY_ID,QUANTITY,NOTIONAL
,2,2,600,1100000
```

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
The rule needs to call an event handler, which will be called `<PositionCancel>`. 
We have defined the event handler in the code block below. Open the file **trading_app-eventhandler.kts** and insert the code block:

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
## 3. Set up the event handler message class
To define the event handler message class.
Insert the following code:


```java
package global.genesis.trading_app.message.event

data class PositionCancel(
      val positionId: String,
)
```
## 4. Set up the Notify module and start the process
The module GENESIS_NOTIFY does not run by default. To change this, open the edit the file **genesis-process.xml**.

Change `GENESIS_NOTIFY` to `true`.

Now you need to run `genesisInstall` to update the configuration.

After that, you need to restart the server so that Notify runs aling with the other processes.
Run `killServer`to stop the application. When that has been completed, run`startServer`to restart it.

When that has finished, you can run  `mon` at which point, you will see  GENESIS_NOTIFY as one of the processes that are runing.

## 5. Set up GENESIS_NOTIFY in the database
### Insert Gateway Route
Note that the GATEWAY_VALUE column requires an empty email distribution JSON definition.
Insert the following:
```
EmailDistribution1,EmailDistribution,"{
\"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }"
```

### Insert NOTIFY_ROUTE
Insert the following:

```
"ENTITY_ID","ENTITY_ID_TYPE","TOPIC_MATCH","GATEWAY_ID"
,"GATEWAY","PositionAlert","EmailDistribution1" 
```
## 6. Add connection details to the service definition
Open the genesis-system-definitions.kts file and add the details of the connection for the SMTP server:
```
item(name = "SYSTEM_DEFAULT_USER_NAME", value =
"GenesisGlobal" )
item(name = "SYSTEM_DEFAULT_EMAIL", value =
"notifications@genesis.global" )
item(name = "EMAIL_SMTP_HOST", value =
"smtp.office365.com" )
item(name = "EMAIL_SMTP_PORT", value = "587" )
item(name = "EMAIL_SMTP_USER", value =
"notifications@genesis.global" )
item(name = "EMAIL_SMTP_PW", value = "Dufferin!St33t" )
item(name = "EMAIL_SMTP_PROTOCOL", value = "SMTP_TLS"
)
```
## 7. Switch on data dumps 
Data dumps need to be switched on for both EVALUATOR and NOTIFY.

Run the following commands:

`
LogLevel -p GENESIS_EVALUATOR -DATADUMP_ON

LogLevel -p GENESIS_NOTIFY -DATADUMP_ON
`

**THIS IS JUST STUFF**



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