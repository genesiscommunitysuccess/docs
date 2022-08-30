---
title: 'Setting Genesis Evaluator rules'
sidebar_label: 'Setting Genesis Evaluator rules'
id: setting-genesis-evaluator-rules
---

It is often useful to run tasks periodically - for example to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes the Genesis low-code platform provides a feature called the [Evaluator](/server-modules/evaluator/introduction/). In system terms, Evaluators enable you to connect [Event Handlers](/server-modules/event-handler/introduction/) to two different kinds of event: dynamic and static (cron rules): 

- [Dynamic Rules](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#dynamic-rules-conditional-rules), also known as dynamic events, are defined as [groovy expressions](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.
- [Static Rules](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#static-rules-cron-rules)  are scheduling rules; these are static events, defined as [standard cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

In both cases, you define the rule in a table in the database: `DYNAMIC_RULES` for dynamic rules and `CRON_RULES` for static rules. In this section, we're going to use dynamic rules, but if you're interested in the static scheduling rules, please look at [the next section](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#static-rules-cron-rules).

### Configure the Evaluator

An Evaluator is a process that runs cron jobs and conditional rules.
To start, create a process called *POSITIONS_APP_TUTORIAL_EVALUATOR* and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** as the code below.

```xml
<processes>
    ...
    <process name="POSITIONS_APP_TUTORIAL_EVALUATOR">
        <start>true</start>
        <groupId>POSITIONS_APP_TUTORIAL</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>genesis-evaluator</module>
        <primaryOnly>true</primaryOnly>
        <package>global.genesis.eventhandler,global.genesis.evaluator</package>
        <description>Dynamic/time rules engine</description>
    </process>
</processes>
```

Add the `POSITIONS_APP_TUTORIAL_EVALUATOR` to the file **positions-app-tutorial-service-definitions.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** with the code below.

```xml
<configuration>
    ...
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_EVALUATOR" port="11003"/>
</configuration>
```

Run the `assemble` and `positions-app-tutorial-config:assemble` tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present, but on `Standby`.

This is because the Evaluator process is set to run only on the primary node. Our application only has one node, but we still have to identify it as the primary node.

Run `SetPrimary` and you should be able to see all processes running.

### Dynamic rules (Conditional rules)

Now we are going to use the [Evaluator](/server-modules/evaluator/introduction/) to set up dynamic rules. In this case, an email will be sent if a specified limit has been breached.

First, check that you have the Evaluator running. If it is not, check the procedure [above](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#configure-the-evaluator).

You need to create two csv files for this exercise.

The first is the file with your rule in the correct [format](/server-modules/evaluator/basics/#dynamic_rule-table) in order to be inserted into the  `DYNAMIC_RULE` table. Call the file **DYNAMIC_RULE.csv**.

```csv
NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION
MY_RULE,It’s a rule,POSITION,ENABLED,(QUANTITY > 500),JaneDee,ALPHA_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) && (POSITION_ID = POSITION_ID))
```

The second is a csv file that enables you to test the rule. Create a file called **POSITION.csv** with the following data:

```csv
POSITION_ID,INSTRUMENT_ID,COUNTERPARTY_ID,QUANTITY,NOTIONAL
1,2,2,600,1100000
```

Now you are ready to begin setting up your dynamic rule.

### Set up the dynamic rule

To set up the dynamic rule, go to the `DYNAMIC_RULE` table and insert the **DYNAMIC_RULE.csv** file. Run `SendIt`

### Set up the Event Handler message class

To define the Event Handler message class, create a Kotlin class called `PositionCancel` in your project folder **server/jvm/positions-app-tutorial-messages/src/main/kotlin/global/genesis/positions-app-tutorial/message/event**, and insert the following code:

```kotlin
data class PositionCancel(
      val positionId: String,
)
```

### Update the Event Handler

The rule needs to call an Event Handler, which will be named `PositionCancel` using the class created in the previous step.
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

For a more detailed explanation of GENESIS_NOTIFY and GATEWAY see our [Integration Section](/server-modules/integration/notify/configuring/).

The module GENESIS_NOTIFY does not run by default. To change this, we are adding a customised module to our project. To do that, create a process called `POSITIONS_APP_TUTORIAL_NOTIFY` and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg**. Use the code below.

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
Add the `POSITIONS_APP_TUTORIAL_NOTIFY` in the file **positions-app-tutorial-service-definitions.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg**. Use the code below.

```xml
<configuration>
    ...
    <service host="localhost" name="POSITIONS_APP_TUTORIAL_NOTIFY" port="11004"/>
</configuration>
```

Run the `assemble` and `positions-app-tutorial-config:assemble` tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present.

### Set up GENESIS_NOTIFY in the database

#### Insert a gateway route

Create a file **GATEWAY.csv** as shown below and insert it in the table GATEWAY using the command `SendIt`.

```csv
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EmailDistribution1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

#### Insert NOTIFY_ROUTE

Create a file **NOTIFY_ROUTE.csv** as shown below, then insert it in the table NOTIFY_ROUTE using the command `SendIt`.

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

Run the `build`, `install-positions-app-tutorial-site-specific` and `deploy` tasks again.

### Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY so that we can see some additional data in the logs.

Run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command for that:
<!-- TODO: add LogLevel section to Server Commands -->

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
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis Platform. Feel free to use your favorite command to view logs such as tail, less etc.
:::

### Trigger the event to test the rule

So, let's see if that has worked.

Insert the file **POSITION.csv** into the database. This is the file that you prepared earlier; it contains a value that breaches a limit, so it should trigger our event.

You can see that when the limit is breached, you receive an email automatically.

:::note
Go to https://www.wpoven.com/tools/free-smtp-server-for-testing and access the inbox *dev-training@freesmtpserver.com*
::: -->

### Conclusion
This section showed how to trigger events based on a condition in the database. This is a powerful feature that allows you to raise alarms on certain conditions or to react on specific states.
In the next section you will see how to run scheduled tasks.

### Static rules (Cron rules)

Let's create a cron rule that triggers a batch job to run once every minute.

First, check that you have the Evaluator running. If it is not, check the procedure at the beginning of the exercise on [configuring the evaluator](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#configure-the-evaluator).

The batch job will generate a position report as a csv for each counterparty. This will be stored in **runtime/position-minute-report**. The file name of each report written will have the form COUNTERPARTY_ID-DATE.csv.

#### The rule

Our cron rule takes the following form:

| CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | NAME | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `0 45 7 ? * MON,TUE,WED,THU,FRI *` | It’s a rule | Europe/London | ENABLED | A rule | JaneDee | ALPHA_EVENTHANDLER | EVENT_POSITION_REPORT |  |

Let's look at the most important fields:

* **RULE_STATUS** can be **ENABLED** or **DISABLED**.
* **CRON_EXPRESSION** determines when the rule is evaluated.
* **PROCESS_NAME** is the target process for the rule. When the rule is triggered, it will send a message to the process specified here.
* **MESSAGE_TYPE** is the message that needs to be sent to the specified **PROCESS_NAME**.
* **RESULT_EXPRESSION** is the value or values that will be sent as part of the transaction to the target PROCESS_NAME; we can leave RESULT_EXPRESSION empty, as we are going to generate a report for all positions anyway.


Create a csv file with the rule in the above format. Call the file **CRON_RULE.csv**.
```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE
"0 * * * * *","It’s a rule","Europe/London","ENABLED","A rule","JaneDee","ALPHA_EVENT_HANDLER","EVENT_POSITION_REPORT"
```

### Load the cron rule into the database

Load the cron rule **CRON_RULE.csv** file into the `CRON_RULE`  [table](/server-modules/evaluator/configuring-runtime/#cron_rule-table).

Run `SendIt`

### Create a new class
When the evaluator is running, create a `PositionReport` class to trigger the new event. This class should be created inside your project folder **server/jvm/positions-app-tutorial-messages/src/main/kotlin/global/genesis/positions-app-tutorial/message/event** as the code below. 

```kotlin

class PositionReport
```

### Create an Event Handler

Create an Event Handler that will write the csv files to the **runtime/position-minute-report** folder. Call it `EVENT_POSITION_REPORT`.

Open the file **positions-app-tutorial-eventhandler.kts** and add a variable called `tradeViewRepo`, injecting the class `TradeViewAsyncRepository`. Then, add an Event Handler to generate the csv file:

```kotlin {8,12}
import java.io.File
import java.time.LocalDate
import global.genesis.TradeStateMachine
import global.genesis.commons.standards.GenesisPaths
import global.genesis.gen.view.repository.TradeViewAsyncRepository
import global.genesis.jackson.core.GenesisJacksonMapper

val tradeViewRepo = inject<TradeViewAsyncRepository>()

eventHandler {
 //... other event handlers removed for clarity
     eventHandler<PositionReport> {
        onCommit {
            val mapper = GenesisJacksonMapper.csvWriter<TradeView>()
            val today = LocalDate.now().toString()
            val positionReportFolder = File(GenesisPaths.runtime()).resolve("position-minute-report")
            if (!positionReportFolder.exists()) positionReportFolder.mkdirs()

            tradeViewRepo.getBulk()
                .toList()
                .groupBy { it.counterpartyName }
                .forEach { (counterParty, trades) ->
                    val file = positionReportFolder.resolve("${counterParty}_$today.csv")
                    if (file.exists()) file.delete()
                    mapper.writeValues(file).use { it.writeAll(trades) }
                }

            ack()
        }
    }
}
```

### Change the log level to verify the execution of the events
To do this, run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command:

```shell
LogLevel -p GENESIS_EVALUATOR -DATADUMP_ON -l DEBUG
```

And then to see the logs, run:
```shell
cd $L
tail -f GENESIS_EVALUATOR.log
```
:::info What is $L?
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis low-code platform. Feel free to use your favourite command to view logs such as tail, less etc.
:::

### Conclusion
This concludes generating reports for the positions application.
