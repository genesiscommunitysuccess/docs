---
sidebar_label: 'Database'
---

# Setting the database technology

We support the following database technology:

* FoundationDB
* PostgreSQL
* Aerospike

Because we abstract from the underlying technology, you can easily toggle between any of these three.

There are also tools that enable you to stream real-time data reliably to and from any classic Oracle/SQL database.

:::danger WIP
( add a link to the Integration section)
:::

By default, FoundationDB is installed on the platform. If you need to use a PostgreSQL or Aerospike database, follow the steps below. 

## Changing to PostgreSQL.
In this case, we have assumed you have installed the platform using the name octopus.

1.	Edit the file **~/run/site-specific/cfg/genesis-system-definition.kts**. Before you start, make sure you know the JDBC connection string for the database, which specifies the host, the user name and password.
2.	Run **genesisInstall** to activate the new configuration.
3.	Run **remap --commit** to create new default tables in PostgreSQL format.

## 1. Edit the system configuration file
The file is located at: 
```
~/run/site-specific/cfg/genesis-system-definition.kts
```
![db edit kts 1](https://files.document360.io/82b38d6b-46dd-48c3-a583-c5981a5c6537/Images/Documentation/db%20edit%20kts%201.png){height="" width=""}


You need to make two changes.
First, go to the line item for **DbLayer** and change the **value** from **FDB** to **SQL**. This informs the system that you are using PostgreSQL.
![db edit kts 4 with highlight](https://files.document360.io/82b38d6b-46dd-48c3-a583-c5981a5c6537/Images/Documentation/db%20edit%20kts%204%20with%20highlight.png){height="" width=""}


Then, insert a line in the **hosts** block to identify the JDBC connection string for the database. This points the system to the local PostgreSQL server. For example:
```
item(name = “DbHost”, value = “jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432”)
```
 

![db edit kts 5 with highlight](https://files.document360.io/82b38d6b-46dd-48c3-a583-c5981a5c6537/Images/Documentation/db%20edit%20kts%205%20with%20highlight.png){height="" width=""}


## 2. Activate the new configuration
Run **genesisInstall**. 

## 3. Create new default table structures
Run **remap --commit**.

## Start the server and check 
When those three steps have been completed, run **startServer** to start all the processes.
On completion, run **mon**, and you can see the processes running. You have successfully completed the change.
 

![db edit kts 7 mon final](https://files.document360.io/82b38d6b-46dd-48c3-a583-c5981a5c6537/Images/Documentation/db%20edit%20kts%207%20mon%20final.png){height="" width=""}
