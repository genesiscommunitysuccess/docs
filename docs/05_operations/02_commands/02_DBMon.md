---
title: 'Operations - DbMon'
sidebar_label: 'DbMon'
id: dbmon
keywords: [operations, server, commands, DBMon]
tags:
    - database
    - server
    - commands
    - DBMon
---

# DbMon

## What is DbMon?

DbMon is the Genesis database client. It provides a unified interface to the underlying database and hides the details about the database vendor. It is not mandatory that you use DBMon, but it is available for your use nonetheless.  Below we will discuss how we can use this database client in conjunction with the Genesis low-code Platform.

## DbMon commands

There are many commands that can be used with DbMon which are listed below. Please use this table as reference if ever in doubt about which commands can be used. We will go over DbMon Commands, demonstrating their use and allowing you to put them into practice.

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
| qsearch                  | `<condition> [-l <limit>]`                  ||
| qshow                    ||||
| search                   | `<condition> [-l <limit>]`                  ||
| sequenceNumber           | `<sequence_name>`                           ||
| set                      | `<field_name> <field_value>`                | sets a field                                    |
| show                     |||
| showKeys                 |||
| showTables               |||
| table                    | `<table_name>`                              ||
| unset                    |                                             | sets a field to `null`                          |
| update                   | `<key_name>`                                | updates the current row by key                  |
| updateWhere              | `<condition> <assignments>`                 |                                                 |
| writeMode                |                                             | enables write mode                              |


## Starting DbMon

To start a DbMon Session you first need to switch to the user that owns the Genesis Installation. Following this, you must type DbMon at the command prompt:

```javascript
[titan] /home/titan >DbMon
28 Jul 2021 17:01:53.998 1087 [main] WARN  global.genesis.commons.config.ConfigFileFinder - Product extralibs does not have a config directory


==================================
Genesis database Monitor
Enter 'help' for a list of commands
==================================
DbMon>
```

As you can see, once you are in a DbMon Session, the prompt will display DbMon>

## Exiting DbMon

To end a DbMon Session just type [`quit`](#dbmon-commands) at the DbMon prompt.

## Working with tables

The starting point for any work you will need to do in DbMon will be tables. 

### Show tables

To see a list of the available tables you can use the [`showtables`](#dbmon-commands) command. This will display an alphabetical list of available tables, as follows:

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

To look at the data held in a specific table you use the [`table`](#dbmon-commands) command followed by the table name, for example `table BROKER`. Once you select a table, the DbMon prompt will change to show the table name you are looking at:

```javascript
DbMon>table BROKER
DbMon:BROKER>
```

### Show

To see the columns available in the selected table use the [`show`](#dbmon-commands) command. This will display the current record in the selected table. As you haven’t selected a record yet, it will display an empty record (notice the value column is not populated):

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
### Display fields

If you are only interested in seeing selected columns, you can use the [`displayFields`](#dbmon-commands) command and list the names of the columns you are interested in (separated by spaces). 

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
### Count rows

If you would like to know how many rows of data there are in a table, then you can use the [`count`](#dbmon-commands) command, but be aware for large tables this may take some time to return:

```javascript
DbMon:BROKER>count
The table BROKER contains 114 records
```

## Finding data in a table

### Find

In DbMon you can only see one record at a time, and to display the record you want you need to locate it using the [`find`](#dbmon-commands) command which searches the table’s indexes for a given key value.  

### Show keys (indexes)

To see the indexes (or keys) on the selected table use the [`showKeys`](#dbmon-commands) command. This will display a list of the index names and the fields you will need to supply to use index:

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

To display a particular record from a table, you need to use the [`set`](#dbmon-commands) command to populate an index field with the value you are searching for, and then use the [`find`](#dbmon-commands) command providing the appropriate index name.

So for example if we are looking for a Broker that has a `VIEW_CODE` value of “WALSH” we would want to use the Key named `BROKER_BY_VIEW_CODE` and to use that key we would need to set the `VIEW_CODE` to the value `WALSH`. Hence, the commands we would use are as follows:

```javascript
DbMon:BROKER>set VIEW_CODE WALSH
DbMon:BROKER>find BROKER_BY_VIEW_CODE
DbMon:BROKER>show
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
TIMESTAMP                 2022-07-08 14:14:26.818(n:0,s:2630)       NANO_TIMESTAMP
BROKER_ID                 725                                       INT
BROKER_PARENT_ID          724                                       INT
CODE                      114216                                    STRING
CODE_TYPE                 Registered                                STRING
COUNTRY_CODE              GBR                                       STRING
CREATED_DATE              2022-12-11 11:43:53.210 +0000             DATETIME
CREATED_USER              ismail.augustine                          STRING
EXTERNAL_ID               725N                                      STRING
FID_BROKER_ID             WALSH                                     STRING
IS_ACTIVE                 true                                      BOOLEAN
LEI_NUMBER                MP6I5ZYZBEU3UXPYFY54                      STRING
MODIFIED_DATE             2022-03-14 09:44:25.703 +0000             DATETIME
MODIFIED_USER             ismail.augustine                              STRING
NAME                      WALSH Bank Plc                            STRING 
NETTING_GROUP_ID                                                    INT
REGION                    UK                                        STRING
VIEW_CODE                 WALSH                                     STRING
```
To then [`find`](#dbmon-commands) another record with a different `VIEW_CODE`, you need to go back to having an empty record so that you can [`set`](#dbmon-commands) the `VIEW_CODE` again and perform another [`find`](#dbmon-commands). 

To do this you use the [`clear`](#dbmon-commands) command, this resets your view onto the table allowing you to start again. 

:::note
The [`clear`](#dbmon-commands) command does not have any effect on the data itself, just your “window” into the database.
:::

### Search

If you wish to look for a record (or a number of records) but your criterion does not match an index on the table, you can use the [`search`](#dbmon-commands) command.

:::warning
**BEWARE**, for larger tables this can be slow and risks causing latency to frontend users (e.g. client user).
:::

So, if we wanted to find all the records in the `BROKER` table where the `COUNTRY_CODE` was IRL, there is no index we can use and there may be multiple results, so using the [`search`](#dbmon-commands) command would look like this:

```javascript
==================================
BROKER
==================================
Field Name                Value                                     Type
===========================================================================================
TIMESTAMP                 2022-02-12 11:07:58.116339964             NANO_TIMESTAMP
BROKER_ID                 4001                                      INT
BROKER_PARENT_ID                                                    INT
CODE                      223987                                    STRING
CODE_TYPE                 Registered                                STRING
COUNTRY_CODE              IRL                                       STRING
CREATED_DATE              2022-10-08 14:20:17.400 +0000             DATETIME
CREATED_USER              john.clement                              STRING
EXTERNAL_ID               4001N                                     STRING
FID_BROKER_ID             SISS                                      STRING
IS_ACTIVE                 true                                      BOOLEAN
LEI_NUMBER                636400IBV22ZOU1NFS87                      STRING
MODIFIED_DATE             2022-10-08 14:20:17.400 +0000             DATETIME
MODIFIED_USER             john.clement                              STRING
NAME                      Phillip N Orion ltd                       STRING
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

## Searching

### Searching with wildcards

DbMon provides functionality to search via a wildcard.
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

## Datetime

When setting a DATE or DATETIME, the format will need to be as specified below:

- DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS Z"
- DATE_FORMAT = "yyyy-MM-dd"

### Searching a Datetime

```bash
-where 'LAST_ACCESS_TIME>"2022-06-20"'
```

### Searching a timestamp

You can search for a specific date using a where clause such as:

```bash
-where == "20220202"
```


## Counting records

### Distinct

Let’s assume that we need to know how many `BROKER` records there are for each unique `COUNTRY_CODE`, we can use the [`distinct`](#dbmon-commands) command.

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

The [`distinct`](#dbmon-commands) command also accepts a **-where** parameter which allows us to filter the rows that are counted. If you require a count of unique `COUNTRY_CODE` for `BROKER` records which have a `REGION` of UK, but not do not have the value of `GBP` for `COUNTRY_CODE`, we can use the following command:

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

## Help

Once inside `DbMon`, you can run the command [`help`](#dbmon-commands), which shows all the available `DbMon` commands.
To get help on a specific command, run `help _command_`.


```javascript
==================================
Help Menu
==================================
autoIncrementNumber <field_name>
clear
count
delete
deletelse <condition>
displayFields <field_names>
distinct <condition> [-where <limiting_condition>]
find <key_name>
first <key_name>
forceAutoIncrementNumber <field_name> <sequence_number>
forceSequenceNumber <sequence_name> <sequence_number>
h
insert
last <key_name>
listAll <key_name> <num_key_fields> <max_records>
next <key_name>
qsearch <condition> [-l <limit>]
qshow
search <condition> [-l <limit>]
sequenceNumber <sequence_name>
set <field_name> <field_value>
show
showKeys
showTables
table <table_name>
unset
update <key_name>
updateWhere <condition> <assignments>
writeMode
```

`DbMon --quietMode` performs database changes without triggering real-time updates in the update queue layer.