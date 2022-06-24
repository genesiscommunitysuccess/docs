---
id: training-content-day5
title: Day 5
sidebar_label: Day 5
sidebar_position: 5

---
In this day we are covering:

- [Schedulers](#schedulers)
- [Permissions​](#permissions)
- [Key server commands](#key-server-commands)
- [Navigating the documentation and how to get help​](#navigating-the-documentation-and-how-to-get-help​)

## Schedulers​
You can use the evaluator to schedule the production of EOD reports (for example), or to send warnings when a defined limit is breached.

In system terms, evaluators enable you to connect event handlers to two different kinds of event: dynamic and static (cron rules). 

1. __Cron Rules__, which are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression). 
2. __Dynamic Rules__, also known as Dynamic Events, are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries.

In both cases, you define the rule in a table in the database: CRON_RULES for static rules and DYNAMIC_RULES for dynamic rules. 

### Cron rules (static events)​

In this exercise you are going to create a cron rule that will trigger a batch job that will run once each day.

The batch job will generate a position report as a csv for each counterparty. This wil be stored in **runtime/position-daily-report**. The file name of each report written will have the form COUNTERPARTY_ID-DATE.csv.

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
* **RESULT_EXPRESSION** is the values that will be sent as part of the transaction to the target PROCESS_NAME, we can leave RESULT_EXPRESSION empty as we are going to generate a report for all positions anyway.



#### 1. Configure the Evaluator

An Evaluator is a process that runs cron jobs. 
To start, create a process called *ALPHA_EVALUATOR* and add it in the file **alpha-processes.xml** inside your project folder **server/jvm/alpha-config/src/main/resources/cfg** as the code below.

```xml
<processes>
    ...
    <process name="ALPHA_EVALUATOR">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>genesis-evaluator</module>
        <primaryOnly>true</primaryOnly>
        <package>global.genesis.eventhandler,global.genesis.evaluator</package>
        <description>Dynamic/time rules engine</description>
    </process>
</processes>
```

Add the *ALPHA_EVALUATOR* in the file **alpha-service-definitions.xml** inside your project folder **server/jvm/alpha-config/src/main/resources/cfg** as the code below. 

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
    <service host="localhost" name="ALPHA_EVALUATOR" port="11002"/>
</configuration>
```

Run **assemble** and **deploy-genesisproduct-alpha** tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present, but on Standby.
![](/img/standbysmall-alpha.png)

This is because the evaluator process is set to run only on the primary node. Our application only has one node, but we still have to identify it as the Primary node.

Run `SetPrimary` and you should be able to see all processes running.

#### 2. Create a new class.
When the evaluator is running, create a PostionReport class to trigger the new event. This class should be created inside your project folder **server/jvm/alpha-messages/src/main/kotlin/global/genesis/alpha/message/event** as the code below. 

```kotlin
global.genesis.alpha.message.event

class PositionReport()
```

#### 3. Create an event handler

Create an event handler that will write the csv files to the runtime/position-daily-report folder. Call it EVENT_POSITION_REPORT.

Open the file *alpha-eventhandler.kts* and add an event handler to generate the csv file:

```kotlin
import java.io.File
import java.time.LocalDate
import global.genesis.TradeStateMachine
import global.genesis.commons.standards.GenesisPaths
import global.genesis.gen.view.repository.TradeViewAsyncRepository
import global.genesis.jackson.core.GenesisJacksonMapper

eventHandler {
 //... other event handlers removed for clarity
     eventHandler<PositionReport> {
        onCommit {
            val mapper = GenesisJacksonMapper.csvWriter<TradeView>()
            val today = LocalDate.now().toString()
            val positionReportFolder = File(GenesisPaths.runtime()).resolve("position-daily-report")
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

#### 4.Load the cron rule on to the database
Load the cron rule csv below into the database, CRON_RULE Table. 
Run `SendIt`.

```csv
CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE
"0 * * ? * *","It’s a rule","Europe/London","ENABLED","A rule","JaneDee","ALPHA_EVENT_HANDLER","EVENT_POSITION_REPORT"
```

That's it.

### Dynamic rules

We have now set up the evaluator so that our application creates reports daily.

Now you are going to use the evaluator again to set up dynamic rules. In this case, you want to send an email automatically if a certain limit has been breached.

#### Preparation

First, check that you have the evaluator running. If it is not, check the procedure at the beginning of the exercise on  [setting up a cron rule](#cron-rules-static-events).

You need to create two csv files for this exercise.

The first is the file with your rule in the correct format, as you saw with the static cron rule in the previous exercise. Call the file DYNAMIC_RULE.csv.

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

#### 1. Set up the dynamic rule

To set up the dynamic rule, go to the DYNAMIC_RULE table and insert the *DYNAMIC_RULE.csv* file. Run `SendIt -t DYNAMIC_RULE -f DYNAMIC_RULE.csv`

#### 2. Set up the event handler message class

To define the event handler message class, create a Kotlin class called *PositionCancel* in your project folder **server/jvm/alpha-messages/src/main/kotlin/global/genesis/alpha/message/event**, and insert the following code:

```kotlin
package global.genesis.alpha.message.event

data class PositionCancel(
      val positionId: String,
)
```

#### 3. Update the event handler

The rule needs to call an event handler, which will be called `<PositionCancel>` using the class created in the previous step.
We have defined the event handler in the code block below. Open the file **alpha-eventhandler.kts** and insert the code block:

```kotlin
eventHandler<PositionCancel> {
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

#### 4. Set up the Notify module and start the process

The module GENESIS_NOTIFY does not run by default. To change this, we are adding a customized module in our project. To do that, create a process called *ALPHA_NOTIFY* and add it in the file **alpha-processes.xml** inside your project folder **server/jvm/alpha-config/src/main/resources/cfg** as the code below.

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
Add the *ALPHA_EVALUATOR* in the file **alpha-service-definitions.xml** inside your project folder **server/jvm/alpha-config/src/main/resources/cfg** as the code below. 

```xml
<configuration>
    <service host="localhost" name="ALPHA_DATASERVER" port="11000"/>
    <service host="localhost" name="ALPHA_EVENT_HANDLER" port="11001"/>
    <service host="localhost" name="ALPHA_EVALUATOR" port="11002"/>
    <service host="localhost" name="ALPHA_NOTIFY" port="11003"/>
</configuration>
```

Run **assemble** and **deploy-genesisproduct-alpha** tasks to verify that the new process works as expected.

Run `mon`.
You should be able to see the process is present.
![](/img/standbysmall-alpha-notify.png)

#### 5. Set up GENESIS_NOTIFY in the database

##### Insert Gateway Route

Create a file GATEWAY.csv as shown below and insert it in the table GATEWAY using the command `SentIt`.

```csv
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EmailDistribution1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

##### Insert NOTIFY_ROUTE

Create a file NOTIFY_ROUTE.csv as shown below and insert it in the table NOTIFY_ROUTE using the command `SentIt`.

```csv
ENTITY_ID,ENTITY_ID_TYPE,TOPIC_MATCH,GATEWAY_ID
,"GATEWAY","PositionAlert","EmailDistribution1" 
```

#### 6. Add connection details to the system definition

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

#### 7. Switch on data dumps

Data dumps need to be switched on for both EVALUATOR and NOTIFY.

Run the following commands:

```
LogLevel -p ALPHA_EVALUATOR -DATADUMP_ON
```
```
LogLevel -p ALPHA_NOTIFY -DATADUMP_ON
```

#### 8. Trigger the event to test the rule

So, let's see if that has worked.

Insert the file POSITION.csv into the database. This is the file that you prepared earlier; it contains a value that breaches a limit, so it should trigger our event.

You can see that when the limit is breached, you receive an email automatically.

:::note
Go to https://www.wpoven.com/tools/free-smtp-server-for-testing and access the inbox *dev-training@freesmtpserver.com*
:::

Well done!

#### Try yourself

Use the evaluator again to set up dynamic rules. Now we want to check when a position lower limit has been reached. The position lower limit is 10, so any position less than 10 should be warned (QUANTITY < 10). In this case, you want to send an email automatically letting the user know.

You can use the same parameter as the exercise we just did (SMTP credentials). Just remember to add the configurations and create a new  class for that, in this case `<PositionLowerLimit>`.

:::tip
Remember to add the record into the DYNAMIC_RULE table, create a test row in POSITION table, and add a new class defining it in the eventhanlder file.
:::

## Permissions​

At this stage, the app has a consolidator to calculate the positions, event handlers to control changes to the database and data server and request servers to distribute the data to the front end.

For this part of the tutorial, you want to permission users so that each one has access to the correct parts of the system.

### Authorisation 

Authorisation is achieved by permissioning dynamically. This means you can control access to information in increasingly precise ways, for example:

* The whole entity
* Specific rows
* Specific columns

Effectively, you have two levels of control:

**High-level**

You could hide an entire grid from the UI, for example. So, one group of users could view reference data, but other groups would not see this. Or, you could hide an entire data server. To achieve this, you use RIGHT_CODE. This is like a switch – you can either see it or not, depending on whether the code is TRUE or FALSE.

**Entity-level**

This is row- or column-level access to information. Different users can all view the same grid, but each one sees different data. This is best explained with these simple examples:

* You can have user A, user B and user C all having the RIGHT_CODE to view a specific grid, but each one sees different trades in that grid. This enables you to separate different trading desks, for example.
* Each user might only have access to trades for specific customers.

By including these permissions in an event handler, user A can only enter a trade on behalf of a specific set of clients and user B can only enter trades on behalf of a different set of clients.

Similarly, you can have different users seeing different columns in the same grid. This could be used for a support function, for example. You can prevent the support team from seeing specific columns of sensitive data, such as who the client for a trade is. This can be specified by using GPAL.

#### Users, profiles and right codes

Genesis has the concept of users, profiles and right codes. For each one, there is a table to store the related entity data:

* USER
* PROFILE
* RIGHT

Users gain rights via profiles. So we have tables to determine which users and rights belong to each given profile. Note that you cannot allocate right codes directly to a specific user. However, a user can have multiple profiles.

A profile can have zero or more rights and zero or more users.

These relationships are held in the following tables:

* PROFILE_RIGHT
* PROFILE_USER

Related to these tables, we have the RIGHT_SUMMARY table, which contains the superset of rights any given user has. These are based on the profiles assigned to them. This is the key table used when checking rights, and it exists to allow the efficient checking of a user's rights.

![](/img/user-profile-rights-setup.png)

The RIGHT_SUMMARY table entries are automatically maintained by the system in real time. In this way, the rights are easily accessible at speed. The GENESIS_AUTH_MANAGER process manages this table's entries automatically. So if you add a new user or you update a profile with new rights, the RIGHT_SUMMARY table is updated immediately and all the users in that profile receive the new right automatically.

:::warning
This table is only automatically maintained when profile user/right entries are maintained via GENESIS_AUTH_MANAGER business events. If you update the data in the tables PROFILE_USER or PROFILE_RIGHT via other means (e.g. **DbMon** or **SendIt**) then the RIGHT_SUMMARY table will not be maintained automatically.
In such situations (e.g. setting up a brand new environemnt and bulk loading data into the tables) then the `~/run/auth/scripts/ConsolidateRights.sh` script must be run. This scans all entries in PROFILE_USER and PROFILE_RIGHT and populates RIGHT_SUMMARY withe the correct data.
:::

Further information as well as a sample system set-up can be found [here](/creating-applications/defining-your-application/access-control/authorisation/#sample-explanation).

### The objective

The objective is to use dynamic permissions and permission codes so that specific users have access to specific parts of the application – both functions and data.


### Set up generic permissions

First, you are going to make the COUNTERPARTY table and COUNTERPARTY_ID field part of the [generic permissions](/creating-applications/defining-your-application/access-control/authorisation/) system.

Starting with the server, set up the USER and USER_ATTRIBUTES records for JaneDee system user.

:::tip
If you are not sure how to read and write information from the Genesis database, please see the reference for the [`DbMon`](/managing-applications/operate/on-the-host/helpful-commands/#dbmon-script) and [`SendIt`](/managing-applications/operate/on-the-host/helpful-commands/#sendit-script) commands.
:::

Set two new key values in **site-specific/cfg/genesis-system-definition.kts** file. This enables the COUNTERPARTY table and COUNTERPARTY_ID field to become part of the generic permissions system:

```kotlin
item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")

item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
```

### Configure dynamic permissions

You can now configure dynamic permissions for trades in our IDE. You need to make these changes to the code for the request server, data server and event handler.
For example, here we add permissioning to a query in the data server file - *alpha-dataserver.kts*:

```kotlin
dataServer {
    query("ALL_TRADES", TRADE_VIEW) {
        permissioning {
            auth(mapName = "ENTITY_VISIBILITY") {
                TRADE_VIEW.COUNTERPARTY_ID
            }
        }
    }
}
```

You can add similar code to the queries in your request servers - *alpha-reqrep.kts*.

```kotlin
requestReplies {
    requestReply("TRADE", TRADE_VIEW) {
        permissioning {
            auth(mapName = "ENTITY_VISIBILITY") {
                TRADE_VIEW.COUNTERPARTY_ID
            }
        }
    }
}
```
Event handlers are slightly different, because the input data class can be customised. The code would look like this (taking the TRADE_INSERT event handler as an example):

```kotlin
  eventHandler<Trade>(name = "TRADE_INSERT") {
    permissions {
      auth(mapName = "ENTITY_VISIBILITY") {
        field { counterpartyId }
      }
    }
    onValidate { event ->
      val message = event.details
      verify {
        entityDb hasEntry Counterparty.ById(message.counterpartyId)
        entityDb hasEntry Instrument.ById(message.instrumentId)
      }
      ack()
    }
    onCommit { event ->
      val trade = event.details
      stateMachine.insert(trade)
      ack()
    }
  }
```

After the configurations, you should execute the genesis setup tasks **setupEnvironment** and **install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip** to  prepare the database for permission. Then run **assemble** and **deploy-genesisproduct-alpha** tasks again to deploy the new version.

Using the command [`SendIt`](/managing-applications/operate/on-the-host/helpful-commands/#sendit-script) do the following three configurations below.

1. Add the permission to the user JaneDee into the table USER_ATTRIBUTES.

```
USER_NAME,USER_TYPE,ACCESS_TYPE,COUNTERPARTY_ID
JaneDee,USER,ENTITY,1
```

2. Add the association between User and Counterparty into the table USER_COUNTERPARTY_MAP.

```
USER_NAME,COUNTERPARTY_ID
JaneDee,1
```

3. Add the authorization code into the table RIGHT_SUMMARY.

```
USER_NAME,RIGHT_CODE
JaneDee,TRADER
```

That is it! You can now insert some trades and see the permissions happening in the application.

### Try yourself

Set up generic permissions using INSTRUMENT table and INSTRUMENT_ID field. The add dynamic permissions in the data server file and request servers files.

:::tip
Remember to change genesis-system-definition.kts as well as the script files. Lastly, insert the records in the three configurations tables.

After the configurations, you should execute the genesis setup tasks **setupEnvironment** and **install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip** to  prepare the database for permission. Then run **assemble** and **deploy-genesisproduct-alpha** tasks again to deploy the new version.
:::

<!-- ## Generating data model from existing sources

### Excel to Genesis

All across the financial sector, you can find operational functions sitting in Excel workbooks. And this sometimes includes functions that are mission-critical.

The Genesis low-code platform gives you a way of turning these into applications that can be audited and maintained in a standard and controlled manner. Along the way, you can build in better workflow and usability without heavy IT development effort.


Take a look at this quick exercise. We start with an Excel workbook. We finish with a simple but effective server that you can add a front end to.

1. Do some up-front checks and edits to head off any obvious issues.
2. Run the convertor. This creates your data model in Genesis format and creates data files in csv format.
3. Check the fields, tables and views in the data model. Then make any necessary adjustments.
4. Load the csv data files to the database.
5. Run a quick sequence of Genesis scripts to produce the files that contain the business logic and expose the endpoints.

That’s it. If you follow those steps, you'll have a working server, ready to be connected to a front end.

[Would you like to see that in detail](/tutorials/excel-to-genesis/excel-tut-2/)?

If you already have a Genesis low-code platform, you can download the workbook and try this for yourself.


### From an existing relational database

:::note
The command from this step has to be executed from where the Genesis Platform is set up (be it either a local installation or on remote host).
:::

The product that we create will be called **ref_data_app**. Using the instance in which the platform is installed, run:
```bash
DictionaryBuilder -t <database-type> -U <username> -P <password> -p <database-port> -H <database-host> -d tradingapp --product <product-name> -o <output-directory> -i 200 --tables <comma-separated-table-names>
```
For example, if there is an MSSQL database running on AWS, a sample command would look like:
```bash
DictionaryBuilder -t MSSQL -U admin -P beONneON*74 -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument
```

Once the command has finished, it will generate the `fields-dictionary.kts` and `tables-dictionary.kts` files for the data model. Keep these files handy, as you will have to copy them over in the next steps.
 -->

## Key server commands

### File structure

The  **\~/run** directory is an important part of a Genesis application deployment. Recommended Genesis practice is to have dated run directories for each deployment. For any upgrade, you can then just symlink the `~/run` directory to the latest dated run directory.

#### symlinks

Symlinks are short cuts to other directories, similar to the short cuts you find on a Windows desktop.

It makes it easy to roll back if things go wrong, simply by repointing to the old directory.

For example, the symlink below points run to a directory for an application called `foxtrot`, dated 18th May, 2021.

```bash
run-> data/foxtrot/20210518/run
```

#### Folders

Now look at the different folders you have.

##### genesis

This is the Genesis framework, containing all the libraries and config files.

##### generated

This contains all the installation-generated files (for example, cfg) following the most recent installation, upgrade or remap.

:::warning
Never change the files in this folder, because any changes will be lost the next time you run `genesisInstall`.
:::

##### Modules

Within the run directory, you can find the key Genesis modules, each of which delivers important functions. Note two modules in particular:

* **AUTH**. This module is responsible for permissions – it contains access control lists that determine what information and functions each user has access to. In Genesis, Auth is used to control every single event. Therefore, it has been designed for high performance.
* **GCOM**. This contains all your libraries, scripts and the common data model (with standard definitions of fields and tables).

You can, of course, create and add your own modules.

The modules generated by the build all have a similar folder structure. The main items are:

* **scripts**. Utility scripts.
* **config**. Configuration files.
* **bin**. Contains the built .jar files (binary objects) for this module’s codebase.
* **lib**. Dependencies (libraries) for this module.

#### site-specific

This is an area of the run directory where you can override the standard definitions found elsewhere in the application. You supply the standard definition name and your own definition. Your application will then only use your definition.

This is useful where you have used standard modules; you should never change these modules. Any files/definitions that are listed in the site-specific area automatically take their places. In the example below, our site-specific area has specific auth definitions including auth-dataserver.xml and
auth-tables-dictionary.kts.

#### runtime

runtime is used to store run-time information that is generated by the system. System logs and cache files are kept here.

For developers, it is good practise to create a folder within runtime when you need to pull or produce files that were generated from an external service.

### An early look at Genesis processes

Here’s the scenario. You have just logged into a server and you have done a `sudo` to your new project. You then do a `mon` command to see what’s running.

What are all those processes? Here’s a very short explanation of the ones you are most likely to see

#### Notification and Orchestration processes

The Notification & Orchestration Service runs automatically to connect all the components in the server.
Its job is to ensure that, every time an event occurs, every other process that has registered an interest is informed immediately. This enables the system to perform in real time. Therefore, the application itself does not require any coding for inter-process communications.

This is a core microservice and the technology is Aeron.

| Process name | Task |
| --- | --- |
| GENESIS_CLUSTER | Automatically performs inter-process messaging. |

#### Security, Session and Permissions processes

Authentication and Authorisation (Auth) is a service that controls:

* whether users have access to the system (authentication)
* whether the user has the right to see a specific item of information (authorisation)

Auth Permissions are set up and associated with a user role, not an individual. Visibility is controlled for every request (per UI object or other system), and also at a per-row level.

Permissions are stored in three summary tables in the NOSQL data store. This data is denormalised into a memory-mapped structure, so that action/query performance is extremely fast.

At log-in, user permission data is copied to the UI layer to control the data that the user is able to see.

| Process name | Purpose |
| --- | --- |
| AUTH_MANAGER | Handles authentication of users, with links to Single Sign On (SSO) and Active Directory. |
| AUTH_PERMS | Handles permissions - whether the user has the right to view a specific piece of information. When the application starts, it checks every entity in the application and performs an authorisation check for every user on the system. In this way, it builds a map of permissioned users. |
| AUTH_DATASERVER | Sends information on user rights to the User Interface, stored in the USER_RIGHTS table |
| AUTH_CONSOLIDATIONS | Provides data for authentication and authorisation. |

#### Transaction and Event Handling processes

Everything in a Genesis application is driven by events. These could be incoming messages, changes to the database or a user clicking on a button.

| Process name | Purpose |
| --- | --- |
| EVENT_HANDLER | Controls the processing that takes place following each single event. |
| EVALUATOR | Enables you to set up rules, so that configured events trigger an external action, such as an email or Symphony message. |

#### API and Data Distribution processes

The task of these processes is to provide data to the Web User Interface, and to ensure that each data item reaches the correct users (and nobody else).

| Process name | Purpose |
| --- | --- |
| DATASERVER | Pushes real-time data to the user interface every time the database is updated. |
| REQUEST SERVER | Pushes static data to the user interface in response to specific events (for example, to populate a dialog in the user interface). |
| DATA PUBLISHER | Publishes lightweight real-time market-data changes. |
| DB_SERVER | Maintains the database in cache for high performance. |
| GENESIS_ROUTER | Manages sessions and routes messages to/from services over tcp/ip, websockets, html, with encryption & compression. The data server uses this process to determine which users should receive each update. |
| GENESIS_WEB_ADAPTER | If you are viewing an older instance, you might see this process. This is no longer used. It has been replaced by the GENESIS_ROUTER. |

#### Data Persistence processes

These services ensure that database are kept on synch, and ensures that data is held in cache for fast access.

| Process name | Purpose |
| --- | --- |
| GENESIS_TO_DB | Streams data from Genesis to a classic RDBMS database (such as Oracle or MSSQL). This process listens to changes in the Genesis tables (insert, modify and delete) and reproduces them in the selected RDBMS. |
| DB_TO_GENESIS | Streams data from a classic RDBMS database (such as Oracle or MSSQL) to a Genesis database. This process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue). It then reproduces them in the specified Genesis table. |
| GENESIS_SYNC | Synchronises two separate Genesis databases. Usually, this is used where  the distance is too great for clustering to be used. |

#### Data Analytics processes

Analytics provide aggregated and calculated data, such as real-time positions, chart data, or orders outstanding. Note that the analytic data is stored in the Genesis database, so access to the data is through request server or data server.

| Process name | Purpose |
| --- | --- |
| CONSOLIDATOR | Aggregates data from the Genesis database in real time and  writes the new data in a separate data. |
| R INTEGRATION | Enables consolidators to include R functions in their calculations. R is a statistical programming language. |

#### Integration processes

These processes enable Genesis applications to send messages to and receive messages from external systems.

| Process name | Purpose |
| --- | --- |
| CAMEL | performs integration with external systems that produce or consume data.. |
| FIX | integrates Genesis with external systems that use the FIX messaging standard. |
| PROTOCOL_BUFFER | integrates Genesis with external systems that use protocol buffers to control message format. |
| STREAMER_SERVER | listens to a table or view, and streams data out to streamer clients. In almost all cases, the table or view must be an audit table. This covers both inbound and outbound messages. |
| STREAMER_CLIENT | Receives data from a streamer server  When data is received, it transforms into the relevant format. This covers both inbound and outbound messages. |

### Putting the pieces together

Below is an architectural overview that shows how these different processes and modules fit together.

![](/img/all-the-processes-in-a-diagram.png)

The Web User Interface is at the top. The server is below, where you can see:

* **Security Session and Permission Services** controlling access to data each time it is requested.
* **Notification and Orchestration Services** connecting all the different processes with each other.

in the server:

* The **Data Persistence Services** are at the heart of of the server, ensuring that data is cached for fast and reliable access.
* **Integration Services** are on the left and right sides, connecting the server to any relevant external systems.
* Finally, note the **Operational Control and Monitoring Services** at the bottom. These are provided by GEM, Prometheus (monitoring and alerts) and Console.

## Navigating the documentation and how to get help​