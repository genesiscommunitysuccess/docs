---
title: 'SQL'
sidebar_label: 'SQL'
id: sql
---


## System definitions
For the SQL layer (PostgreSQL or MSSQL), take note of the following system definition items in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:


| Setting   | Description   |  
|----------|-------------|
| `DbHost` | This must be the JDBC URL needed to connect to the SQL database. We accept JDBC URL formats for PostgreSQL and MSSQL. This JDBC URL will contain other important information, such as port and target database name. |
| `DbUsername` | This must be the db username. |  
| `DbPassword` | This must be the db password.|
|`DbSqlConnectionPoolSize`.| This sets the maximum number of SQL connections to be held by the SQL connection pool. |  
| `DbQuotedIdentifiers` | If set to true, all SQL tables and fields will be queried using quotes for each identifier to avoid potential name clashes. For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1`.|  
