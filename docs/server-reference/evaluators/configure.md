---
title: Configure your Evaluator
sidebar_label: Configure your Evaluator
sidebar_position: 1
id: configureEVal
---
#Configure your Evaluator

Genesis supports the ability to attach Event Handlers to changes in the database.

To enable this function you need to have the GENESIS_EVALUATOR process running

Instructions on how to (switch on) an GENESIS_EVALUATOR

To create a rule that will monitor for changes in database you need to setup a  "dynamic_rule". This is simply setup by inserting a row into the genesis DYNAMIC_RULE table

| Field Name | Usage |
| --- | --- |
| NAME | Name of the Rule |
| DESCRIPTION | Simple Description |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| RULE_TABLE | The Table to listen to for changes |
| RULE_STATUS | This is either "ENABLED" or "DISABLED" and respectively enables or disables the rule  |
| RULE_EXPRESSION | This is a [groovy expression](https://groovy-lang.org/syntax.html) which is evaluated when their is a table change on RULE_TABLE, if this evaluates to true, then the RESULT_EXPRESSION logic is activated |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined |
| RESULT_EXPRESSION | this is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE |

| Field Name | Usage |
| --- | --- |
| CRON_EXPRESSION | [Standard Cron Expression](https://en.wikipedia.org/wiki/Cron#CRON_expression) |
| DESCRIPTION | Simple Description |
| TIME_ZONE | eg Europe/London |
| RULE_STATUS | This is either "ENABLED" or "DISABLED" and respectively enables or disables the rule  |
| NAME | useage |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined  |
| RESULT_EXPRESSION | this is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE |


```groovy 
(QUANTITY > 500) 
```

```groovy
(POSITION_ID = POSITION_ID)
```


```bash
    vi /home/trading/run/site-specific/cfg/genesis-processes.xml
```
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

```bash
    trading_app-server\trading_app-messages\src\main\java\global\genesis\trading_app\message\event\PositionCancel.kt
```
```kotlin
package global.genesis.trading_app.message.event

data class PositionCancel(
    val positionId: String,
)
```


```bash
  trading_app-script-config\src\main\resources\scripts\trading_app-eventhandler.kts
```
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


