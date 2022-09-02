---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server-modules/evaluator/introduction) | [Basics](/server-modules/evaluator/basics) |  [Advanced](/server-modules/evaluator/advanced) | [More examples](/server-modules/evaluator/examples) | [Configuring runtime](/server-modules/evaluator/configuring-runtime) | [Testing](/server-modules/evaluator/testing)

### Defining a dynamic rule
To define a rule, you need to insert a row into the DYNAMIC_RULE table. This table is defined as follows:


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

**Note**: Groovy Expressions need to be surrounded by brackets.

MESSAGE_TYPE fields define the Java/kotlin Class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example,POSITION_CANCEL maps to PositionCancel).

Fields that are set in the expression but which are not on the class are ignored. The instantiated class is sent to the EventHandler implementation defined in the process identified by PROCESS_NAME.

To set up a MESSAGE_TYPE for the event handlers, simply create an appropriate data class, for example: `trading_app-server\trading_app-messages\src\main\java\global\genesis\trading_app\message\event\TradeCancel.kt`.
```kotlin
package global.genesis.trading_app.message.event

data class TradeCancel(val tradeId: Long)
```

So if the RULE_TABLE is set to `POSITION`, and the RULE_EXPRESSION is set to `(POSITION_ID = POSITION_ID)`, then this will take the POSITION_ID from the POSITION table and set it on the PositionClass object that gets instantiated and ultimately sent to the Event Handler.

For example, if you have an Event Handler that inserts a [Notify](/server-modules/integration/notify/configuring/) email message, you could set up the Event Handler in this way in the _application_**-script-config\src\main\resources\scripts\application-eventhandler.kts** file:


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

You can see an example of a dynamic rule being configured in our [tutorial](/getting-started/go-to-the-next-level/condition-rules/).

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

MESSAGE_TYPE fields define the Java/kotlin Class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example,POSITION_CANCEL maps to PositionCancel).

You can see an example of a static rule being configured in our [tutorial](/getting-started/go-to-the-next-level/time-rules/).