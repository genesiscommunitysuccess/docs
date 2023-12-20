---
title: Server Developer Training - Day two
sidebar_label: Day two
sidebar_position: 3
id: 01_ssdt-day2
keywords: [getting started, developer training, server training, day two]
tags:
    - getting started
    - developer training
    - server training
    - day two
---
This day covers:

- [Notify](#notify)
- [Dynamic rules​](#dynamic-rules)
- [Advanced views​​](#advanced-views)

## Notify

The Genesis platform includes a notification module called *GENESIS_NOTIFY* by default. It does not run automatically and, starting from GSF version 6.6.x, there is a package available for it: `genesis-notify`.

As you have already cloned the Server Developer Training starting repository from [here](https://github.com/genesiscommunitysuccess/servertraining-seed), you have everything you need to run it.

The manual steps to use the `genesis-notify` package are not difficult: 

1. Add a reference to your *server/jvm/alpha-dictionary-cache* **build.gradle.kts** file, such as [this](https://github.com/genesiscommunitysuccess/servertraining-alpha/blob/main/server/jvm/alpha-dictionary-cache/build.gradle.kts#L11).

2. Add a reference to your *server/jvm/alpha-deploy* **build.gradle.kts** file, like [this](https://github.com/genesiscommunitysuccess/servertraining-alpha/blob/main/server/jvm/alpha-deploy/build.gradle.kts#L27).

3. Finally, include a variable indicating the `genesis-notify` version, as demonstrated [here](https://github.com/genesiscommunitysuccess/servertraining-alpha/blob/main/server/jvm/gradle.properties#L7).

Now you can run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process) tasks to verify that the new process works as expected.

You can then run `mon`.

As we are building using the `genesisInstall` command with the `--compactProcesses` option, the *GENESIS_NOTIFY* process will be running under *GENESIS_COMPACT_PROCESS*.

### Set up GENESIS_NOTIFY in the database

Create a file GATEWAY.csv as shown below and insert it in the table GATEWAY using the command `SendIt`.

```csv
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EmailDistribution1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

### Insert NOTIFY_ROUTE

Create a file NOTIFY_ROUTE.csv as shown below, then insert it in the table NOTIFY_ROUTE using the command `SendIt`.

```csv
ENTITY_ID,ENTITY_ID_TYPE,TOPIC_MATCH,GATEWAY_ID
,"GATEWAY","PositionAlert","EmailDistribution1" 
```

### Add connection details to the system definition

Open the **alpha-system-definition.kts** file and add the details of the connection for the SMTP server:
```kotlin {5-11}
...
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

Run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process) tasks again.

### Switch on data dumps

Data dumps need to be switched on for EVALUATOR so we can see some additional data in the logs.

Run the [LogLevel](../../../operations/commands/server-commands/#loglevel-script) command to do this:

```shell
LogLevel -p ALPHA_EVALUATOR -DATADUMP_ON -l DEBUG
```

And then to see the logs run:
```shell
cd $L
tail -f ALPHA_EVALUATOR.log
```
:::tip
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis platform. Feel free to use your favourite command to view logs such as tail, less etc.
:::

## Dynamic rules

In system terms, Evaluators enable you to connect Event Handlers to two different kinds of event: dynamic and static (cron rules): 

- __Cron Rules__  are scheduling rules; these are defined as [quartz cron expressions](http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html).
- __Dynamic Rules__, also known as Dynamic Events, are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.

In both cases, you define the rule in a table in the database: 

- CRON_RULES for static rules
- and DYNAMIC_RULES for dynamic rules

Assuming we have already set up the Evaluator, our extended application should be able to create reports daily. 

Now you are going to use the Evaluator again to set up dynamic rules. In this case, you want to send an email automatically if a specified limit has been breached.

### Preparation

First, check that you have the Evaluator running. If it is not, check the procedure at the beginning of the exercise on  [setting up a cron rule](../../developer-training/training-content-day5/#cron-rules-static-events).

You need to create two csv files for this. The first is the file with your rule in the correct format, similar to the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

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

### Exercise 2.1 Trigger the event to test the rule

:::info ESTIMATED TIME
15 mins
:::

So, let's see if that has worked.

Insert the file POSITION.csv into the database. This is the file that you prepared earlier; it contains a value that breaches a limit, so it should trigger our event.

You can see that when the limit is breached, you receive an email automatically.

:::tip
Go to https://www.wpoven.com/tools/free-smtp-server-for-testing and access the inbox *dev-training@freesmtpserver.com*
:::


## Advanced views

Views enable you join related tables to create a single holistic view. In short, Views are the genesis equivalent of SQL select queries. Views are defined in the file _application-name_**-view-dictionary.kts**. If your application is called **rubicon**, then the file name will be **rubicon-view-dictionary.kts**.

Unlike tables, views do not have any data of their own, they are read-only, but present a view based on one or more tables. We saw basic concepts and common usages of views in the [Developer Training](../../../getting-started/developer-training/training-intro/). Now we are exploring advanced concepts for views, such as **INNER vc OUTER joins**, **Parameterised joins**, and **Dynamic joins**.

### INNER and OUTER joins

Available join types are INNER and OUTER. If you do not specify the type, it defaults to OUTER.

- `INNER` joins require all joins to match exactly; if one single join fails to match, the row will be discarded.

```kotlin {1}
joining(INSTRUMENT, JoinType.INNER) {
    on(TRADE { INSTRUMENT_ID } to INSTRUMENT { INSTRUMENT_ID })
```

- `OUTER` joins provide null references for failed joins and will still allow the row to be built.


#### Dictionary-joined tables
When tables are joined in the dictionary, you are able to join to those tables in views directly, without having to specify the fields on which to join. This does not currently work with aliased tables.

Joining on fields:

```kotlin
joining(TRADE_TO_SIDE) {
    on(TRADE { TRADE_ID } to TRADE_TO_SIDE { TRADE_ID })
```
Joining using join:

```kotlin
joining(TRADE.JOIN_TRADE_TO_SIDE)
```
### Parameterised joins
Some join operations require external parameters that are not available in the context of the table-join definition, but will be available when the view repository is accessed (e.g. client enriched definitions), so an option exists to create parameterised joins.

These are typically used in Request Server queries:

```kotlin
view("INSTRUMENT_PARAMETERS", INSTRUMENT) {
    joins {
        joining(ALT_INSTRUMENT_ID, JoinType.INNER) {
            on(INSTRUMENT.ID to ALT_INSTRUMENT_ID.INSTRUMENT_ID)
                .and(ALT_INSTRUMENT_ID.ALTERNATE_TYPE.asParameter())
        }
    }
    fields {
        ALT_INSTRUMENT_ID {
            ALTERNATE_CODE withAlias "INSTRUMENT_CODE"
        }
        INSTRUMENT {
            NAME withPrefix INSTRUMENT
        }
    }
}
```

So for the above, if we had a Request Server using the view, it would make `ALTERNATE_TYPE` available as a field input parameter.

### Dynamic joins
These have a shared syntax with derived fields. However, rather than specifying a field name and type, the view should always return an entity index type of the table you’re joining on.

As with derived fields, you can use the `withEntity` and the `withInput` syntax. However, the lambda should always return an entity index object or null. Also, it should always return the same type. It is not possible to switch dynamically between indices, so it should always return the same type or null. It is possible to add further `and` clauses afterwards.

#### Examples

##### Example 1
Before:
```kotlin
joining(fix, backwardsJoin = true) {
   on(TRADE_TO_SIDE { FIX_ID } to fix { SIDE_ID })
      .and(fix { SIDE_TYPE } to SideType.FIX)
      .joining(fixCal, JoinType.INNER, backwardsJoin = true) {
        on(fix { CALENDAR_ID } to fixCal { CALENDAR_ID })
      }
```
After:
```kotlin
joining(fix, backwardsJoin = true) {
   on {
      withEntity(TRADE_TO_SIDE) { tradeToSide ->
        TradeSide.BySideId(tradeToSide.fixId)
      }
   }
   .and(fix { SIDE_TYPE } to SideType.FIX)
   .joining(fixCal, JoinType.INNER, backwardsJoin = true)
```

##### Example 2
Before:
```kotlin
joining(fixCal, JoinType.INNER, backwardsJoin = true) {
    on(fix { CALENDAR_ID } to fixCal { CALENDAR_ID })
}
```
After:
```kotlin
.joining(fixCal, JoinType.INNER, backwardsJoin = true) {
   on {
      withInput(fix { CALENDAR_ID }) { calendarId ->
         when (calendarId) {
            null -> null
            else -> TradeCalendar.ByCalendarId(calendarId)
         }
      }
   }
}
```

### Exercise 2.2 Changing TRADE_VIEW JOINs

:::info ESTIMATED TIME
15 mins
:::

Change the TRADE_VIEW JOINs types to INNER. Make sure the syntax uses curly brackets to link fields, and that the JOINs statements are simplified with Dictionary-joined.
