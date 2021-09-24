---
id: dynamic-events
title: Dynamic events
sidebar_label: Dynamic events
sidebar_position: 2

---
We have now set up the evaluator so that our application creates reports daily.

Now you are going to use the evaluator again to set up dynamic events. In this case, you want to send an email automatically of a certain limit has been breached.

## Preparation

First, check that you have the evaluator running. If it is not, check the procedure at the beginning of the exercise on \[setting up a cron job\](/server-reference/other-modules/dbtogenesis/dbtogenesis-oracle/).

You need to create two csv files for this exercise.

The first is the file with your rule in the correct format, as you saw with the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

    NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSA
    MY_RULE,It’s a rule,POSITION,ENABLED,(QUANTITY >
    500),JohnDoe,TRADING_APP_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) &&
    (POSITION_ID = POSITION_ID))

The second is a csvfile that enables you to test the rule. Create a file called POSITION.csv with the following data:

    POSITION_ID,INSTRUMENT_ID,COUNTERPARTY_ID,QUANTITY,NOTIONAL
    ,2,2,600,1100000

Now you are ready to begin setting up your dynamic rule.

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

To define the event handler message class, insert the following code:

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

After that, you need to restart the server so that Notify runs along with the other processes.
Run `killServer`to stop the application. When that has been completed, run `startServer` to restart it.

When that has finished, you can run  `mon` at which point, you will see  GENESIS_NOTIFY as one of the processes that are runing.

## 5. Set up GENESIS_NOTIFY in the database

### Insert Gateway Route

Note that the GATEWAY_VALUE column requires an empty email distribution JSON definition.
Insert the following:

    EmailDistribution1,EmailDistribution,"{
    \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }"

### Insert NOTIFY_ROUTE

Insert the following:

    "ENTITY_ID","ENTITY_ID_TYPE","TOPIC_MATCH","GATEWAY_ID"
    ,"GATEWAY","PositionAlert","EmailDistribution1" 

## 6. Add connection details to the system definition

Open the genesis-system-definitions.kts file and add the details of the connection for the SMTP server:

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

## 7. Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY.

Run the following commands:

\`
LogLevel -p GENESIS_EVALUATOR -DATADUMP_ON

LogLevel -p GENESIS_NOTIFY -DATADUMP_ON
\`

## 8. Trigger the event to test the rule

So, let's see i fthat has worked.

Insert the file POSITION.csv into the database. This is the file that you prepared earlier, and it contains a value that breaches a limit that shoud trigger our event.

You can see that when the limit is breached, you receive an email automatically:

![](/img/dynamic-email.png)

Well done!