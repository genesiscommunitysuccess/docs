---
title: Configure your Evaluator
sidebar_label: Configure your Evaluator
sidebar_position: 1
id: configure
---

Evaluators allow developers to connect Event Handlers to two different kind of events.

1. __Dynamic Rules__, which are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries, and
2. __Cron Rules__, ie Scheduling Rules the are defined as standard [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression). 

Both kind of rules are defined in database, in the tables DYNAMIC_RULES and CRON_RULES respectively. In both cases the GENESIS_EVALUATOR must be configured to be running.
The configuration to run the GENESIS_EVALUATOR in available by default, but the process must be switched on to actively use.

eg: assuming we standard genesis file for controlling `/home/trading/run/site-specific/cfg/genesis-processes.xml`, we can simply switch, start from true to false, making sure to run 
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

__Note__: the evaluator only runs on a primary node within the cluster. You can set your node to primary with the command `SetPrimary`, otherwise the GENESIS_EVALUATOR will go into STANDBY mode.

Once you have a GENESIS_EVALUATOR up and running we can create our desired rules.

To define a rule, you need to insert a row into the DYNAMIC_RULE table, the table is defined as follows:-


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

__Note__: Groovy Expressions need to be surrounded in brackets.


In both Dynamic and Cron Rules, MESSAGE_TYPE fields defines the Java/kotlin Class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as 
SNAKE_CASE but the class is defined as regular Camel case. eg POSITION_CANCEL maps to PositionCancel.

Fields which are set in the expression but are not on the Class are ignored. The Instantiated class is sent to the EventHandler implementation defined in the process
identified by PROCESS_NAME 

To setup a MESSAGE_TYPE for the event Handlers, simple create an appropriate data class, eg `trading_app-server\trading_app-messages\src\main\java\global\genesis\trading_app\message\event\PositionCancel.kt`.
```kotlin
package global.genesis.trading_app.message.event

data class PositionCancel(
    val positionId: String,
)
```

So if the RULE table is set to `POSITION`, and the RULE_EXPRESSION, is set to `(POSITION_ID = POSITION_ID)`, then this will take the POSITION_ID from the POSITION table and set it on PositionClass object that get instantiated  
and ultimately sent to the Event Handler.

eg. event handlers that inserts a Notify Email message( see Notify)

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


To define a timed based event, a user needs to insert a row into the `CRON_RULE` table, with the CRON Scheduling driving the event. The table is defined as follows, with the same 

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