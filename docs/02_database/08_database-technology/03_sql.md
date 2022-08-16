---
title: 'SQL'
sidebar_label: 'SQL'
id: sql
---

[Introduction](/database/database-technology/overview/) |
[FoundationDb](/database/database-technology/foundationdb/) | [SQL](/database/database-technology/sql/) | [Aerospike](/database/database-technology/aerospike/) |  [PostgreSQL](/database/database-technology/postgresql/) | [FAQs](/database/database-technology/faqs/) 

## System definitions
For the SQL layer (PostgreSQL, MSSQL or Oracle), take note of the following system definition items in the [**genesis-system-definitions.kts**](/database/database-technology/sql/) file:


| Setting   | Description   |  
|----------|-------------|
| `DbHost` | This must be the JDBC URL needed to connect to the SQL database. We accept JDBC URL formats for PostgreSQL and MSSQL. This JDBC URL will contain other important information, such as port and target database name. |
| `DbUsername` | This must be the db username. |  
| `DbPassword` | This must be the db password.|
|`DbSqlConnectionPoolSize`.| This sets the maximum number of SQL connections to be held by the SQL connection pool. |  
| `DbQuotedIdentifiers` | If set to true, all SQL tables and fields will be queried using quotes for each identifier to avoid potential name clashes. For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1`.|  
