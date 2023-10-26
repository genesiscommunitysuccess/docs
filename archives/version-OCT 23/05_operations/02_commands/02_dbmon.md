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

DbMon is the Genesis database client. It provides a set of commands that enable you to view and change the database as necessary. DbMon hides the details of the specific database technology, so this does not affect your usage. 

You can use Generic database clients to work with the Genesis low-code platform, but we recommend that you use DbMon. 

This page gives details of all the DbMon commands and provides practical examples of how you can use them.


## Starting DbMon

To start a DbMon session, first switch to the user that owns the Genesis installation. Then type `DbMon` at the command prompt:

```javascript
[titian] /home/titian >DbMon

==================================
Genesis database Monitor
Enter 'help' for a list of commands
==================================
DbMon>
```

As you can see, once you are in a DbMon session, the `DbMon>` prompt is displayed:

## Exiting DbMon

To end a DbMon session, just type [`quit`](#dbmon-commands) at the `DbMon>` prompt.

## Finding and viewing information

A Genesis database organises information in tables and views. DbMon enables you to: 

- find all the tables in your database (`showTables`)
- select a table to examine (`table`)
- find all the views in your database (`showViews`)
- select a view to examine (`view`)


The [`showTables`](#dbmon-commands) and [`showViews`](#dbmon-commands) commands display an alphabetical list of available tables or views. For example, here we have used the command `showTables`:

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
<<List continues...>>
```

### Selecting a table

To look at the data held in a specific table, use the [`table`](#dbmon-commands) command followed by the table name: for example `table BROKER`. Once you have selected a table, the `DbMon` prompt changes to show the table name.

```javascript
DbMon>table BROKER
DbMon:BROKER>
```

### Selecting a view

To look at the data held in a specific view, use the [`view`](#dbmon-commands) command followed by the view name: for example `view BROKER_VIEW`. Once you have selected a view, the `DbMon` prompt changes to show the view name.

```javascript
DbMon>view BROKER_VIEW
DbMon:BROKER_VIEW>
```

### Viewing the columns in a table or view

To see the columns in the currently selected table or view, use the [`show`](#dbmon-commands) command. This displays the columns (fields) for the current record. If you haven't already retrieved a specific record, the Value column will be empty (as you can see in the example below):

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

### Viewing selected columns

If you are only interested in seeing selected columns, use the [`displayFields`](#dbmon-commands) command and list the names of the columns you are interested in (separated by spaces). 

While you continue to work on the selected table or view, subsequent [`show`](#dbmon-commands) commands will only display those columns. To view all the columns again, use the [`displayFields`](#dbmon-commands) command followed by no column names.

In the example below, we have used `displayFields` to view four specific columns:

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

### Finding and viewing a specific record

In DbMon you can only see one record at a time.

To display the record you want, use the `find` command, which searches the table’s indices for a given key value.  

So you need to know what the indices (keys) are for the currently selected table or view; for this, use the `showKeys` command. This lists each key (index), along with the field name you need to supply to use the index.  In the example below, the BROKER table has a primary index (BROKER_BY_ID, where the relevant field is BROKER_ID) and three secondary indices.

```javascript
DbMon:BROKER>showKeys
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

Now that you know the indices and the fields they require, you can find a record in the table or view.

The example below looks for a broker that has a `VIEW_CODE` value of `WALSH`. 

1. The [`set`](#dbmon-commands) command sets the value of the `VIEW_CODE` to the value `WALSH`. _This is a local setting; it does not change the database._
2. The [`find`]](#dbmon-commands) command looks for the index (key) `BROKER_BY_VIEW_CODE`.
3. The [`show`]](#dbmon-commands) command displays the result.

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

If you then want to find a record with a different `VIEW_CODE`, use the [`clear`](#dbmon-commands) command to clear the record. You can then use [`set`](#dbmon-commands) and [`find`](#dbmon-commands) commands to locate the new record.

_The `clear` command does not change the database._

## Searching for one or more records
To look for a record (or a number of records) without using an index (key), use the [`search`](#dbmon-commands) command. This lists all the records that match the criteria that you supply.

:::warning
For larger tables, this can be slow and could cause latency to users of your application.
:::

For example, to find all the records in the BROKER table where the COUNTRY_CODE is IRL:

```javascript
DbMon:BROKER>search COUNTRY_CODE=='IRL'
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

The example above found only one record, so it displayed it. If there are multiple records that match the search criteria, these are listed one after the other on the screen. 

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
```
To limit the number of results, you can supply the limit (-l) parameter to the [`search`](#dbmon-commands) command. In the example below, we repeat the previous search, but limit the number of results to the first three. 

```javascript
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

To join criteria together, use || for logical OR and && for logical AND. For example, if you want to [`search`](#dbmon-commands) for any `BROKER` where the `COUNTRY_CODE` is USA or IRL:

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

### Searching with wildcards

You can search using the * wildcard. Note that this might be quite slow if running against a large dataset. For example:

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

### Searching for a date or datetime

When setting a DATE, the format must be specified as follows:

- DATE_FORMAT = "yyyyMMdd"

When setting a DATETIME, the format must be specified as follows:

- DateTime with milliseconds precision: DATETIME_FORMAT = "yyyyMMdd-HH:mm:ss.SSS"
- DateTime with seconds precision: DATETIME_FORMAT = "yyyyMMdd-HH:mm:ss"
- DateTime with minutes precision: DATETIME_FORMAT = "yyyyMMdd-HH:mm"

Here are some examples of searches for datetimes and dates:

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

### Counting rows (records)

To discover how many rows of data there are in the currently selected table or view, use the [`count`](#dbmon-commands) command. For large database entities, this could take some time to return:

```javascript
DbMon:BROKER>count
The table BROKER contains 114 records
```

### Finding distinct records

The `distinct` command provides another useful way of searching. Here are some examples of searches that use the distinct command to find records with a specific field value, which were modified at a specific date or datetime:

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

The `distinct` command is also useful for counting records with specific characteristics.

In the example below, the [`distinct`](#dbmon-commands) command is used to find out how many `BROKER` records there are for each unique `COUNTRY_CODE`.

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

The next example retrieves the count of unique `COUNTRY_CODE` for `BROKER` records that have a `REGION` of UK, but which do not have the value of `GBP` for `COUNTRY_CODE`:

```jsx
DbMon:BROKER>distinct COUNTRY_CODE -where REGION=='UK'&&COUNTRY_CODE!='GBR'
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
So, what has this found?

- At the bottom, the Total Results is 8. There are 8 records where the region is UK but the country code is not GBR.
- The Distinct Values is 6. There are 6 Country Codes where the region is UK, but whose country code is not GBR. These are the six rows displayed.
 
Note that there is no validation of the field when you use the `distinct` command. So if we ran the previous example, but we incorrectly typed `COUNTRY_COD` instead of `COUNTRY_CODE`. The command would still work, but the result is potentially confusing.

```jsx
DbMon:BROKER>distinct COUNTRY_COD -where REGION=='UK'&&COUNTRY_CODE!='GBR'
Distinct Value                           Count
===========================================================================================
[null]                                   8
-------------------------------------------------------------------------------------------
Total Results:  8
Total Distinct Values Count:  1
```

So, what happened there?

- There are no instances of `Country_COD`, so the only Distinct Value is [null].
- However, the count is still 8 for this line, because there are 8 records where the region is UK but the country code is not GBR.
- The Total Results value is the sum of the counts: 8. If your field was invalid, then the Total Results will always equal the count because there is only one value found - null.
- The Total Distinct Values Count is effectively the number of rows: 1. Only one value was found  - null.
 
### Finding the first and last record
If you are interested in selecting the `first` or the `last` record, you can use the `first` or `last` along with the index name. You need to run the `show` command to view that record. 

In the following example, we select the first record in the **TRADE** table using the index **TRADE_BY_ID**; we then use `show` to see the record.

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
### Displaying the next record

To view the next record in the currently selected table or view, use the `next` command and then the `show` command. With the `next` command, you must always specify a valid index for the table.

The following example displays the next record in the currently selected table (TRADE), where the index is TRADE_BY_ID.

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

## Changing the database

Whenever you make a change to the database, you must use first the command `writeMode`. This is designed to protect the database against casual or unintended changes.

To change a field value in a record:

1. Find the table or view that the field belongs to.
2. Select that table or view.
3. Find and show the record that you want to change.
4. Set the value of the field.
5. Run `writeMode`.
6. Insert the new value.


### Changing the value of a field
The `set` command enables you to set the value of a specific field in the record you are viewing from the currently selected table or view. You need to set the value before you write to the database. The `set` command itself does not change the database. This protects the database from casual changes.

In the example below, we are viewing a record in the **TRADE** table. The command sets a new value for the `QUANTITY` field:

``` javascript
DbMon:TRADE>set QUANTITY 10
```
In the example below, we are viewing the **TRADE** table. We set new values for the `PRICE` and `QUANTITY` fields:

``` javascript
DbMon:TRADE>set PRICE,QUANTITY 523.1,9000
```

To set a value to **null**, use the `unset` command, for example:

``` javascript
DbMon:TRADE>unset QUANTITY 
```

:::
The `set` and `unset` commands themselves do not change the database.
:::
### Inserting a new record

To insert a new record into a table in the database, use the `insert` command. You will always be asked to confirm the command.

1. Find and select the required table or view, and show the fields.
2. Set the values of the required fields.
3. Enable `writeMode`.
4. Insert. 

In the example below, we use the `set` command to create a new record before inserting it into the TRADE table of the database.

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

:::
The `insert` command always inserts a new record with the values you have set. It does not (and cannot) change any existing record. You can only change an existing record using the `update` command.
:::

### Deleting rows

To delete a row from a table, use the `delete` command. 

1. Find the record you need to delete.
2. Run `writeMode` to enable write mode.
3. Run `delete`.

:::warning
If you do not select a record, the command deletes the last record in the table.
:::

The example below deletes the last record in the **TRADE** table:

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>delete
Are you sure you wish to execute the command? Y/N
y
Record deleted
```

### deleteWhere

The `deleteWhere` command finds all records that match the specified criteria in the currently selected table, and deletes them. You are always prompted to confirm that you wish to execute the command.

1. Find and select the required table or view.
2. Enable `writeMode`.
3. Run `deleteWhere`.

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

### Updating rows

The `update` command updates the specified fields in the selected row of the currently selected table. You must provide a `key_name`. You will always be prompted to confirm the update.

1. Find and select the required table or view.
2. Find and select the record that you want to update.
3. Enable `writeMode`.
5. Set the values of the required fields.
4. Update. 

In the example below, **TRADE** is the currently selected table. We use the `set` command to set the PRICE field to 50, and then `update` command to update the TRADE_BY_UPDATE_PRICE.

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>set PRICE 50
DbMon:TRADE>update TRADE_BY_ID PRICE
Are you sure you wish to execute the command? Y/N
y
Record updated
```

### UpdateWhere
Use the `updateWhere` command to update all records in the current table or view, which match specific criteria. You will always be prompted to confirm the update.

1. Find and select the required table or view.
2. Enable `writeMode`.
3. Run `updateWhere`.

Here is an example of how to use `updateWhere`. In this example, we are updating the `QUANTITY` value to 10 for all records in **TRADE** with `id = genesis1`.

```javascript
DbMon:TRADE>writeMode
DbMon:TRADE>updateWhere TRADE_ID=="genesis1" QUANTITY=10
Are you sure you wish to execute the command? Y/N
y
Updated record: DbRecord [tableName=TRADE] [PRICE = 90.0, SYMBOL = EUR, QUANTITY = 10, DIRECTION = BUY, TIMESTAMP = 2023-08-15 19:14:01.488(n:0,s:104) (7097294379760484456), TRADE_DATE = null, RECORD_ID = 7097293333759787097, COUNTERPARTY_ID = 1, TRADE_STATUS = NEW, TRADE_ID = genesis1, INSTRUMENT_ID = 1, ENTERED_BY = JaneDee, ]
1 records updated
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

## DbMon commands

Here is a full list of DbMon commands and their arguments.

| Command                              | Argument                                    | Description                                       |
|--------------------------------------|---------------------------------------------|---------------------------------------------------|
| autoIncrementNumber                  | `<field_name>`                              |                                                   |
| [clear](#displaying-a-record---set)  |                                             | clear the current context                         |
| [count](#count-rows)                 |                                             | count the rows in the table/view                  |
| [delete](#delete)                    |                                             | delete the current row                            |
| [deleteWhere](#deletewhere)          | `<condition>`                               | delete all matching rows in the selected table    |
| [distinct](#distinct)                | `<condition> [-where <limiting_condition>]` | show only distinct records                        |
| [displayFields](#display-fields)     | `<field_names>`                             | display only selected columns                     |
| [find](#find)                        | `<key_name>`                                | find a specific record in a index                 |
| forceAutoIncrementNumber             | `<field_name> <sequence_number>`            |                                                   |
| forceSequenceNumber                  | `<sequence_name> <sequence_number>`         |                                                   |
| [first](#first-and-last)             | `<key_name>`                                | get the first record by key                       |
| help                                 |                                             | list all commands                                 |
| [insert](#insert)                    |                                             | insert the current                                |
| [last](#first-and-last)              | `<key_name>`                                | get the last record by key                        |
| listAll                              | `<key_name> <num_key_fields> <max_records>` |                                                   |
| [next](#next)                        | `<key_name>`                                | get the next record by key                        |
| qsearch                              | `<condition> [-l <limit>]`                  |                                                   |
| qshow                                |                                             |                                                   |
| [search](#search)                    | `<condition> [-l <limit>]`                  | return the records that match the criteria        |
| [set](#set-and-unset)                | `<field_name> <field_value>`                | set a field                                       |
| sequenceNumber                       | `<sequence_name>`                           |                                                   |
| [show](#show)                        |                                             | display the current record                        |
| [showKeys](#show-keys-indexes)       |                                             | display all indexes                               |
| [showTables](#show-tables-and-views) |                                             | display all tables in the schema                  |
| [showViews](#show-tables-and-views)  |                                             | display all views in the schema                   |
| [table](#table)                      | `<table_name>`                              | select an specified table                         |
| [unset](#set-and-unset)              | `<field>`                                   | set a field to `null`                             |
| [update](#update)                    | `<key_name>` `<fields>`                     | update the current row by key                     |
| [updateWhere](#updatewhere)          | `<condition> <assignments>`                 | update all records that matches a given condition |
| [view](#view)                        | `<view_name>`                               | select an specified view                          |
| writeMode                            |                                             | enable write mode                                 |

