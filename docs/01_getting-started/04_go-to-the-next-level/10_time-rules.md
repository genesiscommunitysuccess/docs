---
title: 'Time based rules'
sidebar_label: 'Time based rules'
id: time-rules
---

It is often useful to run tasks periodically - for example to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes the Genesis low-code platform provides a feature called the [Evaluator](/server-modules/evaluator/introduction/). In system terms, Evaluators enable you to connect [Event Handlers](/server-modules/event-handler/introduction/) to two different kinds of event: dynamic and static (cron rules): 

- __Cron Rules__  are scheduling rules; these are static events, defined as [standard cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression). 
- __Dynamic Rules__, also known as dynamic events, are defined as [groovy expressions](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.

In both cases, you define the rule in a table in the database: `CRON_RULES` for static rules and `DYNAMIC_RULES` for dynamic rules. In this section, we're going to use Cron Rules, but if you're interested in the dynamic rules, please look at [the next section](/getting-started/go-to-the-next-level/condition-rules/).

### Cron rules (static events)

Let's create a cron rule that triggers a batch job to run once every minute.

The batch job will generate a position report as a csv for each counterparty. This will be stored in **runtime/position-minute-report**. The file name of each report written will have the form COUNTERPARTY_ID-DATE.csv.

#### The rule

Our cron rule takes the following form:

| CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | NAME | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 45 7 ? * MON,TUE,WED,THU,FRI * | It’s a rule | Europe/London | ENABLED | A rule | JaneDee | ALPHA_EVENTHANDLER | EVENT_POSITION_REPORT |  |

Let's look at the most important fields:

* **RULE_STATUS** can be **ENABLED** or **DISABLED**.
* **CRON_EXPRESSION** determines when the rule is evaluated.
* **PROCESS_NAME** is the target process for the rule. When the rule is triggered, it will send a message to the process specified here.
* **MESSAGE_TYPE** is the message that needs to be sent to the specified **PROCESS_NAME**.
* **RESULT_EXPRESSION** is the value or values that will be sent as part of the transaction to the target PROCESS_NAME; we can leave RESULT_EXPRESSION empty, as we are going to generate a report for all positions anyway.



### Configure the Evaluator

An Evaluator is a process that runs cron jobs. 
To start, create a process called *GENESIS_EVALUATOR* and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** as the code below.

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

### Load the cron rule on to the database
Load the cron rule csv below into the database, [CRON_RULE](/server-modules/evaluator/configuring-runtime/#cron_rule-table) Table.

Run `SendIt`.

```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE
"0 * * * * *","It’s a rule","Europe/London","ENABLED","A rule","JaneDee","ALPHA_EVENT_HANDLER","EVENT_POSITION_REPORT"
```

<<<<<<< HEAD
### Change the log level to verify the execution of the events
To do this, run the `LogLevel` command:
=======
#### 5.Change the log level to verify the execution of the events
To do this, run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command:
>>>>>>> uat

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
This concludes generating reports for the positions application. In the next section you will see how to trigger based on a condition in the database.
