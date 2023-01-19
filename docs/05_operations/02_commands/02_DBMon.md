---
title: 'Operations - DBMon'
sidebar_label: 'DBMon'
id: dbmon
keywords: [operations, server, commands, DBMon]
tags:
    - database
    - server
    - commands
    - DBMon
---

# DBMon

## What is DBMon?

DbMon is the Genesis database client. It provides a unified interface to the underlying database and hides the details about the database vendor. It is not mandatory that you use DBMon, but it is available for your use nonethless.  In this article we will discuss how we can use this database in conjuction with the Genesis App.

## DbMon Commands

There are many commands that can be used with DbMon. We have listed them all for you below. Please use this table as reference if ever in doubt about which commands can be used. In this article we will go over a few of these, demonstrating their use and allowing you to put them into practice.

| Command                  | Argument                                    | Description                                     |
|--------------------------|---------------------------------------------|-------------------------------------------------|
| autoIncrementNumber      | `<field_name>`                              |                                                 |
| clear                    |                                             | clears the current context                      |
| count                    |                                             | counts the rows in the table                    |
| delete                   |                                             | deletes the current row                         |
| deleteWhere              | `<condition>`                               | deletes all matching rows in the selected table |
| displayFields            | `<field_names>`                             |                                                 |
| distinct                 | `<condition> [-where <limiting_condition>]` |                                                 |
| find                     | `<key_name>`                                |                                                 |
| first                    | `<key_name>`                                |                                                 |
| forceAutoIncrementNumber | `<field_name> <sequence_number>`            |                                                 |
| forceSequenceNumber      | `<sequence_name> <sequence_number>`         |                                                 |
| help                     |                                             | lists all commands                              |
| insert                   |                                             | inserts the current row                         |
| last                     | `<key_name>`                                | gets the last record by key                     |
| listAll                  | `<key_name> <num_key_fields> <max_records>` |                                                 |
| next                     | `<key_name>`                                | gets the next record by key                     |
| set                      | `<field_name> <field_value>`                | sets a field                                    |
| unset                    |                                             | sets a field to `null`                          |
| update                   | `<key_name>`                                | updates the current row by key                  |
| updateWhere              | `<condition> <assignments>`                 |                                                 |
| writeMode                |                                             | enables write mode                              |


## Starting DBMon

To start a DbMon Session you first need to sudo to the appropriate application account. Following this, you must type DbMon at the command prompt:

```javascript
[titan] /home/titan >DbMon
28 Jul 2021 17:01:53.998 1087 [main] WARN  global.genesis.commons.config.ConfigFileFinder - Product extralibs does not have a config directory


==================================
Genesis Database Monitor
Enter 'help' for a list of commands
==================================
DbMon>
```

As you can see, once you are in a DbMon Session, the prompt will display DbMon>

## Exiting DbMon

To end a DbMon Session just type [`quit`](#dbmon-commands) at the DbMon Prompt.

## Working with Tables

The starting point for any work you will need to do in DbMon will start with Tables. 

### Show tables

To see a list of the available Tables you can use the [`showTables`](#dbmon-commands) command. This will display an alphabetical list of the available tables, as follows:

```javascript
==================================
List of tables
==================================
ACCOUNT
ADIF_SSI
ALERT
ALERT_AUDIT
ALT_COUNTERPARTY_ID
ALT_INSTRUMENT_ID
APPROVAL
APPROVAL_AUDIT
APPROVAL_ENTITY
APPROVAL_ENTITY_COUNTER
AUDIT
AUDIT_SSI_UPDATE
AUDIT_TRAIL
BROKER
<<List Snipped For Primer>>
```
### Table

To look at the data held in a specific table you use the [`table`](#dbmon-commands) command followed by the table name, for example table BROKER. Once you select a table, the DbMon Prompt will change to show the table name you are looking at:

```javascript
DbMon>table BROKER
DbMon:BROKER>
```

### Show

To see the columns available in the selected table use the [`show`](#dbmon-commands) command. This will display the Current Record in the selected table - as you haven’t selected a Record yet, it will display an empty Record (notice the value column is not populated):

```javascript
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
TIMESTAMP                                                           NANO_TIMESTAMP
BROKER_ID                                                           INT
BROKER_PARENT_ID                                                    INT
CODE                                                                STRING
CODE_TYPE                                                           STRING
COUNTRY_CODE                                                        STRING
CREATED_DATE                                                        DATETIME
CREATED_USER                                                        STRING
EXTERNAL_ID                                                         STRING
FID_BROKER_ID                                                       STRING
IS_ACTIVE                                                           BOOLEAN
LEI_NUMBER                                                          STRING
MODIFIED_DATE                                                       DATETIME
MODIFIED_USER                                                       STRING
NAME                                                                STRING
NETTING_GROUP_ID                                                    INT
REGION                                                              STRING
VIEW_CODE                                                           STRING
```
### Display Fields

If you are only interested in seeing selected columns, you can use the [`displayFields`](#dbmon-commands) command and list the names of the Columns you are interested in (separated by spaces). 

Any subsequent [`show`](#dbmon-commands) commands will only display those columns rather than the all the columns in the table (to reset back to all columns being displayed just use the [`displayFields`](#dbmon-commands) command followed by no column names):

```javascript
DbMon:BROKER>displayFields BROKER_ID NAME REGION COUNTRY_CODE
Display fields set!
DbMon:BROKER>show
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
BROKER_ID                                                           INT
COUNTRY_CODE                                                        STRING
NAME                                                                STRING
REGION                                                              STRING
DbMon:BROKER>displayFields
Display fields reset!
```
### Count

If you would like to know how many rows of data there are in a table, then you can use the [`count`](#dbmon-commands) command, but be aware for large tables this may take some time to return:

```javascript
DbMon:BROKER>count
The table BROKER contains 114 records
```

## Finding Data in a Table

### Find

In DbMon you can only see one Record at a time, and to display the Record you want, you need to locate it using the [`find`](#dbmon-commands) command which searches the table’s Indexes for a given key value.  

### Show Keys (Indexes)

To see the Indexes (or keys) on the selected table use the [`showKeys`](#dbmon-commands) command. This will display a list of the Index Names and the Fields you will need to supply to use Index:

```javascript
==================================
BROKER
==================================
Key Name                           Field Name                               Index Type
=======================================================
BROKER_BY_BROKER_EXTERNAL_ID       EXTERNAL_ID                              Secondary
------------------------------------------------------------------------------------------
BROKER_BY_ID                       BROKER_ID                                Primary
------------------------------------------------------------------------------------------
BROKER_BY_TIMESTAMP                TIMESTAMP                                Secondary
------------------------------------------------------------------------------------------
BROKER_BY_VIEW_CODE                VIEW_CODE                                Secondary
	------------------------------------------------------------------------------------------ 
```

### Displaying a record - Set

To display a particular record from a Table, you need to use the [`set`](#dbmon-commands) command to populate an Index field with the value you are searching for, and then use the [`find`](#dbmon-commands) command providing the appropriate Index name.

So for example if we are looking for a Broker that has a `VIEW_CODE` value of “HSBC” we would want to use the Key named `BROKER_BY_VIEW_CODE` and to use that key we would need to set the `VIEW_CODE` to the value `HSBC`. Hence, the commands we would use are as follows:

```javascript
DbMon:BROKER>set VIEW_CODE HSBC
DbMon:BROKER>find BROKER_BY_VIEW_CODE
DbMon:BROKER>show
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
TIMESTAMP                 2021-07-08 14:14:26.818(n:0,s:2630)       NANO_TIMESTAMP
BROKER_ID                 725                                       INT
BROKER_PARENT_ID          724                                       INT
CODE                      114216                                    STRING
CODE_TYPE                 Registered                                STRING
COUNTRY_CODE              GBR                                       STRING
CREATED_DATE              2017-12-11 11:43:53.210 +0000             DATETIME
CREATED_USER              will.angell-james                         STRING
EXTERNAL_ID               725N                                      STRING
FID_BROKER_ID             HSBC                                      STRING
IS_ACTIVE                 true                                      BOOLEAN
LEI_NUMBER                MP6I5ZYZBEU3UXPYFY54                      STRING
MODIFIED_DATE             2018-03-14 09:44:25.703 +0000             DATETIME
MODIFIED_USER             terry.cannon                              STRING
NAME                      HSBC Bank Plc                             STRING 
NETTING_GROUP_ID                                                    INT
REGION                    UK                                        STRING
VIEW_CODE                 HSBC                                      STRING
```
To then [`find`](#dbmon-commands) another record with a different `VIEW_CODE`, you need to go back to having an empty record so that you can [`set`](#dbmon-commands) the `VIEW_CODE` again and perform another [`find`](#dbmon-commands). 

To do this you use the [`clear`](#dbmon-commands) command, this resets your view onto the table allowing you to start again. 

:::note
The [`clear`](#dbmon-commands) command does not have any effect on the data itself, just your “window” into the database.
:::

### Search

If you wish to look for a record (or a number of records) but your criteria does not match an Index on the table, you can use the [`search`](#dbmon-commands) command.

:::warning
**BEWARE**, for larger tables this can be slow and risks causing latency to frontend users (e.g. client user).
:::

So, if we wanted to find all the records in the `BROKER` table where the `COUNTRY_CODE` was IRL, there is no Index we can use and there may be multiple results, so using the [`search`](#dbmon-commands) command would look like this:

```javascript
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
TIMESTAMP                 2021-02-12 11:07:58.116339964             NANO_TIMESTAMP
BROKER_ID                 4001                                      INT
BROKER_PARENT_ID                                                    INT
CODE                      223987                                    STRING
CODE_TYPE                 Registered                                STRING
COUNTRY_CODE              IRL                                       STRING
CREATED_DATE              2020-10-08 14:20:17.400 +0000             DATETIME
CREATED_USER              terry.cannon                              STRING
EXTERNAL_ID               4001N                                     STRING
FID_BROKER_ID             SISS                                      STRING
IS_ACTIVE                 true                                      BOOLEAN
LEI_NUMBER                635400IAV22ZOU1NFS89                      STRING
MODIFIED_DATE             2020-10-08 14:20:17.400 +0000             DATETIME
MODIFIED_USER             terry.cannon                              STRING
NAME                      Susquehanna Intl Securities Ltd           STRING
NETTING_GROUP_ID          601                                       INT
REGION                    UK                                        STRING
VIEW_CODE                 SISS                                      STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```

If there were multiple records which matched the search criteria, then they would all be listed one after the other on the screen.  To limit the number of results, you can supply the limit (-l) parameter to the [`search`](#dbmon-commands) command and control the maximum number of records returned:

```javascript
DbMon:BROKER>search COUNTRY_CODE=='USA'
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
<Results Snipped>
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  6

DbMon:BROKER>search COUNTRY_CODE=='USA' -l 3
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
<Results Snipped>
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  3
```

If you wish to string criteria together, then you can use || for Logical OR and && for Logical AND, so if you want to [`search`](#dbmon-commands) for any `BROKER` where the `COUNTRY_CODE` is USA or IRL we would use the following:

```javascript
DbMon:BROKER>search COUNTRY_CODE=='IRL'||COUNTRY_CODE=='USA'
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
<Results Snipped>
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results
```

The Logical Operators available are as follows:

| Symbol | Name                        |
|--------|-----------------------------|
| ==     | Equality (Equal To)         |
| !=     | Non-Equality (Not Equal To) |
| >      | Greater Than                |
| <      | Less Than                   |
| &&     | Logical And                 |
| //     | Logical Or                  |




### Counting Records

Let’s assume that we need to know how many BROKER Records there are for each unique COUNTRY_CODE, we can use the **distinct** command, but again **BEWARE** as for large tables this can have an impact on the database performance for frontend users.

```jsx
DbMon:BROKER>distinct COUNTRY_CODE
Distinct Value                           Count
===========================================================================================
AUS                                      1
BEL                                      1
DEU                                      1
FRA                                      2
GBR                                      114
IRL                                      1
NLD                                      2
USA                                      6
-------------------------------------------------------------------------------------------
Total Results:  128
Total Distinct Values Count:  8
```

The **distinct** command also accepts a **-where** parameter which allows us to filter the rows that are counted - so if require a count of unique COUNTRY_CODE for BROKER Records which have a REGION of UK, but not do not have the value of GBP for COUNTRY_CODE, we can use the following command -

```jsx
count
countcountDbMon:BROKER>distinct COUNTRY_CODE -where REGION=='UK'&&COUNTRY_CODE!='GBR'
Distinct Value                           Count
===========================================================================================
AUS                                      1
BEL                                      1
DEU                                      1
FRA                                      2
IRL                                      1
NLD                                      2
-------------------------------------------------------------------------------------------
Total Results:  8
Total Distinct Values Count:  6
```

### Searching with Wildcards

DbMon allows functionality to search via a wildcard.
Beware this might be quite slow if running against a large dataset.

```jsx
DbMon:USER_ATTRIBUTES>search USER_NAME.matches('Dealer1.*')
==================================
USER_ATTRIBUTES
==================================
Field Name                               Value                                    Type
===========================================================================================
<Results snipped>
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  3
```

### Searching a Datetime

```bash
-where 'LAST_ACCESS_TIME>"2022-06-20"'
```

### Searching a Timestamp

You can search for a specific date using a where clause such as:

```bash
-where == "20220202"
```


## Getting into DBMon

In order to run queries in the database, we will need to run `DbMon`. In order to get into DBMon please run the following command, filling in the correct application name:

`./gradlew :jvm:[application-name]:DbMon`

## Using DBMon

In this section we will give you some practical examples of how to use DBMon.

### Help

Once inside `DbMon`, you can run the command 'help', which shows all the available DbMon commands.
To get help on a specific command, run `help _command_`.

`DbMon --quietMode` performs database changes without triggering real-time updates in the update queue layer.

#### Syntax

```bash
DbMon
```

```bash
==================================

Database Monitor

Enter 'help' for a list of commands

==================================
```

### Creating a new user

Next, let's create a user.

:::note
The following details will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
  :::

Run the task `loadInitialData`. This adds the data to a file called USER.csv to be imported into the `USER` table in your
database. The `USER` table, among other users and permissioning tables, is defined by the Genesis Auth module that we installed previously.

To run the task, call:

```shell
./gradlew :genesisproduct-positions-app-tutorial:positions-app-tutorial-deploy:loadInitialData #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/load-initial-data-positions.png)

Now we are going to use Genesis `DbMon` to run some queries on the database.


:::info DbMon
DbMon is the Genesis database client. It provides a unified interface to the underlying database and hides the details about the database vendor.
:::

Run `DbMon` to check that the user has been created:

```shell
./gradlew :genesisproduct-position-app-tutorial:positions-app-tutorial-deploy:DbMon #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/using-dbmon-positions.png)

Once you are inside the console, type `table USER` and then `search 1`. If imported correctly, the user JaneDee should be listed:
```
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
...
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
DbMon:USER>
```

### Running some queries

Now we are going to use Genesis `DbMon` to run some queries on the database.

Run `DbMon` to check that the user has been created:

```
./gradlew :genesisproduct-position-app-tutorial:positions-app-tutorial-deploy:DbMon #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/using-dbmon-positions.png)

Once you are inside the console, type table `USER` and then `search 1`. If imported correctly, the user JaneDee should be listed:

```shell
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
...
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
DbMon:USER>
```

