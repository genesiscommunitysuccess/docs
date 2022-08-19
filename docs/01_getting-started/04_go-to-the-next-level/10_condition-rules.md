---
title: 'Condition based rules'
sidebar_label: 'Condition based rules'
id: condition-rules
---

Now we are going to use the Evaluator again to set up dynamic rules. In this case, an email will be sent if a specified limit has been breached.

### Preparation

First, check that you have the Evaluator running. If it is not, check the procedure at the beginning of the exercise on  [setting up a cron rule](#cron-rules-static-events).

You need to create two csv files for this exercise.

The first is the file with your rule in the correct format, similsr to the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

```csv
NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION
MY_RULE,It’s a rule,POSITION,ENABLED,(QUANTITY > 500),JaneDee,ALPHA_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) && (POSITION_ID = POSITION_ID))
```

The second is a csv file that enables you to test the rule. Create a file called POSITION.csv with the following data:

```csv
POSITION_ID,INSTRUMENT_ID,COUNTERPARTY_ID,QUANTITY,NOTIONAL
,2,2,600,1100000
```

Now you are ready to begin setting up your dynamic rule.

### Set up the dynamic rule

To set up the dynamic rule, go to the DYNAMIC_RULE table and insert the *DYNAMIC_RULE.csv* file. Run `SendIt -t DYNAMIC_RULE -f DYNAMIC_RULE.csv`

### Set up the Event Handler message class

To define the Event Handler message class, create a Kotlin class called *PositionCancel* in your project folder **server/jvm/positions-app-tutorial-messages/src/main/kotlin/global/genesis/positions-app-tutorial/message/event**, and insert the following code:

```kotlin
data class PositionCancel(
      val positionId: String,
)
```

### Update the Event Handler

The rule needs to call an Event Handler, which will be called `<PositionCancel>` using the class created in the previous step.
We have defined the Event Handler in the code block below. Open the file **positions-app-tutorial-eventhandler.kts** and insert the code block:

```kotlin
eventHandler<PositionCancel> {
   onCommit { event ->
       val positionId = event.details.positionId
       entityDb.insert(
           Notify {
               topic = "PositionAlert"
               header = "Position Alert for $positionId"
               body = mapOf<String, Any?>(
                   "emailDistribution" to mapOf(
                       "to" to listOf("dev-training@freesmtpserver.com"),
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

### Set up the Notify module and start the process

The module GENESIS_NOTIFY does not run by default. To change this, we are adding a customized module to our project. To do that, create a process called *ALPHA_NOTIFY* and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** as the code below.

```xml
<processes>
    ...
    <process name="POSITIONS_APP_TUTORIAL_NOTIFY">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>genesis-notify</module>
        <package>global.genesis.notify</package>
        <script>genesis-notify.kts</script>
        <language>pal</language>
        <description>Notify Mechanism for sending messages to external systems, such as Email and Symphony</description>
    </process>
</processes>
```
Add the *POSITIONS_APP_TUTORIAL_EVALUATOR* in the file **positions-app-tutorial-service-definitions.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** as the code below. 

```xml
<configuration>
    ...
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_NOTIFY" port="11004"/>
</configuration>
```

Run **assemble** and **deploy-genesisproduct-positions-app-tutorial** tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present.

### Set up GENESIS_NOTIFY in the database

#### Insert a gateway route

Create a file GATEWAY.csv as shown below and insert it in the table GATEWAY using the command `SendIt`.

```csv
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EmailDistribution1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

#### Insert NOTIFY_ROUTE

Create a file NOTIFY_ROUTE.csv as shown below, then insert it in the table NOTIFY_ROUTE using the command `SendIt`.

```csv
ENTITY_ID,ENTITY_ID_TYPE,TOPIC_MATCH,GATEWAY_ID
,"GATEWAY","PositionAlert","EmailDistribution1" 
```

### Add connection details to the system definition

Open the **genesis-system-definition.kts** file and add the details of the connection for the SMTP server:
```kotlin
package genesis.cfg

systemDefinition {
    global {
        ...
        item(name = "SYSTEM_DEFAULT_USER_NAME", value = "" )
        item(name = "SYSTEM_DEFAULT_EMAIL", value = "notifications@freesmtpservers.com" )
        item(name = "EMAIL_SMTP_HOST", value = "smtp.freesmtpservers.com" )
        item(name = "EMAIL_SMTP_PORT", value = "25" )
        item(name = "EMAIL_SMTP_USER", value = "" )
        item(name = "EMAIL_SMTP_PW", value = "" )
        item(name = "EMAIL_SMTP_PROTOCOL", value = "SMTP")
    }
    ...
}
```

Run the *build*, *install-alpha-site-specific* and *deploy* tasks again.

### Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY so we can see some additional data in the logs.

Run the [LogLevel](/managing-applications/operate/on-the-host/helpful-commands/#loglevel-script) command for that:

```shell
LogLevel -p POSITIONS_APP_TUTORIAL_EVALUATOR -DATADUMP_ON -l DEBUG
LogLevel -p POSITIONS_APP_TUTORIAL_NOTIFY -DATADUMP_ON -l DEBUG
```

And then to see the logs run:
```shell
cd $L
tail -f POSITIONS_APP_TUTORIAL_EVALUATOR.log
```
:::tip
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis Platform. Moreover, feel free to use your favorite command to view logs such as tail, less etc.
:::

### Trigger the event to test the rule

So, let's see if that has worked.

Insert the file POSITION.csv into the database. This is the file that you prepared earlier; it contains a value that breaches a limit, so it should trigger our event.

You can see that when the limit is breached, you receive an email automatically.

:::note
Go to https://www.wpoven.com/tools/free-smtp-server-for-testing and access the inbox *dev-training@freesmtpserver.com*
::: -->