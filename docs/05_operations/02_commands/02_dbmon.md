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

DbMon is the Genesis database client. It provides an interface to the underlying database and hides the details about the specific database technology. Generic database clients can be used with the Genesis low-code platform, but we recommend that you use DbMon. This page gives details of all the DbMon commands and provides practical examples of how you can use them.

## DbMon commands

The commands available with DbMon are listed below. 

| Command                              | Argument                                    | Description                                        |
|--------------------------------------|---------------------------------------------|----------------------------------------------------|
| autoIncrementNumber                  | `<field_name>`                              |                                                    |
| [clear](#displaying-a-record---set)  |                                             | clear the current context                         |
| [count](#count-rows)                 |                                             | count the rows in the table/view                  |
| [delete](#delete)                    |                                             | delete the current row                            |
| [deleteWhere](#deletewhere)          | `<condition>`                               | delete all matching rows in the selected table    |
| [distinct](#distinct)                | `<condition> [-where <limiting_condition>]` | show only distinct records                         |
| [displayFields](#display-fields)     | `<field_names>`                             | display only selected columns                      |
| [find](#find)                        | `<key_name>`                                | find a specific record in a index                 |
| forceAutoIncrementNumber             | `<field_name> <sequence_number>`            |                                                    |
| forceSequenceNumber                  | `<sequence_name> <sequence_number>`         |                                                    |
| [first](#first-and-last)             | `<key_name>`                                | get the first record by key                       |
| help                                 |                                             | list all commands                                 |
| [insert](#insert)                    |                                             | insert the current                                |
| [last](#first-and-last)              | `<key_name>`                                | get the last record by key                        |
| listAll                              | `<key_name> <num_key_fields> <max_records>` |                                                    |
| [next](#next)                        | `<key_name>`                                | get the next record by key                        |
| qsearch                              | `<condition> [-l <limit>]`                  |                                                    |
| qshow                                |                                             |                                                    |
| [search](#search)                    | `<condition> [-l <limit>]`                  | return the records that match the criteria  |
| [set](#set-and-unset)                | `<field_name> <field_value>`                | set a field                                       |
| sequenceNumber                       | `<sequence_name>`                           |                                                    |
| [show](#show)                        |                                             | display the current record                         |
| [showKeys](#show-keys-indexes)       |                                             | display all indexes                                |
| [showTables](#show-tables-and-views) |                                             | display all tables in the schema                   |
| [showViews](#show-tables-and-views)  |                                             | display all views in the schema                    |
| [table](#table)                      | `<table_name>`                              | select an specified table                          |
| [unset](#set-and-unset)              | `<field>`                                   | set a field to `null`                             |
| [update](#update)                    | `<key_name>` `<fields>`                     | update the current row by key                     |
| [updateWhere](#updatewhere)          | `<condition> <assignments>`                 | update all records that matches a given condition |
| [view](#view)                        | `<view_name>`                               | select an specified view                           |
| writeMode                            |                                             | enable write mode                                 |

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

## Working with tables and views

Most of the time, you'll be using DbMon to examine tables or views in one way or another. Write operations are not allowed on views. 

### Show tables and views

To see a list of available tables or views, use the [`showTables`](#dbmon-commands) or the [`showViews`](#dbmon-commands) commands. This displays an alphabetical list of available tables or views, for example:

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

To look at the data held in a specific table, use the [`table`](#dbmon-commands) command followed by the table name: for example `table BROKER`. Once you have selected a table, the `DbMon` prompt changes to show the table name.

### View

To look at the data held in a specific view, use the [`view`](#dbmon-commands) command followed by the view name: for example `view BROKER`. Once you have selected a view, the `DbMon` prompt changes to show the view name.

```javascript
DbMon>table BROKER
DbMon:BROKER>
```

### Show

To see the columns available in the selected table or view, use the [`show`](#dbmon-commands) command. This displays the current record in the selected table or view. If no record has been selected, it displays an empty record (notice the value column in the example below is not populated):

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

Any subsequent [`show`](#dbmon-commands) commands will only display those columns, rather than all the columns in the table/view.


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

To discover how many rows of data there are in a table or view, use the [`count`](#dbmon-commands) command. For large database entities, this could take some time to return:

```javascript
DbMon:BROKER>count
The table BROKER contains 114 records
```

### Set and Unset
Use the `set` and `unset` commands to set the value of a specific field in the selected database entity. If you have previously selected a record, it will overwrite its value; otherwise, it sets a new record (note that this is only local - to insert a new record to the table, use the insert command). In the case of the `set` command, specify the value you want to set. In the example below, we set a new value for the `QUANTITY` field:

``` javascript
DbMon:TRADE>set QUANTITY = 10
```

To set the value to **null**, use the `unset` command, for example:

``` javascript
DbMon:TRADE>unset QUANTITY 
```

:::tip
Changes performed by `set` and `unset` will not be reflected in the database unless you use `insert` with `writeMode`.
:::

### Insert

To insert a new record into the database, use the `insert` command. This inserts a new record based on the current record selected. Before you insert this new record, you must enable `writeMode`. 

In the example below, we use the `set` command to create a new record before inserting it into the database.

``` javascript
DbMon:TRADE>set PRICE 80
DbMon:TRADE>set QUANTITY 70
DbMon:TRADE>set TRADE_ID DbMonTest
DbMon:TRADE>show
==================================
TRADE
==================================
Field Name                               Value                                    Type                
===========================================================================================
TIMESTAMP                                                                         NANO_TIMESTAMP      
COUNTERPARTY_ID                          1                                        STRING              
DIRECTION                                BUY                                      ENUM[BUY SELL]      
ENTERED_BY                               JaneDee                                  STRING              
INSTRUMENT_ID                            1                                        STRING              
PRICE                                    80.0                                     DOUBLE              
QUANTITY                                 70                                       INT                 
SYMBOL                                   EUR                                      STRING              
TRADE_DATE                                                                        DATE                
TRADE_ID                                 DbMonTest                                STRING              
TRADE_STATUS                             NEW                                      ENUM[NEW ALLOCATED CANCELLED]
DbMon:TRADE>insert
Are you sure you wish to execute the command? Y/N
y
Record saved
```

### Delete rows

To delete a row from a table manually using DbMon, use the `delete` or `deleteWhere` command. before you perform a delete operation, you must run `writeMode` to enable write mode.

#### Delete

Use the `delete` command to delete the selected record in the selected table. The example below deletes the last record in the **TRADE** table:

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>delete
Are you sure you wish to execute the command? Y/N
y
Record deleted
```
:::note
To be able to use this command, you need to be in `writeMode`.
:::

#### deleteWhere

The `deleteWhere` command finds all records that match the specified criteria in the currently selected table. Before deleting, it asks you to confirm the deletion.

In the example below, the currently selected table is **TRADE**. We delete all records that have a **QUANTITY** value greater than 100.

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>deleteWhere QUANTITY > 100
Are you sure you wish to execute the command? Y/N
y
Deleted record: DbRecord [tableName=TRADE] [PRICE = 9.0, SYMBOL = EUR, QUANTITY = 888, DIRECTION = BUY, TIMESTAMP = 2023-08-15 12:09:55.422(n:0,s:119) (7097187651224076407), TRADE_DATE = null, RECORD_ID = 7097187651224076407, COUNTERPARTY_ID = 3, TRADE_ID = 3aa96a32-0fdb-47e1-b96b-243dfa265e5cTRLO1, TRADE_STATUS = NEW, INSTRUMENT_ID = 1, ENTERED_BY = JaneDee, ]
Deleted record: DbRecord [tableName=TRADE] [PRICE = 76.0, SYMBOL = EUR, QUANTITY = 888, DIRECTION = BUY, TIMESTAMP = 2023-08-15 12:09:52.163(n:0,s:116) (7097187637554839668), TRADE_DATE = null, RECORD_ID = 7097187637554839668, COUNTERPARTY_ID = 3, TRADE_ID = 0750ffa9-f080-4256-b0e4-efa0369d089cTRLO1, TRADE_STATUS = NEW, INSTRUMENT_ID = 1, ENTERED_BY = JaneDee, ]
2 records deleted
```

:::note
To be able to use this command, you need to be in `writeMode`.
:::

### Update rows
To perform an update in the database manually using DbMon, use the `update` or `updateWhere` command. Note that to perform an update operation, you must first run `writeMode` to enable write mode.

#### Update
The `update` command updates the given fields in the selected row of the currently selected table. Use the commands `set` and `unset` to manipulate the selected row before you run `update`. To use `update`, you must provide a `key_name`. In the example below, **TRADE** is the currently selected table. We use the `set` command to set the PRICE field to 50, and then `update` command to update the TRADE_BY_UPDATE_PRICE.

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>set PRICE 50
DbMon:TRADE>update TRADE_BY_ID PRICE
Are you sure you wish to execute the command? Y/N
y
Record updated
```

#### UpdateWhere
Use the `updateWhere` command to update all records that match specific criteria. After the confirmation, it will prompt all the records that have been updated.

Here is an example of how to use `updateWhere`. In this example, we are updating the `QUANTITY` value to 10 to all records in **TRADE** with `id = genesis1`.

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>updateWhere TRADE_ID=="genesis1" QUANTITY=10
Are you sure you wish to execute the command? Y/N
y
Updated record: DbRecord [tableName=TRADE] [PRICE = 90.0, SYMBOL = EUR, QUANTITY = 10, DIRECTION = BUY, TIMESTAMP = 2023-08-15 19:14:01.488(n:0,s:104) (7097294379760484456), TRADE_DATE = null, RECORD_ID = 7097293333759787097, COUNTERPARTY_ID = 1, TRADE_STATUS = NEW, TRADE_ID = genesis1, INSTRUMENT_ID = 1, ENTERED_BY = JaneDee, ]
1 records updated
```
:::note
To be able to use this command, you need to be in `writeMode`.
:::

## Finding data in a table or view

### Find

In DbMon, you can only see one record at a time. To display the record you want, you must first locate it using the [`find`](#dbmon-commands) command, which searches the table’s or view’s indexes for a given key value.  

### Show keys (indexes)

To see the indexes (or keys) on the selected table/view, use the [`showKeys`](#dbmon-commands) command. This displays a list of the index names and the fields you will need to supply to use the index:

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
### First and Last
If you are interested in selecting the `first` or the `last` record, you can use the `first` or `last` along with the index name. After selecting a record, to be able to see it in the dbmon, you need to run the `show` command. In the following example, we are going to select the first record in the **TRADE** table using the index **TRADE_BY_ID**, although we could perform the same operation using a view index.

```javascript
DbMon:TRADE>first TRADE_BY_ID
DbMon:TRADE>show
==================================
TRADE
==================================
Field Name                               Value                                    Type                
===========================================================================================
TIMESTAMP                                2023-08-15 12:09:47.802(n:0,s:112)       NANO_TIMESTAMP      
COUNTERPARTY_ID                          3                                        STRING              
DIRECTION                                BUY                                      ENUM[BUY SELL]      
ENTERED_BY                               JaneDee                                  STRING              
INSTRUMENT_ID                            1                                        STRING              
PRICE                                    76.0                                     DOUBLE              
QUANTITY                                 99                                       INT                 
SYMBOL                                   EUR                                      STRING              
TRADE_DATE                                                                        DATE                
TRADE_ID                                 0350e01b-7064-4c60-8bcc-6084b6bee342T... STRING              
TRADE_STATUS                             NEW                                      ENUM[NEW ALLOCATED CANCELLED]
```
### Next

You can alo use the `next` command to select the next record in the sequence. Here is an example:

```javascript
DbMon:TRADE>next TRADE_BY_ID
DbMon:TRADE>show
==================================
TRADE
==================================
Field Name                               Value                                    Type                
===========================================================================================
TIMESTAMP                                2023-08-15 12:09:10.992(n:0,s:103)       NANO_TIMESTAMP      
COUNTERPARTY_ID                          3                                        STRING              
DIRECTION                                BUY                                      ENUM[BUY SELL]      
ENTERED_BY                               JaneDee                                  STRING              
INSTRUMENT_ID                            1                                        STRING              
PRICE                                    76.0                                     DOUBLE              
QUANTITY                                 99                                       INT                 
SYMBOL                                   EUR                                      STRING              
TRADE_DATE                                                                        DATE                
TRADE_ID                                 a4ce9a4c-21e1-416c-ae48-401eeef3f3b9T... STRING              
TRADE_STATUS                             NEW                                      ENUM[NEW ALLOCATED CANCELLED]
```
### Displaying a record - Set

To display a particular record from a table or view, use the [`set`](#dbmon-commands) command to populate an index field with the value you are searching for. Then use the [`find`](#dbmon-commands) command along with the appropriate index name.

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

To do this, use the [`clear`](#dbmon-commands) command.This resets your prompt onto the table or view so that you can start again. 

:::note
The [`clear`](#dbmon-commands) command does not have any effect on the data itself, just on your “window” into the database.
:::

### Search

If you wish to look for a record (or a number of records) but your criterion does not match an index on the database entity, you can use the [`search`](#dbmon-commands) command.

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

To string criteria together, use || for logical OR and && for logical AND. For example, if you want to [`search`](#dbmon-commands) for any `BROKER` where the `COUNTRY_CODE` is USA or IRL:

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
```

#### Using the distinct command

```jsx
// if MODIFIED_DATE is 2022-10-08 14:20:17.400 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE=="20221008-14:20:17.400"

// if MODIFIED_DATE is 2022-10-08 14:20:17 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE>"20221008-14:20:17" && IS_ACTIVE=='true'

// if MODIFIED_DATE is 2022-10-08 14:20 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE<"20221008-14:20" || IS_ACTIVE=='true'

// if MODIFIED_DATE is 2022-10-08 in database 
DbMon:BROKER>distinct BROKER_ID -where MODIFIED_DATE=="20221008"
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

```jsx
DbMon:BROKER>distinct COUNTRY_CODE -where REGION=='UK'&&COUNTRY_CODE!='GBR'
Distinct Value                           Count
===========================================================================================
[null]                                   8    
-------------------------------------------------------------------------------------------
Total Results:  8
Total Distinct Values Count:  1
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
