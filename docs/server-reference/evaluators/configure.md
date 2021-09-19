---
title: Configure your Evaluator
sidebar_label: Configure your Evaluator
sidebar_position: 1
id: configure
---

Evaluators allow developers to connect Event Handlers to two different kind of events.

1. *Dynamic Rules*, are defined as groovy expression, which respond to changes to database table entries
2. *Cron Rules*, ie Timing Rules are defined as standard cron expressions. 

Both kind of event captures are defined in the database in tables DYNAMIC_RULES and CRON_RULES respectively. In both cases the GENESIS_EVALUATOR must be configured to be running.
The configuration to run the GENESIS_EVALUATOR in available by default, but the process must be switched on.

eg, assuming having a file called `/home/trading/run/site-specific/cfg/genesis-processes.xml`, we can simply switch, start from true to false, making sure to run 
"genesisInstall -> killServer -> startServers", so that configuration takes effect.

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

Note, the evaluator only runs on a primary node with the cluster. You can set your node to primary with the command `SetPrimary`, otherwise the GENESIS_EVALUATOR will go into STANDBY mode.

Once you have a GENESIS_EVALUATOR up and running we can insert either rules or cron events.

To define a rule, you need to insert a row into the `DYNAMIC_RULE` table, the table is defined as follows

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


To define a timed based event, a user needs to insert a row into the `CRON_RULE` table, the table is defined as follows


| Field Name | Usage |
| --- | --- |
| CRON_EXPRESSION | [Standard Cron Expression](https://en.wikipedia.org/wiki/Cron#CRON_expression) |
| DESCRIPTION | Simple Description |
| TIME_ZONE | eg Europe/London |
| RULE_STATUS | This is either "ENABLED" or "DISABLED", respectively enables or disables the rule  |
| NAME | usage |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined  |
| RESULT_EXPRESSION | this is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE |

Note: Groovy Expressions need to be surrounded in brackets.


In both Dynamic and Cron Rules, MESSAGE_TYPE fields defines the Java/kotlin Class that is instantiated and set by the RESULT_EXPRESSION 
(fields which are set in the expression but are not on the Class are ignored). The Instantiated class is sent to the EventHandler implementation defined in the process
identified by PROCESS_NAME 

eg, To setup a MESSAGE_TYPE, simple create an appropriate data class `trading_app-server\trading_app-messages\src\main\java\global\genesis\trading_app\message\event\PositionCancel.kt`


```kotlin
package global.genesis.trading_app.message.event

data class PositionCancel(
    val positionId: String,
)
```

eg. event handlers that inserts a Notify message, which includes an email message into the database.

To setup the EventHandler ` trading_app-script-config\src\main\resources\scripts\trading_app-eventhandler.kts`, with code:-

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

Event handlers are covered in more detail here.
