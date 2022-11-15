---
title: 'Server configuration - database technology'
sidebar_label: 'Setting the database technology'
id: setting-the-database-technology
keywords: [server, configuration, database technology]
tags:
  - server
  - configuration
  - database technology
---


The Genesis low-code platform supports the following database technology:

* FoundationDB
* Postgres (PostgreSQL)
* MSSQL
* Aerospike

Because we abstract from the underlying technology, you can easily toggle between any of these four.

There are also tools that enable you to stream real-time data reliably to and from any classic [Oracle/SQL database](/database/database-technology/sql/).

By default, FoundationDB is installed on the platform. If you need to use another supported database, follow the steps below.

## Changing the database technology

### 1. Edit the system configuration file

Edit the [system definition file](/server/configuring-runtime/system-definitions/): **\~/run/site-specific/cfg/genesis-system-definition.kts**. Before you start, make sure you know the JDBC connection string for the database, which specifies the host, the username and password.

You need to make two changes.

First, go to the line item for **DbLayer** and change the **value** from **FDB** to **SQL** (for Postgres and MSSQL) or **Aerospike**.

```kotlin
systemDefinition {
    global {
        item(name = "MqLayer", value = "ZeroMQ")
        item(name = "DbLayer", value = "SQL")
        item(name = "DictionarySource", value = "DB")

```


Then, insert a line in the **hosts** block to identify the JDBC connection string for the database. This points the system to the local Postgres, MSSQL or Aerospike server. For example:

```kotlin
item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432")
```

Here is the example in place:

```kotlin
systems {
        system(name = "DEV") {
            hosts {
                host(name = "genesis-serv")
            }

            item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432")
            item(name = "DbNamespace", value = "genesis")
            item(name = "ClusterPort", value = "6000")
            item(name = "Location", value = "LO")
            item(name = "LogFramework", value = "LOG4J2")
            item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        }
    }
```

For Aerospike, you might also want to update the **DbNamespace** and **DbMode** properties in the [system definition file](/server/configuring-runtime/system-definitions/). 

If you are using Postgres and you want to use a reserved keyword as a column name, then you need to add the setting below to your system definition file. This enables Quoted Identifiers to be used:

```kotlin
item(name = "DbQuotedIdentifiers", value = "true")
```

### 2. Activate the new configuration

Run `genesisInstall`.

### 3. Create new default table structures

Run `remap --commit`. This populates the database server with table structures.

### 4. Start the server and check

When those three steps have been completed, run `startServer` to start all the processes.

On completion, run `mon`, and you can see the processes running. You have successfully completed the change.

![](/img/mon-processes-running.png)
