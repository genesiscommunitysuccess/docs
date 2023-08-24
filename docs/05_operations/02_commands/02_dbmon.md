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

DbMon is the Genesis database client. It provides an interface to the underlying database and hides the details about the specific database technology. Generic database clients can be used with the Genesis low-code platform, but we recommend that you use DbMon.  This page gives details of all the DbMon commands and provides practical examples of how you can use them.

## DbMon commands

The commands available with DbMon are listed below. 

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
| qsearch                  | `<condition> [-l <limit>]`                  |                                                 |
| qshow                    |                                             |                                                 |
| search                   | `<condition> [-l <limit>]`                  |                                                 |
| sequenceNumber           | `<sequence_name>`                           |                                                 |
| set                      | `<field_name> <field_value>`                | sets a field                                    |
| show                     |                                             |                                                 |
| showKeys                 |                                             |                                                 |
| showTables               |                                             |                                                 |
| showViews                |                                             |                                                 |
| table                    | `<table_name>`                              |                                                 |
| unset                    |                                             | sets a field to `null`                          |
| update                   | `<key_name>`                                | updates the current row by key                  |
| updateWhere              | `<condition> <assignments>`                 |                                                 |
| view                     | `<view_name>`                               |                                                 |
| writeMode                |                                             | enables write mode                              |


## Starting DbMon

To start a DbMon session, first switch to the user that owns the Genesis installation. Then type `DbMon` at the command prompt:

```javascript
[titan] /home/titan >DbMon
28 Jul 2021 17:01:53.998 1087 [main] WARN  global.genesis.commons.config.ConfigFileFinder - Product extralibs does not have a config directory


==================================
Genesis database Monitor
Enter 'help' for a list of commands
==================================
DbMon>
```

As you can see, once you are in a DbMon session, the `DbMon>` prompt is displayed:

## Exiting DbMon

To end a DbMon session, just type [`quit`](#dbmon-commands) at the DbMon prompt.

## Working with tables

Most of the time, you'll be using DbMon to examine tables or views in one way or another. 

### Show tables / Show views

To see a list of available tables or views, use either the [`showTables`](#dbmon-commands) command or the [`showViews`](#dbmon-commands). This displays an alphabetical list of available entities, for example:

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

### Table / View

To look at the data held in a specific table or view, use the [`table`](#dbmon-commands) or [`view`](#dbmon-commands)command followed by the database entity name: for example `table BROKER` or `view TRADE`. Once you have selected an entity, the `DbMon` prompt changes to show its name.

```javascript
DbMon>table BROKER
DbMon:BROKER>
```

```javascript
DbMon>view TRADE
DbMon:TRADE>
```

### Show

To see the columns available in the selected table or view use the [`show`](#dbmon-commands) command. This displays the current record in the selected entity. If no record has been selected, it displays an empty record (notice the value column below is not populated):

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

If you are only interested in seeing selected columns, use the [`displayFields`](#dbmon-commands) command and list the names of the columns you are interested in (separated by spaces). 

Any subsequent [`show`](#dbmon-commands) commands will only display those columns, rather than the all the columns in the entity.


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
To view all columns again, use the [`displayFields`](#dbmon-commands) command followed by no column names.

### Count rows

If you would like to know how many rows of data there are in a table or view, then use the [`count`](#dbmon-commands) command. Be aware that, for large entities, this could take some time to return:

```javascript
DbMon:USER_VIEW>count
The entity USER_VIEW contains 23 records
```

## Finding data in a table or view

### Find

In DbMon, you can only see one record at a time. To display the record you want, you must first locate it using the [`find`](#dbmon-commands) command, which searches the entity’s indexes for a given key value.  

### Show keys (indexes)

To see the indexes (or keys) on the selected entity, use the [`showKeys`](#dbmon-commands) command. This displays a list of the index names and the fields you will need to supply to use the index:

```javascript
==================================
USER_VIEW
==================================
Key Name                                 Field Name                               Index Type
===========================================================================================
USER_BY_NAME                             [USER_NAME]                              PRIMARY
-------------------------------------------------------------------------------------------
```

### Displaying a record - Set

To display a particular record from an entity, use the [`set`](#dbmon-commands) command to populate an index field with the value you are searching for. Then use the [`find`](#dbmon-commands) command along with the appropriate index name.

The example below looks for a broker that has a `VIEW_CODE` value of “WALSH”. We have searched for the Key named `BROKER_BY_VIEW_CODE` and to use that key we whave set the `VIEW_CODE` to the value `WALSH`.

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

If you then want to [`find`](#dbmon-commands) a record with a different `VIEW_CODE`, you need to go back to having an empty record so that you can [`set`](#dbmon-commands) the `VIEW_CODE` again and perform another [`find`](#dbmon-commands). 

To do this, use the [`clear`](#dbmon-commands) command.This resets your view onto the entity so that you can start again. 

:::note
The [`clear`](#dbmon-commands) command does not have any effect on the data itself, just on your “window” into the database.
:::

### Search

If you wish to look for a record (or a number of records) but your criterion does not match an index on the entity, you can use the [`search`](#dbmon-commands) command.

:::warning
For larger entities, this can be slow and risks causing latency to your application's users.
:::

For example, if you wanted to find all the records in the `BROKER` table where the `COUNTRY_CODE` was IRL, and there is no index that can be used (and there might be multiple results), the [`search`](#dbmon-commands) command would look like this:

```javascript
DbMon:BROKER>search COUNTRY_CODE=='IRL'
```

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

If there are multiple records that match the search criteria, these would all be listed one after the other on the screen. To limit the number of results, you can supply the limit (-l) parameter to the [`search`](#dbmon-commands) command. In the example below, the unlimited search returns six results. The next search, which includes the `-l 3` parameter, returns only the first three results:

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

For multiple criteria, use || for logical OR and && for logical AND. For example, if you want to [`search`](#dbmon-commands) for any `BROKER` where the `COUNTRY_CODE` is USA or IRL:

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

The logical operators available are:

| Symbol | Name                        |
|--------|-----------------------------|
| ==     | Equality (Equal To)         |
| !=     | Non-Equality (Not Equal To) |
| >      | Greater Than                |
| <      | Less Than                   |
| &&     | Logical And                 |
| ![](/img/logical-or.png)    | Logical Or                  |

#### Searching with wildcards

You can search using the * wildcard. Note that this might be quite slow if running against a large dataset.

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

## Datetime or Date

When setting a DATE or DATETIME, the format must be specified as follows:

- DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS Z"
- DATE_FORMAT = "yyyy-MM-dd"

### Searching a Datetime or Date

Accepted Datetime formats:
- DateTime with milliseconds precision: yyyyMMdd-HH:mm:ss.SSS
- DateTime with seconds precision: yyyyMMdd-HH:mm:ss
- DateTime with minutes precision: yyyyMMdd-HH:mm

Accepted Date formats:
- yyyyMMdd
- yyyy-MM-dd

#### Using search command

```jsx
// if MODIFIED_DATE is 2022-10-08 14:20:17.400 in database 
DbMon:BROKER>search MODIFIED_DATE=="20221008-14:20:17.400"

// if MODIFIED_DATE is 2022-10-08 14:20:17 in database 
DbMon:BROKER>search MODIFIED_DATE=="20221008-14:20:17"

// if MODIFIED_DATE is 2022-10-08 14:20 in database 
DbMon:BROKER>search MODIFIED_DATE>"20221008-14:20" && COUNTRY_CODE=='IRL'

// if MODIFIED_DATE is 2022-10-08 in database 
DbMon:BROKER>search MODIFIED_DATE=="20221008" || COUNTRY_CODE=='IRL'

// if MODIFIED_DATE is 2022-10-08 in database 
DbMon:BROKER>search MODIFIED_DATE=="2022-10-08"
```

#### Using distinct command

```jsx
// if MODIFIED_DATE is 2022-10-08 14:20:17.400 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE=="20221008-14:20:17.400"

// if MODIFIED_DATE is 2022-10-08 14:20:17 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE>"20221008-14:20:17" && IS_ACTIVE=='true'

// if MODIFIED_DATE is 2022-10-08 14:20 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE<"20221008-14:20" || IS_ACTIVE=='true'

// if MODIFIED_DATE is 2022-10-08 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE=="20221008"

// if MODIFIED_DATE is 2022-10-08 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE=="2022-10-08"
```

## Counting records

### Distinct

In this example, the [`distinct`](#dbmon-commands) command is used to find out how many `BROKER` records there are for each unique `COUNTRY_CODE`.

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

The [`distinct`](#dbmon-commands) command also accepts a `-where` parameter, which enables you to filter the rows that are counted. 

This example retrieves the count of unique `COUNTRY_CODE` for `BROKER` records that have a `REGION` of UK, but which do not have the value of `GBP` for `COUNTRY_CODE`:

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

Once inside `DbMon`, you can run the command [`help`](#dbmon-commands) to show all the available `DbMon` commands.
To get help on a specific command, run the `help _command_`.


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
showViews
table <table_name>
unset
update <key_name>
updateWhere <condition> <assignments>
view
writeMode
```

## Quiet mode
`DbMon --quietMode` performs database changes without triggering real-time updates in the update queue layer.
