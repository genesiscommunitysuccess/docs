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

## Getting into DBMon

In order to run queries in the database, we will need to run `DbMon`. In order to get into DBMon please run the following command, filling in the correct application name:

`./gradlew :jvm:[application-name]:DbMon`

## Using DBMon

In this section we will give you some practical examples of how to use DBMon.

### DbMon script

This script enables you to navigate through the database tables from the command line.

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
