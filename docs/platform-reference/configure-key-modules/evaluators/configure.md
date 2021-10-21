---
title: Evaluator
sidebar_label: Evaluator
sidebar_position: 1
id: configure
---

You can use the evaluator to schedule the production of EOD reports (for example), or to send warnings when a defined limit is breached.

In system terms, evaluators enable you to connect event handlers to two different kinds of event: dynamic and static (cron rules). 

1. __Dynamic Rules__, which are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries, and
2. __Cron Rules__, which are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression). 

In both cases, you define the rule in a table in the database: DYNAMIC_RULES for dynamic rules and CRON_RULES for static rules. 

## Enabling the evaluator
The evaluator process is not enables by default. Before you can use the GENESIS_EVALUATOR, you must enable it in your _application_**-genesis-processes.xml** file.

The example below is for a standard genesis file for controlling `/home/trading/run/site-specific/cfg/genesis-processes.xml`. You  simply switch, `start` from `false` to `true`. Then run 
"`genesisInstall` -> `killServer` -> `startServers`", so that the configuration takes effect.

```xml {2}
<process name="GENESIS_EVALUATOR">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-evaluator</module>
    <primaryOnly>true</primaryOnly>
    <package>global.genesis.eventhandler,global.genesis.evaluator</package>
    <description>Dynamic/time rules engine</description>
</process>
```

__Note__: the evaluator only runs on a primary node within the cluster. You can set your node to primary with the command `SetPrimary`.If you do not do this,   the GENESIS_EVALUATOR will go into STANDBY mode.

### Defining a dynamic rule
Once you have a GENESIS_EVALUATOR up and running, you can create your desired rules.

To define a rule, you need to insert a row into the DYNAMIC_RULE table. This  table is defined as follows:


### DYNAMIC_RULE Table
| Field Name | Usage |
| --- | --- |
| NAME | Name of the Rule |
| DESCRIPTION | Simple description of the function of the rule |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| RULE_TABLE | The Table to listen to for changes, eg |
| RULE_STATUS | This is either "ENABLED" or "DISABLED" and respectively enables or disables the rule  |
| RULE_EXPRESSION | This is a [groovy expression](https://groovy-lang.org/syntax.html) which is evaluated when their is a table change on RULE_TABLE, if this evaluates to true, then the RESULT_EXPRESSION logic is activated eg `(QUANTITY > 500)` |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined |
| RESULT_EXPRESSION | this is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE eg `(POSITION_ID = POSITION_ID)`|

__Note__: Groovy Expressions need to be surrounded by brackets.


In both Dynamic and Cron Rules, MESSAGE_TYPE fields define the Java/kotlin Class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example,POSITION_CANCEL maps to PositionCancel).

Fields that are set in the expression but which are not on the class are ignored. The instantiated class is sent to the EventHandler implementation defined in the process identified by PROCESS_NAME.

To set up a MESSAGE_TYPE for the event handlers, simply create an appropriate data class, for example: `trading_app-server\trading_app-messages\src\main\java\global\genesis\trading_app\message\event\PositionCancel.kt`.
```kotlin
package global.genesis.trading_app.message.event

data class PositionCancel(
    val positionId: String,
)
```

So if the RULE table is set to `POSITION`, and the RULE_EXPRESSION is set to `(POSITION_ID = POSITION_ID)`, then this will take the POSITION_ID from the POSITION table and set it on the PositionClass object that gets instantiated  
and ultimately sent to the event handler.

For example, if you have an event handler that inserts a [Notify](/platform-reference/integrations/notify/configure/) email message, you could set up the event handler in this way in the _application_**-script-config\src\main\resources\scripts\application-eventhandler.kts** file:


```kotlin
{
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
}

```


### Defining a static rule
To define a scheduled event, you need to insert a row into the `CRON_RULE` table. This row must specify the CRON schedule that triggers the event. The table is defined as follows:
 

### CRON_RULE Table
| Field Name | Usage |
| --- | --- |
| NAME | Name of the Rule |
| CRON_EXPRESSION | [Standard Cron Expression](https://en.wikipedia.org/wiki/Cron#CRON_expression) |
| DESCRIPTION | Simple description of the function of the rule |
| TIME_ZONE | eg Europe/London |
| RULE_STATUS | This is either "ENABLED" or "DISABLED", respectively enables or disables the rule  |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined  |
| RESULT_EXPRESSION | this is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE |