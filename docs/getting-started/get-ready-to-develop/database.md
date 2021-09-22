---
id: database
sidebar_label: Setting the database technology
sidebar_position: 3
title: Setting the database technology

---
We support the following database technology:

* FoundationDB
* PostgreSQL
* Aerospike

Because we abstract from the underlying technology, you can easily toggle between any of these three.

There are also tools that enable you to stream real-time data reliably to and from any classic Oracle/SQL database.

<!--- ideally, link to DbtoGenesis here  --->

By default, FoundationDB is installed on the platform. If you need to use a PostgreSQL or Aerospike database, follow the steps below.

## Changing to PostgreSQL or Aerospike

### 1. Edit the system configuration file

Edit the file **\~/run/site-specific/cfg/genesis-system-definition.kts**. Before you start, make sure you know the JDBC connection string for the database, which specifies the host, the user name and password.

You need to make two changes.

First, go to the line item for **DbLayer** and change the **value** from **FDB** to **SQL** (for PostgreSQL) or **AEROSPIKE**.

![](/img/change-to-sql.png)

Then, insert a line in the **hosts** block to identify the JDBC connection string for the database. This points the system to the local PostgreSQL or Aerospike server. For example:

```kotlin
item(name = “DbHost”, value = “jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432”)
```

![](/img/jdbc-identifer-added.png)

### 2. Activate the new configuration

Run `genesisInstall`.

### 3. Create new default table structures

Run `remap --commit`. This populates the database server with table structures.

### Start the server and check

When those three steps have been completed, run `startServer` to start all the processes.

On completion, run `mon`, and you can see the processes running. You have successfully completed the change.

![](/img/mon-processes-running.png)