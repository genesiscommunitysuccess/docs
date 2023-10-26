---
title: 'Evaluator - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, evaluator, basics]
tags:
  - server
  - evaluator
  - basics
---


## Dynamic rules
This feature enables you to raise alarms on certain conditions or to react on specific states. Dynamic rules respond to changes in database tables. For instance, if a figure goes above a certain threshold, the rule could trigger a warning email to be sent out.

## Defining a dynamic rule
To define a rule, you need to insert a row into the DYNAMIC_RULE table. This table is defined as follows:

| Field Name | Usage |
| --- | --- |
| NAME | Name of the Rule |
| DESCRIPTION | Simple description of the function of the rule |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| RULE_TABLE | The table to listen to for changes, e.g. |
| RULE_STATUS | This is either "ENABLED" or "DISABLED" and respectively enables or disables the rule  |
| RULE_EXPRESSION | This is a [groovy expression](https://groovy-lang.org/syntax.html), which is evaluated when there is a table change on RULE_TABLE, if this evaluates to true, then the RESULT_EXPRESSION logic is activated e.g. `(QUANTITY > 500)` |
| PROCESS_NAME | Process Name to send the event  e.g. POSITION_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined |
| RESULT_EXPRESSION | This is a [groovy expression](https://groovy-lang.org/syntax.html), which should set on the MESSAGE Object that is defined in MESSAGE_TYPE e.g. `(POSITION_ID = POSITION_ID)`|

:::note
Groovy expressions need to be surrounded by brackets.
:::

MESSAGE_TYPE fields define the Java/Kotlin class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example, POSITION_CANCEL maps to PositionCancel).

Fields that are set in the expression but which are not on the class are ignored. The instantiated class is sent to the Event Handler implementation defined in the process identified by PROCESS_NAME.

To set up a MESSAGE_TYPE for the Event Handlers, simply create an appropriate data class: for example, `position_app-server\position_app-messages\src\main\java\global\genesis\position_app\message\event\PositionCancel.kt`.

Rules can be loaded into the database by creating a csv file containing the rules in the above format.
The following is an example of a csv file, which can be loaded into the database by saving as **DYNAMIC_RULE.csv** and running `sendIt`:

```csv
NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION
MY_RULE,It’s a rule,POSITION,ENABLED,(QUANTITY > 500),JaneDee,ALPHA_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) && (POSITION_ID = POSITION_ID))
```

To set up a `MESSAGE_TYPE` for the Event Handlers, simply create an appropriate data class: for example, _application-name_**-server\\**_application-name_**-messages\src\main\java\global\genesis\\**_application-name_**\message\event\PositionCancel.kt**.
```kotlin
package global.genesis.position_app.message.event

data class PositionCancel(
    val positionId: String,
)
```

So if the `RULE_TABLE` is set to `POSITION`, and the `RULE_EXPRESSION` is set to `(POSITION_ID = POSITION_ID)`, then this will take the `POSITION_ID` from the `POSITION` table and set it on the `PositionClass` object that gets instantiated and ultimately sent to the Event Handler.

For example, if you have an Event Handler that inserts a [Notify](../../../server/integration/notify/configuring/) email message, you could set up the Event Handler in this way in the _application_**-script-config\src\main\resources\scripts\application-eventhandler.kts** file:


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
For the example above to work, you need to set up a [Notify](../../../server/integration/notify/configuring/) process together with inserting a GATEWAY and a NOTIFY_ROUTE in the database and add the details of the connection for the SMTP server to the **genesis-system-definition.kts** file.
You can see an example of a dynamic rule using [Notify](../../../server/integration/notify/configuring/) email messages being configured in our [tutorial](../../../getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#dynamic-rules-conditional-rules).
## Static rules
Static rules are used to create scheduled activities. For instance to schedule the production of EOD reports, or to run a batch report on the hour.

## Defining a static rule
To define a scheduled event, you need to insert a row into the `CRON_RULE` table. This row must specify the CRON schedule that triggers the event. The table is defined as follows:

| Field Name | Usage |
| --- | --- |
| NAME | Name of the rule |
| CRON_EXPRESSION | [Quartz Cron Expressions](http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html)|
| DESCRIPTION | Simple description of the function of the rule |
| TIME_ZONE | eg Europe/London |
| RULE_STATUS | This is either "ENABLED" or "DISABLED", respectively enables or disables the rule  |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| PROCESS_NAME | Process Name to send the Event  e.g. POSITION_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The message type that will be defined  |
| RESULT_EXPRESSION | This is a [groovy expression](https://groovy-lang.org/syntax.html) which should set on the MESSAGE Object that is defined in MESSAGE_TYPE |

MESSAGE_TYPE fields define the Java/Kotlin class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example, POSITION_CANCEL maps to PositionCancel).

### Load the static (Cron) rule 
To load a static (Cron) rule into the database, create a csv file with the rule in the above format. Call the file **CRON_RULE.csv**.
```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE
"* 15 7 ? * MON-FRI *","Week days at 7.15","Europe/London","ENABLED","A rule","JaneDee","ALPHA_EVENT_HANDLER","EVENT_POSITION_REPORT"
```

Load the cron rule **CRON_RULE.csv** file into the `CRON_RULE`  [table](../../../server/evaluator/configuring-runtime/#cron_rule-table).

Run `SendIt`

You can see an example of a static rule being configured in our [tutorial](../../../getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#static-rules-cron-rules).
