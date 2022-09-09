---
title: 'Microsoft SQL Server'
sidebar_label: 'Microsoft SQL Server'
id: mssql
sidebar_position: 3
---

:::note
CDC capabilities are only supported by MS SQL Server 2016 and later Standard and Enterprise editions. Ensure that your MS SQL instance is the Standard or Enterprise version before continuing.
:::

### Enable the SQL server agent

#### MS SQL in Docker

When using an MS SQL docker image, pass the environment variable `MSSQL_AGENT_ENABLED=true` on startup to ensure that the SQL agent is running.

#### Remote shell on running instance

Remote into the instance and open a bash terminal as the root user. Enable the agent via the following:

```bash
/opt/mssql/bin/mssql-conf set sqlagent.enabled true
```

#### SQL Server Management Studio

Use the following documentation to [Start, Stop, or Pause the Service](https://docs.microsoft.com/en-us/sql/ssms/agent/start-stop-or-pause-the-sql-server-agent-service?view=sql-server-ver16).

### Create a database

For CDC to occur, you must have a database within your MS SQL Sever instance.

```sql
CREATE DATABASE TestDB
```

### Enable CDC on the database

Using [Transact-SQL](https://docs.microsoft.com/en-us/sql/ssms/scripting/sqlcmd-run-transact-sql-script-files?view=sql-server-ver16), insuring you are a member of sysadmin; you are a db_owner of the database and the SQL Server Agent is running, run the following:

```sql
USE MyDB
GO
EXEC sys.sp_cdc_enable_db
GO
```

For more information on how to execute [Transact-SQL](https://docs.microsoft.com/en-us/sql/ssms/scripting/sqlcmd-run-transact-sql-script-files?view=sql-server-ver16) queries, look [here](https://docs.microsoft.com/en-us/sql/ssms/scripting/sqlcmd-run-transact-sql-script-files?view=sql-server-ver16).

Once successful, you should see a schema with name `cdc` and the `CDC` user, metadata tables and other system objects.

:::note
The SQL Server CDC feature processes changes that occur in user-created tables only. You cannot enable CDC on the SQL Server master database.
:::

### Create a table

Simple SQL:

```sql
CREATE TABLE accounts (user_id int PRIMARY KEY,username varchar ( 50 ) UNIQUE NOT NULL,password varchar ( 50 ) NOT NULL,email varchar ( 255 ) UNIQUE NOT NULL)
```

### Enable CDC on the table

Using [Transact-SQL](https://docs.microsoft.com/en-us/sql/ssms/scripting/sqlcmd-run-transact-sql-script-files?view=sql-server-ver16), insuring you have the db_owner role and the SQL Server Agent is running, run the following:

```sql
USE MyDB
GO

EXEC sys.sp_cdc_enable_table
@source_schema = N'dbo',
@source_name   = N'accounts',
@role_name     = N'sa',
// @filegroup_name = N'MyDB_CT', - Set to null (or don't set) and the default 
//                                 filegroup will be used
@supports_net_changes = 0
GO
```

### Verify that the user has access to CDC table

An optional step; Run the following stored procedure using Transact-SQL. Ensure that the response is not empty.

```sql
USE MyDB;
GO
EXEC sys.sp_cdc_help_change_data_capture
GO
```
