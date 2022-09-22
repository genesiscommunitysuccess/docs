---
id: 01_ssdt-day2
title: Day two
sidebar_label: Day two
sidebar_position: 3

---
This day covers:

- [Notify](#notify)
- [Dynamic rules​](#dynamic-rules)
- [Advanced views​​](#advanced-views)

## Notify

The Genesis Platform has a notification module named by default *GENESIS_NOTIFY*. It does not run by default. To change this, we are adding a customised module to our project. To do that, create a process called `ALPHA_NOTIFY` and add it to the file **alpha-processes.xml** in your project folder **server/jvm/alpha-config/src/main/resources/cfg** using the code below.

```xml
<processes>
    ...
    <process name="ALPHA_NOTIFY">
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
Add the `ALPHA_EVALUATOR` to the file **alpha-service-definitions.xml** inside your project folder **server/jvm/alpha-config/src/main/resources/cfg** using the code below. 

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_NOTIFY" port="11004"/>
</configuration>
```

Run the `assemble` and `deploy-genesisproduct-alpha` tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present.
![](/img/standbysmall-alpha-notify.png)

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

Run the `build`, `install-alpha-site-specific` and `deploy` tasks again.

### Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY so we can see some additional data in the logs.

Run the [LogLevel](/operations/commands/server-commands/#loglevel-script) command to do this:

```shell
LogLevel -p ALPHA_EVALUATOR -DATADUMP_ON -l DEBUG
LogLevel -p ALPHA_NOTIFY -DATADUMP_ON -l DEBUG
```

And then to see the logs run:
```shell
cd $L
tail -f ALPHA_EVALUATOR.log
```
:::tip
$L is an alias to the logs folder (~/run/runtime/logs) provided by the Genesis platform. Feel free to use your favorite command to view logs such as tail, less etc.
:::

## Dynamic rules

In system terms, Evaluators enable you to connect Event Handlers to two different kinds of event: dynamic and static (cron rules): 

- __Cron Rules__  are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression). 
- __Dynamic Rules__, also known as Dynamic Events, are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.

In both cases, you define the rule in a table in the database: CRON_RULES for static rules and DYNAMIC_RULES for dynamic rules. Presuming we already did the Evaluator setup, our extended application should be able to create reports daily. Now you are going to use the Evaluator again to set up dynamic rules. In this case, you want to send an email automatically if a specified limit has been breached.

### Preparation

First, check that you have the Evaluator running. If it is not, check the procedure at the beginning of the exercise on  [setting up a cron rule](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#configure-the-evaluator).

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

#### Exercise 2.1 Trigger the event to test the rule

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

Unlike tables, views do not have any data of their own, they are read-only, but present a view based on one or more tables. We saw basic concepts and common usages of Views in the [Developer Training](/getting-started/developer-training/training-intro/). Now we are exploring Views advanced concepts like **INNER vc OUTER joins**, **Parameterised joins**, and **Dynamic joins**.

### INNER vc OUTER joins

Available join types are INNER and OUTER. If you do not specify the type, it defaults to OUTER.

- `INNER` joins require all joins to match exactly; if one single join fails to match, the row will be discarded.

```kotlin {1}
joining(INSTRUMENT, JoinType.INNER) {
    on(TRADE { INSTRUMENT_ID } to INSTRUMENT { INSTRUMENT_ID })
```

- `OUTER` joins provide null references for failed joins and will still allow the row to be built.

```kotlin
joining(INSTRUMENT) {
    on(TRADE { INSTRUMENT_ID } to INSTRUMENT { INSTRUMENT_ID })
```

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
These have a shared syntax with derived fields. However, rather than specifying a field name and type, it should always return an entity index type of the table you’re joining on.

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

#### Exercise 2.2 Changing TRADE_VIEW JOINs

:::info ESTIMATED TIME
15 mins
:::

Change the TRADE_VIEW JOINs types to INNER. Make sure the syntax is using curly brackets to link fields, and that the JOINs statements are simplified with Dictionary-joined.
