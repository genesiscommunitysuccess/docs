---
title: 'Setting Genesis Evaluator rules'
sidebar_label: 'Setting Genesis Evaluator rules'
id: setting-genesis-evaluator-rules
---

It is often useful to run tasks periodically - for example, to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes, the Genesis low-code platform provides a feature called the [Evaluator](/server/evaluator/introduction/). In system terms, Evaluators enable you to connect [Event Handlers](/server/event-handler/introduction/) to two different kinds of event: dynamic and static (cron rules): 

- [Dynamic Rules](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#setting-up-the-dynamic-rules), also known as dynamic events, are defined as [groovy expressions](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.
- [Static Rules](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#static-rules-cron-rules) are scheduling rules; these are static events, defined as [standard cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

In both cases, you define the rules in a table in the database: `DYNAMIC_RULES` for dynamic rules and `CRON_RULES` for static rules. We're going start with dynamic rules.

## Section objectives
The goal of this section is to:
- configure and define our Evaluator
- create `eventHandler` codeblocks for both static and dynamic events
- load our static and dynamic events to their given tables
- update our system definitions
- configure and define our Notify process

## Configure the Evaluator

An Evaluator is a process that runs cron jobs (static) and conditional (dynamic) rules.
To start, create a process called `POSITIONS_APP_TUTORIAL_EVALUATOR` and add it to your **positions-app-tutorial-processes.xml** file inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg**. Here is the code you need to add:

```xml title="positions-app-tutorial-processes.xml"
<process name="POSITIONS_APP_TUTORIAL_EVALUATOR">
    <start>true</start>
    <groupId>POSITIONS_APP_TUTORIAL</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-evaluator</module>
    <primaryOnly>true</primaryOnly>
    <package>global.genesis.eventhandler,global.genesis.evaluator</package>
    <description>Dynamic/time rules engine</description>
</process>
```

Add the `POSITIONS_APP_TUTORIAL_EVALUATOR` to your **positions-app-tutorial-service-definitions.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** with the code below.

```xml title="positions-app-tutorial-service-definitions.xml"
<service host="localhost" name="POSITIONS_APP_TUTORIAL_EVALUATOR" port="11003"/>
```

We have just defined our Evaluator. Next we're going to add our business logic.

## Define the business logic

### Create a data class

Now we need to create a `PositionCancel` class. This class should be created under **server/jvm/positions-app-tutorial-messages/src/main/kotlin/global/genesis/message/event**.

```kotlin
data class PositionCancel(val positionId: String)
```

### Create the eventHandler

Next we need to create an `eventHandler` codeblock that will trigger Notify to send an email. Navigate to **positions-app-tutorial-script-config** and insert the following `eventHandler` codeblock:

```kotlin title="positions-app-tutorial-eventhandler.kts"
eventHandler<PositionCancel>(name = "POSITION_CANCEL", transactional = true) {
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

Next we are going to load our rule definitions into the database.

## Setting up the dynamic rules

### Defining the rule
Now we can load the dynamic rule csv below into the `DYNAMIC_RULE` table.

Navigate to **/home/genesis/run/temp-data/** in your WSL terminal and create a file called **dynamic-rule.csv** with the following:

```csv title="dynamic-rule.csv"
NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION
MY_RULE,It’s a rule,POSITION,ENABLED,(QUANTITY > 500),JaneDee,POSITIONS_APP_TUTORIAL_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) && (POSITION_ID = POSITION_ID))
```

The second is a csv file that enables you to test the rule. Create another file called **position.csv** with the following data:

```csv title="position.csv"
POSITION_ID,INSTRUMENT_ID,QUANTITY,NOTIONAL
1,1,600,1100000
```

### Loading the rule into the database
Now we need to import this rule into our `DYNAMIC_RULE` table. Run the following command in your WSL terminal:

```bash title="From the WSL Distribution"
SendIt -f dynamic-rule.csv -t DYNAMIC_RULE
```

To validate the file was imported correctly, run `DbMon`, `table DYNAMIC_RULE` then `search 1`. You should see the following:

```bash title="Contents of table DYNAMIC_RULE"
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-09-06 14:00:49.771(n:0,s:2407)      NANO_TIMESTAMP
DESCRIPTION                              It’s a rule                              STRING
ID                                       cbdcbb88-9fb0-4d02-8400-e9a186204a27D... STRING
MESSAGE_TYPE                             EVENT_POSITION_CANCEL                    STRING
NAME                                     MY_RULE                                  STRING
PROCESS_NAME                             POSITIONS_APP_TUTORIAL_EVENT_HANDLER     STRING
RESULT_EXPRESSION                        ((QUANTITY = 0) && (POSITION_ID = POS... STRING
RULE_EXPRESSION                          (QUANTITY > 500)                         STRING
RULE_STATUS                              ENABLED                                  ENUM[ENABLED DISABLED]
RULE_TABLE                               POSITION                                 STRING
TABLE_OPERATION                          INSERT                                   STRING
USER_NAME                                JaneDee                                  STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```

We will load the **position.csv** file later when we are ready to trigger the event.

Ok now we have configured our evaluator, defined our bussiness logic and loaded the dynamic rule in to the database. In order for Notify to send an email, we first need define and configure it in our system.

## Configure Notify

For a more detailed explanation of **GENESIS_NOTIFY** and **GATEWAY**, see our [Integration section](/server/integration/notify/configuring/).

### Add connection details

The first step is to configure Notify to use the email server. Under **server/jvm/positions-app-tutorial-script-config/src/main/resources/scripts** create new file called **positions-app-tutorial-notify.kts**. Add the following code to it:

```kotlin title="positions-app-tutorial-notify.kts"
notify {

    email {
        smtpHost = "smtp.freesmtpservers.com"
        smtpPort = 25
        smtpUser = ""
        smtpPw = ""
        smtpProtocol = "SMTP"
        systemDefaultUserName = "admin@positions.app"
        systemDefaultEmail = "admin@positions.app"
    }
}
```

:::note
We use freely available SMTP server for testing purposes. Change the email configuration accordingly when developing an enterprise grade application.
:::

### Enable Notify

The **GENESIS_NOTIFY** module does not run by default. To change this, we are adding a customised module to our project. To do that, create a process called `POSITIONS_APP_TUTORIAL_NOTIFY` and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg**. The process definition should reference the Notify script created in the previous paragraph. Use the code below.

```xml title="positions-app-tutorial-processes.xml"
<process name="POSITIONS_APP_TUTORIAL_NOTIFY">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-notify</module>
    <package>global.genesis.notify</package>
    <script>positions-app-tutorial-notify.kts</script>
    <language>pal</language>
    <description>Notify Mechanism for sending messages to external systems, such as Email and Symphony</description>
</process>
```

Add the `POSITIONS_APP_TUTORIAL_NOTIFY` process to your **positions-app-tutorial-service-definitions.xml**.

```xml title="positions-app-tutorial-service-definitions.xml"
<service host="localhost" name="POSITIONS_APP_TUTORIAL_NOTIFY" port="11004"/>
```

## Set up GENESIS_NOTIFY in the database

### Insert a gateway route
Navigate to **/home/genesis/run/temp-data** in your WSL terminal and create a file called **gateway.csv**, in the following [format](/server/integration/notify/email/#gateway).

```csv title="gateway.csv"
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EmailDistribution1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

Then run:

```bash title="From the WSL Distribution"
SendIt -f gateway.csv -t GATEWAY
```

To validate the file was imported correctly, run `DbMon`, `table GATEWAY` then `search 1`. You should see the following:

```bash title="Contents of table GATEWAY"
GATEWAY
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-09-06 14:28:12.302(n:0,s:2537)      NANO_TIMESTAMP
CONNECTION_ID                                                                     STRING
GATEWAY_ID                               EmailDistribution1                       STRING
GATEWAY_TYPE                             EmailDistribution                        ENUM[Log EmailUser EmailDistribution SymphonyByUserEmail SymphonyRoom MsTeamsChannel SymphonyRoomReqRep]
GATEWAY_VALUE                            { \"emailDistribution\" : { \"to\" : ... STRING
INCOMING_TOPIC                                                                    STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```

### Insert NOTIFY_ROUTE

Navigate to **/home/genesis/run/temp-data** in your WSL terminal and create a file called **notify_route.csv**, in the following [format](/server/integration/notify/email/#notify_route).

```csv title="notify_route.csv"
ENTITY_ID,ENTITY_ID_TYPE,TOPIC_MATCH,GATEWAY_ID
,"GATEWAY","PositionAlert","EmailDistribution1" 
```

Then run:

```bash
SendIt -f notify_route.csv -t NOTIFY_ROUTE
```

To check that the file was imported correctly, run `DbMon`, `table NOTIFY_ROUTE` then `search 1`. You should see the following:

```bash title="Contents of table NOTIFY_ROUTE"
NOTIFY_ROUTE
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-09-06 14:33:35.763(n:0,s:3357)      NANO_TIMESTAMP
ENTITY_ID                                                                         STRING
ENTITY_ID_TYPE                           GATEWAY                                  ENUM[USER_NAME PROFILE_NAME GATEWAY]
GATEWAY_ID                               EmailDistribution1                       STRING
NOTIFY_ROUTE_ID                          c0a645f7-4d53-48eb-99b8-87b56f42bc45N... STRING
TOPIC_MATCH                              PositionAlert                            STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```

## Build and deploy the application

Now run the following commands in order:

1. `assemble`
2. `positions-app-tutorial-config:assemble`
3. `install-positions-app-tutorial-site-specific`
4. `deploy-genesisproduct-positions-app-tutorial`

Once deployed, run `mon`. You should be able to see the Evaluator process is present, but on `STANDBY`.

This is because the Evaluator process is set to run only on the primary node. Our application only has one node, but we still have to identify it as the primary node.

Run `SetPrimary` in your WSL terminal and you should be able to see all processes running.

## Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY so that we can see some additional data in the logs.

Run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command for that:
<!-- TODO: add LogLevel section to Server Commands -->

```shell title="From the WSL Distribution"
LogLevel -p POSITIONS_APP_TUTORIAL_EVALUATOR -DATADUMP_ON -l DEBUG
LogLevel -p POSITIONS_APP_TUTORIAL_NOTIFY -DATADUMP_ON -l DEBUG
```

And then to see the logs run:
```shell title="From the WSL Distribution"
cd $L
tail -f POSITIONS_APP_TUTORIAL_EVALUATOR.log
```
:::tip
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis Platform. Feel free to use your favorite command to view logs such as tail, less etc.
:::

## Trigger the event to test the rule

So, let's see if that has worked.

Insert the file **POSITION.csv** into the database. This is the file that you prepared earlier; it contains a value that breaches a limit, so it should trigger our event.

```bash title="From the WSL Distribution"
SendIt -f position.csv -t POSITION
```

You can see that when the limit is breached, you receive an email automatically.

:::note
Go to https://www.wpoven.com/tools/free-smtp-server-for-testing and access the inbox *dev-training@freesmtpserver.com*
:::

This section showed how to trigger events based on a condition in the database. This enables you to raise alarms on certain conditions or to react to specific states. In the next section you will see how to run static events.


## Static rules (Cron rules)

It is often useful to run tasks periodically - for example, to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes, the Genesis low-code platform provides a feature called the [Evaluator](/server/evaluator/introduction/). In system terms, Evaluators enable you to connect [Event Handlers](/server/event-handler/introduction/) to two different kinds of event: dynamic and static (cron rules): 

- __Cron Rules__  are scheduling rules; these are static events, defined as [standard cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression). 
- __Dynamic Rules__, also known as dynamic events, are defined as [groovy expressions](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.

In both cases, you define the rule in a table in the database: `CRON_RULES` for static rules and `DYNAMIC_RULES` for dynamic rules. In this section, we're going to use `CRON_RULES`.

### Cron rules (static events)

Let's create a cron rule that triggers a batch job to run once every 30 seconds.

The batch job will generate a position report as a csv for each counterparty. This will be stored in genesis environemnts **runtime/position-30seconds-report**. The file name of each report written will be in the format **[COUNTERPARTY_ID]-[DATE].csv**.

### The rule

Our cron rule takes the following form:

| CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | NAME | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0/30 * * * * ? * | It’s a rule | Europe/London | ENABLED | A rule | JaneDee | POSITIONS_APP_TUTORIAL_EVALUATOR | EVENT_POSITION_REPORT |  |

Let's look at the most important fields:

* **RULE_STATUS** can be **ENABLED** or **DISABLED**.
* **CRON_EXPRESSION** determines when the rule is evaluated.
* **PROCESS_NAME** is the target process for the rule. When the rule is triggered, it will send a message to the process specified here.
* **MESSAGE_TYPE** is the message that needs to be sent to the specified **PROCESS_NAME**.
* **RESULT_EXPRESSION** is the value or values that will be sent as part of the transaction to the target PROCESS_NAME; we can leave RESULT_EXPRESSION empty, as we are going to generate a report for all positions anyway.

:::info
We use [Quartz](http://www.quartz-scheduler.org/) to manage our cron expression. All cron expression formats should match that of Quartz specification.
:::

### Configure the Evaluator

An Evaluator is a process that runs cron jobs. 
To start, create a process called **POSITIONS_APP_TUTORIAL_EVALUATOR** and add it to the file **positions-app-tutorial-processes.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** as the code below.

```xml
<process name="POSITIONS_APP_TUTORIAL_EVALUATOR">
    <start>true</start>
    <groupId>POSITIONS_APP_TUTORIAL</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-evaluator</module>
    <primaryOnly>true</primaryOnly>
    <package>global.genesis.eventhandler,global.genesis.evaluator</package>
    <description>Dynamic/time rules engine</description>
</process>
```

Add the `POSITIONS_APP_TUTORIAL_EVALUATOR` to the file **positions-app-tutorial-service-definitions.xml** inside your project folder **server/jvm/positions-app-tutorial-config/src/main/resources/cfg** with the code below. 

```xml
<service host="localhost" name="POSITIONS_APP_TUTORIAL_EVALUATOR" port="11003"/>
```

### Create a new class
Now we need to create a `PositionReport` class to trigger the new event. This class should be created under **server/jvm/positions-app-tutorial-messages/src/main/kotlin/global/genesis/messages/event**.

```kotlin
class PositionReport
```

### Create an eventHandler

Next we need to create an `EventHandler` codeblock that will write the csv files to the **runtime/position-30seconds-report** folder. First, open the **positions-app-tutorial-eventhandler.kts** file and add a variable called `tradeViewRepo`, injecting the class `TradeViewAsyncRepository`:

```kotlin
val tradeViewRepo = inject<TradeViewAsyncRepository>()
```

Then, add this an `EventHandler` codeblock to generate the csv file:

```kotlin
eventHandler<PositionReport>(name = "EVENT_POSITION_REPORT", transactional = true) {
    onCommit {
        val mapper = GenesisJacksonMapper.csvWriter<TradeView>()
        val today = LocalDate.now().toString()
        val positionReportFolder = File(GenesisPaths.runtime()).resolve("position-30seconds-report")
        if (!positionReportFolder.exists()) positionReportFolder.mkdirs()

        tradeViewRepo.getBulk()
            .toList()
            .groupBy { it.counterpartyCounterpartyName }
            .forEach { (counterParty, trades) ->
                val file = positionReportFolder.resolve("${counterParty}_$today.csv")
                if (file.exists()) file.delete()
                mapper.writeValues(file).use { it.writeAll(trades) }
            }
        ack()
    }
}
```

Now run the following commands in order:

1. `assemble`
2. `positions-app-tutorial-config:assemble`
3. `deploy-genesisproduct-positions-app-tutorial`


Once deployed, run `mon`. You should be able to see the process is present, but on `STANDBY`.

This is because the Evaluator process is set to run only on the primary node. Our application only has one node, but we still have to identify it as the primary node.

Run `SetPrimary` in your WSL terminal and you should be able to see all processes running.

### Load the cron rule on to the database
Now we can load the cron rule csv below into the database, [CRON_RULE](/server/evaluator/configuring-runtime/#cron_rule-table) Table.

Navigate to **home/genesis/run/temp-data** in your WSL terminal and create a file called **cron-rule.csv** with the following:

```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE
"0/30 * * * * ? *","It’s a rule","Europe/London","ENABLED","A rule","JaneDee","POSITIONS_APP_TUTORIAL_EVALUATOR","EVENT_POSITION_REPORT"
```

Now we need to import this cron rule into our `CRON_RULE` table. Run the following command in your WSL terminal:

```bash
SendIt -f cron-rule.csv -t CRON_RULE
```

To check that the file was imported correctly, run `DbMon`, `table CRON_RULE` then `search 1`. You should see the following:

```bash
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-09-05 13:15:42.719(n:0,s:3625)      NANO_TIMESTAMP
CRON_EXPRESSION                          0/30 * * * * ? *                         STRING
DESCRIPTION                              It’s a rule                              STRING
MESSAGE_TYPE                             EVENT_POSITION_REPORT                    STRING
NAME                                     A rule                                   STRING
PROCESS_NAME                             POSITIONS_APP_TUTORIAL_EVALUATOR         STRING
RESULT_EXPRESSION                                                                 STRING
RULE_STATUS                              ENABLED                                  ENUM[ENABLED DISABLED]
TIME_ZONE                                Europe/London                            STRING
USER_NAME                                JaneDee                                  STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```

### Change the log level
You can now change the log level to verify the execution of the events. To do this, run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command:

```shell
LogLevel -p POSITIONS_APP_TUTORIAL_EVALUATOR -DATADUMP_ON -l DEBUG
```

And then to see the logs, run:
```shell
cd $L
tail -f POSITIONS_APP_TUTORIAL_EVALUATOR.log
```
:::info What is $L?
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis low-code platform. Feel free to use your favourite command to view logs such as tail, less etc.
:::

### Conclusion
This concludes generating reports for the positions application. In the next section you will see how to trigger based on a condition in the database.
